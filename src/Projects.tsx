import React from "react";

const projectsData = [
  {
    title: "E-commerce Platform",
    description:
      "A full-featured e-commerce platform with a custom CMS, product management, and payment integration.",
    tech: ["React", "TypeScript", "Node.js", "Shopify API"],
    liveLink: "#",
    repoLink: "#",
  },
  {
    title: "Portfolio Website",
    description:
      "A modern, responsive portfolio website to showcase projects and skills, with smooth scrolling and animations.",
    tech: ["React", "Framer Motion", "Tailwind CSS"],
    liveLink: "#",
    repoLink: "#",
  },
  {
    title: "Chatbot Integration",
    description:
      "A conversational AI chatbot integrated into Shopify for product search, cart creation, and checkout flow automation.",
    tech: ["React", "OpenAI API", "Shopify API"],
    liveLink: "#",
    repoLink: "#",
  },
];

const Projects: React.FC = () => {
  return (
    <section className="py-20">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-4xl font-bold text-center mb-12">Projects</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projectsData.map((project, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-2xl transition-shadow duration-300"
            >
              <h3 className="text-2xl font-semibold mb-2">{project.title}</h3>
              <p className="text-gray-700 mb-4">{project.description}</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {project.tech.map((tech, i) => (
                  <span
                    key={i}
                    className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm"
                  >
                    {tech}
                  </span>
                ))}
              </div>
              <div className="flex gap-4">
                <a
                  href={project.liveLink}
                  target="_blank"
                  className="text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded transition-colors"
                >
                  Live
                </a>
                <a
                  href={project.repoLink}
                  target="_blank"
                  className="text-blue-600 border border-blue-600 hover:bg-blue-600 hover:text-white px-4 py-2 rounded transition-colors"
                >
                  Code
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
