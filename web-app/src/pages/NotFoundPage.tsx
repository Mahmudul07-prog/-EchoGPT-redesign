import { Link } from "react-router-dom";
import { Compass } from "lucide-react";

export default function NotFoundPage() {
  return (
    <div className="flex h-full flex-col items-center justify-center px-4 py-16 text-center">
      <Compass size={40} strokeWidth={1.5} className="mb-4 text-brand-500" />
      <h1 className="font-display text-2xl font-semibold tracking-tight text-text-light dark:text-text-dark">Page not found</h1>
      <p className="mt-2 max-w-sm text-sm text-text-muted-light dark:text-text-muted-dark">
        That page doesn't exist. Let's get you back to your chat.
      </p>
      <Link
        to="/"
        className="mt-6 rounded-pill bg-gradient-to-r from-brand-600 to-accent-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:brightness-110 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2"
      >
        Back to Chat
      </Link>
    </div>
  );
}
