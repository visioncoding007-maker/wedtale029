import React, { useState } from 'react';
import { Sparkles, Heart, MapPin, Calendar, Share2, Check, ExternalLink, QrCode, Gift } from 'lucide-react';
import confetti from 'canvas-confetti';
import { WeddingConfig } from '../types';
import { audioEngine } from '../utils/audioEngine';

interface BlessingsFarewellSectionProps {
  config: WeddingConfig;
  onTriggerShower: () => void;
  onOpenShareModal: () => void;
}

export const BlessingsFarewellSection: React.FC<BlessingsFarewellSectionProps> = ({
  config,
  onTriggerShower,
  onOpenShareModal,
}) => {
  const [hasBlessed, setHasBlessed] = useState(false);
  const [totalBlessings, setTotalBlessings] = useState(256);

  const handleBless = () => {
    setTotalBlessings((prev) => prev + 1);
    setHasBlessed(true);
    audioEngine.playBlessingChime();

    confetti({
      particleCount: 75,
      spread: 80,
      origin: { y: 0.8 },
      colors: config.theme.petalColors || ['#F472B6', '#E9D5FF', '#FDE047', '#FFFFFF', '#C084FC'],
    });

    onTriggerShower();
  };

  const handleOpenMap = () => {
    window.open(config.googleMapsUrl || `https://maps.google.com/?q=${encodeURIComponent(`${config.venueName} ${config.venueCity}`)}`, '_blank');
  };

  const handleAddToCalendar = () => {
    const title = encodeURIComponent(`${config.groomName} & ${config.brideName}'s Wedding`);
    const details = encodeURIComponent(
      `Join us in celebrating the wedding celebration of ${config.groomName} & ${config.brideName} at ${config.venueName}, ${config.venueCity}.\n\nTime: ${config.weddingTime} IST.\nAddress: ${config.venueAddress}`
    );
    const location = encodeURIComponent(`${config.venueName}, ${config.venueCity}`);
    const dateStamp = config.weddingDate.replace(/-/g, '');
    const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}&dates=${dateStamp}T130000Z/${dateStamp}T180000Z`;
    window.open(url, '_blank');
  };

  return (
    <section
      id="blessings-farewell-section"
      className="relative w-full py-16 px-4 text-white flex flex-col items-center justify-between border-t border-amber-500/30 overflow-hidden select-none"
      style={{
        background: 'linear-gradient(to bottom, #0E0617, #240E35, #0A0410)',
      }}
    >
      {/* Background ambient pattern & gold glow */}
      <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(#D4AF37_1px,transparent_1px)] [background-size:20px_20px]" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-80 h-80 rounded-full blur-3xl pointer-events-none opacity-35 bg-amber-600" />

      {/* Top Auspicious Note */}
      <div className="relative z-10 text-center max-w-lg pt-2">
        <p className="font-cinzel text-xs sm:text-sm font-bold tracking-[0.25em] text-amber-300 uppercase mb-1 drop-shadow-sm">
          {config.theme.culturalInvocation || '॥ OM SHANTI SHANTI • PASTEL ROMANCE & HARMONY ॥'}
        </p>
        <p className="text-[10px] sm:text-xs text-amber-200/70 font-cinzel tracking-wider uppercase mb-4">
          ॥ ETERNAL LOVE • SACRED UNION &amp; DIVINE BLESSINGS ॥
        </p>
      </div>

      {/* Central Royal Parchment Card */}
      <div className="relative z-10 w-full max-w-sm sm:max-w-md md:max-w-xl my-4 backdrop-blur-md rounded-2xl p-6 sm:p-8 border border-amber-400/60 shadow-[0_15px_45px_rgba(0,0,0,0.85)] text-center transition-transform duration-300 hover:scale-[1.01] bg-[#1E0B2B]/90">
        {/* Monogram Seal */}
        <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-full bg-gradient-to-br from-amber-400 via-amber-600 to-amber-900 p-0.5 shadow-[0_0_25px_rgba(255,215,0,0.55)] mb-4 transform hover:rotate-6 transition-transform">
          <div className="w-full h-full rounded-full bg-neutral-950 flex items-center justify-center border border-amber-300/50">
            <span className="font-title text-xl sm:text-2xl text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-100 to-amber-300 font-bold tracking-widest">
              {config.monogramText}
            </span>
          </div>
        </div>

        {/* Couple Names */}
        <h3 className="font-classic text-2xl sm:text-3xl font-bold text-amber-100 mb-1">
          {config.groomName} &amp; {config.brideName}
        </h3>
        <p className="text-xs sm:text-sm font-cinzel text-amber-400 tracking-wider uppercase mb-4">
          {config.weddingDateFormatted} • {config.venueCity}
        </p>

        {/* Heartfelt Note */}
        <p className="text-xs sm:text-sm text-neutral-300 font-editorial italic leading-relaxed px-2 sm:px-6 mb-6">
          &ldquo;With the blessings of our elders and the warmth of beloved family &amp; friends, we eagerly look forward to your gracious presence on our most auspicious day.&rdquo;
        </p>

        {/* Big Blessings Shower Button */}
        <div className="max-w-md mx-auto w-full">
          <button
            id="bless-couple-action-btn"
            type="button"
            onClick={handleBless}
            className="w-full py-3 sm:py-3.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 via-rose-600 to-amber-600 hover:opacity-95 text-white text-xs sm:text-sm font-cinzel font-bold shadow-[0_0_25px_rgba(245,158,11,0.5)] border border-amber-300 transition-transform active:scale-95 flex items-center justify-center gap-2 mb-3 shining-sweep"
          >
            <Heart className={`w-4 h-4 ${hasBlessed ? 'fill-current text-rose-200' : 'text-amber-200'}`} />
            <span>{hasBlessed ? 'Blessings Showered! 🌸' : 'Shower Blessings upon the Couple'}</span>
          </button>
        </div>

        {/* Auspicious Blessings Counter */}
        <div className="text-[11px] sm:text-xs text-amber-300 font-cinzel flex items-center justify-center gap-1.5 font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-sparkle" />
          <span>{totalBlessings} Auspicious Blessings Received ✨</span>
        </div>

        {/* Shagun & Wedding Gifts Quick Link for Relatives */}
        <div className="max-w-md mx-auto w-full mt-3">
          <a
            id="farewell-gift-link-btn"
            href={config.giftRegistryUrl || 'https://superprofile.bio/vp/gift-here'}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-2.5 px-4 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-400/40 text-amber-200 hover:text-amber-100 text-xs font-cinzel font-semibold flex items-center justify-center gap-2 transition-all"
          >
            <Gift className="w-3.5 h-3.5 text-amber-400" />
            <span>Send Wedding Gift &amp; Shagun from Relatives</span>
            <ExternalLink className="w-3 h-3 text-amber-400/80" />
          </a>
        </div>

        {/* Action Buttons: Venue Map + Add to Calendar + Share */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 mt-6 pt-5 border-t border-amber-400/20">
          <button
            type="button"
            onClick={handleOpenMap}
            className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-amber-400/30 text-xs font-cinzel font-semibold text-amber-200 transition-colors"
          >
            <MapPin className="w-3.5 h-3.5 text-amber-400" />
            <span>Venue Map</span>
          </button>

          <button
            type="button"
            onClick={handleAddToCalendar}
            className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-amber-400/30 text-xs font-cinzel font-semibold text-amber-200 transition-colors"
          >
            <Calendar className="w-3.5 h-3.5 text-amber-400" />
            <span>Add to Calendar</span>
          </button>

          <button
            type="button"
            onClick={onOpenShareModal}
            className="col-span-2 sm:col-span-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-amber-400/30 text-xs font-cinzel font-semibold text-amber-200 transition-colors"
          >
            <Share2 className="w-3.5 h-3.5 text-amber-400" />
            <span>Share Invitation</span>
          </button>
        </div>
      </div>

      {/* Bottom Footer Info */}
      <div className="relative z-10 text-center pb-4 pt-6">
        <p className="text-[11px] sm:text-xs font-cinzel text-amber-400/90 tracking-widest uppercase">
          ॥ WITH HEARTFELT GRATITUDE • ROYAL WEDDING CELEBRATION ॥
        </p>
        <p className="text-[10px] text-neutral-400 mt-1 font-body">
          {config.venueName} • {config.venueAddress}
        </p>
        <p className="text-[9px] text-neutral-500 mt-2 font-mono">
          {config.hashtag} • Designed with Love &amp; Auspicious Blessings
        </p>
      </div>
    </section>
  );
};
