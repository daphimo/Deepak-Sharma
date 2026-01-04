import { Link } from "react-router-dom";

type ProjectMiniCardProps = {
  project: {
    id?: string;
    slug: string;
    name: string;
    image?: string | null;
    desktop_image?: string | null;
    mobile_image?: string | null;
    date?: string | null;
  };
};

export function ProjectMiniCard({ project }: ProjectMiniCardProps) {
  const thumb = project.image || project.desktop_image || project.mobile_image || "/files/fallback_desktop.png";
  return (
    <Link
      to={`/projects/${project.slug}`}
      className="flex gap-3 rounded-xl border border-[color:var(--border)] bg-[var(--card)] p-3 hover:border-[color:var(--primary)]/60 transition shadow-sm"
    >
      <div className="h-auto w-16 rounded-lg overflow-hidden bg-[var(--background)] border border-[color:var(--border)] shrink-0">
        <img src={thumb} alt={project.name} className="h-full w-full object-contain" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-[var(--foreground)] line-clamp-2">{project.name}</p>
        {project.date && (
          <p className="text-xs text-[var(--muted-foreground)] mt-1">
            {new Date(project.date).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
          </p>
        )}
      </div>
    </Link>
  );
}
