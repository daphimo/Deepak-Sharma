import CardSwap, { Card } from "./components/CardSwap";
import { FiExternalLink, FiFileText } from "react-icons/fi";

// 🎨 Brand Colors
const brandColors = {
  dark: "#000000",
  steel: "#415a77",
  sky: "#778da9",
  light: "#e0e1dd",
};

export default function Infinite() {
  const projects = [
    {
      title: "Project One",
      img: "https://via.placeholder.com/600x400",
      desc: "A creative project showcasing design and innovation.",
      link: "#",
      caseStudy: "#",
    },
    {
      title: "Project Two",
      img: "https://via.placeholder.com/600x400",
      desc: "An innovative solution blending creativity and technology.",
      link: "#",
      caseStudy: "#",
    },
  ];

  return (
    <div className="my-20">
      <div className="w-full min-h-screen text-white max-w-7xl mx-auto px-4">
        <div
          className="p-6 bg-white/10 
             backdrop-blur-md 
             overflow-hidden
             border border-white/20 
             shadow-lg 
             rounded-2xl"
        >
          {/* Grid: 1 column on mobile, 2 on md+ */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center w-full h-[40rem] md:h-[30rem]">
            {/* Left Content */}
            <div className="flex flex-col justify-center space-y-6">
              <h2 className="text-4xl font-bold">Our Projects</h2>
              <p className="text-lg text-gray-200 leading-relaxed">
                Explore some of the creative projects we’ve been working on.
                Each card on the right represents an initiative where we blend
                innovation, design, and functionality to bring unique ideas to
                life.
              </p>
            </div>

            {/* Right Side: Card Swapper */}
            <div className="flex justify-center w-full h-full">
              <div className="w-full h-full max-w-md">
                <CardSwap
                  cardDistance={60}
                  verticalDistance={70}
                  delay={5000}
                  pauseOnHover={false}
                >
                  {projects.map((project, index) => (
                    <Card key={index}>
                      <a
                        href={project.link}
                        className="relative block w-full h-full rounded-xl overflow-hidden shadow-lg group"
                        aria-label={project.title}
                        title={project.title}
                      >
                        {/* Title Section */}
                        <div className="p-4">
                          <h3 className="text-xl font-bold text-white">
                            {project.title}
                          </h3>
                          <div className="border-t border-white/30 my-2"></div>
                          <p className="text-gray-300 text-sm">
                            {project.desc}
                          </p>
                        </div>

                        {/* Image Section */}
                        <div className="w-full h-[18rem] md:h-[20rem]">
                          <img
                            src={project.img}
                            alt={project.title}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        {/* Overlay Buttons */}
                        <div className="absolute inset-0 z-20 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
                          <a
                            href={project.link}
                            style={{ backgroundColor: brandColors.steel }}
                            className="flex items-center gap-2 text-white font-semibold px-4 py-2 rounded-lg shadow-lg transition-transform transform hover:scale-105"
                          >
                            <FiExternalLink /> Visit Now
                          </a>
                          <a
                            href={project.caseStudy}
                            style={{ backgroundColor: brandColors.sky }}
                            className="flex items-center gap-2 text-white font-semibold px-4 py-2 rounded-lg shadow-lg transition-transform transform hover:scale-105"
                          >
                            <FiFileText /> Case Study
                          </a>
                        </div>
                      </a>
                    </Card>
                  ))}
                </CardSwap>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
