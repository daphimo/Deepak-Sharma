import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Home, FolderGit2, Mail, User } from "lucide-react";
import GlassSurface from "./GlassSurface.tsx";
import DayNightToggle from "../../components/DayNightToggle";

const dockItems = [
  { id: "Home", icon: <Home size={22} />, href: "/" },
  { id: "About Me", icon: <User size={22} />, href: "/#aboutme" },
  { id: "Projects", icon: <FolderGit2 size={22} />, href: "/projects" },
  { id: "Contact", icon: <Mail size={22} />, href: "/#contact" },
];

export default function Dock() {
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== "undefined" ? window.matchMedia("(max-width: 767px)").matches : false
  );
  const navigate = useNavigate();

  useEffect(() => {
    const query = window.matchMedia("(max-width: 767px)");
    const update = (event: MediaQueryListEvent) => setIsMobile(event.matches);
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

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

  if (!isMobile) return null;

  return (
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50"
      >
        <GlassSurface
          width={320}
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
          className="px-6 py-3 flex  shadow-xl gap-6 items-center justify-center"
        >
          <div className="flex items-center gap-4">
            {dockItems.map((item) => (
              <button
                key={item.id}
                type="button"
                aria-label={item.id}
                onClick={() => handleNavClick(item.href)}
                className="cursor-pointer !text-[#00BCFF] transition-colors duration-200"
              >
                {item.icon}
              </button>
            ))}
            <DayNightToggle variant="compact" className="!text-[#00BCFF] !px-2 !py-1" />
          </div>
        </GlassSurface>
      </motion.div>
  );
}
