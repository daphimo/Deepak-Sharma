import React from "react";
import Shuffle from "./Shuffle.tsx";
import ScrambledText from "./Scramble.tsx";

const menuItems = [
  { label: "Home", href: "/" },
  { label: "Projects", href: "#projects" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

// 🎨 Brand Colors
const brandColors = {
  dark: "#000000",
  steel: "#415a77",
  sky: "#778da9",
  light: "#e0e1dd",
};

export default function Header(): React.ReactElement {
  return (
    <header
      className="fixed top-0 left-0 w-full z-50"
      style={{
        backdropFilter: "blur(2px)",
        WebkitBackdropFilter: "blur(2px)",
      }}
    >
      <div className="max-w-7xl mx-auto flex items-center px-6 py-4 justify-between">
        {/* Logo with Shuffle */}
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

        {/* Nav Items with Scramble */}
        <nav className="hidden md:flex gap-6 items-center">
          {menuItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
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
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
