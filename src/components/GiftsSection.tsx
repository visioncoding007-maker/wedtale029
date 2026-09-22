import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Gift,
  Heart,
  Copy,
  Check,
  ExternalLink,
  QrCode,
  ShieldCheck,
  Smartphone,
  CreditCard,
  Globe,
  Send,
  Lock,
  Building2,
  CheckCircle2,
  HelpCircle,
  PhoneCall,
  UserCheck,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { WeddingConfig } from '../types';
import { audioEngine } from '../utils/audioEngine';
import { CulturalDivider } from './CulturalDivider';

interface GiftsSectionProps {
  config: WeddingConfig;
  onTriggerShower: () => void;
}

interface RelativeWish {
  id: string;
  senderName: string;
  relation: string;
  message: string;
  shagunAmount?: string;
  timestamp: string;
}

const SHAGUN_PRESETS = [
  { amount: 501, label: 'Shubh Shagun', meaning: 'Auspicious Start & Good Fortune' },
  { amount: 1101, label: 'Sneh Uphaar', meaning: 'Warmth, Affection & Harmony' },
  { amount: 2101, label: 'Ashirwad', meaning: 'Elders’ Sacred Blessing' },
  { amount: 5101, label: 'Kalyanam', meaning: 'Eternal Wellbeing & Prosperity' },
  { amount: 11001, label: 'Maha Shagun', meaning: 'Grand Family Blessing' },
];

const INITIAL_RELATIVE_WISHES: RelativeWish[] = [
  {
    id: 'wish-1',
    senderName: 'Rajesh & Sunita Sharma',
    relation: 'Chacha & Chachi',
    message: 'May your sacred bond grow stronger with each passing day. Lots of love and warmest blessings to Pulkit & Shreya!',
    shagunAmount: '₹5,101',
    timestamp: 'Today',
  },
  {
    id: 'wish-2',
    senderName: 'Vandana & Ajay Mathur',
    relation: 'Bua & Fufa Ji',
    message: 'Heartiest congratulations to the wonderful couple! Wishing you both a lifetime of happiness, peace, and togetherness.',
    shagunAmount: '₹2,101',
    timestamp: 'Today',
  },
  {
    id: 'wish-3',
    senderName: 'Kavita & Vikram Singhania',
    relation: 'Mama & Mami (London)',
    message: 'Sending our warmest Shagun and hugs all the way from the UK. So thrilled and proud of our dear couple!',
    shagunAmount: '₹11,001',
    timestamp: 'Yesterday',
  },
];

const TRUST_PILLARS = [
  {
    icon: Lock,
    title: 'Bank-Grade 256-Bit SSL',
    desc: 'All transactions are protected with end-to-end industry standard encryption.',
  },
  {
    icon: ShieldCheck,
    title: '100% Direct Settlement',
    desc: 'Transfers route directly to Pulkit & Shreya with zero third-party deductions.',
  },
  {
    icon: CheckCircle2,
    title: 'Instant Confirmation',
    desc: 'Receive immediate digital receipts via SMS and email with payment reference.',
  },
  {
    icon: Globe,
    title: 'Domestic & NRI Support',
    desc: 'Seamless payments via UPI, Indian NetBanking, and all international cards.',
  },
];

