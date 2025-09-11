// StylishBackToTop.tsx
import React, { useEffect, useMemo, useState } from "react";

interface Props {
  threshold?: number;
  size?: number;
  behavior?: "smooth" | "instant";
  ariaLabel?: string;
  showProgress?: boolean;
  className?: string;
}

const brandColors = {
  dark: "#000000",
  steel: "#415a77",
  sky: "#778da9",
  light: "#e0e1dd",
};

export default function StylishBackToTop({
  threshold = 300,
  size = 56,
  behavior = "smooth",
  ariaLabel = "Back to top",
  showProgress = true,
  className = "",
}: Props) {
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);

  const stroke = 4;
  const radius = (size - stroke * 2) / 2;
  const circumference = 2 * Math.PI * radius;

  const prefersReducedMotion = useMemo(() => {
    if (typeof window === "undefined" || !("matchMedia" in window))
      return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const scrolled = window.scrollY || window.pageYOffset;
      setVisible(scrolled > threshold);

      const doc = document.documentElement;
      const total = doc.scrollHeight - doc.clientHeight;
      const pct = total > 0 ? Math.min(1, scrolled / total) : 0;
      setProgress(pct);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);

  const handleClick = (e?: React.MouseEvent) => {
    if (e) (e.currentTarget as HTMLElement).blur();
    if (behavior === "instant" || prefersReducedMotion) {
      window.scrollTo(0, 0);
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const active = document.activeElement;
      const typing =
        active &&
        (active.tagName === "INPUT" ||
          active.tagName === "TEXTAREA" ||
          (active as HTMLElement).isContentEditable);
      if (typing) return;
      if (e.key.toLowerCase() === "t") {
        handleClick();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [behavior, prefersReducedMotion]);

  const styleVars: React.CSSProperties = {
    width: size,
    height: size,
    boxShadow: "0 10px 30px rgba(2,6,23,0.35)",
    background: `linear-gradient(180deg, ${brandColors.light}, rgba(255,255,255,0.6))`,
    backdropFilter: "blur(8px) saturate(120%)",
    cursor: "pointer",
  };

  const baseButtonClass =
    "pointer-events-auto button fixed z-[9999] rounded-full transition-transform duration-300 ease-in-out focus:outline-none focus-visible:ring-4 focus-visible:ring-offset-2";

  return (
    <div
      aria-hidden={!visible}
      className={`back-to-top-root ${className}`}
      style={{ pointerEvents: visible ? "auto" : "none" }}
    >
      <button
        onClick={handleClick}
        aria-label={ariaLabel}
        title="Back to top (press 'T')"
        className={
          baseButtonClass +
          " right-6 bottom-6 " +
          (visible ? "scale-100 opacity-100" : "scale-75 opacity-0")
        }
        style={styleVars}
      >
        <div
          style={{
            width: size,
            height: size,
            display: "grid",
            placeItems: "center",
            borderRadius: 9999,
            position: "relative",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: 9999,
              boxShadow: `${brandColors.steel}33 0px 18px 36px, rgba(0,0,0,0.08) 0px 3px 8px`,
              zIndex: 1,
            }}
            aria-hidden
          />

          {showProgress && (
            <svg
              width={size}
              height={size}
              viewBox={`0 0 ${size} ${size}`}
              style={{
                position: "absolute",
                zIndex: 2,
                transform: "rotate(-90deg)",
              }}
              aria-hidden
            >
              <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                stroke={brandColors.sky}
                strokeWidth={stroke}
                fill="none"
                style={{ opacity: 0.18 }}
              />
              <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                stroke={brandColors.steel}
                strokeWidth={stroke}
                strokeLinecap="round"
                fill="none"
                style={{
                  transformOrigin: "50% 50%",
                  transition: prefersReducedMotion
                    ? "none"
                    : "stroke-dashoffset 300ms linear",
                  strokeDasharray: circumference,
                  strokeDashoffset: circumference - progress * circumference,
                }}
              />
            </svg>
          )}

          {/* inner chevron chip (slightly smaller) */}
          <div
            style={{
              zIndex: 3,
              width: size - 20,
              height: size - 20,
              borderRadius: 9999,
              display: "grid",
              placeItems: "center",
              background:
                "linear-gradient(180deg, rgba(255,255,255,0.95), rgba(255,255,255,0.75))",
              border: `1px solid rgba(0,0,0,0.06)`,
              transform: visible ? "translateY(0)" : "translateY(6px)",
              transition: prefersReducedMotion
                ? "none"
                : "transform 300ms cubic-bezier(.2,.9,.26,1)",
              boxShadow: "inset 0 -6px 18px rgba(65,90,119,0.06)",
            }}
          >
            <svg
              width={20}
              height={20}
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden
            >
              <path
                d="M6 15L12 9L18 15"
                stroke={brandColors.dark}
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      </button>

      <div
        style={{
          position: "absolute",
          width: 1,
          height: 1,
          overflow: "hidden",
          clip: "rect(1px, 1px, 1px, 1px)",
        }}
        aria-live="polite"
      >
        {visible ? "Back to top button visible" : "Back to top button hidden"}
      </div>

      <style>{`
        .back-to-top-root button{ transition-property: transform, opacity; }
        @media (prefers-reduced-motion: reduce){ .back-to-top-root button{ transition: none !important; } }
        @media (max-width:640px){ .back-to-top-root button{ right:12px; bottom:12px } }
      `}</style>
    </div>
  );
}
