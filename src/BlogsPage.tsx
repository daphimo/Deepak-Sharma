import { useEffect, useState } from "react";
import { FiSearch } from "react-icons/fi";
import Magnet from "./assets/components/Magnet";
import { BlogCard } from "./components/BlogCard";
import { supabase } from "./lib/supabaseClient";

export default function FeaturedBlogs() {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const blogsPerPage = 12;

  const fetchBlogs = async (pageNumber = 1, search = "") => {
    setLoading(true);

    let query = supabase
      .from("blog")
      .select("id, title, slug, content, image, created_at, video, tags")
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

    const mapped = (data || []).map((item) => ({
      ...item,
      image: (item as any).cover_image || item.image,
      tags: (item as any).blog_tags || item.tags,
      video: (item as any).video_embed || item.video,
    }));

    if (pageNumber === 1) {
      setBlogs(mapped);
    } else {
      setBlogs((prev) => [...prev, ...mapped]);
    }

    setHasMore(data && data.length === blogsPerPage);
    setLoading(false);
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      setPage(1);
      fetchBlogs(1, searchTerm);
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [searchTerm]);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchBlogs(nextPage, searchTerm);
  };

  return (
    <div className="mt-20 w-full text-white max-w-7xl mx-auto py-16 px-4">
      <div className="mb-12 text-center">
        <h2 className="text-3xl md:text-5xl font-bold mb-4">
          Turn Gaps Into Great Features
        </h2>
        <p className="text-gray-300 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
          Explore modern Shopify how-tos that fill the missing pieces — from wishlists to popups — helping you build themes that feel polished and complete.
        </p>
      </div>

      <div className="flex items-center justify-center gap-3 mb-10 w-full max-w-md mx-auto bg-[var(--card)] border border-white/20 rounded-full px-4 py-2 backdrop-blur-md">
        <FiSearch className="text-gray-300" size={18} />
        <input
          type="text"
          placeholder="Search blogs..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-grow bg-transparent outline-none text-white placeholder-gray-400 text-sm md:text-base"
        />
      </div>

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
