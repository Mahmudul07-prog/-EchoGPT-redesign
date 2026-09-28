import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Clapperboard, Pause, Play, Wand2 } from "lucide-react";
import { PageHeader } from "../components/PageHeader";
import { ArtTile } from "../components/ArtTile";
import { useMediaStore } from "../store/mediaStore";
import { createId, cn } from "../lib/utils";

const FRAME_COUNT = 4;

export default function VideoStudioPage() {
  const videos = useMediaStore((s) => s.videos);
  const addVideo = useMediaStore((s) => s.addVideo);

  const [prompt, setPrompt] = useState("");
  const [renderingFrame, setRenderingFrame] = useState(0);
  const [frames, setFrames] = useState<string[]>([]);
  const [playing, setPlaying] = useState(false);
  const [activeFrame, setActiveFrame] = useState(0);
  const playRef = useRef<number | null>(null);

  function handleGenerate() {
    const trimmed = prompt.trim();
    if (!trimmed || renderingFrame > 0) return;
    setFrames([]);
    setPlaying(false);
    setActiveFrame(0);
    setRenderingFrame(1);

    let frame = 1;
    const revealNext = () => {
      setFrames((prev) => [...prev, `${trimmed}|frame-${frame}`]);
      if (frame >= FRAME_COUNT) {
        setRenderingFrame(0);
        addVideo({ id: createId("vid"), prompt: trimmed, seed: 0, createdAt: Date.now() });
        return;
      }
      frame += 1;
      setRenderingFrame(frame);
      window.setTimeout(revealNext, 500 + Math.random() * 250);
    };
    window.setTimeout(revealNext, 500 + Math.random() * 250);
  }

  useEffect(() => {
    if (playing && frames.length === FRAME_COUNT) {
      playRef.current = window.setInterval(() => {
        setActiveFrame((f) => (f + 1) % FRAME_COUNT);
      }, 700);
    }
    return () => {
      if (playRef.current) window.clearInterval(playRef.current);
    };
  }, [playing, frames.length]);

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6">
      <PageHeader
        title="Video Studio"
        description="Sketch a mock 4-frame storyboard from a prompt. No real video is generated in this demo — frames are simulated locally."
        icon={<Clapperboard size={20} strokeWidth={1.75} />}
      />

      <div className="flex flex-col gap-3 sm:flex-row">
        <label htmlFor="video-prompt" className="sr-only">
          Storyboard prompt
        </label>
        <input
          id="video-prompt"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="A time-lapse of a city garden growing through the seasons…"
          className="flex-1 rounded-full border border-border-light bg-surface-light px-4 py-2.5 text-sm text-text-light outline-none placeholder:text-text-muted-light focus-visible:ring-2 focus-visible:ring-brand-500 dark:border-border-dark dark:bg-surface-dark dark:text-text-dark dark:placeholder:text-text-muted-dark"
        />
        <button
          type="button"
          onClick={handleGenerate}
          disabled={!prompt.trim() || renderingFrame > 0}
          className="flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-brand-600 to-accent-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:brightness-110 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Wand2 size={16} strokeWidth={2} />
          Generate storyboard
        </button>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {Array.from({ length: FRAME_COUNT }, (_, i) => {
          const seed = frames[i];
          const isRendering = renderingFrame === i + 1;
          return (
            <div key={i} className="relative">
              {seed ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: activeFrame === i && playing ? 1.03 : 1 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  className={cn("rounded-card ring-2 ring-transparent transition", activeFrame === i && playing && "ring-brand-500")}
                >
                  <ArtTile seedText={seed} aspect="4:3" />
                </motion.div>
              ) : (
                <div className="flex aspect-[4/3] flex-col items-center justify-center gap-2 rounded-card border border-dashed border-border-light bg-surface-light dark:border-border-dark dark:bg-surface-dark">
                  {isRendering ? (
                    <>
                      <div className="h-1 w-16 overflow-hidden rounded-full bg-border-light dark:bg-border-dark">
                        <motion.div
                          className="h-full bg-brand-500"
                          initial={{ width: "0%" }}
                          animate={{ width: "100%" }}
                          transition={{ duration: 0.6 }}
                        />
                      </div>
                      <span className="text-xs text-text-muted-light dark:text-text-muted-dark">Rendering {i + 1}/{FRAME_COUNT}</span>
                    </>
                  ) : (
                    <span className="text-xs text-text-muted-light dark:text-text-muted-dark">Frame {i + 1}</span>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {frames.length === FRAME_COUNT && (
        <div className="mt-4 flex items-center gap-3">
          <button
            type="button"
            onClick={() => setPlaying((p) => !p)}
            className="flex items-center gap-2 rounded-full border border-border-light px-4 py-2 text-sm font-medium text-text-light transition hover:bg-brand-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 dark:border-border-dark dark:text-text-dark dark:hover:bg-white/5"
          >
            {playing ? <Pause size={15} strokeWidth={2} /> : <Play size={15} strokeWidth={2} />}
            {playing ? "Pause preview" : "Play preview"}
          </button>
          <p className="text-xs italic text-text-muted-light dark:text-text-muted-dark">
            Simulated storyboard preview — no real video is generated in this demo.
          </p>
        </div>
      )}

      {videos.length > 0 && (
        <div className="mt-10">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-text-muted-light dark:text-text-muted-dark">
            Past storyboards
          </p>
          <div className="space-y-2">
            {videos.map((v) => (
              <div key={v.id} className="flex items-center gap-3 rounded-xl border border-border-light bg-surface-light px-4 py-2.5 dark:border-border-dark dark:bg-surface-dark">
                <div className="h-10 w-10 shrink-0 overflow-hidden rounded-lg">
                  <ArtTile seedText={`${v.prompt}|frame-1`} aspect="1:1" />
                </div>
                <p className="min-w-0 flex-1 truncate text-sm text-text-light dark:text-text-dark">{v.prompt}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
