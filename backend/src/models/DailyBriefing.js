import mongoose from "mongoose";

// One document per calendar day (server-local date, "YYYY-MM-DD").
// Generating a briefing costs a Gemini call, so it's cached here instead
// of being regenerated on every dashboard load — only a manual refresh
// (or a new day) triggers a fresh one.
const dailyBriefingSchema = new mongoose.Schema(
  {
    dateKey: { type: String, required: true, unique: true, index: true },
    summary: { type: String, required: true, maxlength: 4000 },
    highlights: { type: [String], default: [] },
    model: { type: String, default: null },
    tokensUsed: { type: Number, default: null },
  },
  { timestamps: true }
);

export default mongoose.model("DailyBriefing", dailyBriefingSchema);