// src/routes/AppRouter.tsx
import { Routes, Route } from "react-router-dom";
import Home from "../Home";
import ViewAllProjects from "../ViewProjects.tsx";
import Download from "../Download.tsx";

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/projects" element={<ViewAllProjects />} />
      <Route path="/downloads" element={<Download />} />
    </Routes>
  );
};

export default AppRouter;
