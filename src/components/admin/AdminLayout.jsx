import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const NAV_ITEMS = [
  { to: "/admin/dashboard", label: "Overview", end: true },
  { to: "/admin/messages", label: "Contact Messages" },
  { to: "/admin/ai-usage", label: "AI Usage" },
  { to: "/admin/conversations", label: "Conversations" },
  { to: "/admin/stats", label: "Portfolio Stats" },
  { to: "/admin/ai", label: "AI Copilot" },
];

function AdminLayout() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await fetch(`${API_URL}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } finally {
      navigate("/admin/login");
    }
  };

  const navLinkClass = ({ isActive }) =>
    `block px-3 py-2 rounded-lg text-sm transition-colors ${
      isActive
        ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/30"
        : "text-slate-400 hover:text-white hover:bg-slate-800"
    }`;

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col sm:flex-row">
      {/* Mobile top bar */}
      <div className="sm:hidden flex items-center justify-between px-4 py-3 bg-slate-900 border-b border-slate-800">
        <div>
          <p className="text-sm font-semibold text-white">Portfolio Admin</p>
        </div>
        <button
          onClick={() => setSidebarOpen(true)}
          className="text-slate-300 p-1.5 rounded-lg hover:bg-slate-800"
          aria-label="Open menu"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Mobile overlay (click to close) */}
      {sidebarOpen && (
        <div
          className="sm:hidden fixed inset-0 bg-black/60 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar — static on desktop, slide-in drawer on mobile */}
      <aside
        className={`
          w-64 sm:w-56 shrink-0 bg-slate-900 border-r border-slate-800 flex flex-col
          fixed sm:static inset-y-0 left-0 z-50
          transform transition-transform duration-200 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} sm:translate-x-0
        `}
      >
        <div className="px-5 py-5 border-b border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-white">Portfolio Admin</p>
            <p className="text-xs text-slate-500 mt-0.5">Kartikey Kumar</p>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="sm:hidden text-slate-500 hover:text-white"
            aria-label="Close menu"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={() => setSidebarOpen(false)}
              className={navLinkClass}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="px-3 py-4 border-t border-slate-800">
          <button
            onClick={handleLogout}
            className="w-full text-left px-3 py-2 rounded-lg text-sm text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
          >
            Log out
          </button>
        </div>
      </aside>

      {/* Page content */}
      <main className="flex-1 p-4 sm:p-6 md:p-8 min-w-0">
        <Outlet />
      </main>
    </div>
  );
}

export default AdminLayout;