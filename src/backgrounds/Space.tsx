import { useEffect, useRef } from "react";

export const brandColors = {
  dark: "#000000",
  steel: "#415a77",
  sky: "#778da9",
  light: "#e0e1dd",
};

export default function DarkInteractiveBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const pointerRef = useRef<{ x: number; y: number; active: boolean }>({
    x: 0,
    y: 0,
    active: false,
  });
  const paletteRef = useRef({
    background: brandColors.dark,
    grid: brandColors.light,
    glow: brandColors.sky,
    glowAlpha: 0.24,
    lineAlpha: 0.12,
  });
  const themeObserverRef = useRef<MutationObserver | null>(null);

  const getIsDark = () => document.documentElement.classList.contains("dark");

  const updatePaletteFromTheme = () => {
    const isDark = getIsDark();
    paletteRef.current = isDark
      ? {
          background: "#060010",
          grid: "#778da9",
          glow: "#7dd3fc",
          glowAlpha: 0.24,
          lineAlpha: 0.12,
        }
      : {
          background: "#f8fafc",
          grid: "#0f172a",
          glow: "#0284c7",
          glowAlpha: 0.18,
          lineAlpha: 0.08,
        };
  };

  useEffect(() => {
    updatePaletteFromTheme();
    const handleThemeChange = () => {
      updatePaletteFromTheme();
      window.dispatchEvent(new Event("portfolio-theme-change"));
    };
    const observer = new MutationObserver(handleThemeChange);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    themeObserverRef.current = observer;

    return () => {
      themeObserverRef.current?.disconnect();
    };
  }, []);

  useEffect(() => {
    updatePaletteFromTheme();
    const canvas = canvasRef.current!;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    let dpr = Math.min(window.innerWidth < 768 ? 1.25 : 2, Math.max(1, window.devicePixelRatio || 1));
    let framePending = false;

    function resize() {
      dpr = Math.min(window.innerWidth < 768 ? 1.25 : 2, Math.max(1, window.devicePixelRatio || 1));
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function drawGrid() {
      const w = canvas.width / dpr;
      const h = canvas.height / dpr;
      const palette = paletteRef.current;

      // dark base background
      ctx.fillStyle = palette.background;
      ctx.fillRect(0, 0, w, h);

      // grid settings
      const spacing = Math.max(60, Math.round(Math.min(w, h) / 12));
      const lineColor = hexToRgba(palette.grid, palette.lineAlpha);

      ctx.beginPath();
      ctx.strokeStyle = lineColor;
      ctx.lineWidth = 1;

      // vertical
      for (let x = 0; x <= w + spacing; x += spacing) {
        ctx.moveTo(x + 0.5, 0);
        ctx.lineTo(x + 0.5, h);
      }

      // horizontal
      for (let y = 0; y <= h + spacing; y += spacing) {
        ctx.moveTo(0, y + 0.5);
        ctx.lineTo(w, y + 0.5);
      }

      ctx.stroke();
    }

    function drawPointerGlow() {
      if (!pointerRef.current.active) return;
      const w = canvas.width / dpr;
      const h = canvas.height / dpr;
      const { x, y } = pointerRef.current;
      const palette = paletteRef.current;

      // increased glow size (320px radius)
      const glow = ctx.createRadialGradient(x, y, 0, x, y, 320);
      glow.addColorStop(0, hexToRgba(palette.glow, palette.glowAlpha));
      glow.addColorStop(1, hexToRgba(palette.background, 0));

      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, w, h);
    }

    function draw() {
      drawGrid();
      drawPointerGlow();
      framePending = false;
    }

    function scheduleDraw() {
      if (framePending || document.hidden) return;
      framePending = true;
      rafRef.current = requestAnimationFrame(draw);
    }

    function hexToRgba(hex: string, alpha = 1) {
      const parsed = hex.replace("#", "");
      const bigint = parseInt(parsed, 16);
      const r = (bigint >> 16) & 255;
      const g = (bigint >> 8) & 255;
      const b = bigint & 255;
      return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }

    function onPointerMove(e: PointerEvent) {
      pointerRef.current.active = true;
      pointerRef.current.x = e.clientX;
      pointerRef.current.y = e.clientY;
      scheduleDraw();
    }
    function onPointerLeave() {
      pointerRef.current.active = false;
      scheduleDraw();
    }

    function onResize() {
      resize();
      scheduleDraw();
    }

    function onVisibilityChange() {
      if (!document.hidden) scheduleDraw();
    }

    resize();
    window.addEventListener("resize", onResize, { passive: true });
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerleave", onPointerLeave);
    window.addEventListener("portfolio-theme-change", scheduleDraw);
    document.addEventListener("visibilitychange", onVisibilityChange);

    scheduleDraw();

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerleave", onPointerLeave);
      window.removeEventListener("portfolio-theme-change", scheduleDraw);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-10 w-full h-full"
      aria-hidden
    />
  );
}
