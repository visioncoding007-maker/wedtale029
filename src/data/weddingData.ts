import { WeddingConfig } from '../types';

export const DEFAULT_WEDDING_CONFIG: WeddingConfig = {
  id: 'royal-wedding-pulkit-shreya',
  groomName: 'Pulkit',
  brideName: 'Shreya',
  monogramText: 'PS',
  hashtag: '#PulkitWedsShreya',
  weddingDate: '2026-12-14',
  weddingDateFormatted: 'December 14, 2026',
  weddingTime: '06:30 PM',
  venueName: 'The Oberoi Rajvilas',
  venueCity: 'Jaipur, Rajasthan',
  venueAddress: 'Babaji Ka Mode, Goner Rd, Jaipur, Rajasthan 302031',
  googleMapsUrl: 'https://maps.google.com/?q=The+Oberoi+Rajvilas+Jaipur',
  welcomeMessage:
    'Gentle touches, twilight fairy lights in blooming lilac gardens, and vows celebrated with a midnight waltz.',
  scratchRevealHeading: 'PASTEL ROMANCE CHAPTER',
  scratchRevealNote:
    'Gentle touches, twilight fairy lights in blooming lilac gardens, and vows celebrated with a midnight waltz.',
  scratchRevealPhoto: 'https://www.wedtale.shop/assets/pastel_lilac_romance_1788535115893-Jt7F5QMm.jpg',
  heroCouplePhoto: 'https://www.wedtale.shop/assets/pastel_lilac_romance_1788535115893-Jt7F5QMm.jpg',
  theme: {
    presetId: 'pastel-romance',
    name: 'Pastel Romance & Lilac Garden Dreams',
    subtitle: 'Blush Pink & Lilac Hues, Twilight Mehendi & Midnight Ballroom Waltz',
    badge: 'Modern Pastel Romance',
    culturalTheme: 'Pastel Romance',
    culturalInvocation: '॥ OM SHANTI SHANTI • PASTEL ROMANCE & HARMONY ॥',
    coverImage: 'https://www.wedtale.shop/assets/pastel_lilac_romance_1788535115893-Jt7F5QMm.jpg',
    secondaryImage: 'https://www.wedtale.shop/assets/ballroom_first_dance_1788535197075-BjTDgFZM.jpg',
    backdropArtwork: 'https://www.wedtale.shop/assets/pastel_lilac_romance_1788535115893-Jt7F5QMm.jpg',
    colorPalette: {
      primaryBg: '#180E24',
      cardBg: '#281338',
      accentGold: '#F59E0B',
      borderGold: '#FBBF24',
      textPrimary: '#FAF5FF',
      textSecondary: '#E9D5FF',
      badgeBg: '#581C87',
      badgeText: '#F3E8FF',
      gradient: 'from-purple-900 via-rose-800 to-amber-700',
    },
    petalColors: ['#F472B6', '#E9D5FF', '#FDE047', '#FFFFFF', '#C084FC'],
    shloka:
      'Samanjantu vishvedevah samapo hridayani nau • Sam matarisva sam dhata samu deshtri dadhatu nau',
    shlokaMeaning:
      'May all divine energies unite our hearts; may the breath of life bring us into everlasting oneness.',
    poeticNote:
      'Gentle touches, twilight fairy lights in blooming lilac gardens, and vows celebrated with a midnight waltz.',
    musicPreset: 'romantic',
    primaryBg: '#180E24',
    cardBg: '#281338',
    accentGold: '#F59E0B',
    borderGold: '#FBBF24',
  },
  galleryPhotos: [
    {
      id: 'g-pr-1',
      url: 'https://www.wedtale.shop/assets/pastel_lilac_romance_1788535115893-Jt7F5QMm.jpg',
      caption: 'When two hearts whisper forever in pastel twilight',
      date: 'Sunset Gazebo',
    },
    {
      id: 'g-pr-2',
      url: 'https://www.wedtale.shop/assets/golden_haldi_ceremony_1788535162943-Bohp8q0-.jpg',
      caption: 'Sun-drenched Haldi smiles on the floral swing',
      date: 'Haldi Courtyard',
    },
    {
      id: 'g-pr-3',
      url: 'https://www.wedtale.shop/assets/twilight_garden_mehendi_1788535181766-CXxAcEoa.jpg',
      caption: 'Fragrant henna under twinkling twilight fairy lights',
      date: 'Garden Lawns',
    },
    {
      id: 'g-pr-4',
      url: 'https://www.wedtale.shop/assets/royal_sindoor_vivaha_1788535101917-CzOKfdGu.jpg',
      caption: 'Sacred Sindoor & eternal seven vows by holy Agni',
      date: 'Vivaha Mandap',
    },
    {
      id: 'g-pr-5',
      url: 'https://www.wedtale.shop/assets/lavender_reception_aisle_1788535137772-DxV8KbTh.jpg',
      caption: 'Hand-in-hand down the petal-strewn royal lavender aisle',
      date: 'Grand Aisle',
    },
    {
      id: 'g-pr-6',
      url: 'https://www.wedtale.shop/assets/ballroom_first_dance_1788535197075-BjTDgFZM.jpg',
      caption: 'Midnight ballroom first dance waltz under chandeliers',
      date: 'Crystal Ballroom',
    },
  ],
  events: [
    {
      id: 'e-pr-1',
      title: 'Haldi & Floral Chashni',
      date: 'Dec 13, 2026',
      time: '10:30 AM',
      venue: 'Marigold Poolside Lawns',
      description:
        'Golden turmeric paste blessings, playful splashes, and showering of fresh yellow marigold & rose petals.',
      dressCode: 'Sunshine Yellow & White Ethnic',
      photoUrl: 'https://www.wedtale.shop/assets/golden_haldi_ceremony_1788535162943-Bohp8q0-.jpg',
      blessingCount: 164,
    },
    {
      id: 'e-pr-2',
      title: 'Twilight Garden Mehendi & Sangeet',
      date: 'Dec 13, 2026',
      time: '05:30 PM',
      venue: 'Illuminated Baradari Gardens',
      description:
        'Intricate herbal henna artistry, live acoustic sitar fusion melodies, and spirited dance performances under fairy lights.',
      dressCode: 'Pastel Lilac, Mint & Rose Quartz',
      photoUrl: 'https://www.wedtale.shop/assets/twilight_garden_mehendi_1788535181766-CXxAcEoa.jpg',
      blessingCount: 218,
    },
    {
      id: 'e-pr-3',
      title: 'Sacred Sindoor Vivaha & Pheras',
      date: 'Dec 14, 2026',
      time: '06:30 PM',
      venue: 'Royal Lotus Mandap Pavilion',
      description:
        'Vedic wedding rites, auspicious Jaimala varmala exchange, and sacred Sindoor ceremony by the holy Agni.',
      dressCode: 'Traditional Silk & Embroidered Sherwanis',
      photoUrl: 'https://www.wedtale.shop/assets/royal_sindoor_vivaha_1788535101917-CzOKfdGu.jpg',
      blessingCount: 342,
    },
    {
      id: 'e-pr-4',
      title: 'Grand Reception & Ballroom First Dance',
      date: 'Dec 14, 2026',
      time: '08:30 PM onwards',
      venue: 'Grand Crystal Chandelier Ballroom',
      description:
        'Champagne toast, midnight ballroom first dance waltz, gourmet royal banquet, and celebratory sky fireworks.',
      dressCode: 'Black Tie / Evening Glamour',
      photoUrl: 'https://www.wedtale.shop/assets/ballroom_first_dance_1788535197075-BjTDgFZM.jpg',
      blessingCount: 289,
    },
  ],
  giftRegistryUrl: 'https://superprofile.bio/vp/gift-here',
};

