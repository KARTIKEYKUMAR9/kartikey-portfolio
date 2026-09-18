// backend/src/config/session.js
//
// Single source of truth for the visitor-session cookie.
// Previously these constants were copy-pasted into aiController.js and
// visitorController.js. If they ever drift apart (one says "lax", the other
// says "none"), the visitor flow breaks in ways that are painful to debug,
// because the cookie silently stops being sent and every request looks like
// a brand-new visitor.

export const SESSION_COOKIE_NAME = "portfolio_ai_session";

// How long the cookie survives in the browser.
export const SESSION_COOKIE_MAX_AGE_MS = 24 * 60 * 60 * 1000; // 1 day

// How long a conversation can sit idle before we treat the next message
// as a new conversation.
export const SESSION_TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes

// In production your frontend and backend will almost certainly live on
// different domains (e.g. Vercel + Render). A "lax" cookie is NOT sent on
// cross-site fetch() calls, so the session would break the moment you deploy.
// "none" + secure:true is what makes cross-site cookies work.
const isProduction = process.env.NODE_ENV === "production";

export const sessionCookieOptions = {
  httpOnly: true, // JS on the page cannot read it — blocks XSS cookie theft
  sameSite: isProduction ? "none" : "lax",
  secure: isProduction, // "none" is ignored by browsers unless secure is true
  maxAge: SESSION_COOKIE_MAX_AGE_MS,
};

/**
 * Attach (or refresh) the session cookie on a response.
 * Re-issuing on every request slides the 1-day expiry forward.
 */
export function setSessionCookie(res, sessionId) {
  res.cookie(SESSION_COOKIE_NAME, sessionId, sessionCookieOptions);
}

/**
 * True if the conversation has been idle longer than the timeout.
 */
export function isSessionExpired(session) {
  if (!session) return false;
  return Date.now() - session.lastActiveAt.getTime() > SESSION_TIMEOUT_MS;
}