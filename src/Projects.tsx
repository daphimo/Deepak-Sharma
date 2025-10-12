import { FiExternalLink } from "react-icons/fi";
import { Link } from "react-router-dom";
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
  const projects = [
    {
      title: "Skills Bright",
      img: "/files/projects/skillsbright.webp",
      desc: "Trusted HR consultancy offering recruitment, payroll, compliance, and professional training. Affordable, result-driven solutions to grow your business.",
      link: "https://www.skillsbright.com/",
      caseStudy: "https://www.skillsbright.com/",
      tech: ["Tailwind CSS", "HTML", "React", "Vite", "Js", "Vercel"],
    },
    {
      title: "Bastion Research",
      img: "/files/projects/bastionresearch.webp",
      desc: "Bastion Research is an India-focused equity research unit providing end-to-end independent research services designed to help fund managers, institutions, and family offices make informed investment decisions.",
      link: "http://dev.bastionresearch.in/",
      caseStudy: "http://dev.bastionresearch.in/",
      tech: ["Tailwind CSS", "HTML", "React", "Vite", "Supabase", "Framer-motion", "Tiptap"],
    },
    {
      title: "Diksha Khanna",
      img: "/files/projects/dikshakhanna.webp",
      desc: "We are a label of women’s premium pret in luxe Indian fabrics and fine craftsmanship. We create separates with unique design detail, quality, style, fit and comfort. Our brand stands for thoughtful, timeless design.",
      link: "https://dikshakhanna.in/",
      caseStudy: "https://dikshakhanna.in/",
      tech: ["Shopify", "HTML", "Liquid", "Js"],
    },
    {
      title: "Huda Bar",
      img: "/files/projects/hudabar.webp",
      desc: "Nutritious and delicious foods, handmade with care, joy and hope. Small-batch, fresh. Ethically sourced, local, input-free ingredients. Packaged sustainably.",
      link: "https://www.thehudabar.com/",
      caseStudy: "https://www.thehudabar.com/",
      tech: ["Shopify", "HTML", "Liquid", "Js"],
    },
  ];

  return (
    <div className="mt-20 w-full text-white max-w-7xl mx-auto py-20 px-4">
      {/* Header */}
      <div className="mb-16">
        <h2 className="text-4xl md:text-5xl font-bold mb-4">
          Let’s Explore Featured Projects
        </h2>
        <p className="text-gray-300 text-lg max-w-2xl leading-relaxed">
          Discover a curated collection of impactful projects that blend
          strategy, creativity, and technology. Each piece embodies our
          dedication to purposeful design and problem-solving — transforming
          ideas into meaningful digital experiences.
        </p>
      </div>

      {/* Simplified Gallery: 2 grid on desktop, 1 on mobile */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {projects.map((project, index) => {
          // Check if it's the last project AND total count is odd
          const isLastOdd =
            projects.length % 2 !== 0 && index === projects.length - 1;
          return (
            <div key={index} className={isLastOdd ? "md:col-span-2" : ""}>
              <GalleryCard project={project} />
            </div>
          );
        })}
      </div>
       <div className="text-center">
        <Link
          to="/projects"
          className="inline-block px-6 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-xl text-white transition-all duration-300"
        >
          View All Projects
        </Link>
      </div>
    </div>
  );
}

// ✅ Simplified GalleryCard
function GalleryCard({ project }: { project: any }) {
  return (
    <div className="relative flex flex-col bg-white/10 backdrop-blur-md border border-white/20 shadow-lg rounded-2xl overflow-hidden transition-transform duration-500">
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
        />
      </a>

      {/* Title & External Link */}
      <div className="flex items-center justify-between w-full px-5 mt-4">
        <a
          href={project.caseStudy}
          target="_blank"
          rel="noopener noreferrer"
          className="text-2xl font-semibold hover:text-indigo-400 transition-colors"
        >
          {project.title}
        </a>
        {project.link && (
          <a
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-300 hover:text-indigo-400 transition-colors"
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
