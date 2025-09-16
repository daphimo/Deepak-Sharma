// NoiseBackground.tsx
import { useEffect, useRef } from "react";

export default function NoiseBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const imageData = ctx.createImageData(canvas.width, canvas.height);

    const drawNoise = () => {
      const buffer = new Uint32Array(imageData.data.buffer);
      for (let i = 0; i < buffer.length; i++) {
        buffer[i] = Math.random() < 0.5 ? 0xff000000 : 0xffffffff;
      }
      ctx.putImageData(imageData, 0, 0);
    };

    setInterval(drawNoise, 50);
  }, []);

  return (
    <canvas ref={canvasRef} className="fixed inset-0 -z-10 w-full h-full" />
  );
}
