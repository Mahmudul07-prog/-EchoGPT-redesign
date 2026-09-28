import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ImageGeneration, VideoStoryboard } from "../types";

interface MediaState {
  images: ImageGeneration[];
  videos: VideoStoryboard[];
  addImage: (image: ImageGeneration) => void;
  addVideo: (video: VideoStoryboard) => void;
}

export const useMediaStore = create<MediaState>()(
  persist(
    (set) => ({
      images: [],
      videos: [],
      addImage: (image) => set((state) => ({ images: [image, ...state.images].slice(0, 12) })),
      addVideo: (video) => set((state) => ({ videos: [video, ...state.videos].slice(0, 12) })),
    }),
    { name: "echogpt-media-store" },
  ),
);
