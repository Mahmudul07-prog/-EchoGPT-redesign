import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { LogOut, Menu, Settings as SettingsIcon } from "lucide-react";
import { Avatar } from "./Avatar";
import { useAuthStore } from "../store/authStore";
import { useUiStore } from "../store/uiStore";

export function TopBar() {
  const user = useAuthStore((s) => s.user);
  const signOut = useAuthStore((s) => s.signOut);
  const openMobileSidebar = useUiStore((s) => s.openMobileSidebar);
  const openAuthModal = useUiStore((s) => s.openAuthModal);
  const addToast = useUiStore((s) => s.addToast);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setMenuOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [menuOpen]);

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-border-light bg-bg-light/80 px-4 backdrop-blur-md sm:px-6 dark:border-border-dark dark:bg-bg-dark/80">
      <button
        type="button"
        onClick={openMobileSidebar}
        aria-label="Open menu"
        className="rounded-full p-2 text-text-light hover:bg-brand-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 lg:hidden dark:text-text-dark dark:hover:bg-white/5"
      >
        <Menu size={20} strokeWidth={2} />
      </button>
      <div className="hidden lg:block" />

      {user ? (
        <div className="relative" ref={menuRef}>
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-haspopup="menu"
            aria-expanded={menuOpen}
            className="flex items-center gap-2 rounded-full py-1 pl-1 pr-3 transition hover:bg-brand-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 dark:hover:bg-white/5"
          >
            <Avatar name={user.name} size={28} />
            <span className="max-w-[8rem] truncate text-sm font-medium text-text-light dark:text-text-dark">{user.name}</span>
          </button>
          {menuOpen && (
            <div
              role="menu"
              className="absolute right-0 z-40 mt-2 w-48 overflow-hidden rounded-xl border border-border-light bg-surface-light py-1 shadow-xl dark:border-border-dark dark:bg-surface-dark"
            >
              <Link
                role="menuitem"
                to="/settings"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2.5 px-3.5 py-2 text-sm text-text-light hover:bg-brand-50 dark:text-text-dark dark:hover:bg-white/5"
              >
                <SettingsIcon size={16} strokeWidth={1.75} />
                Settings
              </Link>
              <button
                role="menuitem"
                type="button"
                onClick={() => {
                  signOut();
                  setMenuOpen(false);
                  addToast("Signed out.", "default");
                }}
                className="flex w-full items-center gap-2.5 px-3.5 py-2 text-left text-sm text-text-light hover:bg-brand-50 dark:text-text-dark dark:hover:bg-white/5"
              >
                <LogOut size={16} strokeWidth={1.75} />
                Sign out
              </button>
            </div>
          )}
        </div>
      ) : (
        <button
          type="button"
          onClick={openAuthModal}
          className="rounded-pill bg-gradient-to-r from-brand-600 to-accent-600 px-4 py-1.5 text-sm font-semibold text-white transition hover:brightness-110 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2"
        >
          Sign In
        </button>
      )}
    </header>
  );
}
