import { useState } from 'react';

export interface BreakSettings {
  commaBreak: number;
  periodBreak: number;
}

interface BreakControlsProps {
  onApply: (settings: BreakSettings) => void;
  disabled?: boolean;
}

const BreakControls = ({ onApply, disabled = false }: BreakControlsProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [commaBreak, setCommaBreak] = useState(0.3);
  const [periodBreak, setPeriodBreak] = useState(1);

  const handleApply = () => {
    onApply({ commaBreak, periodBreak });
  };

  return (
    <div className="break-controls">
      <button
        className="break-controls-toggle"
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
        <span>Contrôles de pauses</span>
      </button>

      {isExpanded && (
        <div className="break-controls-content">
          <div className="break-control-item">
            <div className="break-control-header">
              <label htmlFor="comma-break">Pause virgule (,)</label>
              <span className="break-control-value">{commaBreak.toFixed(1)}s</span>
            </div>
            <input
              id="comma-break"
              type="range"
              min="0.1"
              max="0.9"
              step="0.1"
              value={commaBreak}
              onChange={(e) => setCommaBreak(parseFloat(e.target.value))}
              disabled={disabled}
              className="break-slider"
            />
            <p className="break-control-description">
              Durée de la pause après chaque virgule (0.1s à 0.9s)
            </p>
          </div>

          <div className="break-control-item">
            <div className="break-control-header">
              <label htmlFor="period-break">Pause point (.)</label>
              <span className="break-control-value">{periodBreak.toFixed(1)}s</span>
            </div>
            <input
              id="period-break"
              type="range"
              min="1"
              max="8"
              step="0.5"
              value={periodBreak}
              onChange={(e) => setPeriodBreak(parseFloat(e.target.value))}
              disabled={disabled}
              className="break-slider"
            />
            <p className="break-control-description">
              Durée de la pause après chaque point (1s à 8s)
            </p>
          </div>

          <button
            className="apply-breaks-button"
            onClick={handleApply}
            disabled={disabled}
          >
            Appliquer les pauses
          </button>
        </div>
      )}
    </div>
  );
};

export default BreakControls;
