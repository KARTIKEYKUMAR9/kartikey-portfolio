// backend/src/config/adminCookie.js
//
// The admin auth cookie needs the exact same cross-domain fix as the AI
// visitor session cookie (see config/session.js) — for the same reason.
// Your frontend and backend will live on different domains once deployed
// (e.g. a Vercel frontend calling a Render backend), and a "lax" cookie is
// withheld by the browser on that kind of cross-site request. Locally,
// where frontend and backend are both on localhost, "lax" works fine —
// which is exactly why this bug is easy to ship: it passes every test you
// run before deploying, then breaks the instant it's live.

export const ADMIN_TOKEN_COOKIE_NAME = "admin_token";
export const ADMIN_TOKEN_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

const isProduction = process.env.NODE_ENV === "production";

export const adminCookieOptions = {
  httpOnly: true,
  sameSite: isProduction ? "none" : "lax",
  secure: isProduction, // browsers ignore sameSite: "none" without secure: true
  maxAge: ADMIN_TOKEN_MAX_AGE_MS,
};

export function setAdminCookie(res, token) {
  res.cookie(ADMIN_TOKEN_COOKIE_NAME, token, adminCookieOptions);
}

export function clearAdminCookie(res) {
  // clearCookie must be called with the SAME sameSite/secure attributes
  // used to set the cookie, or some browsers won't clear it — it'll just
  // silently linger.
  res.clearCookie(ADMIN_TOKEN_COOKIE_NAME, {
    httpOnly: true,
    sameSite: adminCookieOptions.sameSite,
    secure: adminCookieOptions.secure,
  });
}