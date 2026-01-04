import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Magnet from "./assets/components/Magnet";
import { supabase } from "./lib/supabaseClient";
import { ProjectCard } from "./components/ProjectCard";
import type { ProjectCardData } from "./components/ProjectCard";

export default function Infinite() {
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
      }
      setLoading(false);
    };

    fetchProjects();
  }, []);

  return (
    <div className="mt-20 w-full text-white max-w-7xl mx-auto py-20 px-4">
      {/* Header */}
      <div className="mb-16 text-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-4">Let&apos;s Explore Featured Projects</h2>
        <p className="text-gray-300 text-lg max-w-2xl mx-auto leading-relaxed">
          Discover a curated collection of impactful projects that blend strategy, creativity, and technology. Each piece
          embodies purposeful design and problem-solving — transforming ideas into meaningful digital experiences.
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-10 text-gray-300">Loading projects...</div>
      ) : projects.length === 0 ? (
        <p className="text-center text-gray-400">No projects found.</p>
      ) : (
        <div className="flex flex-wrap justify-center gap-10">
          {projects.map((project) => (
            <div key={project.id} className="w-full md:w-[calc(50%-1.25rem)] max-w-[600px]">
              <ProjectCard project={project} />
            </div>
          ))}
        </div>
      )}

      {/* CTA Button */}
      <div className="text-center mt-10">
        <Magnet padding={50} disabled={false} magnetStrength={5}>
          <Link
            to="/projects"
            className="flex items-center font-bold gap-2 text-sm text-[#1a1a1a] bg-[#d4af37] px-4 py-2 rounded-xl transition-all shadow-md hover:shadow-lg active:scale-[0.98]"
          >
            Explore More Projects
          </Link>
        </Magnet>
      </div>
    </div>
  );
}
