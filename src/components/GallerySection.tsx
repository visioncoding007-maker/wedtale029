import React, { useState } from 'react';
import { Sparkles, ChevronLeft, ChevronRight, Heart, Camera } from 'lucide-react';
import { WeddingConfig } from '../types';
import { audioEngine } from '../utils/audioEngine';

interface GallerySectionProps {
  config: WeddingConfig;
}

export const GallerySection: React.FC<GallerySectionProps> = ({ config }) => {
  const photos = config.galleryPhotos || [];
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    audioEngine.playCardFlipSound();
    setCurrentIndex((prev) => (prev + 1) % photos.length);
  };

  const handlePrev = () => {
    audioEngine.playCardFlipSound();
    setCurrentIndex((prev) => (prev - 1 + photos.length) % photos.length);
  };

  const currentPhoto = photos[currentIndex] || photos[0];

  return (
    <section
      id="gallery-section"
      className="relative w-full py-16 px-4 bg-[#14081E] text-white flex flex-col items-center justify-between overflow-hidden select-none border-b border-amber-500/20"
    >
      {/* Background ambient lighting */}
      <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(#D4AF37_1px,transparent_1px)] [background-size:24px_24px]" />
      <div className="absolute top-1/3 right-10 w-72 h-72 rounded-full blur-3xl pointer-events-none bg-purple-600/15" />

      {/* Header */}
      <div className="relative z-10 text-center max-w-lg mb-6">
        <div className="inline-flex items-center gap-1.5 text-xs font-cinzel text-amber-300 font-bold uppercase tracking-widest mb-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Our Story In Frame</span>
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
        </div>
        <h2 className="font-classic text-2xl sm:text-3xl md:text-4xl font-bold text-amber-100">
          Moments Woven in Forever
        </h2>
        <p className="text-xs sm:text-sm text-neutral-300 font-editorial italic mt-1">
          From gentle smiles to sacred vows, captured memories through our journey of love.
        </p>
      </div>

      {/* 3D Stacked Photo Cards Container */}
      <div className="relative z-10 w-full max-w-xs sm:max-w-sm md:max-w-md aspect-[4/5] my-4 perspective-1000 flex items-center justify-center">
        {/* Layer 1 behind */}
        <div className="absolute w-[92%] h-[92%] rounded-2xl shadow-md -rotate-6 border border-amber-500/30 bg-[#281338]" />

        {/* Layer 2 behind */}
        <div className="absolute w-[95%] h-[95%] rounded-2xl shadow-lg rotate-3 border border-amber-400/50 bg-[#341849]" />

        {/* ACTIVE MAIN CARD */}
        <div className="relative w-full h-full p-4 rounded-2xl shadow-[0_15px_40px_rgba(0,0,0,0.85)] border-2 border-amber-400/80 bg-[#230D32] flex flex-col justify-between group transform transition-all duration-300">
          <div className="absolute -top-1.5 -right-1.5 w-3 h-3 rounded-full bg-yellow-300 animate-sparkle" />

          {/* Image */}
          <div className="relative w-full h-4/5 rounded-xl overflow-hidden border border-amber-300/40 shadow-inner">
            <img
              src={currentPhoto.url}
              alt={currentPhoto.caption}
              className="w-full h-full object-cover filter brightness-[1.03] contrast-[1.05] transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

            {/* Tag on Image */}
            <div className="absolute top-2.5 left-2.5 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-amber-400/40 text-[10px] font-cinzel text-amber-200">
              {currentPhoto.date || 'Memories'}
            </div>

            {/* Counter */}
            <div className="absolute top-2.5 right-2.5 px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur-md border border-amber-400/40 text-[10px] font-mono text-amber-200">
              {currentIndex + 1} / {photos.length}
            </div>
          </div>

          {/* Caption & Navigation Controls */}
          <div className="h-1/5 pt-2 flex flex-col justify-between">
            <p className="text-xs sm:text-sm text-amber-100 font-editorial italic text-center line-clamp-1 px-2">
              &ldquo;{currentPhoto.caption}&rdquo;
            </p>

            <div className="flex items-center justify-between px-2 pt-1">
              <button
                type="button"
                onClick={handlePrev}
                aria-label="Previous photo"
                className="w-8 h-8 rounded-full bg-amber-500/20 hover:bg-amber-500/40 border border-amber-400/50 flex items-center justify-center text-amber-200 transition-all hover:scale-110 active:scale-95"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-1.5">
                {photos.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      audioEngine.playCardFlipSound();
                      setCurrentIndex(idx);
                    }}
                    className={`h-1.5 rounded-full transition-all ${
                      idx === currentIndex ? 'w-5 bg-amber-400' : 'w-1.5 bg-neutral-600 hover:bg-neutral-400'
                    }`}
                  />
                ))}
              </div>

              <button
                type="button"
                onClick={handleNext}
                aria-label="Next photo"
                className="w-8 h-8 rounded-full bg-amber-500/20 hover:bg-amber-500/40 border border-amber-400/50 flex items-center justify-center text-amber-200 transition-all hover:scale-110 active:scale-95"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Thumbnails strip */}
      <div className="relative z-10 flex items-center gap-2 max-w-sm sm:max-w-md overflow-x-auto no-scrollbar py-2 px-1">
        {photos.map((photo, idx) => (
          <button
            key={photo.id}
            type="button"
            onClick={() => {
              audioEngine.playCardFlipSound();
              setCurrentIndex(idx);
            }}
            className={`w-12 h-12 rounded-lg overflow-hidden shrink-0 border-2 transition-all ${
              idx === currentIndex
                ? 'border-amber-400 scale-110 shadow-[0_0_10px_rgba(251,191,36,0.5)]'
                : 'border-transparent opacity-60 hover:opacity-100'
            }`}
          >
            <img src={photo.url} alt={photo.caption} className="w-full h-full object-cover" />
          </button>
        ))}
      </div>
    </section>
  );
};
