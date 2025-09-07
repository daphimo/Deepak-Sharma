"use client";

import { useRef, useEffect } from "react";

const brandColors = {
  dark: "#000000",
  steel: "#415a77",
  sky: "#778da9",
  light: "#e0e1dd",
};

type Star = {
  x: number;
  y: number;
  r: number;
  baseR: number;
  vx: number;
  vy: number;
  hue: string;
  alpha: number;
  glow: number;
  twinklePhase: number;
};

export default function Space() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const stars: Star[] = [];
    const starCount = 140; // reduced 5x

    const colors = [
      brandColors.light,
      brandColors.sky,
      brandColors.steel,
      "#ffd166",
      "#8ecae6",
    ];

    function rand(min: number, max: number) {
      return Math.random() * (max - min) + min;
    }

    function initStars() {
      stars.length = 0;
      for (let i = 0; i < starCount; i++) {
        const r = rand(0.25, 2.5);
        stars.push({
          x: rand(0, width),
          y: rand(0, height),
          r,
          baseR: r,
          vx: rand(-0.02, 0.02),
          vy: rand(-0.02, 0.02),
          hue: colors[Math.floor(Math.random() * colors.length)],
          alpha: rand(0.5, 1),
          glow: rand(6, 22),
          twinklePhase: Math.random() * Math.PI * 2,
        });
      }
    }

    initStars();

    const mouse = { x: -9999, y: -9999 };

    function onMove(e: MouseEvent) {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    }

    function onLeave() {
      mouse.x = -9999;
      mouse.y = -9999;
    }

    function draw() {
      ctx.fillStyle = brandColors.dark;
      ctx.fillRect(0, 0, width, height);

      for (const s of stars) {
        // twinkle
        s.twinklePhase += 0.02;
        const pulse = 0.85 + Math.sin(s.twinklePhase) * 0.25;
        const drawR = Math.max(0.2, s.baseR * pulse);

        // subtle movement with mouse proximity
        if (mouse.x > -9000) {
          const dx = s.x - mouse.x;
          const dy = s.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const effectRadius = 120;
          if (dist < effectRadius) {
            const force = (1 - dist / effectRadius) * 0.2; // gentle push
            s.x += (dx / dist) * force * 2;
            s.y += (dy / dist) * force * 2;
          }
        }

        // glow
        ctx.beginPath();
        ctx.globalAlpha = Math.max(0.06, s.alpha * 0.45);
        ctx.fillStyle = s.hue;
        ctx.shadowBlur = s.glow;
        ctx.shadowColor = s.hue;
        ctx.arc(s.x, s.y, drawR * 2.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();

        // core
        ctx.beginPath();
        ctx.globalAlpha = s.alpha;
        ctx.shadowBlur = 0;
        ctx.fillStyle = s.hue;
        ctx.arc(s.x, s.y, drawR, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
      }

      requestAnimationFrame(draw);
    }

    draw();

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseleave", onLeave);
    window.addEventListener("resize", () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      initStars();
    });

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-10 w-full h-full"
      style={{ display: "block", background: brandColors.dark }}
    />
  );
}
