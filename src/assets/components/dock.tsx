import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Home, FolderGit2, Mail, User, Rss } from "lucide-react";
import GlassSurface from "./GlassSurface.tsx";

const dockItems = [
  { id: "Home", icon: <Home size={22} />, href: "/" },
  { id: "About Me", icon: <User size={22} />, href: "/#aboutme" },
  { id: "Projects", icon: <FolderGit2 size={22} />, href: "/#projects" },
  { id: "Blogs", icon: <Rss size={22} />, href: "/#blogs" },
  { id: "Contact", icon: <Mail size={22} />, href: "/#contact" },
];

export default function Dock() {
  const { ref, inView } = useInView({ threshold: 0 });
  const [visible, setVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // detect mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768); // Tailwind md breakpoint
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (isMobile) {
      setVisible(true);
      return;
    }

    const handleScroll = () => {
      const scrollY = window.scrollY;
      if (!inView && scrollY > 50) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [inView, isMobile]);

  return (
    <>
      {/* Invisible tracker div placed where header ends */}
      <div ref={ref} className="h-0" />

      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: visible ? 0 : 100, opacity: visible ? 1 : 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50"
      >
        {/* Apply GlassSurface to the Dock */}
        <GlassSurface
          width={isMobile ? 320 : 400} // responsive width
          height={60}
          borderRadius={20}
          blur={15}
          displace={10}
          distortionScale={-180}
          redOffset={5}
          greenOffset={10}
          blueOffset={15}
          brightness={50}
          opacity={0.85}
          mixBlendMode="difference"
          className="px-6 py-3 flex gap-6 items-center justify-center"
        >
          {dockItems.map((item) => (
            <a key={item.id} href={item.href} className="text-[#EAEAEA]">
              {item.icon}
            </a>
          ))}
        </GlassSurface>
      </motion.div>
    </>
  );
}
