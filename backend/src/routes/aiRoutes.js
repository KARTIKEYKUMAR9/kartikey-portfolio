// backend/src/routes/aiRoutes.js

import express from "express";
import rateLimit from "express-rate-limit";
import { createAiSession, chatWithAI } from "../controllers/aiController.js";

const router = express.Router();

// The chat endpoint is the one that costs you money (Gemini quota).
const aiRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // 10 requests per minute per IP
  message: { error: "Too many requests, please slow down." },
  standardHeaders: true,
  legacyHeaders: false,
});

// /session is cheap per call but EVERY call without a valid cookie inserts a
// new ChatLog document. Unlimited, a bot can fill your Atlas free tier (512MB)
// with empty conversations and wreck your admin stats. A looser limit than
// /chat is fine — a real visitor hits this once per page load.
const sessionRateLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  message: { success: false, error: "Too many requests, please slow down." },
  standardHeaders: true,
  legacyHeaders: false,
});

router.post("/session", sessionRateLimiter, createAiSession);

router.post("/chat", aiRateLimiter, chatWithAI);

export default router;