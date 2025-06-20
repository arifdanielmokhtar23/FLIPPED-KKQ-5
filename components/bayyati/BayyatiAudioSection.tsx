
import React, { useState, useRef, useEffect, useCallback } from 'react';
import BayyatiCard from './BayyatiCard';
import BayyatiDropdown from './BayyatiDropdown';
import BayyatiAudioControls from './BayyatiAudioControls';
import { DropdownOption, HarakahOptionValue, HummingOptionValue } from './bayyatiTypes';

interface BayyatiAudioSectionProps<T extends HarakahOptionValue | HummingOptionValue> {
  sectionTitle: "BACAAN" | "HUMMING";
  icon: React.ReactNode;
  dropdownOptions: DropdownOption<T>[];
  selectedValue: T;
  onValueChange: (value: T) => void;
  audioFilePrefix: string;
  triggerPlayToken?: number;
  onPlayRequest?: () => void; // New prop
  children?: React.ReactNode;
}

const BayyatiAudioSection = <T extends HarakahOptionValue | HummingOptionValue>({
  sectionTitle,
  icon,
  dropdownOptions,
  selectedValue,
  onValueChange,
  audioFilePrefix,
  triggerPlayToken,
  onPlayRequest, // Use the new prop
  children
}: BayyatiAudioSectionProps<T>) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioError, setAudioError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handleAudioError = useCallback((error: Event | string, fileName: string) => {
    let specificError = "Ralat tidak diketahui.";
    if (typeof error === 'string') {
        specificError = error;
    } else if (audioRef.current && audioRef.current.error) {
        switch (audioRef.current.error.code) {
            case MediaError.MEDIA_ERR_ABORTED: specificError = "Main balik dibatalkan."; break;
            case MediaError.MEDIA_ERR_NETWORK: specificError = "Ralat rangkaian."; break;
            case MediaError.MEDIA_ERR_DECODE: specificError = "Ralat penyahkodan audio."; break;
            case MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED: specificError = "Format audio tidak disokong atau fail tidak ditemui."; break;
            default: specificError = `Kod Ralat: ${audioRef.current.error.code}`; break;
        }
    }
    const friendlyMessage = `Tidak dapat memainkan fail audio: ${fileName}. ${specificError} Sila pastikan fail wujud dalam folder public/audio dan formatnya betul.`;
    alert(friendlyMessage);
    setAudioError(`Gagal memuatkan ${fileName}. ${specificError}`);
    setIsPlaying(false);
    if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null; 
    }
  }, []);
  
  const playAudio = useCallback((valueToPlay: T) => {
    if (!valueToPlay) return;
    const fileName = `/audio/${audioFilePrefix}_${valueToPlay}.mp3`;
    setAudioError(null);

    if (audioRef.current) {
      audioRef.current.pause();
    }

    const newAudio = new Audio(fileName);
    audioRef.current = newAudio;
    setIsPlaying(true);

    newAudio.play()
      .catch(e => {
        if (e.name === 'NotAllowedError') {
          handleAudioError("Main balik disekat oleh pelayar. Sila berinteraksi dengan halaman dahulu (cth: klik).", fileName);
        } else {
          handleAudioError(e.toString(), fileName);
        }
      });

    newAudio.onended = () => {
      setIsPlaying(false);
    };
    newAudio.onerror = (e) => {
       if (audioRef.current === newAudio) {
         handleAudioError(e, fileName);
       }
    };
  }, [audioFilePrefix, handleAudioError]);

  const handlePlayButtonClick = () => {
    if (onPlayRequest) {
      onPlayRequest(); // Call the handler from BayyatiApp (which includes scroll and then triggers play)
    } else {
      playAudio(selectedValue); // Fallback if no specific request handler is provided
    }
  };

  const handleStop = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsPlaying(false);
  };
  
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
        audioRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (audioRef.current) {
        audioRef.current.pause();
    }
    setIsPlaying(false);
    setAudioError(null);
  }, [selectedValue]);

  useEffect(() => {
    if (triggerPlayToken && triggerPlayToken > 0) { 
        playAudio(selectedValue);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [triggerPlayToken]); // playAudio and selectedValue removed to avoid unintended plays from this effect if they change elsewhere

  return (
    <BayyatiCard title={sectionTitle} icon={icon}>
      <BayyatiDropdown
        id={`${audioFilePrefix}-select`}
        label="Pilih Harakah" 
        options={dropdownOptions}
        selectedValue={selectedValue}
        onChange={onValueChange}
      />
      <BayyatiAudioControls 
        onPlayRequest={handlePlayButtonClick} // Pass the new handler
        onStop={handleStop} 
        isPlaying={isPlaying} 
      />
      {audioError && <p className="text-red-600 text-xs mt-2 text-center" role="alert">{audioError}</p>}
      {children}
    </BayyatiCard>
  );
};

export default BayyatiAudioSection;
