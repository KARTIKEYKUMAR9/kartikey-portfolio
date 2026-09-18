import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

function ProtectedRoute() {
  const [status, setStatus] = useState("checking"); // "checking" | "authed" | "guest"

  useEffect(() => {
    fetch(`${API_URL}/api/auth/me`, {
      credentials: "include",
    })
      .then((res) => setStatus(res.ok ? "authed" : "guest"))
      .catch(() => setStatus("guest"));
  }, []);

  if (status === "checking") {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <p className="text-slate-500 text-sm">Checking session...</p>
      </div>
    );
  }

  if (status === "guest") {
    return <Navigate to="/admin/login" replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;