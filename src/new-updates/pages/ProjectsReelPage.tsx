import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { OrbitReel, type OrbitReelItem, type OrbitReelProps } from "../components/orbit-reel/OrbitReel";

const projects: OrbitReelItem[] = [
  { alt: "Solar Arc abstract artwork", title: "Solar Arc", subtitle: "Commerce experiences built for momentum", background: "radial-gradient(circle at 67% 75%,#ffb800 0 24%,transparent 25%),linear-gradient(145deg,#ff174b 0 42%,#ff6a00 43% 58%,#2a0066 59%)" },
  { alt: "Plum Ribbon abstract artwork", title: "Plum Ribbon", subtitle: "Two ribbons, one crossing", background: "radial-gradient(ellipse at 52% 4%,#ff7a00 0 31%,#f30b68 32% 43%,transparent 44%),linear-gradient(135deg,#31006f,#7600d8)" },
  { alt: "Neon Step abstract artwork", title: "Neon Step", subtitle: "Interfaces shaped around decisive actions", background: "linear-gradient(90deg,transparent 0 26%,#ff0b69 27% 59%,transparent 60%),linear-gradient(0deg,transparent 0 54%,#ff2a45 55% 79%,transparent 80%),linear-gradient(145deg,#3112e4,#5d009a)" },
  { alt: "Pink Eclipse abstract artwork", title: "Pink Eclipse", subtitle: "A disc across the diagonal", background: "radial-gradient(circle at 48% 42%,#ff4057 0 39%,transparent 40%),linear-gradient(14deg,#2a087b 0 48%,#ff1171 49% 62%,#700073 63%)" },
  { alt: "Prism Fold abstract artwork", title: "Prism Fold", subtitle: "Design systems with expressive range", background: "linear-gradient(48deg,transparent 0 42%,#ff6b4e 43% 66%,transparent 67%),linear-gradient(128deg,#3215de 0 40%,#ff164e 41% 67%,#ff5c75 68%)" },
  { alt: "Signal Wave abstract artwork", title: "Signal Wave", subtitle: "Performance that feels effortless", background: "radial-gradient(ellipse at -5% 50%,transparent 0 38%,#ff176e 39% 57%,transparent 58%),radial-gradient(ellipse at 105% 48%,transparent 0 41%,#ff5844 42% 58%,transparent 59%),#410078" },
  { alt: "Red Monolith abstract artwork", title: "Red Monolith", subtitle: "Strong foundations for ambitious products", background: "linear-gradient(155deg,#ff3143 0 47%,#fa006d 48% 62%,#2a066d 63% 82%,#ff154e 83%)" },
  { alt: "Violet Field abstract artwork", title: "Violet Field", subtitle: "A quiet study in electric blue", background: "linear-gradient(145deg,#5a4cff,#3210c6 58%,#230078)" },
];

const reelConfig: OrbitReelProps = {
  defaultView: "ring", count: 18, spin: 7, interval: 4, aspect: .79, radius: .08, gap: .25,
  ringRadius: 26, ringMinRadius: 260, ringMaxRadius: 226,
  cardSize: 4.2, cardMinSize: 72, cardMaxSize: 130,
  arcZoom: 3.27, arcVerticalOffset: 114, arcSpread: 1.34, arcCardScale: 1.15,
  activeCardScale: 1.08, captionVerticalPosition: 73,
  mobileArcZoom: .78, mobileArcVerticalOffset: .62, mobileArcSpread: .9, mobileCaptionVerticalPosition: 61,
  autoplay: true, tilt: true, flipWave: true, captions: true, controls: true,
  draggable: true, wheel: true, pauseOnHover: false, zoomOnClick: true, paused: false,
  accentColor: "#c6ff3d", backgroundColor: "transparent",
};

export default function ProjectsReelPage() {
  return <main className="projects-reel-page">
    <Link className="projects-reel-back" to="/new-updates"><ArrowLeft aria-hidden="true" /> Back to experiments</Link>
    <div className="projects-reel-mark" aria-hidden="true">Selected work · 2026</div>
    <OrbitReel items={projects} {...reelConfig} ariaLabel="Deepak Sharma project showcase">
      <div className="projects-reel-center-copy"><span>Selected</span><strong>Projects</strong><small>Drag · scroll · select</small></div>
    </OrbitReel>
  </main>;
}
