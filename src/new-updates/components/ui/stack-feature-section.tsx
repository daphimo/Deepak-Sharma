import type { CSSProperties, ComponentType } from "react";
import {
  Braces,
  Boxes,
  Code2,
  Database,
  Gauge,
  GitBranch,
  Layers3,
  Orbit,
  PackageCheck,
  PanelsTopLeft,
  PenTool,
  ServerCog,
  ShoppingBag,
  Sparkles,
  Workflow,
} from "lucide-react";

interface StackItem {
  label: string;
  Icon: ComponentType<{ "aria-hidden"?: boolean }>;
}

const orbitItems: StackItem[][] = [
  [
    { label: "React", Icon: Code2 },
    { label: "Shopify", Icon: ShoppingBag },
    { label: "TypeScript", Icon: Braces },
    { label: "Figma", Icon: PenTool },
    { label: "Git", Icon: GitBranch },
  ],
  [
    { label: "Liquid", Icon: Sparkles },
    { label: "Vite", Icon: Gauge },
    { label: "Tailwind CSS", Icon: Layers3 },
    { label: "Node.js", Icon: ServerCog },
    { label: "APIs", Icon: Database },
  ],
  [
    { label: "Design systems", Icon: Boxes },
    { label: "CI/CD", Icon: Workflow },
    { label: "Components", Icon: PanelsTopLeft },
    { label: "Packages", Icon: PackageCheck },
    { label: "Interaction", Icon: Orbit },
  ],
];

export default function StackFeatureSection() {
  return (
    <section className="stack-feature" aria-labelledby="stack-feature-title">
      <div className="stack-feature-copy">
        <p className="section-label">Tools of the trade</p>
        <h2 id="stack-feature-title">Ideas, built to ship.</h2>
        <p>
          A focused stack for expressive Shopify storefronts and responsive
          product experiences—from first system sketch to production release.
        </p>
      </div>

      <div className="stack-orbit-window" aria-label="Technology stack">
        <div className="stack-orbit-system">
          <div className="stack-orbit-core" aria-hidden="true"><Code2 /></div>
          {orbitItems.map((items, orbitIndex) => (
            <div
              className="stack-orbit"
              key={orbitIndex}
              style={{
                "--orbit-size": `${18 + orbitIndex * 11}rem`,
                "--orbit-speed": `${18 + orbitIndex * 8}s`,
                "--orbit-direction": orbitIndex === 1 ? "reverse" : "normal",
                "--counter-direction": orbitIndex === 1 ? "normal" : "reverse",
              } as CSSProperties}
            >
              {items.map(({ label, Icon }, itemIndex) => (
                <div
                  className="stack-orbit-position"
                  key={label}
                  style={{ "--orbit-angle": `${itemIndex * (360 / items.length)}deg` } as CSSProperties}
                >
                  <div className="stack-orbit-item" title={label}>
                    <Icon aria-hidden={true} />
                    <span>{label}</span>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
