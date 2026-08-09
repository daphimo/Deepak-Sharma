import { useEffect, useMemo, useRef, useState } from "react";
import Globe, { type GlobeMethods } from "react-globe.gl";
import { MeshBasicMaterial } from "three";

type CountryFeature = {
  properties?: { ISO_A2?: string };
  geometry: object;
};

type CountriesGeoJson = {
  features?: CountryFeature[];
};

const getGlobeSize = () => Math.round(Math.min(760, Math.max(540, window.innerWidth * 0.52)));
const THEME_EVENT = "daynight-theme-change";
const getIsDark = () => document.documentElement.classList.contains("dark");

export default function GlobeBackgroundDesktop() {
  const globeRef = useRef<GlobeMethods | undefined>(undefined);
  const [countries, setCountries] = useState<CountryFeature[]>([]);
  const [size, setSize] = useState(getGlobeSize);
  const [isGlobeReady, setIsGlobeReady] = useState(false);
  const [isDark, setIsDark] = useState(getIsDark);
  const lightGlobeMaterial = useMemo(() => new MeshBasicMaterial({ color: "#ffffff" }), []);
  const darkGlobeMaterial = useMemo(() => new MeshBasicMaterial({ color: "#000000" }), []);
  const globeMaterial = isDark ? darkGlobeMaterial : lightGlobeMaterial;

  useEffect(
    () => () => {
      lightGlobeMaterial.dispose();
      darkGlobeMaterial.dispose();
    },
    [darkGlobeMaterial, lightGlobeMaterial]
  );

  useEffect(() => {
    const syncFromRootClass = () => setIsDark(getIsDark());
    const handleThemeEvent = (event: Event) => {
      const theme = (event as CustomEvent<"light" | "dark">).detail;
      if (theme === "light" || theme === "dark") setIsDark(theme === "dark");
    };

    const observer = new MutationObserver(syncFromRootClass);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    window.addEventListener(THEME_EVENT, handleThemeEvent);

    return () => {
      observer.disconnect();
      window.removeEventListener(THEME_EVENT, handleThemeEvent);
    };
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    fetch("/files/ne_110m_admin_0_countries.geojson", { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error(`Unable to load globe data (${response.status})`);
        return response.json() as Promise<CountriesGeoJson>;
      })
      .then((data) => {
        setCountries(
          (data.features ?? []).filter((feature) => feature.properties?.ISO_A2 !== "AQ")
        );
      })
      .catch((error: unknown) => {
        if (!(error instanceof DOMException && error.name === "AbortError")) {
          console.warn("Globe background data could not be loaded.", error);
        }
      });

    return () => controller.abort();
  }, []);

  useEffect(() => {
    let frameId = 0;
    const updateSize = () => {
      cancelAnimationFrame(frameId);
      frameId = requestAnimationFrame(() => setSize(getGlobeSize()));
    };

    window.addEventListener("resize", updateSize, { passive: true });
    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", updateSize);
    };
  }, []);

  useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden) globeRef.current?.pauseAnimation();
      else globeRef.current?.resumeAnimation();
    };

    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, []);

  useEffect(() => {
    if (!isGlobeReady) return;
    const globe = globeRef.current;
    if (!globe) return;

    globe.pointOfView({ lat: 18, lng: -20, altitude: 2.05 }, 0);
    const controls = globe.controls();
    controls.enabled = true;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.65;
    controls.enableDamping = false;
    controls.enablePan = false;
    // Auto-rotation is driven by OrbitControls. User input remains impossible
    // because both the globe and its container reject pointer interaction.
    controls.enableRotate = true;
    controls.enableZoom = false;
    controls.update();
  }, [isGlobeReady]);

  const globeColor = isDark ? "#ffffff" : "#000000";

  return (
    <div
      className="pointer-events-none absolute z-0 opacity-75"
      style={{ width: size, height: size, top: -size * 0.22, right: -size * 0.24 }}
      aria-hidden="true"
    >
      <Globe
        ref={globeRef}
        width={size}
        height={size}
        backgroundColor="rgba(0,0,0,0)"
        rendererConfig={{ antialias: false, alpha: true, powerPreference: "low-power" }}
        showGlobe={true}
        globeMaterial={globeMaterial}
        showAtmosphere={false}
        showGraticules={false}
        enablePointerInteraction={false}
        hexPolygonsData={countries}
        hexPolygonUseDots={true}
        hexPolygonResolution={4}
        hexPolygonDotResolution={1}
        hexPolygonMargin={0.55}
        hexPolygonAltitude={0.004}
        hexPolygonColor={globeColor}
        hexPolygonsTransitionDuration={280}
        polygonsData={countries}
        polygonCapColor="rgba(0,0,0,0)"
        polygonSideColor="rgba(0,0,0,0)"
        polygonStrokeColor={globeColor}
        polygonAltitude={0.003}
        polygonCapCurvatureResolution={4}
        polygonsTransitionDuration={280}
        onGlobeReady={() => setIsGlobeReady(true)}
      />
    </div>
  );
}
