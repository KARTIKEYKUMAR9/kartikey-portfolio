import { useLocation } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import AIAssistant from "./components/common/AIAssistant";
import { useEffect } from "react";

function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  useEffect(() => {
    if (isAdminRoute) return;
    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
    fetch(`${API_URL}/api/analytics/pageview`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ page: location.pathname }),
      keepalive: true,
    }).catch(() => {});
  }, [location.pathname, isAdminRoute]);

  return (
    <>
      <AppRoutes />

      {/* AI Assistant is for portfolio visitors only — hidden on /admin */}
      {!isAdminRoute && <AIAssistant />}
    </>
  );
}

export default App;