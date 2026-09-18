import mongoose from "mongoose";

const analyticsSchema = new mongoose.Schema(
  {
    visitorId: { type: String, required: true, index: true },
    page: { type: String, required: true, trim: true, maxlength: 200, index: true },
    referrer: { type: String, default: null, maxlength: 500 },
    userAgent: { type: String, default: null, maxlength: 1000 },
    createdAt: { type: Date, default: Date.now, index: true },
  },
  { timestamps: false }
);

export default mongoose.model("Analytics", analyticsSchema);
