"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

type Theme = "light" | "dark";

function applyTheme(theme: Theme) {
  document.documentElement.setAttribute("data-theme", theme);
  try {
    localStorage.setItem("madam-theme", theme);
  } catch {
    /* ignore */
  }
}

export function ThemeToggle({ className }: { className?: string }) {
  const [theme, setTheme] = useState<Theme>("light");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let initial: Theme = "light";
    try {
      const stored = localStorage.getItem("madam-theme") as Theme | null;
      if (stored === "light" || stored === "dark") initial = stored;
      else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        initial = "dark";
      }
    } catch {
      /* ignore */
    }
    setTheme(initial);
    applyTheme(initial);
    setReady(true);
  }, []);

  const toggle = () => {
    const next: Theme = theme === "light" ? "dark" : "light";
    setTheme(next);
    applyTheme(next);
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
      className={cn(
        "inline-flex h-9 w-9 items-center justify-center rounded-sm border border-black/10 bg-white text-[var(--madam-ink)] transition hover:border-[var(--madam-green)] hover:text-[var(--madam-green)]",
        "dark-surface",
        className,
        !ready && "opacity-0",
      )}
    >
      {theme === "light" ? (
        <Moon className="h-4 w-4" strokeWidth={2} aria-hidden />
      ) : (
        <Sun className="h-4 w-4" strokeWidth={2} aria-hidden />
      )}
    </button>
  );
}

/** Inline script to avoid flash — inject in root layout <head> */
export const themeBootScript = `(function(){try{var t=localStorage.getItem('madam-theme');if(t!=='light'&&t!=='dark'){t=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'}document.documentElement.setAttribute('data-theme',t)}catch(e){}})();`;
