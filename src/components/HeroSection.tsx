import React, { useState } from 'react';
import { Sparkles, Calendar, Clock, MapPin, Heart, ChevronDown, Award } from 'lucide-react';
import confetti from 'canvas-confetti';
import { WeddingConfig } from '../types';
import { audioEngine } from '../utils/audioEngine';
import { CulturalDivider } from './CulturalDivider';

interface HeroSectionProps {
  config: WeddingConfig;
  onTriggerShower: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ config, onTriggerShower }) => {
  const [blessingCount, setBlessingCount] = useState(148);
  const [hasShowered, setHasShowered] = useState(false);

  const handleShowerPetals = () => {
    setBlessingCount((prev) => prev + 1);
    setHasShowered(true);
    audioEngine.playBlessingChime();
    onTriggerShower();

    confetti({
      particleCount: 65,
      spread: 75,
      origin: { y: 0.65 },
      colors: config.theme.petalColors || ['#F472B6', '#E9D5FF', '#FDE047', '#FFFFFF', '#C084FC'],
    });
  };

  const scrollToCountdown = () => {
    const el = document.getElementById('countdown-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="hero-section"
      className="relative w-full min-h-[90vh] lg:min-h-screen flex flex-col items-center justify-between text-center overflow-hidden py-12 px-4 select-none"
      style={{
        backgroundColor: config.theme.primaryBg || '#180E24',
      }}
    >
      {/* Background with Bright Natural Image */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <img
          src={config.theme.coverImage || config.heroCouplePhoto}
          alt="Wedding Celebration Backdrop"
          className="w-full h-full object-cover object-center"
        />
        {/* Subtle bottom edge gradient to cleanly blend into next section */}
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#180E24] via-[#180E24]/60 to-transparent pointer-events-none" />
        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/40 to-transparent pointer-events-none" />

        {/* Ambient twinkling light sparks */}
        <div className="absolute top-1/4 left-1/5 w-2.5 h-2.5 rounded-full bg-yellow-200 animate-sparkle" />
        <div className="absolute top-1/3 right-1/4 w-3 h-3 rounded-full bg-amber-300 animate-sparkle [animation-delay:400ms]" />
        <div className="absolute bottom-1/3 left-1/3 w-2 h-2 rounded-full bg-rose-200 animate-sparkle [animation-delay:800ms]" />
      </div>

      {/* Top Auspicious Invocation Pill */}
      <div className="relative z-20 w-full flex flex-col items-center pt-2">
        <div className="backdrop-blur-md px-6 py-2 rounded-full border border-amber-400/60 bg-[#281338]/80 shadow-[0_0_25px_rgba(245,158,11,0.35)] animate-pulse-glow">
          <p className="text-amber-300 font-cinzel text-xs sm:text-sm font-bold tracking-widest uppercase flex items-center gap-2 justify-center drop-shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-sparkle" />
            <span>{config.theme.culturalInvocation}</span>
            <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-sparkle" />
          </p>
        </div>
      </div>

      {/* Center Couple Showcase & Royal Monogram */}
      <div className="relative z-20 w-full max-w-4xl mx-auto flex flex-col items-center my-auto py-6">
        {/* Circular Avatar Frame */}
        <div className="relative mb-3">
          <div className="relative w-36 h-36 sm:w-44 sm:h-44 md:w-52 md:h-52 rounded-full p-1.5 bg-gradient-to-tr from-amber-400 via-yellow-200 to-rose-400 shadow-[0_0_40px_rgba(255,215,0,0.55)] mx-auto border-2 border-amber-200/90 animate-aura-glow transform hover:scale-105 transition-transform duration-500">
            <img
              src={config.heroCouplePhoto || config.theme.coverImage}
              alt={`${config.groomName} & ${config.brideName}`}
              className="w-full h-full object-cover rounded-full filter brightness-[1.03] contrast-[1.05]"
            />
            <div className="absolute top-1 right-3 w-3 h-3 rounded-full bg-white shadow-[0_0_12px_#FFFFFF] animate-sparkle" />
          </div>

          {/* Monogram Crest badge */}
          <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-amber-600 via-amber-500 to-amber-700 border border-amber-200 text-[11px] font-title font-bold text-neutral-950 shadow-lg tracking-widest uppercase">
            {config.monogramText}
          </div>
        </div>

        {/* Couple Names in Elegant Typography */}
        <div className="relative my-2 py-1 px-4">
          <h1 className="font-script text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-amber-200 drop-shadow-[0_4px_16px_rgba(0,0,0,0.95)] drop-shadow-[0_2px_6px_rgba(0,0,0,1)] tracking-wide mb-1">
            {config.groomName} <span className="text-rose-300 font-editorial italic text-3xl sm:text-5xl">&amp;</span> {config.brideName}
          </h1>
        </div>

        <div className="backdrop-blur-md px-4 py-1.5 rounded-full bg-black/55 border border-amber-400/40 mb-4 inline-block shadow-lg">
          <p className="text-xs sm:text-sm font-cinzel text-amber-100 font-bold tracking-[0.2em] uppercase">
            Together with their families, cordially invite you to celebrate their wedding
          </p>
        </div>

        {/* Sacred Sanskrit Shloka Box */}
        <div className="max-w-xl mx-auto px-4 py-3.5 rounded-2xl backdrop-blur-md bg-neutral-950/75 border border-amber-400/50 shadow-2xl mb-5">
          <p className="font-editorial italic text-sm sm:text-base text-amber-200 leading-relaxed drop-shadow-sm">
            “{config.theme.shloka}”
          </p>
          <div className="w-16 h-[1px] bg-amber-400/40 mx-auto my-2" />
          <p className="text-[11px] sm:text-xs text-neutral-300 font-body">
            {config.theme.shlokaMeaning}
          </p>
        </div>

        {/* Date & Venue highlights */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs sm:text-sm font-cinzel text-amber-200 font-semibold mb-6">
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-black/65 backdrop-blur-md border border-amber-400/40 shadow-lg">
            <Calendar className="w-4 h-4 text-amber-400" />
            <span>{config.weddingDateFormatted}</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-black/65 backdrop-blur-md border border-amber-400/40 shadow-lg">
            <Clock className="w-4 h-4 text-amber-400" />
            <span>{config.weddingTime} IST</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-black/65 backdrop-blur-md border border-amber-400/40 shadow-lg">
            <MapPin className="w-4 h-4 text-amber-400" />
            <span>{config.venueName}, {config.venueCity}</span>
          </div>
        </div>

        {/* Interactive Shower Petals Button */}
        <button
          id="hero-shower-petals-btn"
          type="button"
          onClick={handleShowerPetals}
          className="group relative inline-flex items-center gap-3 px-8 sm:px-10 py-3 sm:py-3.5 rounded-full bg-gradient-to-r from-amber-600 via-rose-600 to-amber-600 text-white text-xs sm:text-sm font-cinzel font-bold tracking-widest uppercase shadow-[0_0_30px_rgba(245,158,11,0.5)] border border-amber-300 transform active:scale-95 hover:scale-105 transition-all shining-sweep"
        >
          <Heart
            className={`w-4 h-4 text-amber-200 transition-transform ${
              hasShowered ? 'fill-rose-300 text-rose-300 scale-125' : 'group-hover:scale-110'
            }`}
          />
          <span>Shower Auspicious Petals ✨</span>
          <span className="bg-black/50 px-2.5 py-0.5 rounded-full text-xs font-mono text-amber-200 font-bold border border-amber-300/30">
            {blessingCount}
          </span>
        </button>
      </div>

      {/* Bottom Scroll Prompt */}
      <div className="relative z-20 w-full flex flex-col items-center pb-2">
        <button
          type="button"
          onClick={scrollToCountdown}
          className="flex flex-col items-center gap-1 text-amber-300/80 hover:text-amber-200 transition-colors group cursor-pointer"
        >
          <span className="text-[10px] sm:text-xs font-cinzel tracking-widest uppercase">
            Explore Wedding Itinerary
          </span>
          <ChevronDown className="w-4 h-4 animate-bounce text-amber-400 group-hover:scale-110" />
        </button>
      </div>
    </section>
  );
};
