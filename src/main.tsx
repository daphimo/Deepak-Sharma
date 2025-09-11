import { StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "./App.css";
// import App from "./App.tsx";
import Space from "./backgrounds/Space.tsx";
import Header from "../src/assets/components/header.tsx";
import Dock from "../src/assets/components/dock.tsx";
import Scroll from "../src/assets/components/scroll.tsx";
import StylishBackToTop from "../src/assets/components/backtotop.tsx";
import Projects from "./Projects.tsx";
import About from "./About.tsx";
import Contact from "./Contact.tsx";

// Smooth scroll function with offset
const scrollToSection = (id: string, offset = 100) => {
  const element = document.getElementById(id);
  if (element) {
    const elementPosition =
      element.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({
      top: elementPosition - offset,
      behavior: "smooth",
    });
  }
};

// Optional: handle header nav clicks
const useSmoothScroll = () => {
  useEffect(() => {
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const targetId = (link as HTMLAnchorElement)
          .getAttribute("href")!
          .substring(1);
        scrollToSection(targetId, -20);
      });
    });
    return () => {
      links.forEach((link) => {
        link.removeEventListener("click", () => {});
      });
    };
  }, []);
};

const Main = () => {
  useSmoothScroll();

  return (
    <>
      <Space />
      <Header />
      <div className="main-container w-full min-h-screen">
        <div id="intro">
          {/* <App /> */}
          <Scroll />
        </div>
        <div id="projects">
          <Projects />
        </div>
        <div id="about">
          <About />
        </div>
        <div id="contact">
          <Contact />
        </div>
      </div>
      <Dock />
      <StylishBackToTop />
    </>
  );
};

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Main />
  </StrictMode>
);
