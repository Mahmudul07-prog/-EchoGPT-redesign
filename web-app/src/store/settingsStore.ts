import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { BillingCycle, NotificationPrefs, PlanId, ThemeMode } from "../types";
import { DEFAULT_MODEL_ID } from "../lib/models";

interface SettingsState {
  theme: ThemeMode;
  defaultModelId: string;
  profileName: string;
  profileAvatarDataUrl: string | null;
  notifications: NotificationPrefs;
  hasSeenSimulatedAiNotice: boolean;
  plan: PlanId;
  billingCycle: BillingCycle;

  setTheme: (theme: ThemeMode) => void;
  setDefaultModel: (modelId: string) => void;
  setProfileName: (name: string) => void;
  setProfileAvatar: (dataUrl: string | null) => void;
  setNotification: (key: keyof NotificationPrefs, value: boolean) => void;
  markSimulatedAiNoticeSeen: () => void;
  setPlan: (plan: PlanId) => void;
  setBillingCycle: (cycle: BillingCycle) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      theme: "system",
      defaultModelId: DEFAULT_MODEL_ID,
      profileName: "",
      profileAvatarDataUrl: null,
      notifications: {
        productUpdates: true,
        soundEffects: false,
        desktopAlerts: false,
      },
      hasSeenSimulatedAiNotice: false,
      plan: "free",
      billingCycle: "monthly",

      setTheme: (theme) => set({ theme }),
      setDefaultModel: (defaultModelId) => set({ defaultModelId }),
      setProfileName: (profileName) => set({ profileName }),
      setProfileAvatar: (profileAvatarDataUrl) => set({ profileAvatarDataUrl }),
      setNotification: (key, value) =>
        set((state) => ({ notifications: { ...state.notifications, [key]: value } })),
      markSimulatedAiNoticeSeen: () => set({ hasSeenSimulatedAiNotice: true }),
      setPlan: (plan) => set({ plan }),
      setBillingCycle: (billingCycle) => set({ billingCycle }),
    }),
    { name: "echogpt-settings-store" },
  ),
);
