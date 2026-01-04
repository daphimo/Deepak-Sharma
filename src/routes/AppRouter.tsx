// src/routes/AppRouter.tsx
import { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import PageLoader from "../assets/components/PageLoader";

// Route-level code splitting
const Home = lazy(() => import("../Home"));
const ViewAllProjects = lazy(() => import("../ViewProjects.tsx"));
const Download = lazy(() => import("../Download.tsx"));
const Blogs = lazy(() => import("../BlogsPage.tsx"));
const BlogDetail = lazy(() => import("../blogs/BlogDetail.tsx"));
const SupabaseProjectDetail = lazy(() => import("../projects/SupabaseProjectDetail.tsx"));
// Admin routes are handled separately in AdminRoutes

const AppRouter = () => {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Main routes */}
        <Route path="/" element={<Home />} />
        <Route path="/projects" element={<ViewAllProjects />} />
        <Route path="/downloads" element={<Download />} />

        {/* Blog routes */}
        <Route path="/blogs" element={<Blogs />} />
        <Route path="/blogs/:slug" element={<BlogDetail />} />

        {/* Project detail */}
        <Route path="/projects/:slug" element={<SupabaseProjectDetail />} />
      </Routes>
    </Suspense>
  );
};

export default AppRouter;
