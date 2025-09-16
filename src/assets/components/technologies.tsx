import React from "react";
import { ScrollVelocity } from "./ScrollVelocity"; // your provided component

// Tech Icons
import { FaReact, FaNodeJs, FaGithub, FaDocker, FaFigma } from "react-icons/fa";
import {
  SiShopify,
  SiTailwindcss,
  SiTypescript,
  SiJavascript,
} from "react-icons/si";

export default function TechShowcase() {
  const icons = [
    <FaReact key="react" size={60} color="#61DBFB" />,
    <FaNodeJs key="node" size={60} color="#3C873A" />,
    <SiJavascript key="js" size={60} color="#F7DF1E" />,
    <SiTypescript key="ts" size={60} color="#3178C6" />,
    <SiTailwindcss key="tw" size={60} color="#38BDF8" />,
    <SiShopify key="shopify" size={60} color="#95BF47" />,
    <FaGithub key="github" size={60} color="#ffffff" />,
    <FaDocker key="docker" size={60} color="#2496ED" />,
    <FaFigma key="figma" size={60} color="#F24E1E" />,
  ];

  return (
    <div className="w-full flex flex-col gap-4">
      {/* First strip - tilted, scrolls right */}
      <div className="-rotate-4">
        <ScrollVelocity
          texts={[<div className="flex gap-16">{icons}</div>]}
          velocity={100}
          className="mx-6 my-0"
          numCopies={6}
        />
      </div>

      {/* Second strip - same tilt (parallel), scrolls left */}
      <div className="-rotate-4">
        <ScrollVelocity
          texts={[<div className="flex gap-16">{icons}</div>]}
          velocity={-100}
          className="mx-6 my-0"
          numCopies={6}
        />
      </div>
    </div>
  );
}
