import { ScrollVelocity } from "./ScrollVelocity";

// Tech Icons
import {
  FaReact,
  FaNodeJs,
  FaGithub,
  FaGitAlt,
  FaBootstrap,
  FaHtml5,
  FaCss3Alt,
  FaNpm,
  FaYarn,
  FaFontAwesome,
  // FaFigma,
  FaJs,
} from "react-icons/fa";

import {
  SiShopify,
  SiTailwindcss,
  SiJavascript,
  SiJquery,
  SiJson,
  SiVercel,
  SiNetlify,
  SiRender,
  SiVite,
  SiPnpm,
  SiPuppeteer,
  SiTypescript,
  SiPrettier,
  SiFigma,
  SiFramer,
} from "react-icons/si";

import { HiOutlineLightningBolt } from "react-icons/hi"; // Lazy Loading substitute
import { MdSecurity } from "react-icons/md"; // HTTPS substitute
import { RiMetaLine } from "react-icons/ri"; // Meta (Open Graph substitute)
import { TbSchema } from "react-icons/tb"; // Schema.org

export default function TechShowcase() {
  const icons = [
    // Shopify Ecosystem
    <SiShopify key="shopify" size={60} color="#95BF47" />,
    <FaReact key="react" size={60} color="#61DBFB" />,
    <FaNodeJs key="node" size={60} color="#3C873A" />,
    <SiTailwindcss key="tailwind" size={60} color="#38BDF8" />,
    <FaBootstrap key="bootstrap" size={60} color="#38BDF8" />,
    <SiVite key="vite" size={60} color="#A259FF" />,
    <SiVercel key="vercel" size={60} color="#ffffff" />,
    <SiNetlify key="netlify" size={60} color="#00AD9F" />,
    <SiRender key="render" size={60} color="#46E3B7" />,

    // Package Managers
    <FaNpm key="npm" size={60} color="#CB3837" />,
    <FaYarn key="yarn" size={60} color="#2C8EBB" />,
    <SiPnpm key="pnpm" size={60} color="#F69220" />,
    <FaJs key="javascripts" size={60} color="#F7DF1E" />,
    <SiJquery key="jquery" size={60} color="#F7DF1E" />,

    // Automation / Testing
    <SiPuppeteer key="puppeteer" size={60} color="#40B5A4" />,

    // Languages & Tools
    <SiJavascript key="js" size={60} color="#F7DF1E" />,
    <SiTypescript key="ts" size={60} color="#3178C6" />,
    <SiJson key="json" size={60} color="#f7a41d" />,
    <FaHtml5 key="html" size={60} color="#E34F26" />,
    <FaCss3Alt key="css" size={60} color="#1572B6" />,

    // Code & Formatting
    <SiPrettier key="prettier" size={60} color="#F7B93E" />,
    <FaGitAlt key="git" size={60} color="#F1502F" />,
    <FaGithub key="github" size={60} color="#ffffff" />,

    // Web & SEO
    <MdSecurity key="https" size={60} color="#1E90FF" />,
    <HiOutlineLightningBolt key="lazy" size={60} color="#FFD700" />,
    <RiMetaLine key="meta" size={60} color="#4267B2" />,
    <TbSchema key="schema" size={60} color="#FFB703" />,

    // Design / Icons
    <SiFigma key="figma" size={60} color="#F24E1E" />,
    <FaFontAwesome key="fontawesome" size={60} color="#528DD7" />,

    // Animation
    <SiFramer key="framer-motion" size={60} color="#0055FF" />,
  ];

  return (
    <div className="w-full flex flex-col gap-4">
      {/* First strip - tilted, scrolls right */}
      <div className="-rotate-6">
        <ScrollVelocity
          texts={[
            <div key="row1" className="flex gap-16 items-center">
              {icons}
            </div>,
          ]}
          velocity={100}
          className="mx-6 my-0"
          numCopies={12}
        />
      </div>

      {/* Second strip - same tilt (parallel), scrolls left */}
      <div className="-rotate-6">
        <ScrollVelocity
          texts={[
            <div key="row2" className="flex gap-16 items-center">
              {icons}
            </div>,
          ]}
          velocity={-100}
          className="mx-6 my-0"
          numCopies={12}
        />
      </div>
    </div>
  );
}
