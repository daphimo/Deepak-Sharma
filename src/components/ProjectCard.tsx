import { FiExternalLink } from "react-icons/fi";
import { Link } from "react-router-dom";

export type ProjectCardData = {
  id: string;
  name: string;
  slug: string;
  image?: string | null;
  desktop_image?: string | null;
  mobile_image?: string | null;
  project_url?: string | null;
  category?: string | null;
  subcategory?: string | null;
  tags?: string[] | null;
};

const defaultTagColors = [
  "text-pink-400",
  "text-yellow-400",
  "text-green-400",
  "text-blue-400",
  "text-purple-400",
  "text-orange-400",
  "text-teal-400",
  "text-red-400",
];

type ProjectCardProps = {
  project: ProjectCardData;
  tagColors?: string[];
  className?: string;
};

export function ProjectCard({ project, tagColors = defaultTagColors, className = "" }: ProjectCardProps) {
  const cover = project.image || project.desktop_image || "/files/fallback_desktop.png";
  const description = project.subcategory || project.category || "";
  const tags = project.tags || [];

  return (
    <div
      className={`relative flex flex-col bg-white/10 backdrop-blur-md border border-white/20 shadow-md rounded-2xl overflow-hidden ${className}`}
    >
      <Link to={`/projects/${project.slug}`} className="w-full">
        <img src={cover} alt={project.name} className="w-full h-full object-contain" loading="lazy" />
      </Link>

      <div className="flex items-center justify-between w-full px-5 mt-4">
        <Link to={`/projects/${project.slug}`} className="text-2xl font-semibold text-white hover:text-indigo-400 transition-colors">
          {project.name}
        </Link>
        {project.project_url && (
          <a
            href={project.project_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-300 hover:text-indigo-400 transition-colors"
            aria-label={`Visit ${project.name}`}
          >
            <FiExternalLink size={22} />
          </a>
        )}
      </div>

      <p className="text-gray-300 text-sm px-5 mt-2 line-clamp-2">{description}</p>

      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2 px-5 py-4">
          {tags.map((t: string, i: number) => (
            <span key={t + i} className={`${tagColors[i % tagColors.length]} text-xs font-semibold uppercase tracking-wide`}>
              #{t}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
