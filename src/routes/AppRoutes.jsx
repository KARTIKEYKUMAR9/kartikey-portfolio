import { Routes, Route } from "react-router-dom";

import Home from "../pages/Home";
import Experience from "../pages/Experience";
import Projects from "../pages/Projects";
import NotFound from "../pages/NotFound";
import About from "../pages/About";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/experience" element={<Experience />} />
      <Route path="/projects" element={<Projects />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}