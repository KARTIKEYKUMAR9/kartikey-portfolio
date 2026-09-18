// src/components/common/AIAssistant.jsx

import { useState, useRef, useEffect, useCallback } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const SUGGESTIONS = [
  "What are his skills?",
  "Show me a project",
  "Is he open to opportunities?",
];

const PURPOSES = ["Hiring", "Project work", "Just browsing"];

// Mirrors the backend regex in visitorController.js. Client-side validation is
// a UX convenience only — the server still validates, because anyone can POST
// directly to the API and skip this form entirely.
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Remembers that this visitor chose "skip" so the form doesn't reappear on
// every refresh. sessionStorage (not localStorage) because it should reset
// when they close the tab, matching the lifetime of a visit.
const SKIP_KEY = "portfolio_ai_intro_skipped";

function greetingFor(name) {
  return name
    ? `Hi ${name} 👋 I'm Kartikey's assistant. Ask me anything about his work!`
    : "Hi 👋 I'm Kartikey's assistant. Ask me anything about his work!";
}

function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);

  // "idle" — never opened; "loading" — bootstrapping the session;
  // "greeting" — showing the name/email form; "chat" — normal conversation;
  // "error" — session bootstrap failed, offer a retry.
  const [phase, setPhase] = useState("idle");

  const [visitor, setVisitor] = useState({ name: null, email: null, purpose: null });
  const [messages, setMessages] = useState([]);

  // Greeting form state
  const [form, setForm] = useState({ name: "", email: "", purpose: "" });
  const [formError, setFormError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const nameRef = useRef(null);

  // Latch: prevents a second bootstrap from React StrictMode's double-invoke
  // in dev. Two concurrent /session calls would both run before the first
  // Set-Cookie lands, and you'd get two ChatLog documents per widget open.
  const hasBootstrapped = useRef(false);

  const bootstrapSession = useCallback(async () => {
    setPhase("loading");
    setError(null);

    try {
      const res = await fetch(`${API_URL}/api/ai/session`, {
        method: "POST",
        credentials: "include", // without this the cookie is never sent or stored
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Could not start the chat.");
      }

      setVisitor(data.visitor);

      // Restore the conversation if there is one, otherwise open with the
      // greeting bubble (which is display-only — it's never sent to Gemini).
      const restored = data.messages?.length
        ? data.messages
        : [{ role: "assistant", content: greetingFor(data.visitor?.name) }];

      setMessages(restored);

      const skipped = sessionStorage.getItem(SKIP_KEY) === "true";
      setPhase(data.needsVisitorInfo && !skipped ? "greeting" : "chat");
    } catch (err) {
      setError(err.message || "Couldn't reach the assistant.");
      setPhase("error");
    }
  }, []);

  // Bootstrap on FIRST open only — not on mount. Mounting means the visitor
  // loaded a page; opening means they actually want to talk. Calling /session
  // on mount would create a ChatLog for every page view on the site.
  useEffect(() => {
    if (isOpen && !hasBootstrapped.current) {
      hasBootstrapped.current = true;
      bootstrapSession();
    }
  }, [isOpen, bootstrapSession]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen, isLoading, phase]);

  useEffect(() => {
    if (!isOpen) return;
    if (phase === "greeting") nameRef.current?.focus();
    if (phase === "chat") inputRef.current?.focus();
  }, [isOpen, phase]);

  const submitVisitorDetails = async () => {
    const name = form.name.trim();
    const email = form.email.trim();

    if (!name) {
      setFormError("Please enter your name.");
      return;
    }
    if (name.length > 100) {
      setFormError("Name must be 100 characters or less.");
      return;
    }
    if (email && !EMAIL_REGEX.test(email)) {
      setFormError("Please enter a valid email address.");
      return;
    }

    setFormError(null);
    setIsSubmitting(true);

    try {
      const res = await fetch(`${API_URL}/api/ai/visitor`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          name,
          email: email || null,
          purpose: form.purpose || null,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Could not save your details.");
      }

      setVisitor(data.visitor);

      // Swap the generic greeting for a personalised one. The backend also
      // injects the name into the system instruction, so the model itself
      // knows who it's talking to from the next message onward.
      setMessages([{ role: "assistant", content: greetingFor(data.visitor.name) }]);
      setPhase("chat");
    } catch (err) {
      setFormError(err.message || "Could not save your details.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const skipIntro = () => {
    sessionStorage.setItem(SKIP_KEY, "true");
    setFormError(null);
    setPhase("chat");
  };

  const sendMessage = async (text) => {
    const trimmed = (text ?? input).trim();
    if (!trimmed || isLoading || phase !== "chat") return;

    setError(null);
    setMessages((prev) => [...prev, { role: "user", content: trimmed }]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/ai/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ message: trimmed }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong.");

      setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
    } catch (err) {
      setError(err.message || "Couldn't reach the assistant. Try again?");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleFormKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      submitVisitorDetails();
    }
  };

  // Suggestions only make sense at the very start of a real conversation.
  const showSuggestions = phase === "chat" && messages.length === 1 && !isLoading;

  return (
    <div className="fixed bottom-24 right-6 z-50">
      {/* Toggle button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="h-12 w-12 rounded-full bg-cyan-500 hover:bg-cyan-400 shadow-lg shadow-cyan-500/30 flex items-center justify-center transition-all hover:scale-105"
          aria-label="Chat with Kartikey's AI assistant"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.86 9.86 0 01-4-.8L3 21l1.9-4.1A8.94 8.94 0 013 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
        </button>
      )}

      {/* Chat card */}
      {isOpen && (
        <div className="w-[22rem] sm:w-96 h-[32rem] bg-white rounded-2xl shadow-2xl shadow-black/20 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3.5 bg-gradient-to-r from-cyan-500 to-cyan-400">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-full bg-white/25 flex items-center justify-center text-white font-semibold text-sm">
                KK
              </div>
              <div>
                <p className="text-sm font-semibold text-white leading-tight">
                  Kartikey's Assistant
                </p>
                <p className="text-[11px] text-white/80 flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-300 inline-block" />
                  {visitor.name ? `Chatting with ${visitor.name}` : "Online"}
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white transition-colors"
              aria-label="Close chat"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* ---------- Loading ---------- */}
          {phase === "loading" && (
            <div className="flex-1 flex items-center justify-center bg-slate-50">
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 bg-slate-300 rounded-full animate-bounce [animation-delay:-0.3s]" />
                <span className="h-2 w-2 bg-slate-300 rounded-full animate-bounce [animation-delay:-0.15s]" />
                <span className="h-2 w-2 bg-slate-300 rounded-full animate-bounce" />
              </div>
            </div>
          )}

          {/* ---------- Session failed ---------- */}
          {phase === "error" && (
            <div className="flex-1 flex flex-col items-center justify-center gap-3 px-6 text-center bg-slate-50">
              <p className="text-[13.5px] text-slate-600">
                {error || "Couldn't start the chat."}
              </p>
              <button
                onClick={bootstrapSession}
                className="text-xs px-4 py-2 rounded-full bg-cyan-500 text-white hover:bg-cyan-400 transition-colors"
              >
                Try again
              </button>
            </div>
          )}

          {/* ---------- Greeting / visitor details ---------- */}
          {phase === "greeting" && (
            <div className="flex-1 overflow-y-auto px-5 py-5 bg-slate-50">
              <p className="text-[13.5px] text-slate-700 leading-relaxed">
                Hi 👋 Before we start — who am I speaking with?
              </p>
              <p className="text-[12px] text-slate-400 mt-1 leading-relaxed">
                Kartikey sees these chats, so this helps him follow up.
              </p>

              <div className="mt-4 space-y-3">
                <div>
                  <label
                    htmlFor="ai-visitor-name"
                    className="block text-[12px] font-medium text-slate-600 mb-1"
                  >
                    Name <span className="text-cyan-600">*</span>
                  </label>
                  <input
                    ref={nameRef}
                    id="ai-visitor-name"
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    onKeyDown={handleFormKeyDown}
                    maxLength={100}
                    placeholder="Your name"
                    className="w-full bg-white border border-slate-200 text-slate-700 text-[13.5px] rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-cyan-400 placeholder:text-slate-400"
                  />
                </div>

                <div>
                  <label
                    htmlFor="ai-visitor-email"
                    className="block text-[12px] font-medium text-slate-600 mb-1"
                  >
                    Email <span className="text-slate-400 font-normal">(optional)</span>
                  </label>
                  <input
                    id="ai-visitor-email"
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    onKeyDown={handleFormKeyDown}
                    maxLength={254}
                    placeholder="you@company.com"
                    className="w-full bg-white border border-slate-200 text-slate-700 text-[13.5px] rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-cyan-400 placeholder:text-slate-400"
                  />
                </div>

                <div>
                  <span className="block text-[12px] font-medium text-slate-600 mb-1.5">
                    What brings you here?{" "}
                    <span className="text-slate-400 font-normal">(optional)</span>
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {PURPOSES.map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() =>
                          setForm({ ...form, purpose: form.purpose === p ? "" : p })
                        }
                        aria-pressed={form.purpose === p}
                        className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                          form.purpose === p
                            ? "bg-cyan-500 text-white border-cyan-500"
                            : "border-slate-200 text-slate-600 bg-white hover:bg-slate-100"
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>

                {formError && (
                  <p className="text-[12.5px] text-red-600">{formError}</p>
                )}

                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={submitVisitorDetails}
                    disabled={isSubmitting}
                    className="flex-1 text-[13px] font-medium px-4 py-2.5 rounded-lg bg-cyan-500 text-white hover:bg-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isSubmitting ? "Saving..." : "Start chatting"}
                  </button>
                  <button
                    onClick={skipIntro}
                    disabled={isSubmitting}
                    className="text-[13px] px-3 py-2.5 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                  >
                    Skip
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ---------- Chat ---------- */}
          {phase === "chat" && (
            <>
              <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-slate-50">
                {messages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex ${
                      msg.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[78%] px-3.5 py-2.5 text-[13.5px] leading-relaxed shadow-sm whitespace-pre-wrap ${
                        msg.role === "user"
                          ? "bg-cyan-500 text-white rounded-2xl rounded-br-md"
                          : "bg-white text-slate-700 rounded-2xl rounded-bl-md border border-slate-100"
                      }`}
                    >
                      {msg.content}
                    </div>
                  </div>
                ))}

                {showSuggestions && (
                  <div className="flex flex-wrap gap-2 pt-1">
                    {SUGGESTIONS.map((s) => (
                      <button
                        key={s}
                        onClick={() => sendMessage(s)}
                        className="text-xs px-3 py-1.5 rounded-full border border-cyan-200 text-cyan-700 bg-cyan-50 hover:bg-cyan-100 transition-colors"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                )}

                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-white border border-slate-100 rounded-2xl rounded-bl-md px-4 py-3 shadow-sm flex items-center gap-1">
                      <span className="h-1.5 w-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                      <span className="h-1.5 w-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                      <span className="h-1.5 w-1.5 bg-slate-400 rounded-full animate-bounce" />
                    </div>
                  </div>
                )}

                {error && (
                  <div className="flex justify-start">
                    <div className="bg-red-50 text-red-600 border border-red-100 rounded-2xl px-3.5 py-2 text-[13px]">
                      {error}
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="border-t border-slate-100 p-3 flex items-center gap-2 bg-white">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  maxLength={1000}
                  placeholder="Type your question..."
                  className="flex-1 bg-slate-100 text-slate-700 text-[13.5px] rounded-full px-4 py-2.5 outline-none focus:ring-2 focus:ring-cyan-400 placeholder:text-slate-400"
                />
                <button
                  onClick={() => sendMessage()}
                  disabled={isLoading || !input.trim()}
                  className="h-9 w-9 shrink-0 rounded-full bg-cyan-500 hover:bg-cyan-400 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
                  aria-label="Send message"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-4 h-4 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M2.94 2.94a1.5 1.5 0 011.6-.34l13 5a1.5 1.5 0 010 2.8l-13 5a1.5 1.5 0 01-1.99-1.87L4.1 10 2.55 4.81a1.5 1.5 0 01.39-1.87z" />
                  </svg>
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default AIAssistant;