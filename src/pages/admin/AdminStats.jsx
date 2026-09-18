import { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

function Metric({ label, value, sub }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="text-2xl font-semibold text-white mt-1">{value}</p>
      <p className="text-xs text-slate-600 mt-1">{sub}</p>
    </div>
  );
}

function AdminStats() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${API_URL}/api/admin/stats/portfolio`, { credentials: "include" })
      .then(async (r) => {
        const d = await r.json();
        if (!r.ok) throw new Error(d.message || "Failed to load stats.");
        return d;
      })
      .then(setData)
      .catch((e) => setError(e.message));
  }, []);

  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl p-4 text-sm">
        {error}
      </div>
    );
  }

  if (!data) {
    return <p className="text-slate-500 text-sm">Loading portfolio analytics...</p>;
  }

  const s = data.stats;
  const maxDailyViews = Math.max(...data.dailyViews.map((x) => x.count), 1);
  const topPageViews = data.pageBreakdown[0]?.views || 1;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-white">Portfolio Stats</h1>
        <p className="text-slate-400 text-sm mt-1">
          Traffic, visitor behaviour and portfolio activity.
        </p>
      </div>

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <Metric
          label="Total Page Views"
          value={s.totalPageViews}
          sub={`${s.todayPageViews} today`}
        />
        <Metric
          label="Unique Visitors"
          value={s.uniqueVisitors}
          sub={`${s.todayUniqueVisitors} today`}
        />
        <Metric label="7 Day Views" value={s.weekPageViews} sub="Rolling window" />
        <Metric label="30 Day Views" value={s.monthPageViews} sub="Current month" />
      </div>

      <div className="grid lg:grid-cols-[1.5fr_1fr] gap-5">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <p className="text-sm font-medium text-white">Visitor activity · last 7 days</p>
          <div className="h-56 mt-6 flex items-end gap-2 sm:gap-4">
            {data.dailyViews.map((x) => (
              <div
                key={x.date}
                className="flex-1 h-full flex flex-col justify-end items-center gap-2"
              >
                <div
                  title={`${x.count} views`}
                  className="w-full max-w-10 bg-cyan-500/70 rounded-t-md min-h-1"
                  style={{ height: `${Math.max((x.count / maxDailyViews) * 85, 2)}%` }}
                />
                <span className="text-[9px] text-slate-600">{x.date.slice(5)}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <p className="text-sm font-medium text-white">Most visited pages</p>
          <div className="mt-5 space-y-4">
            {data.pageBreakdown.length ? (
              data.pageBreakdown.map((x) => (
                <div key={x.page}>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-300 truncate">{x.page}</span>
                    <span className="text-slate-500">{x.views}</span>
                  </div>
                  <div className="h-1.5 bg-slate-800 rounded-full mt-2 overflow-hidden">
                    <div
                      className="h-full bg-cyan-500/70"
                      style={{ width: `${Math.min((x.views / topPageViews) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-500">No page views yet.</p>
            )}
          </div>
        </div>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <Metric
          label="Contact Messages"
          value={s.totalContacts}
          sub={`${s.unreadContacts} unread`}
        />
        <Metric
          label="Visitor AI Chats"
          value={s.totalConversations}
          sub={`${s.totalAiRequests} visitor questions`}
        />
        <Metric
          label="Admin AI Requests"
          value={s.adminAiRequests}
          sub="Private copilot usage"
        />
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
        <p className="text-sm font-medium text-white">Recent page activity</p>
        <div className="mt-4 divide-y divide-slate-800">
          {data.recentActivity.map((x, i) => (
            <div key={i} className="py-3 flex justify-between gap-4">
              <span className="text-sm text-slate-300 truncate">{x.page}</span>
              <span className="text-xs text-slate-600 whitespace-nowrap">
                {new Date(x.createdAt).toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AdminStats;