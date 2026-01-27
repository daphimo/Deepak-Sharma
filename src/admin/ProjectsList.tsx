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

export default function ProjectsList() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<any[]>([]);
  const [selectedProjects, setSelectedProjects] = useState<number[]>([]);
  const [search, setSearch] = useState("");
  const [popup, setPopup] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const importInputRef = useRef<HTMLInputElement | null>(null);

  const showPopup = (type: "success" | "error", message: string) => {
    setPopup({ type, message });
    setTimeout(() => setPopup(null), 2500);
  };

  const fetchProjects = async () => {
    const { data, error } = await supabase
      .from("project")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) console.error(error);
    else setProjects(data);
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const slugify = (value: string) =>
    value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");

  const toggleSelectAll = () => {
    if (selectedProjects.length === filteredProjects.length) {
      setSelectedProjects([]);
    } else {
      setSelectedProjects(filteredProjects.map((p) => p.id));
    }
  };

  const toggleSelectProject = (id: number) => {
    setSelectedProjects((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const handleDeleteSelected = async () => {
    if (selectedProjects.length === 0) return;
    if (!window.confirm(`Delete ${selectedProjects.length} selected project(s)?`)) return;

    const { error } = await supabase.from("project").delete().in("id", selectedProjects);

    if (error) {
      console.error(error);
      showPopup("error", "Error deleting projects.");
    } else {
      setProjects((prev) => prev.filter((p) => !selectedProjects.includes(p.id)));
      setSelectedProjects([]);
      showPopup("success", "Deleted successfully.");
    }
  };

  const toCsvValue = (value: any) => {
    if (value === null || value === undefined) return '""';
    const normalized = Array.isArray(value) ? value.join("|") : value;
    const escaped = String(normalized).replace(/"/g, '""');
    return `"${escaped}"`;
  };

  const exportProjectsAsCsv = () => {
    if (!projects.length) {
      showPopup("error", "No projects to export.");
      return;
    }

    const columns = [
      "name",
      "slug",
      "project_url",
      "image",
      "mobile_image",
      "desktop_image",
      "category",
      "subcategory",
      "status",
      "type",
      "date",
      "designer",
      "location",
      "seo_title",
      "seo_description",
      "tags",
      "problems",
      "solutions",
      "results",
    ];

    const header = columns.join(",");
    const rows = projects.map((project) =>
      columns
        .map((key) => toCsvValue((project as any)[key] ?? ""))
        .join(",")
    );

    const blob = new Blob([header + "\n" + rows.join("\n")], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "projects.csv";
    link.click();
    URL.revokeObjectURL(url);
    showPopup("success", "Projects exported.");
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

  const importProjectsFromCsv = async (file: File) => {
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
        const name = getValue(row, "name");
        const slugFromFile = getValue(row, "slug");
        const tagValue = getValue(row, "tags");
        const tagsArray = tagValue
          ? tagValue.split(/[\|;]/).map((t) => t.trim()).filter(Boolean)
          : null;

        const derivedSlug = slugFromFile || (name ? slugify(name) : "");

        if (!name && !derivedSlug) return null;

        const fallbackName = name || `Project ${index + 1}`;
        const fallbackSeoTitle = getValue(row, "seo_title") || fallbackName;
        const fallbackSeoDescription =
          getValue(row, "seo_description") || fallbackSeoTitle;

        return {
          name: fallbackName,
          slug: derivedSlug || `project-${Date.now()}-${index}`,
          project_url: getValue(row, "project_url") || "",
          image: getValue(row, "image") || "",
          mobile_image: getValue(row, "mobile_image") || "",
          desktop_image: getValue(row, "desktop_image") || "",
          category: getValue(row, "category") || "",
          subcategory: getValue(row, "subcategory") || "",
          status: getValue(row, "status") || "",
          type: getValue(row, "type") || "",
          date: getValue(row, "date") || "",
          designer: getValue(row, "designer") || "",
          location: getValue(row, "location") || "",
          seo_title: fallbackSeoTitle,
          seo_description: fallbackSeoDescription,
          tags: tagsArray && tagsArray.length ? tagsArray : [],
          problems: getValue(row, "problems") || "",
          solutions: getValue(row, "solutions") || "",
          results: getValue(row, "results") || "",
        };
      })
      .filter(Boolean);

    if (!payload.length) {
      showPopup("error", "No valid rows found to import.");
      return;
    }

    const payloadWithSlug = payload.filter((item) => item && item.slug) as Array<{
      slug: string;
    }>;
    const slugs = payloadWithSlug.map((item) => item.slug);

    const { data: existingRows, error: existingError } = await supabase
      .from("project")
      .select("slug")
      .in("slug", slugs);

    if (existingError) {
      console.error(existingError);
      showPopup("error", "Could not check existing projects.");
      return;
    }

    const existingSlugs = new Set((existingRows ?? []).map((row) => row.slug));
    const newPayload = payloadWithSlug.filter((item) => !existingSlugs.has(item.slug));

    if (!newPayload.length) {
      showPopup("success", "All rows already exist (duplicate slugs).");
      return;
    }

    const { error } = await supabase.from("project").insert(newPayload as any[]);

    if (error) {
      console.error(error);
      showPopup("error", "Import failed.");
    } else {
      showPopup("success", "Projects imported.");
      fetchProjects();
    }
  };

  const handleImportChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    await importProjectsFromCsv(file);
    event.target.value = "";
  };

  const duplicateSelected = async () => {
    if (!selectedProjects.length) return;
    const { data, error } = await supabase
      .from("project")
      .select("*")
      .in("id", selectedProjects);

    if (error || !data) {
      console.error(error);
      showPopup("error", "Could not duplicate projects.");
      return;
    }

    const timestamp = Date.now();
    const copies = data.map((project, index) => {
      const baseSlug =
        project.slug ||
        (project.name ? slugify(project.name) : `project-${project.id || index}`);
      return {
        name: `${project.name || "Untitled Project"} (Copy)`,
        slug: `${baseSlug}-copy-${timestamp + index}`,
        project_url: project.project_url || null,
        image: project.image || null,
        mobile_image: project.mobile_image || null,
        desktop_image: project.desktop_image || null,
        category: project.category || null,
        subcategory: project.subcategory || null,
        status: project.status || null,
        type: project.type || null,
        date: project.date || null,
        designer: project.designer || null,
        location: project.location || null,
        seo_title: project.seo_title || null,
        seo_description: project.seo_description || null,
        tags: project.tags || null,
        problems: project.problems || null,
        solutions: project.solutions || null,
        results: project.results || null,
      };
    });

    const { error: insertError } = await supabase.from("project").insert(copies);

    if (insertError) {
      console.error(insertError);
      showPopup("error", "Could not duplicate projects.");
    } else {
      showPopup("success", "Projects duplicated.");
      setSelectedProjects([]);
      fetchProjects();
    }
  };

  const filteredProjects = projects.filter((project) => {
    if (!search.trim()) return true;
    const term = search.toLowerCase();
    return (
      project.name?.toLowerCase().includes(term) ||
      project.slug?.toLowerCase().includes(term)
    );
  });

  return (
    <div className="space-y-6 text-black">
      {popup && <Popup type={popup.type} message={popup.message} />}

      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold flex items-center gap-2">Projects</h2>
        <div className="flex gap-3 items-center flex-wrap justify-end">
          <input
            type="text"
            placeholder="Search by name or slug..."
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-800 w-56"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button
            onClick={exportProjectsAsCsv}
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
          {selectedProjects.length > 0 && (
            <>
              <button
                onClick={duplicateSelected}
                className="bg-yellow-100 hover:bg-yellow-200 text-yellow-700 px-3 py-2 rounded-lg flex items-center gap-2 cursor-pointer text-sm"
              >
                <Copy className="w-4 h-4" /> Duplicate ({selectedProjects.length})
              </button>
              <button
                onClick={handleDeleteSelected}
                className="bg-red-100 hover:bg-red-200 text-red-700 px-3 py-2 rounded-lg flex items-center gap-2 cursor-pointer text-sm"
              >
                <Trash2 className="w-4 h-4" /> Delete ({selectedProjects.length})
              </button>
            </>
          )}
          <button
            onClick={() => navigate("/admin/projects/project-editor")}
            className="bg-sky-100 hover:bg-sky-200 text-sky-700 px-4 py-2 rounded-lg flex items-center gap-2 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" /> Add Project
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between text-sm text-gray-600">
        <span>{filteredProjects.length} project(s)</span>
        <button
          onClick={toggleSelectAll}
          className="text-blue-600 hover:text-blue-700 font-medium"
        >
          {selectedProjects.length === filteredProjects.length
            ? "Clear selection"
            : "Select all in view"}
        </button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((project) => {
          const isSelected = selectedProjects.includes(project.id);
          return (
            <div
              key={project.id}
              className={`relative bg-white border border-gray-200 rounded-xl shadow hover:shadow-lg transition overflow-hidden ${
                isSelected ? "ring-2 ring-red-300" : ""
              }`}
              onClick={() => navigate(`/admin/projects/project-editor?id=${project.id}`)}
            >
              {project.image && (
                <img
                  src={project.image}
                  alt={project.name}
                  className="h-40 w-full object-cover"
                />
              )}
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900">{project.name}</h3>
                {project.slug && <p className="text-sm text-gray-600 mt-1">/{project.slug}</p>}
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleSelectProject(project.id);
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
      className={`fixed top-6 right-6 flex items-center gap-2 px-4 py-3 rounded-xl text-white shadow-lg transition-all z-[9999] ${
        type === "success" ? "bg-green-600" : "bg-red-600"
      }`}
    >
      <Icon className="w-5 h-5" />
      <span className="font-medium">{message}</span>
    </div>
  );
}
