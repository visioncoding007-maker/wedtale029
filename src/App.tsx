import React, { useState } from 'react';
import { getInitialWeddingConfig } from './data/weddingData';
import { HeaderBar } from './components/HeaderBar';
import { HeroSection } from './components/HeroSection';
import { CountdownSection } from './components/CountdownSection';
import { GatefoldScratchSection } from './components/GatefoldScratchSection';
import { CeremoniesSection } from './components/CeremoniesSection';
import { GallerySection } from './components/GallerySection';
import { GiftsSection } from './components/GiftsSection';
import { BlessingsFarewellSection } from './components/BlessingsFarewellSection';
import { SparklesCanvas } from './components/SparklesCanvas';
import { PetalsCanvas } from './components/PetalsCanvas';
import { MusicToggle } from './components/MusicToggle';
import { ShareModal } from './components/ShareModal';

export default function App() {
  const [config] = useState(getInitialWeddingConfig);
  const [showerTrigger, setShowerTrigger] = useState(0);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  const handleTriggerShower = () => {
    setShowerTrigger((prev) => prev + 1);
  };

  return (
    <div className="relative min-h-screen w-full bg-[#180E24] text-neutral-100 selection:bg-amber-500 selection:text-neutral-950 overflow-x-hidden font-body">
      {/* Ambient background particles and floating flower petals */}
      <SparklesCanvas />
      <PetalsCanvas
        triggerShower={showerTrigger}
        petalColors={config.theme.petalColors}
      />

      {/* Floating Ambient Shehnai / Raga Music Player */}
      <MusicToggle />

      {/* Navigation and Guest Header */}
      <HeaderBar
        config={config}
        onShareClick={() => setIsShareModalOpen(true)}
      />

      {/* Main Wedding Experience */}
      <main className="relative w-full flex flex-col items-center">
        {/* 1. Hero Invocation Section */}
        <HeroSection
          config={config}
          onTriggerShower={handleTriggerShower}
        />

        {/* 2. Auspicious IST Countdown */}
        <CountdownSection config={config} />

        {/* 3. 3D Gatefold Invitation Card & Gold Scratch Keepsake */}
        <GatefoldScratchSection
          config={config}
          onTriggerShower={handleTriggerShower}
        />

        {/* 4. Ceremonies & Auspicious Itinerary */}
        <CeremoniesSection
          config={config}
          onTriggerShower={handleTriggerShower}
        />

        {/* 5. Our Story & Memories 3D Gallery */}
        <GallerySection config={config} />

        {/* 6. Receive Gifts from Relatives & Auspicious Shagun */}
        <GiftsSection
          config={config}
          onTriggerShower={handleTriggerShower}
        />

        {/* 7. Blessings, Venue Map & Farewell */}
        <BlessingsFarewellSection
          config={config}
          onTriggerShower={handleTriggerShower}
          onOpenShareModal={() => setIsShareModalOpen(true)}
        />
      </main>

      {/* Share Invitation Dialog */}
      <ShareModal
        config={config}
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
      />
    </div>
  );
}
