// src/index.tsx
import { StrictMode, lazy, Suspense, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, useLocation } from "react-router-dom";
import "./index.css";
import "./App.css";
import "quill/dist/quill.snow.css";
import { SpeedInsights } from "@vercel/speed-insights/react";

import ScrollToTop from "./assets/components/ScrollToTop";
import PageLoader from "./assets/components/PageLoader";
const Space = lazy(() => import("./backgrounds/Space"));
const Header = lazy(() => import("./assets/components/header"));
const Dock = lazy(() => import("./assets/components/dock"));
const StylishBackToTop = lazy(() => import("./assets/components/backtotop"));
const AppRouter = lazy(() => import("./routes/AppRouter.tsx"));
const Contact = lazy(() => import("./Contact"));
const AdminRoutes = lazy(() => import("./routes/AdminRoutes"));


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
      <Suspense fallback={null}>
        <Space />
      </Suspense>
      <div className="fixed inset-0 -z-10 w-full pointer-events-none h-full"></div>
      <Suspense fallback={<PageLoader />}>
        <Header />
        <PageLoader />
        <AppRouter />
        <Dock />
        <StylishBackToTop />
        <div id="contact">
          <Contact />
        </div>
      </Suspense>
      <SpeedInsights />
    </>
  );
};

const Root = () => {
  const location = useLocation();
  const isAdminRoute =
    location.pathname.startsWith("/admin") || location.pathname.startsWith("/login");

  useEffect(() => {
    if (isAdminRoute) {
      document.documentElement.classList.remove("dark", "light");
    }
  }, [isAdminRoute]);

  if (isAdminRoute) {
    return (
      <Suspense fallback={<PageLoader />}>
        <AdminRoutes />
      </Suspense>
    );
  }

  return <MainLayout />;
};

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <ScrollToTop />
      <Root />
    </BrowserRouter>
  </StrictMode>
);
