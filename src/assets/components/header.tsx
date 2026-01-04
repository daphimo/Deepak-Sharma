import React from "react";
import { useNavigate } from "react-router-dom";
import Shuffle from "./Shuffle.tsx";
import ScrambledText from "./Scramble.tsx";
import DayNightToggle from "../../components/DayNightToggle";

const menuItems = [
  { label: "Home", href: "/" },
  { label: "About", href: "/#aboutme" },
  { label: "Projects", href: "/#projects" },
  { label: "Blogs", href: "/#blogs" },
  { label: "Contact", href: "/#contact" },
];

export default function Header(): React.ReactElement {
  const navigate = useNavigate();

  const handleNavClick = (href: string) => {
    if (href.startsWith("/#")) {
      const sectionId = href.replace("/#", "");
      navigate("/");
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) {
          el.scrollIntoView({ behavior: "smooth" });
        }
      }, 300);
    } else {
      navigate(href);
    }
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 text-[var(--foreground)] transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-4 pt-4">
        <div className="flex justify-center">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full gap-4 rounded-full bg-[color-mix(in_oklch,var(--card),transparent_70%)] border border-[color-mix(in_oklch,var(--foreground),transparent_80%)] backdrop-blur-xl shadow-lg px-5 py-3 transition-colors duration-500">
            {/* Logo with Shuffle */}
            <a href="/" className="flex-shrink-0 justify-self-start mb-[-8px]">
              <Shuffle
                text="Deepak Sharma"
                shuffleDirection="right"
                duration={0.35}
                className="text-m font-bold tracking-wide text-[var(--foreground)]"
                colorFrom="var(--primary)"
                colorTo="var(--foreground)"
                triggerOnHover={true}
                triggerOnce={true}
                shuffleTimes={9}
              />
            </a>

            {/* Nav Items with Scramble */}
            <nav className="hidden md:flex w-full items-center justify-center">
              <div className="flex flex-row flex-nowrap gap-6">
              {menuItems.map((item) => (
                <span
                  key={item.label}
                  onClick={() => handleNavClick(item.href)}
                  className="cursor-pointer text-[var(--foreground)] hover:text-[var(--primary)] transition-colors"
                >
                  <ScrambledText
                    radius={100}
                    duration={0.6}
                    speed={0.5}
                    scrambleChars={
                      "!@#$%^&*()Yoimiya_+<>?/!@#$%^-=[]{Yoimiya}|;:',.<>?/!@#$%^&*(Yoimiya)-=[]<>?/!@#$%^"
                    }
                  >
                    {item.label}
                  </ScrambledText>
                </span>
              ))}
              </div>
            </nav>

            <div className="hidden md:flex justify-end items-center">
              <DayNightToggle variant="inline" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
