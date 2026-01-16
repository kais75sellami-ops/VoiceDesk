import React from 'react';
import { LANGUAGES } from '../types';

interface LanguageSelectorProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  value,
  onChange,
  disabled = false,
}) => {
  return (
    <div className="language-selector">
      <label htmlFor="language-select" className="label">
        Language
      </label>
      <select
        id="language-select"
        className="select"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
      >
        {LANGUAGES.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default LanguageSelector;
