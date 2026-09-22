import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Music } from 'lucide-react';
import { audioEngine } from '../utils/audioEngine';

export const MusicToggle: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  useEffect(() => {
    // Attempt auto-play on first user click anywhere if not yet playing
    const handleFirstClick = () => {
      if (!hasInteracted) {
        setHasInteracted(true);
      }
    };
    window.addEventListener('click', handleFirstClick, { once: true });
    return () => window.removeEventListener('click', handleFirstClick);
  }, [hasInteracted]);

  const handleToggle = () => {
    const active = audioEngine.toggleMusic();
    setIsPlaying(active);
  };

  return (
    <div className="fixed top-4 right-4 z-50 flex items-center gap-2">
      <button
        id="audio-music-toggle-btn"
        type="button"
        onClick={handleToggle}
        aria-label={isPlaying ? 'Mute wedding music' : 'Play ambient wedding music'}
        className={`group relative flex items-center gap-2 px-3.5 py-2 rounded-full backdrop-blur-xl border transition-all duration-300 shadow-xl ${
          isPlaying
            ? 'bg-amber-950/80 border-amber-400 text-amber-200 shadow-[0_0_20px_rgba(251,191,36,0.5)]'
            : 'bg-neutral-900/80 border-neutral-700/80 text-neutral-300 hover:text-amber-200 hover:border-amber-400/50'
        }`}
      >
        {/* Animated Sound Wave bars or Mute icon */}
        {isPlaying ? (
          <div className="flex items-center gap-0.5 h-4 w-4 justify-center">
            <span className="w-0.5 bg-amber-300 rounded-full animate-[pulse_0.6s_ease-in-out_infinite] h-3" />
            <span className="w-0.5 bg-amber-300 rounded-full animate-[pulse_0.8s_ease-in-out_infinite_0.2s] h-4" />
            <span className="w-0.5 bg-amber-300 rounded-full animate-[pulse_0.5s_ease-in-out_infinite_0.4s] h-2.5" />
            <span className="w-0.5 bg-amber-300 rounded-full animate-[pulse_0.7s_ease-in-out_infinite_0.1s] h-3.5" />
          </div>
        ) : (
          <VolumeX className="w-4 h-4 text-neutral-400 group-hover:text-amber-300 transition-colors" />
        )}

        <div className="flex flex-col text-left">
          <span className="text-[10px] sm:text-xs font-cinzel font-bold tracking-wider uppercase">
            {isPlaying ? 'Shehnai Ambience' : 'Play Music'}
          </span>
          <span className="text-[8px] sm:text-[9px] font-body text-amber-300/80 hidden sm:block">
            {isPlaying ? 'Harmonic Flute & Raga' : 'Tap for Wedding Sound'}
          </span>
        </div>

        <div
          className={`w-6 h-6 rounded-full border flex items-center justify-center transition-transform duration-700 ${
            isPlaying
              ? 'bg-amber-500 text-neutral-950 border-amber-300 animate-spin-slow'
              : 'bg-neutral-800 text-neutral-400 border-neutral-700'
          }`}
        >
          <Music className="w-3 h-3" />
        </div>
      </button>
    </div>
  );
};
