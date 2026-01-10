export interface BentoCardData {
  id: number;
  title: string;
  description: string;
  label: string;
  image?: string;
}

export const magicBentoCardData: BentoCardData[] = [
  {
    id: 1,
    title: "Store Setup & Customization",
    description:
      "Theme setup, customization, and styling (Dawn, custom themes, etc.). Conversion-focused store layouts",
    label: "Store Setup",
    image: "/files/store.webp",
  },
  {
    id: 2,
    title: "Custom Theme Development",
    description:
      "Build pixel-perfect custom themes from Figma/PSD. Reusable Shopify sections and blocks.",
    label: "Theme Dev",
    image: "/files/theme.webp",
  },
  {
    id: 3,
    title: "Performance Optimization",
    description:
      "Minify assets, lazy loading, Core Web Vitals improvements. Speed audits and performance fixes.",
    label: "Optimization",
    image: "/files/performance.webp",
  },
  {
    id: 4,
    title: "Responsive Web Applications",
    description:
      "Mobile-first, cross-browser apps with React / Next.js / Vue. Progressive Web Apps (PWAs) for offline-first experiences.",
    label: "Web Apps",
    image: "/files/responsive.webp",
  },
  {
    id: 5,
    title: "SEO-friendly Development",
    description:
      "Schema markup, meta tags, OpenGraph for social sharing. Optimized site structure for organic ranking.",
    label: "SEO",
    image: "/files/seo.webp",
  },
  {
    id: 6,
    title: "UI/UX Design & Prototyping",
    description:
      "Craft intuitive user interfaces and engaging experiences. Wireframes, Figma prototypes, and interactive design systems.",
    label: "Design",
    image: "/files/uiux.webp",
  },
  {
    id: 7,
    title: "Store Migration & Replatforming",
    description:
      "Seamlessly move your store to Shopify with zero data loss. Product, customer, and order migrations with SEO preservation and custom integration handling.",
    label: "Migration",
    image: "/files/migration.webp",
  },
  {
    id: 8,
    title: "E-commerce Features & App Integration",
    description:
      "Custom Shopify apps, subscriptions, product bundles, dynamic pricing, and automated workflows.",
    label: "E-commerce Apps",
    image: "/files/apps.webp",
  },
  {
    id: 9,
    title: "Web Security & Data Protection",
    description:
      "SSL, secure authentication, GDPR compliance, and protection against common web vulnerabilities.",
    label: "Security",
    image: "/files/security.webp",
  },
  {
    id: 10,
    title: "Analytics & Conversion Optimization",
    description:
      "Google Analytics, GTM setup, event tracking, A/B testing, and conversion rate improvements.",
    label: "Analytics",
    image: "/files/analytics.webp",
  },
  {
    id: 11,
    title: "Progressive Web Apps (PWA)",
    description:
      "Installable web apps with offline functionality, push notifications, and fast mobile-first experiences.",
    label: "PWA",
    image: "/files/pwa.webp",
  },
  {
    id: 12,
    title: "Web Maintenance & Support",
    description:
      "Regular updates, bug fixes, backups, performance monitoring, and version control.",
    label: "Support",
    image: "/files/maintenance.webp",
  },
];
