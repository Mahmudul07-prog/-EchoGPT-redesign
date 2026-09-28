import { cn, initialsFromName } from "../lib/utils";

interface AvatarProps {
  name: string;
  avatarDataUrl?: string | null;
  size?: number;
  className?: string;
}

export function Avatar({ name, avatarDataUrl, size = 32, className }: AvatarProps) {
  if (avatarDataUrl) {
    return (
      <img
        src={avatarDataUrl}
        alt={`${name}'s avatar`}
        width={size}
        height={size}
        className={cn("shrink-0 rounded-full object-cover", className)}
        style={{ width: size, height: size }}
      />
    );
  }

  return (
    <div
      aria-hidden="true"
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-accent-500 font-display font-semibold text-white",
        className,
      )}
      style={{ width: size, height: size, fontSize: size * 0.4 }}
    >
      {initialsFromName(name)}
    </div>
  );
}
