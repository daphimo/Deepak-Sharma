// src/admin/BlogEditor.tsx
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  ArrowLeft,
  FileEdit,
  Rocket,
  Save,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { supabase } from "../lib/supabaseClient";
import { useRequireAuth } from "./useRequireAuth";
import { QuillEditor } from "../components/QuillEditor";
import { SupabaseImageUpload } from "../components/SupabaseImageUpload";

export default function BlogEditor() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const blogId = params.get("id");

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [author, setAuthor] = useState("");
  const [category, setCategory] = useState("");
  const [subcategory, setSubcategory] = useState("");
  const [status, setStatus] = useState("");
  const [date, setDate] = useState("");
  const [readingTime, setReadingTime] = useState("");
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDescription, setSeoDescription] = useState("");
  const [image, setImage] = useState("");
  const [video, setVideo] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagsInput, setTagsInput] = useState("");
  const [content, setContent] = useState("");

  const checkingAuth = useRequireAuth();

  const [popup, setPopup] = useState<{ type: "success" | "error"; message: string } | null>(
    null
  );

  const showPopup = (type: "success" | "error", message: string) => {
    setPopup({ type, message });
    setTimeout(() => setPopup(null), 2500);
  };

  useEffect(() => {
    const fetchBlog = async () => {
      if (!blogId) return;
      const { data, error } = await supabase
        .from("blog")
        .select("*")
        .eq("id", blogId)
        .single();

      if (!error && data) {
        setTitle((data as any).title || "");
        setSlug((data as any).slug || "");
        setAuthor((data as any).author || "");
        setCategory((data as any).category || "");
        setSubcategory((data as any).subcategory || "");
        setStatus((data as any).status || "");
        setDate((data as any).date || "");
        setReadingTime((data as any).reading_time || "");
        setSeoTitle((data as any).seo_title || "");
        setSeoDescription((data as any).seo_description || "");
        setImage((data as any).image || "");
        setVideo((data as any).video || "");
        const incomingTags = ((data as any).tags || []) as string[];
        setTags(incomingTags);
        setTagsInput(incomingTags.join(", "));
        setContent((data as any).content || "");
      }
    };
    if (!checkingAuth) fetchBlog();
  }, [checkingAuth, blogId]);

  const handleSave = async () => {
    if (!title || !slug || !content) {
      showPopup("error", "Title, slug, and content are required!");
      return;
    }

    const payload = {
      title,
      slug,
      content,
      author,
      category,
      subcategory,
      status,
      date,
      reading_time: readingTime,
      seo_title: seoTitle,
      seo_description: seoDescription,
      image: image || null,
      video: video || null,
      tags: tags && tags.length ? tags : null,
    };

    if (blogId) {
      const { error } = await supabase
        .from("blog")
        .update(payload)
        .eq("id", blogId);

      if (error) showPopup("error", error.message);
      else showPopup("success", "Blog updated successfully!");
    } else {
      const { error } = await supabase.from("blog").insert([payload]);

      if (error) showPopup("error", error.message);
      else showPopup("success", "Blog published successfully!");
    }
  };

  if (checkingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        <div className="p-6 bg-[var(--card)] backdrop-blur-md border border-white/20 shadow-lg rounded-2xl w-full max-w-md text-center">
          Checking session...
        </div>
      </div>
    );
  }

  return (
    <div className="content-editor max-w-7xl mx-auto p-4 relative min-h-screen">
      {popup && <Popup type={popup.type} message={popup.message} />}

      <div className="bg-gray-50 shadow-lg rounded-2xl p-6 sm:p-10 border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-semibold text-gray-800 flex items-center gap-2">
            {blogId ? (
              <>
                <FileEdit className="w-6 h-6 text-blue-600" /> Edit Blog Post
              </>
            ) : (
              <>
                <Rocket className="w-6 h-6 text-blue-600" /> Create a New Blog Post
              </>
            )}
          </h1>

          <div className="flex gap-3">
            <button
              onClick={() => navigate("/admin/blogs")}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium shadow-md cursor-pointer transition flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
          
          </div>
        </div>

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

        <label className="block text-gray-700 font-medium mb-1">Slug</label>
        <input
          type="text"
          placeholder="auto-generated or edit manually..."
          className="border border-gray-300 rounded-lg p-3 w-full mb-4 text-gray-800"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
        />

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 font-medium mb-1">Author</label>
            <input
              type="text"
              placeholder="Author name"
              className="border border-gray-300 rounded-lg p-3 w-full mb-4 text-gray-800"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">Category</label>
            <input
              type="text"
              placeholder="Category"
              className="border border-gray-300 rounded-lg p-3 w-full mb-4 text-gray-800"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 font-medium mb-1">Subcategory</label>
            <input
              type="text"
              placeholder="Subcategory"
              className="border border-gray-300 rounded-lg p-3 w-full mb-4 text-gray-800"
              value={subcategory}
              onChange={(e) => setSubcategory(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">Status</label>
            <input
              type="text"
              placeholder="Status"
              className="border border-gray-300 rounded-lg p-3 w-full mb-4 text-gray-800"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            />
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="block text-gray-700 font-medium mb-1">Date</label>
            <input
              type="date"
              className="border border-gray-300 rounded-lg p-3 w-full mb-4 text-gray-800"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">Reading Time</label>
            <input
              type="text"
              placeholder="e.g. 5 min"
              className="border border-gray-300 rounded-lg p-3 w-full mb-4 text-gray-800"
              value={readingTime}
              onChange={(e) => setReadingTime(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">Tags (comma separated)</label>
            <input
              type="text"
              placeholder="tag1, tag2"
              className="border border-gray-300 rounded-lg p-3 w-full mb-4 text-gray-800"
              value={tagsInput}
              onChange={(e) => {
                const next = e.target.value;
                setTagsInput(next);
                setTags(
                  next
                    .split(",")
                    .map((t) => t.trim())
                    .filter(Boolean)
                );
              }}
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 font-medium mb-1">SEO Title</label>
            <input
              type="text"
              placeholder="SEO Title"
              className="border border-gray-300 rounded-lg p-3 w-full mb-4 text-gray-800"
              value={seoTitle}
              onChange={(e) => setSeoTitle(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">SEO Description</label>
            <input
              type="text"
              placeholder="SEO Description"
              className="border border-gray-300 rounded-lg p-3 w-full mb-4 text-gray-800"
              value={seoDescription}
              onChange={(e) => setSeoDescription(e.target.value)}
            />
          </div>
        </div>

        <SupabaseImageUpload
          label="Cover Image"
          value={image}
          onChange={setImage}
          helperText="Uploads to Supabase and saves the public URL for this post."
          className="mb-4"
        />

        <label className="block text-gray-700 font-medium mb-1">YouTube Embed Code</label>
        <textarea
          placeholder="Paste video embed HTML..."
          className="border border-gray-300 rounded-lg p-3 w-full mb-4 text-gray-800 h-24"
          value={video}
          onChange={(e) => setVideo(e.target.value)}
        />

        <label className="block text-gray-700 font-medium mb-2">Blog Content</label>
        <div className="mb-6 rounded-lg border border-gray-200 bg-white p-3">
          <QuillEditor
            value={content}
            onChange={setContent}
            placeholder="Write and format your blog content..."
            note="Rich text with image upload & resize"
          />
        </div>

        <div className="flex items-center justify-between">
          <button
            onClick={handleSave}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium shadow-md cursor-pointer transition flex items-center gap-2"
          >
            {blogId ? (
              <>
                <Save className="w-5 h-5" /> Update Blog
              </>
            ) : (
              <>
                <Rocket className="w-5 h-5" /> Publish Blog
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

function Popup({ type, message }: { type: "success" | "error"; message: string }) {
  const Icon = type === "success" ? CheckCircle2 : XCircle;
  return (
    <div
      className={`fixed top-6 right-6 flex items-center gap-2 px-4 py-3 rounded-xl text-white shadow-lg transition-all z-[9999] ${
        type === "success" ? "bg-green-600" : "bg-red-600"
      }`}
    >
      <Icon className="w-5 h-5" />
      <span className="font-medium">{message}</span>
    </div>
  );
}