export const GiftsSection: React.FC<GiftsSectionProps> = ({ config, onTriggerShower }) => {
  const giftUrl = config.giftRegistryUrl || 'https://superprofile.bio/vp/gift-here';

  // Selected preset or custom amount
  const [selectedAmount, setSelectedAmount] = useState<number>(2101);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [isCustom, setIsCustom] = useState<boolean>(false);
  const [addLuckyRupee, setAddLuckyRupee] = useState<boolean>(true);

  // Link copy state
  const [copied, setCopied] = useState<boolean>(false);

  // Relative blessing form state
  const [senderName, setSenderName] = useState<string>('');
  const [relation, setRelation] = useState<string>('Family Relative');
  const [blessingMessage, setBlessingMessage] = useState<string>('');
  const [relativeWishes, setRelativeWishes] = useState<RelativeWish[]>(INITIAL_RELATIVE_WISHES);
  const [submittedWish, setSubmittedWish] = useState<boolean>(false);

  // Active view tab
  const [activeTab, setActiveTab] = useState<'registry' | 'qr' | 'wishes'>('registry');

  // Compute final amount
  const currentBaseAmount = isCustom
    ? parseInt(customAmount.replace(/[^0-9]/g, '') || '0', 10)
    : selectedAmount;
  
  const effectiveTotal = currentBaseAmount > 0 ? currentBaseAmount : 2101;
  const formattedTotal = `₹${effectiveTotal.toLocaleString('en-IN')}`;

  const handleSelectPreset = (amount: number) => {
    setIsCustom(false);
    setSelectedAmount(amount);
    setCustomAmount('');
    audioEngine.playBlessingChime();
  };

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value.replace(/[^0-9]/g, '');
    setCustomAmount(rawVal);
    setIsCustom(true);
  };

  const handleCopyLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(giftUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2600);
    }
    audioEngine.playBlessingChime();
  };

  const handleOpenGiftLink = () => {
    audioEngine.playBlessingChime();
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.65 },
      colors: ['#F59E0B', '#FBBF24', '#F472B6', '#E9D5FF', '#10B981'],
    });
    onTriggerShower();
    window.open(giftUrl, '_blank', 'noopener,noreferrer');
  };

  const handleSendWish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!senderName.trim()) return;

    const newWish: RelativeWish = {
      id: `wish-${Date.now()}`,
      senderName: senderName.trim(),
      relation: relation,
      message:
        blessingMessage.trim() ||
        'May God bless Pulkit & Shreya with boundless health, joy, prosperity, and eternal companionship.',
      shagunAmount: formattedTotal,
      timestamp: 'Just now',
    };

    setRelativeWishes([newWish, ...relativeWishes]);
    setSubmittedWish(true);
    audioEngine.playBlessingChime();

    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#F59E0B', '#10B981', '#E9D5FF', '#FBBF24'],
    });
  };

  // High-contrast, clean scannable QR Code
  const qrCodeImgSrc = `https://api.qrserver.com/v1/create-qr-code/?size=260x260&data=${encodeURIComponent(
    giftUrl
  )}&bgcolor=FFFFFF&color=1A1A1A&margin=2`;

  return (
    <section
      id="gifts-relatives-section"
      className="relative w-full py-16 sm:py-24 px-4 sm:px-6 lg:px-8 text-neutral-100 flex flex-col items-center border-t border-amber-500/30 bg-[#160722]"
    >
      {/* Subtle, elegant warm background texture */}
      <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(#F59E0B_1px,transparent_1px)] [background-size:32px_32px]" />

      {/* Main Header */}
      <div className="relative z-10 text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs font-cinzel tracking-wider uppercase mb-3">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Verified Registry &bull; Secure Digital Shagun</span>
        </div>

        <p className="font-cinzel text-xs sm:text-sm font-semibold tracking-[0.25em] text-amber-400 uppercase mb-2">
          ॥ स्नेह उपहार एवं शुभाशीर्वाद • BLESS PULKIT &amp; SHREYA ॥
        </p>

        <h2 className="font-classic text-3xl sm:text-4xl md:text-5xl font-bold text-amber-100 mb-4 tracking-tight">
          Wedding Shagun &amp; Gift Registry
        </h2>

        <p className="text-neutral-300 font-editorial text-base sm:text-lg italic max-w-2xl mx-auto leading-relaxed">
          &ldquo;Your loving blessings and presence at our wedding are our greatest treasure. For family members and elders who wish to honor tradition with Shagun or wedding gifts, we have provided this direct and secure channel.&rdquo;
        </p>

        <CulturalDivider color="#F59E0B" symbol="🎁" className="mt-4" />
      </div>

      {/* Verified Beneficiary Card (Trust Header) */}
      <div className="relative z-10 w-full max-w-5xl mb-8">
        <div className="rounded-2xl bg-gradient-to-r from-neutral-900/95 via-[#210c30]/95 to-neutral-900/95 border border-amber-400/40 p-5 sm:p-6 shadow-xl flex flex-col md:flex-row items-center justify-between gap-5">
          <div className="flex items-center gap-4 text-left">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/15 border border-amber-400/40 flex items-center justify-center shrink-0">
              <UserCheck className="w-7 h-7 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-classic text-xl sm:text-2xl font-bold text-amber-100">
                  {config.groomName} &amp; {config.brideName}
                </h3>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/50 text-[11px] font-cinzel text-emerald-300 font-bold">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  Verified Beneficiaries
                </span>
              </div>
              <p className="text-xs text-neutral-300 font-editorial mt-1">
                Official Wedding Account • The Oberoi Rajvilas, Jaipur • November 28, 2026
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto justify-end border-t md:border-t-0 border-white/10 pt-3 md:pt-0">
            <div className="text-right hidden sm:block">
              <span className="text-[11px] font-cinzel text-neutral-400 block">
                Official Gateway
              </span>
              <span className="text-xs font-cinzel text-amber-300 font-semibold">
                SuperProfile Verified Portal
              </span>
            </div>
            <button
              type="button"
              onClick={handleOpenGiftLink}
              className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-cinzel font-bold text-xs flex items-center gap-2 transition-all cursor-pointer shadow-md"
            >
              <span>Visit Official Portal</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Tabs navigation for relatives */}
      <div className="relative z-10 flex items-center justify-center p-1 rounded-xl bg-neutral-900/90 border border-amber-500/30 mb-8 max-w-md w-full">
        <button
          type="button"
          onClick={() => setActiveTab('registry')}
          className={`flex-1 py-2 px-3 rounded-lg text-xs sm:text-sm font-cinzel font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === 'registry'
              ? 'bg-amber-500 text-neutral-950 font-bold shadow-sm'
              : 'text-neutral-300 hover:text-amber-200'
          }`}
        >
          <Gift className="w-4 h-4" />
          <span>Shagun Selector</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('qr')}
          className={`flex-1 py-2 px-3 rounded-lg text-xs sm:text-sm font-cinzel font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === 'qr'
              ? 'bg-amber-500 text-neutral-950 font-bold shadow-sm'
              : 'text-neutral-300 hover:text-amber-200'
          }`}
        >
          <QrCode className="w-4 h-4" />
          <span>Scan UPI QR</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('wishes')}
          className={`flex-1 py-2 px-3 rounded-lg text-xs sm:text-sm font-cinzel font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === 'wishes'
              ? 'bg-amber-500 text-neutral-950 font-bold shadow-sm'
              : 'text-neutral-300 hover:text-amber-200'
          }`}
        >
          <Heart className="w-4 h-4" />
          <span>Family Wishes</span>
        </button>
      </div>

      {/* Main Content Area */}
      <div className="relative z-10 w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: Shagun Amount Selector & Gateway Card (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          
          <div className="rounded-2xl bg-neutral-900/90 border border-amber-400/35 p-6 sm:p-7 shadow-lg">
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-5">
              <div>
                <h3 className="font-classic text-xl sm:text-2xl font-bold text-amber-100 flex items-center gap-2">
                  <span>Traditional Shagun Offering</span>
                </h3>
                <p className="text-xs text-neutral-300 font-editorial mt-0.5">
                  Select a meaningful blessing amount or enter your desired contribution
                </p>
              </div>

              <div className="text-right">
                <span className="text-[10px] font-cinzel text-neutral-400 uppercase block">
                  Chosen Shagun
                </span>
                <span className="font-classic text-2xl font-bold text-amber-300">
                  {formattedTotal}
                </span>
              </div>
            </div>

            {/* Presets Grid */}
            <div className="mb-6">
              <label className="block text-xs font-cinzel font-semibold text-amber-300 mb-2.5 uppercase tracking-wider">
                Traditional Auspicious Presets (+₹1 Shagun Tradition):
              </label>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {SHAGUN_PRESETS.map((preset) => {
                  const isSelected = !isCustom && selectedAmount === preset.amount;
                  return (
                    <button
                      key={preset.amount}
                      type="button"
                      onClick={() => handleSelectPreset(preset.amount)}
                      className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-amber-500/20 border-amber-400 text-amber-100 shadow-sm'
                          : 'bg-white/5 hover:bg-white/10 border-white/10 text-neutral-200'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-classic font-bold text-lg text-amber-200">
                          ₹{preset.amount.toLocaleString('en-IN')}
                        </span>
                        {isSelected && (
                          <Check className="w-4 h-4 text-amber-400" />
                        )}
                      </div>
                      <span className="block text-xs font-cinzel text-amber-300 font-semibold mt-1">
                        {preset.label}
                      </span>
                      <span className="block text-[10px] text-neutral-400 font-editorial mt-0.5 leading-tight">
                        {preset.meaning}
                      </span>
                    </button>
                  );
                })}

                {/* Custom Amount Button */}
                <button
                  type="button"
                  onClick={() => {
                    setIsCustom(true);
                    if (!customAmount) setCustomAmount('2500');
                  }}
                  className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                    isCustom
                      ? 'bg-amber-500/20 border-amber-400 text-amber-100 shadow-sm'
                      : 'bg-white/5 hover:bg-white/10 border-white/10 text-neutral-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-classic font-bold text-lg text-amber-200">
                      Custom
                    </span>
                    {isCustom && <Check className="w-4 h-4 text-amber-400" />}
                  </div>
                  <span className="block text-xs font-cinzel text-amber-300 font-semibold mt-1">
                    Other Amount
                  </span>
                  <span className="block text-[10px] text-neutral-400 font-editorial mt-0.5 leading-tight">
                    Any specific blessing
                  </span>
                </button>
              </div>
            </div>

            {/* Custom Amount Input Field */}
            {isCustom && (
              <div className="mb-6 p-4 rounded-xl bg-neutral-950/80 border border-amber-500/30">
                <label className="block text-xs font-cinzel text-amber-300 mb-1.5 font-semibold">
                  Enter Custom Blessing Amount (₹):
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-lg font-bold text-amber-400">
                    ₹
                  </span>
                  <input
                    type="text"
                    value={customAmount}
                    onChange={handleCustomAmountChange}
                    placeholder="e.g. 5,000"
                    className="w-full pl-9 pr-4 py-2.5 rounded-lg bg-neutral-900 border border-white/20 text-neutral-100 font-classic text-lg focus:outline-none focus:border-amber-400"
                  />
                </div>
                <p className="text-[11px] text-neutral-400 font-editorial mt-1.5">
                  Tip: In Indian customs, adding +₹1 (e.g. ₹2,101 or ₹5,001) represents uninterrupted prosperity and good luck.
                </p>
              </div>
            )}

            {/* Supported Payment Methods Bar */}
            <div className="p-3.5 rounded-xl bg-neutral-950/60 border border-white/10 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="text-xs font-cinzel text-neutral-300">
                  Accepted Payment Methods:
                </span>
              </div>
              <div className="flex items-center gap-3 text-xs font-sans font-medium text-neutral-300 flex-wrap">
                <span className="px-2 py-0.5 rounded bg-white/10 border border-white/15">UPI (GPay, PhonePe, Paytm)</span>
                <span className="px-2 py-0.5 rounded bg-white/10 border border-white/15">Debit/Credit Cards</span>
                <span className="px-2 py-0.5 rounded bg-white/10 border border-white/15">NetBanking</span>
                <span className="px-2 py-0.5 rounded bg-white/10 border border-white/15">International Cards</span>
              </div>
            </div>

            {/* Primary Action Button */}
            <div className="space-y-3">
              <button
                type="button"
                onClick={handleOpenGiftLink}
                className="w-full py-4 px-6 rounded-xl bg-amber-500 hover:bg-amber-400 active:scale-[0.99] text-neutral-950 font-cinzel font-bold text-base transition-all flex items-center justify-center gap-3 cursor-pointer shadow-lg"
              >
                <Gift className="w-5 h-5 text-neutral-950" />
                <span>
                  Proceed to Send {formattedTotal} Shagun
                </span>
                <ExternalLink className="w-4 h-4 text-neutral-950" />
              </button>

              <div className="flex items-center justify-center gap-4 text-xs text-neutral-400 font-editorial">
                <span className="flex items-center gap-1.5 text-emerald-400">
                  <ShieldCheck className="w-4 h-4" />
                  Direct, encrypted gateway transfer
                </span>
                <span>•</span>
                <span>Instant payment receipt provided</span>
              </div>
            </div>

            {/* Shareable Link Box */}
            <div className="mt-6 pt-5 border-t border-white/10">
              <label className="block text-xs font-cinzel text-neutral-300 mb-1.5">
                Official Shareable Registry Link:
              </label>
              <div className="flex items-center gap-2 bg-neutral-950 p-1.5 rounded-xl border border-white/15">
                <Lock className="w-4 h-4 text-emerald-400 ml-2 shrink-0" />
                <span className="flex-1 truncate font-mono text-xs text-neutral-300 select-all">
                  {giftUrl}
                </span>
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 border border-white/20 text-xs font-cinzel text-amber-200 transition-all cursor-pointer shrink-0"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-300">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-amber-300" />
                      <span>Copy Link</span>
                    </>
                  )}
                </button>
              </div>
            </div>

          </div>

          {/* Trust Guarantees Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {TRUST_PILLARS.map((pillar) => {
              const Icon = pillar.icon;
              return (
                <div
                  key={pillar.title}
                  className="p-4 rounded-xl bg-neutral-900/60 border border-white/10 flex items-start gap-3"
                >
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-400/30 flex items-center justify-center shrink-0 mt-0.5">
                    <Icon className="w-4 h-4 text-amber-300" />
                  </div>
                  <div>
                    <h4 className="font-cinzel text-xs font-bold text-amber-200">
                      {pillar.title}
                    </h4>
                    <p className="text-[11px] text-neutral-400 font-editorial mt-0.5 leading-relaxed">
                      {pillar.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

        {/* RIGHT COLUMN: Scannable UPI QR Code & Family Wishes (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          
          {/* Instant QR Code Card */}
          <div className="rounded-2xl bg-neutral-900/90 border border-amber-400/35 p-6 shadow-lg text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <QrCode className="w-5 h-5 text-amber-400" />
              <h3 className="font-classic text-xl font-bold text-amber-100">
                Scan with Mobile UPI
              </h3>
            </div>
            
            <p className="text-xs text-neutral-300 font-editorial mb-4">
              Open your phone camera or preferred UPI app to send blessings in seconds
            </p>

            {/* High-contrast, clean white QR container */}
            <div className="bg-white p-3 rounded-2xl inline-block shadow-md mx-auto mb-4 border border-neutral-300">
              <img
                src={qrCodeImgSrc}
                alt="Pulkit and Shreya Wedding Shagun QR Code"
                className="w-48 h-48 sm:w-52 sm:h-52 object-contain block mx-auto"
                loading="lazy"
              />
            </div>

            <div className="bg-neutral-950/80 p-3 rounded-xl border border-white/10 mb-4 text-left">
              <div className="flex items-center gap-2 text-xs font-cinzel text-amber-300 font-semibold mb-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Beneficiary Account Verified</span>
              </div>
              <p className="text-[11px] text-neutral-300 font-mono">
                Recipient: Pulkit &amp; Shreya Wedding Trust
              </p>
              <p className="text-[10px] text-neutral-400 font-editorial mt-0.5">
                Direct settlement via SuperProfile Secure Gateway
              </p>
            </div>

            <div className="grid grid-cols-4 gap-2 text-[10px] font-cinzel font-semibold text-neutral-300 text-center">
              <div className="p-1.5 rounded-lg bg-white/5 border border-white/10">Google Pay</div>
              <div className="p-1.5 rounded-lg bg-white/5 border border-white/10">PhonePe</div>
              <div className="p-1.5 rounded-lg bg-white/5 border border-white/10">Paytm</div>
              <div className="p-1.5 rounded-lg bg-white/5 border border-white/10">BHIM / Cards</div>
            </div>
          </div>

          {/* Relatives & Family Blessings Form */}
          <div className="rounded-2xl bg-neutral-900/90 border border-amber-400/35 p-6 shadow-lg">
            <div className="flex items-center gap-2 mb-2">
              <Heart className="w-5 h-5 text-rose-400" />
              <h3 className="font-classic text-xl font-bold text-amber-100">
                Attach a Blessing Message
              </h3>
            </div>
            
            <p className="text-xs text-neutral-300 font-editorial mb-4">
              Your heartfelt words will be recorded in Pulkit &amp; Shreya’s personal wedding memory book
            </p>

            {submittedWish ? (
              <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-center">
                <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                <h4 className="font-cinzel text-sm font-bold text-emerald-300">
                  Blessing Received with Gratitude!
                </h4>
                <p className="text-xs text-neutral-300 font-editorial mt-1">
                  Thank you, {senderName}. Your affectionate wish has been conveyed to the couple.
                </p>
                <button
                  type="button"
                  onClick={() => setSubmittedWish(false)}
                  className="mt-3 text-xs font-cinzel text-amber-300 underline cursor-pointer"
                >
                  Write another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSendWish} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-cinzel text-neutral-300 mb-1">
                    Your Full Name:
                  </label>
                  <input
                    type="text"
                    required
                    value={senderName}
                    onChange={(e) => setSenderName(e.target.value)}
                    placeholder="e.g. Ramesh &amp; Anita Sharma"
                    className="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-white/20 text-xs text-neutral-100 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-cinzel text-neutral-300 mb-1">
                    Your Relationship to Couple:
                  </label>
                  <select
                    value={relation}
                    onChange={(e) => setRelation(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-white/20 text-xs text-neutral-200 focus:outline-none focus:border-amber-400"
                  >
                    <option value="Chacha & Chachi / Tau & Tai">Chacha &amp; Chachi / Tau &amp; Tai</option>
                    <option value="Bua & Fufa Ji">Bua &amp; Fufa Ji</option>
                    <option value="Mama & Mami">Mama &amp; Mami</option>
                    <option value="Mausa & Mausi">Mausa &amp; Mausi</option>
                    <option value="Grandparents (Nana-Nani / Dada-Dadi)">Grandparents (Nana-Nani / Dada-Dadi)</option>
                    <option value="Elder Cousin / Sibling">Elder Cousin / Sibling</option>
                    <option value="Close Family Friend">Close Family Friend</option>
                    <option value="Well-wisher / Colleague">Well-wisher / Colleague</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-cinzel text-neutral-300 mb-1">
                    Blessing Message / Ashirwad:
                  </label>
                  <textarea
                    rows={3}
                    value={blessingMessage}
                    onChange={(e) => setBlessingMessage(e.target.value)}
                    placeholder="Write your prayers, blessings and warm wishes for the bride & groom..."
                    className="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-white/20 text-xs text-neutral-100 focus:outline-none focus:border-amber-400 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/15 border border-amber-400/40 text-amber-200 font-cinzel font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-all"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Attach Blessing Note</span>
                </button>
              </form>
            )}

            {/* Recent Blessings Feed */}
            <div className="mt-6 pt-4 border-t border-white/10">
              <h4 className="text-xs font-cinzel font-semibold text-amber-300 uppercase tracking-wider mb-2.5">
                Recent Family Blessings:
              </h4>

              <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1">
                {relativeWishes.slice(0, 3).map((w) => (
                  <div
                    key={w.id}
                    className="p-2.5 rounded-lg bg-neutral-950/60 border border-white/10 text-left"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-classic font-bold text-amber-200">
                        {w.senderName}
                      </span>
                      {w.shagunAmount && (
                        <span className="text-[11px] font-mono text-emerald-400 font-semibold">
                          {w.shagunAmount}
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] font-cinzel text-neutral-400 block">
                      {w.relation} &bull; {w.timestamp}
                    </span>
                    <p className="text-[11px] text-neutral-300 font-editorial italic mt-1 leading-snug">
                      &ldquo;{w.message}&rdquo;
                    </p>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Elder Assistance Notice */}
          <div className="p-4 rounded-xl bg-neutral-900/60 border border-white/10 flex items-start gap-3">
            <HelpCircle className="w-5 h-5 text-amber-300 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-cinzel font-bold text-neutral-200">
                Need Help with Digital Gifting?
              </h4>
              <p className="text-[11px] text-neutral-400 font-editorial mt-0.5 leading-relaxed">
                If you encounter any difficulty with UPI or card payments, please reach out to our wedding coordinators or family assistance desk on-site at The Oberoi Rajvilas.
              </p>
            </div>
          </div>

        </div>

      </div>

    </section>
  );
};
