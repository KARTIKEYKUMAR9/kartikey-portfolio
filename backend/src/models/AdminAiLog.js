import mongoose from "mongoose";

const adminAiLogSchema = new mongoose.Schema(
  {
    adminId: { type: mongoose.Schema.Types.ObjectId, ref: "Admin", required: true, index: true },
    question: { type: String, required: true, maxlength: 2000 },
    answer: { type: String, required: true, maxlength: 10000 },
    tokensUsed: { type: Number, default: null },
  },
  { timestamps: true }
);

export default mongoose.model("AdminAiLog", adminAiLogSchema);
