// src/pages/admin/AdminAI.jsx

import { useEffect, useRef, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const QUICK_PROMPTS = [
  {
    label: "Today's briefing",
    hint: "Views, messages, AI activity",
    prompt: "Give me today's portfolio briefing.",
  },
  {
    label: "AI usage",
    hint: "How visitors use the assistant",
    prompt: "How is my AI assistant being used?",
  },
  {
    label: "Latest messages",
    hint: "Summarize recent contacts",
    prompt: "Summarize my latest contact messages.",
  },
  {
    label: "Strongest projects",
    hint: "What stands out on the portfolio",
    prompt: "What are my strongest portfolio projects?",
  },
];

const INITIAL_MESSAGE = {
  role: "assistant",
  content:
    "Hi Kartikey. I'm your private portfolio copilot. Ask me about visitors, messages, AI usage, projects or your portfolio data.",
  timestamp: new Date().toISOString(),
};

function formatTime(iso) {
  return new Date(iso).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function TypingIndicator() {
  return (
    <div className="flex items-center gap-1.5 px-1 py-1" aria-label="Copilot is typing">
      <span className="w-1.5 h-1.5 rounded-full bg-slate-500 animate-bounce [animation-delay:-0.3s]" />
      <span className="w-1.5 h-1.5 rounded-full bg-slate-500 animate-bounce [animation-delay:-0.15s]" />
      <span className="w-1.5 h-1.5 rounded-full bg-slate-500 animate-bounce" />
    </div>
  );
}

function MessageBubble({ message, onRetry, retryDisabled }) {
  const isUser = message.role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div className="max-w-[88%] sm:max-w-[75%]">
        <div
          className={`rounded-2xl px-4 py-3 text-sm whitespace-pre-wrap leading-relaxed ${
            isUser
              ? "bg-cyan-500 text-slate-950"
              : message.isError
              ? "bg-red-500/10 border border-red-500/30 text-red-300"
              : "bg-slate-800 text-slate-200"
          }`}
        >
          {message.content}
        </div>

        <div
          className={`flex flex-wrap items-center gap-x-2 gap-y-1 mt-1 px-1 ${
            isUser ? "justify-end" : "justify-start"
          }`}
        >
          <span className="text-[11px] text-slate-600">
            {formatTime(message.timestamp)}
          </span>

          {!isUser && !message.isError && message.model && (
            <span className="text-[11px] text-slate-600">
              · {message.usedFallback ? "fallback model" : message.model}
            </span>
          )}

          {message.isError && onRetry && (
            <button
              onClick={onRetry}
              disabled={retryDisabled}
              className="text-[11px] text-cyan-400 hover:text-cyan-300 font-medium disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Retry
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function QuickPromptCard({ label, hint, onClick, disabled }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="w-full text-left rounded-xl p-3 border border-slate-800 hover:border-cyan-500/30 hover:bg-slate-800/60 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
    >
      <p className="text-xs font-medium text-slate-200">{label}</p>
      <p className="text-[11px] text-slate-500 mt-0.5">{hint}</p>
    </button>
  );
}

function AdminAI() {
  const [messages, setMessages] = useState([INITIAL_MESSAGE]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [usage, setUsage] = useState(null);
  const [usageError, setUsageError] = useState(false);
  const endRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const loadUsage = () => {
    setUsageError(false);
    fetch(`${API_URL}/api/admin/ai/admin-stats`, { credentials: "include" })
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setUsage(d.stats);
        else setUsageError(true);
      })
      .catch(() => setUsageError(true));
  };

  useEffect(() => {
    loadUsage();
  }, []);

  const send = async (question) => {
    const q = question.trim();
    if (!q || loading) return;

    setInput("");
    setMessages((m) => [
      ...m,
      { role: "user", content: q, timestamp: new Date().toISOString() },
    ]);
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/admin/ai/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ message: q }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "AI request failed.");
      }

      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          content: data.reply,
          timestamp: new Date().toISOString(),
          model: data.model,
          usedFallback: data.usedFallback,
          tokensUsed: data.tokensUsed,
        },
      ]);

      setUsage((u) => (u ? { ...u, today: u.today + 1, total: u.total + 1 } : u));
    } catch (err) {
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          content:
            err.message === "Failed to fetch"
              ? "Couldn't reach the server. Check your connection and try again."
              : err.message,
          timestamp: new Date().toISOString(),
          isError: true,
          retryPrompt: q,
        },
      ]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    send(input);
  };

  return (
    <div className="max-w-5xl space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-white">AI Copilot</h1>
          <p className="text-slate-400 text-sm mt-1">
            Private LLM assistant for your admin dashboard.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              usageError ? "bg-red-500" : "bg-emerald-500"
            }`}
          />
          <span className="text-slate-500">
            {usageError
              ? "Usage stats unavailable"
              : usage
              ? `${usage.today} today · ${usage.total} total`
              : "Loading status…"}
          </span>
        </div>
      </div>

      <div className="grid lg:grid-cols-[1fr_280px] gap-5">
        {/* Chat panel */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden flex flex-col h-[75vh] max-h-[680px] lg:h-[620px] lg:max-h-none">
          <div className="px-5 py-4 border-b border-slate-800">
            <p className="text-sm font-medium text-white">Kartikey AI Copilot</p>
            <p className="text-xs text-slate-500">
              Uses live dashboard data + your portfolio context.
            </p>
          </div>

          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
            {messages.map((m, i) => (
              <MessageBubble
                key={i}
                message={m}
                retryDisabled={loading}
                onRetry={
                  m.isError ? () => send(m.retryPrompt) : undefined
                }
              />
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="bg-slate-800 rounded-2xl px-4 py-2">
                  <TypingIndicator />
                </div>
              </div>
            )}

            <div ref={endRef} />
          </div>

          <form
            onSubmit={handleSubmit}
            className="p-3 sm:p-4 border-t border-slate-800 flex gap-2"
          >
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              maxLength={2000}
              placeholder="Ask about your portfolio…"
              className="flex-1 min-w-0 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-cyan-500/50"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="px-4 rounded-xl bg-cyan-500 text-slate-950 font-semibold text-sm disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
            >
              Ask
            </button>
          </form>
        </div>

        {/* Side panel */}
        <div className="space-y-5">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
            <p className="text-sm font-medium text-white">Quick prompts</p>
            <div className="space-y-2 mt-4">
              {QUICK_PROMPTS.map((q) => (
                <QuickPromptCard
                  key={q.label}
                  label={q.label}
                  hint={q.hint}
                  disabled={loading}
                  onClick={() => send(q.prompt)}
                />
              ))}
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
            <p className="text-sm font-medium text-white">Status</p>
            <div className="mt-4 space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Today's requests</span>
                <span className="text-slate-300 font-medium">
                  {usage ? usage.today : "—"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Total requests</span>
                <span className="text-slate-300 font-medium">
                  {usage ? usage.total : "—"}
                </span>
              </div>
              {usageError && (
                <button
                  onClick={loadUsage}
                  className="text-cyan-400 hover:text-cyan-300 font-medium"
                >
                  Retry loading status
                </button>
              )}
            </div>

            <div className="mt-5 pt-5 border-t border-slate-800">
              <p className="text-xs text-slate-500">Security</p>
              <p className="text-xs text-slate-600 mt-2">
                This endpoint requires the admin HttpOnly authentication
                cookie. Your Gemini key remains server-side.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminAI;