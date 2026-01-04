import { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import PageLoader from "../assets/components/PageLoader";

const AdminLayout = lazy(() => import("../admin/AdminLayout"));
const Dashboard = lazy(() => import("../admin/Dashboard"));
const BlogsList = lazy(() => import("../admin/BlogsList"));
const BlogEditor = lazy(() => import("../admin/BlogEditor"));
const ProjectsList = lazy(() => import("../admin/ProjectsList"));
const ProjectEditor = lazy(() => import("../admin/ProjectEditor"));
const ContentEditor = lazy(() => import("../admin/ContentEditor"));
const Login = lazy(() => import("../admin/Login"));

const AdminRoutes = () => {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
        <Route element={<AdminLayout />}>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="/admin/dashboard" element={<Dashboard />} />
          <Route path="/admin/blogs" element={<BlogsList />} />
          <Route path="/admin/blogs/blog-editor" element={<BlogEditor />} />
          <Route path="/admin/projects" element={<ProjectsList />} />
          <Route path="/admin/projects/project-editor" element={<ProjectEditor />} />
          <Route path="/admin/content" element={<ContentEditor />} />
        </Route>
      </Routes>
    </Suspense>
  );
};

export default AdminRoutes;
