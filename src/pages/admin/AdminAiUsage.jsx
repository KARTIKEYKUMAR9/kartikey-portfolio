// src/pages/admin/AdminAiUsage.jsx

import { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

function StatCard({ label, value }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="text-2xl font-semibold text-white mt-1">{value}</p>
    </div>
  );
}

function AdminAiUsage() {
  const [stats, setStats] = useState(null);
  const [recentQuestions, setRecentQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(`${API_URL}/api/admin/ai/stats`, {
          credentials: "include",
        });
        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.message || "Failed to load AI usage stats.");
        }
        setStats(data.stats);
        setRecentQuestions(data.recentQuestions);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-semibold text-white">AI Usage</h1>
      <p className="text-slate-400 text-sm mt-1">
        How visitors are using your AI assistant.
      </p>

      {isLoading && (
        <p className="text-slate-500 text-sm mt-8">Loading stats...</p>
      )}

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg px-4 py-3 mt-6">
          {error}
        </div>
      )}

      {stats && (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
            <StatCard label="Total Requests" value={stats.totalRequests} />
            <StatCard label="Today's Requests" value={stats.todayRequests} />
            <StatCard label="Total Conversations" value={stats.totalConversations} />
            <StatCard label="Avg Requests / Day" value={stats.avgRequestsPerDay} />
          </div>

          <div className="mt-8 bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
            <div className="px-5 py-3 border-b border-slate-800">
              <p className="text-sm font-medium text-white">Recent Questions</p>
            </div>

            {recentQuestions.length === 0 ? (
              <p className="text-slate-500 text-sm px-5 py-6">
                No questions asked yet.
              </p>
            ) : (
              <div className="divide-y divide-slate-800">
                {recentQuestions.map((q, idx) => (
                  <div key={idx} className="px-5 py-3.5 flex items-start justify-between gap-4">
                    <p className="text-sm text-slate-300">{q.content}</p>
                    <span className="text-xs text-slate-600 whitespace-nowrap shrink-0">
                      {new Date(q.timestamp).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default AdminAiUsage;