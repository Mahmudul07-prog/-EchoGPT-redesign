import { useEffect } from "react";
import { useSettingsStore } from "../store/settingsStore";

/** Applies the current theme preference (light/dark/system) to <html>.dark and keeps it in sync with the OS. */
export function useThemeEffect(): void {
  const theme = useSettingsStore((s) => s.theme);

  useEffect(() => {
    const root = document.documentElement;
    const media = window.matchMedia("(prefers-color-scheme: dark)");

    const apply = () => {
      const isDark = theme === "dark" || (theme === "system" && media.matches);
      root.classList.toggle("dark", isDark);
    };

    apply();

    if (theme === "system") {
      media.addEventListener("change", apply);
      return () => media.removeEventListener("change", apply);
    }
    return undefined;
  }, [theme]);
}
