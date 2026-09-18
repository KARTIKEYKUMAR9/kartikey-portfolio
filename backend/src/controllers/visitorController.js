import ChatLog from "../models/ChatLog.js";

import { SESSION_COOKIE_NAME } from "../config/session.js";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const saveVisitorDetails = async (req, res) => {
  try {
    const { name, email, purpose } = req.body;

    const sessionId = req.cookies?.[SESSION_COOKIE_NAME];

    if (!sessionId) {
      return res.status(400).json({
        success: false,
        message: "AI session not found. Please start the chat again.",
      });
    }

    const session = await ChatLog.findOne({ sessionId });

    if (!session) {
      return res.status(404).json({
        success: false,
        message: "AI session not found. Please start the chat again.",
      });
    }

    // Validate name if supplied
    if (name !== undefined && name !== null) {
      if (typeof name !== "string" || name.trim().length > 100) {
        return res.status(400).json({
          success: false,
          message: "Name must be 100 characters or less.",
        });
      }
    }

    // Validate email if supplied
    if (email !== undefined && email !== null && email !== "") {
      if (
        typeof email !== "string" ||
        email.length > 254 ||
        !EMAIL_REGEX.test(email.trim())
      ) {
        return res.status(400).json({
          success: false,
          message: "Please provide a valid email address.",
        });
      }
    }

    // Validate purpose if supplied
    if (purpose !== undefined && purpose !== null) {
      if (typeof purpose !== "string" || purpose.trim().length > 100) {
        return res.status(400).json({
          success: false,
          message: "Purpose must be 100 characters or less.",
        });
      }
    }

    if (!session.visitor) {
      session.visitor = {};
    }

    if (name !== undefined) {
      session.visitor.name = name?.trim() || null;
    }

    if (email !== undefined) {
      session.visitor.email = email?.trim().toLowerCase() || null;
    }

    if (purpose !== undefined) {
      session.visitor.purpose = purpose?.trim() || null;
    }

    session.lastActiveAt = new Date();

    await session.save();

    return res.status(200).json({
      success: true,
      message: "Visitor details saved successfully.",
      visitor: session.visitor,
    });
  } catch (error) {
    console.error("saveVisitorDetails error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Could not save visitor details.",
    });
  }
};