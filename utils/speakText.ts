
export const speakText = (text: string, lang: string = 'ms-MY', onEndCallback?: () => void): SpeechSynthesisUtterance | null => {
  if (typeof speechSynthesis === 'undefined' || !text.trim()) {
    // console.warn('Speech synthesis not supported or text is empty.');
    if (onEndCallback) { // Ensure callback is called even if speech synthesis is not supported or text is empty
        onEndCallback();
    }
    return null;
  }

  // Cancel any ongoing speech before starting a new one
  if (speechSynthesis.speaking) {
    speechSynthesis.cancel();
  }

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang;
  utterance.rate = 1.0; // Normal rate
  utterance.pitch = 1.0; // Normal pitch

  // Optional: Log available voices for debugging specific language support
  // console.log(speechSynthesis.getVoices().map(v => v.lang));
  
  // Attempt to find a Malaysian voice if available, otherwise default
  const voices = speechSynthesis.getVoices();
  const malaysianVoice = voices.find(voice => voice.lang === lang);
  if (malaysianVoice) {
    utterance.voice = malaysianVoice;
  }

  if (onEndCallback) {
    utterance.onend = onEndCallback;
    utterance.onerror = (event: SpeechSynthesisErrorEvent) => { 
      if (event.error !== 'interrupted') { // Only log if it's not a simple interruption
        console.error("Speech synthesis error code:", event.error);
      }
      if (onEndCallback) { 
        onEndCallback(); 
      }
    };
  } else {
    // Add a basic error handler even if no onEndCallback is provided, to avoid unhandled errors
    // and to prevent logging 'interrupted' errors to the console by default.
    utterance.onerror = (event: SpeechSynthesisErrorEvent) => {
      if (event.error !== 'interrupted') {
        console.error("Speech synthesis error code:", event.error);
      }
    };
  }

  speechSynthesis.speak(utterance);
  return utterance;
};