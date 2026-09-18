import jwt from 'jsonwebtoken';
import { ADMIN_TOKEN_COOKIE_NAME } from '../config/adminCookie.js';

export function requireAuth(req, res, next) {
  const token = req.cookies?.[ADMIN_TOKEN_COOKIE_NAME];

  if (!token) {
    return res.status(401).json({ error: 'Not authenticated.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = decoded; 
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Session expired, please log in again.' });
  }
}