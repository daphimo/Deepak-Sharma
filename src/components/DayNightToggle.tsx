import { useEffect, useRef, useState } from "react";

type Theme = "light" | "dark";

const THEME_EVENT = "daynight-theme-change";

const getInitialTheme = (): Theme => {
  if (typeof window === "undefined") return "light";
  const stored = localStorage.getItem("theme");
  if (stored === "light" || stored === "dark") return stored;
  // Default to day (light) on first load regardless of system preference
  return "light";
};

const applyTheme = (theme: Theme) => {
  const root = document.documentElement;
  root.classList.remove("light", "dark");
  root.classList.add(theme);
  localStorage.setItem("theme", theme);
};

type DayNightToggleProps = {
  className?: string;
  variant?: "inline" | "floating" | "compact";
};

const SunIcon = () => (
  <svg
    className="h-5 w-5"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2m0 16v2m10-10h-2M4 12H2m16.95 5.95-1.4-1.4M6.45 6.45l-1.4-1.4m12.9 0-1.4 1.4M6.45 17.55l-1.4 1.4" />
  </svg>
);

const MoonIcon = () => (
  <svg
    className="h-5 w-5"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z" />
  </svg>
);

export default function DayNightToggle({
  className = "",
  variant = "inline",
}: DayNightToggleProps) {
  const [theme, setTheme] = useState<Theme>(() => getInitialTheme());
  const themeRef = useRef(theme);
  const isDark = theme === "dark";

  useEffect(() => {
    themeRef.current = theme;
  }, [theme]);

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  useEffect(() => {
    const handleThemeEvent = (event: Event) => {
      const next = (event as CustomEvent<Theme>).detail;
      if (!next || next === themeRef.current) return;
      setTheme(next);
    };

    const handleStorage = (event: StorageEvent) => {
      if (event.key !== "theme") return;
      const next = event.newValue;
      if (next === "light" || next === "dark") {
        setTheme(next);
      }
    };

    window.addEventListener(THEME_EVENT, handleThemeEvent as EventListener);
    window.addEventListener("storage", handleStorage);
    return () => {
      window.removeEventListener(THEME_EVENT, handleThemeEvent as EventListener);
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  const toggleTheme = () =>
    setTheme((prev) => {
      const next = prev === "dark" ? "light" : "dark";
      window.dispatchEvent(new CustomEvent<Theme>(THEME_EVENT, { detail: next }));
      return next;
    });

  const baseButton =
    "flex cursor-pointer items-center gap-2 text-[var(--foreground)] transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]";

  const variantClass =
    variant === "floating"
      ? "fixed left-4 top-28 z-[9998]"
      : variant === "compact"
        ? "px-2 py-1"
        : "px-2 py-1";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label="Toggle day and night mode"
      title="Switch theme"
      className={`${baseButton} ${variantClass} ${className}`.trim()}
    >
      {isDark ? <MoonIcon /> : <SunIcon />}
    </button>
  );
}
