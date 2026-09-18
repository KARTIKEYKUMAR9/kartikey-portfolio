import express from 'express';
import rateLimit from 'express-rate-limit';
import { login, logout, getMe, createAdmin } from '../controllers/authController.js';
import { requireAuth } from '../middleware/requireAuth.js';

const router = express.Router();

// Protect against brute-force login attempts
const loginRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // 10 attempts per 15 min per IP
  message: { error: 'Too many login attempts. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

router.post('/login', loginRateLimiter, login);
router.post('/logout', logout);
router.get('/me', requireAuth, getMe);
router.post('/create-admin', requireAuth, createAdmin);

export default router;