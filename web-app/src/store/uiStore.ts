import { create } from "zustand";
import type { ToastItem } from "../types";
import { createId } from "../lib/utils";

interface UiState {
  mobileSidebarOpen: boolean;
  authModalOpen: boolean;
  toasts: ToastItem[];

  openMobileSidebar: () => void;
  closeMobileSidebar: () => void;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  addToast: (message: string, variant?: ToastItem["variant"]) => void;
  removeToast: (id: string) => void;
}

export const useUiStore = create<UiState>((set) => ({
  mobileSidebarOpen: false,
  authModalOpen: false,
  toasts: [],

  openMobileSidebar: () => set({ mobileSidebarOpen: true }),
  closeMobileSidebar: () => set({ mobileSidebarOpen: false }),
  openAuthModal: () => set({ authModalOpen: true }),
  closeAuthModal: () => set({ authModalOpen: false }),
  addToast: (message, variant = "default") =>
    set((state) => ({ toasts: [...state.toasts, { id: createId("toast"), message, variant }] })),
  removeToast: (id) => set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
}));
