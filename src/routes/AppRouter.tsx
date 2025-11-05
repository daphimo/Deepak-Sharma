// src/routes/AppRouter.tsx
import { Routes, Route } from "react-router-dom";
import Home from "../Home";
import ViewAllProjects from "../ViewProjects.tsx";
import Download from "../Download.tsx";
import Blogs from "../Blogs.tsx";

// Blogs
import BlogWishlistGuide from "../blogs/Wishlist.tsx";

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/projects" element={<ViewAllProjects />} />
      <Route path="/downloads" element={<Download />} />
      <Route path="/blogs" element={<Blogs />} />
      <Route path="/blogs/how-to-add-wishlist-in-shopify" element={<BlogWishlistGuide />} />
    </Routes>
  );
};

export default AppRouter;
