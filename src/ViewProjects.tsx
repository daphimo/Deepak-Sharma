import { useEffect, useRef, useState } from "react";
import { FiExternalLink } from "react-icons/fi";

// 🎨 Fixed color palette for tech tags
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

export default function Infinite() {
  const filters = ["All", "Under Employer", "Personal"];
  const [selectedFilter, setSelectedFilter] = useState("All");

  // ✅ Track position and width of the active tab
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    const activeTab = tabRefs.current[filters.indexOf(selectedFilter)];
    if (activeTab) {
      setIndicatorStyle({
        left: activeTab.offsetLeft,
        width: activeTab.offsetWidth,
      });
    }
  }, [selectedFilter, filters]);

  const projects = [
    {
      title: "Skills Bright",
      img: "/files/projects/skillsbright.webp",
      desc: "Trusted HR consultancy offering recruitment, payroll, compliance, and professional training. Affordable, result-driven solutions to grow your business.",
      link: "https://www.skillsbright.com/",
      caseStudy: "https://www.skillsbright.com/",
      tech: ["Tailwind CSS", "HTML", "React", "Vite", "Js", "Vercel"],
      category: "Under Employer",
    },
    {
      title: "Bastion Research",
      img: "/files/projects/bastionresearch.webp",
      desc: "India-focused equity research unit helping institutions and family offices make informed investment decisions.",
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
      category: "Under Employer",
    },
    {
      title: "Diksha Khanna",
      img: "/files/projects/dikshakhanna.webp",
      desc: "Luxury women’s fashion label with Indian fabrics, thoughtful design, and timeless craftsmanship.",
      link: "https://dikshakhanna.in/",
      caseStudy: "https://dikshakhanna.in/",
      tech: ["Shopify", "HTML", "Liquid", "Js"],
      category: "Under Employer",
    },
    {
      title: "Huda Bar",
      img: "/files/projects/hudabar.webp",
      desc: "Nutritious, small-batch foods made with local, ethical ingredients — sustainably packaged.",
      link: "https://www.thehudabar.com/",
      caseStudy: "https://www.thehudabar.com/",
      tech: ["Shopify", "HTML", "Liquid", "Js"],
      category: "Under Employer",
    },
    {
      title: "My Creative Portfolio",
      img: "/files/projects/portfolio.webp",
      desc: "A modern personal portfolio website showcasing projects, animations, and smooth transitions built with React and Tailwind.",
      link: "https://example.com/",
      caseStudy: "https://example.com/",
      tech: ["React", "Vite", "Tailwind", "Framer Motion"],
      category: "Personal",
    },
  ];

  const filteredProjects =
    selectedFilter === "All"
      ? projects
      : projects.filter((p) => p.category === selectedFilter);

  return (
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

      {/* Filter Tabs (Desktop) */}
      <div className="hidden md:flex relative w-fit border border-white/20 rounded-full backdrop-blur-md bg-white/5 mb-12">
        {/* Glass Slider */}
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

      {/* Filter Dropdown (Mobile) */}
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

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {filteredProjects.map((project, index) => {
          const isLastOdd =
            filteredProjects.length % 2 !== 0 &&
            index === filteredProjects.length - 1;
          return (
            <div key={index} className={isLastOdd ? "md:col-span-2" : ""}>
              <GalleryCard project={project} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

function GalleryCard({ project }: { project: any }) {
  return (
    <div className="relative flex flex-col bg-white/10 backdrop-blur-md border border-white/20 shadow-md rounded-2xl overflow-hidden">
      {/* Image */}
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

      {/* Title & Link */}
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

      {/* Description */}
      <p className="text-gray-300 text-sm px-5 mt-2">{project.desc}</p>

      {/* Tech Tags */}
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
