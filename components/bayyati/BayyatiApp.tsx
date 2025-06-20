
import React, { useState, useMemo, useEffect, useRef } from 'react';
import BayyatiHeader from './BayyatiHeader';
import BayyatiAudioSection from './BayyatiAudioSection';
import BayyatiMelodicDirectionDisplay from './BayyatiMelodicDirectionDisplay';
import BayyatiVerseDisplay from './BayyatiVerseDisplay';
import { QuranIcon, MusicIcon, BackIcon } from './icons';
import { 
  HARAKAH_OPTIONS, 
  HUMMING_OPTIONS, 
  VERSE_DATA, 
  ARROW_PATTERNS 
} from './bayyatiConstants';
import { HarakahOptionValue, HummingOptionValue } from './bayyatiTypes';
import { ParsedTarannumCommand } from '../../utils/speechRecognitionHelper'; // Import type

interface ActiveTarannumAudioCommandProp extends ParsedTarannumCommand {
  timestamp: number;
}

interface BayyatiAppProps {
  tarannumTitle: string;
  onBack: () => void;
  activeTarannumAudioCommand: ActiveTarannumAudioCommandProp | null;
  isAccessibilityModeEnabled: boolean; // New prop
}

const BayyatiApp: React.FC<BayyatiAppProps> = ({ tarannumTitle, onBack, activeTarannumAudioCommand, isAccessibilityModeEnabled }) => {
  const [selectedHarakah, setSelectedHarakah] = useState<HarakahOptionValue>(HARAKAH_OPTIONS[0].value);
  const [selectedHumming, setSelectedHumming] = useState<HummingOptionValue>(HUMMING_OPTIONS[0].value);
  
  const [bacaanPlayTrigger, setBacaanPlayTrigger] = useState(0);
  const [hummingPlayTrigger, setHummingPlayTrigger] = useState(0);

  const verseDisplayRef = useRef<HTMLDivElement>(null);
  const melodicDisplayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.body.classList.add('font-inter');
    document.body.style.backgroundColor = '#f0f4f8';
    return () => {
      document.body.classList.remove('font-inter');
      document.body.style.backgroundColor = '';
    };
  }, []);

  useEffect(() => {
    if (activeTarannumAudioCommand && activeTarannumAudioCommand.module === 'bayyati') {
      const harakahValue = activeTarannumAudioCommand.harakah as HarakahOptionValue; 
      if (activeTarannumAudioCommand.type === 'bacaan') {
        if (HARAKAH_OPTIONS.some(opt => opt.value === harakahValue)) {
          setSelectedHarakah(harakahValue);
          setBacaanPlayTrigger(Date.now()); 
        }
      } else if (activeTarannumAudioCommand.type === 'humming') {
        if (HUMMING_OPTIONS.some(opt => opt.value === harakahValue)) {
          setSelectedHumming(harakahValue);
          setHummingPlayTrigger(Date.now()); 
        }
      }
    }
  }, [activeTarannumAudioCommand]);

  const handleHarakahChange = (value: HarakahOptionValue) => {
    setSelectedHarakah(value);
  };

  const handleHummingChange = (value: HummingOptionValue) => {
    setSelectedHumming(value);
  };

  const scrollToTarget = (targetRef: React.RefObject<HTMLDivElement>) => {
    if (isAccessibilityModeEnabled && targetRef.current) {
      const targetEl = targetRef.current;
      const rect = targetEl.getBoundingClientRect();
      const isFullyVisible = rect.top >= 0 && rect.bottom <= window.innerHeight;
      const isMostlyOutOfView = Math.abs(rect.top) > window.innerHeight * 0.25 || Math.abs(rect.bottom - window.innerHeight) > window.innerHeight * 0.25;

      if (!isFullyVisible || isMostlyOutOfView) {
        setTimeout(() => {
          targetEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 50);
      }
    }
  };

  const handleBacaanPlayRequest = () => {
    scrollToTarget(verseDisplayRef);
    setBacaanPlayTrigger(Date.now());
  };

  const handleHummingPlayRequest = () => {
    scrollToTarget(melodicDisplayRef);
    setHummingPlayTrigger(Date.now());
  };

  const highlightedVerseId = useMemo(() => {
    const harakahIndex = parseInt(selectedHarakah, 10) - 1;
    if (harakahIndex >= 0 && harakahIndex < VERSE_DATA.length) {
      return VERSE_DATA[harakahIndex].id;
    }
    return null;
  }, [selectedHarakah]);

  const currentArrowPattern = useMemo(() => {
    return ARROW_PATTERNS[selectedHumming] || null;
  }, [selectedHumming]);

  return (
    <div className="bg-slate-100 text-slate-800 min-h-screen flex flex-col p-4 pt-16 md:pt-4 relative bayyati-container font-inter">
      <button
        onClick={onBack}
        className="absolute top-4 left-4 z-50 bg-primary text-white hover:bg-blue-600 p-2 rounded-full transition-colors shadow-md"
        aria-label="Kembali ke Modul Auditori"
      >
        <BackIcon className="w-6 h-6" />
      </button>
      
      <BayyatiHeader title={tarannumTitle} />
      
      <main className="flex-grow container mx-auto max-w-7xl w-full">
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(420px,3fr)_minmax(300px,2fr)] gap-5 lg:gap-8">
          <div className="flex flex-col gap-5">
            <BayyatiAudioSection
              sectionTitle="BACAAN"
              icon={<QuranIcon className="w-5 h-5" />}
              dropdownOptions={HARAKAH_OPTIONS}
              selectedValue={selectedHarakah}
              onValueChange={handleHarakahChange}
              audioFilePrefix="bacaan_harakah"
              triggerPlayToken={bacaanPlayTrigger}
              onPlayRequest={handleBacaanPlayRequest} // Pass the handler
            />
            <div ref={melodicDisplayRef}>
              <BayyatiMelodicDirectionDisplay arrowPattern={currentArrowPattern} />
            </div>
            <BayyatiAudioSection
              sectionTitle="HUMMING"
              icon={<MusicIcon className="w-5 h-5" />}
              dropdownOptions={HUMMING_OPTIONS}
              selectedValue={selectedHumming}
              onValueChange={handleHummingChange}
              audioFilePrefix="humming_harakah"
              triggerPlayToken={hummingPlayTrigger}
              onPlayRequest={handleHummingPlayRequest} // Pass the handler
            />
          </div>
          
          <div className="h-full" ref={verseDisplayRef}> 
            <BayyatiVerseDisplay
              verses={VERSE_DATA}
              highlightedVerseId={highlightedVerseId}
              surahName="As-Saffat"
            />
          </div>
        </div>
      </main>
      
      <footer className="text-center py-4 mt-8">
        <p className="text-sm text-slate-500 opacity-90">
          Modul Auditori Taranum {tarannumTitle.split(' ').pop()} &copy; {new Date().getFullYear()}
        </p>
      </footer>
    </div>
  );
};

export default BayyatiApp;
