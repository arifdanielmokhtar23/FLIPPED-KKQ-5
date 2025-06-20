
import React, { useState, useRef, useEffect, useCallback } from 'react';
import HijazCard from './HijazCard';
import HijazDropdown from './HijazDropdown';
import HijazAudioControls from './HijazAudioControls';
import { DropdownOption, HijazHarakahOptionValue, HijazHummingOptionValue } from './hijazTypes';

interface HijazAudioSectionProps<T extends HijazHarakahOptionValue | HijazHummingOptionValue> {
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

const HijazAudioSection = <T extends HijazHarakahOptionValue | HijazHummingOptionValue>({
  sectionTitle,
  icon,
  dropdownOptions,
  selectedValue,
  onValueChange,
  audioFilePrefix,
  triggerPlayToken,
  onPlayRequest, // Use new prop
  children
}: HijazAudioSectionProps<T>) => {
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
      onPlayRequest();
    } else {
      playAudio(selectedValue);
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
  }, [triggerPlayToken]);

  return (
    <HijazCard title={sectionTitle} icon={icon}>
      <HijazDropdown
        id={`${audioFilePrefix}-select`}
        label="Pilih Harakah" 
        options={dropdownOptions}
        selectedValue={selectedValue}
        onChange={onValueChange}
      />
      <HijazAudioControls 
        onPlayRequest={handlePlayButtonClick} 
        onStop={handleStop} 
        isPlaying={isPlaying} 
      />
      {audioError && <p className="text-red-600 text-xs mt-2 text-center" role="alert">{audioError}</p>}
      {children}
    </HijazCard>
  );
};

export default HijazAudioSection;
