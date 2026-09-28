import { useRef, useState, type ReactNode } from "react";
import { Bell, Info, Settings as SettingsIcon, Trash2, User } from "lucide-react";
import { PageHeader } from "../components/PageHeader";
import { Avatar } from "../components/Avatar";
import { Switch } from "../components/Switch";
import { ThemeToggle } from "../components/ThemeToggle";
import { ConfirmDialog } from "../components/ConfirmDialog";
import { useSettingsStore } from "../store/settingsStore";
import { useAuthStore } from "../store/authStore";
import { useChatStore } from "../store/chatStore";
import { useUiStore } from "../store/uiStore";
import { MODELS } from "../lib/models";

function SectionCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rounded-card border border-border-light bg-surface-light p-5 dark:border-border-dark dark:bg-surface-dark">
      <h2 className="mb-4 font-display text-sm font-semibold text-text-light dark:text-text-dark">{title}</h2>
      {children}
    </section>
  );
}

export default function SettingsPage() {
  const profileName = useSettingsStore((s) => s.profileName);
  const setProfileName = useSettingsStore((s) => s.setProfileName);
  const profileAvatarDataUrl = useSettingsStore((s) => s.profileAvatarDataUrl);
  const setProfileAvatar = useSettingsStore((s) => s.setProfileAvatar);
  const defaultModelId = useSettingsStore((s) => s.defaultModelId);
  const setDefaultModel = useSettingsStore((s) => s.setDefaultModel);
  const notifications = useSettingsStore((s) => s.notifications);
  const setNotification = useSettingsStore((s) => s.setNotification);

  const user = useAuthStore((s) => s.user);
  const clearAllSessions = useChatStore((s) => s.clearAllSessions);
  const addToast = useUiStore((s) => s.addToast);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [confirmClearOpen, setConfirmClearOpen] = useState(false);
  const displayName = profileName || user?.name || "Guest";

  function handleAvatarPick(file: File | undefined) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") setProfileAvatar(reader.result);
    };
    reader.readAsDataURL(file);
  }

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-6 sm:px-6">
      <PageHeader title="Settings" description="Manage your profile, appearance, and data — all stored locally in this browser." icon={<SettingsIcon size={20} strokeWidth={1.75} />} />

      <div className="space-y-5">
        <SectionCard title="Profile">
          <div className="flex items-center gap-4">
            <Avatar name={displayName} avatarDataUrl={profileAvatarDataUrl} size={56} />
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleAvatarPick(e.target.files?.[0])}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="rounded-full border border-border-light px-3.5 py-1.5 text-xs font-medium text-text-light transition hover:bg-brand-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 dark:border-border-dark dark:text-text-dark dark:hover:bg-white/5"
              >
                Change avatar
              </button>
              <p className="mt-1 text-xs text-text-muted-light dark:text-text-muted-dark">Stored only in this browser — never uploaded.</p>
            </div>
          </div>
          <div className="mt-4">
            <label htmlFor="profile-name" className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-text-light dark:text-text-dark">
              <User size={14} strokeWidth={2} />
              Display name
            </label>
            <input
              id="profile-name"
              value={profileName}
              onChange={(e) => setProfileName(e.target.value)}
              placeholder={user?.name ?? "Your name"}
              className="w-full rounded-xl border border-border-light bg-bg-light px-3.5 py-2.5 text-sm text-text-light outline-none placeholder:text-text-muted-light focus-visible:ring-2 focus-visible:ring-brand-500 dark:border-border-dark dark:bg-bg-dark dark:text-text-dark dark:placeholder:text-text-muted-dark"
            />
          </div>
        </SectionCard>

        <SectionCard title="Appearance">
          <div className="flex items-center justify-between">
            <p className="text-sm text-text-muted-light dark:text-text-muted-dark">Theme</p>
            <ThemeToggle />
          </div>
        </SectionCard>

        <SectionCard title="Default model">
          <label htmlFor="default-model" className="sr-only">
            Default model
          </label>
          <select
            id="default-model"
            value={defaultModelId}
            onChange={(e) => setDefaultModel(e.target.value)}
            className="w-full rounded-xl border border-border-light bg-bg-light px-3.5 py-2.5 text-sm text-text-light outline-none focus-visible:ring-2 focus-visible:ring-brand-500 dark:border-border-dark dark:bg-bg-dark dark:text-text-dark"
          >
            {MODELS.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
                {m.badge ? ` (${m.badge})` : ""}
              </option>
            ))}
          </select>
          <p className="mt-2 text-xs text-text-muted-light dark:text-text-muted-dark">Used when you start a new chat.</p>
        </SectionCard>

        <SectionCard title="Notifications">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell size={15} strokeWidth={1.75} className="text-text-muted-light dark:text-text-muted-dark" />
                <span className="text-sm text-text-light dark:text-text-dark">Product updates</span>
              </div>
              <Switch checked={notifications.productUpdates} onChange={(v) => setNotification("productUpdates", v)} label="Product updates" hideLabel />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-text-light dark:text-text-dark">Sound effects</span>
              <Switch checked={notifications.soundEffects} onChange={(v) => setNotification("soundEffects", v)} label="Sound effects" hideLabel />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-text-light dark:text-text-dark">Desktop alerts</span>
              <Switch checked={notifications.desktopAlerts} onChange={(v) => setNotification("desktopAlerts", v)} label="Desktop alerts" hideLabel />
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Data">
          <div className="flex items-center justify-between gap-4">
            <p className="text-sm text-text-muted-light dark:text-text-muted-dark">Permanently remove every chat stored in this browser.</p>
            <button
              type="button"
              onClick={() => setConfirmClearOpen(true)}
              className="flex shrink-0 items-center gap-1.5 rounded-full border border-danger-500/30 px-3.5 py-1.5 text-xs font-medium text-danger-500 transition hover:bg-danger-500/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
            >
              <Trash2 size={14} strokeWidth={2} />
              Clear all conversations
            </button>
          </div>
        </SectionCard>

        <SectionCard title="About">
          <div className="flex items-start gap-2.5 text-sm text-text-muted-light dark:text-text-muted-dark">
            <Info size={16} strokeWidth={1.75} className="mt-0.5 shrink-0 text-brand-500" />
            <p>
              EchoGPT Web — redesign demo, v1.0.0. Every AI response in this app is generated locally in your
              browser by a simulated model chosen from hand-written variants — there is no real AI backend or API
              key behind this demo, and no data leaves your device.
            </p>
          </div>
        </SectionCard>
      </div>

      <ConfirmDialog
        open={confirmClearOpen}
        title="Clear all conversations?"
        description="This permanently deletes every chat session stored in this browser. This can't be undone."
        confirmLabel="Clear everything"
        danger
        onConfirm={() => {
          clearAllSessions();
          setConfirmClearOpen(false);
          addToast("All conversations cleared.", "default");
        }}
        onCancel={() => setConfirmClearOpen(false)}
      />
    </div>
  );
}
