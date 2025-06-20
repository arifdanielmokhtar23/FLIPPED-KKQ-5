
import React from 'react';
import { SectionId } from '../types';
import BayyatiApp from './bayyati/BayyatiApp';
import HijazApp from './hijaz/HijazApp';
import NahawandApp from './nahawand/NahawandApp';
import { ParsedTarannumCommand } from '../utils/speechRecognitionHelper'; // Import type

// Define the prop type for activeTarannumAudioCommand
interface ActiveTarannumAudioCommandProp extends ParsedTarannumCommand {
  timestamp: number;
}

interface TarannumContentSectionProps {
  id: SectionId;
  title: string;
  onBack: () => void;
  activeTarannumAudioCommand: ActiveTarannumAudioCommandProp | null;
  isAccessibilityModeEnabled: boolean; // New prop
}

const TarannumContentSection: React.FC<TarannumContentSectionProps> = ({ id, title, onBack, activeTarannumAudioCommand, isAccessibilityModeEnabled }) => {
  if (id === 'bayyati-content') {
    return <BayyatiApp tarannumTitle={title} onBack={onBack} activeTarannumAudioCommand={activeTarannumAudioCommand} isAccessibilityModeEnabled={isAccessibilityModeEnabled} />;
  }

  if (id === 'hijaz-content') {
    return <HijazApp tarannumTitle={title} onBack={onBack} activeTarannumAudioCommand={activeTarannumAudioCommand} isAccessibilityModeEnabled={isAccessibilityModeEnabled} />;
  }

  if (id === 'nahawand-content') {
    return <NahawandApp tarannumTitle={title} onBack={onBack} activeTarannumAudioCommand={activeTarannumAudioCommand} isAccessibilityModeEnabled={isAccessibilityModeEnabled} />;
  }

  // Placeholder for other tarannums if any in the future
  return (
    <section id={id} className="content-section bg-white rounded-2xl shadow-xl p-6 md:p-8">
      <h2 className="text-2xl md:text-3xl font-bold text-primary mb-4">{title}</h2>
      <button
        onClick={onBack}
        className="back-to-auditori mb-6 text-sm bg-secondary text-white px-3 py-1 rounded-md hover:bg-primary"
      >
        <i className="fas fa-arrow-left mr-2"></i>Kembali ke Modul Auditori
      </button>
      <p className="text-gray-700">Kandungan untuk {title} akan diisi di sini tidak lama lagi.</p>
      <div className="min-h-[300px] bg-gray-50 border border-dashed border-gray-300 rounded-md flex items-center justify-center mt-4">
        <p className="text-gray-400">Ruang Kandungan {title}</p>
      </div>
    </section>
  );
};

export default TarannumContentSection;
