// App.tsx
import React from "react";
import WhatIDo from "./assets/components/whatrrado.tsx";
import MoreAbout from "./assets/components/moreabout.tsx";
import MetaBalls from "./components/MetaBalls";
import MagnetLines from "./components/MagnetLines";

const brandColors = {
  dark: "#000000",
  steel: "#415a77",
  sky: "#778da9",
  light: "#e0e1dd",
};

const App: React.FC = () => {
  return (
    <main className="w-full min-h-screen text-white max-w-7xl mx-auto px-4">
      {/* Row 2: graphic top on mobile, side on desktop */}
      <section className=" grid grid-cols-1 md:grid-cols-2 items-start gap-8">
        {/* Graphic first */}
        <div className="flex justify-center w-full h-full items-center order-1 md:order-2">
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

      {/* Row 3: graphic top on mobile, side on desktop */}
      <section className="pt-20 pb-20 grid grid-cols-1 md:grid-cols-2 items-center gap-8">
        {/* Graphic first */}
        <div className="flex justify-center items-center order-1 md:order-1">
          <div className="aspect-square w-full max-w-md flex items-center justify-center">
            <MagnetLines
              rows={12}
              columns={9}
              containerSize="100%"
              lineColor="#ffffff"
              lineWidth="0.8vmin"
              lineHeight="5vmin"
              baseAngle={0}
              style={{ margin: "2rem auto" }}
            />
          </div>
        </div>

        {/* Text second */}
        <div className="flex flex-col justify-start p-6 bg-white/10 backdrop-blur-md border border-white/20 shadow-lg rounded-2xl order-2 md:order-2">
          <h2 className="text-4xl font-semibold mb-4">More About Me</h2>
          <p className="text-lg">
            Education, work experience, and projects — e-commerce stores,
            headless Shopify builds, UI/animation experiments, and more.
          </p>
          <MoreAbout />
        </div>
      </section>
    </main>
  );
};

export default App;
