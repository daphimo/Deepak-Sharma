import { useState } from "react";
import { Pause, Play } from "lucide-react";
import { ImageStreamHero } from "@new/components/ui/image-stream-hero";

const images = [
  { src: "https://images.unsplash.com/photo-1558655146-9f40138edfeb?auto=format&fit=crop&w=700&q=80", alt: "Interface design workspace" },
  { src: "https://images.unsplash.com/photo-1559028012-481c04fa702d?auto=format&fit=crop&w=700&q=80", alt: "Creative website layout" },
  { src: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=700&q=80", alt: "Contemporary studio interior" },
  { src: "https://images.unsplash.com/photo-1523726491678-bf852e717f6a?auto=format&fit=crop&w=700&q=80", alt: "Design sketches and tools" },
  { src: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=700&q=80", alt: "Laptop displaying product work" },
  { src: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&w=700&q=80", alt: "Creative materials on a desk" },
  { src: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=700&q=80", alt: "Product design planning session" },
  { src: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=700&q=80", alt: "Team workshop around a wall" },
  { src: "https://images.unsplash.com/photo-1553484771-371a605b060b?auto=format&fit=crop&w=700&q=80", alt: "Minimal digital workspace" },
];

export default function ImageStreamDemo() {
  const [paused, setPaused] = useState(false);

  return (
    <section className="image-stream-showcase" aria-labelledby="image-stream-title">
      <ImageStreamHero images={images} paused={paused} speed={20}>
        <div className="image-stream-content">
          <div>
            <p className="section-label">Selected work</p>
            <h2 id="image-stream-title">Your next idea, front and centre.</h2>
          </div>
          <div className="image-stream-footer">
            <p>Storefronts, systems, and interactions designed to move products—and people—forward.</p>
            <div>
              <button type="button" onClick={() => setPaused((value) => !value)} aria-pressed={paused}>
                {paused ? <Play aria-hidden="true" /> : <Pause aria-hidden="true" />}
                {paused ? "Resume motion" : "Pause motion"}
              </button>
            </div>
          </div>
        </div>
      </ImageStreamHero>
    </section>
  );
}
