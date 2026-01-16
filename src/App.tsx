import { useState, useEffect } from 'react';
import { invoke } from '@tauri-apps/api/core';
import Header from './components/Header';
import SettingsModal from './components/SettingsModal';
import TextInput from './components/TextInput';
import LanguageSelector from './components/LanguageSelector';
import AudioPlayer from './components/AudioPlayer';
import { ApiResponse, LANGUAGES } from './types';

function App() {
  const [text, setText] = useState('');
  const [language, setLanguage] = useState(LANGUAGES[0].code);
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
      setError('Please enter some text');
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
        },
      });

      if (response.success && response.data) {
        setAudioData(response.data);
      } else {
        setError(response.error || 'Failed to generate audio');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSettingsSaved = () => {
    setShowSettings(false);
    checkApiKey();
  };

  return (
    <div className="app">
      <Header onSettingsClick={() => setShowSettings(true)} />

      <main className="main-content">
        <div className="content-wrapper">
          <TextInput value={text} onChange={setText} disabled={isLoading} />

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
              {isLoading ? 'Generating...' : 'Generate Speech'}
            </button>
          </div>

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
