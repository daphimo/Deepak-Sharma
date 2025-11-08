import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "./lib/supabaseClient";
import Magnet from "./assets/components/Magnet";
import { FiExternalLink } from "react-icons/fi";

// 🎨 Accent color palette for tags (optional for future categorization)
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

export default function FeaturedBlogs() {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      const { data, error } = await supabase
        .from("blogs")
        .select("id, title, slug, content, cover_image, created_at, video_embed")
        .order("created_at", { ascending: false })
        .limit(3); // show 3 recent blogs for featured section

      if (error) console.error("❌ Error fetching blogs:", error);
      else setBlogs(data || []);

      setLoading(false);
    };

    fetchBlogs();
  }, []);

  return (
    <div className="mt-20 w-full text-white max-w-7xl mx-auto py-20 px-4">
      {/* Header */}
      <div className="mb-16 text-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-4">
          Turn Gaps Into Great Features
        </h2>
        <p className="text-gray-300 text-lg max-w-2xl mx-auto leading-relaxed">
          Explore modern Shopify how-tos that fill the missing pieces — from
          wishlists to popups — helping you build themes that feel polished and
          complete.
        </p>
      </div>

      {/* Blog Cards */}
      {loading ? (
        <p className="text-center text-gray-400">Loading blogs...</p>
      ) : blogs.length === 0 ? (
        <p className="text-center text-gray-400">No blogs found.</p>
      ) : (
        <div className="flex flex-wrap justify-center gap-10 items-stretch">
          {blogs.map((blog, index) => (
            <div
              key={blog.id || index}
              className="w-full md:w-[calc(30%-1.25rem)] max-w-[600px] flex"
            >
              <BlogCard blog={blog} />
            </div>
          ))}
        </div>
      )}

      {/* CTA Button */}
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

// ✅ Blog Card Component
function BlogCard({ blog }: { blog: any }) {
  // Optional: truncate content or use a short description from HTML
  const shortDesc =
    blog.content.replace(/<[^>]*>?/gm, "").slice(0, 120) + "...";

  return (
    <div className="relative flex flex-col bg-white/10 backdrop-blur-md border border-white/20 shadow-lg rounded-2xl overflow-hidden h-full">
      {/* Blog Image */}
      <Link to={`/blogs/${blog.slug}`} className="w-full aspect-video">
        <img
          src={blog.cover_image || "/files/blogs/default.webp"}
          alt={blog.title}
          className="w-full h-full object-cover"
        />
      </Link>

      {/* Content */}
      <div className="flex flex-col justify-between flex-grow">
        <div>
          {/* Title & Link */}
          <div className="flex items-center justify-between w-full px-5 mt-4">
            <Link
              to={`/blog/${blog.slug}`}
              className="text-2xl font-semibold text-white"
            >
              {blog.title}
            </Link>
            <Link
              to={`/blog/${blog.slug}`}
              className="text-gray-300"
              aria-label={`Read ${blog.title}`}
            >
              <FiExternalLink size={20} />
            </Link>
          </div>

          {/* Description */}
          <p className="text-gray-300 text-sm px-5 mt-2 line-clamp-2">
            {shortDesc}
          </p>
        </div>

        {/* Date */}
        <div className="px-5 text-xs text-gray-400 mt-2">
          {new Date(blog.created_at).toLocaleDateString("en-US", {
            month: "short",
            year: "numeric",
          })}
        </div>

        {/* Tags Placeholder */}
        <div className="flex flex-wrap gap-2 px-5 py-4">
          <span className={`${tagColors[0]} text-xs font-semibold uppercase`}>
            #Blog
          </span>
        </div>
      </div>
    </div>
  );
}
