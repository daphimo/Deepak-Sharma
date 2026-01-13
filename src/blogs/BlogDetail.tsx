import { useEffect, useMemo, useState } from "react";
import { FiArrowLeft, FiClock, FiCalendar, FiTag, FiUser } from "react-icons/fi";
import { Link, useParams } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import Prism from "prismjs";
import "prismjs/themes/prism-tomorrow.css";
import "../styles/richtext.css";
import { BlogMiniCard } from "../components/BlogMiniCard";

type Blog = {
  id: string;
  title: string;
  slug: string;
  content: string;
  image?: string | null;
  video?: string | null;
  created_at: string;
  tags?: string[] | string | null;
  author?: string | null;
  category?: string | null;
  subcategory?: string | null;
  status?: string | null;
  date?: string | null;
  reading_time?: string | null;
  seo_title?: string | null;
  seo_description?: string | null;
};

const mapBlogFields = (item: any): Blog => ({
  ...(item as Blog),
  image: (item as any).cover_image || (item as any).image,
  video: (item as any).video_embed || (item as any).video,
  tags: (item as any).blog_tags || (item as any).tags,
});

const tagColors = [
  "text-pink-600 border-pink-500/60",
  "text-amber-600 border-amber-500/60",
  "text-emerald-600 border-emerald-500/60",
  "text-sky-600 border-sky-500/60",
  "text-purple-600 border-purple-500/60",
  "text-orange-600 border-orange-500/60",
  "text-red-600 border-red-500/60",
];

function updateMeta(title?: string | null, description?: string | null) {
  if (title) document.title = title;
  if (description) {
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("name", "description");
      document.head.appendChild(meta);
    }
    meta.setAttribute("content", description);
  }
}

function escapeHtml(input: string) {
  return input.replace(/[&<>"']/g, (char) => {
    const map: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;",
    };
    return map[char] || char;
  });
}

function serializeRichContent(value?: string | null): string {
  if (!value) return "";
  const trimmed = value.trim();

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
    if (!Array.isArray(parsed)) return value;

    const renderText = (child: any) => {
      let text = escapeHtml(child.text ?? "");
      if (child.code) text = `<code>${text}</code>`;
      if (child.bold) text = `<strong>${text}</strong>`;
      if (child.italic) text = `<em>${text}</em>`;
      if (child.underline) text = `<u>${text}</u>`;
      return text;
    };

    const renderChildren = (children: any[] = []) => children.map(renderText).join("");

    const renderNode = (node: any): string => {
      const children = renderChildren(node.children || []);
      switch (node.type) {
        case "h1":
          return `<h1>${children}</h1>`;
        case "h2":
          return `<h2>${children}</h2>`;
        case "h3":
          return `<h3>${children}</h3>`;
        case "blockquote":
          return `<blockquote>${children}</blockquote>`;
        case "p":
        default:
          return `<p>${children}</p>`;
      }
    };

    return parsed.map(renderNode).join("");
  } catch {
    return value;
  }
}

