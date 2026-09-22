import React, { useState } from 'react';
import { Sparkles, Share2, Check, MapPin, Calendar, Heart, Gift } from 'lucide-react';
import { WeddingConfig } from '../types';

interface HeaderBarProps {
  config: WeddingConfig;
  onShareClick: () => void;
}

export const HeaderBar: React.FC<HeaderBarProps> = ({ config, onShareClick }) => {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } else {
      onShareClick();
    }
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-neutral-950/80 backdrop-blur-xl border-b border-amber-500/30 px-3 sm:px-6 py-2.5 transition-all">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        {/* Monogram and Title */}
        <div
          onClick={() => scrollToSection('hero-section')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-tr from-amber-500 via-yellow-200 to-amber-700 p-0.5 shadow-[0_0_12px_rgba(245,158,11,0.4)] group-hover:scale-105 transition-transform">
            <div className="w-full h-full rounded-full bg-neutral-950 flex items-center justify-center border border-amber-300/40">
              <span className="font-title text-xs sm:text-sm text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-100 to-amber-300 font-bold tracking-widest">
                {config.monogramText}
              </span>
            </div>
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-classic text-sm sm:text-base font-bold text-amber-100 tracking-wide">
                {config.groomName} &amp; {config.brideName}
              </span>
              <Heart className="w-3 h-3 text-rose-400 fill-rose-400 hidden sm:inline" />
            </div>
            <span className="text-[10px] text-amber-300/80 font-cinzel tracking-wider uppercase">
              {config.weddingDateFormatted} • {config.venueCity}
            </span>
          </div>
        </div>

        {/* Quick Nav Anchor links */}
        <nav className="hidden lg:flex items-center gap-5 text-xs font-cinzel font-semibold text-neutral-300">
          <button
            type="button"
            onClick={() => scrollToSection('hero-section')}
            className="hover:text-amber-300 transition-colors"
          >
            Invitation
          </button>
          <button
            type="button"
            onClick={() => scrollToSection('countdown-section')}
            className="hover:text-amber-300 transition-colors"
          >
            Countdown
          </button>
          <button
            type="button"
            onClick={() => scrollToSection('gatefold-card-section')}
            className="hover:text-amber-300 transition-colors"
          >
            Gatefold Card
          </button>
          <button
            type="button"
            onClick={() => scrollToSection('ceremonies-itinerary-section')}
            className="hover:text-amber-300 transition-colors"
          >
            Ceremonies
          </button>
          <button
            type="button"
            onClick={() => scrollToSection('gallery-section')}
            className="hover:text-amber-300 transition-colors"
          >
            Memories
          </button>
          <button
            type="button"
            onClick={() => scrollToSection('gifts-relatives-section')}
            className="text-amber-300 hover:text-amber-200 transition-colors font-bold flex items-center gap-1"
          >
            <Gift className="w-3 h-3 text-amber-400" />
            <span>Gifts &amp; Shagun</span>
          </button>
          <button
            type="button"
            onClick={() => scrollToSection('blessings-farewell-section')}
            className="hover:text-amber-300 transition-colors"
          >
            Blessings &amp; RSVP
          </button>
        </nav>

        {/* Share Button & Guest Badge */}
        <div className="flex items-center gap-2 mr-28 sm:mr-36">
          <button
            type="button"
            onClick={() => scrollToSection('gifts-relatives-section')}
            className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-500/20 via-rose-500/20 to-amber-500/20 hover:from-amber-500/30 hover:to-rose-500/30 border border-amber-400/50 text-[11px] font-cinzel font-semibold text-amber-200 transition-all hover:scale-105"
            title="Receive Gifts from Relatives / Send Shagun"
          >
            <Gift className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Send Gift / Shagun</span>
            <span className="sm:hidden">Gift</span>
          </button>

          <button
            id="quick-share-link-btn"
            type="button"
            onClick={handleCopyLink}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/10 hover:bg-amber-500/20 border border-amber-400/40 text-[11px] font-cinzel font-semibold text-amber-200 transition-all hover:scale-105"
            title="Copy invitation link"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-300">Link Copied!</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">Share Invitation</span>
                <span className="sm:hidden">Share</span>
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
