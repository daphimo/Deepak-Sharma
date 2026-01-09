import { useEffect, useRef, useState } from "react";
import { supabase } from "./lib/supabaseClient";
import { ProjectCard } from "./components/ProjectCard";
import type { ProjectCardData } from "./components/ProjectCard";

export default function Infinite() {
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [filters, setFilters] = useState<string[]>(["All"]);
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const [projects, setProjects] = useState<ProjectCardData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      const { data, error } = await supabase
        .from("project")
        .select("id, name, slug, image, desktop_image, mobile_image, project_url, category, subcategory, tags, status")
        .order("created_at", { ascending: false });

      if (!error && data) {
        setProjects(data as ProjectCardData[]);
        const categories = (data as ProjectCardData[])
          .map((p) => p.category)
          .filter((category): category is string => Boolean(category));
        const uniqueCategories = Array.from(new Set(categories));
        setFilters(["All", ...uniqueCategories]);
      }
      setLoading(false);
    };

    fetchProjects();
  }, []);

  useEffect(() => {
    const activeTab = tabRefs.current[filters.indexOf(selectedFilter)];
    if (activeTab) {
      setIndicatorStyle({
        left: activeTab.offsetLeft,
        width: activeTab.offsetWidth,
      });
    }
  }, [selectedFilter, filters]);

  const filteredProjects =
    selectedFilter === "All" ? projects : projects.filter((p) => p.category === selectedFilter);

  return (
    <div className="mt-20 w-full text-white max-w-7xl mx-auto py-20 px-4 bg-transparent">
      {/* Header */}
      <div className="mb-10 text-left">
        <h2 className="text-4xl md:text-5xl font-bold mb-4">Let&apos;s Explore Featured Projects</h2>
        <p className="text-gray-300 text-lg max-w-2xl leading-relaxed">
          Discover impactful projects that blend creativity, technology, and strategy — crafted for both employers and
          personal growth.
        </p>
      </div>

      {/* Desktop Filter Tabs */}
      <div className="hidden md:flex relative w-fit border border-white/20 rounded-full backdrop-blur-md bg-white/5 mb-12">
        <div
          className="absolute top-0 h-full bg-white/20 backdrop-blur-xl rounded-full transition-all duration-500"
          style={{
            left: `${indicatorStyle.left}px`,
            width: `${indicatorStyle.width}px`,
          }}
        />
        {filters.map((filter, index) => (
          <button
            key={filter}
            ref={(el) => {
              tabRefs.current[index] = el;
            }}
            onClick={() => setSelectedFilter(filter)}
            className={`relative z-10 px-8 py-2 text-sm font-medium cursor-pointer ${
              selectedFilter === filter ? "text-white" : "text-gray-300"
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Mobile Filter */}
      <div className="md:hidden mb-10">
        <select
          value={selectedFilter}
          onChange={(e) => setSelectedFilter(e.target.value)}
          className="bg-[var(--card)] text-white border border-white/20 rounded-lg px-4 py-2 backdrop-blur-md w-full cursor-pointer"
        >
          {filters.map((filter) => (
            <option key={filter} value={filter} className="bg-gray-800 text-white">
              {filter}
            </option>
          ))}
        </select>
      </div>

      {/* Projects Grid */}
      {loading ? (
        <div className="flex justify-center items-center py-10 text-gray-300">Loading projects...</div>
      ) : filteredProjects.length === 0 ? (
        <p className="text-gray-400">No projects found for this category.</p>
      ) : (
        <div className="flex flex-wrap justify-center gap-10">
          {filteredProjects.map((project) => (
            <div key={project.id} className="w-full md:w-[calc(30%-1.25rem)] max-w-[400px]">
              <ProjectCard project={project} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
