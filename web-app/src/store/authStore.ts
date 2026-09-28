import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AuthUser } from "../types";

interface AuthState {
  user: AuthUser | null;
  signIn: (name: string) => void;
  continueAsGuest: () => void;
  signOut: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      signIn: (name) => set({ user: { name: name.trim() || "Guest", isGuest: false } }),
      continueAsGuest: () => set({ user: { name: "Guest", isGuest: true } }),
      signOut: () => set({ user: null }),
    }),
    { name: "echogpt-auth-store" },
  ),
);
