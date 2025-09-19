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
} from "react-icons/fa";
import {
  SiShopify,
  SiTailwindcss,
  SiJavascript,
  SiJquery,
  SiJson,
} from "react-icons/si";

export default function TechShowcase() {
  const icons = [
    <SiShopify key="shopify" size={60} color="#95BF47" />,
    <FaHtml5 key="html" size={60} color="#E34F26" />,
    <FaCss3Alt key="css" size={60} color="#1572B6" />,
    <SiTailwindcss key="tailwind" size={60} color="#38BDF8" />,
    <SiJson key="json" size={60} color="#f7a41d" />,
    <FaGitAlt key="git" size={60} color="#F1502F" />,
    <FaBootstrap key="bootstrap" size={60} color="#7952B3" />,
    <SiJquery key="jquery" size={60} color="#0769AD" />,
    <FaNodeJs key="node" size={60} color="#3C873A" />,
    <FaReact key="react" size={60} color="#61DBFB" />,
    <FaGithub key="github" size={60} color="#ffffff" />,
    <SiJavascript key="js" size={60} color="#F7DF1E" />,
  ];

  return (
    <div className="w-full flex flex-col gap-4">
      {/* First strip - tilted, scrolls right */}
      <div className="-rotate-6">
        <ScrollVelocity
          texts={[
            <div key="row1" className="flex gap-16">
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
            <div key="row2" className="flex gap-16">
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
