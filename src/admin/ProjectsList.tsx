import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { Trash2, PlusCircle, CheckCircle2, XCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ProjectsList() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<any[]>([]);
  const [selectedProjects, setSelectedProjects] = useState<number[]>([]);
  const [popup, setPopup] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const showPopup = (type: "success" | "error", message: string) => {
    setPopup({ type, message });
    setTimeout(() => setPopup(null), 2500);
  };

  const fetchProjects = async () => {
    const { data, error } = await supabase
      .from("projects")
      .select("id, title, description, image_url, created_at")
      .order("created_at", { ascending: false });

    if (error) console.error(error);
    else setProjects(data);
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const toggleSelectProject = (id: number) => {
    setSelectedProjects((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const handleDeleteSelected = async () => {
    if (selectedProjects.length === 0) return;
    if (!window.confirm(`Delete ${selectedProjects.length} selected project(s)?`)) return;

    const { error } = await supabase.from("projects").delete().in("id", selectedProjects);

    if (error) {
      console.error(error);
      showPopup("error", "Error deleting projects.");
    } else {
      setProjects((prev) => prev.filter((p) => !selectedProjects.includes(p.id)));
      setSelectedProjects([]);
      showPopup("success", "Deleted successfully.");
    }
  };

  return (
    <div>
      {popup && <Popup type={popup.type} message={popup.message} />}

      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
          Projects
        </h2>
        <div className="flex gap-3">
          {selectedProjects.length > 0 && (
            <button
              onClick={handleDeleteSelected}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" /> Delete ({selectedProjects.length})
            </button>
          )}
          <button
            onClick={() => navigate("/project-editor")}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <PlusCircle className="w-4 h-4" /> Add Project
          </button>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => {
          const isSelected = selectedProjects.includes(project.id);
          return (
            <div
              key={project.id}
              className={`relative bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden border ${
                isSelected ? "border-red-400 ring-2 ring-red-300" : "border-gray-100"
              }`}
            >
              {project.image_url && (
                <img
                  src={project.image_url}
                  alt={project.title}
                  className="h-40 w-full object-cover"
                />
              )}
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800">{project.title}</h3>
                <p className="text-sm text-gray-500 mt-1">{project.description}</p>
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
      className={`fixed top-6 right-6 flex items-center gap-2 px-4 py-3 rounded-xl text-white shadow-lg transition-all z-50 ${
        type === "success" ? "bg-green-600" : "bg-red-600"
      }`}
    >
      <Icon className="w-5 h-5" />
      <span className="font-medium">{message}</span>
    </div>
  );
}
