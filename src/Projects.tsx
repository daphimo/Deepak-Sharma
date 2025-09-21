import CardSwap, { Card } from "./components/CardSwap";
// import { FiExternalLink, FiFileText } from "react-icons/fi";

// 🎨 Brand Colors
// const brandColors = {
//   dark: "#000000",
//   steel: "#415a77",
//   sky: "#778da9",
//   light: "#e0e1dd",
// };

export default function Infinite() {
  const projects = [
    {
      title: "Amara Beauty",
      img: "/files/amara-beauty.jpg",
      desc: "A creative project showcasing design and innovation.",
      link: "https://amarabeautycare.com/",
      caseStudy: "https://amarabeautycare.com/",
    },
    {
      title: "Eywa Beauty",
      img: "../public/files/eywa.png",
      desc: "A creative project showcasing design and innovation.",
      link: "https://www.eywabeauty.com/en-in",
      caseStudy: "https://www.eywabeauty.com/en-in",
    },
    {
      title: "Bellanomi",
      img: "../public/files/bellanomi.jpg",
      desc: "A creative project showcasing design and innovation.",
      link: "https://bellanomi.com/",
      caseStudy: "https://bellanomi.com/",
    },
    {
      title: "Apres Cookie",
      img: "../public/files/aprescookie.png",
      desc: "A creative project showcasing design and innovation.",
      link: "https://aprescookies.com/",
      caseStudy: "https://aprescookies.com/s",
    },
    {
      title: "Arzley",
      img: "../public/files/arzley.jpg",
      desc: "A creative project showcasing design and innovation.",
      link: "https://www.arzley.com/",
      caseStudy: "https://www.arzley.com/",
    },
  ];

  return (
    <div className="mt-20">
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
              <h2 className="text-4xl font-bold">My Projects</h2>
              <p className="text-lg text-gray-200 leading-relaxed">
                Explore some of the creative projects I’ve been working on. Each
                card on the right represents an initiative where I blend
                innovation, design, and functionality to bring unique ideas to
                life.
              </p>
              <p className="text-xs text-gray-200 leading-relaxed">
                NOTE: THESE PROJECTS WERE DONE WHILE I WAS WORKING IN AGENCY,
                THESE ARE NOT MY PERSONAL PROJECTS.
              </p>
            </div>

            {/* Right Side: Card Swapper */}
            <div className="flex justify-center w-full h-full">
              <div className="w-full h-full">
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
                        target="_blank"
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
                        {/* <div className="absolute inset-0 z-20 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
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
                        </div> */}
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
