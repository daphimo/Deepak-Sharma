import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "./lib/supabaseClient";
import Magnet from "./assets/components/Magnet";
import { FiExternalLink, FiSearch } from "react-icons/fi";

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
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const blogsPerPage = 12;

  // 🧠 Fetch blogs (supports search + pagination)
  const fetchBlogs = async (pageNumber = 1, search = "") => {
    setLoading(true);

    let query = supabase
      .from("blogs")
      .select(
        "id, title, slug, content, cover_image, created_at, video_embed, blog_tags"
      )
      .order("created_at", { ascending: false })
      .range((pageNumber - 1) * blogsPerPage, pageNumber * blogsPerPage - 1);

    if (search.trim()) {
      query = query.or(
        `title.ilike.%${search.trim()}%,content.ilike.%${search.trim()}%`
      );
    }

    const { data, error } = await query;

    if (error) {
      setLoading(false);
      return;
    }

    if (pageNumber === 1) {
      setBlogs(data || []);
    } else {
      setBlogs((prev) => [...prev, ...(data || [])]);
    }

    setHasMore(data && data.length === blogsPerPage);
    setLoading(false);
  };

  // 🧩 Initial load
  useEffect(() => {
    fetchBlogs();
  }, []);

  // 🔍 Live search (debounced)
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      setPage(1);
      fetchBlogs(1, searchTerm);
    }, 500); // 500ms delay after typing

    return () => clearTimeout(delayDebounce);
  }, [searchTerm]);

  // ⏩ Load more
  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchBlogs(nextPage, searchTerm);
  };

  return (
    <div className="mt-20 w-full text-white max-w-7xl mx-auto py-16 px-4">
      {/* Header */}
      <div className="mb-12 text-center">
        <h2 className="text-3xl md:text-5xl font-bold mb-4">
          Turn Gaps Into Great Features
        </h2>
        <p className="text-gray-300 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
          Explore modern Shopify how-tos that fill the missing pieces — from
          wishlists to popups — helping you build themes that feel polished and
          complete.
        </p>
      </div>

      {/* 🔍 Live Search */}
      <div className="flex items-center justify-center gap-3 mb-10 w-full max-w-md mx-auto bg-white/10 border border-white/20 rounded-full px-4 py-2 backdrop-blur-md">
        <FiSearch className="text-gray-300" size={18} />
        <input
          type="text"
          placeholder="Search blogs..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-grow bg-transparent outline-none text-white placeholder-gray-400 text-sm md:text-base"
        />
      </div>

      {/* Blog Cards */}
      {loading && page === 1 ? (
        <div className="flex justify-center items-center py-10">
          <svg
            className="animate-spin h-10 w-10 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            ></path>
          </svg>
        </div>
      ) : blogs.length === 0 ? (
        <p className="text-center text-gray-400">No blogs found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
          {blogs.map((blog, index) => (
            <BlogCard key={blog.id || index} blog={blog} />
          ))}
        </div>
      )}

      {/* Load More Button */}
      {!loading && hasMore && (
        <div className="text-center mt-10">
          <Magnet padding={50} disabled={false} magnetStrength={5}>
            <button
              onClick={handleLoadMore}
              className="flex items-center font-bold gap-2 text-sm text-[#1a1a1a] bg-[#d4af37] px-5 py-2 rounded-xl transition-all shadow-md hover:shadow-lg active:scale-[0.98]"
            >
              Load More
            </button>
          </Magnet>
        </div>
      )}

      {loading && page > 1 && (
        <div className="flex justify-center items-center mt-6">
          <svg
            className="animate-spin h-8 w-8 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            ></path>
          </svg>
        </div>
      )}
    </div>
  );
}

// ✅ Blog Card Component
function BlogCard({ blog }: { blog: any }) {
  const shortDesc =
    blog.content.replace(/<[^>]*>?/gm, "").slice(0, 120) + "...";

  return (
    <div className="w-full flex flex-col bg-white/10 backdrop-blur-md border border-white/20 shadow-lg rounded-2xl overflow-hidden transition-transform">
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
          <div className="flex items-center justify-between w-full px-5 mt-4">
            <Link
              to={`/blogs/${blog.slug}`}
              className="text-lg md:text-2xl font-semibold text-white hover:text-[#d4af37] transition"
            >
              {blog.title}
            </Link>
            <Link
              to={`/blogs/${blog.slug}`}
              className="text-gray-300 hover:text-[#d4af37]"
              aria-label={`Read ${blog.title}`}
            >
              <FiExternalLink size={20} />
            </Link>
          </div>

          <p className="text-gray-300 text-sm px-5 mt-2 line-clamp-2">
            {shortDesc}
          </p>
        </div>

        <div className="px-5 text-xs text-gray-400 mt-2">
          {new Date(blog.created_at).toLocaleDateString("en-US", {
            month: "short",
            year: "numeric",
          })}
        </div>

        <div className="flex flex-wrap gap-2 px-5 py-4">
          {blog.blog_tags &&
            blog.blog_tags.split(",").map((tag: string, index: number) => {
              const color = tagColors[index % tagColors.length]; // cycle through colors
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
      </div>
    </div>
  );
}
