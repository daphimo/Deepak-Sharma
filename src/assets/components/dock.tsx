import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useNavigate } from "react-router-dom";
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
  const { ref } = useInView({ threshold: 0 });
  const [visible, setVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();

  // Detect mobile devices
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Toggle visibility based on scroll or mobile
  useEffect(() => {
    if (isMobile) {
      setVisible(true);
      return;
    }

    const handleScroll = () => {
      const scrollY = window.scrollY;
      // Show if user scrolled below 150px or not at top
      if (scrollY > 150) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    };

    // Run once on mount in case user is already scrolled down
    handleScroll();

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isMobile]);

  // Smooth SPA navigation with section scroll
  const handleNavClick = (href: string) => {
    if (href.startsWith("/#")) {
      const sectionId = href.replace("/#", "");
      navigate("/"); // navigate to home page
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
    <>
      {/* Invisible tracker div placed where header ends */}
      <div ref={ref} className="h-0" />

      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: visible ? 0 : 100, opacity: visible ? 1 : 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50"
      >
        <GlassSurface
          width={isMobile ? 320 : 400}
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
            <button
              key={item.id}
              onClick={() => handleNavClick(item.href)}
              className="text-[#EAEAEA] hover:text-sky-400 cursor-pointer transition-colors"
            >
              {item.icon}
            </button>
          ))}
        </GlassSurface>
      </motion.div>
    </>
  );
}
