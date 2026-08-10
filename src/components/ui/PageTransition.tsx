"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Elegant, fast page enter animation (CSS class on <main>).
 * Skipped when prefers-reduced-motion is set.
 */
export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    const main = document.getElementById("site-main");
    if (!main) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    main.classList.remove("page-enter");
    // Force reflow so animation restarts on navigation
    void main.offsetWidth;
    main.classList.add("page-enter");
  }, [pathname]);

  return children;
}
