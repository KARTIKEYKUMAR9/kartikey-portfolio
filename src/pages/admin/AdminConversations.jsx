// src/pages/admin/AdminConversations.jsx
//
// Step 2F — list view of AI visitor conversations. Deliberately read-only
// and preview-only: it shows who talked, how much, and their last message,
// but not the full transcript. That's 2G, fetched per-conversation on demand
// rather than shipped in bulk here.

import { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

function timeAgo(iso) {
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.round(diffMs / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.round(hrs / 24);
  return `${days}d ago`;
}

function AdminConversations() {
  const [conversations, setConversations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Step 2G state — which conversation is open in the side panel, its full
  // transcript once fetched, and that fetch's own loading/error state.
  // Kept separate from the list's isLoading/error so a failed detail fetch
  // never wipes out an already-loaded list.
  const [selectedId, setSelectedId] = useState(null);
  const [detail, setDetail] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState(null);

  const fetchConversations = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/api/admin/ai/conversations`, {
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to load conversations.");
      }
      setConversations(data.conversations);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  const openConversation = async (sessionId) => {
    setSelectedId(sessionId);
    setDetail(null);
    setDetailError(null);
    setDetailLoading(true);

    try {
      const res = await fetch(
        `${API_URL}/api/admin/ai/conversations/${sessionId}`,
        { credentials: "include" }
      );
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Could not load this conversation.");
      }
      setDetail(data.conversation);
    } catch (err) {
      setDetailError(err.message);
    } finally {
      setDetailLoading(false);
    }
  };

  const closePanel = () => {
    setSelectedId(null);
    setDetail(null);
    setDetailError(null);
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold text-white">AI Conversations</h1>
      <p className="text-slate-400 text-sm mt-1">
        {conversations.length} conversation{conversations.length !== 1 ? "s" : ""} with
        at least one message
      </p>

      {isLoading && (
        <p className="text-slate-500 text-sm mt-8">Loading conversations...</p>
      )}

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg px-4 py-3 mt-6">
          {error}
        </div>
      )}

      {!isLoading && !error && conversations.length === 0 && (
        <p className="text-slate-500 text-sm mt-8">
          No conversations yet — they'll show up here once a visitor sends a
          message through the AI assistant.
        </p>
      )}

      {!isLoading && conversations.length > 0 && (
        <div className="mt-6 bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
          <div className="hidden sm:grid grid-cols-[1fr_2fr_auto_auto] gap-4 px-5 py-3 border-b border-slate-800 text-xs text-slate-500 uppercase tracking-wide">
            <span>Visitor</span>
            <span>Last message</span>
            <span>Messages</span>
            <span>Active</span>
          </div>

          <div className="divide-y divide-slate-800">
            {conversations.map((c) => (
              <button
                key={c.sessionId}
                onClick={() => openConversation(c.sessionId)}
                className="w-full text-left px-5 py-4 grid grid-cols-1 sm:grid-cols-[1fr_2fr_auto_auto] gap-2 sm:gap-4 sm:items-center hover:bg-slate-800/50 transition-colors"
              >
                <div className="min-w-0">
                  <p className="text-sm text-white font-medium truncate">
                    {c.visitor?.name || (
                      <span className="text-slate-500 font-normal">Anonymous</span>
                    )}
                  </p>
                  {c.visitor?.email && (
                    <p className="text-xs text-slate-500 truncate">{c.visitor.email}</p>
                  )}
                  {c.visitor?.purpose && (
                    <span className="inline-block mt-1 text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                      {c.visitor.purpose}
                    </span>
                  )}
                </div>

                <div className="min-w-0">
                  <p className="text-sm text-slate-300 truncate">
                    <span className="text-slate-500">
                      {c.lastMessage?.role === "user" ? "Visitor: " : "Assistant: "}
                    </span>
                    {c.lastMessage?.content}
                  </p>
                </div>

                <span className="text-xs text-slate-500 whitespace-nowrap">
                  {c.messageCount}
                </span>

                <span className="text-xs text-slate-500 whitespace-nowrap">
                  {timeAgo(c.lastActiveAt)}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 2G — conversation detail panel */}
      {selectedId && (
        <div
          className="fixed inset-0 bg-black/60 z-50 flex items-center justify-end sm:py-6 sm:pr-6"
          onClick={closePanel}
        >
          <div
            className="bg-slate-900 border border-slate-800 rounded-2xl sm:rounded-2xl w-full sm:w-[26rem] h-full sm:h-full max-h-full flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between px-5 py-4 border-b border-slate-800">
              <div className="min-w-0">
                <p className="text-sm font-semibold text-white truncate">
                  {detail?.visitor?.name || "Anonymous visitor"}
                </p>
                {detail?.visitor?.email && (
                  <p className="text-xs text-slate-500 truncate">{detail.visitor.email}</p>
                )}
                {detail?.visitor?.purpose && (
                  <span className="inline-block mt-1 text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                    {detail.visitor.purpose}
                  </span>
                )}
              </div>
              <button
                onClick={closePanel}
                className="text-slate-500 hover:text-white shrink-0 ml-3"
                aria-label="Close"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
              {detailLoading && (
                <p className="text-slate-500 text-sm">Loading conversation...</p>
              )}

              {detailError && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg px-4 py-3">
                  {detailError}
                </div>
              )}

              {detail?.messages.map((m, idx) => (
                <div
                  key={idx}
                  className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] px-3.5 py-2.5 text-[13px] leading-relaxed whitespace-pre-wrap rounded-2xl ${
                      m.role === "user"
                        ? "bg-cyan-500 text-white rounded-br-md"
                        : "bg-slate-800 text-slate-200 rounded-bl-md"
                    }`}
                  >
                    {m.content}
                  </div>
                </div>
              ))}
            </div>

            {detail && (
              <div className="px-5 py-3 border-t border-slate-800 text-xs text-slate-500">
                Started {new Date(detail.startedAt).toLocaleString()}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminConversations;