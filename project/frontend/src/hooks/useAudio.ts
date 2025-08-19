import { useEffect, useRef } from 'react';

export const useAudio = () => {
  const audioContextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    // Initialize audio context on first user interaction
    const initAudio = () => {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
    };

    document.addEventListener('click', initAudio, { once: true });
    return () => document.removeEventListener('click', initAudio);
  }, []);

  const playTone = (frequency: number, duration: number, volume: number = 0.1) => {
    if (!audioContextRef.current) return;

    const oscillator = audioContextRef.current.createOscillator();
    const gainNode = audioContextRef.current.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContextRef.current.destination);

    oscillator.frequency.setValueAtTime(frequency, audioContextRef.current.currentTime);
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(0, audioContextRef.current.currentTime);
    gainNode.gain.linearRampToValueAtTime(volume, audioContextRef.current.currentTime + 0.1);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioContextRef.current.currentTime + duration);

    oscillator.start(audioContextRef.current.currentTime);
    oscillator.stop(audioContextRef.current.currentTime + duration);
  };

  const playWelcomeChime = () => {
    playTone(523.25, 0.3); // C5
    setTimeout(() => playTone(659.25, 0.3), 200); // E5
    setTimeout(() => playTone(783.99, 0.5), 400); // G5
  };

  const playFocusChime = () => {
    playTone(440, 0.8, 0.05); // A4 - soft and long
  };

  const playLunchJingle = () => {
    playTone(523.25, 0.2); // C5
    setTimeout(() => playTone(587.33, 0.2), 150); // D5
    setTimeout(() => playTone(659.25, 0.3), 300); // E5
  };

  const playEndDayFade = () => {
    playTone(392, 1.5, 0.08); // G4 - low and peaceful
  };

  // --- THIS IS THE NEW SOUND ---
  const playNewLeaderChime = () => {
    playTone(659.25, 0.2); // E5
    setTimeout(() => playTone(783.99, 0.2), 100); // G5
    setTimeout(() => playTone(1046.50, 0.4), 200); // C6 - High C for fanfare
  };

  return {
    playWelcomeChime,
    playFocusChime,
    playLunchJingle,
    playEndDayFade,
    playNewLeaderChime // Export the new function
  };
};
