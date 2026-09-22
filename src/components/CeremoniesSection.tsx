import React, { useState, useEffect } from 'react';
import { Sparkles, Calendar, Clock, MapPin, Heart, ChevronRight, Share2, Compass, RotateCw } from 'lucide-react';
import confetti from 'canvas-confetti';
import { WeddingConfig, CeremonyEvent } from '../types';
import { audioEngine } from '../utils/audioEngine';

interface CeremoniesSectionProps {
  config: WeddingConfig;
  onTriggerShower: () => void;
}

export const CeremoniesSection: React.FC<CeremoniesSectionProps> = ({ config, onTriggerShower }) => {
  const events = config.events || [];
  const [activeEventId, setActiveEventId] = useState<string>(events[0]?.id || 'e-pr-1');

  // Blessing counts per event, persisted in localStorage
  const [blessingCounts, setBlessingCounts] = useState<{ [id: string]: number }>(() => {
    const initial: { [id: string]: number } = {};
    events.forEach((ev, idx) => {
      const saved = localStorage.getItem(`wedding_blessing_${ev.id}`);
      if (saved) {
        initial[ev.id] = parseInt(saved, 10) || 120 + idx * 45;
      } else {
        initial[ev.id] = ev.blessingCount || 120 + idx * 45;
      }
    });
    return initial;
  });

  // Flipped state per card
  const [flippedCards, setFlippedCards] = useState<{ [id: string]: boolean }>({});

  // 3D Tilt per card
  const [tilt, setTilt] = useState<{ id: string | null; x: number; y: number }>({
    id: null,
    x: 0,
    y: 0,
  });

  const handleCardMouseMove = (e: React.MouseEvent<HTMLDivElement>, id: string) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = -((y - centerY) / centerY) * 8;
    const rotateY = ((x - centerX) / centerX) * 8;
    setTilt({ id, x: rotateX, y: rotateY });
  };

  const handleCardMouseLeave = () => {
    setTilt({ id: null, x: 0, y: 0 });
  };

  const handleFlipCard = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    audioEngine.playCardFlipSound();
    setFlippedCards((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleBlessCeremony = (event: CeremonyEvent, e: React.MouseEvent) => {
    e.stopPropagation();
    const current = (blessingCounts[event.id] || 100) + 1;
    setBlessingCounts((prev) => ({ ...prev, [event.id]: current }));
    localStorage.setItem(`wedding_blessing_${event.id}`, current.toString());

    // Play appropriate sound effect
    const lower = event.title.toLowerCase();
    if (lower.includes('haldi') || lower.includes('mehendi')) {
      audioEngine.playTempleBellSound();
    } else if (lower.includes('sangeet') || lower.includes('reception')) {
      audioEngine.playFireworkSound();
    } else {
      audioEngine.playBlessingChime();
    }

    confetti({
      particleCount: 55,
      spread: 75,
      origin: { y: 0.65 },
      colors: config.theme.petalColors || ['#F472B6', '#E9D5FF', '#FDE047', '#FFFFFF', '#C084FC'],
    });

    onTriggerShower();
  };

  const handleAddToCalendar = (event: CeremonyEvent, e: React.MouseEvent) => {
    e.stopPropagation();
    const title = encodeURIComponent(`${event.title} - ${config.groomName} & ${config.brideName}'s Wedding`);
    const details = encodeURIComponent(
      `${event.description}\n\nDress Code: ${event.dressCode || 'Traditional Festive'}\nVenue: ${event.venue}\nCouple: ${config.groomName} & ${config.brideName}`
    );
    const location = encodeURIComponent(`${event.venue}, ${config.venueCity}`);
    const dateStamp = config.weddingDate.replace(/-/g, '');
    const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}&dates=${dateStamp}T100000Z/${dateStamp}T230000Z`;
    window.open(url, '_blank');
  };

  const scrollToEvent = (id: string) => {
    setActiveEventId(id);
    const el = document.getElementById(`ceremony-section-${id}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div id="ceremonies-itinerary-section" className="relative w-full text-white">
      {/* Sticky Top Ceremonies Navigator */}
      <div className="sticky top-14 z-30 w-full bg-neutral-950/90 backdrop-blur-md border-y border-amber-500/30 px-3 py-2 flex items-center justify-between shadow-xl">
        <div className="flex items-center gap-1.5 shrink-0 pr-3">
          <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-sparkle" />
          <span className="font-cinzel text-xs font-bold text-amber-200 uppercase tracking-widest hidden sm:inline">
            3D Ceremonies:
          </span>
        </div>

        {/* Scrollable event tabs */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
          {events.map((ev) => {
            const isActive = activeEventId === ev.id;
            return (
              <button
                key={ev.id}
                type="button"
                onClick={() => scrollToEvent(ev.id)}
                className={`px-3.5 py-1 rounded-full text-xs font-cinzel font-bold whitespace-nowrap transition-all flex items-center gap-2 border ${
                  isActive
                    ? 'bg-gradient-to-r from-amber-500 to-rose-600 text-white border-amber-300 shadow-[0_0_15px_rgba(251,191,36,0.4)] scale-105'
                    : 'bg-black/50 text-neutral-300 hover:text-amber-200 border-amber-500/30 hover:border-amber-400/60'
                }`}
              >
                <span>{ev.title}</span>
                <span className="text-[10px] opacity-80 font-mono">
                  ({blessingCounts[ev.id] || 0})
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* RENDER EACH CEREMONY EVENT */}
      {events.map((ev) => {
        const isFlipped = !!flippedCards[ev.id];
        const isTilting = tilt.id === ev.id;
        const count = blessingCounts[ev.id] || 0;

        return (
          <section
            key={ev.id}
            id={`ceremony-section-${ev.id}`}
            className="relative w-full min-h-[750px] py-16 px-4 sm:px-6 flex flex-col items-center justify-center overflow-hidden border-b border-amber-500/30 select-none bg-[#0E0617]"
          >
            {/* Background Image of the ceremony - Bright as the original image */}
            <div className="absolute inset-0 z-0 overflow-hidden">
              <img
                src={ev.photoUrl}
                alt={ev.title}
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-black/25" />
              <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#0E0617] to-transparent pointer-events-none" />
              <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-black/40 to-transparent pointer-events-none" />
            </div>

            {/* Content Container */}
            <div className="relative z-10 w-full max-w-sm sm:max-w-md md:max-w-lg aspect-[3/4] perspective-1000 my-auto flex items-center justify-center">
              {/* Flip & Tilt Card Box */}
              <div
                onMouseMove={(e) => handleCardMouseMove(e, ev.id)}
                onMouseLeave={handleCardMouseLeave}
                className="relative w-full h-full preserve-3d transition-transform duration-500 ease-out"
                style={{
                  transform: `${
                    isTilting ? `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)` : ''
                  } ${isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'}`,
                }}
              >
                {/* FRONT OF THE CEREMONY CARD */}
                <div
                  className="absolute inset-0 w-full h-full rounded-2xl p-5 sm:p-6 border-2 border-amber-400/70 shadow-[0_20px_50px_rgba(0,0,0,0.85)] flex flex-col justify-between backdrop-blur-md overflow-hidden backface-hidden"
                  style={{
                    backgroundColor: 'rgba(24, 10, 34, 0.88)',
                    backfaceVisibility: 'hidden',
                    WebkitBackfaceVisibility: 'hidden',
                  }}
                >
                  {/* Top Badge and Date */}
                  <div className="flex items-center justify-between">
                    <div className="px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/50 flex items-center gap-1.5">
                      <Sparkles className="w-3 h-3 text-amber-400 animate-sparkle" />
                      <span className="text-[10px] sm:text-xs font-cinzel font-bold text-amber-300 uppercase tracking-wider">
                        Ceremony Itinerary
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs font-cinzel text-amber-200">
                      <Calendar className="w-3.5 h-3.5 text-amber-400" />
                      <span>{ev.date}</span>
                    </div>
                  </div>

                  {/* Ceremony Image Preview */}
                  <div className="relative w-full h-44 sm:h-52 rounded-xl overflow-hidden border border-amber-400/40 shadow-lg my-2 group">
                    <img
                      src={ev.photoUrl}
                      alt={ev.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                    <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-xs text-amber-200 font-cinzel">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-amber-400" />
                        {ev.time}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-amber-400" />
                        {ev.venue}
                      </span>
                    </div>
                  </div>

                  {/* Title and Short Description */}
                  <div className="text-center">
                    <h3 className="font-classic text-xl sm:text-2xl font-bold text-amber-100">
                      {ev.title}
                    </h3>
                    <p className="text-xs text-neutral-300 font-editorial italic line-clamp-2 mt-1 px-1">
                      {ev.description}
                    </p>
                  </div>

                  {/* Actions: Bless Ceremony + Flip for Details */}
                  <div className="flex flex-col gap-2 pt-2">
                    <button
                      type="button"
                      onClick={(e) => handleBlessCeremony(ev, e)}
                      className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 via-rose-600 to-amber-600 text-white text-xs font-cinzel font-bold tracking-wider uppercase shadow-[0_0_20px_rgba(245,158,11,0.4)] border border-amber-300 active:scale-95 transition-all flex items-center justify-center gap-2 shining-sweep"
                    >
                      <Heart className="w-4 h-4 text-amber-200 fill-current" />
                      <span>Shower Blessings ✨</span>
                      <span className="bg-black/40 px-2 py-0.5 rounded-full text-[11px] font-mono text-amber-200 font-bold">
                        {count}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={(e) => handleFlipCard(ev.id, e)}
                      className="w-full py-2 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-amber-400/40 text-xs font-cinzel text-amber-200 font-semibold transition-colors flex items-center justify-center gap-1.5"
                    >
                      <RotateCw className="w-3.5 h-3.5 text-amber-400" />
                      <span>View Dress Code &amp; Event Details</span>
                    </button>
                  </div>
                </div>

                {/* BACK OF THE CEREMONY CARD (FLIPPED) */}
                <div
                  className="absolute inset-0 w-full h-full rounded-2xl p-6 border-2 border-amber-400/70 shadow-[0_20px_50px_rgba(0,0,0,0.85)] flex flex-col justify-between backdrop-blur-xl overflow-hidden"
                  style={{
                    backgroundColor: 'rgba(28, 12, 40, 0.95)',
                    transform: 'rotateY(180deg)',
                    backfaceVisibility: 'hidden',
                    WebkitBackfaceVisibility: 'hidden',
                  }}
                >
                  <div className="w-full text-center">
                    <span className="text-xs font-cinzel font-bold text-amber-400 uppercase tracking-widest">
                      Ceremony Details
                    </span>
                    <h3 className="font-classic text-xl sm:text-2xl font-bold text-amber-100 mt-1">
                      {ev.title}
                    </h3>
                  </div>

                  <div className="my-auto space-y-4 text-left">
                    {/* Time & Date */}
                    <div className="p-3 rounded-xl bg-black/40 border border-amber-500/30">
                      <span className="text-[10px] font-cinzel uppercase text-amber-400 font-bold block mb-1">
                        Auspicious Muhurat &amp; Timing
                      </span>
                      <p className="text-xs font-cinzel text-neutral-200 flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span>{ev.time} • {ev.date}</span>
                      </p>
                    </div>

                    {/* Venue Location */}
                    <div className="p-3 rounded-xl bg-black/40 border border-amber-500/30">
                      <span className="text-[10px] font-cinzel uppercase text-amber-400 font-bold block mb-1">
                        Venue Pavilion
                      </span>
                      <p className="text-xs font-cinzel text-neutral-200 flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span>{ev.venue}, {config.venueCity}</span>
                      </p>
                    </div>

                    {/* Dress Code */}
                    <div className="p-3 rounded-xl bg-black/40 border border-amber-500/30">
                      <span className="text-[10px] font-cinzel uppercase text-amber-400 font-bold block mb-1">
                        Dress Code &amp; Palette
                      </span>
                      <p className="text-xs font-body text-amber-200">
                        {ev.dressCode || 'Traditional Wedding Festive'}
                      </p>
                    </div>

                    {/* Full Description */}
                    <p className="text-xs text-neutral-300 font-editorial italic leading-relaxed px-1">
                      {ev.description}
                    </p>
                  </div>

                  {/* Actions: Add to Calendar & Flip Back */}
                  <div className="flex items-center gap-2 pt-2">
                    <button
                      type="button"
                      onClick={(e) => handleAddToCalendar(ev, e)}
                      className="flex-1 py-2.5 px-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-neutral-950 text-xs font-cinzel font-bold transition-transform active:scale-95 flex items-center justify-center gap-1.5 shadow-md"
                    >
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Add to Calendar</span>
                    </button>

                    <button
                      type="button"
                      onClick={(e) => handleFlipCard(ev.id, e)}
                      className="py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/20 border border-amber-400/40 text-xs font-cinzel text-amber-200 font-semibold transition-colors flex items-center justify-center gap-1"
                    >
                      <RotateCw className="w-3.5 h-3.5 text-amber-400" />
                      <span>Back</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        );
      })}
    </div>
  );
};
