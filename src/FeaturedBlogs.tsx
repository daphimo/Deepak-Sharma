import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Magnet from "./assets/components/Magnet";
import { BlogCard } from "./components/BlogCard";
import { supabase } from "./lib/supabaseClient";

export default function FeaturedBlogs() {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      const { data } = await supabase
        .from("blog")
        .select("id, title, slug, content, image, created_at, video, tags")
        .order("created_at", { ascending: false })
        .limit(3);

      setBlogs(
        (data || []).map((b) => ({
          ...b,
          image: (b as any).cover_image || b.image,
          video: (b as any).video_embed || b.video,
          tags: (b as any).blog_tags || b.tags,
        }))
      );
      setLoading(false);
    };

    fetchBlogs();
  }, []);

  return (
    <div className="mt-20 w-full text-[var(--foreground)] max-w-7xl mx-auto py-20 px-4">
      <div className="mb-16 text-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-4">Turn Gaps Into Great Features</h2>
        <p className="text-[var(--foreground)] text-lg max-w-2xl mx-auto leading-relaxed">
          Explore modern Shopify how-tos that fill the missing pieces, from wishlists to popups, helping you build themes that feel polished and complete.
        </p>
      </div>

      {loading ? (
        <p className="text-center text-[var(--foreground)]">Loading blogs...</p>
      ) : blogs.length === 0 ? (
        <p className="text-center text-[var(--foreground)]">No blogs found.</p>
      ) : (
        <div className="flex flex-wrap justify-center gap-10 items-stretch">
          {blogs.map((blog, index) => (
            <div key={blog.id || index} className="w-full md:w-[calc(30%-1.25rem)] max-w-[600px] flex">
              <BlogCard blog={blog} className="h-full" />
            </div>
          ))}
        </div>
      )}

      <div className="text-center mt-12">
        <Magnet padding={50} disabled={false} magnetStrength={5}>
          <Link
            to="/blogs"
            className="flex items-center font-bold gap-2 text-sm text-[#1a1a1a] bg-[#d4af37] px-4 py-2 rounded-xl transition-all shadow-md hover:shadow-lg active:scale-[0.98]"
          >
            Explore More Blogs
          </Link>
        </Magnet>
      </div>
    </div>
  );
}
