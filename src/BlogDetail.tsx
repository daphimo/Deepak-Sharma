import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "./lib/supabaseClient";
import parse from "html-react-parser";

interface Blog {
  id: string;
  title: string;
  slug: string;
  content: string;
  cover_image?: string;
  video_embed?: string;
  created_at: string;
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
        console.error("Error fetching blog:", err);
        setError(err instanceof Error ? err.message : "Failed to load blog");
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#1a1a1a]">
        <div className="animate-pulse text-[#d4af37] text-xl">Loading blog...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#1a1a1a]">
        <div className="text-red-400 text-xl">
          {error}
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#1a1a1a]">
        <div className="text-gray-400 text-xl">Blog not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1a1a1a] py-20">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">{blog.title}</h1>
        <p className="text-[#d4af37] mb-8">
          {new Date(blog.created_at).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </p>

        {/* Cover image (optional) */}
        {blog.cover_image && (
          <div className="mb-10">
            <img
              src={blog.cover_image}
              alt={blog.title}
              className="rounded-2xl w-full object-cover shadow-lg"
              style={{ maxHeight: '500px' }}
            />
          </div>
        )}

        {/* Video Embed (optional) */}
        {blog.video_embed && (
          <div className="aspect-video mb-10 rounded-2xl overflow-hidden shadow-lg">
            <div dangerouslySetInnerHTML={{ __html: blog.video_embed }} />
          </div>
        )}

        {/* Blog content */}
        <div className="prose prose-invert prose-lg max-w-none text-gray-300">
          {parse(blog.content)}
        </div>
      </div>
    </div>
  );
}
