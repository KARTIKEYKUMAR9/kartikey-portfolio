import express from "express";
import { trackPageView } from "../controllers/analyticsController.js";

const router = express.Router();
router.post("/pageview", trackPageView);
export default router;
