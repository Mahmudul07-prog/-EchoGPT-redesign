import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Image as ImageIcon, Loader2, Wand2 } from "lucide-react";
import { PageHeader } from "../components/PageHeader";
import { ArtTile } from "../components/ArtTile";
import { useMediaStore } from "../store/mediaStore";
import { createId } from "../lib/utils";

const STYLES = ["Photographic", "Illustration", "Abstract", "3D Render", "Watercolor"];
const ASPECTS = ["1:1", "16:9", "9:16", "4:3"];

export default function ImageStudioPage() {
  const images = useMediaStore((s) => s.images);
  const addImage = useMediaStore((s) => s.addImage);
  const reduceMotion = useReducedMotion();

  const [prompt, setPrompt] = useState("");
  const [style, setStyle] = useState(STYLES[0]);
  const [aspect, setAspect] = useState(ASPECTS[0]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<{ seedText: string; aspect: string } | null>(null);

  function handleGenerate() {
    if (!prompt.trim() || isGenerating) return;
    setIsGenerating(true);
    setResult(null);
    const seedText = `${prompt.trim()}|${style}|${aspect}`;
    window.setTimeout(() => {
      setResult({ seedText, aspect });
      addImage({ id: createId("img"), prompt: prompt.trim(), style, aspect, seed: 0, createdAt: Date.now() });
      setIsGenerating(false);
    }, 700 + Math.random() * 300);
  }

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6">
      <PageHeader
        title="Image Studio"
        description="Describe a concept and generate a preview tile. Image generation is simulated locally in this demo — no real model runs."
        icon={<ImageIcon size={20} strokeWidth={1.75} />}
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div>
          <div
            className={
              result
                ? "relative overflow-hidden rounded-card border border-border-light dark:border-border-dark"
                : "flex aspect-video items-center justify-center rounded-card border border-dashed border-border-light bg-surface-light dark:border-border-dark dark:bg-surface-dark"
            }
          >
            {isGenerating ? (
              <div className="flex aspect-video w-full flex-col items-center justify-center gap-2 rounded-card border border-border-light bg-surface-light dark:border-border-dark dark:bg-surface-dark">
                <Loader2 size={22} className="animate-spin text-brand-500" />
                <p className="text-sm text-text-muted-light dark:text-text-muted-dark">Rendering concept preview…</p>
              </div>
            ) : result ? (
              <motion.div
                initial={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: reduceMotion ? 0.2 : 0.4, ease: [0.16, 1, 0.3, 1] }}
              >
                <ArtTile seedText={result.seedText} aspect={result.aspect} />
              </motion.div>
            ) : (
              <p className="max-w-xs px-4 text-center text-sm text-text-muted-light dark:text-text-muted-dark">
                Your generated concept preview will appear here.
              </p>
            )}
          </div>
          <p className="mt-2 text-xs italic text-text-muted-light dark:text-text-muted-dark">
            Concept preview — image generation is simulated in this demo.
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label htmlFor="image-prompt" className="mb-1.5 block text-sm font-medium text-text-light dark:text-text-dark">
              Prompt
            </label>
            <textarea
              id="image-prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={4}
              placeholder="A floating library above a neon canyon at dusk…"
              className="w-full resize-none rounded-xl border border-border-light bg-surface-light px-3.5 py-2.5 text-sm text-text-light outline-none placeholder:text-text-muted-light focus-visible:ring-2 focus-visible:ring-brand-500 dark:border-border-dark dark:bg-surface-dark dark:text-text-dark dark:placeholder:text-text-muted-dark"
            />
          </div>
          <div>
            <label htmlFor="image-style" className="mb-1.5 block text-sm font-medium text-text-light dark:text-text-dark">
              Style
            </label>
            <select
              id="image-style"
              value={style}
              onChange={(e) => setStyle(e.target.value)}
              className="w-full rounded-xl border border-border-light bg-surface-light px-3.5 py-2.5 text-sm text-text-light outline-none focus-visible:ring-2 focus-visible:ring-brand-500 dark:border-border-dark dark:bg-surface-dark dark:text-text-dark"
            >
              {STYLES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="image-aspect" className="mb-1.5 block text-sm font-medium text-text-light dark:text-text-dark">
              Aspect ratio
            </label>
            <select
              id="image-aspect"
              value={aspect}
              onChange={(e) => setAspect(e.target.value)}
              className="w-full rounded-xl border border-border-light bg-surface-light px-3.5 py-2.5 text-sm text-text-light outline-none focus-visible:ring-2 focus-visible:ring-brand-500 dark:border-border-dark dark:bg-surface-dark dark:text-text-dark"
            >
              {ASPECTS.map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </select>
          </div>
          <button
            type="button"
            onClick={handleGenerate}
            disabled={!prompt.trim() || isGenerating}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-brand-600 to-accent-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:brightness-110 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Wand2 size={16} strokeWidth={2} />
            Generate
          </button>
        </div>
      </div>

      {images.length > 0 && (
        <div className="mt-10">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-text-muted-light dark:text-text-muted-dark">
            Recent generations
          </p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6">
            {images.map((img) => (
              <div key={img.id}>
                <ArtTile seedText={`${img.prompt}|${img.style}|${img.aspect}`} aspect={img.aspect} />
                <p className="mt-1 truncate text-xs text-text-muted-light dark:text-text-muted-dark" title={img.prompt}>
                  {img.prompt}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
