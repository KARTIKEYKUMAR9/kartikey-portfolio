import express from "express";
import rateLimit from "express-rate-limit";
import { requireAuth } from "../middleware/requireAuth.js";
import {
  getAiUsageStats,
  getAllConversations,
  getConversationById,
  chatWithAdminAI,
  getAdminAiStats,
  getDailyBriefing,
} from "../controllers/adminAiController.js";

const router = express.Router();
router.use(requireAuth);

const adminAiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 40,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many admin AI requests. Please try again later." },
});

router.get("/stats", getAiUsageStats);
router.get("/conversations", getAllConversations);
router.get("/conversations/:sessionId", getConversationById);
router.post("/chat", adminAiLimiter, chatWithAdminAI);
router.get("/admin-stats", getAdminAiStats);
router.get("/briefing", adminAiLimiter, getDailyBriefing);

export default router;