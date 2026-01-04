import { Link } from "react-router-dom";

type BlogMiniCardProps = {
  blog: {
    id?: string;
    slug: string;
    title: string;
    image?: string | null;
    created_at?: string;
  };
};

export function BlogMiniCard({ blog }: BlogMiniCardProps) {
  return (
    <Link
      to={`/blogs/${blog.slug}`}
      className="flex gap-3 rounded-xl border border-[color:var(--border)] bg-[var(--card)] p-3 hover:border-[color:var(--primary)]/60 transition shadow-sm"
    >
      <div className="h-auto w-16 rounded-lg overflow-hidden bg-[var(--background)] border border-[color:var(--border)] shrink-0">
        <img
          src={blog.image || "/files/fallback_desktop.png"}
          alt={blog.title}
          className="h-full w-full object-contain"
        />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-[var(--foreground)] line-clamp-2">{blog.title}</p>
        {blog.created_at && (
          <p className="text-xs text-[var(--muted-foreground)] mt-1">
            {new Date(blog.created_at).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
          </p>
        )}
      </div>
    </Link>
  );
}
