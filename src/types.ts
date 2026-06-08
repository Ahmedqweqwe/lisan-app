/**
 * Lisan Application State & Data Types
 */

export type EmulatorScreen = "home" | "feed" | "simulation" | "direct_translate" | "history" | "settings";

export interface HistoryItem {
  id: string;
  franco: string;
  arabic: string;
  timestamp: string;
  isFavorite?: boolean;
}

export interface TranslationPreferences {
  autoSpeak: boolean;
  voiceGender: "female" | "male";
  arabicScript: "MSA" | "Egyptian" | "Levantine";
}

export interface SocialPost {
  id: string;
  author: string;
  avatarUrl: string;
  videoCoverUrl: string;
  caption: string;
  audioName: string;
  likes: string;
  comments: string;
  bookmarks: string;
  shares: string;
  originalText: string;
  translatedArabic: string;
}

export interface SimulationMessage {
  id: string;
  sender: "user" | "other";
  text: string;
  translatedText?: string;
}
