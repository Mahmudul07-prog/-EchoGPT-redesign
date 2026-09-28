import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Copy, RotateCcw, ThumbsDown, ThumbsUp, Volume2, VolumeX } from "lucide-react";
import type { ChatMessage } from "../types";
import { Logo } from "./Logo";
import { Avatar } from "./Avatar";
import { renderMarkdownLite } from "../lib/markdown";
import { isSpeechSynthesisSupported, speak, stopSpeaking } from "../lib/speech";
import { useUiStore } from "../store/uiStore";
import { useAuthStore } from "../store/authStore";
import { useSettingsStore } from "../store/settingsStore";
import { getModel } from "../lib/models";
import { cn } from "../lib/utils";

interface MessageBubbleProps {
  message: ChatMessage;
  canRegenerate?: boolean;
  onRegenerate?: () => void;
  onToggleLike?: (value: "up" | "down") => void;
  compact?: boolean;
}

export function MessageBubble({ message, canRegenerate, onRegenerate, onToggleLike, compact }: MessageBubbleProps) {
  const reduceMotion = useReducedMotion();
  const addToast = useUiStore((s) => s.addToast);
  const user = useAuthStore((s) => s.user);
  const profileAvatar = useSettingsStore((s) => s.profileAvatarDataUrl);
  const [speaking, setSpeaking] = useState(false);
  const isUser = message.role === "user";
  const speechSupported = isSpeechSynthesisSupported();

  useEffect(() => stopSpeaking, []);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(message.content);
      addToast("Message copied to clipboard.", "success");
    } catch {
      addToast("Couldn't access the clipboard in this browser.", "danger");
    }
  }

  function handleReadAloud() {
    if (!speechSupported) return;
    if (speaking) {
      stopSpeaking();
      setSpeaking(false);
      return;
    }
    setSpeaking(true);
    speak(message.content, () => setSpeaking(false));
  }

  return (
    <motion.div
      initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reduceMotion ? 0.15 : 0.35, ease: [0.16, 1, 0.3, 1] }}
      className={cn("flex gap-3", isUser && "flex-row-reverse")}
    >
      {!compact &&
        (isUser ? (
          <Avatar name={user?.name ?? "You"} avatarDataUrl={profileAvatar} size={28} className="mt-0.5" />
        ) : (
          <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-50 dark:bg-white/5">
            <Logo size={20} />
          </div>
        ))}

      <div className={cn("min-w-0", compact ? "w-full" : "max-w-[85%] sm:max-w-[75%]", isUser && "flex flex-col items-end")}>
        <div
          className={cn(
            "rounded-2xl px-4 py-2.5 text-sm",
            isUser
              ? "bg-gradient-to-br from-brand-600 to-accent-600 text-white"
              : "border border-border-light bg-surface-light text-text-light dark:border-border-dark dark:bg-surface-dark dark:text-text-dark",
          )}
        >
          {isUser ? (
            <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
          ) : message.isStreaming ? (
            <p className="whitespace-pre-wrap leading-relaxed">
              {message.content}
              <span className="ml-0.5 inline-block h-4 w-[2px] -translate-y-0.5 animate-pulse bg-brand-500 align-middle" aria-hidden="true" />
            </p>
          ) : message.content ? (
            renderMarkdownLite(message.content)
          ) : (
            <p className="italic text-text-muted-light dark:text-text-muted-dark">No response.</p>
          )}
        </div>

        {!isUser && !message.isStreaming && !compact && (
          <div className="mt-1.5 flex items-center gap-0.5 text-text-muted-light dark:text-text-muted-dark">
            <button
              type="button"
              onClick={handleCopy}
              aria-label="Copy message"
              title="Copy"
              className="rounded-lg p-1.5 transition hover:bg-brand-50 hover:text-text-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 dark:hover:bg-white/5 dark:hover:text-text-dark"
            >
              <Copy size={15} strokeWidth={1.75} />
            </button>
            {canRegenerate && (
              <button
                type="button"
                onClick={onRegenerate}
                aria-label="Regenerate response"
                title="Regenerate"
                className="rounded-lg p-1.5 transition hover:bg-brand-50 hover:text-text-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 dark:hover:bg-white/5 dark:hover:text-text-dark"
              >
                <RotateCcw size={15} strokeWidth={1.75} />
              </button>
            )}
            <button
              type="button"
              onClick={() => onToggleLike?.("up")}
              aria-label="Good response"
              aria-pressed={message.liked === "up"}
              title="Good response"
              className={cn(
                "rounded-lg p-1.5 transition hover:bg-brand-50 hover:text-text-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 dark:hover:bg-white/5 dark:hover:text-text-dark",
                message.liked === "up" && "bg-brand-50 text-brand-600 dark:bg-white/10 dark:text-brand-400",
              )}
            >
              <ThumbsUp size={15} strokeWidth={1.75} />
            </button>
            <button
              type="button"
              onClick={() => onToggleLike?.("down")}
              aria-label="Bad response"
              aria-pressed={message.liked === "down"}
              title="Bad response"
              className={cn(
                "rounded-lg p-1.5 transition hover:bg-brand-50 hover:text-text-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 dark:hover:bg-white/5 dark:hover:text-text-dark",
                message.liked === "down" && "bg-brand-50 text-danger-500 dark:bg-white/10",
              )}
            >
              <ThumbsDown size={15} strokeWidth={1.75} />
            </button>
            {speechSupported && (
              <button
                type="button"
                onClick={handleReadAloud}
                aria-label={speaking ? "Stop reading aloud" : "Read aloud"}
                title={speaking ? "Stop reading aloud" : "Read aloud"}
                className="rounded-lg p-1.5 transition hover:bg-brand-50 hover:text-text-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 dark:hover:bg-white/5 dark:hover:text-text-dark"
              >
                {speaking ? <VolumeX size={15} strokeWidth={1.75} /> : <Volume2 size={15} strokeWidth={1.75} />}
              </button>
            )}
            {message.modelId && <span className="ml-1 text-[11px] text-text-muted-light dark:text-text-muted-dark">{getModel(message.modelId).name}</span>}
          </div>
        )}
      </div>
    </motion.div>
  );
}
