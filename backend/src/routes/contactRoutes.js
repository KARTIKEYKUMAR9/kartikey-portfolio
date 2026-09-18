import express from "express";
import rateLimit from "express-rate-limit";
import { createContact } from "../controllers/contactController.js";

const router = express.Router();

// Before this there was NO rate limit here at all — the one public,
// unauthenticated endpoint that both writes to your database AND triggers
// an outbound email on every hit. Without a limit, a script can fill your
// Mongo collection and your inbox in the same request loop, and depending
// on your email provider's pricing, run up real cost. 5 submissions per
// 10 minutes is generous for a real visitor filling out a form once and
// tight enough to stop a script.
const contactRateLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 5,
  message: { success: false, message: "Too many messages sent. Please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});

router.post("/", contactRateLimiter, createContact);

export default router;