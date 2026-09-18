// backend/src/models/ChatLog.js

import mongoose from "mongoose";

// One message exchanged in a conversation
const messageSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      enum: ["user", "assistant"],
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
    tokensUsed: {
      type: Number,
      default: null,
    },
  },
  { _id: false }
);

// Visitor information collected by the AI assistant.
// All fields are optional because visitors should be able
// to use the assistant without providing personal information.
const visitorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      maxlength: 100,
      default: null,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      maxlength: 254,
      default: null,
    },
    purpose: {
      type: String,
      trim: true,
      maxlength: 100,
      default: null,
    },
  },
  { _id: false }
);

// One conversation = one browser session
const chatLogSchema = new mongoose.Schema(
  {
    sessionId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    visitor: {
      type: visitorSchema,
      default: () => ({}),
    },

    messages: {
      type: [messageSchema],
      default: [],
    },

    startedAt: {
      type: Date,
      default: Date.now,
    },

    lastActiveAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("ChatLog", chatLogSchema);