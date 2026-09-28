import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { History, MessageSquareText, Pencil, Search, Trash2 } from "lucide-react";
import { PageHeader } from "../components/PageHeader";
import { ConfirmDialog } from "../components/ConfirmDialog";
import { useChatStore } from "../store/chatStore";
import { useUiStore } from "../store/uiStore";
import { bucketForTimestamp, formatRelativeTime, type HistoryBucket } from "../lib/utils";
import type { ChatSession } from "../types";

const BUCKET_ORDER: HistoryBucket[] = ["Today", "Yesterday", "Previous 7 days", "Older"];

function SessionRow({ session, onOpen }: { session: ChatSession; onOpen: () => void }) {
  const renameSession = useChatStore((s) => s.renameSession);
  const deleteSession = useChatStore((s) => s.deleteSession);
  const addToast = useUiStore((s) => s.addToast);
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(session.title);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const lastMessage = session.messages[session.messages.length - 1];
  const preview = lastMessage ? lastMessage.content.slice(0, 90) : "No messages yet";

  function commitRename() {
    renameSession(session.id, title);
    setEditing(false);
  }

  return (
    <>
      <div className="group flex items-center gap-3 rounded-xl border border-border-light bg-surface-light px-4 py-3 transition hover:border-brand-300 dark:border-border-dark dark:bg-surface-dark dark:hover:border-brand-700">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-600 dark:bg-white/5 dark:text-brand-400">
          <MessageSquareText size={16} strokeWidth={1.75} />
        </div>
        {editing ? (
          <div className="min-w-0 flex-1">
            <label htmlFor={`rename-${session.id}`} className="sr-only">
              Rename chat
            </label>
            <input
              id={`rename-${session.id}`}
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") commitRename();
                if (e.key === "Escape") {
                  setTitle(session.title);
                  setEditing(false);
                }
              }}
              onBlur={commitRename}
              className="w-full rounded-lg border border-brand-300 bg-transparent px-2 py-1 text-sm font-medium text-text-light outline-none dark:border-brand-700 dark:text-text-dark"
            />
            <p className="mt-0.5 truncate px-2 text-xs text-text-muted-light dark:text-text-muted-dark">{preview}</p>
          </div>
        ) : (
          <button type="button" onClick={onOpen} className="min-w-0 flex-1 text-left focus-visible:outline-none">
            <p className="truncate text-sm font-medium text-text-light dark:text-text-dark">{session.title}</p>
            <p className="truncate text-xs text-text-muted-light dark:text-text-muted-dark">{preview}</p>
          </button>
        )}
        <span className="hidden shrink-0 text-xs text-text-muted-light sm:block dark:text-text-muted-dark">
          {formatRelativeTime(session.updatedAt)}
        </span>
        <div className="flex shrink-0 items-center gap-0.5 opacity-0 transition group-hover:opacity-100 group-focus-within:opacity-100">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setEditing(true);
            }}
            aria-label={`Rename ${session.title}`}
            className="rounded-lg p-1.5 text-text-muted-light transition hover:bg-brand-50 hover:text-text-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 dark:text-text-muted-dark dark:hover:bg-white/5 dark:hover:text-text-dark"
          >
            <Pencil size={15} strokeWidth={1.75} />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setConfirmOpen(true);
            }}
            aria-label={`Delete ${session.title}`}
            className="rounded-lg p-1.5 text-text-muted-light transition hover:bg-danger-500/10 hover:text-danger-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 dark:text-text-muted-dark"
          >
            <Trash2 size={15} strokeWidth={1.75} />
          </button>
        </div>
      </div>

      <ConfirmDialog
        open={confirmOpen}
        title="Delete this chat?"
        description={`"${session.title}" and all of its messages will be permanently removed from this browser.`}
        confirmLabel="Delete"
        danger
        onConfirm={() => {
          deleteSession(session.id);
          setConfirmOpen(false);
          addToast("Chat deleted.", "default");
        }}
        onCancel={() => setConfirmOpen(false)}
      />
    </>
  );
}

export default function HistoryPage() {
  const sessions = useChatStore((s) => s.sessions);
  const selectSession = useChatStore((s) => s.selectSession);
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  const grouped = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = q
      ? sessions.filter(
          (s) => s.title.toLowerCase().includes(q) || s.messages.some((m) => m.content.toLowerCase().includes(q)),
        )
      : sessions;
    const sorted = [...filtered].sort((a, b) => b.updatedAt - a.updatedAt);
    const buckets = new Map<HistoryBucket, ChatSession[]>();
    for (const session of sorted) {
      const bucket = bucketForTimestamp(session.updatedAt);
      if (!buckets.has(bucket)) buckets.set(bucket, []);
      buckets.get(bucket)!.push(session);
    }
    return buckets;
  }, [sessions, query]);

  function openSession(id: string) {
    selectSession(id);
    navigate("/");
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-6 sm:px-6">
      <PageHeader
        title="My Chat History"
        description="Access your complete chat history across diverse topics and interactions with different models."
        icon={<History size={20} strokeWidth={1.75} />}
      />

      <div className="relative mb-6">
        <Search size={16} strokeWidth={2} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted-light dark:text-text-muted-dark" />
        <label htmlFor="history-search" className="sr-only">
          Search chat history
        </label>
        <input
          id="history-search"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by title or content…"
          className="w-full rounded-full border border-border-light bg-surface-light py-2.5 pl-10 pr-4 text-sm text-text-light outline-none placeholder:text-text-muted-light focus-visible:ring-2 focus-visible:ring-brand-500 dark:border-border-dark dark:bg-surface-dark dark:text-text-dark dark:placeholder:text-text-muted-dark"
        />
      </div>

      {sessions.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-card border border-dashed border-border-light py-16 text-center dark:border-border-dark">
          <p className="font-display text-base font-semibold text-text-light dark:text-text-dark">No chats yet</p>
          <p className="mt-1 max-w-xs text-sm text-text-muted-light dark:text-text-muted-dark">
            Start a new chat and it'll show up here, grouped by when you last used it.
          </p>
        </div>
      ) : grouped.size === 0 ? (
        <p className="py-10 text-center text-sm text-text-muted-light dark:text-text-muted-dark">
          No chats match "{query}".
        </p>
      ) : (
        <div className="space-y-6">
          {BUCKET_ORDER.filter((b) => grouped.has(b)).map((bucket) => (
            <div key={bucket}>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-text-muted-light dark:text-text-muted-dark">
                {bucket}
              </p>
              <div className="space-y-2">
                {grouped.get(bucket)!.map((session) => (
                  <SessionRow key={session.id} session={session} onOpen={() => openSession(session.id)} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
