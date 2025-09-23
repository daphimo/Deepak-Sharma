import { useRef, useEffect } from "react";

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

  useEffect(() => {
    const canvas = canvasRef.current!;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    let dpr = Math.max(1, window.devicePixelRatio || 1);

    function resize() {
      dpr = Math.max(1, window.devicePixelRatio || 1);
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

      // dark base background
      ctx.fillStyle = brandColors.dark;
      ctx.fillRect(0, 0, w, h);

      // grid settings
      const spacing = Math.max(60, Math.round(Math.min(w, h) / 12));
      const lineColor = hexToRgba(brandColors.light, 0.15); // brighter & more visible

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

      // increased glow size (320px radius)
      const glow = ctx.createRadialGradient(x, y, 0, x, y, 320);
      glow.addColorStop(0, hexToRgba(brandColors.sky, 0.25));
      glow.addColorStop(1, hexToRgba(brandColors.dark, 0));

      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, w, h);
    }

    function loop() {
      drawGrid();
      drawPointerGlow();
      rafRef.current = requestAnimationFrame(loop);
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
    }
    function onPointerLeave() {
      pointerRef.current.active = false;
    }

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerleave", onPointerLeave);

    rafRef.current = requestAnimationFrame(loop);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerleave", onPointerLeave);
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
