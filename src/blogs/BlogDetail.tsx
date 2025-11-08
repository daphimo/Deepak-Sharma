import { useEffect, useState } from "react";
import { FiCopy } from "react-icons/fi";
import { useParams } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import parse from "html-react-parser";
import type { DOMNode } from "html-react-parser";

import Prism from "prismjs";
import "prismjs/themes/prism-tomorrow.css";

interface Blog {
  id: string;
  title: string;
  slug: string;
  content: string;
  cover_image?: string;
  video_embed?: string;
  created_at: string;
  blog_tags: string;
}

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

// --- ✨ Copy Code Button ---
function CodeBlock({ code, language }: { code: string; language: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  useEffect(() => {
    Prism.highlightAll();
  }, [code]);

  return (
    <div className="relative my-8">
      <button
        onClick={handleCopy}
        className="absolute top-3 right-3 text-xs bg-[#2b2b2b] text-gray-300 px-2 py-1 rounded-md flex items-center gap-1 transition cursor-pointer hover:bg-[#3b3b3b]"
      >
        <FiCopy className="text-gray-400" />
        {copied ? "Copied!" : "Copy"}
      </button>
      <pre className="!bg-[#1e1e1e] rounded-xl overflow-x-auto border border-white/10 shadow-lg">
        <code className={`language-${language} text-sm p-4 block`}>{code}</code>
      </pre>
    </div>
  );
}

// --- ✨ Coming Soon Placeholder ---
function ComingSoon() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center space-y-6 px-4">
      <img
        src="/files/water.png"
        alt="Drink water your blog is coming soon"
        className="h-[300px] w-auto md:max-w-md"
      />
      <h2 className="text-white text-3xl md:text-4xl font-bold">
        Drink Water this blog is constructing...
      </h2>
      <a
        href="/blogs"
        className="mt-2 flex cursor-pointer font-bold items-center gap-2 text-sm text-[#1a1a1a] bg-[#d4af37] px-4 py-2 rounded-xl transition-all shadow-md hover:shadow-lg active:scale-[0.98]"
      >
        Read More
      </a>
    </div>
  );
}

export default function BlogDetail() {
  const { slug } = useParams();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        if (!slug) throw new Error("Blog slug is missing");

        const { data, error } = await supabase
          .from("blogs")
          .select("*")
          .eq("slug", slug)
          .single();

        if (error) throw error;
        if (!data) throw new Error("Blog not found");

        setBlog(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load blog");
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [slug]);

  useEffect(() => {
    Prism.highlightAll();
  }, [blog]);

  // --- ✨ Show Coming Soon until a valid blog is loaded ---
  if (loading || error || !blog) {
    return <ComingSoon />;
  }

  // --- ✨ Custom parser for code blocks ---
  const parsedContent = parse(blog.content, {
    replace: (domNode: DOMNode) => {
      if ((domNode as any)?.name === "pre") {
        const node = domNode as any;

        // ✅ Case 1: <pre><code>...</code></pre>
        if (Array.isArray(node.children) && node.children[0]?.name === "code") {
          const codeElement = node.children[0];
          const languageClass = codeElement.attribs?.class || "";
          const language = languageClass.replace("ql-", "") || "syntax";
          const code = codeElement.children
            .map((child: any) => ("data" in child ? child.data : ""))
            .join("");
          return <CodeBlock code={code.trim()} language={language} />;
        }

        // ✅ Case 2: <pre class="ql-syntax">Hello World</pre>
        if (node.attribs?.class?.includes("ql-syntax")) {
          const code =
            node.children
              ?.map((child: any) => ("data" in child ? child.data : ""))
              .join("") || "";
          return <CodeBlock code={code.trim()} language="text" />;
        }
      }

      return undefined;
    },
  });

  return (
    <div className="blog-content relative z-10 max-w-5xl mx-auto px-4 pt-20 text-white min-h-screen">
      <div className="p-6 bg-black backdrop-blur-md border border-white/20 shadow-lg rounded-2xl w-full">
        <h1 className="text-3xl md:text-5xl font-bold mb-4 text-white text-center md:text-left">
          {blog.title}
        </h1>
        <p className="text-[#d4af37] mb-2 text-center md:text-left">
          {new Date(blog.created_at).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
        <div className="flex flex-wrap gap-2 mb-8">
          {blog.blog_tags &&
            blog.blog_tags.split(",").map((tag: string, index: number) => {
              const color = tagColors[index % tagColors.length];
              return (
                <span
                  key={index}
                  className={`${color} text-xs font-semibold uppercase tracking-wide`}
                >
                  #{tag.trim()}
                </span>
              );
            })}
        </div>

        {blog.cover_image && (
          <div className="mb-10">
            <img
              src={blog.cover_image}
              alt={blog.title}
              className="rounded-2xl w-full object-cover shadow-lg max-h-[400px]"
            />
          </div>
        )}

        {blog.video_embed && (
          <div
            className="relative w-full overflow-hidden rounded-2xl shadow-lg mb-10"
            style={{ paddingBottom: "450px" }}
          >
            <iframe
              src={blog.video_embed}
              title={blog.title}
              allowFullScreen
              className="absolute top-0 left-0 w-full h-full rounded-2xl"
            ></iframe>
          </div>
        )}

        {/* ✨ Beautiful formatted content */}
        <div
          className="
            prose 
            prose-invert 
            prose-lg 
            max-w-none 
            text-gray-300 
            leading-relaxed
            prose-a:text-[#d4af37] prose-a:underline 
            prose-strong:text-white
            prose-ul:list-disc prose-ol:list-decimal prose-li:marker:text-[#d4af37]
          "
        >
          {parsedContent}
        </div>
      </div>
    </div>
  );
}
