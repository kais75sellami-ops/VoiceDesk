use base64::{engine::general_purpose, Engine as _};
use keyring::Entry;
use reqwest::blocking::Client;
use serde::{Deserialize, Serialize};
use tauri::AppHandle;
use tauri_plugin_dialog::DialogExt;

// ElevenLabs configuration
const SERVICE_NAME: &str = "VoiceDesk";
const USERNAME: &str = "elevenlabs_api_key";
// Using Kais voice ID
// TODO: Make voice_id selectable in settings
const VOICE_ID: &str = "podfxsRIe2hbXsMfBAMz";
const ELEVENLABS_API_URL: &str = "https://api.elevenlabs.io/v1/text-to-speech";

#[derive(Debug, Serialize, Deserialize)]
pub struct VoiceSettings {
    pub stability: f32,
    pub similarity_boost: f32,
    pub style: f32,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct GenerateTtsRequest {
    pub text: String,
    pub language: String,
    pub voice_settings: VoiceSettings,
}

#[derive(Debug, Serialize)]
pub struct ApiResponse<T> {
    pub success: bool,
    pub data: Option<T>,
    pub error: Option<String>,
}

impl<T> ApiResponse<T> {
    fn success(data: T) -> Self {
        ApiResponse {
            success: true,
            data: Some(data),
            error: None,
        }
    }

    fn error(error: String) -> Self {
        ApiResponse {
            success: false,
            data: None,
            error: Some(error),
        }
    }
}

/// Get the ElevenLabs API key from the system keyring
#[tauri::command]
pub fn get_api_key() -> ApiResponse<String> {
    match Entry::new(SERVICE_NAME, USERNAME) {
        Ok(entry) => match entry.get_password() {
            Ok(password) => ApiResponse::success(password),
            Err(_) => ApiResponse::error("Clé API introuvable. Veuillez la configurer dans Paramètres.".to_string()),
        },
        Err(e) => ApiResponse::error(format!("Erreur trousseau : {}", e)),
    }
}

/// Set the ElevenLabs API key in the system keyring
#[tauri::command]
pub fn set_api_key(api_key: String) -> ApiResponse<String> {
    if api_key.trim().is_empty() {
        return ApiResponse::error("La clé API ne peut pas être vide".to_string());
    }

    match Entry::new(SERVICE_NAME, USERNAME) {
        Ok(entry) => match entry.set_password(&api_key) {
            Ok(_) => ApiResponse::success("Clé API enregistrée avec succès".to_string()),
            Err(e) => ApiResponse::error(format!("Échec de l'enregistrement de la clé API : {}", e)),
        },
        Err(e) => ApiResponse::error(format!("Erreur trousseau : {}", e)),
    }
}

/// Generate TTS audio using ElevenLabs API
#[tauri::command]
pub async fn generate_tts(request: GenerateTtsRequest) -> ApiResponse<String> {
    // Validate input
    if request.text.trim().is_empty() {
        return ApiResponse::error("Le texte ne peut pas être vide".to_string());
    }

    if request.text.len() > 5000 {
        return ApiResponse::error("Le texte dépasse la longueur maximale de 5000 caractères".to_string());
    }

    // Get API key from keyring
    let api_key = match Entry::new(SERVICE_NAME, USERNAME) {
        Ok(entry) => match entry.get_password() {
            Ok(password) => password,
            Err(_) => {
                return ApiResponse::error(
                    "Clé API introuvable. Veuillez la configurer dans Paramètres.".to_string(),
                )
            }
        },
        Err(e) => return ApiResponse::error(format!("Erreur trousseau : {}", e)),
    };

    // Build request body with voice settings
    let body = serde_json::json!({
        "text": request.text,
        "model_id": "eleven_multilingual_v2",
        "output_format": "mp3_44100_128",
        "voice_settings": {
            "stability": request.voice_settings.stability,
            "similarity_boost": request.voice_settings.similarity_boost,
            "style": request.voice_settings.style,
        }
    });

    // Make API request
    let client = Client::new();
    let url = format!("{}/{}", ELEVENLABS_API_URL, VOICE_ID);

    match client
        .post(&url)
        .header("xi-api-key", api_key)
        .header("Content-Type", "application/json")
        .json(&body)
        .send()
    {
        Ok(response) => {
            let status = response.status();

            if status.is_success() {
                match response.bytes() {
                    Ok(bytes) => {
                        // Convert to base64 for transport to frontend
                        let base64_audio = general_purpose::STANDARD.encode(&bytes);
                        ApiResponse::success(base64_audio)
                    }
                    Err(e) => ApiResponse::error(format!("Échec de la lecture de la réponse : {}", e)),
                }
            } else if status == 401 {
                ApiResponse::error(
                    "Clé API invalide. Veuillez vérifier votre clé API ElevenLabs dans Paramètres."
                        .to_string(),
                )
            } else if status == 429 {
                ApiResponse::error(
                    "Limite de débit dépassée. Veuillez réessayer plus tard ou améliorer votre forfait ElevenLabs."
                        .to_string(),
                )
            } else {
                match response.text() {
                    Ok(text) => ApiResponse::error(format!("Erreur API ({}) : {}", status, text)),
                    Err(_) => ApiResponse::error(format!("Erreur API : {}", status)),
                }
            }
        }
        Err(e) => {
            if e.is_timeout() {
                ApiResponse::error("Délai d'attente dépassé. Veuillez vérifier votre connexion Internet.".to_string())
            } else if e.is_connect() {
                ApiResponse::error(
                    "Échec de la connexion. Veuillez vérifier votre connexion Internet.".to_string(),
                )
            } else {
                ApiResponse::error(format!("Erreur réseau : {}", e))
            }
        }
    }
}

/// Save audio file using native save dialog
#[tauri::command]
pub async fn save_audio_file(
    app: AppHandle,
    base64_audio: String,
    default_filename: String,
) -> ApiResponse<String> {
    // Decode base64 to bytes
    let audio_bytes = match general_purpose::STANDARD.decode(&base64_audio) {
        Ok(bytes) => bytes,
        Err(e) => return ApiResponse::error(format!("Échec du décodage des données audio : {}", e)),
    };

    // Show save dialog
    let dialog = app.dialog().file().set_file_name(&default_filename);

    match dialog.blocking_save_file() {
        Some(file_path) => {
            // Write file
            let path_buf = file_path.as_path().unwrap();
            match std::fs::write(path_buf, audio_bytes) {
                Ok(_) => ApiResponse::success(format!(
                    "Fichier enregistré avec succès : {}",
                    path_buf.display()
                )),
                Err(e) => ApiResponse::error(format!("Échec de l'enregistrement du fichier : {}", e)),
            }
        }
        None => ApiResponse::error("Enregistrement annulé".to_string()),
    }
}
