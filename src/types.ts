export interface ColorPalette {
  primaryBg: string;
  cardBg: string;
  accentGold: string;
  borderGold: string;
  textPrimary: string;
  textSecondary: string;
  badgeBg: string;
  badgeText: string;
  gradient: string;
}

export interface WeddingTheme {
  presetId?: string;
  id?: string;
  name?: string;
  subtitle?: string;
  badge?: string;
  culturalTheme: string;
  culturalInvocation: string;
  coverImage?: string;
  secondaryImage?: string;
  backdropArtwork?: string;
  colorPalette: ColorPalette;
  petalColors: string[];
  shloka: string;
  shlokaMeaning: string;
  poeticNote: string;
  musicPreset?: 'romantic' | 'shehnai' | 'flute' | 'sitar';
  primaryBg?: string;
  cardBg?: string;
  accentGold?: string;
  borderGold?: string;
}

export interface CeremonyEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  venue: string;
  description: string;
  dressCode?: string;
  photoUrl: string;
  blessingCount?: number;
}

export interface GalleryPhoto {
  id: string;
  url: string;
  caption: string;
  date: string;
}

export interface WeddingConfig {
  id?: string;
  groomName: string;
  brideName: string;
  monogramText: string;
  hashtag: string;
  weddingDate: string;
  weddingDateFormatted: string;
  weddingTime: string;
  venueName: string;
  venueCity: string;
  venueAddress: string;
  googleMapsUrl: string;
  welcomeMessage: string;
  scratchRevealHeading: string;
  scratchRevealNote: string;
  scratchRevealPhoto: string;
  heroCouplePhoto?: string;
  theme: WeddingTheme;
  galleryPhotos: GalleryPhoto[];
  events: CeremonyEvent[];
  giftRegistryUrl?: string;
}
