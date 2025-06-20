import React from 'react';

interface SpeechNavButtonProps {
  onPress: () => void;
  onRelease: () => void;
  isCurrentlyListening: boolean;
}

const SpeechNavButton: React.FC<SpeechNavButtonProps> = ({ onPress, onRelease, isCurrentlyListening }) => {
  const handlePress = () => {
    onPress();
  };

  const handleRelease = () => {
    onRelease();
  };

  const ariaLabel = isCurrentlyListening 
    ? "Listening Mode." 
    : "Listening Mode.";

  return (
    <button
      onMouseDown={handlePress}
      onMouseUp={handleRelease}
      onTouchStart={handlePress}
      onTouchEnd={handleRelease}
      className={`speech-nav-button ${isCurrentlyListening ? 'listening' : ''}`}
      aria-label={ariaLabel}
      title={ariaLabel}
    >
      <i className="fas fa-microphone"></i>
    </button>
  );
};

export default SpeechNavButton;