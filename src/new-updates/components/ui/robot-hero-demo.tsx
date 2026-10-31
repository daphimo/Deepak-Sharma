import { useNavigate } from "react-router-dom";
import { RobotHero } from "@new/components/ui/robot-hero";

export default function RobotHeroDemo({ embedded = false }: { embedded?: boolean }) {
  const navigate = useNavigate();

  return (
    <div className="robot-portfolio-hero">
      <RobotHero
        showNavigation={!embedded}
        backgroundText="DEEPAK"
        navItemsLeft={[
          { label: "Lunar", href: "/new-updates/innerpages/ui/lunar" },
          { label: "Orbital", href: "/new-updates/innerpages/ui/orbital" },
          { label: "Stack", href: "/new-updates/innerpages/ui/stack" },
        ]}
        contactText="Say hello"
        contactHref="mailto:hello@deepaksharma.dev"
        ctaText="Explore UI Lab"
        onCtaClick={() => navigate("/new-updates/innerpages/ui-lab")}
        color="#d7d5ce"
        pantallaColor="#c6ff3d"
        pantallaBrillo={1.05}
        blinkCycle={3.4}
        metalness={0.05}
      />
      <div className="robot-hero-note" aria-hidden="true">
        <span>Interactive study</span>
        <span>Tap the robot</span>
      </div>
    </div>
  );
}
