import {
  forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState,
  type CSSProperties, type KeyboardEvent, type PointerEvent as ReactPointerEvent, type ReactNode,
} from "react";
import "./orbit-reel.css";

export type OrbitReelView = "ring" | "arc";
export type OrbitReelItem = { src?: string; alt: string; title?: string; subtitle?: string; href?: string; background?: string };
export type OrbitReelHandle = { next: () => void; previous: () => void; goTo: (index: number) => void; setView: (view: OrbitReelView) => void };
export type OrbitReelProps = {
  items?: OrbitReelItem[]; count?: number; defaultView?: OrbitReelView; spin?: number; autoplay?: boolean;
  interval?: number; arc?: number; apex?: number; aspect?: number; radius?: number; gap?: number; tilt?: boolean;
  flipWave?: boolean; accentColor?: string; backgroundColor?: string; captions?: boolean; controls?: boolean;
  draggable?: boolean; wheel?: boolean; pauseOnHover?: boolean; zoomOnClick?: boolean; paused?: boolean;
  ringRadius?: number; ringMinRadius?: number; ringMaxRadius?: number; cardSize?: number; cardMinSize?: number; cardMaxSize?: number;
  arcZoom?: number; arcVerticalOffset?: number; arcSpread?: number; arcCardScale?: number; activeCardScale?: number; captionVerticalPosition?: number;
  mobileArcZoom?: number; mobileArcVerticalOffset?: number; mobileArcSpread?: number; mobileCaptionVerticalPosition?: number;
  ariaLabel?: string; onViewChange?: (view: OrbitReelView) => void; onActiveChange?: (index: number) => void;
  onSelect?: (item: OrbitReelItem, index: number) => void; className?: string; style?: CSSProperties; children?: ReactNode;
};

const DEMO_ITEMS: OrbitReelItem[] = [
  { alt: "Solar arc artwork", title: "Solar arc", subtitle: "A warm horizon for bold launches", background: "radial-gradient(circle at 68% 72%,#ffb800 0 24%,transparent 25%),linear-gradient(145deg,#ff174b 0 42%,#ff6a00 43% 58%,#2a0066 59%)" },
  { alt: "Plum ribbon artwork", title: "Plum ribbon", subtitle: "Two ribbons, one crossing", background: "radial-gradient(ellipse at 52% 4%,#ff7a00 0 31%,#f30b68 32% 43%,transparent 44%),linear-gradient(135deg,#31006f,#7600d8)" },
  { alt: "Neon step artwork", title: "Neon step", subtitle: "A sharp identity in motion", background: "linear-gradient(90deg,transparent 0 26%,#ff0b69 27% 59%,transparent 60%),linear-gradient(0deg,transparent 0 54%,#ff2a45 55% 79%,transparent 80%),linear-gradient(145deg,#3112e4,#5d009a)" },
  { alt: "Pink eclipse artwork", title: "Pink eclipse", subtitle: "A disc across the diagonal", background: "radial-gradient(circle at 48% 42%,#ff4057 0 39%,transparent 40%),linear-gradient(14deg,#2a087b 0 48%,#ff1171 49% 62%,#700073 63%)" },
  { alt: "Prism fold artwork", title: "Prism fold", subtitle: "Colour folded into structure", background: "linear-gradient(48deg,transparent 0 42%,#ff6b4e 43% 66%,transparent 67%),linear-gradient(128deg,#3215de 0 40%,#ff164e 41% 67%,#ff5c75 68%)" },
  { alt: "Signal wave artwork", title: "Signal wave", subtitle: "A soft current through violet", background: "radial-gradient(ellipse at -5% 50%,transparent 0 38%,#ff176e 39% 57%,transparent 58%),radial-gradient(ellipse at 105% 48%,transparent 0 41%,#ff5844 42% 58%,transparent 59%),#410078" },
  { alt: "Red monolith artwork", title: "Red monolith", subtitle: "A compact system of contrast", background: "linear-gradient(155deg,#ff3143 0 47%,#fa006d 48% 62%,#2a066d 63% 82%,#ff154e 83%)" },
  { alt: "Violet field artwork", title: "Violet field", subtitle: "A quiet study in electric blue", background: "linear-gradient(145deg,#5a4cff,#3210c6 58%,#230078)" },
];

