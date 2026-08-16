import { useCallback, useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import "./ScrollProgress.css";

const clamp = (value: number) => Math.min(1, Math.max(0, value));

export default function ScrollProgress() {
  const { pathname, search } = useLocation();
  const fillRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<number | null>(null);
  const percentageRef = useRef(0);
  const [percentage, setPercentage] = useState(0);

  const updateProgress = useCallback(() => {
    frameRef.current = null;

    const root = document.documentElement;
    const scrollTop = window.scrollY || root.scrollTop;
    const scrollRange = Math.max(0, root.scrollHeight - window.innerHeight);
    const progress = scrollRange > 0 ? clamp(scrollTop / scrollRange) : 0;
    const nextPercentage = Math.round(progress * 100);

    if (fillRef.current) {
      fillRef.current.style.transform = `scaleY(${progress})`;
    }

    if (nextPercentage !== percentageRef.current) {
      percentageRef.current = nextPercentage;
      setPercentage(nextPercentage);
    }
  }, []);

  const scheduleUpdate = useCallback(() => {
    if (frameRef.current === null) {
      frameRef.current = window.requestAnimationFrame(updateProgress);
    }
  }, [updateProgress]);

  useEffect(() => {
    scheduleUpdate();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);

    const resizeObserver = new ResizeObserver(scheduleUpdate);
    resizeObserver.observe(document.documentElement);
    if (document.body) resizeObserver.observe(document.body);

    return () => {
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
      resizeObserver.disconnect();
      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }
    };
  }, [scheduleUpdate]);

  useEffect(() => {
    percentageRef.current = -1;
    scheduleUpdate();
  }, [pathname, search, scheduleUpdate]);

  const scrollToTop = () => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion ? "instant" : "smooth",
    });
  };

  return (
    <div
      className="scroll-progress"
      role="progressbar"
      aria-label="Page scroll progress"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={percentage}
    >
      <div className="scroll-progress__track" aria-hidden="true">
        <div ref={fillRef} className="scroll-progress__fill" />
      </div>
      <button
        type="button"
        className="scroll-progress__button"
        onClick={scrollToTop}
        aria-label={`Back to top. Page is ${percentage}% scrolled.`}
        title="Back to top"
      >
        <span className="scroll-progress__percentage" aria-hidden="true">
          {percentage}%
        </span>
        <svg
          className="scroll-progress__chevron"
          width="17"
          height="17"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M6 15L12 9L18 15"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  );
}
