import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

function Card({ label, value, sub }) {
  return <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5"><p className="text-xs text-slate-500">{label}</p><p className="text-2xl font-semibold text-white mt-1">{value}</p>{sub && <p className="text-xs text-slate-500 mt-1">{sub}</p>}</div>;
}

function DailyBriefingCard() {
  const [briefing, setBriefing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const load = (refresh = false) => {
    refresh ? setRefreshing(true) : setLoading(true);
    setError(null);

    fetch(`${API_URL}/api/admin/ai/briefing${refresh ? "?refresh=true" : ""}`, {
      credentials: "include",
    })
      .then(async (r) => {
        const d = await r.json();
        if (!r.ok || !d.success) throw new Error(d.message || "Could not load briefing.");
        return d;
      })
      .then((d) => setBriefing(d.briefing))
      .catch((e) => setError(e.message))
      .finally(() => {
        setLoading(false);
        setRefreshing(false);
      });
  };

  useEffect(() => {
    load(false);
  }, []);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-white">Daily briefing</p>
          <p className="text-xs text-slate-500 mt-1">AI-generated summary of today vs the past week.</p>
        </div>
        <button
          onClick={() => load(true)}
          disabled={loading || refreshing}
          className="text-xs text-cyan-400 hover:text-cyan-300 disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
        >
          {refreshing ? "Refreshing…" : "Refresh"}
        </button>
      </div>

      {loading && <p className="text-sm text-slate-500 mt-4">Generating…</p>}

      {error && !loading && (
        <p className="text-sm text-red-400 mt-4">{error}</p>
      )}

      {briefing && !loading && !error && (
        <div className="mt-4 space-y-3">
          <p className="text-sm text-slate-300 leading-relaxed">{briefing.summary}</p>

          {briefing.highlights?.length > 0 && (
            <ul className="space-y-1.5">
              {briefing.highlights.map((h, i) => (
                <li key={i} className="text-xs text-slate-400 flex gap-2">
                  <span className="text-cyan-400 shrink-0">•</span>
                  <span>{h}</span>
                </li>
              ))}
            </ul>
          )}

          <p className="text-[11px] text-slate-600">
            Generated {new Date(briefing.generatedAt).toLocaleString()}
          </p>
        </div>
      )}
    </div>
  );
}

function AdminDashboard() {
  const [data, setData] = useState(null);
  const [adminName, setAdminName] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    Promise.all([
      fetch(`${API_URL}/api/admin/stats/overview`, { credentials: "include" }).then(async r => { const d = await r.json(); if (!r.ok) throw new Error(d.message || "Failed to load dashboard"); return d; }),
      fetch(`${API_URL}/api/auth/me`, { credentials: "include" }).then(r => r.json()),
    ]).then(([overview, me]) => { setData(overview); setAdminName(me?.admin?.name || ""); }).catch(e => setError(e.message));
  }, []);

  if (error) return <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl p-4 text-sm">{error}</div>;
  if (!data) return <p className="text-slate-500 text-sm">Loading dashboard...</p>;

  const o = data.overview;
  return <div className="space-y-8">
    <div><h1 className="text-2xl font-semibold text-white">Welcome back{adminName ? `, ${adminName}` : ""} 👋</h1><p className="text-slate-400 text-sm mt-1">Your portfolio control center at a glance.</p></div>

    <DailyBriefingCard />

    <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
      <Card label="Total Visitors" value={o.visitors} sub={`${o.todayViews} today`} />
      <Card label="Contact Messages" value={o.messages} sub={`${o.unreadMessages} unread`} />
      <Card label="AI Conversations" value={o.aiConversations} sub={`${o.todayAiRequests} questions today`} />
      <Card label="Today Page Views" value={o.todayViews} sub="Live analytics" />
    </div>

    <div className="grid lg:grid-cols-[1.5fr_1fr] gap-5">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
        <div className="flex items-center justify-between"><div><p className="text-sm font-medium text-white">Quick actions</p><p className="text-xs text-slate-500 mt-1">Jump directly to the important areas.</p></div><Link to="/admin/ai" className="text-xs text-cyan-400 hover:text-cyan-300">Open AI →</Link></div>
        <div className="grid sm:grid-cols-3 gap-3 mt-5">
          <Link to="/admin/messages" className="rounded-xl border border-slate-800 bg-slate-950 p-4 hover:border-cyan-500/30"><p className="text-sm text-white">Messages</p><p className="text-xs text-slate-500 mt-1">Review leads</p></Link>
          <Link to="/admin/stats" className="rounded-xl border border-slate-800 bg-slate-950 p-4 hover:border-cyan-500/30"><p className="text-sm text-white">Analytics</p><p className="text-xs text-slate-500 mt-1">Traffic & pages</p></Link>
          <Link to="/admin/conversations" className="rounded-xl border border-slate-800 bg-slate-950 p-4 hover:border-cyan-500/30"><p className="text-sm text-white">AI Chats</p><p className="text-xs text-slate-500 mt-1">Visitor conversations</p></Link>
        </div>
      </div>
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
        <p className="text-sm font-medium text-white">Recent contact activity</p>
        <div className="mt-4 space-y-3">{data.recentMessages.length ? data.recentMessages.map(m => <div key={m._id || `${m.email}-${m.createdAt}`} className="border-b border-slate-800 last:border-0 pb-3 last:pb-0"><div className="flex justify-between gap-3"><p className="text-sm text-slate-300 truncate">{m.name}</p><span className={`text-[10px] ${m.isRead ? "text-slate-600" : "text-cyan-400"}`}>{m.isRead ? "read" : "new"}</span></div><p className="text-xs text-slate-500 truncate mt-1">{m.subject} · {m.email}</p></div>) : <p className="text-sm text-slate-500">No messages yet.</p>}</div>
      </div>
    </div>

    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5"><div className="flex items-center justify-between"><div><p className="text-sm font-medium text-white">Admin AI Copilot</p><p className="text-xs text-slate-500 mt-1">Ask about your live portfolio data, visitors, messages and AI usage.</p></div><Link to="/admin/ai" className="px-3 py-2 rounded-lg bg-cyan-500 text-slate-950 text-xs font-semibold hover:bg-cyan-400">Open Copilot</Link></div></div>
  </div>;
}
export default AdminDashboard;