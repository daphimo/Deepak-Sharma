import { useState } from "react";
import { LogOut, BookOpen, FolderGit2 } from "lucide-react";
import BlogsList from "./BlogsList";
import ProjectsList from "./ProjectsList";

export default function Admin() {
  const [activeTab, setActiveTab] = useState<"blogs" | "projects">("blogs");

  const handleLogout = () => {
    localStorage.removeItem("admin_auth");
    window.location.reload();
  };

  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-800 fixed inset-0 z-[99999]">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg border-r border-gray-100 flex flex-col">
        <div className="px-6 py-6 border-b border-gray-100">
          <h1 className="text-xl font-bold flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-blue-600" /> Admin Panel
          </h1>
        </div>

        <nav className="flex-1 flex flex-col mt-4">
          <button
            onClick={() => setActiveTab("projects")}
            className={`flex items-center gap-2 px-6 py-3 text-left hover:bg-blue-50 transition ${
              activeTab === "projects"
                ? "bg-blue-100 text-blue-700 font-medium"
                : "text-gray-700"
            }`}
          >
            <FolderGit2 className="w-5 h-5" /> Projects
          </button>
          <button
            onClick={() => setActiveTab("blogs")}
            className={`flex items-center gap-2 px-6 py-3 text-left hover:bg-blue-50 transition ${
              activeTab === "blogs"
                ? "bg-blue-100 text-blue-700 font-medium"
                : "text-gray-700"
            }`}
          >
            <BookOpen className="w-5 h-5" /> Blogs
          </button>
        </nav>

        <div className="px-6 py-4 border-t border-gray-100">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-2 rounded-lg"
          >
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8 overflow-y-auto">
        {activeTab === "blogs" ? <BlogsList /> : <ProjectsList />}
      </main>
    </div>
  );
}
