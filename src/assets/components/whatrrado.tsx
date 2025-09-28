import { useState } from "react";
import { motion } from "framer-motion";

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
    image: "/files/store.webp",
  },
  {
    id: 2,
    title: "Custom Theme Development",
    content: `Build pixel-perfect custom themes from Figma/PSD.
Reusable Shopify sections and blocks.`,
    image: "/files/theme.webp",
  },
  {
    id: 3,
    title: "Performance Optimization",
    content: `Minify assets, lazy loading, Core Web Vitals improvements.
Speed audits and performance fixes.`,
    image: "/files/performance.webp",
  },
  {
    id: 4,
    title: "Responsive Web Applications",
    content: `Mobile-first, cross-browser apps with React / Next.js / Vue.
Progressive Web Apps (PWAs) for offline-first experiences.`,
    image: "/files/responsive.webp",
  },
  {
    id: 5,
    title: "SEO-friendly Development",
    content: `Schema markup, meta tags, OpenGraph for social sharing.
Optimized site structure for organic ranking.`,
    image: "/files/seo.webp",
  },
];

export default function App() {
  const [active, setActive] = useState<number | null>(null);

  const toggle = (id: number) => {
    setActive(active === id ? null : id);
  };

  return (
    <div className="text-white">
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto space-y-4 relative w-full">
          {services.map((service) => (
            <div key={service.id} className="w-full border-b border-gray-600">
              <button
                onClick={() => toggle(service.id)}
                className="w-full flex cursor-pointer justify-between items-center py-4 text-left text-xl md:text-2xl font-semibold hover:text-blue-400 transition-colors duration-200"
              >
                <span className="flex items-center gap-4">
                  <span className="text-blue-400 font-mono">0{service.id}</span>
                  <span>{service.title}</span>
                </span>
                <motion.span
                  animate={{ rotate: active === service.id ? 45 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="text-2xl font-light"
                >
                  {active === service.id ? "−" : "+"}
                </motion.span>
              </button>

              {/* Collapsible Content */}
              <motion.div
                initial={false}
                animate={{
                  height: active === service.id ? "auto" : 0,
                  opacity: active === service.id ? 1 : 0,
                }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <div className="pb-6 pl-8 space-y-4">
                  {/* Image shown inside collapsible for all devices */}
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full max-w-md rounded-lg mb-4"
                  />

                  <ul className="list-none space-y-3">
                    {service.content.split("\n").map((line, i) => (
                      <li key={i} className="relative pl-6 text-gray-300">
                        <span className="absolute left-0 top-2 w-2 h-2 rounded-full bg-blue-400"></span>
                        {line}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
