import { useState, useEffect } from 'react';
import { invoke } from '@tauri-apps/api/core';
import Header from './components/Header';
import SettingsModal from './components/SettingsModal';
import TextInput from './components/TextInput';
import LanguageSelector from './components/LanguageSelector';
import AudioPlayer from './components/AudioPlayer';
import VoiceSettings from './components/VoiceSettings';
import BreakControls, { BreakSettings } from './components/BreakControls';
import { ApiResponse, LANGUAGES, VoiceSettings as VoiceSettingsType, DEFAULT_VOICE_SETTINGS } from './types';

function App() {
  const [text, setText] = useState('');
  const [language, setLanguage] = useState(LANGUAGES[0].code);
  const [voiceSettings, setVoiceSettings] = useState<VoiceSettingsType>(DEFAULT_VOICE_SETTINGS);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [audioData, setAudioData] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);

  // Check for API key on mount
  useEffect(() => {
    checkApiKey();
  }, []);

  const checkApiKey = async () => {
    try {
      const response = await invoke<ApiResponse<string>>('get_api_key');
      if (!response.success || !response.data) {
        setShowSettings(true); // Force settings modal if no API key
      }
    } catch (err) {
      console.error('Error checking API key:', err);
      setShowSettings(true);
    }
  };

  const handleGenerate = async () => {
    if (!text.trim()) {
      setError('Veuillez entrer du texte');
      return;
    }

    setIsLoading(true);
    setError(null);
    setAudioData(null);

    try {
      const response = await invoke<ApiResponse<string>>('generate_tts', {
        request: {
          text: text.trim(),
          language,
          voice_settings: voiceSettings,
        },
      });

      if (response.success && response.data) {
        setAudioData(response.data);
      } else {
        setError(response.error || 'Échec de la génération audio');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur inattendue s\'est produite');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSettingsSaved = () => {
    setShowSettings(false);
    checkApiKey();
  };

  const handleApplyBreaks = (settings: BreakSettings) => {
    // Supprimer toutes les anciennes balises <break time="..."/>
    let newText = text.replace(/<break time="[^"]*"\/>/g, '');

    // Utiliser un placeholder temporaire pour éviter les conflits
    const PERIOD_PLACEHOLDER = '###PERIOD_BREAK###';

    // Remplacer les points de suspension (3 ou +) puis les points simples
    newText = newText.replace(/\.{3,}/g, PERIOD_PLACEHOLDER);
    newText = newText.replace(/\./g, PERIOD_PLACEHOLDER);

    // Remplacer le placeholder par la vraie balise
    newText = newText.replace(new RegExp(PERIOD_PLACEHOLDER, 'g'), `<break time="${settings.periodBreak.toFixed(1)}s"/>`);

    setText(newText);
  };

  return (
    <div className="app">
      <Header onSettingsClick={() => setShowSettings(true)} />

      <main className="main-content">
        <div className="content-wrapper">
          <TextInput value={text} onChange={setText} disabled={isLoading} />

          <BreakControls onApply={handleApplyBreaks} disabled={isLoading} />

          <div className="controls">
            <LanguageSelector
              value={language}
              onChange={setLanguage}
              disabled={isLoading}
            />
            <button
              className="generate-button"
              onClick={handleGenerate}
              disabled={isLoading || !text.trim()}
            >
              {isLoading ? 'Génération en cours...' : 'Générer la voix'}
            </button>
          </div>

          <VoiceSettings
            values={voiceSettings}
            onChange={setVoiceSettings}
            disabled={isLoading}
          />

          {error && (
            <div className="error-message">
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M10 0C4.48 0 0 4.48 0 10C0 15.52 4.48 20 10 20C15.52 20 20 15.52 20 10C20 4.48 15.52 0 10 0ZM11 15H9V13H11V15ZM11 11H9V5H11V11Z"
                  fill="currentColor"
                />
              </svg>
              {error}
            </div>
          )}

          {audioData && <AudioPlayer audioData={audioData} />}
        </div>
      </main>

      {showSettings && (
        <SettingsModal
          onClose={() => setShowSettings(false)}
          onSave={handleSettingsSaved}
        />
      )}
    </div>
  );
}

export default App;
