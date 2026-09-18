// backend/src/controllers/aiController.js

import { randomUUID } from "crypto";
import { GoogleGenAI } from "@google/genai";
import ChatLog from "../models/ChatLog.js";
import aiContext from "../data/aiContext.js";
import {
  SESSION_COOKIE_NAME,
  setSessionCookie,
  isSessionExpired,
} from "../config/session.js";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const MODEL_NAME = "gemini-3.6-flash";

// Gemini expects chat history as alternating user/model turns.
// Our stored role is 'assistant' — map it to Gemini's 'model'.
function toGeminiHistory(messages) {
  return messages.map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }],
  }));
}

// Shape a stored message for the frontend. The DB document carries fields the
// browser has no business seeing (tokensUsed is internal billing data), so we
// whitelist rather than dumping session.messages straight into the response.
function toClientMessage(m) {
  return {
    role: m.role,
    content: m.content,
    timestamp: m.timestamp,
  };
}

/**
 * POST /api/ai/session
 *
 * Called once when the AI widget opens. Its job is to answer three questions
 * for the frontend:
 *   1. Do I have a session cookie? (if not, issue one)
 *   2. Do we already know who this visitor is? -> skip the name/email form
 *   3. Is there a conversation to restore? -> repaint the transcript
 */
export async function createAiSession(req, res) {
  try {
    let sessionId = req.cookies?.[SESSION_COOKIE_NAME];
    let session = sessionId ? await ChatLog.findOne({ sessionId }) : null;

    if (!session || isSessionExpired(session)) {
      sessionId = randomUUID();
      session = new ChatLog({ sessionId, messages: [] });
    } else {
      // The visitor is actively opening the widget — that counts as activity.
      // Without this, someone who opens the chat and reads for 31 minutes
      // before typing gets silently dropped into a brand-new conversation.
      session.lastActiveAt = new Date();
    }

    await session.save();

    setSessionCookie(res, sessionId);

    const visitor = session.visitor || {};

    return res.status(200).json({
      success: true,
      message: "AI session ready.",
      // The frontend uses this flag to decide between showing the
      // greeting/name/email form and jumping straight into the chat.
      needsVisitorInfo: !visitor.name,
      visitor: {
        name: visitor.name ?? null,
        email: visitor.email ?? null,
        purpose: visitor.purpose ?? null,
      },
      // Lets the widget restore the conversation after a page refresh.
      messages: session.messages.map(toClientMessage),
      sessionMessageCount: session.messages.length,
    });
  } catch (err) {
    console.error("Create AI session error:", err);

    return res.status(500).json({
      success: false,
      error: "Could not start the AI session.",
    });
  }
}

/**
 * POST /api/ai/chat
 */
export async function chatWithAI(req, res) {
  try {
    const { message } = req.body;

    if (!message || typeof message !== "string" || !message.trim()) {
      return res.status(400).json({ error: "Message is required." });
    }

    // Basic guard against absurdly long input (protects your free-tier quota)
    if (message.length > 1000) {
      return res
        .status(400)
        .json({ error: "Message is too long (max 1000 characters)." });
    }

    let sessionId = req.cookies?.[SESSION_COOKIE_NAME];
    let session = sessionId ? await ChatLog.findOne({ sessionId }) : null;

    if (!session || isSessionExpired(session)) {
      sessionId = randomUUID();
      session = new ChatLog({ sessionId, messages: [] });
    }

    setSessionCookie(res, sessionId);

    // If we captured the visitor's details, tell the model. Otherwise the
    // assistant will keep saying "Hi there!" to someone who introduced
    // themselves as Rita two messages ago.
    const visitor = session.visitor || {};
    let systemInstruction = aiContext;

    if (visitor.name || visitor.purpose) {
      const facts = [
        visitor.name && `Their name is ${visitor.name}.`,
        visitor.purpose && `They are here about: ${visitor.purpose}.`,
      ]
        .filter(Boolean)
        .join(" ");

      systemInstruction += `\n\nAbout the current visitor: ${facts} Address them by name naturally, but do not over-use it.`;
    }

    const chat = ai.chats.create({
      model: MODEL_NAME,
      config: { systemInstruction },
      history: toGeminiHistory(session.messages),
    });

    const result = await chat.sendMessage({ message });
    const responseText = result.text;

    const tokensUsed = result.usageMetadata?.totalTokenCount ?? null;

    session.messages.push({ role: "user", content: message });
    session.messages.push({
      role: "assistant",
      content: responseText,
      tokensUsed,
    });
    session.lastActiveAt = new Date();

    await session.save();

    return res.status(200).json({
      reply: responseText,
      sessionMessageCount: session.messages.length,
    });
  } catch (err) {
    console.error("AI chat error:", err);

    if (err?.status === 429) {
      return res.status(429).json({
        error: "AI assistant is busy right now, please try again shortly.",
      });
    }

    return res
      .status(500)
      .json({ error: "Something went wrong with the AI assistant." });
  }
}