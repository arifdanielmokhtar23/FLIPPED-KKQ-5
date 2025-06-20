
export const playActivationSound = (): void => {
  if (typeof window === 'undefined') return; // Ensure running in a browser environment

  const AudioContext = window.AudioContext || (window as any).webkitAudioContext;

  if (!AudioContext) {
    console.warn("Web Audio API is not supported in this browser.");
    return;
  }

  const audioCtx = new AudioContext();

  // Create an oscillator node
  const oscillator = audioCtx.createOscillator();
  oscillator.type = 'sine'; // Sine wave for a clean tone
  oscillator.frequency.setValueAtTime(1300, audioCtx.currentTime); // Frequency in Hertz (e.g., A6 note is around 1760 Hz, G#6 1661Hz, C6 1046Hz)

  // Create a gain node to control volume and fade
  const gainNode = audioCtx.createGain();
  gainNode.gain.setValueAtTime(0.001, audioCtx.currentTime); // Start almost silent
  gainNode.gain.linearRampToValueAtTime(0.25, audioCtx.currentTime + 0.02); // Quick attack to 0.25 volume
  gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.20); // Exponential decay over ~180ms

  // Connect oscillator to gain node, and gain node to output
  oscillator.connect(gainNode);
  gainNode.connect(audioCtx.destination);

  // Start the oscillator
  oscillator.start(audioCtx.currentTime);

  // Stop the oscillator after a short duration
  oscillator.stop(audioCtx.currentTime + 0.22); // Stop after 220ms

  // Close the AudioContext after the sound has played to free up resources
  oscillator.onended = () => {
    audioCtx.close().catch(e => console.error("Error closing AudioContext:", e));
  };
};
