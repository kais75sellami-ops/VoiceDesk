import { useState } from 'react';

export interface VoiceSettingsValues {
  stability: number;
  similarity_boost: number;
  style: number;
}

interface VoiceSettingsProps {
  values: VoiceSettingsValues;
  onChange: (values: VoiceSettingsValues) => void;
  disabled?: boolean;
}

const VoiceSettings = ({ values, onChange, disabled = false }: VoiceSettingsProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleChange = (param: keyof VoiceSettingsValues, value: number) => {
    onChange({
      ...values,
      [param]: value,
    });
  };

  return (
    <div className="voice-settings">
      <button
        className="voice-settings-toggle"
        onClick={() => setIsExpanded(!isExpanded)}
        disabled={disabled}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          style={{
            transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s'
          }}
        >
          <path d="M7 10L12 15L17 10H7Z" fill="currentColor" />
        </svg>
        <span>Paramètres de la voix</span>
      </button>

      {isExpanded && (
        <div className="voice-settings-content">
          <div className="voice-setting-item">
        <div className="voice-setting-header">
          <label htmlFor="stability">Stabilité</label>
          <span className="voice-setting-value">{values.stability.toFixed(2)}</span>
        </div>
        <input
          id="stability"
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={values.stability}
          onChange={(e) => handleChange('stability', parseFloat(e.target.value))}
          disabled={disabled}
          className="voice-slider"
        />
        <p className="voice-setting-description">
          Plus la stabilité est élevée, plus la voix est prévisible et cohérente
        </p>
      </div>

      <div className="voice-setting-item">
        <div className="voice-setting-header">
          <label htmlFor="similarity_boost">Amplification de similarité</label>
          <span className="voice-setting-value">{values.similarity_boost.toFixed(2)}</span>
        </div>
        <input
          id="similarity_boost"
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={values.similarity_boost}
          onChange={(e) => handleChange('similarity_boost', parseFloat(e.target.value))}
          disabled={disabled}
          className="voice-slider"
        />
        <p className="voice-setting-description">
          Améliore la ressemblance à la voix originale
        </p>
      </div>

      <div className="voice-setting-item">
        <div className="voice-setting-header">
          <label htmlFor="style">Style</label>
          <span className="voice-setting-value">{values.style.toFixed(2)}</span>
        </div>
        <input
          id="style"
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={values.style}
          onChange={(e) => handleChange('style', parseFloat(e.target.value))}
          disabled={disabled}
          className="voice-slider"
        />
        <p className="voice-setting-description">
          Exagère le style de parole et les émotions
        </p>
      </div>
        </div>
      )}
    </div>
  );
};

export default VoiceSettings;
