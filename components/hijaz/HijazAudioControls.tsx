
import React from 'react';
import { PlayIcon, StopIcon } from './icons';

interface HijazAudioControlsProps {
  onPlayRequest: () => void; // Renamed from onPlay
  onStop: () => void;
  isPlaying: boolean;
}

const HijazAudioControls: React.FC<HijazAudioControlsProps> = ({ onPlayRequest, onStop, isPlaying }) => {
  return (
    <div className="flex items-center justify-center space-x-4 mt-4">
      <button
        onClick={onPlayRequest} // Use renamed prop
        aria-label="Mainkan Audio"
        disabled={isPlaying} 
        className={`w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center shadow-lg hover:bg-blue-600 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 ${isPlaying ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <PlayIcon className="w-6 h-6" />
      </button>
      <button
        onClick={onStop}
        aria-label="Berhentikan Audio"
        disabled={!isPlaying} 
        className={`w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center shadow-lg hover:bg-blue-600 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 ${!isPlaying ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <StopIcon className="w-5 h-5" />
      </button>
    </div>
  );
};

export default HijazAudioControls;
