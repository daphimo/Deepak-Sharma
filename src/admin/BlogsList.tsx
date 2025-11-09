import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { Trash2, PlusCircle, CheckCircle2, XCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function BlogsList() {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState<any[]>([]);
  const [selectedBlogs, setSelectedBlogs] = useState<string[]>([]);
  const [popup, setPopup] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const showPopup = (type: "success" | "error", message: string) => {
    setPopup({ type, message });
    setTimeout(() => setPopup(null), 2500);
  };

  const fetchBlogs = async () => {
    const { data, error } = await supabase
      .from("blogs")
      .select("id, title, slug, cover_image, created_at")
      .order("created_at", { ascending: false });

    if (error) console.error(error);
    else setBlogs(data);
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const toggleSelectBlog = (id: string) => {
    setSelectedBlogs((prev) =>
      prev.includes(id) ? prev.filter((b) => b !== id) : [...prev, id]
    );
  };

  const handleDeleteSelected = async () => {
    if (selectedBlogs.length === 0) return;
    if (!window.confirm(`Delete ${selectedBlogs.length} selected blog(s)?`)) return;

    const { error } = await supabase.from("blogs").delete().in("id", selectedBlogs);

    if (error) {
      console.error(error);
      showPopup("error", "Error deleting blogs.");
    } else {
      setBlogs((prev) => prev.filter((b) => !selectedBlogs.includes(b.id)));
      setSelectedBlogs([]);
      showPopup("success", "Deleted successfully.");
    }
  };

  return (
    <div>
      {popup && <Popup type={popup.type} message={popup.message} />}

      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
          Blogs
        </h2>
        <div className="flex gap-3">
          {selectedBlogs.length > 0 && (
            <button
              onClick={handleDeleteSelected}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" /> Delete ({selectedBlogs.length})
            </button>
          )}
          <button
            onClick={() => navigate("/blogs-editor")}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <PlusCircle className="w-4 h-4" /> Add Blog
          </button>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogs.map((blog) => {
          const isSelected = selectedBlogs.includes(blog.id);
          return (
            <div
              key={blog.id}
              className={`relative bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden border ${
                isSelected ? "border-red-400 ring-2 ring-red-300" : "border-gray-100"
              }`}
              onClick={() => navigate(`/editor?id=${blog.id}`)}
            >
              {blog.cover_image && (
                <img src={blog.cover_image} alt={blog.title} className="h-40 w-full object-cover" />
              )}
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800">{blog.title}</h3>
                <p className="text-sm text-gray-500 mt-1">
                  {new Date(blog.created_at).toLocaleDateString()}
                </p>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleSelectBlog(blog.id);
                }}
                className={`absolute bottom-3 right-3 px-3 py-1.5 rounded-lg text-sm font-medium shadow-md flex items-center gap-1 ${
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
    </div>
  );
}

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
