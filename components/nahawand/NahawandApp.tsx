
import React, { useState, useMemo, useEffect, useRef } from 'react';
import NahawandHeader from './NahawandHeader';
import NahawandAudioSection from './NahawandAudioSection';
import NahawandMelodicDirectionDisplay from './NahawandMelodicDirectionDisplay';
import NahawandVerseDisplay from './NahawandVerseDisplay';
import { QuranIcon, MusicIcon, BackIcon } from './icons';
import { 
  NAHAWAND_HARAKAH_OPTIONS, 
  NAHAWAND_HUMMING_OPTIONS, 
  NAHAWAND_VERSE_DATA, 
  NAHAWAND_ARROW_PATTERNS 
} from './nahawandConstants';
import { NahawandHarakahOptionValue, NahawandHummingOptionValue } from './nahawandTypes';
import { ParsedTarannumCommand } from '../../utils/speechRecognitionHelper';

interface ActiveTarannumAudioCommandProp extends ParsedTarannumCommand {
  timestamp: number;
}

interface NahawandAppProps {
  tarannumTitle: string;
  onBack: () => void;
  activeTarannumAudioCommand: ActiveTarannumAudioCommandProp | null;
  isAccessibilityModeEnabled: boolean; // New prop
}

const NahawandApp: React.FC<NahawandAppProps> = ({ tarannumTitle, onBack, activeTarannumAudioCommand, isAccessibilityModeEnabled }) => {
  const [selectedHarakah, setSelectedHarakah] = useState<NahawandHarakahOptionValue>(NAHAWAND_HARAKAH_OPTIONS[0].value);
  const [selectedHumming, setSelectedHumming] = useState<NahawandHummingOptionValue>(NAHAWAND_HUMMING_OPTIONS[0].value);

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
    if (activeTarannumAudioCommand && activeTarannumAudioCommand.module === 'nahawand') {
      const harakahValue = activeTarannumAudioCommand.harakah as NahawandHarakahOptionValue;
      if (activeTarannumAudioCommand.type === 'bacaan') {
        if (NAHAWAND_HARAKAH_OPTIONS.some(opt => opt.value === harakahValue)) {
          setSelectedHarakah(harakahValue);
          setBacaanPlayTrigger(Date.now());
        }
      } else if (activeTarannumAudioCommand.type === 'humming') {
        if (NAHAWAND_HUMMING_OPTIONS.some(opt => opt.value === harakahValue)) {
          setSelectedHumming(harakahValue);
          setHummingPlayTrigger(Date.now());
        }
      }
    }
  }, [activeTarannumAudioCommand]);

  const handleHarakahChange = (value: NahawandHarakahOptionValue) => {
    setSelectedHarakah(value);
  };

  const handleHummingChange = (value: NahawandHummingOptionValue) => {
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
    if (harakahIndex >= 0 && harakahIndex < NAHAWAND_VERSE_DATA.length) {
      return NAHAWAND_VERSE_DATA[harakahIndex].id;
    }
    return null;
  }, [selectedHarakah]);

  const currentArrowPattern = useMemo(() => {
    return NAHAWAND_ARROW_PATTERNS[selectedHumming] || null;
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
      
      <NahawandHeader title={tarannumTitle} />
      
      <main className="flex-grow container mx-auto max-w-7xl w-full">
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(420px,3fr)_minmax(300px,2fr)] gap-5 lg:gap-8">
          <div className="flex flex-col gap-5">
            <NahawandAudioSection
              sectionTitle="BACAAN"
              icon={<QuranIcon className="w-5 h-5" />}
              dropdownOptions={NAHAWAND_HARAKAH_OPTIONS}
              selectedValue={selectedHarakah}
              onValueChange={handleHarakahChange}
              audioFilePrefix="nahawand_bacaan_harakah"
              triggerPlayToken={bacaanPlayTrigger}
              onPlayRequest={handleBacaanPlayRequest}
            />
            <div ref={melodicDisplayRef}>
              <NahawandMelodicDirectionDisplay arrowPattern={currentArrowPattern} />
            </div>
            <NahawandAudioSection
              sectionTitle="HUMMING"
              icon={<MusicIcon className="w-5 h-5" />}
              dropdownOptions={NAHAWAND_HUMMING_OPTIONS}
              selectedValue={selectedHumming}
              onValueChange={handleHummingChange}
              audioFilePrefix="nahawand_humming_harakah"
              triggerPlayToken={hummingPlayTrigger}
              onPlayRequest={handleHummingPlayRequest}
            />
          </div>
          
          <div className="h-full" ref={verseDisplayRef}> 
            <NahawandVerseDisplay
              verses={NAHAWAND_VERSE_DATA}
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

export default NahawandApp;
