import { type ChangeEvent, useEffect, useRef, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import {
  Trash2,
  PlusCircle,
  CheckCircle2,
  XCircle,
  Download,
  Upload,
  Copy,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function BlogsList() {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState<any[]>([]);
  const [selectedBlogs, setSelectedBlogs] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [popup, setPopup] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const importInputRef = useRef<HTMLInputElement | null>(null);

  const showPopup = (type: "success" | "error", message: string) => {
    setPopup({ type, message });
    setTimeout(() => setPopup(null), 2500);
  };

  const fetchBlogs = async () => {
    const { data, error } = await supabase
      .from("blog")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) console.error(error);
    else setBlogs(data);
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const slugify = (value: string) =>
    value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");

  const toggleSelectAll = () => {
    if (selectedBlogs.length === filteredBlogs.length) {
      setSelectedBlogs([]);
    } else {
      setSelectedBlogs(filteredBlogs.map((b) => b.id));
    }
  };

  const toggleSelectBlog = (id: string) => {
    setSelectedBlogs((prev) =>
      prev.includes(id) ? prev.filter((b) => b !== id) : [...prev, id]
    );
  };

  const handleDeleteSelected = async () => {
    if (selectedBlogs.length === 0) return;
    if (!window.confirm(`Delete ${selectedBlogs.length} selected blog(s)?`)) return;

    const { error } = await supabase.from("blog").delete().in("id", selectedBlogs);

    if (error) {
      console.error(error);
      showPopup("error", "Error deleting blogs.");
    } else {
      setBlogs((prev) => prev.filter((b) => !selectedBlogs.includes(b.id)));
      setSelectedBlogs([]);
      showPopup("success", "Deleted successfully.");
    }
  };

  const toCsvValue = (value: any) => {
    if (value === null || value === undefined) return '""';
    const normalized = Array.isArray(value) ? value.join("|") : value;
    const escaped = String(normalized).replace(/"/g, '""');
    return `"${escaped}"`;
  };

  const exportBlogsAsCsv = () => {
    if (!blogs.length) {
      showPopup("error", "No blogs to export.");
      return;
    }

    const columns = [
      "title",
      "slug",
      "author",
      "category",
      "subcategory",
      "status",
      "date",
      "reading_time",
      "seo_title",
      "seo_description",
      "image",
      "video",
      "tags",
      "content",
    ];

    const header = columns.join(",");
    const rows = blogs.map((blog) =>
      columns
        .map((key) => toCsvValue((blog as any)[key] ?? ""))
        .join(",")
    );

    const blob = new Blob([header + "\n" + rows.join("\n")], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "blogs.csv";
    link.click();
    URL.revokeObjectURL(url);
    showPopup("success", "Blogs exported.");
  };

  const parseCsvText = (text: string) => {
    const rows: string[][] = [];
    let current = "";
    let inQuotes = false;
    let row: string[] = [];

    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      if (char === '"') {
        if (inQuotes && text[i + 1] === '"') {
          current += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === "," && !inQuotes) {
        row.push(current);
        current = "";
      } else if ((char === "\n" || char === "\r") && !inQuotes) {
        if (char === "\r" && text[i + 1] === "\n") i++;
        row.push(current);
        rows.push(row);
        row = [];
        current = "";
      } else {
        current += char;
      }
    }

    if (current.length || row.length) {
      row.push(current);
      rows.push(row);
    }

    return rows.filter((r) => r.some((cell) => cell.trim().length));
  };

  const importBlogsFromCsv = async (file: File) => {
    const text = await file.text();
    const parsed = parseCsvText(text);
    if (!parsed.length) {
      showPopup("error", "CSV is empty.");
      return;
    }

    const headers = parsed[0].map((h) => h.trim());
    const rows = parsed.slice(1);

    const getValue = (row: string[], key: string) => {
      const idx = headers.indexOf(key);
      return idx >= 0 ? row[idx]?.trim() ?? "" : "";
    };

    const payload = rows
      .map((row, index) => {
        const title = getValue(row, "title");
        const slugFromFile = getValue(row, "slug");
        const tagValue = getValue(row, "tags");
        const tagsArray = tagValue
          ? tagValue.split(/[\|;]/).map((t) => t.trim()).filter(Boolean)
          : null;

        const derivedSlug = slugFromFile || (title ? slugify(title) : "");

        if (!title && !derivedSlug) return null;

        return {
          title: title || `Blog ${index + 1}`,
          slug: derivedSlug || `blog-${Date.now()}-${index}`,
          author: getValue(row, "author") || null,
          category: getValue(row, "category") || null,
          subcategory: getValue(row, "subcategory") || null,
          status: getValue(row, "status") || null,
          date: getValue(row, "date") || null,
          reading_time: getValue(row, "reading_time") || null,
          seo_title: getValue(row, "seo_title") || null,
          seo_description: getValue(row, "seo_description") || null,
          image: getValue(row, "image") || null,
          video: getValue(row, "video") || null,
          tags: tagsArray && tagsArray.length ? tagsArray : null,
          content: getValue(row, "content") || null,
        };
      })
      .filter(Boolean);

    if (!payload.length) {
      showPopup("error", "No valid rows found to import.");
      return;
    }

    const { error } = await supabase.from("blog").insert(payload as any[]);

    if (error) {
      console.error(error);
      showPopup("error", "Import failed.");
    } else {
      showPopup("success", "Blogs imported.");
      fetchBlogs();
    }
  };

  const handleImportChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    await importBlogsFromCsv(file);
    event.target.value = "";
  };

  const duplicateSelected = async () => {
    if (!selectedBlogs.length) return;
    const { data, error } = await supabase
      .from("blog")
      .select("*")
      .in("id", selectedBlogs);

    if (error || !data) {
      console.error(error);
      showPopup("error", "Could not duplicate blogs.");
      return;
    }

    const timestamp = Date.now();
    const copies = data.map((blog, index) => {
      const baseSlug =
        blog.slug || (blog.title ? slugify(blog.title) : `blog-${blog.id || index}`);
      return {
        title: `${blog.title || "Untitled Blog"} (Copy)`,
        slug: `${baseSlug}-copy-${timestamp + index}`,
        author: blog.author || null,
        category: blog.category || null,
        subcategory: blog.subcategory || null,
        status: blog.status || null,
        date: blog.date || null,
        reading_time: blog.reading_time || null,
        seo_title: blog.seo_title || null,
        seo_description: blog.seo_description || null,
        image: blog.image || null,
        video: blog.video || null,
        tags: blog.tags || null,
        content: blog.content || null,
      };
    });

    const { error: insertError } = await supabase.from("blog").insert(copies);

    if (insertError) {
      console.error(insertError);
      showPopup("error", "Could not duplicate blogs.");
    } else {
      showPopup("success", "Blogs duplicated.");
      setSelectedBlogs([]);
      fetchBlogs();
    }
  };

  const filteredBlogs = blogs.filter((blog) => {
    if (!search.trim()) return true;
    const term = search.toLowerCase();
    return (
      blog.title?.toLowerCase().includes(term) ||
      blog.slug?.toLowerCase().includes(term)
    );
  });

  return (
    <div className="space-y-6 text-black">
      {popup && <Popup type={popup.type} message={popup.message} />}

      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold flex items-center gap-2">Blogs</h2>
        <div className="flex gap-3 items-center flex-wrap justify-end">
          <input
            type="text"
            placeholder="Search by title or slug..."
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-800 w-56"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button
            onClick={exportBlogsAsCsv}
            className="bg-emerald-100 hover:bg-emerald-200 text-emerald-700 px-3 py-2 rounded-lg flex items-center gap-2 cursor-pointer text-sm"
          >
            <Download className="w-4 h-4" /> Export CSV
          </button>
          <button
            onClick={() => importInputRef.current?.click()}
            className="bg-indigo-100 hover:bg-indigo-200 text-indigo-700 px-3 py-2 rounded-lg flex items-center gap-2 cursor-pointer text-sm"
          >
            <Upload className="w-4 h-4" /> Import CSV
          </button>
          <input
            ref={importInputRef}
            type="file"
            accept=".csv,text/csv"
            className="hidden"
            onChange={handleImportChange}
          />
          {selectedBlogs.length > 0 && (
            <>
              <button
                onClick={duplicateSelected}
                className="bg-yellow-100 hover:bg-yellow-200 text-yellow-700 px-3 py-2 rounded-lg flex items-center gap-2 cursor-pointer text-sm"
              >
                <Copy className="w-4 h-4" /> Duplicate ({selectedBlogs.length})
              </button>
              <button
                onClick={handleDeleteSelected}
                className="bg-red-100 hover:bg-red-200 text-red-700 px-3 py-2 rounded-lg flex items-center gap-2 cursor-pointer"
              >
                <Trash2 className="w-4 h-4" /> Delete ({selectedBlogs.length})
              </button>
            </>
          )}
          <button
            onClick={() => navigate("/admin/blogs/blog-editor")}
            className="bg-sky-100 hover:bg-sky-200 text-sky-700 px-4 py-2 rounded-lg flex items-center gap-2 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" /> Add Blog
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between text-sm text-gray-600">
        <span>{filteredBlogs.length} blog(s)</span>
        <button
          onClick={toggleSelectAll}
          className="text-blue-600 hover:text-blue-700 font-medium"
        >
          {selectedBlogs.length === filteredBlogs.length
            ? "Clear selection"
            : "Select all in view"}
        </button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBlogs.map((blog) => {
          const isSelected = selectedBlogs.includes(blog.id);
          return (
            <div
              key={blog.id}
              className={`relative bg-white border border-gray-200 rounded-xl shadow hover:shadow-lg transition overflow-hidden ${
                isSelected ? "ring-2 ring-red-300" : ""
              }`}
              onClick={() => navigate(`/admin/blogs/blog-editor?id=${blog.id}`)}
            >
              {blog.image && (
                <img src={blog.image} alt={blog.title} className="h-40 w-full object-cover" />
              )}
              <div className="p-4 space-y-1">
                <h3 className="text-lg font-semibold text-gray-900">{blog.title}</h3>
                <p className="text-xs text-gray-500">
                  {new Date(blog.created_at).toLocaleDateString()}
                </p>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleSelectBlog(blog.id);
                }}
                className={`absolute bottom-3 right-3 px-3 py-1.5 rounded-lg text-sm font-medium shadow-md flex items-center gap-1 cursor-pointer ${
                  isSelected ? "bg-red-600 text-white" : "bg-sky-600 text-white"
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
      className={`fixed top-6 right-6 flex items-center gap-2 px-4 py-3 rounded-xl text-white shadow-lg transition-all z-[9999] ${
        type === "success" ? "bg-green-600" : "bg-red-600"
      }`}
    >
      <Icon className="w-5 h-5" />
      <span className="font-medium">{message}</span>
    </div>
  );
}
