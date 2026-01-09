import { FiExternalLink } from "react-icons/fi";
import { Link } from "react-router-dom";
import clsx from "clsx";

type BlogCardProps = {
  blog: any;
  className?: string;
  excerptLength?: number;
};

const tagColors = [
  "text-pink-600",
  "text-amber-600",
  "text-emerald-600",
  "text-sky-600",
  "text-purple-600",
  "text-orange-600",
  "text-red-600",
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
        "relative flex flex-col bg-[var(--card)] backdrop-blur-md border border-white/20 shadow-md rounded-2xl overflow-hidden ",
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

      <div className="pt-2 px-4 pb-4 flex flex-col gap-2 flex-grow">
        <div className="flex flex-col justify-between flex-grow gap-0">
          <div className="flex items-center justify-between w-full">
            <Link
              to={`/blogs/${blog.slug}`}
              className="text-lg md:text-2xl font-semibold text-[var(--foreground)] hover:text-[#d4af37] transition"
            >
              {blog.title}
            </Link>
            <Link
              to={`/blogs/${blog.slug}`}
              className="text-[var(--foreground)] hover:text-[#d4af37]"
              aria-label={`Read ${blog.title}`}
            >
              <FiExternalLink size={20} />
            </Link>
          </div>

          {shortDesc && (
            <p className="text-[var(--foreground)] text-sm line-clamp-2">
              {shortDesc}...
            </p>
          )}
        </div>

        {tags && (
          <div className="flex flex-wrap gap-2">
            {tags.slice(0, 3).map((tag: string, index: number) => {
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
