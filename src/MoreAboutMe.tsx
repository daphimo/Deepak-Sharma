"use client";
import React from "react";
import MagicBento from "./components/MagicBento.tsx";

const MoreAboutMe: React.FC = () => {
  return (
    <div className="w-full max-w-7xl mx-auto min-h-screen text-white flex flex-col justify-start items-start px-4 py-20">
      
      {/* Top Text Section */}
      <div className="mb-16">
        <h2 className="text-4xl md:text-5xl font-bold mb-4">
          Crafting Experiences, Not Just Designs
        </h2>
        <p className="text-gray-300 text-lg max-w-2xl leading-relaxed">
          This is where I bring ideas to life. From sleek interfaces to 
          meaningful digital experiences, I combine creativity, strategy, 
          and technology to deliver work that resonates. Each project I take 
          on tells a story — your story, shaped into an unforgettable journey 
          for users and audiences alike.
        </p>
      </div>

      {/* MagicBento Section */}
      <div className="w-full flex justify-center items-start">
        <MagicBento
          textAutoHide={true}
          enableStars={true}
          enableSpotlight={true}
          enableBorderGlow={true}
          enableTilt={false}
          enableMagnetism={false}
          clickEffect={true}
          spotlightRadius={300}
          particleCount={12}
          glowColor="132, 0, 255"
        />
      </div>
      
    </div>
  );
};

export default MoreAboutMe;
