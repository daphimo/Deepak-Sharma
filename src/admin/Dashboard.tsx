import { FileText, FolderGit2, Shield } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [blogCount, setBlogCount] = useState<number | null>(null);
  const [projectCount, setProjectCount] = useState<number | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCounts = async () => {
      const [{ count: blogs }, { count: projects }] = await Promise.all([
        supabase.from("blog").select("*", { count: "exact", head: true }),
        supabase.from("project").select("*", { count: "exact", head: true }),
      ]);
      setBlogCount(blogs ?? 0);
      setProjectCount(projects ?? 0);
    };
    fetchCounts();
  }, []);

  const cards = [
    {
      title: "Blogs",
      value: blogCount === null ? "…" : blogCount,
      icon: FileText,
      color: "from-sky-500 to-blue-500",
      href: "/admin/blogs",
    },
    {
      title: "Projects",
      value: projectCount === null ? "…" : projectCount,
      icon: FolderGit2,
      color: "from-emerald-500 to-teal-500",
      href: "/admin/projects",
    },
    {
      title: "Content",
      value: "Edit",
      icon: Shield,
      color: "from-amber-500 to-orange-500",
      href: "/admin/content",
    },
  ];

  return (
    <div className="space-y-8 text-black">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-gray-600 mt-2">Quick overview of your admin space.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.title}
              onClick={() => navigate(card.href)}
              className="cursor-pointer rounded-2xl border border-gray-200 bg-white shadow-xl p-4 flex items-center gap-4 hover:-translate-y-1 transition"
            >
              <div
                className={`h-12 w-12 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center`}
              >
                <Icon className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">{card.title}</p>
                <p className="text-lg font-semibold text-gray-900">{card.value}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
