// src/pages/Home.tsx
import App from "./App.tsx";
import AboutMe from "./MoreAboutMe";
import Tech from "./assets/components/technologies";
import Projects from "./Projects";
import Contact from "./Contact";

const Home = () => {
  return (
    <main className="main-container w-full min-h-screen">
      <div id="intro">
        <App />
      </div>
      <div id="aboutme">
        <AboutMe />
      </div>
      <Tech />
      <div id="projects">
        <Projects />
      </div>
      <div id="contact">
        <Contact />
      </div>
    </main>
  );
};

export default Home;
