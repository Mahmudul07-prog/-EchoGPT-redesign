export type ThemeMode = "light" | "dark" | "system";

export type MessageRole = "user" | "assistant";

export type LikeState = "up" | "down" | null;

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  modelId?: string;
  createdAt: number;
  isStreaming?: boolean;
  liked?: LikeState;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: number;
  updatedAt: number;
  personaId?: string;
}

export interface ModelInfo {
  id: string;
  name: string;
  description: string;
  badge?: "PRO";
  /** inclusive [min, max] milliseconds between streamed chunks */
  speedMs: [number, number];
  /** inclusive [min, max] tokens (words+whitespace) per streamed chunk */
  chunkSize: [number, number];
  /** which hand-written reply length this model prefers */
  prefersLength: "short" | "long";
}

export type ReplyCategory =
  | "resume"
  | "summary"
  | "code"
  | "greeting"
  | "general";

export interface Connector {
  id: string;
  name: string;
  description: string;
  connected: boolean;
}

export interface Persona {
  id: string;
  name: string;
  tagline: string;
  description: string;
  intro: string;
}

export interface ToastItem {
  id: string;
  message: string;
  variant?: "default" | "success" | "danger";
}

export interface AuthUser {
  name: string;
  isGuest: boolean;
  avatarDataUrl?: string | null;
}

export type BillingCycle = "monthly" | "yearly";
export type PlanId = "free" | "pro" | "team";

export interface NotificationPrefs {
  productUpdates: boolean;
  soundEffects: boolean;
  desktopAlerts: boolean;
}

export interface ImageGeneration {
  id: string;
  prompt: string;
  style: string;
  aspect: string;
  seed: number;
  createdAt: number;
}

export interface VideoStoryboard {
  id: string;
  prompt: string;
  seed: number;
  createdAt: number;
}
