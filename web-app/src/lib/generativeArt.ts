import { hashString, mulberry32 } from "./utils";

export interface ArtBlob {
  x: number;
  y: number;
  size: number;
  hue: number;
  saturation: number;
  lightness: number;
  opacity: number;
}

export interface GenerativeArt {
  seed: number;
  angle: number;
  hues: [number, number, number];
  blobs: ArtBlob[];
  background: string;
}

/**
 * Builds a fully deterministic abstract gradient "image" from an arbitrary
 * string (a prompt, optionally combined with style/aspect settings). The
 * same input always produces the exact same output — this stands in for a
 * real image generation model, which this demo does not have access to.
 */
export function generateArt(seedText: string): GenerativeArt {
  const seed = hashString(seedText);
  const rand = mulberry32(seed);

  const baseHue = Math.floor(rand() * 360);
  const hues: [number, number, number] = [
    baseHue,
    (baseHue + 40 + Math.floor(rand() * 40)) % 360,
    (baseHue + 200 + Math.floor(rand() * 60)) % 360,
  ];
  const angle = Math.floor(rand() * 360);

  const blobs: ArtBlob[] = Array.from({ length: 5 }, (_, i) => ({
    x: Math.round(rand() * 100),
    y: Math.round(rand() * 100),
    size: Math.round(30 + rand() * 55),
    hue: hues[i % hues.length],
    saturation: Math.round(55 + rand() * 35),
    lightness: Math.round(45 + rand() * 20),
    opacity: Number((0.35 + rand() * 0.35).toFixed(2)),
  }));

  const background = `linear-gradient(${angle}deg, hsl(${hues[0]} 70% 22%), hsl(${hues[1]} 65% 16%) 55%, hsl(${hues[2]} 60% 12%))`;

  return { seed, angle, hues, blobs, background };
}

export function artToCssBackground(art: GenerativeArt): string {
  const blobLayers = art.blobs
    .map(
      (b) =>
        `radial-gradient(circle at ${b.x}% ${b.y}%, hsla(${b.hue} ${b.saturation}% ${b.lightness}% / ${b.opacity}) 0%, transparent ${b.size}%)`,
    )
    .join(", ");
  return `${blobLayers}, ${art.background}`;
}
