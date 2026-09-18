// backend/src/routes/adminContactRoutes.js

import express from "express";
import { requireAuth } from "../middleware/requireAuth.js";
import {
  getAllMessages,
  markAsRead,
  deleteMessage,
} from "../controllers/adminContactController.js";

const router = express.Router();

// Every route here requires a logged-in admin
router.use(requireAuth);

router.get("/", getAllMessages);
router.patch("/:id/read", markAsRead);
router.delete("/:id", deleteMessage);

export default router;