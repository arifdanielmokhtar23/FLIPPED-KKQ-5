
import React from 'react';

interface AccessibilityTTSButtonProps {
  isTTSEnabled: boolean; 
  onToggle: () => void;
}

const AccessibilityTTSButton: React.FC<AccessibilityTTSButtonProps> = ({ isTTSEnabled, onToggle }) => {
  return (
    <button
      onClick={onToggle}
      className={`accessibility-tts-button ${isTTSEnabled ? 'active' : ''}`}
      aria-label={isTTSEnabled ? "UDL MODE aktif. Klik untuk nyahaktifkan." : "Aktifkan UDL MODE."}
      title={isTTSEnabled ? "UDL MODE aktif. Klik untuk nyahaktifkan." : "Aktifkan UDL MODE."}
    >
      <i className="fas fa-universal-access"></i>
    </button>
  );
};

export default AccessibilityTTSButton;
