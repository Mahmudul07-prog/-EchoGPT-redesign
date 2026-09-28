import { generateArt, artToCssBackground } from "../lib/generativeArt";
import { cn } from "../lib/utils";

const ASPECT_CLASSES: Record<string, string> = {
  "1:1": "aspect-square",
  "16:9": "aspect-video",
  "9:16": "aspect-[9/16]",
  "4:3": "aspect-[4/3]",
};

interface ArtTileProps {
  seedText: string;
  aspect?: string;
  className?: string;
}

export function ArtTile({ seedText, aspect = "1:1", className }: ArtTileProps) {
  const art = generateArt(seedText);
  return (
    <div
      className={cn("rounded-card", ASPECT_CLASSES[aspect] ?? "aspect-square", className)}
      style={{ backgroundImage: artToCssBackground(art) }}
      role="img"
      aria-label={`Abstract simulated concept art for: ${seedText}`}
    />
  );
}
