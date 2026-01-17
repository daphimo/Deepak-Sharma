import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import { FiExternalLink, FiTag } from "react-icons/fi";
import "../styles/richtext.css";
import { ProjectMiniCard } from "../components/ProjectMiniCard";

type Project = {
  id: string;
  name: string;
  slug: string;
  image?: string | null;
  desktop_image?: string | null;
  mobile_image?: string | null;
  project_url?: string;
  problems?: string | null;
  results?: string | null;
  solutions?: string | null;
  seo_title?: string | null;
  seo_description?: string | null;
  category?: string;
  subcategory?: string;
  tags?: string[] | null;
  date?: string;
  designer?: string;
  location?: string;
  status?: string;
};

const chipColors = [
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

    const renderChildren = (children: any[] = []) =>
      children.map(renderText).join("");

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

export default function SupabaseProjectDetail() {
  const { slug } = useParams();
  const [project, setProject] = useState<Project | null>(null);
  const [related, setRelated] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const heroImage = useMemo(() => {
    if (!project) return null;
    return (
      project.image ||
      project.desktop_image ||
      project.mobile_image ||
      "/files/fallback_desktop.png"
    );
  }, [project]);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        if (!slug) throw new Error("Project slug missing");
        const { data, error } = await supabase
          .from("project")
          .select("*")
          .eq("slug", slug)
          .single();
        if (error) throw error;
        setProject(data as Project);

        const { data: relatedData } = await supabase
          .from("project")
          .select("id, name, slug, image, desktop_image, mobile_image, date")
          .order("created_at", { ascending: false })
          .limit(4);

        setRelated((relatedData || []) as Project[]);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load project");
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [slug]);

  useEffect(() => {
    if (project) {
      updateMeta(
        project.seo_title || project.name,
        project.seo_description || undefined
      );
    }
  }, [project]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-[var(--foreground)]">
        Loading project...
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-[var(--foreground)] gap-4 px-4 text-center">
        <p>{error || "Project not found."}</p>
        <Link
          to="/projects"
          className="flex cursor-pointer font-bold items-center gap-2 text-sm text-[var(--background)] bg-[#d4af37] px-4 py-2 rounded-xl transition-all shadow-md hover:shadow-lg active:scale-[0.98]"
        >
          Back to projects
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 pt-28 pb-16 text-[var(--foreground)] min-h-screen">
      <div className="flex items-center justify-between gap-3">
        <Link
          to="/projects"
          className="inline-flex cursor-pointer font-bold items-center gap-2 text-sm text-[var(--background)] bg-[#d4af37] px-4 py-2 rounded-xl transition-all shadow-md hover:shadow-lg active:scale-[0.98]"
        >
          Back
        </Link>
        {project.project_url && (
          <a
            href={project.project_url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex cursor-pointer font-bold items-center gap-2 text-sm bg-[var(--primary)] text-[var(--primary-foreground)] px-4 py-2 rounded-xl transition-all shadow-md hover:shadow-lg active:scale-[0.98]"
          >
            View Live <FiExternalLink />
          </a>
        )}
      </div>

      <div className="mt-8 space-y-6 p-6 relative bg-[var(--card)] backdrop-blur-md shadow-md rounded-2xl">
        {heroImage && (
          <img
            src={heroImage}
            alt={project.name}
            className="w-full rounded-2xl object-contain"
          />
        )}

        <div className="space-y-3">
          <div className="flex flex-wrap gap-2 text-xs uppercase tracking-wide text-[var(--foreground)]">
            {project.category && <span>{project.category}</span>}
            {project.subcategory && <span>{project.subcategory}</span>}
            {project.status && <span>{project.status}</span>}
          </div>
          <h1 className="text-3xl md:text-4xl font-bold">{project.name}</h1>
          <div className="text-sm flex flex-wrap gap-3 text-[var(--foreground)]">
            {project.date && (
              <span>
                Delivered: {new Date(project.date).toLocaleDateString()}
              </span>
            )}
            {project.location && <span>Location: {project.location}</span>}
            {project.designer && <span>Designer: {project.designer}</span>}
          </div>
        </div>

        <div className="flex flex-col gap-10">
          {project.tags && project.tags.length > 0 && (
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-sm text-[var(--foreground)] flex items-center gap-2 uppercase tracking-wide">
                <FiTag /> Tags
              </span>
              {project.tags.map((tag, index) => {
                const color = chipColors[index % chipColors.length];
                return (
                  <span
                    key={tag + index}
                    className={`px-3 py-1 rounded-full border ${color} text-xs font-semibold`}
                  >
                    #{tag}
                  </span>
                );
              })}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-8">
              {project.problems && (
                <section className="bg-[var(--card)] border border-[color:var(--border)] rounded-2xl p-6 shadow-sm">
                  <h3 className="text-xl font-semibold mb-3">Problems</h3>
                  <div
                    className="richtext prose prose-lg max-w-none leading-relaxed dark:prose-invert prose-a:underline prose-ul:list-disc prose-ol:list-decimal text-[var(--foreground)]"
                  >
                    <div
                      className="ql-editor"
                      dangerouslySetInnerHTML={{
                        __html: serializeRichContent(project.problems),
                      }}
                    />
                  </div>
                </section>
              )}

              {project.solutions && (
                <section className="bg-[var(--card)] border border-[color:var(--border)] rounded-2xl p-6 shadow-sm">
                  <h3 className="text-xl font-semibold mb-3">Solutions</h3>
                  <div
                    className="richtext prose prose-lg max-w-none leading-relaxed dark:prose-invert prose-a:underline prose-ul:list-disc prose-ol:list-decimal text-[var(--foreground)]"
                  >
                    <div
                      className="ql-editor"
                      dangerouslySetInnerHTML={{
                        __html: serializeRichContent(project.solutions),
                      }}
                    />
                  </div>
                </section>
              )}

              {project.results && (
                <section className="bg-[var(--card)] border border-[color:var(--border)] rounded-2xl p-6 shadow-sm">
                  <h3 className="text-xl font-semibold mb-3">Results</h3>
                  <div
                    className="richtext prose prose-lg max-w-none leading-relaxed dark:prose-invert prose-a:underline prose-ul:list-disc prose-ol:list-decimal text-[var(--foreground)]"
                  >
                    <div
                      className="ql-editor"
                      dangerouslySetInnerHTML={{
                        __html: serializeRichContent(project.results),
                      }}
                    />
                  </div>
                </section>
              )}
            </div>

            <aside className="space-y-4 lg:sticky lg:top-28 self-start">
              <div className="bg-[var(--card)] border border-[color:var(--border)] rounded-2xl p-5 flex flex-col gap-3 text-sm shadow-sm">
                <div className="flex justify-between">
                  <span className="text-[var(--foreground)]">Category</span>
                  <span className="font-semibold">
                    {project.category || "N/A"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--foreground)]">Subcategory</span>
                  <span className="font-semibold">
                    {project.subcategory || "N/A"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--foreground)]">Status</span>
                  <span className="font-semibold">
                    {project.status || "N/A"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--foreground)]">Date</span>
                  <span className="font-semibold">
                    {project.date
                      ? new Date(project.date).toLocaleDateString()
                      : "N/A"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--foreground)]">Designer</span>
                  <span className="font-semibold">
                    {project.designer || "N/A"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--foreground)]">Location</span>
                  <span className="font-semibold">
                    {project.location || "N/A"}
                  </span>
                </div>
                {project.project_url && (
                  <a
                    href={project.project_url}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-2 inline-flex items-center justify-center gap-2 font-semibold bg-[var(--primary)] text-[var(--primary-foreground)] px-4 py-2 rounded-xl transition-all shadow-md hover:shadow-lg active:scale-[0.98]"
                  >
                    Open Project <FiExternalLink />
                  </a>
                )}
              </div>

              {project.mobile_image && (
                <img
                  src={project.mobile_image || "/files/fallback_mobile.png"}
                  alt={`${project.name} mobile preview`}
                  className="w-auto h-76"
                />
              )}
            </aside>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <div className="mt-8">
          <div className="bg-[var(--card)] border border-[color:var(--border)] rounded-3xl shadow-lg p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">You may also like</h3>
              <Link
                to="/projects"
                className="text-sm font-semibold text-[#d4af37] hover:underline"
              >
                View all
              </Link>
            </div>
            <div className="grid gap-3 grid-cols-1 lg:grid-cols-2">
              {related.slice(0, 4).map((proj) => (
                <ProjectMiniCard key={proj.id} project={proj} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
