"use client";
import React, { Suspense, lazy } from "react";
import MagicBentoStatic from "./components/MagicBentoStatic";
import { useIsTouchDevice } from "./hooks/use-is-touch-device";

const MagicBento = lazy(() => import("./components/MagicBento"));

const MoreAboutMe: React.FC = () => {
  const isTouchDevice = useIsTouchDevice();

  return (
    <div className="w-full max-w-7xl mx-auto min-h-screen text-[var(--foreground)] flex flex-col justify-start items-start px-4 py-20 transition-colors duration-500">
      
      {/* Top Text Section */}
      <div className="mb-16">
        <h2 className="text-4xl md:text-5xl font-bold mb-4">
          Crafting Experiences, Not Just Designs
        </h2>
        <p className="text-[var(--foreground)] text-lg max-w-2xl leading-relaxed transition-colors duration-500">
          This is where I bring ideas to life. From sleek interfaces to 
          meaningful digital experiences, I combine creativity, strategy, 
          and technology to deliver work that resonates. Each project I take 
          on tells a story — your story, shaped into an unforgettable journey 
          for users and audiences alike.
        </p>
      </div>

      {/* MagicBento Section */}
      <div className="w-full flex justify-center items-start">
        {isTouchDevice ? (
          <MagicBentoStatic />
        ) : (
          <Suspense fallback={<MagicBentoStatic />}>
            <MagicBento
              textAutoHide={true}
              enableStars={true}
              enableSpotlight={true}
              enableBorderGlow={true}
              enableTilt={true}
              enableMagnetism={true}
              clickEffect={true}
              spotlightRadius={300}
              particleCount={30}
              glowColor="132, 0, 255"
            />
          </Suspense>
        )}
      </div>
      
    </div>
  );
};

export default MoreAboutMe;
