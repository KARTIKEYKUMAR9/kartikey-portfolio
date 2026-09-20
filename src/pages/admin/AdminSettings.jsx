// src/pages/admin/AdminSettings.jsx

import { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

function AdminSettings() {
  const [admins, setAdmins] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [listError, setListError] = useState(null);

  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [formError, setFormError] = useState(null);
  const [formSuccess, setFormSuccess] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchAdmins = async () => {
    setIsLoading(true);
    setListError(null);
    try {
      const res = await fetch(`${API_URL}/api/auth/admins`, {
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to load admin accounts.");
      }
      setAdmins(data.admins);
    } catch (err) {
      setListError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);
    setFormSuccess(null);

    if (form.password.length < 8) {
      setFormError("Password must be at least 8 characters.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch(`${API_URL}/api/auth/create-admin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Could not create admin.");
      }

      setFormSuccess(`Admin account created for ${data.admin.email}.`);
      setForm({ name: "", email: "", password: "" });
      // Refresh the list so the new account shows up immediately, rather
      // than making you reload the page to confirm it worked.
      fetchAdmins();
    } catch (err) {
      setFormError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold text-white">Admin Settings</h1>
      <p className="text-slate-400 text-sm mt-1">
        Manage who has access to this dashboard.
      </p>

      {/* Existing admins */}
      <div className="mt-6 bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="px-5 py-3 border-b border-slate-800">
          <p className="text-sm font-medium text-white">Current admins</p>
        </div>

        {isLoading && (
          <p className="text-slate-500 text-sm px-5 py-4">Loading...</p>
        )}

        {listError && (
          <p className="text-red-400 text-sm px-5 py-4">{listError}</p>
        )}

        {!isLoading && !listError && (
          <div className="divide-y divide-slate-800">
            {admins.map((a) => (
              <div key={a._id} className="px-5 py-3 flex items-center justify-between">
                <div>
                  <p className="text-sm text-white">{a.name}</p>
                  <p className="text-xs text-slate-500">{a.email}</p>
                </div>
                <span className="text-xs text-slate-500">
                  {new Date(a.createdAt).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create admin form */}
      <form
        onSubmit={handleSubmit}
        className="mt-6 bg-slate-900 border border-slate-800 rounded-2xl p-5 max-w-md"
      >
        <p className="text-sm font-medium text-white mb-4">Add a new admin</p>

        <div className="space-y-3">
          <div>
            <label className="block text-xs text-slate-400 mb-1" htmlFor="admin-name">
              Name
            </label>
            <input
              id="admin-name"
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Full name"
              className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-sm rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-cyan-500 placeholder:text-slate-600"
            />
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1" htmlFor="admin-email">
              Email <span className="text-cyan-500">*</span>
            </label>
            <input
              id="admin-email"
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="admin@example.com"
              className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-sm rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-cyan-500 placeholder:text-slate-600"
            />
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1" htmlFor="admin-password">
              Password <span className="text-cyan-500">*</span>
            </label>
            <input
              id="admin-password"
              type="password"
              required
              minLength={8}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="At least 8 characters"
              className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-sm rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-cyan-500 placeholder:text-slate-600"
            />
          </div>

          {formError && <p className="text-xs text-red-400">{formError}</p>}
          {formSuccess && <p className="text-xs text-emerald-400">{formSuccess}</p>}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-slate-950 text-sm font-semibold rounded-lg px-4 py-2.5 transition-colors"
          >
            {isSubmitting ? "Creating..." : "Create admin"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default AdminSettings;