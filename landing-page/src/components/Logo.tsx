interface LogoProps {
  className?: string
  showWordmark?: boolean
  wordmarkClassName?: string
}

/**
 * EchoGPT brand mark: a circular indigo -> violet -> fuchsia gradient badge
 * with a concentric "echo" glyph, matching public/favicon.svg.
 */
export function Logo({ className = 'h-9 w-9', showWordmark = true, wordmarkClassName = '' }: LogoProps) {
  return (
    <span className="inline-flex items-center gap-2.5">
      <svg viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
        <defs>
          <linearGradient id="echogpt-logo-gradient" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#6366f1" />
            <stop offset="50%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#d946ef" />
          </linearGradient>
        </defs>
        <circle cx="64" cy="64" r="64" fill="url(#echogpt-logo-gradient)" />
        <circle cx="46" cy="64" r="7" fill="#ffffff" />
        <path
          d="M62 64a16 16 0 0 1 16 -16"
          stroke="#ffffff"
          strokeWidth="7"
          strokeLinecap="round"
          fill="none"
          opacity="0.95"
        />
        <path
          d="M62 64a28 28 0 0 1 28 -28"
          stroke="#ffffff"
          strokeWidth="7"
          strokeLinecap="round"
          fill="none"
          opacity="0.65"
        />
        <path
          d="M62 64a40 40 0 0 1 40 -40"
          stroke="#ffffff"
          strokeWidth="7"
          strokeLinecap="round"
          fill="none"
          opacity="0.35"
        />
      </svg>
      {showWordmark ? (
        <span className={`font-display text-lg font-bold tracking-tight text-text-light dark:text-text-dark ${wordmarkClassName}`}>
          EchoGPT
        </span>
      ) : null}
    </span>
  )
}
