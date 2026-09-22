import React, { useState, useEffect } from 'react';
import { Clock, Calendar, Sparkles, Heart } from 'lucide-react';
import { WeddingConfig } from '../types';

interface CountdownSectionProps {
  config: WeddingConfig;
}

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isPast: boolean;
}

export const CountdownSection: React.FC<CountdownSectionProps> = ({ config }) => {
  const calculateTimeLeft = (): TimeRemaining => {
    // Standardize to IST (UTC +5:30)
    // Format: "YYYY-MM-DD" + "06:30 PM"
    const dateStr = config.weddingDate || '2026-12-14';
    let timeStr = config.weddingTime || '18:30';

    // Parse time to 24-hr
    let hours = 18;
    let mins = 30;
    if (timeStr.toLowerCase().includes('pm')) {
      const match = timeStr.match(/(\d+):(\d+)/);
      if (match) {
        hours = parseInt(match[1], 10) % 12 + 12;
        mins = parseInt(match[2], 10);
      }
    } else if (timeStr.toLowerCase().includes('am')) {
      const match = timeStr.match(/(\d+):(\d+)/);
      if (match) {
        hours = parseInt(match[1], 10) % 12;
        mins = parseInt(match[2], 10);
      }
    }

    // IST date target
    const target = new Date(`${dateStr}T${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}:00+05:30`).getTime();
    const now = new Date().getTime();
    const diff = target - now;

    if (diff <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true };
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const remHours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    return { days, hours: remHours, minutes, seconds, isPast: false };
  };

  const [timeLeft, setTimeLeft] = useState<TimeRemaining>(calculateTimeLeft());

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearInterval(interval);
  }, [config.weddingDate, config.weddingTime]);

  return (
    <section
      id="countdown-section"
      className="relative w-full py-14 px-4 bg-gradient-to-b from-[#180E24] via-[#200E2E] to-[#180E24] border-y border-amber-500/20 text-white overflow-hidden select-none"
    >
      <div className="max-w-4xl mx-auto flex flex-col items-center text-center">
        {/* Top Monogram and Header */}
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-4 h-4 text-amber-400 animate-sparkle" />
          <span className="font-cinzel text-xs sm:text-sm font-bold tracking-[0.2em] text-amber-300 uppercase">
            Auspicious Countdown To Forever
          </span>
          <Sparkles className="w-4 h-4 text-amber-400 animate-sparkle" />
        </div>

        <h2 className="font-classic text-2xl sm:text-3xl md:text-4xl font-bold text-amber-100 mb-2">
          Until We Say &ldquo;Qubool Hai &amp; Saat Phere&rdquo;
        </h2>
        <p className="text-xs sm:text-sm text-neutral-300 font-editorial italic max-w-lg mb-8">
          Every second brings us closer to the sacred vows, laughter, and lifelong partnership.
        </p>

        {/* 4 Countdown Boxes */}
        <div className="grid grid-cols-4 gap-3 sm:gap-6 w-full max-w-xl mx-auto mb-8">
          {/* Days */}
          <div className="relative group bg-neutral-950/70 backdrop-blur-md border border-amber-400/50 rounded-2xl py-3.5 sm:py-5 px-2 flex flex-col items-center shadow-[0_4px_20px_rgba(0,0,0,0.6)] transform hover:scale-105 transition-all">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-amber-500/10 to-transparent pointer-events-none" />
            <span className="font-cinzel text-2xl sm:text-4xl md:text-5xl font-bold text-amber-200 drop-shadow-[0_0_8px_rgba(255,215,0,0.5)]">
              {String(timeLeft.days).padStart(2, '0')}
            </span>
            <span className="text-[10px] sm:text-xs text-amber-300 font-cinzel uppercase tracking-widest font-semibold mt-1">
              Days
            </span>
          </div>

          {/* Hours */}
          <div className="relative group bg-neutral-950/70 backdrop-blur-md border border-amber-400/50 rounded-2xl py-3.5 sm:py-5 px-2 flex flex-col items-center shadow-[0_4px_20px_rgba(0,0,0,0.6)] transform hover:scale-105 transition-all">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-amber-500/10 to-transparent pointer-events-none" />
            <span className="font-cinzel text-2xl sm:text-4xl md:text-5xl font-bold text-amber-200 drop-shadow-[0_0_8px_rgba(255,215,0,0.5)]">
              {String(timeLeft.hours).padStart(2, '0')}
            </span>
            <span className="text-[10px] sm:text-xs text-amber-300 font-cinzel uppercase tracking-widest font-semibold mt-1">
              Hours
            </span>
          </div>

          {/* Minutes */}
          <div className="relative group bg-neutral-950/70 backdrop-blur-md border border-amber-400/50 rounded-2xl py-3.5 sm:py-5 px-2 flex flex-col items-center shadow-[0_4px_20px_rgba(0,0,0,0.6)] transform hover:scale-105 transition-all">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-amber-500/10 to-transparent pointer-events-none" />
            <span className="font-cinzel text-2xl sm:text-4xl md:text-5xl font-bold text-amber-200 drop-shadow-[0_0_8px_rgba(255,215,0,0.5)]">
              {String(timeLeft.minutes).padStart(2, '0')}
            </span>
            <span className="text-[10px] sm:text-xs text-amber-300 font-cinzel uppercase tracking-widest font-semibold mt-1">
              Mins
            </span>
          </div>

          {/* Seconds with pulsing live indicator */}
          <div className="relative group bg-neutral-950/70 backdrop-blur-md border border-amber-400/50 rounded-2xl py-3.5 sm:py-5 px-2 flex flex-col items-center shadow-[0_4px_20px_rgba(0,0,0,0.6)] transform hover:scale-105 transition-all overflow-hidden">
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-amber-400 animate-ping opacity-80" />
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-amber-500/10 to-transparent pointer-events-none" />
            <span className="font-cinzel text-2xl sm:text-4xl md:text-5xl font-bold text-amber-200 drop-shadow-[0_0_8px_rgba(255,215,0,0.5)]">
              {String(timeLeft.seconds).padStart(2, '0')}
            </span>
            <span className="text-[10px] sm:text-xs text-amber-300 font-cinzel uppercase tracking-widest font-semibold mt-1">
              Secs
            </span>
          </div>
        </div>

        {/* Date and Time confirmation footer */}
        <div className="pt-4 border-t border-amber-500/30 flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs sm:text-sm font-cinzel text-amber-200">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-amber-400" />
            <span>{config.weddingDateFormatted}</span>
          </div>
          <span className="text-amber-500/40">•</span>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-400" />
            <span>{config.weddingTime} (Indian Standard Time)</span>
          </div>
        </div>
      </div>
    </section>
  );
};
