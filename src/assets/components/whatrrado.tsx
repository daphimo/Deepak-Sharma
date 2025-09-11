import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Service = {
  id: number;
  title: string;
  content: string;
  image: string;
};

const services: Service[] = [
  {
    id: 1,
    title: "Store Setup & Customization",
    content: `Theme setup, customization, and styling (Dawn, custom themes, etc.)
Conversion-focused store layouts`,
    image: "/files/store.jpg",
  },
  {
    id: 2,
    title: "Custom Theme Development",
    content: `Build pixel-perfect custom themes from Figma/PSD.
Reusable Shopify sections and blocks.`,
    image: "/files/theme.jpg",
  },
  {
    id: 3,
    title: "Performance Optimization",
    content: `Minify assets, lazy loading, Core Web Vitals improvements.
Speed audits and performance fixes.`,
    image: "/files/performance.jpg",
  },
  {
    id: 4,
    title: "Responsive Web Applications",
    content: `Mobile-first, cross-browser apps with React / Next.js / Vue.
Progressive Web Apps (PWAs) for offline-first experiences.`,
    image: "/files/responsive.jpg",
  },
  {
    id: 5,
    title: "SEO-friendly Development",
    content: `Schema markup, meta tags, OpenGraph for social sharing.
Optimized site structure for organic ranking.`,
    image: "/files/seo.jpg",
  },
];

export default function ServicesCollapsible() {
  const [active, setActive] = useState<number | null>(null);
  const [hovered, setHovered] = useState<Service | null>(null);
  const [cursor, setCursor] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });

  const toggle = (id: number) => {
    setActive(active === id ? null : id);
  };

  return (
    <div className="max-w-4xl mx-auto py-6 space-y-4 relative w-full">
      {services.map((service) => (
        <div key={service.id} className="w-full border-b border-gray-600">
          <button
            onClick={() => toggle(service.id)}
            className="w-full flex cursor-pointer justify-between items-center py-3 text-left text-2xl font-semibold"
            onMouseEnter={() => setHovered(service)}
            onMouseLeave={() => setHovered(null)}
            onMouseMove={(e) => setCursor({ x: e.clientX, y: e.clientY })}
          >
            <span>
              {service.id}. {service.title}
            </span>
            <span>{active === service.id ? "−" : "+"}</span>
          </button>

          {/* Collapsible Content */}
          <motion.div
            initial={false}
            animate={{
              height: active === service.id ? "auto" : 0,
              opacity: active === service.id ? 1 : 0,
            }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="overflow-hidden pl-2 text-left"
          >
            <div className="pb-4 space-y-3">
              {/* Show image only on mobile (inside collapsible) */}
              <div className="block md:hidden">
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full rounded-lg mb-3"
                />
              </div>

              <ul className="list-none space-y-2">
                {service.content.split("\n").map((line, i) => (
                  <li key={i} className="relative pl-6 text-white">
                    <span className="absolute left-0 top-1 w-3 h-3 rounded-full border-2 border-white flex items-center justify-center">
                      <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
                    </span>
                    {line}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>
      ))}

      {/* Floating Image on Hover (desktop only) */}
      <AnimatePresence>
        {hovered && (
          <motion.img
            key={hovered.id}
            src={hovered.image}
            alt={hovered.title}
            className="hidden md:block fixed w-36 h-24 object-cover pointer-events-none rounded-xl shadow-lg"
            style={{
              top: cursor.y + 20,
              left: cursor.x + 20,
              transform: "rotate(10deg) perspective(600px) rotateY(0deg)",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
