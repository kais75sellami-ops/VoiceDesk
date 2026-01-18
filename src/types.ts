export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface Language {
  code: string;
  name: string;
}

export interface VoiceSettings {
  stability: number;
  similarity_boost: number;
  style: number;
}

export const LANGUAGES: Language[] = [
  { code: 'en', name: 'Anglais' },
  { code: 'es', name: 'Espagnol' },
  { code: 'fr', name: 'Français' },
  { code: 'de', name: 'Allemand' },
  { code: 'it', name: 'Italien' },
  { code: 'ar', name: 'Arabe' },
];

export const DEFAULT_VOICE_SETTINGS: VoiceSettings = {
  stability: 0.5,
  similarity_boost: 0.75,
  style: 0.0,
};
