// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod commands;
use commands::{generate_tts, get_api_key, save_audio_file, set_api_key};

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .invoke_handler(tauri::generate_handler![
            get_api_key,
            set_api_key,
            generate_tts,
            save_audio_file
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
