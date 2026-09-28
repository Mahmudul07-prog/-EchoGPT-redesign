import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ChatMessage, ChatSession, LikeState } from "../types";
import { DEFAULT_MODEL_ID, getModel } from "../lib/models";
import { generateMockReply } from "../lib/mockAi";
import { createId } from "../lib/utils";

// Tracks in-flight streams so a "stop generating" action (or a page unmount)
// can cut a stream short without needing to touch React state directly.
const abortFlags = new Map<string, boolean>();

function titleFromContent(content: string): string {
  const trimmed = content.trim().replace(/\s+/g, " ");
  if (trimmed.length <= 48) return trimmed || "New chat";
  return `${trimmed.slice(0, 48).trimEnd()}…`;
}

interface ChatState {
  sessions: ChatSession[];
  currentSessionId: string | null;
  selectedModelId: string;

  selectSession: (id: string | null) => void;
  renameSession: (id: string, title: string) => void;
  deleteSession: (id: string) => void;
  clearAllSessions: () => void;
  setSelectedModel: (id: string) => void;

  /** Creates a session, optionally seeding it with an assistant intro (e.g. a persona). */
  startSession: (opts?: { title?: string; personaId?: string; seedAssistantText?: string; modelId?: string }) => string;

  /** Sends a user message in the current (or a freshly created) session and streams a reply. */
  sendMessage: (content: string, modelId: string) => Promise<void>;
  regenerateMessage: (sessionId: string, assistantMessageId: string) => Promise<void>;
  toggleLike: (sessionId: string, messageId: string, value: LikeState) => void;
  stopStreaming: (sessionId: string, messageId: string) => void;
}

function touchSession(sessions: ChatSession[], sessionId: string, mutate: (s: ChatSession) => ChatSession): ChatSession[] {
  return sessions.map((s) => (s.id === sessionId ? mutate(s) : s));
}

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      sessions: [],
      currentSessionId: null,
      selectedModelId: DEFAULT_MODEL_ID,

      selectSession: (id) => set({ currentSessionId: id }),

      renameSession: (id, title) =>
        set((state) => ({
          sessions: touchSession(state.sessions, id, (s) => ({ ...s, title: title.trim() || s.title })),
        })),

      deleteSession: (id) =>
        set((state) => ({
          sessions: state.sessions.filter((s) => s.id !== id),
          currentSessionId: state.currentSessionId === id ? null : state.currentSessionId,
        })),

      clearAllSessions: () => set({ sessions: [], currentSessionId: null }),

      setSelectedModel: (id) => set({ selectedModelId: id }),

      startSession: (opts) => {
        const id = createId("session");
        const now = Date.now();
        const messages: ChatMessage[] = [];
        if (opts?.seedAssistantText) {
          messages.push({
            id: createId("msg"),
            role: "assistant",
            content: opts.seedAssistantText,
            modelId: opts.modelId ?? get().selectedModelId,
            createdAt: now,
          });
        }
        const session: ChatSession = {
          id,
          title: opts?.title ?? "New chat",
          messages,
          createdAt: now,
          updatedAt: now,
          personaId: opts?.personaId,
        };
        set((state) => ({ sessions: [session, ...state.sessions], currentSessionId: id }));
        return id;
      },

      sendMessage: async (content, modelId) => {
        const trimmed = content.trim();
        if (!trimmed) return;

        let sessionId = get().currentSessionId;
        const isFirstMessage = !sessionId || get().sessions.find((s) => s.id === sessionId)?.messages.length === 0;

        if (!sessionId) {
          sessionId = createId("session");
          const now = Date.now();
          const session: ChatSession = {
            id: sessionId,
            title: titleFromContent(trimmed),
            messages: [],
            createdAt: now,
            updatedAt: now,
          };
          set((state) => ({ sessions: [session, ...state.sessions], currentSessionId: sessionId }));
        }

        const userMessage: ChatMessage = {
          id: createId("msg"),
          role: "user",
          content: trimmed,
          createdAt: Date.now(),
        };

        set((state) => ({
          sessions: touchSession(state.sessions, sessionId!, (s) => ({
            ...s,
            title: isFirstMessage ? titleFromContent(trimmed) : s.title,
            messages: [...s.messages, userMessage],
            updatedAt: Date.now(),
          })),
        }));

        const assistantMessage: ChatMessage = {
          id: createId("msg"),
          role: "assistant",
          content: "",
          modelId,
          createdAt: Date.now(),
          isStreaming: true,
        };

        set((state) => ({
          sessions: touchSession(state.sessions, sessionId!, (s) => ({
            ...s,
            messages: [...s.messages, assistantMessage],
          })),
        }));

        await streamReplyInto(sessionId, assistantMessage.id, trimmed, modelId);
      },

      regenerateMessage: async (sessionId, assistantMessageId) => {
        const session = get().sessions.find((s) => s.id === sessionId);
        if (!session) return;
        const idx = session.messages.findIndex((m) => m.id === assistantMessageId);
        if (idx <= 0) return;
        const precedingUser = [...session.messages.slice(0, idx)].reverse().find((m) => m.role === "user");
        if (!precedingUser) return;
        const modelId = session.messages[idx].modelId ?? get().selectedModelId;

        set((state) => ({
          sessions: touchSession(state.sessions, sessionId, (s) => ({
            ...s,
            messages: s.messages.map((m) => (m.id === assistantMessageId ? { ...m, content: "", isStreaming: true, liked: null } : m)),
          })),
        }));

        await streamReplyInto(sessionId, assistantMessageId, precedingUser.content, modelId);
      },

      toggleLike: (sessionId, messageId, value) =>
        set((state) => ({
          sessions: touchSession(state.sessions, sessionId, (s) => ({
            ...s,
            messages: s.messages.map((m) => (m.id === messageId ? { ...m, liked: m.liked === value ? null : value } : m)),
          })),
        })),

      stopStreaming: (_sessionId, messageId) => {
        abortFlags.set(messageId, true);
      },
    }),
    {
      name: "echogpt-chat-store",
      partialize: (state) => ({
        sessions: state.sessions,
        currentSessionId: state.currentSessionId,
        selectedModelId: state.selectedModelId,
      }),
      onRehydrateStorage: () => (state) => {
        // A page reload mid-stream would otherwise leave a message stuck
        // showing the streaming/typing indicator forever.
        if (!state) return;
        state.sessions = state.sessions.map((s) => ({
          ...s,
          messages: s.messages.map((m) => (m.isStreaming ? { ...m, isStreaming: false } : m)),
        }));
      },
    },
  ),
);

async function streamReplyInto(sessionId: string, messageId: string, prompt: string, modelId: string): Promise<void> {
  abortFlags.set(messageId, false);
  const model = getModel(modelId);
  try {
    for await (const chunk of generateMockReply(prompt, modelId, model)) {
      if (abortFlags.get(messageId)) break;
      useChatStore.setState((state) => ({
        sessions: touchSession(state.sessions, sessionId, (s) => ({
          ...s,
          updatedAt: Date.now(),
          messages: s.messages.map((m) => (m.id === messageId ? { ...m, content: m.content + chunk } : m)),
        })),
      }));
    }
  } finally {
    abortFlags.delete(messageId);
    useChatStore.setState((state) => ({
      sessions: touchSession(state.sessions, sessionId, (s) => ({
        ...s,
        messages: s.messages.map((m) => (m.id === messageId ? { ...m, isStreaming: false } : m)),
      })),
    }));
  }
}
