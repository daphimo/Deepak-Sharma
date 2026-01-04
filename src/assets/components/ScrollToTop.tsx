// src/assets/components/ScrollToTop.tsx
import { useEffect, useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Prevent the browser from restoring the previous scroll position on route changes
    const { scrollRestoration } = window.history;
    window.history.scrollRestoration = "manual";
    return () => {
      window.history.scrollRestoration = scrollRestoration;
    };
  }, []);

  useLayoutEffect(() => {
    // Force scroll containers to the top as soon as the route updates
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [pathname]);

  return null; // no UI
}
