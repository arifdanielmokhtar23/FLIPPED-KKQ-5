
import React, { useState, useEffect, useCallback, useRef } from 'react';
import Header from './components/Header';
import NavigationBar from './components/NavigationBar';
import Footer from './components/Footer';
import HomeSection from './components/HomeSection';
import ModulTeksSection from './components/ModulTeksSection';
import TarannumContentSection from './components/TarannumContentSection';
import TysonAssistantSection from './components/TysonAssistantSection';
import HantarRakamanSection from './components/HantarRakamanSection';
import TugasanSection from './components/TugasanSection';
import AdminPasswordModal from './components/AdminPasswordModal';
import AccessibilityTTSButton from './components/AccessibilityTTSButton';
import SpeechNavButton from './components/SpeechNavButton'; // Import the new component
import { speakText } from './utils/speakText';
import { playActivationSound } from './utils/soundEffects'; // Import the new sound effect
import { parseTarannumCommand, ParsedTarannumCommand, HARAKAH_KEYWORDS as ALL_HARAKAH_KEYWORDS } from './utils/speechRecognitionHelper';
import { SectionId, RelatedLink, TextModule } from './types'; // Added TextModule
import { AUDITORI_MODULES, INITIAL_RELATED_LINKS_DATA, NAV_ITEMS, TEKS_MODULES as INITIAL_TEKS_MODULES } from './constants'; // Renamed TEKS_MODULES import
import { isSimilar, getFuzzyThreshold } from './utils/stringUtils';

// ---- START OF TYPE DEFINITIONS FOR WEB SPEECH API ----
interface SpeechRecognitionErrorEvent extends Event {
  readonly error: string;
  readonly message: string;
}
interface SpeechRecognitionAlternative {
  readonly transcript: string;
  readonly confidence: number;
}
interface SpeechRecognitionResult {
  readonly isFinal: boolean;
  readonly length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
}
interface SpeechRecognitionResultList {
  readonly length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}
interface SpeechRecognitionEvent extends Event {
  readonly resultIndex: number;
  readonly results: SpeechRecognitionResultList;
}
interface SpeechGrammar {
  src: string;
  weight: number;
}
interface SpeechGrammarList {
  readonly length: number;
  item(index: number): SpeechGrammar;
  addFromURI(src: string, weight?: number): void;
  addFromString(grammarString: string, weight?: number): void;
  [index: number]: SpeechGrammar;
}
interface SpeechRecognitionEventMap {
    "audiostart": Event;
    "audioend": Event;
    "end": Event;
    "error": SpeechRecognitionErrorEvent;
    "nomatch": SpeechRecognitionEvent;
    "result": SpeechRecognitionEvent;
    "soundstart": Event;
    "soundend": Event;
    "speechstart": Event;
    "speechend": Event;
    "start": Event;
}
interface SpeechRecognition extends EventTarget {
  grammars: SpeechGrammarList;
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
  serviceURI?: string;
  onaudiostart: ((this: SpeechRecognition, ev: Event) => any) | null;
  onaudioend: ((this: SpeechRecognition, ev: Event) => any) | null;
  onend: ((this: SpeechRecognition, ev: Event) => any) | null;
  onerror: ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => any) | null;
  onnomatch: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null;
  onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null;
  onsoundstart: ((this: SpeechRecognition, ev: Event) => any) | null;
  onsoundend: ((this: SpeechRecognition, ev: Event) => any) | null;
  onspeechstart: ((this: SpeechRecognition, ev: Event) => any) | null;
  onspeechend: ((this: SpeechRecognition, ev: Event) => any) | null;
  onstart: ((this: SpeechRecognition, ev: Event) => any) | null;
  abort(): void;
  start(): void;
  stop(): void;
  addEventListener<K extends keyof SpeechRecognitionEventMap>(type: K, listener: (this: SpeechRecognition, ev: SpeechRecognitionEventMap[K]) => any, options?: boolean | AddEventListenerOptions): void;
  addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void;
  removeEventListener<K extends keyof SpeechRecognitionEventMap>(type: K, listener: (this: SpeechRecognition, ev: SpeechRecognitionEventMap[K]) => any, options?: boolean | EventListenerOptions): void;
  removeEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions): void;
}
declare global {
  interface Window {
    SpeechRecognition: { new (): SpeechRecognition };
    webkitSpeechRecognition: { new (): SpeechRecognition };
    SpeechGrammarList: { new (): SpeechGrammarList };
    webkitSpeechGrammarList: { new (): SpeechGrammarList };
    AudioContext: typeof AudioContext;
    webkitAudioContext: typeof AudioContext;
  }
}
const NativeSpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
// ---- END OF TYPE DEFINITIONS FOR WEB SPEECH API ----


