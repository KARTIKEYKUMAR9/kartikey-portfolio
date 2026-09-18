import { randomUUID } from "crypto";
import Analytics from "../models/Analytics.js";

const COOKIE = "portfolio_visitor_id";
const isProduction = process.env.NODE_ENV === "production";
const cookieOptions = {
  httpOnly: true,
  sameSite: isProduction ? "none" : "lax",
  secure: isProduction,
  maxAge: 365 * 24 * 60 * 60 * 1000,
};

export async function trackPageView(req, res) {
  try {
    let visitorId = req.cookies?.[COOKIE];
    if (!visitorId) {
      visitorId = randomUUID();
      res.cookie(COOKIE, visitorId, cookieOptions);
    }

    const page = typeof req.body?.page === "string" ? req.body.page.trim() : "/";
    if (!page || page.length > 200) {
      return res.status(400).json({ success: false, message: "Invalid page." });
    }

    await Analytics.create({
      visitorId,
      page,
      referrer: req.get("referer") || null,
      userAgent: req.get("user-agent") || null,
    });

    return res.status(201).json({ success: true });
  } catch (error) {
    console.error("trackPageView error:", error.message);
    return res.status(500).json({ success: false, message: "Could not track page view." });
  }
}