/**
 * Parses URL query parameters if present, overriding defaults smoothly
 */
export function getInitialWeddingConfig(): WeddingConfig {
  if (typeof window === 'undefined') return DEFAULT_WEDDING_CONFIG;

  try {
    const search = window.location.search;
    if (!search) return DEFAULT_WEDDING_CONFIG;

    const params = new URLSearchParams(search);
    const config: WeddingConfig = JSON.parse(JSON.stringify(DEFAULT_WEDDING_CONFIG));

    // Check payload in ?c=...
    const cParam = params.get('c');
    if (cParam) {
      try {
        let jsonStr = '';
        try {
          jsonStr = decodeURIComponent(atob(cParam.replace(/ /g, '+')));
        } catch {
          jsonStr = decodeURIComponent(cParam);
        }
        const parsed = JSON.parse(jsonStr);
        if (parsed && typeof parsed === 'object') {
          if (parsed.groom) config.groomName = parsed.groom;
          if (parsed.bride) config.brideName = parsed.bride;
          if (parsed.monogram) config.monogramText = parsed.monogram;
          if (parsed.hashtag) config.hashtag = parsed.hashtag;
          if (parsed.date) config.weddingDate = parsed.date;
          if (parsed.dateFormatted) config.weddingDateFormatted = parsed.dateFormatted;
          if (parsed.time) config.weddingTime = parsed.time;
          if (parsed.venue) config.venueName = parsed.venue;
          if (parsed.city) config.venueCity = parsed.city;
          if (parsed.welcome) config.welcomeMessage = parsed.welcome;
          if (parsed.scratchTitle) config.scratchRevealHeading = parsed.scratchTitle;
          if (parsed.scratchSubtitle) config.scratchRevealNote = parsed.scratchSubtitle;
        }
      } catch (err) {
        console.warn('Could not parse c query param', err);
      }
    }

    // Direct url params
    if (params.get('g')) config.groomName = params.get('g')!;
    if (params.get('b')) config.brideName = params.get('b')!;
    if (params.get('gift')) config.giftRegistryUrl = params.get('gift')!;
    if (params.get('d')) {
      config.weddingDate = params.get('d')!;
      try {
        const d = new Date(params.get('d')!);
        config.weddingDateFormatted = d.toLocaleDateString('en-US', {
          month: 'long',
          day: 'numeric',
          year: 'numeric',
        });
      } catch {
        // keep default
      }
    }
    if (params.get('v')) config.venueName = params.get('v')!;

    // Recompute monogram & hashtag if groom/bride changed
    if (params.get('g') || params.get('b')) {
      config.monogramText = `${config.groomName.charAt(0)}${config.brideName.charAt(0)}`.toUpperCase();
      config.hashtag = `#${config.groomName.replace(/\s+/g, '')}Weds${config.brideName.replace(/\s+/g, '')}`;
    }

    return config;
  } catch {
    return DEFAULT_WEDDING_CONFIG;
  }
}