const wrap = (value: number, length: number) => ((value % length) + length) % length;
const shortest = (value: number, length: number) => { const n = wrap(value, length); return n > length / 2 ? n - length : n };
const nearestEquivalent = (canonical: number, current: number) => canonical + Math.round((current - canonical) / 360) * 360;

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => { const media = window.matchMedia("(prefers-reduced-motion: reduce)"); const update = () => setReduced(media.matches); update(); media.addEventListener("change", update); return () => media.removeEventListener("change", update) }, []);
  return reduced;
}

export const OrbitReel = forwardRef<OrbitReelHandle, OrbitReelProps>(function OrbitReel({
  items = DEMO_ITEMS, count = 18, defaultView = "ring", spin = 8, autoplay = true, interval = 3.5,
  arc = 1, apex = 0.42, aspect = 0.8, radius = 0.07, gap = 0.18, tilt = true, flipWave = true,
  accentColor = "#5227ff", backgroundColor = "transparent", captions = true, controls = true,
  draggable = true, wheel = true, pauseOnHover = true, zoomOnClick = true, paused = false,
  ringRadius = 28, ringMinRadius = 150, ringMaxRadius = 244, cardSize = 7.2, cardMinSize = 50, cardMaxSize = 98,
  arcZoom, arcVerticalOffset, arcSpread: arcSpreadProp, arcCardScale = 1, activeCardScale = 1.08, captionVerticalPosition = 58,
  mobileArcZoom = .82, mobileArcVerticalOffset = .62, mobileArcSpread = .9, mobileCaptionVerticalPosition = 61,
  ariaLabel = "Orbit reel", onViewChange, onActiveChange, onSelect, className = "", style, children,
}, ref) {
  const safeItems = items.length ? items : DEMO_ITEMS;
  const passSize = Math.min(72, safeItems.length);
  const passes = Math.max(1, Math.min(Math.floor(72 / passSize), Math.round(count / passSize)));
  const safeCount = passSize * passes;
  const angleStep = 360 / safeCount;
  const repeatedItems = useMemo(() => Array.from({ length: safeCount }, (_, index) => ({ ...safeItems[index % safeItems.length], reelIndex: index })), [safeCount, safeItems]);
  const reducedMotion = useReducedMotion();
  const [view, setViewState] = useState<OrbitReelView>(defaultView);
  const [active, setActiveState] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [flipCycle, setFlipCycle] = useState(0);
  const [flipOrigin, setFlipOrigin] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const cameraRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef(0);
  const viewRef = useRef<OrbitReelView>(defaultView);
  const rotationRef = useRef(0), velocityRef = useRef(0), targetRotationRef = useRef<number | null>(defaultView === "arc" ? 0 : null);
  const frameRef = useRef(0), lastTimeRef = useRef(0);
  const dragRef = useRef({ id: -1, startX: 0, startY: 0, lastAngle: 0, lastTime: 0, moved: false });

  const setActive = useCallback((index: number) => {
    const nextIndex = wrap(index, safeCount);
    if (activeRef.current === nextIndex) return;
    activeRef.current = nextIndex; setActiveState(nextIndex); onActiveChange?.(nextIndex);
  }, [onActiveChange, safeCount]);
  const rotationForIndex = useCallback((index: number, current = rotationRef.current) => nearestEquivalent(-wrap(index, safeCount) * angleStep, current), [angleStep, safeCount]);
  const goTo = useCallback((index: number) => { const nextIndex = wrap(index, safeCount); setActive(nextIndex); velocityRef.current = 0; targetRotationRef.current = rotationForIndex(nextIndex) }, [rotationForIndex, safeCount, setActive]);
  const previous = useCallback(() => goTo(activeRef.current - 1), [goTo]);
  const next = useCallback(() => goTo(activeRef.current + 1), [goTo]);
  const setView = useCallback((nextView: OrbitReelView) => {
    if (nextView === viewRef.current) return;
    viewRef.current = nextView; setViewState(nextView); velocityRef.current = 0;
    targetRotationRef.current = nextView === "arc" ? rotationForIndex(activeRef.current) : null;
    onViewChange?.(nextView);
  }, [onViewChange, rotationForIndex]);
  useImperativeHandle(ref, () => ({ next, previous, goTo, setView }), [goTo, next, previous, setView]);

  useEffect(() => {
    const updateActiveFromRotation = () => setActive(wrap(Math.round(-rotationRef.current / angleStep), safeCount));
    const tick = (time: number) => {
      const delta = lastTimeRef.current ? Math.min(.05, (time - lastTimeRef.current) / 1000) : 0; lastTimeRef.current = time;
      const target = targetRotationRef.current;
      if (target !== null) {
        if (reducedMotion) rotationRef.current = target;
        else rotationRef.current += (target - rotationRef.current) * (1 - Math.exp(-8.5 * delta));
        if (Math.abs(target - rotationRef.current) < .025) { rotationRef.current = target; targetRotationRef.current = null; updateActiveFromRotation() }
      } else if (!dragging && !paused) {
        if (viewRef.current === "ring" && !reducedMotion && !(pauseOnHover && hovered)) rotationRef.current += (spin + velocityRef.current) * delta;
        else if (viewRef.current === "arc") {
          rotationRef.current += velocityRef.current * delta; updateActiveFromRotation();
          if (Math.abs(velocityRef.current) < 2) { velocityRef.current = 0; targetRotationRef.current = Math.round(rotationRef.current / angleStep) * angleStep }
        }
        velocityRef.current *= Math.pow(.045, delta);
      }
      if (stageRef.current) stageRef.current.style.transform = `rotate(${rotationRef.current}deg)`;
      frameRef.current = requestAnimationFrame(tick);
    };
    frameRef.current = requestAnimationFrame(tick); return () => cancelAnimationFrame(frameRef.current);
  }, [angleStep, dragging, hovered, pauseOnHover, paused, reducedMotion, safeCount, setActive, spin]);

  useEffect(() => {
    if (!flipWave || paused || reducedMotion || view !== "ring") return;
    const timer = window.setInterval(() => { setFlipOrigin(wrap(Math.round(-rotationRef.current / angleStep), safeCount)); setFlipCycle(cycle => cycle + 1) }, Math.max(2.8, interval) * 1000);
    return () => window.clearInterval(timer);
  }, [angleStep, flipWave, interval, paused, reducedMotion, safeCount, view]);
  useEffect(() => {
    if (!autoplay || paused || reducedMotion || view !== "arc" || (pauseOnHover && hovered) || dragging) return;
    const timer = window.setInterval(next, Math.max(1.8, interval) * 1000); return () => window.clearInterval(timer);
  }, [autoplay, dragging, hovered, interval, next, pauseOnHover, paused, reducedMotion, view]);
  useEffect(() => {
    const handleKey = (event: globalThis.KeyboardEvent) => {
      if (!rootRef.current?.contains(document.activeElement)) return;
      if (event.key === "ArrowRight" || event.key === "ArrowDown") { event.preventDefault(); next() }
      if (event.key === "ArrowLeft" || event.key === "ArrowUp") { event.preventDefault(); previous() }
      if (event.key === "Escape" && viewRef.current === "arc") { event.preventDefault(); setView("ring") }
    };
    window.addEventListener("keydown", handleKey); return () => window.removeEventListener("keydown", handleKey);
  }, [next, previous, setView]);
  useEffect(() => {
    const element = rootRef.current; if (!element || !wheel) return;
    const handleWheel = (event: globalThis.WheelEvent) => {
      if (paused) return; event.preventDefault(); const delta = Math.max(-120, Math.min(120, event.deltaY)); targetRotationRef.current = null;
      if (viewRef.current === "ring") velocityRef.current += delta * .28;
      else if (Math.abs(delta) >= 4) delta > 0 ? next() : previous();
    };
    element.addEventListener("wheel", handleWheel, { passive: false }); return () => element.removeEventListener("wheel", handleWheel);
  }, [next, paused, previous, wheel]);

  const pointerAngle = (event: ReactPointerEvent) => {
    const rect = cameraRef.current?.getBoundingClientRect() ?? rootRef.current?.getBoundingClientRect(); if (!rect) return 0;
    return Math.atan2(event.clientY - (rect.top + rect.height / 2), event.clientX - (rect.left + rect.width / 2)) * 180 / Math.PI;
  };
  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!draggable || event.button !== 0) return; targetRotationRef.current = null; velocityRef.current = 0;
    dragRef.current = { id: event.pointerId, startX: event.clientX, startY: event.clientY, lastAngle: pointerAngle(event), lastTime: performance.now(), moved: false }; setDragging(true);
  };
  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!dragging || dragRef.current.id !== event.pointerId) return;
    if (Math.hypot(event.clientX - dragRef.current.startX, event.clientY - dragRef.current.startY) > 6) { dragRef.current.moved = true; if (!event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.setPointerCapture(event.pointerId) }
    const angle = pointerAngle(event); let delta = angle - dragRef.current.lastAngle; if (delta > 180) delta -= 360; if (delta < -180) delta += 360;
    const now = performance.now(), elapsed = Math.max(8, now - dragRef.current.lastTime);
    rotationRef.current += delta; velocityRef.current = delta / elapsed * 1000; dragRef.current.lastAngle = angle; dragRef.current.lastTime = now;
    if (viewRef.current === "arc") setActive(wrap(Math.round(-rotationRef.current / angleStep), safeCount));
  };
  const handlePointerUp = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (dragRef.current.id !== event.pointerId) return;
    if (viewRef.current === "arc") { const projected = rotationRef.current + velocityRef.current * .16; const target = Math.round(projected / angleStep) * angleStep; targetRotationRef.current = target; setActive(wrap(Math.round(-target / angleStep), safeCount)) }
    dragRef.current.id = -1; setDragging(false);
  };
  const selectCard = (index: number) => {
    if (dragRef.current.moved) return; onSelect?.(repeatedItems[index], index);
    if (viewRef.current === "ring" && zoomOnClick) { setActive(index); targetRotationRef.current = rotationForIndex(index); viewRef.current = "arc"; setViewState("arc"); onViewChange?.("arc") }
    else if (viewRef.current === "arc") { if (index === activeRef.current && repeatedItems[index].href) window.location.assign(repeatedItems[index].href!); else goTo(index) }
  };
  const handleCardKey = (event: KeyboardEvent<HTMLButtonElement>, index: number) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); selectCard(index) } };
  const activeItem = repeatedItems[active] ?? repeatedItems[0];
  const arcSpreadValue = arcSpreadProp ?? Math.max(1.35, 1.58 + gap * .25);
  const arcZoomValue = arcZoom ?? Math.max(1.5, 2.28 * arc);
  const arcVerticalOffsetValue = arcVerticalOffset ?? Math.max(72, Math.min(88, apex * 202));
  const rootStyle = { ...style, "--reel-bg": backgroundColor, "--reel-accent": accentColor, "--card-aspect": aspect, "--card-radius": `${Math.max(0, radius) * 100}%`, "--ring-radius": `${ringRadius}vmin`, "--ring-min-radius": `${ringMinRadius}px`, "--ring-max-radius": `${ringMaxRadius}px`, "--card-size": `${cardSize}vw`, "--card-min-size": `${cardMinSize}px`, "--card-max-size": `${cardMaxSize}px`, "--arc-zoom": arcZoomValue, "--arc-shift": `${arcVerticalOffsetValue}vh`, "--arc-spread": arcSpreadValue, "--arc-card-scale": arcCardScale / arcSpreadValue, "--arc-card-hover-scale": arcCardScale * 1.055 / arcSpreadValue, "--arc-card-active-scale": arcCardScale * activeCardScale / arcSpreadValue, "--caption-top": `${captionVerticalPosition}%`, "--mobile-arc-zoom-resolved": arcZoomValue * mobileArcZoom, "--mobile-arc-shift-resolved": `${arcVerticalOffsetValue * mobileArcVerticalOffset}vh`, "--mobile-arc-spread-resolved": arcSpreadValue * mobileArcSpread, "--mobile-caption-top": `${mobileCaptionVerticalPosition}%`, "--card-gap": gap } as CSSProperties;

  return <div ref={rootRef} className={`orbit-reel orbit-reel--${view} ${dragging ? "is-dragging" : ""} ${className}`} style={rootStyle} role="region" aria-label={ariaLabel} tabIndex={0} onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp} onPointerCancel={handlePointerUp} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
    <div ref={cameraRef} className="orbit-reel__camera"><div className="orbit-reel__spread"><div ref={stageRef} className="orbit-reel__stage" aria-live="polite">
      {repeatedItems.map((item, index) => {
        const ringAngle = index * angleStep, distance = Math.abs(shortest(index - active, safeCount)), flipDistance = Math.abs(shortest(index - flipOrigin, safeCount));
        const cardStyle = { "--ring-angle": `${ringAngle}deg`, "--card-tilt": `${tilt ? ringAngle : 0}deg`, "--flip-delay": `${flipDistance * 72}ms`, "--art": item.background ?? "linear-gradient(145deg,#ff174b,#5600e8)" } as CSSProperties;
        return <div className="orbit-reel__slot" style={cardStyle} key={`${index}-${item.title ?? item.alt}`}><button type="button" className={`orbit-card ${flipCycle ? "orbit-card--wave" : ""}`} onClick={() => selectCard(index)} onKeyDown={event => handleCardKey(event, index)} aria-label={`${item.title ?? item.alt}${view === "ring" ? ", open project reel" : ""}`} aria-current={view === "arc" && index === active ? "true" : undefined}><span className="orbit-card__inner" key={flipCycle}><span className="orbit-card__face orbit-card__front">{item.src ? <img src={item.src} alt={item.alt} loading={distance > 2 ? "lazy" : "eager"} draggable={false} /> : <span className="orbit-card__art" role="img" aria-label={item.alt} />}<span className="orbit-card__number">{String(index % safeItems.length + 1).padStart(2, "0")}</span></span><span className="orbit-card__face orbit-card__back" aria-hidden="true"><span>DS</span></span></span></button></div>;
      })}
    </div></div></div>
    {children && view === "ring" ? <div className="orbit-reel__center">{children}</div> : null}
    {view === "arc" && captions ? <div className="orbit-reel__caption" key={`${active}-${activeItem.title}`}><strong>{activeItem.title ?? activeItem.alt}</strong>{activeItem.subtitle ? <span>{activeItem.subtitle}</span> : null}{controls ? <div className="orbit-reel__controls"><button type="button" onClick={previous} aria-label="Previous project">←</button><span>{String(active % safeItems.length + 1).padStart(2, "0")} / {String(safeItems.length).padStart(2, "0")}</span><button type="button" onClick={next} aria-label="Next project">→</button></div> : null}</div> : null}
    <button type="button" className="orbit-reel__mode" onClick={() => setView(view === "ring" ? "arc" : "ring")}>{view === "ring" ? "View projects" : "Return to ring"}</button>
  </div>;
});
