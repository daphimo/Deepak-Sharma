// src/admin/Admin.tsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import Magnet from "../assets/components/Magnet";
import {
  Trash2,
  PlusCircle,
  LogOut,
  Lock,
  BookOpen,
  CheckCircle2,
  XCircle,
} from "lucide-react";

export default function Admin() {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [selectedBlogs, setSelectedBlogs] = useState<string[]>([]);

  // 🔐 Admin auth
  const ADMIN_PASSWORD = "monkeytyper";
  const STORAGE_KEY = "admin_auth";
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [enteredPassword, setEnteredPassword] = useState("");

  // Popup message
  const [popup, setPopup] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const showPopup = (type: "success" | "error", message: string) => {
    setPopup({ type, message });
    setTimeout(() => setPopup(null), 2500);
  };

  useEffect(() => {
    const savedAuth = localStorage.getItem(STORAGE_KEY);
    if (savedAuth === ADMIN_PASSWORD) setIsAuthenticated(true);
  }, []);

  const handleLogin = () => {
    if (enteredPassword === ADMIN_PASSWORD) {
      localStorage.setItem(STORAGE_KEY, ADMIN_PASSWORD);
      setIsAuthenticated(true);
      showPopup("success", "Welcome back, Admin!");
    } else {
      showPopup("error", "Incorrect password!");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem(STORAGE_KEY);
    setIsAuthenticated(false);
    showPopup("success", "Logged out successfully.");
  };

  const fetchBlogs = async (pageNum: number) => {
    setLoading(true);
    const pageSize = 6;
    const from = (pageNum - 1) * pageSize;
    const to = from + pageSize - 1;

    const { data, error } = await supabase
      .from("blogs")
      .select("id, title, slug, cover_image, created_at")
      .order("created_at", { ascending: false })
      .range(from, to);

    if (error) console.error(error);
    else {
      if (data.length < pageSize) setHasMore(false);
      setBlogs((prev) => [...prev, ...data]);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (isAuthenticated) fetchBlogs(1);
  }, [isAuthenticated]);

  const loadMore = () => {
    const next = page + 1;
    setPage(next);
    fetchBlogs(next);
  };

  // ✅ Toggle select/deselect
  const toggleSelectBlog = (id: string) => {
    setSelectedBlogs((prev) =>
      prev.includes(id) ? prev.filter((b) => b !== id) : [...prev, id]
    );
  };

  // 🗑️ Delete selected
  const handleDeleteSelected = async () => {
    if (selectedBlogs.length === 0) return;
    const confirmDelete = window.confirm(
      `Are you sure you want to delete ${selectedBlogs.length} blog(s)? This action cannot be undone.`
    );
    if (!confirmDelete) return;

    setLoading(true);
    const { error } = await supabase
      .from("blogs")
      .delete()
      .in("id", selectedBlogs);

    if (error) {
      console.error(error);
      showPopup("error", "Error deleting blogs. Check console for details.");
    } else {
      setBlogs((prev) => prev.filter((b) => !selectedBlogs.includes(b.id)));
      setSelectedBlogs([]);
      showPopup("success", "Selected blogs deleted successfully.");
    }
    setLoading(false);
  };

  // 🔓 Login screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        {popup && (
          <Popup type={popup.type} message={popup.message} />
        )}
        <div className="p-6 bg-white/10 backdrop-blur-md border border-white/20 shadow-lg rounded-2xl w-full max-w-md">
          <h2 className="text-2xl font-semibold mb-4 text-white flex items-center gap-2">
            <Lock className="w-6 h-6" /> Admin Access
          </h2>
          <input
            type="password"
            placeholder="Enter admin password"
            value={enteredPassword}
            onChange={(e) => setEnteredPassword(e.target.value)}
            className="border text-white border-gray-300 rounded-lg p-3 w-full mb-4 focus:ring focus:ring-blue-100 focus:border-blue-500 bg-transparent"
          />
          <Magnet padding={50} disabled={false} magnetStrength={5}>
            <button
              onClick={handleLogin}
              className="flex cursor-pointer font-bold items-center gap-2 text-sm text-[#1a1a1a] bg-[#d4af37] px-4 py-2 rounded-xl transition-all shadow-md hover:shadow-lg active:scale-[0.98]"
            >
              <BookOpen className="w-4 h-4" /> Enter
            </button>
          </Magnet>
        </div>
      </div>
    );
  }

  // 🧠 Admin dashboard
  return (
    <div className="w-full mx-auto px-6 py-20 relative">
      {popup && <Popup type={popup.type} message={popup.message} />}

      <div className="bg-white shadow-lg px-4 rounded-2xl p-6 sm:p-10 border border-gray-100 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-semibold text-gray-800 flex items-center gap-2">
            <BookOpen className="w-7 h-7 text-blue-600" /> Admin Dashboard
          </h1>

          <div className="flex items-center gap-3">
            {selectedBlogs.length > 0 && (
              <button
                onClick={handleDeleteSelected}
                disabled={loading}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium shadow-md cursor-pointer transition flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Delete ({selectedBlogs.length})
              </button>
            )}
            <button
              onClick={() => navigate("/editor")}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium shadow-md cursor-pointer transition flex items-center gap-2"
            >
              <PlusCircle className="w-4 h-4" /> Write New
            </button>
            <button
              onClick={handleLogout}
              className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-lg font-medium shadow-md cursor-pointer transition flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" /> Logout
            </button>
          </div>
        </div>

        {/* Blog list */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.map((blog) => {
            const isSelected = selectedBlogs.includes(blog.id);
            return (
              <div
                key={blog.id}
                className={`relative bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden border ${
                  isSelected
                    ? "border-red-400 ring-2 ring-red-300"
                    : "border-gray-100"
                }`}
              >
                <div onClick={() => navigate(`/editor?id=${blog.id}`)}>
                  {blog.cover_image && (
                    <img
                      src={blog.cover_image}
                      alt={blog.title}
                      className="h-40 w-full object-cover"
                    />
                  )}
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-800">
                      {blog.title}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {new Date(blog.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* Floating Select Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleSelectBlog(blog.id);
                  }}
                  className={`absolute bottom-3 right-3 px-3 py-1.5 rounded-lg text-sm font-medium shadow-md transition-all flex items-center gap-1 ${
                    isSelected
                      ? "bg-red-600 text-white hover:bg-red-700"
                      : "bg-blue-600 text-white hover:bg-blue-700"
                  }`}
                >
                  {isSelected ? "Selected" : "Select"}
                </button>
              </div>
            );
          })}
        </div>

        {/* Load more */}
        {hasMore && (
          <div className="text-center mt-10">
            <button
              onClick={loadMore}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg shadow-md disabled:opacity-60"
            >
              {loading ? "Loading..." : "Load More"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// 💬 Popup component
function Popup({ type, message }: { type: "success" | "error"; message: string }) {
  const Icon = type === "success" ? CheckCircle2 : XCircle;
  return (
    <div
      className={`fixed top-6 right-6 flex items-center gap-2 px-4 py-3 rounded-xl text-white shadow-lg transition-all z-50 ${
        type === "success" ? "bg-green-600" : "bg-red-600"
      }`}
    >
      <Icon className="w-5 h-5" />
      <span className="font-medium">{message}</span>
    </div>
  );
}
