import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Sparkles, MailOpen, Lock, RotateCcw, Heart, Gift, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { WeddingConfig } from '../types';
import { audioEngine } from '../utils/audioEngine';

interface GatefoldScratchSectionProps {
  config: WeddingConfig;
  onTriggerShower: () => void;
}

export const GatefoldScratchSection: React.FC<GatefoldScratchSectionProps> = ({
  config,
  onTriggerShower,
}) => {
  const [activeTab, setActiveTab] = useState<'gatefold' | 'scratch'>('gatefold');

  // Gatefold state
  const [isOpen, setIsOpen] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  // Scratch card state
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isScratched, setIsScratched] = useState(false);
  const [scratchProgress, setScratchProgress] = useState(0);
  const [isDrawing, setIsDrawing] = useState(false);

  // 3D Tilt handler for Gatefold
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = -((y - centerY) / centerY) * 12;
    const rotateY = ((x - centerX) / centerX) * 12;
    setTilt({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  const toggleGatefold = () => {
    if (!isOpen) {
      audioEngine.playWaxSealSound();
      audioEngine.playBlessingChime();
      confetti({
        particleCount: 50,
        spread: 80,
        origin: { y: 0.6 },
        colors: config.theme.petalColors,
      });
      onTriggerShower();
    } else {
      audioEngine.playCardFlipSound();
    }
    setIsOpen(!isOpen);
  };

  // Scratch card initialization
  const initScratchCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = (canvas.width = canvas.parentElement?.clientWidth || 360);
    const height = (canvas.height = canvas.parentElement?.clientHeight || 480);

    // Create glamorous gold foil gradient
    const grad = ctx.createLinearGradient(0, 0, width, height);
    grad.addColorStop(0, '#D4AF37');
    grad.addColorStop(0.2, '#FFF2B2');
    grad.addColorStop(0.4, '#C5A028');
    grad.addColorStop(0.6, '#F3E5AB');
    grad.addColorStop(0.8, '#AA771C');
    grad.addColorStop(1, '#FFDF73');

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // Draw ornate golden damask glitter texture
    ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
    for (let i = 0; i < 400; i++) {
      const rx = Math.random() * width;
      const ry = Math.random() * height;
      const r = Math.random() * 2;
      ctx.beginPath();
      ctx.arc(rx, ry, r, 0, Math.PI * 2);
      ctx.fill();
    }

    // Border and Seal watermark
    ctx.strokeStyle = '#85580C';
    ctx.lineWidth = 4;
    ctx.strokeRect(10, 10, width - 20, height - 20);

    ctx.strokeStyle = '#FFE87C';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(14, 14, width - 28, height - 28);

    // Text on gold foil
    ctx.fillStyle = '#4A2E05';
    ctx.font = 'bold 16px "Cinzel", Georgia, serif';
    ctx.textAlign = 'center';
    ctx.fillText('✦ SACRED ROMANCE ✦', width / 2, height / 2 - 40);

    ctx.font = 'bold 22px "Great Vibes", cursive';
    ctx.fillText(`${config.groomName} & ${config.brideName}`, width / 2, height / 2);

    ctx.font = '600 12px "Montserrat", sans-serif';
    ctx.fillText('✨ SCRATCH WITH FINGER OR CURSOR ✨', width / 2, height / 2 + 40);
    ctx.font = 'italic 11px "Cormorant Garamond", Georgia, serif';
    ctx.fillText('To unveil the couple’s secret keepsake', width / 2, height / 2 + 60);

    setIsScratched(false);
    setScratchProgress(0);
  }, [config.groomName, config.brideName]);

  useEffect(() => {
    if (activeTab === 'scratch') {
      const timer = setTimeout(() => {
        initScratchCanvas();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [activeTab, initScratchCanvas]);

  const scratch = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas || isScratched) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 26, 0, Math.PI * 2);
    ctx.fill();

    audioEngine.playScratchSound();

    // Check scratch percentage occasionally
    if (Math.random() > 0.6) {
      checkProgress();
    }
  };

  const checkProgress = () => {
    const canvas = canvasRef.current;
    if (!canvas || isScratched) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    const imgData = ctx.getImageData(0, 0, w, h);
    const data = imgData.data;
    let transparentCount = 0;
    const totalPixels = w * h;

    // Sample every 16th pixel for performance
    for (let i = 3; i < data.length; i += 64) {
      if (data[i] === 0) {
        transparentCount++;
      }
    }

    const ratio = Math.min(100, Math.round((transparentCount / (totalPixels / 16)) * 100));
    setScratchProgress(ratio);

    if (ratio > 50 && !isScratched) {
      setIsScratched(true);
      setScratchProgress(100);
      ctx.clearRect(0, 0, w, h);
      audioEngine.playBlessingChime();
      confetti({
        particleCount: 70,
        spread: 80,
        origin: { y: 0.6 },
        colors: config.theme.petalColors,
      });
      onTriggerShower();
    }
  };

  return (
    <section
      id="gatefold-card-section"
      className="relative w-full py-16 px-4 bg-[#14081E] text-white flex flex-col items-center justify-center overflow-hidden select-none border-b border-amber-500/20"
    >
      {/* Background ambient lighting */}
      <div className="absolute inset-0 pointer-events-none opacity-25 bg-[radial-gradient(#D4AF37_1px,transparent_1px)] [background-size:24px_24px]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full blur-3xl pointer-events-none bg-amber-600/20" />

      {/* Header */}
      <div className="relative z-10 text-center max-w-lg mb-6">
        <div className="inline-flex items-center gap-1.5 text-xs font-cinzel text-amber-300 font-bold uppercase tracking-widest mb-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Interactive Royal Keepsake</span>
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
        </div>
        <h2 className="font-classic text-2xl sm:text-3xl md:text-4xl font-bold text-amber-100">
          The Royal Invitation Card
        </h2>
        <p className="text-xs sm:text-sm text-neutral-300 font-editorial italic mt-1">
          Experience our invitation in 3D gatefold form or scratch to reveal our secret chapter note.
        </p>

        {/* Tab Switcher */}
        <div className="inline-flex items-center gap-2 p-1 mt-4 rounded-full bg-neutral-950/80 border border-amber-400/40">
          <button
            type="button"
            onClick={() => {
              setActiveTab('gatefold');
              audioEngine.playCardFlipSound();
            }}
            className={`px-4 py-1.5 rounded-full text-xs font-cinzel font-bold tracking-wider transition-all flex items-center gap-1.5 ${
              activeTab === 'gatefold'
                ? 'bg-gradient-to-r from-amber-500 to-rose-600 text-white shadow-lg'
                : 'text-neutral-400 hover:text-amber-200'
            }`}
          >
            <MailOpen className="w-3.5 h-3.5" />
            <span>3D Gatefold Card</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('scratch');
              audioEngine.playCardFlipSound();
            }}
            className={`px-4 py-1.5 rounded-full text-xs font-cinzel font-bold tracking-wider transition-all flex items-center gap-1.5 ${
              activeTab === 'scratch'
                ? 'bg-gradient-to-r from-amber-500 to-rose-600 text-white shadow-lg'
                : 'text-neutral-400 hover:text-amber-200'
            }`}
          >
            <Gift className="w-3.5 h-3.5" />
            <span>Gold Scratch Card</span>
          </button>
        </div>
      </div>

      {/* TAB 1: 3D GATEFOLD INVITATION CARD */}
      {activeTab === 'gatefold' && (
        <div className="relative z-10 w-full max-w-sm sm:max-w-md md:max-w-lg aspect-[3/4] my-2 perspective-1400 flex items-center justify-center">
          <div
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="relative w-full h-full rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] border-2 border-amber-400/60 preserve-3d transition-transform duration-200 ease-out flex items-center justify-center"
            style={{
              transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
              backgroundColor: '#281338',
            }}
          >
            {/* INNER PARCHMENT (Revealed when open) */}
            <div className="absolute inset-2 sm:inset-3 rounded-xl bg-gradient-to-b from-[#FAF5FF] via-[#FFFDF7] to-[#F3E8FF] p-4 sm:p-6 text-neutral-900 shadow-inner flex flex-col justify-between items-center text-center border border-amber-300">
              {/* Top Invocation */}
              <div className="w-full flex flex-col items-center">
                <span className="text-[10px] sm:text-xs font-cinzel font-bold text-amber-800 tracking-widest uppercase">
                  ॥ शुभ विवाह • SHUBH VIVAHA ॥
                </span>
                <h3 className="font-script text-3xl sm:text-4xl md:text-5xl text-rose-900 mt-1">
                  {config.groomName} &amp; {config.brideName}
                </h3>
              </div>

              {/* Couple Visual */}
              <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full p-1 bg-gradient-to-tr from-amber-400 to-rose-400 shadow-md my-1 overflow-hidden">
                <img
                  src={config.heroCouplePhoto || config.theme.coverImage}
                  alt="Couple"
                  className="w-full h-full object-cover rounded-full"
                />
              </div>

              {/* Invitation Text */}
              <div className="w-full flex flex-col items-center">
                <p className="text-[11px] sm:text-xs text-neutral-700 font-editorial italic px-2">
                  &ldquo;{config.welcomeMessage}&rdquo;
                </p>
                <div className="my-2 py-1 px-3 rounded-lg bg-amber-100 border border-amber-300 text-amber-950 text-xs font-cinzel font-bold">
                  {config.weddingDateFormatted} • {config.weddingTime}
                </div>
                <p className="text-[10px] sm:text-[11px] font-cinzel font-semibold text-neutral-800 uppercase tracking-wider">
                  {config.venueName}, {config.venueCity}
                </p>
              </div>

              <div className="text-[9px] font-cinzel text-amber-700 tracking-widest uppercase">
                Auspicious Blessings &amp; Everlasting Love
              </div>
            </div>

            {/* LEFT GATEFOLD DOOR */}
            <div
              className="absolute top-0 left-0 w-1/2 h-full rounded-l-2xl border-r border-amber-300/60 bg-gradient-to-br from-[#3B154E] via-[#240A34] to-[#160421] shadow-2xl p-4 flex flex-col justify-between origin-left transition-transform duration-700 ease-in-out z-20"
              style={{
                transform: isOpen ? 'rotateY(-110deg)' : 'rotateY(0deg)',
                boxShadow: isOpen ? 'none' : 'inset -4px 0 12px rgba(0,0,0,0.6)',
              }}
            >
              <div className="w-full h-full border border-amber-400/40 rounded-l-xl p-2 flex flex-col justify-between items-start text-amber-200">
                <span className="text-[10px] font-cinzel font-bold tracking-widest text-amber-400">
                  EST. 2026
                </span>
                <div className="my-auto text-left">
                  <span className="font-title text-2xl sm:text-3xl text-amber-300 font-bold block">
                    {config.groomName.charAt(0)}
                  </span>
                  <span className="text-[11px] font-cinzel text-amber-200 tracking-widest uppercase">
                    The Groom
                  </span>
                </div>
                <span className="text-[9px] font-body text-amber-300/60">✦ ✦ ✦</span>
              </div>
            </div>

            {/* RIGHT GATEFOLD DOOR */}
            <div
              className="absolute top-0 right-0 w-1/2 h-full rounded-r-2xl border-l border-amber-300/60 bg-gradient-to-bl from-[#3B154E] via-[#240A34] to-[#160421] shadow-2xl p-4 flex flex-col justify-between origin-right transition-transform duration-700 ease-in-out z-20"
              style={{
                transform: isOpen ? 'rotateY(110deg)' : 'rotateY(0deg)',
                boxShadow: isOpen ? 'none' : 'inset 4px 0 12px rgba(0,0,0,0.6)',
              }}
            >
              <div className="w-full h-full border border-amber-400/40 rounded-r-xl p-2 flex flex-col justify-between items-end text-amber-200">
                <span className="text-[10px] font-cinzel font-bold tracking-widest text-amber-400">
                  JAIPUR
                </span>
                <div className="my-auto text-right">
                  <span className="font-title text-2xl sm:text-3xl text-amber-300 font-bold block">
                    {config.brideName.charAt(0)}
                  </span>
                  <span className="text-[11px] font-cinzel text-amber-200 tracking-widest uppercase">
                    The Bride
                  </span>
                </div>
                <span className="text-[9px] font-body text-amber-300/60">✦ ✦ ✦</span>
              </div>
            </div>

            {/* CENTER WAX SEAL MEDALLION (Locks both doors until clicked) */}
            <div
              onClick={toggleGatefold}
              className={`absolute z-30 cursor-pointer transition-all duration-500 transform hover:scale-110 ${
                isOpen ? 'opacity-0 pointer-events-none scale-50' : 'opacity-100 scale-100'
              }`}
            >
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-amber-400 via-amber-600 to-amber-900 p-1 shadow-[0_0_30px_rgba(245,158,11,0.8)] border-2 border-yellow-200 flex items-center justify-center">
                <div className="w-full h-full rounded-full bg-gradient-to-tr from-rose-950 to-neutral-900 flex flex-col items-center justify-center border border-amber-300/60 shadow-inner">
                  <span className="font-title text-xs sm:text-sm font-bold text-amber-200 tracking-wider">
                    {config.monogramText}
                  </span>
                  <span className="text-[8px] font-cinzel text-amber-400 tracking-tighter uppercase mt-0.5">
                    TAP SEAL
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Door Controls bottom action */}
          <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-3">
            <button
              id="toggle-gatefold-card-btn"
              type="button"
              onClick={toggleGatefold}
              className="px-5 py-1.5 rounded-full bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/50 text-xs font-cinzel font-bold text-amber-200 transition-all hover:scale-105 flex items-center gap-1.5"
            >
              {isOpen ? (
                <>
                  <Lock className="w-3.5 h-3.5 text-amber-400" />
                  <span>Fold Invitation Closed</span>
                </>
              ) : (
                <>
                  <MailOpen className="w-3.5 h-3.5 text-amber-400" />
                  <span>Open Royal Invitation</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* TAB 2: GOLD FOIL SCRATCH CARD */}
      {activeTab === 'scratch' && (
        <div className="relative z-10 w-full max-w-sm sm:max-w-md aspect-[3/4] my-2 flex flex-col items-center">
          {/* Card Container */}
          <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.8)] border-2 border-amber-400/70 bg-[#281338]">
            {/* UNDERNEATH REVEAL CONTENT */}
            <div className="absolute inset-0 p-5 flex flex-col justify-between items-center text-center text-white">
              <div className="w-full flex flex-col items-center">
                <span className="text-xs font-cinzel font-bold text-amber-300 tracking-widest uppercase">
                  {config.scratchRevealHeading}
                </span>
                <h3 className="font-script text-3xl sm:text-4xl text-amber-200 mt-1">
                  {config.groomName} &amp; {config.brideName}
                </h3>
              </div>

              <div className="relative w-44 h-44 sm:w-52 sm:h-52 rounded-2xl overflow-hidden border-2 border-amber-400/70 shadow-2xl my-2">
                <img
                  src={config.scratchRevealPhoto || config.heroCouplePhoto}
                  alt="Couple Keepsake"
                  className="w-full h-full object-cover filter brightness-[1.05]"
                />
              </div>

              <div className="w-full">
                <p className="text-xs sm:text-sm text-amber-100 font-editorial italic px-2">
                  &ldquo;{config.scratchRevealNote}&rdquo;
                </p>
                <span className="text-[10px] font-cinzel text-amber-400 tracking-widest uppercase mt-2 block">
                  #PulkitWedsShreya • The Oberoi Rajvilas
                </span>
              </div>
            </div>

            {/* SCRATCH CANVAS OVERLAY */}
            <canvas
              ref={canvasRef}
              onMouseDown={() => setIsDrawing(true)}
              onMouseUp={() => setIsDrawing(false)}
              onMouseMove={(e) => {
                if (isDrawing) {
                  scratch(e.clientX, e.clientY);
                }
              }}
              onTouchStart={() => setIsDrawing(true)}
              onTouchEnd={() => setIsDrawing(false)}
              onTouchMove={(e) => {
                if (e.touches.length > 0) {
                  const t = e.touches[0];
                  scratch(t.clientX, t.clientY);
                }
              }}
              className={`absolute inset-0 z-20 w-full h-full cursor-pointer touch-none transition-opacity duration-700 ${
                isScratched ? 'pointer-events-none opacity-0' : 'opacity-100'
              }`}
            />
          </div>

          {/* Scratch Progress & Reset Controls */}
          <div className="w-full flex items-center justify-between mt-4 px-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-cinzel text-amber-300 font-bold">Unveiled:</span>
              <div className="w-28 sm:w-36 h-2 bg-neutral-900 rounded-full border border-amber-500/30 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 to-rose-500 transition-all duration-300"
                  style={{ width: `${scratchProgress}%` }}
                />
              </div>
              <span className="text-xs font-mono text-amber-400">{scratchProgress}%</span>
            </div>

            <button
              type="button"
              onClick={initScratchCanvas}
              className="flex items-center gap-1.5 text-xs font-cinzel text-amber-300 hover:text-amber-100 py-1 px-3 rounded-full bg-white/5 border border-amber-400/30 transition-all hover:scale-105"
            >
              <RotateCcw className="w-3 h-3 text-amber-400" />
              <span>Re-Coat Gold</span>
            </button>
          </div>
        </div>
      )}
    </section>
  );
};
