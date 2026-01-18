import React from 'react';

interface TextInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

const MAX_LENGTH = 5000;

const TextInput: React.FC<TextInputProps> = ({ value, onChange, disabled = false }) => {
  const characterCount = value.length;
  const isNearLimit = characterCount > MAX_LENGTH * 0.9;
  const isOverLimit = characterCount > MAX_LENGTH;

  return (
    <div className="text-input-container">
      <label htmlFor="text-input" className="label">
        Saisir le texte
      </label>
      <textarea
        id="text-input"
        className="textarea"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Tapez ou collez le texte que vous souhaitez convertir en audio..."
        disabled={disabled}
        maxLength={MAX_LENGTH}
      />
      <div className="character-counter">
        <span className={isOverLimit ? 'over-limit' : isNearLimit ? 'near-limit' : ''}>
          {characterCount} / {MAX_LENGTH}
        </span>
      </div>
    </div>
  );
};

export default TextInput;
