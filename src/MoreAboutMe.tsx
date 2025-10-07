// App.tsx
import React from "react";
import WhatIDo from "./assets/components/whatrrado.tsx";
import MetaBalls from "./components/MetaBalls";

const brandColors = {
  dark: "#000000",
  steel: "#415a77",
  sky: "#778da9",
  light: "#e0e1dd",
};

const App: React.FC = () => {
  return (
    <main className="w-full min-h-screen text-white max-w-7xl mx-auto px-4 py-20">
      {/* Row 2: graphic top on mobile, side on desktop */}
      <section className=" grid grid-cols-1 md:grid-cols-2 items-start gap-8">
        {/* Graphic first */}
        <div className="hidden md:flex justify-center items-center w-full h-full order-1 md:order-2">
          <div className="aspect-square w-full h-full max-w-md flex items-center justify-center">
            <MetaBalls
              color={brandColors.sky}
              cursorBallColor={brandColors.sky}
              cursorBallSize={1}
              ballCount={20}
              animationSize={40}
              enableMouseInteraction={true}
              enableTransparency={true}
              hoverSmoothness={0.05}
              clumpFactor={1}
              speed={0.3}
            />
          </div>
        </div>

        {/* Text second */}
        <div className="flex flex-col justify-start p-6 bg-white/10 backdrop-blur-md border border-white/20 shadow-lg rounded-2xl order-2 md:order-1">
          <h2 className="text-4xl font-semibold mb-4 text-left">
            What I Can Do For You
          </h2>
          <p className="text-lg text-left">
            I build interactive websites, scalable Shopify stores, and modern
            web apps with React, TypeScript, and GSAP. I specialize in smooth
            transitions and premium UX.
          </p>
          <WhatIDo />
        </div>
      </section>

   
    </main>
  );
};

export default App;
