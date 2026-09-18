import express from "express";
import { saveVisitorDetails } from "../controllers/visitorController.js";

const router = express.Router();

router.post("/", saveVisitorDetails);

export default router;