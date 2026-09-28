import { useId, useState } from "react";
import { Dialog } from "./Dialog";
import { useAuthStore } from "../store/authStore";
import { useUiStore } from "../store/uiStore";

export function AuthModal() {
  const open = useUiStore((s) => s.authModalOpen);
  const closeAuthModal = useUiStore((s) => s.closeAuthModal);
  const addToast = useUiStore((s) => s.addToast);
  const signIn = useAuthStore((s) => s.signIn);
  const continueAsGuest = useAuthStore((s) => s.continueAsGuest);
  const [name, setName] = useState("");
  const inputId = useId();

  function handleClose() {
    setName("");
    closeAuthModal();
  }

  function handleContinue() {
    if (!name.trim()) return;
    signIn(name);
    addToast(`Welcome, ${name.trim()}! You're signed in for this demo.`, "success");
    handleClose();
  }

  function handleGuest() {
    continueAsGuest();
    addToast("Continuing as guest — nothing you do here leaves your browser.", "default");
    handleClose();
  }

  return (
    <Dialog open={open} onClose={handleClose} titleId="auth-modal-title" title="Sign in to EchoGPT">
      <p className="text-sm text-text-muted-light dark:text-text-muted-dark">
        This is a local demo account — no password, no real sign-up. Your name is only stored in this
        browser.
      </p>
      <form
        className="mt-4"
        onSubmit={(e) => {
          e.preventDefault();
          handleContinue();
        }}
      >
        <label htmlFor={inputId} className="mb-1.5 block text-sm font-medium text-text-light dark:text-text-dark">
          Display name
        </label>
        <input
          id={inputId}
          type="text"
          autoFocus
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Alex Rivera"
          className="w-full rounded-xl border border-border-light bg-bg-light px-3.5 py-2.5 text-sm text-text-light outline-none transition placeholder:text-text-muted-light focus-visible:ring-2 focus-visible:ring-brand-500 dark:border-border-dark dark:bg-bg-dark dark:text-text-dark dark:placeholder:text-text-muted-dark"
        />
        <div className="mt-6 flex flex-col gap-2 sm:flex-row-reverse">
          <button
            type="submit"
            disabled={!name.trim()}
            className="flex-1 rounded-full bg-gradient-to-r from-brand-600 to-accent-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:brightness-110 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Continue
          </button>
          <button
            type="button"
            onClick={handleGuest}
            className="flex-1 rounded-full border border-border-light px-4 py-2.5 text-sm font-medium text-text-light transition hover:bg-brand-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 dark:border-border-dark dark:text-text-dark dark:hover:bg-white/5"
          >
            Continue as Guest
          </button>
        </div>
      </form>
    </Dialog>
  );
}
