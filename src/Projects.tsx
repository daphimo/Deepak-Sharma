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
  const projects = [
    {
      title: "Dummy 1",
      img: "/files/theme.webp",
      desc: "A creative project showcasing design and innovation.",
      link: "https://dummy.com/",
      caseStudy: "https://dummy.com/",
      tech: ["Tailwind CSS", "HTML", "React", "Next.js"],
    },
    {
      title: "Dummy 2",
      img: "/files/responsive.webp",
      desc: "A creative project showcasing design and innovation.",
      link: "https://dummy.com/",
      caseStudy: "https://dummy.com/",
      tech: ["Tailwind CSS", "HTML", "React", "Next.js"],
    },
    {
      title: "Dummy 3",
      img: "/files/uiux.webp",
      desc: "A creative project showcasing design and innovation.",
      link: "https://dummy.com/",
      caseStudy: "https://dummy.com/",
      tech: ["Tailwind CSS", "HTML", "React", "Next.js"],
    },
    {
      title: "Dummy 4",
      img: "/files/analytics.webp",
      desc: "A creative project showcasing design and innovation.",
      link: "https://dummy.com/",
      caseStudy: "https://dummy.com/",
      tech: ["Tailwind CSS", "HTML", "React", "Next.js"],
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
        className="w-full"
      >
        <img
          src={project.img}
          alt={project.title}
          className="w-full h-64 object-cover"
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
