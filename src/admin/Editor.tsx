import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { supabase } from "../lib/supabaseClient";
import Magnet from "../assets/components/Magnet";

export default function Editor() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const blogId = params.get("id");

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [videoEmbed, setVideoEmbed] = useState("");
  const [blogTags, setBlogTags] = useState("");
  const [content, setContent] = useState("");
  const [message, setMessage] = useState("");

  // 🔐 Password protection
  const ADMIN_PASSWORD = "monkeytyper";
  const STORAGE_KEY = "admin_auth";
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [enteredPassword, setEnteredPassword] = useState("");

  useEffect(() => {
    const savedAuth = localStorage.getItem(STORAGE_KEY);
    if (savedAuth === ADMIN_PASSWORD) setIsAuthenticated(true);
  }, []);

  const handleLogin = () => {
    if (enteredPassword === ADMIN_PASSWORD) {
      localStorage.setItem(STORAGE_KEY, ADMIN_PASSWORD);
      setIsAuthenticated(true);
    } else alert("❌ Incorrect password!");
  };

  const handleLogout = () => {
    localStorage.removeItem(STORAGE_KEY);
    setIsAuthenticated(false);
  };

  // 🧠 Fetch existing blog if editing
  useEffect(() => {
    const fetchBlog = async () => {
      if (!blogId) return;
      const { data, error } = await supabase
        .from("blogs")
        .select("*")
        .eq("id", blogId)
        .single();

      if (!error && data) {
        setTitle(data.title);
        setSlug(data.slug);
        setCoverImage(data.cover_image || "");
        setVideoEmbed(data.video_embed || "");
        setBlogTags(data.blog_tags || "");
        setContent(data.content || "");
      }
    };
    if (isAuthenticated) fetchBlog();
  }, [isAuthenticated, blogId]);

  const handleSave = async () => {
    if (!title || !slug || !content) {
      setMessage("❌ Title, slug, and content are required!");
      return;
    }

    if (blogId) {
      // update existing
      const { error } = await supabase
        .from("blogs")
        .update({
          title,
          slug,
          content,
          cover_image: coverImage || null,
          video_embed: videoEmbed || null,
          blog_tags: blogTags || null,
        })
        .eq("id", blogId);

      if (error) setMessage("❌ " + error.message);
      else setMessage("✅ Blog updated!");
    } else {
      // create new
      const { error } = await supabase.from("blogs").insert([
        {
          title,
          slug,
          content,
          cover_image: coverImage || null,
          video_embed: videoEmbed || null,
          blog_tags: blogTags || null,
        },
      ]);

      if (error) setMessage("❌ " + error.message);
      else setMessage("✅ Blog published!");
    }
  };

  // 🔒 Login screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        <div className="p-6 bg-white/10 backdrop-blur-md border border-white/20 shadow-lg rounded-2xl w-full max-w-md">
          <h2 className="text-2xl font-semibold mb-4 text-white">🔒 Admin Access</h2>
          <input
            type="password"
            placeholder="Enter admin password"
            value={enteredPassword}
            onChange={(e) => setEnteredPassword(e.target.value)}
            className="border text-white border-gray-300 rounded-lg p-3 w-full mb-4 focus:ring focus:ring-blue-100 focus:border-blue-500"
          />
          <Magnet padding={50} disabled={false} magnetStrength={5}>
            <button
              onClick={handleLogin}
              className="flex cursor-pointer font-bold items-center gap-2 text-sm text-[#1a1a1a] bg-[#d4af37] px-4 py-2 rounded-xl transition-all shadow-md hover:shadow-lg active:scale-[0.98]"
            >
              Enter
            </button>
          </Magnet>
        </div>
      </div>
    );
  }

  // 📝 Editor UI
  return (
    <div className="content-editor max-w-7xl mx-auto px-6 py-24">
      <div className="bg-white shadow-lg rounded-2xl p-6 sm:p-10 border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-semibold text-gray-800">
            {blogId ? "📝 Edit Blog Post" : "✍️ Create a New Blog Post"}
          </h1>
          <div className="flex gap-3">
            <button
              onClick={() => navigate("/admin")}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium shadow-md cursor-pointer transition"
            >
              Back
            </button>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium shadow-md cursor-pointer transition"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Title */}
        <label className="block text-gray-700 font-medium mb-1">Blog Title</label>
        <input
          type="text"
          placeholder="Enter blog title..."
          className="border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-100 transition rounded-lg p-3 w-full mb-4 text-gray-800"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            setSlug(e.target.value.toLowerCase().replace(/\s+/g, "-"));
          }}
        />

        {/* Slug */}
        <label className="block text-gray-700 font-medium mb-1">Slug</label>
        <input
          type="text"
          placeholder="auto-generated or edit manually..."
          className="border border-gray-300 rounded-lg p-3 w-full mb-4 text-gray-800"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
        />

        {/* Cover Image */}
        <label className="block text-gray-700 font-medium mb-1">Cover Image URL</label>
        <input
          type="text"
          placeholder="Paste image URL..."
          className="border border-gray-300 rounded-lg p-3 w-full mb-4 text-gray-800"
          value={coverImage}
          onChange={(e) => setCoverImage(e.target.value)}
        />

        {/* Video */}
        <label className="block text-gray-700 font-medium mb-1">YouTube Embed Code</label>
        <textarea
          placeholder="Paste video embed HTML..."
          className="border border-gray-300 rounded-lg p-3 w-full mb-4 text-gray-800 h-24"
          value={videoEmbed}
          onChange={(e) => setVideoEmbed(e.target.value)}
        />

        {/* Tags */}
        <label className="block text-gray-700 font-medium mb-1">
          Blog Tags (comma-separated)
        </label>
        <input
          type="text"
          placeholder="e.g. tech, ai, innovation"
          className="border border-gray-300 rounded-lg p-3 w-full mb-4 text-gray-800"
          value={blogTags}
          onChange={(e) => setBlogTags(e.target.value)}
        />

        {/* Content */}
        <label className="block text-gray-700 font-medium mb-2">Blog Content</label>
        <div className="h-[400px] mb-6 border border-gray-200 rounded-lg overflow-hidden">
          <ReactQuill
            value={content}
            onChange={setContent}
            className="h-full max-h-[400px] overflow-y-auto hidden-scrollbar"
            theme="snow"
            modules={{
              toolbar: [
                [{ header: [1, 2, 3, 4, false] }],
                ["bold", "italic", "underline", "strike"],
                [{ list: "ordered" }, { list: "bullet" }],
                ["link", "image", "code-block"],
              ],
            }}
          />
        </div>

        {/* Save Button */}
        <div className="flex items-center justify-between">
          <button
            onClick={handleSave}
            className="bg-blue-600 cursor-pointer hover:bg-blue-700 transition text-white px-6 py-3 rounded-lg font-medium shadow-md"
          >
            {blogId ? "💾 Update Blog" : "🚀 Publish Blog"}
          </button>
          {message && (
            <p
              className={`text-sm font-medium ${
                message.startsWith("✅") ? "text-green-600" : "text-red-500"
              }`}
            >
              {message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
