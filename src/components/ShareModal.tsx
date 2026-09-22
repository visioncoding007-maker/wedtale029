import React, { useState } from 'react';
import { X, Copy, Check, Share2, MessageCircle, Heart } from 'lucide-react';
import { WeddingConfig } from '../types';

interface ShareModalProps {
  config: WeddingConfig;
  isOpen: boolean;
  onClose: () => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({ config, isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);
  if (!isOpen) return null;

  const url = window.location.href;
  const shareText = `You are cordially invited to celebrate the wedding of ${config.groomName} & ${config.brideName} on ${config.weddingDateFormatted} at ${config.venueName}, ${config.venueCity}! View the 3D Invitation: ${url}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleWhatsApp = () => {
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`, '_blank');
  };

  const handleNativeShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${config.groomName} & ${config.brideName}'s Wedding`,
        text: shareText,
        url: url,
      }).catch(() => {});
    } else {
      handleCopy();
    }
  };

  // Generate QR code URL using public QR server API
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(url)}&color=4a2e05&bgcolor=fffdf7`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in select-none">
      <div className="relative w-full max-w-md bg-[#1C0926] border border-amber-400/70 rounded-3xl p-6 text-white shadow-[0_25px_60px_rgba(0,0,0,0.9)] flex flex-col items-center text-center">
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close share dialog"
          className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-neutral-300 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Monogram Seal */}
        <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-amber-400 via-amber-600 to-rose-700 p-0.5 shadow-lg mb-3">
          <div className="w-full h-full rounded-full bg-neutral-950 flex items-center justify-center">
            <span className="font-title text-sm font-bold text-amber-200">{config.monogramText}</span>
          </div>
        </div>

        <h3 className="font-classic text-xl font-bold text-amber-100">
          Share Wedding Invitation
        </h3>
        <p className="text-xs text-neutral-300 font-editorial italic mt-0.5 mb-4">
          Invite family and loved ones to view the 3D ceremony &amp; celebration.
        </p>

        {/* QR Code */}
        <div className="p-3 rounded-2xl bg-[#FFFDF7] border-2 border-amber-300 shadow-md mb-4">
          <img src={qrUrl} alt="Invitation QR Code" className="w-36 h-36 rounded-lg" />
          <span className="text-[10px] font-cinzel text-amber-900 font-bold tracking-wider block mt-1.5">
            SCAN TO OPEN INVITATION
          </span>
        </div>

        {/* URL Bar with Copy */}
        <div className="w-full flex items-center gap-2 p-2 rounded-xl bg-black/60 border border-amber-500/30 mb-4">
          <input
            type="text"
            readOnly
            value={url}
            className="flex-1 bg-transparent text-xs text-neutral-300 font-mono outline-none px-2 truncate"
          />
          <button
            type="button"
            onClick={handleCopy}
            className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-neutral-950 text-xs font-cinzel font-bold flex items-center gap-1 shrink-0 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied!' : 'Copy'}</span>
          </button>
        </div>

        {/* Share buttons */}
        <div className="w-full grid grid-cols-2 gap-2.5">
          <button
            type="button"
            onClick={handleWhatsApp}
            className="py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-cinzel font-bold flex items-center justify-center gap-2 transition-colors shadow-md"
          >
            <MessageCircle className="w-4 h-4" />
            <span>WhatsApp</span>
          </button>

          <button
            type="button"
            onClick={handleNativeShare}
            className="py-2.5 px-3 rounded-xl bg-gradient-to-r from-amber-500 to-rose-600 hover:opacity-95 text-white text-xs font-cinzel font-bold flex items-center justify-center gap-2 transition-all shadow-md"
          >
            <Share2 className="w-4 h-4" />
            <span>More Options</span>
          </button>
        </div>
      </div>
    </div>
  );
};
