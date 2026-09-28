import { useEffect, useRef, useState, type ReactNode } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ChevronDown,
  ClipboardList,
  Columns2,
  FileSearch,
  History,
  Image as ImageIcon,
  LifeBuoy,
  ListChecks,
  Plug,
  Plus,
  Settings as SettingsIcon,
  Store as StoreIcon,
  Video,
  Wallet,
  X,
} from "lucide-react";
import { Logo } from "./Logo";
import { ThemeToggle } from "./ThemeToggle";
import { useChatStore } from "../store/chatStore";
import { useUiStore } from "../store/uiStore";
import { useFocusTrap } from "../hooks/useFocusTrap";
import { cn } from "../lib/utils";

interface NavLeaf {
  to: string;
  label: string;
  icon: typeof Plug;
  badge?: "PRO";
  end?: boolean;
}

const WORKSPACE_LINKS: NavLeaf[] = [
  { to: "/image-studio", label: "Image Studio", icon: ImageIcon, badge: "PRO" },
  { to: "/video-studio", label: "Video Studio", icon: Video, badge: "PRO" },
  { to: "/compare", label: "Compare", icon: Columns2 },
  { to: "/connectors", label: "Connectors", icon: Plug },
  { to: "/history", label: "History", icon: History },
  { to: "/store", label: "Store", icon: StoreIcon },
];

const AI_TASKS_CHILDREN: NavLeaf[] = [
  { to: "/ai-tasks/job-analysis", label: "AI Job Analysis", icon: FileSearch },
  { to: "/ai-tasks/sop-builder", label: "AI SOP Builder", icon: ClipboardList },
];

const SUPPORT_LINKS: NavLeaf[] = [
  { to: "/support", label: "Support", icon: LifeBuoy },
  { to: "/subscriptions", label: "Subscriptions", icon: Wallet },
  { to: "/settings", label: "Settings", icon: SettingsIcon },
];

