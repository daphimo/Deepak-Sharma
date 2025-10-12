// src/index.tsx
import { StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import "./App.css";

import Space from "./backgrounds/Space";
import Header from "./assets/components/header";
import Dock from "./assets/components/dock";
import StylishBackToTop from "./assets/components/backtotop";
import AppRouter from "./routes/AppRouter.tsx";

// Smooth scroll function with offset
const scrollToSection = (id: string, offset = 0) => {
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

// Hook for smooth scrolling within page sections
const useSmoothScroll = () => {
  useEffect(() => {
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const targetId = (link as HTMLAnchorElement)
          .getAttribute("href")!
          .substring(1);
        scrollToSection(targetId, 120);
      });
    });
    return () => {
      links.forEach((link) => {
        link.removeEventListener("click", () => {});
      });
    };
  }, []);
};

const MainLayout = () => {
  useSmoothScroll();

  return (
    <>
      <Space />
      <div className="fixed inset-0 -z-10 w-full pointer-events-none h-full"></div>
      <Header />
      <AppRouter />
      <Dock />
      <StylishBackToTop />
    </>
  );
};

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <MainLayout />
    </BrowserRouter>
  </StrictMode>
);