interface ActiveTarannumAudioCommand extends ParsedTarannumCommand {
  timestamp: number;
}

const App: React.FC = () => {
  const [currentSection, setCurrentSection] = useState<SectionId>('home');
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [showAdminPasswordModal, setShowAdminPasswordModal] = useState(false);
  const [relatedLinks, setRelatedLinks] = useState<RelatedLink[]>(INITIAL_RELATED_LINKS_DATA);
  const [textModules, setTextModules] = useState<TextModule[]>(INITIAL_TEKS_MODULES); // State for text modules
  const [isAccessibilityModeEnabled, setIsAccessibilityModeEnabled] = useState(false); 

  const keyPressTimerRef = useRef<number | null>(null);
  const lKeyTimerRef = useRef<number | null>(null);
  const speechRecognitionRef = useRef<SpeechRecognition | null>(null);

  const [isSpeechNavLKeyModeActive, setIsSpeechNavLKeyModeActive] = useState(false); // For 'L' key persistent mode
  const [isListeningForCommand, setIsListeningForCommand] = useState(false);
  const [activeTarannumAudioCommand, setActiveTarannumAudioCommand] = useState<ActiveTarannumAudioCommand | null>(null);

  const onStartRef = useRef<() => void>(() => {});
  const onResultRef = useRef<(command: string) => void>(() => {});
  const onErrorRef = useRef<(errorEvent: SpeechRecognitionErrorEvent) => void>(() => {});
  const onEndRef = useRef<() => void>(() => {});

  const justToggledAccessibilityModeOnRef = useRef(false); 
  const accessibilityModeToggleTimeoutRef = useRef<number | null>(null); 


  const handleNavigate = useCallback((sectionId: SectionId) => {
    setCurrentSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
        setTimeout(() => element.scrollIntoView({ behavior: 'smooth', block: 'start' }), 0);
    } else if (sectionId === 'home') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    if (isAccessibilityModeEnabled) {
      const navItem = NAV_ITEMS.find(item => item.id === sectionId);
      const targetModule = AUDITORI_MODULES.find(m => m.targetSection === sectionId);
      let announcement = '';
      if (navItem && navItem.ariaLabelOverride) {
        announcement = `Menavigasi ke ${navItem.ariaLabelOverride}`;
      } else if (navItem) {
        announcement = `Menavigasi ke ${navItem.label}`;
      } else if (targetModule) {
        announcement = `Menavigasi ke ${targetModule.name}`;
      } else {
        announcement = `Menavigasi ke ${sectionId.replace('-', ' ')}`;
      }
      speakText(announcement, "ms-MY");
    }
  }, [isAccessibilityModeEnabled]);

  const processSpeechCommand = useCallback((command: string) => {
    const lowerCommand = command.toLowerCase().trim();
    const words = lowerCommand.split(' ').filter(w => w.length > 0);

    console.log("Arahan suara yang dikesan:", lowerCommand);
    console.log("Seksyen semasa (currentSection) semasa memproses arahan:", currentSection);
    
    const containsHarakatLikeWord = words.some(w => ALL_HARAKAH_KEYWORDS.some(hk => isSimilar(w, hk, getFuzzyThreshold(hk))));

    // Navigasi ke Bayyati (fuzzy + phrase)
    if ((lowerCommand.includes("ba ya ti") || words.some(w => isSimilar(w, "bayyati", getFuzzyThreshold("bayyati")))) && !containsHarakatLikeWord) {
      handleNavigate('bayyati-content'); return;
    }
    // Navigasi ke Hijaz (fuzzy)
    if (words.some(w => isSimilar(w, "hijaz", getFuzzyThreshold("hijaz"))) && !containsHarakatLikeWord && !words.some(w => isSimilar(w, "jazz", getFuzzyThreshold("jazz")))) {
      handleNavigate('hijaz-content'); return;
    }
    // Navigasi ke Nahawand (fuzzy + phrase)
    if ((lowerCommand.includes("na ha wand") || words.some(w => isSimilar(w, "nahawand", getFuzzyThreshold("nahawand")))) && !containsHarakatLikeWord) {
      handleNavigate('nahawand-content'); return;
    }
    // Navigasi ke Hantar Rakaman (fuzzy words)
    if (words.some(w => isSimilar(w, "hantar", getFuzzyThreshold("hantar"))) && words.some(w => isSimilar(w, "rakaman", getFuzzyThreshold("rakaman")))) {
      handleNavigate('hantar-rakaman'); return;
    }
    // Navigasi ke Laman Utama (fuzzy words or phrase)
    if (isSimilar(lowerCommand, "laman utama", getFuzzyThreshold("laman utama")) || isSimilar(lowerCommand, "halaman utama", getFuzzyThreshold("halaman utama")) || (words.some(w => isSimilar(w, "laman", 1) || isSimilar(w, "halaman", 2)) && words.some(w => isSimilar(w, "utama", 2)))) {
      handleNavigate('home'); return;
    }
    // Navigasi ke Modul Teks (fuzzy words or phrase)
    if (isSimilar(lowerCommand, "modul teks", getFuzzyThreshold("modul teks")) || (words.some(w => isSimilar(w, "modul", 2)) && words.some(w => isSimilar(w, "teks", 1)))) {
        handleNavigate('modul-teks'); return;
    }
    // Navigasi ke Tugasan (fuzzy word)
    if (words.some(w => isSimilar(w, "tugasan", getFuzzyThreshold("tugasan")))) {
        handleNavigate('game'); return;
    }
    // Navigasi ke Tyson Assistant (fuzzy words or phrase)
    if (isSimilar(lowerCommand, "tyson assistant", getFuzzyThreshold("tyson assistant")) || (words.some(w => isSimilar(w, "tyson", 2)) && words.some(w => isSimilar(w, "assistant", 2)))) {
        handleNavigate('tyson-assistant'); return;
    }

    const parsedCommand = parseTarannumCommand(lowerCommand);
    console.log("Hasil parseTarannumCommand:", parsedCommand);

    if (parsedCommand) {
      const targetModule = AUDITORI_MODULES.find(m => m.id === parsedCommand.module);
      console.log("Modul sasaran (targetModule):", targetModule);

      if (targetModule && currentSection === targetModule.targetSection) {
        console.log("SYARAT KONTEKS DIPENUHI: Memainkan audio.");
        speakText(`Memainkan ${parsedCommand.module} ${parsedCommand.type} Harakat ${parsedCommand.harakah}.`, "ms-MY");
        setActiveTarannumAudioCommand({ ...parsedCommand, timestamp: Date.now() });
      } else if (targetModule) {
        console.log("SYARAT KONTEKS TIDAK DIPENUHI: currentSection TIDAK SAMA dengan targetModule.targetSection.");
        console.log(`currentSection: ${currentSection}, sepatutnya: ${targetModule.targetSection}`);
         speakText(`Sila navigasi ke modul ${targetModule.name} dahulu untuk arahan ini.`, "ms-MY");
      } else {
        console.log("Modul sasaran TIDAK DITEMUI untuk parsedCommand.module:", parsedCommand.module);
         speakText(`Arahan ${parsedCommand.module || 'modul tidak dikenali'} tidak difahami dalam konteks ini.`, "ms-MY");
      }
      return;
    }
    console.log("Arahan tidak dapat diparse oleh parseTarannumCommand.");
    speakText("Arahan tidak difahami.", "ms-MY");
  }, [handleNavigate, currentSection, setActiveTarannumAudioCommand]);


  useEffect(() => {
    if (!NativeSpeechRecognition) {
      console.warn("SpeechRecognition API not available.");
      return;
    }
    const recognition = new NativeSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'ms-MY';

    recognition.onstart = () => onStartRef.current();
    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const commandText = event.results[event.results.length - 1][0].transcript.trim(); 
      onResultRef.current(commandText);
    };
    recognition.onerror = (event: SpeechRecognitionErrorEvent) => onErrorRef.current(event);
    recognition.onend = () => onEndRef.current();
    
    speechRecognitionRef.current = recognition;

    return () => { 
      speechRecognitionRef.current?.abort();
    };
  }, []); 

  const startListening = useCallback((): boolean => {
    if (!speechRecognitionRef.current) {
      if (isAccessibilityModeEnabled) speakText("Pengecaman suara tidak tersedia.", "ms-MY");
      return false;
    }
    if (isListeningForCommand) {
      // console.log("startListening: Already listening or start attempt in progress, not starting again.");
      return false;
    }

    try {
      // Optimistically set to true to prevent immediate re-entry.
      // This will be confirmed by onstart, or reset by onend/onerror/catch.
      setIsListeningForCommand(true);
      speechRecognitionRef.current.start();
      return true;
    } catch (e) {
      console.error("Error trying to start speech recognition:", e);
      let speakMsg = "Tidak dapat memulakan pengecaman suara.";
      if (e instanceof DOMException && e.name === "InvalidStateError") {
          speakMsg = "Pengecaman suara dalam keadaan tidak sah, sila cuba semula.";
      }
      if (isAccessibilityModeEnabled) speakText(speakMsg, "ms-MY");
      
      // Revert if starting failed. onstart will not fire.
      // onend might fire depending on the error, but it's safer to reset here too.
      setIsListeningForCommand(false); 
      return false;
    }
  }, [isAccessibilityModeEnabled, isListeningForCommand]); // isListeningForCommand dependency is crucial here


  useEffect(() => {
    onStartRef.current = () => {
      // isListeningForCommand is already set to true optimistically in startListening
      if(isAccessibilityModeEnabled) speakText("Sedia mendengar arahan...", "ms-MY");
    };
  }, [isAccessibilityModeEnabled]);

  useEffect(() => {
    onResultRef.current = (command: string) => {
      if(isAccessibilityModeEnabled) speakText(`Arahan dikenali: ${command}`, "ms-MY");
      processSpeechCommand(command);
    };
  }, [processSpeechCommand, isAccessibilityModeEnabled]);

  useEffect(() => {
    onErrorRef.current = (event: SpeechRecognitionErrorEvent) => {
      // isListeningForCommand will be set to false by the onend event, which follows an error.
      console.error("Speech recognition error:", event.error, event.message);
      let errorMsg = ""; 
      let shouldSpeak = true;

      if (event.error === 'no-speech') {
        errorMsg = "Tiada arahan suara dikesan.";
      } else if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
        errorMsg = "Akses mikrofon tidak dibenarkan atau disekat.";
      } else if (event.error === 'aborted') {
        shouldSpeak = false; 
      } else if (event.error === 'audio-capture') {
        errorMsg = "Masalah dengan peranti input audio.";
      } else if (event.error === 'network') {
        errorMsg = "Masalah rangkaian semasa pengecaman suara.";
      } else if (event.error === 'bad-grammar') {
        errorMsg = "Ralat tatabahasa dalam pengecaman.";
      } else if (event.error === 'language-not-supported') {
        errorMsg = "Bahasa tidak disokong untuk pengecaman suara.";
      } else if (event.error) { 
         errorMsg = `Ralat pengecaman suara: ${event.error}.`;
      }

      if (shouldSpeak && errorMsg && isAccessibilityModeEnabled) {
        speakText(errorMsg, "ms-MY");
      }
    };
  }, [isAccessibilityModeEnabled]);

  useEffect(() => {
    onEndRef.current = () => {
      setIsListeningForCommand(false);
    };
  }, [setIsListeningForCommand]);


  const stopListeningAndProcess = useCallback(() => {
    if (speechRecognitionRef.current && isListeningForCommand) {
        speechRecognitionRef.current.stop(); 
    }
  }, [isListeningForCommand]);
  
  const toggleAccessibilityMode = useCallback(() => {
    setIsAccessibilityModeEnabled(prev => {
      const newState = !prev;
      if (newState) {
        speakText("UDL MODE", "ms-MY", () => {
          playActivationSound(); 
        });
        justToggledAccessibilityModeOnRef.current = true;
        if (accessibilityModeToggleTimeoutRef.current) clearTimeout(accessibilityModeToggleTimeoutRef.current);
        accessibilityModeToggleTimeoutRef.current = window.setTimeout(() => {
          justToggledAccessibilityModeOnRef.current = false;
        }, 1000);
      } else {
        speakText("UDL MODE dinyahaktifkan", "ms-MY");
        if (speechSynthesis.speaking) speechSynthesis.cancel();
        
        if (isListeningForCommand && speechRecognitionRef.current) {
          speechRecognitionRef.current.abort();
        }
        setIsListeningForCommand(false);
        setIsSpeechNavLKeyModeActive(false); 
      }
      return newState;
    });
  }, [isListeningForCommand]); // Removed setIsListeningForCommand, setIsSpeechNavLKeyModeActive as they are handled inside or by onEnd.


  const handleToggleAdminMode = () => {
    if (isAdminMode) setIsAdminMode(false);
    else setShowAdminPasswordModal(true);
  };
  const handleAdminLoginSuccess = () => {
    setIsAdminMode(true);
    setShowAdminPasswordModal(false);
    // Navigate to a relevant admin section if needed, e.g., 'game' or 'modul-teks'
    // For now, let's navigate to 'modul-teks' as it's being modified.
    if (currentSection !== 'modul-teks' && currentSection !== 'game') handleNavigate('modul-teks');
  };
  const handleSaveRelatedLink = (linkToSave: RelatedLink) => {
    setRelatedLinks(prevLinks => {
      const existingIndex = prevLinks.findIndex(l => l.id === linkToSave.id);
      if (existingIndex > -1) {
        const updatedLinks = [...prevLinks];
        updatedLinks[existingIndex] = linkToSave;
        return updatedLinks;
      } else return [...prevLinks, linkToSave];
    });
  };
  const handleDeleteRelatedLink = (linkId: string) => {
    setRelatedLinks(prevLinks => prevLinks.filter(l => l.id !== linkId));
  };

  const handleSaveTextModule = (moduleToSave: TextModule) => {
    setTextModules(prevModules => {
      const existingIndex = prevModules.findIndex(m => m.id === moduleToSave.id);
      if (existingIndex > -1) {
        const updatedModules = [...prevModules];
        updatedModules[existingIndex] = moduleToSave;
        return updatedModules;
      } else {
        return [...prevModules, moduleToSave];
      }
    });
  };

  const handleDeleteTextModule = (moduleId: string) => {
    setTextModules(prevModules => prevModules.filter(m => m.id !== moduleId));
  };
  
  useEffect(() => {
    const sectionElement = document.getElementById(currentSection);
    if (sectionElement) setTimeout(() => sectionElement.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
    else if (currentSection === 'home') window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentSection]);

  useEffect(() => {
    let uDown = false, mDown = false;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === 'u') uDown = true;
      if (event.key.toLowerCase() === 'm') mDown = true;
      if (uDown && mDown && !keyPressTimerRef.current) {
        keyPressTimerRef.current = window.setTimeout(() => { if (uDown && mDown) toggleAccessibilityMode(); }, 2000);
      }
    };
    const handleKeyUp = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === 'u') uDown = false;
      if (event.key.toLowerCase() === 'm') mDown = false;
      if ((!uDown || !mDown) && keyPressTimerRef.current) {
        clearTimeout(keyPressTimerRef.current);
        keyPressTimerRef.current = null;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      if (keyPressTimerRef.current) clearTimeout(keyPressTimerRef.current);
      if (accessibilityModeToggleTimeoutRef.current) clearTimeout(accessibilityModeToggleTimeoutRef.current);
    };
  }, [toggleAccessibilityMode]);

  useEffect(() => {
    const handleInteraction = (event: MouseEvent | FocusEvent) => {
      if (justToggledAccessibilityModeOnRef.current) return; 
      if (!isAccessibilityModeEnabled || isListeningForCommand) return;
      
      const target = event.target as HTMLElement;
      let textToSpeak = '';
      const interactiveEl = target.closest('button, a[href], [role="button"], [role="link"], input[type="submit"], input[type="button"], select') as HTMLElement | null;
      if (interactiveEl) {
        textToSpeak = interactiveEl.getAttribute('aria-label') || '';
        if (!textToSpeak) {
            if (interactiveEl.tagName === 'INPUT' && ['submit', 'button'].includes((interactiveEl as HTMLInputElement).type)) textToSpeak = (interactiveEl as HTMLInputElement).value;
            else if (interactiveEl.tagName === 'SELECT' && event.type === 'focusin') {
                const label = document.querySelector(`label[for="${interactiveEl.id}"]`);
                textToSpeak = label?.textContent || "Pilihan";
            } else {
                const clone = interactiveEl.cloneNode(true) as HTMLElement;
                clone.querySelectorAll('i.fas, i.fab, svg').forEach(icon => icon.remove());
                textToSpeak = clone.textContent?.trim() || '';
            }
        }
      }
      if (target.tagName === 'SELECT' && event.type === 'change') {
         const selEl = target as HTMLSelectElement;
         textToSpeak = selEl.options[selEl.selectedIndex]?.text || '';
      }
      if (textToSpeak.trim()) speakText(textToSpeak.trim().replace(/\s+/g, ' '), "ms-MY");
    };
    if (isAccessibilityModeEnabled) {
      document.addEventListener('mouseover', handleInteraction);
      document.addEventListener('focusin', handleInteraction);
      document.addEventListener('click', handleInteraction, true);
      document.addEventListener('change', handleInteraction, true);
    } else {
      document.removeEventListener('mouseover', handleInteraction);
      document.removeEventListener('focusin', handleInteraction);
      document.removeEventListener('click', handleInteraction, true);
      document.removeEventListener('change', handleInteraction, true);
      if (speechSynthesis.speaking) speechSynthesis.cancel();
    }
    return () => {
      document.removeEventListener('mouseover', handleInteraction);
      document.removeEventListener('focusin', handleInteraction);
      document.removeEventListener('click', handleInteraction, true);
      document.removeEventListener('change', handleInteraction, true);
      if (speechSynthesis.speaking) speechSynthesis.cancel();
    };
  }, [isAccessibilityModeEnabled, isListeningForCommand]); 

  useEffect(() => {
    const handleLKeyDown = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === 'l' && isAccessibilityModeEnabled && !lKeyTimerRef.current && !isListeningForCommand) {
        lKeyTimerRef.current = window.setTimeout(() => {
            setIsSpeechNavLKeyModeActive(true);
            speakText("Mod navigasi suara aktif. Lepaskan L untuk berhenti.", "ms-MY", () => {
                if(isSpeechNavLKeyModeActive) startListening(); // Check isSpeechNavLKeyModeActive again in case L was released quickly
            });
        }, 1500); 
      }
    };
    const handleLKeyUp = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === 'l') {
        if (lKeyTimerRef.current) { 
          clearTimeout(lKeyTimerRef.current);
          lKeyTimerRef.current = null;
        }
        if (isSpeechNavLKeyModeActive) { 
          if (isListeningForCommand && speechRecognitionRef.current) {
            speechRecognitionRef.current.stop(); 
          } else if (speechRecognitionRef.current && !isListeningForCommand) { // if startListening was called but not yet in onstart
            speechRecognitionRef.current.abort(); 
          }
          speakText("Mod navigasi suara dihentikan.", "ms-MY");
          // isListeningForCommand will be set to false by onEnd
          setIsSpeechNavLKeyModeActive(false);
        }
      }
    };
    window.addEventListener('keydown', handleLKeyDown);
    window.addEventListener('keyup', handleLKeyUp);
    return () => {
      window.removeEventListener('keydown', handleLKeyDown);
      window.removeEventListener('keyup', handleLKeyUp);
      if (lKeyTimerRef.current) clearTimeout(lKeyTimerRef.current);
    };
  }, [isAccessibilityModeEnabled, isSpeechNavLKeyModeActive, isListeningForCommand, startListening]); // Removed stopListeningAndProcess, using direct calls

  const handleSpeechButtonPress = () => {
    if (isAccessibilityModeEnabled) {
      if (!isListeningForCommand) { 
        startListening(); 
      }
    }
  };

  const handleSpeechButtonRelease = () => {
    if (isAccessibilityModeEnabled) {
      if (isListeningForCommand && speechRecognitionRef.current) {
        speechRecognitionRef.current.stop(); 
      } else if (speechRecognitionRef.current && !isListeningForCommand) { // Button released before onstart
         speechRecognitionRef.current.abort();
      }
      // isListeningForCommand will be set to false by onEnd
    }
  };


  return (
    <>
      <div className="emoji-bg" style={{ top: '10%', left: '5%', transform: 'rotate(-15deg)' }}>📚</div>
      <div className="emoji-bg" style={{ top: '20%', right: '7%', transform: 'rotate(10deg)' }}>🎵</div>
      {/* ... other emoji backgrounds ... */}
      <div className="container mx-auto px-4 max-w-6xl">
        <Header isAdminMode={isAdminMode} relatedLinks={relatedLinks} onSaveRelatedLink={handleSaveRelatedLink} onDeleteRelatedLink={handleDeleteRelatedLink} />
        <NavigationBar currentSection={currentSection} onNavigate={handleNavigate} />
        <main id="main-content" className="relative">
          <div className={currentSection === 'home' ? '' : 'hidden'}><HomeSection onNavigate={handleNavigate} /></div>
          <div className={currentSection === 'modul-teks' ? '' : 'hidden'}>
            <ModulTeksSection 
              textModules={textModules}
              isAdminMode={isAdminMode}
              onSaveTextModule={handleSaveTextModule}
              onDeleteTextModule={handleDeleteTextModule}
            />
          </div>
          {AUDITORI_MODULES.map(module => (
             <div key={module.targetSection} className={currentSection === module.targetSection ? '' : 'hidden'}>
                <TarannumContentSection 
                  id={module.targetSection} 
                  title={`Tarannum ${module.name}`} 
                  onBack={() => handleNavigate('home')} 
                  activeTarannumAudioCommand={activeTarannumAudioCommand}
                  isAccessibilityModeEnabled={isAccessibilityModeEnabled} 
                />
             </div>
          ))}
          <div className={currentSection === 'tyson-assistant' ? '' : 'hidden'}><TysonAssistantSection /></div>
          <div className={currentSection === 'hantar-rakaman' ? '' : 'hidden'}><HantarRakamanSection /></div>
          <div className={currentSection === 'game' ? '' : 'hidden'}><TugasanSection isAdminMode={isAdminMode} onNavigate={handleNavigate} /></div>
        </main>
        <Footer isAdminMode={isAdminMode} onToggleAdminMode={handleToggleAdminMode} />
      </div>
      <AdminPasswordModal isOpen={showAdminPasswordModal} onClose={() => setShowAdminPasswordModal(false)} onSuccess={handleAdminLoginSuccess} />
      <AccessibilityTTSButton isTTSEnabled={isAccessibilityModeEnabled} onToggle={toggleAccessibilityMode} />
      {isAccessibilityModeEnabled && (
         <SpeechNavButton
            onPress={handleSpeechButtonPress}
            onRelease={handleSpeechButtonRelease}
            isCurrentlyListening={isListeningForCommand}
         />
      )}
      {isListeningForCommand && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded-md shadow-lg text-sm z-[1100]" aria-live="assertive">
            <i className="fas fa-microphone-alt mr-2 animate-pulse"></i> Sedang Mendengar...
        </div>
      )}
    </>
  );
};
export default App;