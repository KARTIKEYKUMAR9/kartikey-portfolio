// backend/src/scripts/seedAdmin.js
//
// Run this ONCE to create your admin account:
//   node src/scripts/seedAdmin.js
//
// Reads ADMIN_EMAIL and ADMIN_PASSWORD from your .env file so the real
// password never has to be typed into a request or committed anywhere.
// Delete this file (or at least stop running it) after your admin account
// exists — there's no reason to keep it accessible on a deployed server.

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Admin from '../models/Admin.js';

dotenv.config();

async function seed() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    console.error('Set ADMIN_EMAIL and ADMIN_PASSWORD in your .env file first.');
    process.exit(1);
  }

  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB.');

  const existing = await Admin.findOne({ email: email.toLowerCase().trim() });
  if (existing) {
    console.log(`Admin with email ${email} already exists — nothing to do.`);
    process.exit(0);
  }

  const admin = new Admin({ email, password, name: 'Kartikey' });
  await admin.save(); // password is hashed automatically via the pre-save hook

  console.log(`Admin account created for ${email}.`);
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seeding failed:', err);
  process.exit(1);
});