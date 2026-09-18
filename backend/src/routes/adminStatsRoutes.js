import express from "express";
import { requireAuth } from "../middleware/requireAuth.js";
import { getPortfolioStats, getDashboardOverview } from "../controllers/adminStatsController.js";

const router = express.Router();
router.use(requireAuth);
router.get("/overview", getDashboardOverview);
router.get("/portfolio", getPortfolioStats);
export default router;
