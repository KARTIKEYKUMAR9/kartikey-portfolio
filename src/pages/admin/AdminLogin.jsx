import { useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password) {
      setError("Please enter both email and password.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // needed so the admin_token cookie is stored
        body: JSON.stringify({ email: email.trim(), password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Login failed.");
      }

      navigate("/admin/dashboard");
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex h-12 w-12 rounded-full bg-cyan-500/10 border border-cyan-500/30 items-center justify-center mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6 text-cyan-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.8}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
          <h1 className="text-xl font-semibold text-white">Admin Login</h1>
          <p className="text-sm text-slate-400 mt-1">
            Sign in to manage your portfolio
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4"
        >
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="username"
              className="w-full bg-slate-800 text-white text-sm rounded-lg px-3.5 py-2.5 outline-none border border-transparent focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 placeholder:text-slate-500"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              className="w-full bg-slate-800 text-white text-sm rounded-lg px-3.5 py-2.5 outline-none border border-transparent focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 placeholder:text-slate-500"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-xs rounded-lg px-3 py-2.5">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed text-slate-950 font-semibold text-sm rounded-lg py-2.5 transition-colors"
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="text-center text-xs text-slate-600 mt-6">
          Kartikey Kumar — Portfolio Admin
        </p>
      </div>
    </div>
  );
}

export default AdminLogin;