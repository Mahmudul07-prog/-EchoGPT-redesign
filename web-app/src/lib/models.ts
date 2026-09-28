import type { ModelInfo } from "../types";

export const MODELS: ModelInfo[] = [
  {
    id: "echo-turbo",
    name: "EchoGPT Turbo",
    description: "Fast, terse everyday answers",
    speedMs: [8, 16],
    chunkSize: [4, 8],
    prefersLength: "short",
  },
  {
    id: "echo-pro",
    name: "EchoGPT Pro",
    badge: "PRO",
    description: "Deeper reasoning, structured answers",
    speedMs: [22, 40],
    chunkSize: [2, 4],
    prefersLength: "long",
  },
  {
    id: "echo-vision",
    name: "EchoGPT Vision",
    badge: "PRO",
    description: "Great with visual & creative prompts",
    speedMs: [18, 32],
    chunkSize: [3, 5],
    prefersLength: "long",
  },
  {
    id: "echo-mini",
    name: "EchoGPT Mini",
    description: "Lightweight, quick drafts",
    speedMs: [6, 12],
    chunkSize: [5, 9],
    prefersLength: "short",
  },
];

export const DEFAULT_MODEL_ID = MODELS[0].id;

export function getModel(modelId: string): ModelInfo {
  return MODELS.find((m) => m.id === modelId) ?? MODELS[0];
}
