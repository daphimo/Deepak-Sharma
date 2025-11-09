// src/admin/ProjectEditor.tsx
import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import Magnet from "../assets/components/Magnet";
import {
  Lock,
  ArrowLeft,
  LogOut,
  FileEdit,
  Rocket,
  Save,
  CheckCircle2,
  XCircle,
} from "lucide-react";

export default function ProjectEditor() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const projectId = params.get("id");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [url, setUrl] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [techs, setTechs] = useState("");
  const [type, setType] = useState("");

  // 🔐 Auth
  const ADMIN_PASSWORD = "monkeytyper";
  const STORAGE_KEY = "admin_auth";
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [enteredPassword, setEnteredPassword] = useState("");

  // Popup system
  const [popup, setPopup] = useState<{ type: "success" | "error"; message: string } | null>(
    null
  );

  const showPopup = (type: "success" | "error", message: string) => {
    setPopup({ type, message });
    setTimeout(() => setPopup(null), 2500);
  };

  // 🔑 Load saved auth
  useEffect(() => {
    const savedAuth = localStorage.getItem(STORAGE_KEY);
    if (savedAuth === ADMIN_PASSWORD) setIsAuthenticated(true);
  }, []);

  const handleLogin = () => {
    if (enteredPassword === ADMIN_PASSWORD) {
      localStorage.setItem(STORAGE_KEY, ADMIN_PASSWORD);
      setIsAuthenticated(true);
      showPopup("success", "Welcome back, Admin!");
    } else showPopup("error", "Incorrect password!");
  };

  const handleLogout = () => {
    localStorage.removeItem(STORAGE_KEY);
    setIsAuthenticated(false);
    showPopup("success", "Logged out successfully.");
  };

  // 🧠 Fetch existing project if editing
  useEffect(() => {
    const fetchProject = async () => {
      if (!projectId) return;
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("id", projectId)
        .single();

      if (!error && data) {
        setTitle(data.title || "");
        setDescription(data.description || "");
        setUrl(data.url || "");
        setImageUrl(data.image_url || "");
        setTechs(data.techs || "");
        setType(data.type || "");
      }
    };
    if (isAuthenticated) fetchProject();
  }, [isAuthenticated, projectId]);

  // 💾 Save project
  const handleSave = async () => {
    if (!title || !description || !url) {
      showPopup("error", "Title, description, and URL are required!");
      return;
    }

    const projectData = {
      title,
      description,
      url,
      image_url: imageUrl || null,
      techs: techs || null,
      type: type || null,
    };

    if (projectId) {
      const { error } = await supabase
        .from("projects")
        .update(projectData)
        .eq("id", projectId);

      if (error) showPopup("error", error.message);
      else showPopup("success", "Project updated successfully!");
    } else {
      const { error } = await supabase.from("projects").insert([projectData]);
      if (error) showPopup("error", error.message);
      else showPopup("success", "Project added successfully!");
    }
  };

  // 🔒 Login screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        {popup && <Popup type={popup.type} message={popup.message} />}
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
              <FileEdit className="w-4 h-4" /> Enter
            </button>
          </Magnet>
        </div>
      </div>
    );
  }

  // 📝 Project Editor UI
  return (
    <div className="content-editor max-w-7xl mx-auto px-4 py-24 relative ">
      {popup && <Popup type={popup.type} message={popup.message} />}

      <div className="bg-white shadow-lg rounded-2xl p-6 sm:p-10 border border-gray-100">
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
              onClick={() => navigate("/admin")}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium shadow-md cursor-pointer transition flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium shadow-md cursor-pointer transition flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" /> Logout
            </button>
          </div>
        </div>

        {/* Title */}
        <label className="block text-gray-700 font-medium mb-1">Project Title</label>
        <input
          type="text"
          placeholder="Enter project title..."
          className="border border-gray-300 rounded-lg p-3 w-full mb-4 text-gray-800"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        {/* Description */}
        <label className="block text-gray-700 font-medium mb-1">Description</label>
        <textarea
          placeholder="Enter project description..."
          className="border border-gray-300 rounded-lg p-3 w-full mb-4 text-gray-800 h-32"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        {/* URL */}
        <label className="block text-gray-700 font-medium mb-1">Project URL</label>
        <input
          type="text"
          placeholder="Enter live/demo/project URL..."
          className="border border-gray-300 rounded-lg p-3 w-full mb-4 text-gray-800"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />

        {/* Image URL */}
        <label className="block text-gray-700 font-medium mb-1">Image URL</label>
        <input
          type="text"
          placeholder="Enter image URL..."
          className="border border-gray-300 rounded-lg p-3 w-full mb-4 text-gray-800"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
        />

        {/* Techs */}
        <label className="block text-gray-700 font-medium mb-1">Techs (comma-separated)</label>
        <input
          type="text"
          placeholder="e.g. React, Node.js, Tailwind, Supabase"
          className="border border-gray-300 rounded-lg p-3 w-full mb-4 text-gray-800"
          value={techs}
          onChange={(e) => setTechs(e.target.value)}
        />

        {/* Type */}
        <label className="block text-gray-700 font-medium mb-1">Project Type</label>
        <input
          type="text"
          placeholder="e.g. Web App, Mobile App, Shopify Store"
          className="border border-gray-300 rounded-lg p-3 w-full mb-6 text-gray-800"
          value={type}
          onChange={(e) => setType(e.target.value)}
        />

        {/* Save Button */}
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
