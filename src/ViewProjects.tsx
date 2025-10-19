import { useEffect, useRef, useState } from "react";
import { FiExternalLink } from "react-icons/fi";
import Contact from "./Contact";

// Fixed tech colors
const techColors = [
  "text-pink-400",
  "text-yellow-400",
  "text-green-400",
  "text-blue-400",
  "text-purple-400",
  "text-orange-400",
  "text-teal-400",
  "text-red-400",
];

// Filters moved outside the component to avoid re-creation every render
const filters = ["All", "Personal", "Under Employer"];

export default function Infinite() {
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // ✅ Fixed useEffect: removed 'filters' from dependency array
  useEffect(() => {
    const activeTab = tabRefs.current[filters.indexOf(selectedFilter)];
    if (activeTab) {
      setIndicatorStyle({
        left: activeTab.offsetLeft,
        width: activeTab.offsetWidth,
      });
    }
  }, [selectedFilter]);

  // Project data
  const projects = [
    {
      title: "Skills Bright",
      img: "/files/projects/skillsbright.webp",
      desc: "Trusted HR consultancy offering recruitment, payroll, compliance, and professional training. Affordable, result-driven solutions to grow your business.",
      link: "https://www.skillsbright.com/",
      caseStudy: "https://www.skillsbright.com/",
      tech: ["Tailwind CSS", "HTML", "React", "Vite", "Js", "Vercel"],
      category: "Personal",
    },
    {
      title: "Bastion Research",
      img: "/files/projects/bastionresearch.webp",
      desc: "Bastion Research is an India-focused equity research unit providing end-to-end independent research services designed to help fund managers, institutions, and family offices make informed investment decisions.",
      link: "http://dev.bastionresearch.in/",
      caseStudy: "http://dev.bastionresearch.in/",
      tech: [
        "Tailwind CSS",
        "HTML",
        "React",
        "Vite",
        "Supabase",
        "Framer-motion",
        "Tiptap",
      ],
      category: "Personal",
    },
    {
      title: "Diksha Khanna",
      img: "/files/projects/dikshakhanna.webp",
      desc: "We are a label of women’s premium pret in luxe Indian fabrics and fine craftsmanship. We create separates with unique design detail, quality, style, fit and comfort. Our brand stands for thoughtful, timeless design.",
      link: "https://dikshakhanna.in/",
      caseStudy: "https://dikshakhanna.in/",
      tech: ["Shopify", "HTML", "Liquid", "Js", "JSON", "Schema", "CSS"],
      category: "Personal",
    },
    {
      title: "Huda Bar",
      img: "/files/projects/hudabar.webp",
      desc: "Nutritious and delicious foods, handmade with care, joy and hope. Small-batch, fresh. Ethically sourced, local, input-free ingredients. Packaged sustainably.",
      link: "https://www.thehudabar.com/",
      caseStudy: "https://www.thehudabar.com/",
      tech: ["Shopify", "HTML", "Liquid", "Js", "JSON", "Schema", "CSS"],
      category: "Personal",
    },
    {
      title: "Handme",
      img: "/files/projects/handme.webp",
      desc: "Handme offers effortlessly stylish, comfortable fashion for modern women. Look glamorous and feel great, every day.",
      link: "https://handme.co.in/",
      caseStudy: "https://handme.co.in/",
      tech: ["Shopify", "HTML5", "Liquid", "Js", "CSS3"],
      category: "Personal",
    },
    {
      title: "Amara Beauty",
      img: "/files/projects/amarabeauty.webp",
      desc: "As Amara Beauty & Care, we are here to provide your skin with the care and attention it deserves. Pamper yourself and discover your beauty with our natural and effective skincare products.",
      link: "https://amarabeautycare.com/",
      caseStudy: "https://amarabeautycare.com/",
      tech: ["Shopify", "HTML", "Liquid", "Js", "JSON", "Schema", "CSS"],
      category: "Under Employer",
    },
    {
      title: "American Tile Depot",
      img: "/files/projects/americantiledepot.webp",
      desc: "Shop a great collection of flooring, porcelain tiles, natural stone, mosaics, and more at American Tile Depot. Find high-quality tiles online for walls, floors, and backsplashes, with samples available for easy selection.",
      link: "https://www.americantiledepot.com",
      caseStudy: "https://www.americantiledepot.com",
      tech: ["Shopify", "HTML", "Liquid", "Js", "JSON", "Schema", "CSS"],
      category: "Under Employer",
    },
    {
      title: "Après Cookies",
      img: "/files/projects/aprecookie.webp",
      desc: "Après Cookies delivers warm, 6 oz gourmet cookies in Aspen, CO. Handmade in a local ghost kitchen using premium ingredients. Perfect for après ski, late nights, or gifting. Available Thursday to Saturday. Order now for delicious, fresh-baked cookie delivery!",
      link: "https://aprescookies.com/",
      caseStudy: "https://aprescookies.com/",
      tech: [
        "Shopify",
        "HTML",
        "Liquid",
        "Js",
        "JSON",
        "Schema",
        "Tailwind CSS",
      ],
      category: "Under Employer",
    },
    {
      title: "Arzley | Lingerie and more",
      img: "/files/projects/arzley.webp",
      desc: "Shop the best yoga wear & accessories for yoga and working out. Wear-tested by yogis for the best fit. Shop celeb-approved yoga pants, workout tights, leggings, capris & lounge for women & men.",
      link: "https://www.arzley.com",
      caseStudy: "https://www.arzley.com",
      tech: ["Shopify", "HTML", "Liquid", "Js", "JSON", "Schema", "CSS"],
      category: "Under Employer",
    },
    {
      title: "EYWA Milano Natural Skincare | EYWA Milano",
      img: "/files/projects/eywabeauty.webp",
      desc: "EYWA Milano, Made in Italy skincare with certified natural ingredients and high-quality sustainable processes. Ethics, beauty, and transparency. Benefit Corp.",
      link: "https://www.eywabeauty.com/en-in",
      caseStudy: "https://www.eywabeauty.com/en-in",
      tech: ["Shopify", "HTML", "Liquid", "Js", "JSON", "Schema", "CSS"],
      category: "Under Employer",
    },
    {
      title: "GenOne Luthier Services Guitar Plans",
      img: "/files/projects/genonegiter.webp",
      desc: "Acoustic & classical plans, ukulele, electrical guitar, mandolin plans and tool plans are available in digital format for easy printing and use on your device.",
      link: "https://genone-luthier-supply.com",
      caseStudy: "https://genone-luthier-supply.com",
      tech: ["Shopify", "HTML", "Liquid", "Js", "JSON", "Schema", "CSS"],
      category: "Under Employer",
    },
    {
      title: "Good Sun",
      img: "/files/projects/goodsun.webp",
      desc: "Refillable sunscreen! Protecting your skin and the planet, one refill at a time. ",
      link: "https://getsomegoodsun.com/",
      caseStudy: "https://getsomegoodsun.com/",
      tech: ["Shopify", "HTML", "Liquid", "Js", "JSON", "Schema", "CSS"],
      category: "Under Employer",
    },
    {
      title:
        "Security and Self-Defense Products | The Home Security Superstore",
      img: "/files/projects/homesecurity.webp",
      desc: "Secure your home and protect your loved ones with the top-rated self-defense tools from The Home Security Superstore. Explore our wide selection of surveillance cameras, alarms, pepper sprays, stun guns, batons and more. Shop now for peace of mind and great prices!",
      link: "https://www.thehomesecuritysuperstore.com",
      caseStudy: "https://www.thehomesecuritysuperstore.com",
      tech: ["Shopify", "HTML", "Liquid", "Js", "JSON", "Schema", "CSS"],
      category: "Under Employer",
    },
    {
      title: "House of Brims: Accessories with Meaning and Edge",
      img: "/files/projects/houseofbrims.webp",
      desc: "To the brim and beyond. Accessories that endure. Sign up for 10% off your first order.",
      link: "https://www.houseofbrims.com",
      caseStudy: "https://www.houseofbrims.com",
      tech: ["Shopify", "HTML", "Liquid", "Js", "JSON", "Schema", "CSS"],
      category: "Under Employer",
    },
    {
      title:
        "Leinwand's Online | Shop Online Fashion, Clothing For Men, Women & Kid",
      img: "/files/projects/leinwands.webp",
      desc: "First in Style, First in Quality, Since 1935. Discover the latest fashion trends in apparel and footwear. The premier place to shop in Southeast North Carolina for all your clothing needs and much more.",
      link: "https://www.leinwands.com",
      caseStudy: "https://www.leinwands.com",
      tech: ["Shopify", "HTML", "Liquid", "Js", "JSON", "Schema", "CSS"],
      category: "Under Employer",
    },
    // {
    //   title: "Pluno",
    //   img: "/files/projects/pluno.webp",
    //   desc: "sample",
    //   link: "https://plunopaper.com",
    //   caseStudy: "https://plunopaper.com",
    //   tech: ["Shopify", "HTML", "Liquid", "Js", "JSON", "Schema", "CSS"],
    //   category: "Under Employer",
    // },
    {
      title: "CamuComplete™ - Official Site",
      img: "/files/projects/selvetics.webp",
      desc: "An all-in-one supplement packed with raw vitamin C from superfoods camu camu and acerola, polyphenols, and 13 essential vitamins and minerals to revitalize your body while maintaining a daily mental and physical wellbeing. (Antioxidant, immune booster, collagen promoter, metabolic control, gut support, brain health).",
      link: "https://www.selvatics.us/",
      caseStudy: "https://www.selvatics.us/",
      tech: ["Shopify", "HTML", "Liquid", "Js", "JSON", "Schema", "CSS"],
      category: "Under Employer",
    },
    {
      title: "The Island Rythm",
      img: "/files/projects/theislandrythm.webp",
      desc: "Discover vibrant island-inspired fashion at The Island Rhythm. Shop unique apparel that blends tropical vibes with modern style – perfect for beach days, festivals, and everyday wear.  ",
      link: "https://theislandrhythm.com",
      caseStudy: "https://theislandrhythm.com",
      tech: ["Shopify", "HTML", "Liquid", "Js", "JSON", "Schema", "CSS"],
      category: "Under Employer",
    },
    {
      title: "The Maga Offers",
      img: "/files/projects/themagaoffers.webp",
      desc: "The Maga Offers",
      link: "https://themagaoffers.com",
      caseStudy: "https://themagaoffers.com",
      tech: ["Shopify", "HTML", "Liquid", "Js", "JSON", "Schema", "CSS"],
      category: "Under Employer",
    },
  ];
  const filteredProjects =
    selectedFilter === "All"
      ? projects
      : projects.filter((p) => p.category === selectedFilter);

  return (
    <>
      <div className="mt-20 w-full text-white max-w-7xl mx-auto py-20 px-4 bg-transparent">
        {/* Header */}
        <div className="mb-10 text-left">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Let’s Explore Featured Projects
          </h2>
          <p className="text-gray-300 text-lg max-w-2xl leading-relaxed">
            Discover impactful projects that blend creativity, technology, and
            strategy — crafted for both employers and personal growth.
          </p>
        </div>

        {/* Desktop Filter Tabs */}
        <div className="hidden md:flex relative w-fit border border-white/20 rounded-full backdrop-blur-md bg-white/5 mb-12">
          <div
            className="absolute top-0 h-full bg-white/20 backdrop-blur-xl rounded-full transition-all duration-500"
            style={{
              left: `${indicatorStyle.left}px`,
              width: `${indicatorStyle.width}px`,
            }}
          />
          {filters.map((filter, index) => (
            <button
              key={filter}
              ref={(el) => {
                tabRefs.current[index] = el;
              }}
              onClick={() => setSelectedFilter(filter)}
              className={`relative z-10 px-8 py-2 text-sm font-medium cursor-pointer ${
                selectedFilter === filter ? "text-white" : "text-gray-300"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Mobile Filter */}
        <div className="md:hidden mb-10">
          <select
            value={selectedFilter}
            onChange={(e) => setSelectedFilter(e.target.value)}
            className="bg-white/10 text-white border border-white/20 rounded-lg px-4 py-2 backdrop-blur-md w-full cursor-pointer"
          >
            {filters.map((filter) => (
              <option
                key={filter}
                value={filter}
                className="bg-gray-800 text-white"
              >
                {filter}
              </option>
            ))}
          </select>
        </div>

        {/* Projects Grid */}
        {/* Projects Layout (Flex for proper centering) */}
        <div className="flex flex-wrap justify-center gap-10">
          {filteredProjects.map((project, index) => (
            <div
              key={project.title + index}
              className="w-full md:w-[calc(50%-1.25rem)] max-w-[600px]"
            >
              <GalleryCard project={project} />
            </div>
          ))}
        </div>
      </div>

      <Contact />
    </>
  );
}

function GalleryCard({ project }: { project: any }) {
  return (
    <div className="relative flex flex-col bg-white/10 backdrop-blur-md border border-white/20 shadow-md rounded-2xl overflow-hidden">
      <a
        href={project.caseStudy}
        target="_blank"
        rel="noopener noreferrer"
        className="w-full aspect-video"
      >
        <img
          src={project.img}
          alt={project.title}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </a>

      <div className="flex items-center justify-between w-full px-5 mt-4">
        <a
          href={project.caseStudy}
          target="_blank"
          rel="noopener noreferrer"
          className="text-2xl font-semibold text-white"
        >
          {project.title}
        </a>
        {project.link && (
          <a
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-300"
            aria-label={`Visit ${project.title}`}
          >
            <FiExternalLink size={22} />
          </a>
        )}
      </div>

      <p className="text-gray-300 text-sm px-5 mt-2 line-clamp-2">
        {project.desc}
      </p>

      <div className="flex flex-wrap gap-2 px-5 py-4">
        {project.tech.map((t: string, i: number) => (
          <span
            key={i}
            className={`${
              techColors[i % techColors.length]
            } text-xs font-semibold uppercase tracking-wide`}
          >
            #{t}
          </span>
        ))}
      </div>
    </div>
  );
}
