// src/admin/ProjectEditor.tsx
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle2,
  FileEdit,
  Rocket,
  Save,
  XCircle,
} from "lucide-react";
import { supabase } from "../lib/supabaseClient";
import { useRequireAuth } from "./useRequireAuth";
import { QuillEditor } from "../components/QuillEditor";
import { SupabaseImageUpload } from "../components/SupabaseImageUpload";

export default function ProjectEditor() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const projectId = params.get("id");

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [projectUrl, setProjectUrl] = useState("");
  const [image, setImage] = useState("");
  const [mobileImage, setMobileImage] = useState("");
  const [desktopImage, setDesktopImage] = useState("");
  const [category, setCategory] = useState("");
  const [subcategory, setSubcategory] = useState("");
  const [status, setStatus] = useState("");
  const [type, setType] = useState("");
  const [date, setDate] = useState("");
  const [designer, setDesigner] = useState("");
  const [location, setLocation] = useState("");
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDescription, setSeoDescription] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagsInput, setTagsInput] = useState("");
  const [problems, setProblems] = useState("");
  const [results, setResults] = useState("");
  const [solutions, setSolutions] = useState("");

  const checkingAuth = useRequireAuth();

  const [popup, setPopup] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const showPopup = (type: "success" | "error", message: string) => {
    setPopup({ type, message });
    setTimeout(() => setPopup(null), 2500);
  };

  useEffect(() => {
    const fetchProject = async () => {
      if (!projectId) return;
      const { data, error } = await supabase
        .from("project")
        .select("*")
        .eq("id", projectId)
        .single();

      if (!error && data) {
        const fetchedTags = ((data as any).tags || []) as string[];

        setName((data as any).name || "");
        setSlug((data as any).slug || "");
        setProjectUrl((data as any).project_url || "");
        setImage((data as any).image || "");
        setMobileImage((data as any).mobile_image || "");
        setDesktopImage((data as any).desktop_image || "");
        setCategory((data as any).category || "");
        setSubcategory((data as any).subcategory || "");
        setStatus((data as any).status || "");
        setType((data as any).type || "");
        setDate((data as any).date || "");
        setDesigner((data as any).designer || "");
        setLocation((data as any).location || "");
        setSeoTitle((data as any).seo_title || "");
        setSeoDescription((data as any).seo_description || "");
        setTags(fetchedTags);
        setTagsInput(fetchedTags.join(", "));
        setProblems((data as any).problems || "");
        setResults((data as any).results || "");
        setSolutions((data as any).solutions || "");
      }
    };
    if (!checkingAuth) fetchProject();
  }, [checkingAuth, projectId]);

  const handleSave = async () => {
    if (!name || !slug || !projectUrl) {
      showPopup("error", "Name, slug, and URL are required!");
      return;
    }

    const projectData = {
      name,
      slug,
      project_url: projectUrl,
      image: image || null,
      mobile_image: mobileImage || null,
      desktop_image: desktopImage || null,
      category,
      subcategory,
      status,
      type,
      date,
      designer,
      location,
      seo_title: seoTitle,
      seo_description: seoDescription,
      tags: tags && tags.length ? tags : null,
      problems: problems || null,
      results: results || null,
      solutions: solutions || null,
    };

    if (projectId) {
      const { error } = await supabase
        .from("project")
        .update(projectData)
        .eq("id", projectId);

      if (error) showPopup("error", error.message);
      else showPopup("success", "Project updated successfully!");
    } else {
      const { error } = await supabase.from("project").insert([projectData]);
      if (error) showPopup("error", error.message);
      else showPopup("success", "Project added successfully!");
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

      <div className="bg-gray-50 shadow-lg rounded-2xl p-6 sm:p-10 border border-gray-200 text-black">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-semibold text-gray-800 flex items-center gap-2">
            {projectId ? (
              <>
                <FileEdit className="w-6 h-6 text-blue-600" /> Edit Project
              </>
            ) : (
              <>
                <Rocket className="w-6 h-6 text-blue-600" /> Add New Project
              </>
            )}
          </h1>

          <div className="flex gap-3">
            <button
              onClick={() => navigate("/admin/projects")}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium shadow-md cursor-pointer transition flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
          </div>
        </div>

        <label className="block  font-medium mb-1">
          Project Name
        </label>
        <input
          type="text"
          placeholder="Enter project name..."
          className="border border-gray-300 rounded-lg p-3 w-full mb-4 text-gray-800"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            setSlug(e.target.value.toLowerCase().replace(/\s+/g, "-"));
          }}
        />

        <label className="block  font-medium mb-1">Slug</label>
        <input
          type="text"
          placeholder="project-slug"
          className="border border-gray-300 rounded-lg p-3 w-full mb-4 text-gray-800"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
        />

        <label className="block  font-medium mb-1">
          Project URL
        </label>
        <input
          type="text"
          placeholder="Enter live/demo/project URL..."
          className="border border-gray-300 rounded-lg p-3 w-full mb-4 text-gray-800"
          value={projectUrl}
          onChange={(e) => setProjectUrl(e.target.value)}
        />

        <SupabaseImageUpload
          label="Image"
          value={image}
          onChange={setImage}
          helperText="Primary cover image for project detail and cards."
          className="mb-4"
        />
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <SupabaseImageUpload
            label="Mobile Image"
            value={mobileImage}
            onChange={setMobileImage}
            helperText="Used for narrow/mobile layouts."
          />
          <SupabaseImageUpload
            label="Desktop Image"
            value={desktopImage}
            onChange={setDesktopImage}
            helperText="Used for wide/desktop layouts."
          />
        </div>

        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block  font-medium mb-1">
              Category
            </label>
            <input
              type="text"
              placeholder="Category"
              className="border border-gray-300 rounded-lg p-3 w-full text-gray-800"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />
          </div>
          <div>
            <label className="block  font-medium mb-1">
              Subcategory
            </label>
            <input
              type="text"
              placeholder="Subcategory"
              className="border border-gray-300 rounded-lg p-3 w-full text-gray-800"
              value={subcategory}
              onChange={(e) => setSubcategory(e.target.value)}
            />
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block  font-medium mb-1">
              Status
            </label>
            <input
              type="text"
              placeholder="Status"
              className="border border-gray-300 rounded-lg p-3 w-full text-gray-800"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            />
          </div>
          <div>
            <label className="block  font-medium mb-1">
              Type
            </label>
            <input
              type="text"
              placeholder="Type"
              className="border border-gray-300 rounded-lg p-3 w-full text-gray-800"
              value={type}
              onChange={(e) => setType(e.target.value)}
            />
          </div>
          <div>
            <label className="block  font-medium mb-1">Date</label>
            <input
              type="date"
              className="border border-gray-300 rounded-lg p-3 w-full text-gray-800"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
          <div>
            <label className="block  font-medium mb-1">
              Designer
            </label>
            <input
              type="text"
              placeholder="Designer"
              className="border border-gray-300 rounded-lg p-3 w-full text-gray-800"
              value={designer}
              onChange={(e) => setDesigner(e.target.value)}
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block  font-medium mb-1">
              Location
            </label>
            <input
              type="text"
              placeholder="Location"
              className="border border-gray-300 rounded-lg p-3 w-full text-gray-800"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
          <div>
            <label className="block  font-medium mb-1">
              Tags (comma separated)
            </label>
            <input
              type="text"
              placeholder="tag1, tag2"
              className="border border-gray-300 rounded-lg p-3 w-full text-gray-800"
              value={tagsInput}
              onChange={(e) => {
                const value = e.target.value;
                setTagsInput(value);
                setTags(
                  value
                    .split(",")
                    .map((t) => t.trim())
                    .filter(Boolean)
                );
              }}
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block  font-medium mb-1">
              SEO Title
            </label>
            <input
              type="text"
              placeholder="SEO Title"
              className="border border-gray-300 rounded-lg p-3 w-full text-gray-800"
              value={seoTitle}
              onChange={(e) => setSeoTitle(e.target.value)}
            />
          </div>
          <div>
            <label className="block  font-medium mb-1">
              SEO Description
            </label>
            <input
              type="text"
              placeholder="SEO Description"
              className="border border-gray-300 rounded-lg p-3 w-full text-gray-800"
              value={seoDescription}
              onChange={(e) => setSeoDescription(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 mb-8">
          <QuillEditor
            label="Problems"
            value={problems}
            placeholder="Describe the challenge, constraints, and pain points..."
            onChange={setProblems}
          />
          <QuillEditor
            label="Solutions"
            value={solutions}
            placeholder="Highlight the approach, decisions, tools, and collaboration..."
            onChange={setSolutions}
          />
          <QuillEditor
            label="Results"
            value={results}
            placeholder="Summarize the measurable impact, learnings, and next steps..."
            onChange={setResults}
          />
        </div>

        <div className="flex items-center justify-between">
          <button
            onClick={handleSave}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium shadow-md cursor-pointer transition flex items-center gap-2"
          >
            {projectId ? (
              <>
                <Save className="w-5 h-5" /> Update Project
              </>
            ) : (
              <>
                <Rocket className="w-5 h-5" /> Add Project
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

function Popup({
  type,
  message,
}: {
  type: "success" | "error";
  message: string;
}) {
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
