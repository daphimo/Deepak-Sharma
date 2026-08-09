import { lazy, Suspense, useEffect, useState } from "react";

const DesktopGlobe = lazy(() => import("./GlobeBackgroundDesktop"));

const DESKTOP_GLOBE_QUERY = "(min-width: 768px) and (pointer: fine)";

export default function GlobeBackground() {
  const [canRenderGlobe, setCanRenderGlobe] = useState(() =>
    typeof window !== "undefined" && window.matchMedia(DESKTOP_GLOBE_QUERY).matches
  );

  useEffect(() => {
    const query = window.matchMedia(DESKTOP_GLOBE_QUERY);
    const update = (event: MediaQueryListEvent) => setCanRenderGlobe(event.matches);

    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  if (!canRenderGlobe) return null;

  return (
    <Suspense fallback={null}>
      <DesktopGlobe />
    </Suspense>
  );
}
