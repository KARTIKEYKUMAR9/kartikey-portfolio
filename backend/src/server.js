import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";

import contactRoutes from "./routes/contactRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import adminContactRoutes from "./routes/adminContactRoutes.js";
import adminAiRoutes from "./routes/adminAiRoutes.js";
import visitorRoutes from "./routes/visitorRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";
import adminStatsRoutes from "./routes/adminStatsRoutes.js";

dotenv.config();

// Fail fast, with a clear message, instead of failing mysteriously later.
// Without this, a missing GEMINI_API_KEY doesn't surface until the first
// visitor opens the AI widget in production — and MONGODB_URI silently
// being undefined produces a Mongoose connection error that looks nothing
// like "you forgot to set an env var on your host."
const REQUIRED_ENV_VARS = [
  "MONGODB_URI",
  "JWT_SECRET",
  "GEMINI_API_KEY",
  "EMAIL_USER",
  "EMAIL_PASS",
];
const missingEnvVars = REQUIRED_ENV_VARS.filter((key) => !process.env[key]);
if (missingEnvVars.length > 0) {
  console.error(
    `❌ Missing required environment variables: ${missingEnvVars.join(", ")}`
  );
  console.error("   Check your .env file against .env.example.");
  process.exit(1);
}

const app = express();
const PORT = process.env.PORT || 5000;

app.use(helmet());

// The frontend's own origin, set per-environment. Locally this is unset and
// falls back to the Vite dev server; in production it's the deployed
// frontend's URL (e.g. https://kartikey.dev), set as an env var on your
// hosting platform — never hardcoded, since it's different in every
// environment and you don't want a code change + redeploy just to point
// the backend at a new frontend URL.
const allowedOrigins = [
  process.env.FRONTEND_URL,
  "http://localhost:5173", // always allowed, so local dev keeps working
  // even once FRONTEND_URL is set for production
].filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      // No Origin header = same-origin request, curl, Postman, server-to-
      // server call, etc. — not a browser cross-origin request, so there's
      // nothing for CORS to police.
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

app.use("/api/contact", contactRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/admin/contact", adminContactRoutes);
app.use("/api/admin/ai", adminAiRoutes);
app.use("/api/ai/visitor", visitorRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/admin/stats", adminStatsRoutes);

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Kartikey Portfolio Backend is running 🚀",
  });
});

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "API is healthy",
  });
});

// Error middleware MUST be registered after every route (Express only
// reaches it when something upstream calls next(err), which is what the
// CORS origin callback above does for a rejected origin). Without this,
// Express falls through to its default handler, which sends a 500 with an
// HTML stack-trace page — not something a fetch() caller can parse, and
// not something you want leaking internals in production.
app.use((err, req, res, next) => {
  if (err.message === "Not allowed by CORS") {
    return res.status(403).json({ success: false, message: "Not allowed by CORS." });
  }
  console.error("Unhandled error:", err);
  return res.status(500).json({ success: false, message: "Something went wrong." });
});

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB connected successfully ✅");

    app.listen(PORT, () => {
      console.log(`Backend server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("MongoDB connection failed ❌");
    console.error(error.message);
    process.exit(1);
  }
};

connectDB();