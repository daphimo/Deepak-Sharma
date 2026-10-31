// src/index.tsx
import { StrictMode, lazy, Suspense, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, useLocation } from "react-router-dom";
import "./index.css";
import "./App.css";
import { SpeedInsights } from "@vercel/speed-insights/react";

import ScrollToTop from "./assets/components/ScrollToTop";
import PageLoader from "./assets/components/PageLoader";
import ScrollProgress from "./components/ScrollProgress/ScrollProgress";
const Space = lazy(() => import("./backgrounds/Space"));
const Header = lazy(() => import("./assets/components/header"));
const Dock = lazy(() => import("./assets/components/dock"));
// const StylishBackToTop = lazy(() => import("./assets/components/backtotop"));
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
    const handleClick = (event: MouseEvent) => {
      const link = (event.target as Element).closest<HTMLAnchorElement>('a[href^="#"]');
      if (!link) return;
      event.preventDefault();
      scrollToSection(link.hash.substring(1), 120);
    };
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);
};

const MainLayout = () => {
  useSmoothScroll();
  const [showMobileDock, setShowMobileDock] = useState(() =>
    window.matchMedia("(max-width: 767px)").matches
  );

  useEffect(() => {
    const query = window.matchMedia("(max-width: 767px)");
    const update = (event: MediaQueryListEvent) => setShowMobileDock(event.matches);
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

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
        {showMobileDock ? <Dock /> : null}
        {/* <StylishBackToTop /> — replaced by the ScrollProgress back-to-top control. */}
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
  const isNewUpdatesRoute = location.pathname.startsWith("/new-updates");

  useEffect(() => {
    if (isAdminRoute) {
      document.documentElement.classList.remove("dark", "light");
    }
  }, [isAdminRoute]);

  return (
    <>
      {!isNewUpdatesRoute && <ScrollProgress />}
      {isAdminRoute ? (
        <Suspense fallback={<PageLoader />}>
          <AdminRoutes />
        </Suspense>
      ) : isNewUpdatesRoute ? (
        <Suspense fallback={<PageLoader />}>
          <AppRouter />
        </Suspense>
      ) : (
        <MainLayout />
      )}
    </>
  );
};

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <ScrollToTop />
      <Root />
    </BrowserRouter>
  </StrictMode>
);