export default function BlogDetail() {
  const { slug } = useParams();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [related, setRelated] = useState<Blog[]>([]);
  const [prismReady, setPrismReady] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const parsedTags = useMemo(() => {
    if (!blog?.tags) return [];
    return Array.isArray(blog.tags)
      ? blog.tags
      : String(blog.tags)
          .split(",")
          .map((tag) => tag.trim());
  }, [blog]);

  useEffect(() => {
    const loadPrismLanguages = async () => {
      await Promise.all([
        import("prismjs/components/prism-javascript"),
        import("prismjs/components/prism-jsx"),
        import("prismjs/components/prism-css"),
        import("prismjs/components/prism-markup"),
      ]);
      setPrismReady(true);
    };

    const fetchBlogAndRelated = async () => {
      try {
        if (!slug) throw new Error("Blog slug is missing");

        const { data, error } = await supabase.from("blog").select("*").eq("slug", slug).single();
        if (error) throw error;
        if (!data) throw new Error("Blog not found");

        setBlog(mapBlogFields(data));

        const { data: relatedData, error: relatedError } = await supabase
          .from("blog")
          .select("id, title, slug, content, image, created_at, video, tags")
          .order("created_at", { ascending: false })
          .limit(4);

        if (!relatedError) {
          setRelated(
            (relatedData || [])
              .map(mapBlogFields)
              .filter((item) => item.slug !== slug)
          );
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load blog");
      } finally {
        setLoading(false);
      }
    };

    fetchBlogAndRelated();
    loadPrismLanguages();
  }, [slug]);

  useEffect(() => {
    if (blog) {
      updateMeta(blog.seo_title || blog.title, blog.seo_description || undefined);
    }
  }, [blog]);

  const contentHtml = useMemo(() => serializeRichContent(blog?.content), [blog?.content]);

  useEffect(() => {
    if (!prismReady) return;
    Prism.highlightAll();
  }, [contentHtml, prismReady]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-[var(--foreground)]">
        Loading blog...
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center text-[var(--foreground)] px-4 space-y-4">
        <p>{error || "Blog not found."}</p>
        <Link
          to="/blogs"
          className="inline-flex items-center font-bold gap-2 text-sm text-[var(--background)] bg-[#d4af37] px-4 py-2 rounded-xl transition-all shadow-md hover:shadow-lg active:scale-[0.98]"
        >
          Back to blogs
        </Link>
      </div>
    );
  }

  return (
    <div className="relative z-10 max-w-7xl mx-auto px-4 pt-28 pb-12 text-[var(--foreground)] min-h-screen">
      <div className="mb-6 flex items-center justify-between">
        <Link
          to="/blogs"
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#d4af37] hover:underline"
        >
          <FiArrowLeft /> Back to blogs
        </Link>
       
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-[70%] space-y-6 relative bg-[var(--card)] backdrop-blur-md shadow-md rounded-2xl p-6">
          {blog.image && <img src={blog.image} alt={blog.title} className="w-full h-80 object-cover rounded-2xl" />}

          <div className="space-y-3">
            <h1 className="text-3xl md:text-4xl font-bold">{blog.title}</h1>
            <div className="flex flex-wrap items-center gap-6 text-sm text-[var(--foreground)]">
              {blog.author && (
                <span className="inline-flex items-center gap-1">
                  <FiUser /> {blog.author}
                </span>
              )}
              <span className="inline-flex items-center gap-1">
                <FiCalendar />
                {new Date(blog.created_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </span>
              {blog.reading_time && <span className="inline-flex items-center gap-1"><FiClock /> {blog.reading_time} Min Reading Time</span>}
            </div>
          </div>

          <div className="space-y-10">
            {parsedTags.length > 0 && (
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-sm text-[var(--foreground)] flex items-center gap-2 uppercase tracking-wide">
                  <FiTag /> Tags:
                </span>
                {parsedTags.map((tag, index) => {
                  const color = tagColors[index % tagColors.length];
                  return (
                    <span key={tag + index} className={`px-3 py-1 rounded-full border ${color} text-xs font-semibold`}>
                      #{tag}
                    </span>
                  );
                })}
              </div>
            )}

            {blog.video && (
              <div
                className="relative w-full overflow-hidden rounded-2xl bg-[var(--background)]"
                style={{ paddingBottom: "56.25%" }}
              >
                <iframe src={blog.video} title={blog.title} allowFullScreen className="absolute top-0 left-0 w-full h-full rounded-2xl"></iframe>
              </div>
            )}

            <div
              className="
                richtext
                prose
                prose-lg
                max-w-none
                leading-relaxed
                dark:prose-invert
                prose-a:underline
                prose-ul:list-disc prose-ol:list-decimal
                text-[var(--foreground)]
              "
            >
              <div className="ql-editor" dangerouslySetInnerHTML={{ __html: contentHtml }} />
            </div>
          </div>
        </div>

        <div className="mt-8 md:mt-0 md:w-[30%] flex-shrink-0 space-y-6 sticky top-28 self-start">
          <div className="bg-[var(--card)] border border-[color:var(--border)] rounded-3xl shadow-lg p-5">
            <h3 className="text-lg font-semibold mb-4">Post details</h3>
            <div className="space-y-3 text-sm">
              {blog.category && (
                <div className="flex justify-between gap-3">
                  <span className="text-[var(--foreground)]">Category</span>
                  <span className="font-semibold">{blog.category}</span>
                </div>
              )}
              {blog.subcategory && (
                <div className="flex justify-between gap-3">
                  <span className="text-[var(--foreground)]">Subcategory</span>
                  <span className="font-semibold">{blog.subcategory}</span>
                </div>
              )}
              {blog.status && (
                <div className="flex justify-between gap-3">
                  <span className="text-[var(--foreground)]">Type</span>
                  <span className="font-semibold">{blog.status}</span>
                </div>
              )}
              {blog.date && (
                <div className="flex justify-between gap-3">
                  <span className="text-[var(--foreground)]">Published Date</span>
                  <span className="font-semibold">
                    {new Date(blog.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="bg-[var(--card)] border border-[color:var(--border)] rounded-3xl shadow-lg p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">You may also like</h3>
              <Link to="/blogs" className="text-sm font-semibold text-[#d4af37] hover:underline">
                View all
              </Link>
            </div>

            <div className="grid gap-3 grid-cols-1 lg:grid-cols-2">
              {related.map((item) => (
                <BlogMiniCard key={item.id} blog={item} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
