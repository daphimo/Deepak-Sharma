// src/routes/AppRouter.tsx
import { Routes, Route } from "react-router-dom";
import Home from "../Home";
import ViewAllProjects from "../ViewProjects.tsx";
import Download from "../Download.tsx";
import Blogs from "../BlogsPage.tsx";
import BlogDetail from "../blogs/BlogDetail.tsx";
import BlogEditor from "../AdminBlogEditor.tsx";

const AppRouter = () => {
  return (
    <Routes>
      {/* Main routes */}
      <Route path="/" element={<Home />} />
      <Route path="/projects" element={<ViewAllProjects />} />
      <Route path="/downloads" element={<Download />} />

      {/* Blog Editor */}
      <Route path="/editor" element={<BlogEditor />} />

      {/* Blog routes */}
      <Route path="/blogs" element={<Blogs />} />
      <Route path="/blogs/:slug" element={<BlogDetail />} />
    </Routes>
  );
};

export default AppRouter;
