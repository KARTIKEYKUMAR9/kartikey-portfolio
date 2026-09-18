import { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

function AdminMessages() {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selected, setSelected] = useState(null);

  const fetchMessages = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/api/admin/contact`, {
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to load messages.");
      }
      setMessages(data.messages);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleMarkRead = async (id) => {
    try {
      await fetch(`${API_URL}/api/admin/contact/${id}/read`, {
        method: "PATCH",
        credentials: "include",
      });
      setMessages((prev) =>
        prev.map((m) => (m._id === id ? { ...m, isRead: true } : m))
      );
      if (selected?._id === id) setSelected((s) => ({ ...s, isRead: true }));
    } catch {
      // silent fail — worst case the unread dot just doesn't clear visually
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this message? This can't be undone.")) return;
    try {
      await fetch(`${API_URL}/api/admin/contact/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      setMessages((prev) => prev.filter((m) => m._id !== id));
      if (selected?._id === id) setSelected(null);
    } catch {
      alert("Could not delete the message. Try again.");
    }
  };

  const openMessage = (msg) => {
    setSelected(msg);
    if (!msg.isRead) handleMarkRead(msg._id);
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold text-white">Contact Messages</h1>
      <p className="text-slate-400 text-sm mt-1">
        {messages.length} message{messages.length !== 1 ? "s" : ""} total
      </p>

      {isLoading && (
        <p className="text-slate-500 text-sm mt-8">Loading messages...</p>
      )}

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg px-4 py-3 mt-6">
          {error}
        </div>
      )}

      {!isLoading && !error && messages.length === 0 && (
        <p className="text-slate-500 text-sm mt-8">No messages yet.</p>
      )}

      {!isLoading && messages.length > 0 && (
        <div className="mt-6 bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
          <div className="hidden sm:grid grid-cols-[1fr_1.4fr_auto_auto] gap-4 px-5 py-3 border-b border-slate-800 text-xs text-slate-500 uppercase tracking-wide">
            <span>From</span>
            <span>Subject</span>
            <span>Date</span>
            <span>Actions</span>
          </div>

          <div className="divide-y divide-slate-800">
            {messages.map((msg) => (
              <div
                key={msg._id}
                className="px-5 py-4 grid grid-cols-1 sm:grid-cols-[1fr_1.4fr_auto_auto] gap-2 sm:gap-4 sm:items-center"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    {!msg.isRead && (
                      <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 shrink-0" />
                    )}
                    <p className="text-sm text-white font-medium truncate">
                      {msg.name}
                    </p>
                  </div>
                  <p className="text-xs text-slate-500 truncate">{msg.email}</p>
                </div>

                <button onClick={() => openMessage(msg)} className="text-left min-w-0">
                  <p className="text-sm text-slate-200 font-medium truncate hover:text-cyan-400 transition-colors">
                    {msg.subject}
                  </p>
                  <p className="text-xs text-slate-500 truncate">{msg.message}</p>
                </button>

                <span className="text-xs text-slate-500 whitespace-nowrap">
                  {new Date(msg.createdAt).toLocaleDateString()}
                </span>

                <div className="flex gap-3">
                  <a
                    href={`mailto:${msg.email}?subject=Re: ${encodeURIComponent(msg.subject)}`}
                    className="text-xs text-cyan-400 hover:text-cyan-300"
                  >
                    Reply
                  </a>
                  <button
                    onClick={() => handleDelete(msg._id)}
                    className="text-xs text-red-400 hover:text-red-300"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {selected && (
        <div
          className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center px-4"
          onClick={() => setSelected(null)}
        >
          <div
            className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-semibold text-white">{selected.subject}</p>
                <p className="text-xs text-slate-500 mt-0.5">
                  {selected.name} &lt;{selected.email}&gt;
                </p>
              </div>
              <button
                onClick={() => setSelected(null)}
                className="text-slate-500 hover:text-white"
                aria-label="Close"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <p className="text-sm text-slate-300 mt-4 whitespace-pre-wrap">
              {selected.message}
            </p>

            <p className="text-xs text-slate-600 mt-4">
              {new Date(selected.createdAt).toLocaleString()}
            </p>

            <div className="flex gap-3 mt-5">
              <a
                href={`mailto:${selected.email}?subject=Re: ${encodeURIComponent(selected.subject)}`}
                className="flex-1 text-center bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-sm font-semibold rounded-lg py-2 transition-colors"
              >
                Reply via Email
              </a>
              <button
                onClick={() => handleDelete(selected._id)}
                className="flex-1 text-center border border-red-500/30 text-red-400 hover:bg-red-500/10 text-sm rounded-lg py-2 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminMessages;