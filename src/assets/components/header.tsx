import React from "react";
import { useNavigate } from "react-router-dom";
import Shuffle from "./Shuffle.tsx";
import ScrambledText from "./Scramble.tsx";

const menuItems = [
  { label: "Home", href: "/" },
  { label: "About", href: "/#aboutme" },
  { label: "Projects", href: "/#projects" },
  { label: "Blogs", href: "/#blogs" },
  { label: "Contact", href: "/#contact" },
];

// 🎨 Brand Colors
const brandColors = {
  dark: "#000000",
  steel: "#415a77",
  sky: "#778da9",
  light: "#e0e1dd",
};

export default function Header(): React.ReactElement {
  const navigate = useNavigate();

  const handleNavClick = (href: string) => {
    if (href.startsWith("/#")) {
      // Extract section ID (e.g., "projects")
      const sectionId = href.replace("/#", "");
      // Navigate to home page
      navigate("/");
      // Wait briefly for home to mount, then scroll
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
    <header
      className="fixed top-0 left-0 w-full z-50"
      style={{
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 flex items-center py-4 justify-between">
        {/* Logo with Shuffle */}
        <a href="/">
          <Shuffle
            text="Deepak Sharma"
            shuffleDirection="right"
            duration={0.35}
            className="text-m font-bold tracking-wide"
            colorFrom={brandColors.sky}
            colorTo={brandColors.light}
            triggerOnHover={true}
            triggerOnce={true}
            shuffleTimes={9}
          />
        </a>

        {/* Nav Items with Scramble */}
        <nav className="hidden md:flex gap-6 items-center">
          {menuItems.map((item) => (
            <span
              key={item.label}
              onClick={() => handleNavClick(item.href)}
              className="cursor-pointer hover:text-sky-400 transition-colors"
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
        </nav>
      </div>
    </header>
  );
}
