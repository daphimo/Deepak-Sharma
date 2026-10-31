import { useEffect, useState } from "react";
import { OrbitalHeroSection } from "@new/components/ui/orbital-hero-section";

function useNarrow(query = "(max-width: 767px)") {
  const [narrow, setNarrow] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    const sync = () => setNarrow(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, [query]);

  return narrow;
}

export default function OrbitalHeroDemo() {
  const narrow = useNarrow();

  return (
    <section className="orbital-portfolio-hero" aria-labelledby="orbital-hero-title">
      <OrbitalHeroSection
        focus={narrow ? [0.5, 0.84] : [0.72, 0.43]}
        scrim={narrow ? "top" : "left"}
        scrimStrength={narrow ? 0.96 : 0.9}
        viewRadius={narrow ? 2.15 : 3.1}
        lead={narrow ? 0.04 : 0.12}
        glow={narrow ? 0.55 : 1}
        starCount={narrow ? 700 : 1500}
      >
        <div className="orbital-hero-content">
          <div className="orbital-hero-copy">
            <p className="orbital-eyebrow">Shopify / Frontend / Interaction</p>
            <h1 id="orbital-hero-title">Nothing I build stands still.</h1>
            <p>
              I design and engineer storefronts where systems, performance,
              and motion move in the same direction.
            </p>
          </div>
        </div>
      </OrbitalHeroSection>
    </section>
  );
}
