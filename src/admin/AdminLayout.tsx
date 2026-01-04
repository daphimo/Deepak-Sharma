import { useEffect, useRef, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, FileText, FolderGit2, FilePenLine, LogOut, Menu } from "lucide-react";
import { supabase } from "../lib/supabaseClient";
import { useRequireAuth } from "./useRequireAuth";

const navItems = [
  { label: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Blogs", path: "/admin/blogs", icon: FileText },
  { label: "Projects", path: "/admin/projects", icon: FolderGit2 },
  { label: "Content", path: "/admin/content", icon: FilePenLine },
];

export default function AdminLayout() {
  const checkingAuth = useRequireAuth();
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const mainRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    supabase.auth.signOut().finally(() => navigate("/login", { replace: true }));
  };

  useEffect(() => {
    if (mainRef.current) {
      mainRef.current.scrollTo({ top: 0, left: 0, behavior: "auto" });
    }
  }, [location.pathname]);

  if (checkingAuth) {
    return (
    <div className="min-h-screen bg-white text-black flex items-center justify-center">
        <div className="px-4 py-3 rounded-xl bg-white border border-gray-200 shadow-lg">
          Checking session...
        </div>
      </div>
    );
  }

  return (
    <div className="h-[100vh] bg-white text-black flex">
      <aside
        className={`flex flex-col border-r border-gray-200 bg-white transition-all duration-300 ${
          collapsed ? "w-16" : "w-64"
        }`}
      >
        <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200">
          {!collapsed && <span className="font-semibold tracking-wide text-black">Admin</span>}
          <button
            onClick={() => setCollapsed((p) => !p)}
            className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition cursor-pointer"
            aria-label="Toggle sidebar"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 py-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition cursor-pointer ${
                  active ? "bg-sky-50 text-sky-700" : "text-gray-800 hover:bg-gray-100"
                }`}
              >
                <Icon className="h-5 w-5" />
                {!collapsed && <span>{item.label}</span>}
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition px-4 py-2 cursor-pointer text-sm font-semibold text-gray-800"
          >
            <LogOut className="h-4 w-4" />
            {!collapsed && "Logout"}
          </button>
        </div>
      </aside>

      <main ref={mainRef} className="flex-1 overflow-y-auto bg-[#f3f4f6]">
        <div className="max-w-6xl mx-auto p-6 text-black">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
