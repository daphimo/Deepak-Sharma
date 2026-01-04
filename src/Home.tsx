// src/pages/Home.tsx
import App from "./App.tsx";
import AboutMe from "./MoreAboutMe";
import Tech from "./assets/components/technologies";
import Projects from "./Projects";
// import Graphs from "./Graphs";
import Blogs from "./FeaturedBlogs.tsx";

const Home = () => {
  return (
    <main className="main-container w-full min-h-screen text-[var(--foreground)] transition-colors duration-500">
      <div id="intro">
        <App />
      </div>
      <div id="aboutme">
        <AboutMe />
        <Tech />
      </div>
      {/* <div id="metrics">
        <Graphs />
      </div> */}
      <div id="projects">
        <Projects />
      </div>
      <div id="blogs">
        <Blogs />
      </div>
    </main>
  );
};

export default Home;