function NavItem({ item, onNavigate }: { item: NavLeaf; onNavigate?: () => void }) {
  const Icon = item.icon;
  return (
    <NavLink
      to={item.to}
      end={item.end}
      onClick={onNavigate}
      className={({ isActive }) =>
        cn(
          "group flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500",
          isActive
            ? "bg-gradient-to-r from-brand-600/10 to-accent-600/10 text-brand-700 dark:text-brand-300"
            : "text-text-light/80 hover:bg-brand-50 dark:text-text-dark/80 dark:hover:bg-white/5",
        )
      }
    >
      <Icon size={18} strokeWidth={1.75} className="shrink-0" />
      <span className="flex-1 truncate">{item.label}</span>
      {item.badge && (
        <span className="rounded-full bg-gold-400/90 px-1.5 py-0.5 text-[10px] font-bold tracking-wide text-black">
          {item.badge}
        </span>
      )}
    </NavLink>
  );
}

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const navigate = useNavigate();
  const location = useLocation();
  const selectSession = useChatStore((s) => s.selectSession);
  const [tasksOpen, setTasksOpen] = useState(location.pathname.startsWith("/ai-tasks"));

  useEffect(() => {
    if (location.pathname.startsWith("/ai-tasks")) setTasksOpen(true);
  }, [location.pathname]);

  function handleNewChat() {
    selectSession(null);
    navigate("/");
    onNavigate?.();
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between px-4 pt-5 pb-3">
        <div className="flex items-center gap-2">
          <Logo size={30} />
          <span className="font-display text-lg font-semibold tracking-tight text-text-light dark:text-text-dark">
            EchoGPT
          </span>
        </div>
        <button
          type="button"
          onClick={onNavigate}
          aria-label="Close menu"
          className="rounded-full p-1.5 text-text-muted-light hover:bg-brand-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 lg:hidden dark:text-text-muted-dark dark:hover:bg-white/5"
        >
          <X size={18} strokeWidth={2} />
        </button>
      </div>

      <div className="px-4">
        <button
          type="button"
          onClick={handleNewChat}
          className="flex w-full items-center justify-center gap-2 rounded-pill bg-gradient-to-r from-brand-600 to-accent-600 px-4 py-2.5 text-sm font-semibold text-white shadow-[0_2px_20px_-4px_rgba(124,58,237,0.5)] transition hover:brightness-110 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2"
        >
          <Plus size={17} strokeWidth={2.25} />
          New Chat
        </button>
      </div>

      <nav aria-label="Main" className="mt-5 flex-1 space-y-5 overflow-y-auto px-3 pb-4">
        <div>
          <p className="px-3 pb-1.5 text-[11px] font-semibold uppercase tracking-wider text-text-muted-light dark:text-text-muted-dark">
            Workspace
          </p>
          <div className="space-y-0.5">
            {WORKSPACE_LINKS.map((item) => (
              <NavItem key={item.to} item={item} onNavigate={onNavigate} />
            ))}

            <div className="group flex items-center gap-0.5 rounded-xl text-sm font-medium text-text-light/80 transition hover:bg-brand-50 dark:text-text-dark/80 dark:hover:bg-white/5">
              <NavLink
                to="/ai-tasks"
                onClick={onNavigate}
                className={({ isActive }) =>
                  cn(
                    "flex min-w-0 flex-1 items-center gap-2.5 rounded-xl py-2 pl-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500",
                    isActive && "text-brand-700 dark:text-brand-300",
                  )
                }
              >
                <ListChecks size={18} strokeWidth={1.75} className="shrink-0" />
                <span className="truncate">AI Tasks</span>
              </NavLink>
              <button
                type="button"
                onClick={() => setTasksOpen((v) => !v)}
                aria-expanded={tasksOpen}
                aria-label={tasksOpen ? "Collapse AI Tasks submenu" : "Expand AI Tasks submenu"}
                className="shrink-0 rounded-lg p-2 mr-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
              >
                <ChevronDown size={16} strokeWidth={2} className={cn("transition-transform", tasksOpen && "rotate-180")} />
              </button>
            </div>
            <AnimatePresence initial={false}>
              {tasksOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                  className="overflow-hidden pl-6"
                >
                  <div className="space-y-0.5 py-0.5">
                    {AI_TASKS_CHILDREN.map((item) => (
                      <NavItem key={item.to} item={item} onNavigate={onNavigate} />
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div>
          <p className="px-3 pb-1.5 text-[11px] font-semibold uppercase tracking-wider text-text-muted-light dark:text-text-muted-dark">
            Help &amp; Support
          </p>
          <div className="space-y-0.5">
            {SUPPORT_LINKS.map((item) => (
              <NavItem key={item.to} item={item} onNavigate={onNavigate} />
            ))}
          </div>
        </div>
      </nav>

      <div className="flex items-center justify-between border-t border-border-light px-4 py-3.5 dark:border-border-dark">
        <span className="text-xs text-text-muted-light dark:text-text-muted-dark">Appearance</span>
        <ThemeToggle />
      </div>
    </div>
  );
}

export function Sidebar() {
  return (
    <aside className="sticky top-0 hidden h-screen w-72 shrink-0 border-r border-border-light bg-sidebar-light lg:block dark:border-border-dark dark:bg-sidebar-dark">
      <SidebarContent />
    </aside>
  );
}

export function MobileSidebarDrawer(): ReactNode {
  const open = useUiStore((s) => s.mobileSidebarOpen);
  const closeMobileSidebar = useUiStore((s) => s.closeMobileSidebar);
  const panelRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const location = useLocation();
  useFocusTrap(panelRef, open, closeMobileSidebar);

  useEffect(() => {
    closeMobileSidebar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <motion.div
            className="absolute inset-0 bg-black/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.2 }}
            onClick={closeMobileSidebar}
            aria-hidden="true"
          />
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label="Main navigation"
            tabIndex={-1}
            initial={reduceMotion ? { opacity: 0 } : { x: "-100%" }}
            animate={reduceMotion ? { opacity: 1 } : { x: 0 }}
            exit={reduceMotion ? { opacity: 0 } : { x: "-100%" }}
            transition={{ duration: reduceMotion ? 0.15 : 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 h-full w-[85vw] max-w-72 bg-sidebar-light shadow-2xl dark:bg-sidebar-dark"
          >
            <SidebarContent onNavigate={closeMobileSidebar} />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
