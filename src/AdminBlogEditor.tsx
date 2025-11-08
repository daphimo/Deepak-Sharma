import { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { supabase } from "./lib/supabaseClient";
import Magnet from "./assets/components/Magnet";

export default function AdminBlogEditor() {
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [content, setContent] = useState("");
  const [message, setMessage] = useState("");

  // 🔐 Password protection
  const [enteredPassword, setEnteredPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const ADMIN_PASSWORD = "monkeytyper";

  const handleLogin = () => {
    if (enteredPassword === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setEnteredPassword("");
    } else {
      alert("❌ Incorrect password!");
    }
  };

  const handlePublish = async () => {
    const { error } = await supabase
      .from("blogs")
      .insert([{ title, slug, content }]);
    if (error) setMessage("❌ " + error.message);
    else setMessage("✅ Blog published!");
  };

  // 🧱 If not authenticated, show login screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        <div
          className="p-6 bg-white/10 
          backdrop-blur-md 
          border border-white/20 
          shadow-lg 
          rounded-2xl 
          w-full max-w-md"
        >
          <h2 className="text-2xl font-semibold mb-4 text-white">
            🔒 Admin Access
          </h2>
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

  // ✅ Authenticated view
  return (
    <div className="max-w-7xl mx-auto p-6 sm:p-8">
      <div className="bg-white shadow-lg rounded-2xl p-6 sm:p-10 border border-gray-100">
        <h1 className="text-3xl font-semibold mb-6 text-gray-800">
          ✍️ Create a New Blog Post
        </h1>

        {/* Blog Title Input */}
        <label className="block text-gray-700 font-medium mb-1">
          Blog Title
        </label>
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
        {slug && (
          <p className="text-sm text-gray-500 mb-4">
            <span className="font-semibold text-gray-700">Slug:</span> /{slug}
          </p>
        )}

        {/* Editor */}
        <label className="block text-gray-700 font-medium mb-2">
          Blog Content
        </label>
        <div className="h-[400px] mb-6 border border-gray-200 rounded-lg overflow-hidden">
          <ReactQuill
            value={content}
            onChange={setContent}
            className="h-full"
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

        {/* Publish Button */}
        <div className="flex items-center justify-between">
          <button
            onClick={handlePublish}
            className="bg-blue-600 hover:bg-blue-700 transition text-white px-6 py-3 rounded-lg font-medium shadow-md"
          >
            🚀 Publish Blog
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
