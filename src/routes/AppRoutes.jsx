import { Routes, Route } from "react-router-dom";

import Home from "../pages/Home";
import Experience from "../pages/Experience";
import Projects from "../pages/Projects";
import NotFound from "../pages/NotFound";
import About from "../pages/About";
import Contact from "../pages/Contact";

import AdminLogin from "../pages/admin/AdminLogin";
import ProtectedRoute from "../components/admin/ProtectedRoute";
import AdminLayout from "../components/admin/AdminLayout";
import AdminDashboard from "../pages/admin/AdminDashboard";
import AdminMessages from "../pages/admin/AdminMessages";
import AdminAiUsage from "../pages/admin/AdminAiUsage";
import AdminConversations from "../pages/admin/AdminConversations";
import AdminNotFound from "../pages/admin/AdminNotFound";
import AdminStats from "../pages/admin/AdminStats";
import AdminAI from "../pages/admin/AdminAI";
import AdminSettings from "../pages/admin/AdminSettings";


export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/experience" element={<Experience />} />
      <Route path="/projects" element={<Projects />} />
      <Route path="/contact" element={<Contact />} />

      <Route path="/admin/login" element={<AdminLogin />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/messages" element={<AdminMessages />} />
          <Route path="/admin/ai-usage" element={<AdminAiUsage />} />
          <Route path="/admin/conversations" element={<AdminConversations />} />
          <Route path="/admin/stats" element={<AdminStats />} />
          <Route path="/admin/ai" element={<AdminAI />} />
          <Route path="/admin/settings" element={<AdminSettings />} />
          <Route path="/admin/*" element={<AdminNotFound />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}