import { FiExternalLink } from "react-icons/fi";
import { Link } from "react-router-dom";
import clsx from "clsx";

type BlogCardProps = {
  blog: any;
  className?: string;
  excerptLength?: number;
};

const tagColors = [
  "text-pink-400",
  "text-yellow-400",
  "text-green-400",
  "text-blue-400",
  "text-purple-400",
  "text-orange-400",
  "text-teal-400",
  "text-red-400",
];

export function serializeRichContentToText(value?: string | null): string {
  if (!value) return "";
  const trimmed = value.trim();

  const stripMediaFromHtml = (html: string) => {
    if (typeof window === "undefined") {
      return html.replace(/!\[[^\]]*]\([^)]+\)/g, "").replace(/<img[^>]*>/gi, "");
    }
    const div = document.createElement("div");
    div.innerHTML = html;
    div.querySelectorAll("img, video, picture, source, iframe").forEach((node) => node.remove());
    div.querySelectorAll("style, script").forEach((node) => node.remove());
    return div.textContent || "";
  };

  const extractJson = () => {
    if (!trimmed.includes("[")) return trimmed;
    const start = trimmed.indexOf("[");
    const end = trimmed.lastIndexOf("]");
    if (start === -1 || end === -1) return trimmed;
    return trimmed.slice(start, end + 1);
  };

  const maybeJson = extractJson();
  try {
    const parsed = JSON.parse(maybeJson);
    if (!Array.isArray(parsed)) return stripMediaFromHtml(trimmed);
    const renderText = (child: any) => child.text ?? "";
    const renderNode = (node: any): string => {
      const children = (node.children || []).map(renderText).join("");
      return children;
    };
    return parsed.map(renderNode).join(" ");
  } catch {
    return stripMediaFromHtml(trimmed.replace(/!\[[^\]]*]\([^)]+\)/g, ""));
  }
}

export function BlogCard({ blog, className = "", excerptLength = 120 }: BlogCardProps) {
  const excerptSource = serializeRichContentToText(blog?.content) || "";
  const shortDesc = excerptSource.slice(0, excerptLength).trimEnd();
  const tags =
    blog?.tags &&
    (Array.isArray(blog.tags)
      ? blog.tags
      : String(blog.tags)
          .split(",")
          .map((tag: string) => tag.trim())
          .filter(Boolean));

  return (
    <div
      className={clsx(
        "w-full flex flex-col bg-[var(--card)] border border-[color:var(--border)] shadow-lg rounded-2xl overflow-hidden transition-transform",
        className
      )}
    >
      <Link to={`/blogs/${blog.slug}`} className="w-full">
        <img
          src={blog.image || "/files/fallback_desktop.png"}
          alt={blog.title}
          className="w-full h-full object-contain"
        />
      </Link>

      <div className="flex flex-col justify-between flex-grow">
        <div>
          <div className="flex items-center justify-between w-full px-5 mt-4">
            <Link
              to={`/blogs/${blog.slug}`}
              className="text-lg md:text-2xl font-semibold text-[var(--foreground)] hover:text-[#d4af37] transition"
            >
              {blog.title}
            </Link>
            <Link
              to={`/blogs/${blog.slug}`}
              className="text-[var(--muted-foreground)] hover:text-[#d4af37]"
              aria-label={`Read ${blog.title}`}
            >
              <FiExternalLink size={20} />
            </Link>
          </div>

          {shortDesc && (
            <p className="text-[var(--muted-foreground)] text-sm px-5 mt-2 line-clamp-2">
              {shortDesc}...
            </p>
          )}
        </div>

        {blog?.created_at && (
          <div className="px-5 text-xs text-[var(--muted-foreground)] mt-2">
            {new Date(blog.created_at).toLocaleDateString("en-US", {
              month: "short",
              year: "numeric",
            })}
          </div>
        )}

        {tags && (
          <div className="flex flex-wrap gap-2 px-5 py-4">
            {tags.map((tag: string, index: number) => {
              const color = tagColors[index % tagColors.length];
              return (
                <span
                  key={`${tag}-${index}`}
                  className={`${color} text-xs font-semibold uppercase tracking-wide`}
                >
                  #{String(tag).trim()}
                </span>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
