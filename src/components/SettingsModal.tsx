import React, { useState } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { ApiResponse } from '../types';

interface SettingsModalProps {
  onClose: () => void;
  onSave: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ onClose, onSave }) => {
  const [apiKey, setApiKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSave = async () => {
    if (!apiKey.trim()) {
      setError('Veuillez entrer une clé API');
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await invoke<ApiResponse<string>>('set_api_key', {
        apiKey: apiKey.trim(),
      });

      if (response.success) {
        setSuccess('Clé API enregistrée avec succès !');
        setTimeout(() => {
          onSave();
        }, 1000);
      } else {
        setError(response.error || 'Échec de l\'enregistrement de la clé API');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur inattendue s\'est produite');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal">
        <div className="modal-header">
          <h2>Paramètres</h2>
          <button className="close-button" onClick={onClose}>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z"
                fill="currentColor"
              />
            </svg>
          </button>
        </div>

        <div className="modal-body">
          <div className="form-group">
            <label htmlFor="api-key">Clé API ElevenLabs</label>
            <input
              id="api-key"
              type="password"
              className="input"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Entrez votre clé API ElevenLabs"
              disabled={isLoading}
            />
            <p className="help-text">
              Obtenez votre clé API depuis{' '}
              <a
                href="https://elevenlabs.io/app/settings/api-keys"
                target="_blank"
                rel="noopener noreferrer"
              >
                Paramètres ElevenLabs
              </a>
            </p>
          </div>

          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}
        </div>

        <div className="modal-footer">
          <button className="button-secondary" onClick={onClose} disabled={isLoading}>
            Annuler
          </button>
          <button className="button-primary" onClick={handleSave} disabled={isLoading}>
            {isLoading ? 'Enregistrement...' : 'Enregistrer'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
