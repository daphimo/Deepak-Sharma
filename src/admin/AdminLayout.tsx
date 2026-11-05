import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { ChevronRight, ExternalLink, FilePenLine, FileText, FolderGit2, LayoutDashboard, LogOut, Menu, PanelLeftClose, PanelLeftOpen, X } from "lucide-react";
import { supabase } from "../lib/supabaseClient";
import { useRequireAuth } from "./useRequireAuth";
import "./admin.css";

const navItems = [
  { label: "Overview", path: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Blogs", path: "/admin/blogs", icon: FileText },
  { label: "Projects", path: "/admin/projects", icon: FolderGit2 },
  { label: "Site content", path: "/admin/content", icon: FilePenLine },
];
const pageNames: Record<string, string> = { "/admin/dashboard": "Overview", "/admin/blogs": "Blogs", "/admin/blogs/blog-editor": "Blog editor", "/admin/projects": "Projects", "/admin/projects/project-editor": "Project editor", "/admin/content": "Site content" };

export default function AdminLayout() {
  const checkingAuth = useRequireAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [email, setEmail] = useState("Administrator");
  const navigate = useNavigate();
  const location = useLocation();
  const mainRef = useRef<HTMLElement>(null);
  const title = pageNames[location.pathname] || "Admin";

  useEffect(() => { supabase.auth.getUser().then(({ data }) => { if (data.user?.email) setEmail(data.user.email); }); }, []);
  const goTo = (path: string) => { navigate(path); setMobileOpen(false); };
  const handleLogout = () => { supabase.auth.signOut().finally(() => navigate("/login", { replace: true })); };
  useLayoutEffect(() => { mainRef.current?.scrollTo({ top: 0, left: 0, behavior: "auto" }); }, [location.key, location.pathname, location.search]);

  if (checkingAuth) return <div className="admin-login dashboard-shell"><div className="admin-loading-card"><span className="admin-spinner" />Checking session</div></div>;

  return (
    <div className={`dashboard-shell ${collapsed ? "is-collapsed" : ""}`}>
      {mobileOpen && <button className="admin-backdrop" aria-label="Close navigation" onClick={() => setMobileOpen(false)} />}
      <aside className={`admin-sidebar ${mobileOpen ? "is-open" : ""}`}>
        <div className="admin-brand">
          <div className="admin-brand-mark">DS</div>
          {!collapsed && <div className="admin-brand-copy"><strong>Deepak Sharma</strong><span>Portfolio Admin</span></div>}
          <button className="admin-icon-button admin-mobile-close" onClick={() => setMobileOpen(false)} aria-label="Close navigation"><X /></button>
        </div>
        <nav className="admin-nav" aria-label="Admin navigation">
          {!collapsed && <p className="admin-nav-label">Workspace</p>}
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = location.pathname === item.path || (item.path !== "/admin/dashboard" && location.pathname.startsWith(item.path + "/"));
            return <button key={item.path} onClick={() => goTo(item.path)} className={`admin-nav-item ${active ? "is-active" : ""}`} title={collapsed ? item.label : undefined}><Icon />{!collapsed && <span>{item.label}</span>}</button>;
          })}
        </nav>
        <div className="admin-sidebar-footer">
          <a href="/" className="admin-nav-item" title={collapsed ? "View live site" : undefined}><ExternalLink />{!collapsed && <span>View live site</span>}</a>
          <button onClick={handleLogout} className="admin-nav-item admin-logout" title={collapsed ? "Sign out" : undefined}><LogOut />{!collapsed && <span>Sign out</span>}</button>
          {!collapsed && <div className="admin-profile"><div className="admin-avatar">{email.slice(0, 1).toUpperCase()}</div><div><strong>{email.split("@")[0]}</strong><span>{email}</span></div></div>}
        </div>
      </aside>
      <section className="admin-workspace">
        <header className="admin-topbar">
          <div className="admin-topbar-left">
            <button className="admin-icon-button admin-mobile-menu" onClick={() => setMobileOpen(true)} aria-label="Open navigation"><Menu /></button>
            <button className="admin-icon-button admin-collapse" onClick={() => setCollapsed((value) => !value)} aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}>{collapsed ? <PanelLeftOpen /> : <PanelLeftClose />}</button>
            <div><div className="admin-breadcrumb"><span>Admin</span><ChevronRight /><span>{title}</span></div><h1>{title}</h1></div>
          </div>
          <div className="admin-top-profile"><div className="admin-avatar">{email.slice(0, 1).toUpperCase()}</div><div><strong>{email.split("@")[0]}</strong><span>Administrator</span></div></div>
        </header>
        <main id="admin-scroll" ref={mainRef} className="admin-main"><div className="admin-content"><Outlet /></div></main>
      </section>
    </div>
  );
}
