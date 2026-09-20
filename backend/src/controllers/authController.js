import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';
import { setAdminCookie, clearAdminCookie } from '../config/adminCookie.js';

function signToken(admin) {
  return jwt.sign(
    { id: admin._id, email: admin.email },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const admin = await Admin.findOne({ email: email.toLowerCase().trim() });

    // Same error for "no such admin" and "wrong password" — don't reveal
    // which one it was, that just helps someone guessing your email.
    if (!admin) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const token = signToken(admin);
    setAdminCookie(res, token);

    return res.status(200).json({
      success: true,
      admin: { id: admin._id, email: admin.email, name: admin.name },
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ error: 'Something went wrong logging in.' });
  }
}

export function logout(req, res) {
  clearAdminCookie(res);
  return res.status(200).json({ success: true });
}

// Lets the frontend check "am I still logged in?" on page load/refresh
export async function getMe(req, res) {
  try {
    // req.admin is attached by the requireAuth middleware
    const admin = await Admin.findById(req.admin.id).select('-password');
    if (!admin) return res.status(404).json({ error: 'Admin not found.' });
    return res.status(200).json({ admin });
  } catch (err) {
    console.error('getMe error:', err);
    return res.status(500).json({ error: 'Something went wrong.' });
  }
}

// Lists every admin account — no passwords, obviously. Exists so the
// create-admin page can show "who already has access" before you add
// someone. Without this, creating a second admin means either remembering
// who you already added or querying Mongo directly to check.
export async function listAdmins(req, res) {
  try {
    const admins = await Admin.find().select("-password").sort({ createdAt: 1 });
    return res.status(200).json({ success: true, admins });
  } catch (err) {
    console.error("listAdmins error:", err);
    return res.status(500).json({ error: "Could not fetch admin accounts." });
  }
}

// Creates a new admin account. Protected by requireAuth in the routes file —
// only someone who is ALREADY logged in as an admin can create another one.
// There is no public registration route anywhere in this app, by design.
export async function createAdmin(req, res) {
  try {
    const { email, password, name } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    if (password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters.' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const existing = await Admin.findOne({ email: normalizedEmail });
    if (existing) {
      return res.status(409).json({ error: 'An admin with that email already exists.' });
    }

    const admin = new Admin({ email: normalizedEmail, password, name: name || 'Admin' });
    await admin.save(); // password hashed automatically via pre-save hook

    return res.status(201).json({
      success: true,
      admin: { id: admin._id, email: admin.email, name: admin.name },
    });
  } catch (err) {
    console.error('createAdmin error:', err);
    return res.status(500).json({ error: 'Something went wrong creating the admin.' });
  }
}