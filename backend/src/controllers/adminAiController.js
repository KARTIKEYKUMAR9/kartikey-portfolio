// backend/src/controllers/adminAiController.js

// Reads from ChatLog for the admin AI Usage dashboard and the conversation list.

import ChatLog from "../models/ChatLog.js";
import Contact from "../models/Contact.js";
import Analytics from "../models/Analytics.js";
import AdminAiLog from "../models/AdminAiLog.js";
import DailyBriefing from "../models/DailyBriefing.js";
import { GoogleGenAI } from "@google/genai";
import aiContext from "../data/aiContext.js";

function todayKey() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate()
  ).padStart(2, "0")}`;
}

// A ChatLog document is created the moment the widget opens (see
// aiController.createAiSession), before the visitor has necessarily typed
// anything. For every admin-facing count or list, "conversation" should mean
// "a visitor actually said something" — otherwise every stat on this page
// is inflated by widget-opens that went nowhere.

const HAS_MESSAGES = {
  "messages.0": { $exists: true },
};

export const getAiUsageStats = async (req, res) => {
  try {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    // Total conversations = ChatLog documents that contain at least one
    // message.
    const totalConversations = await ChatLog.countDocuments(HAS_MESSAGES);

    // Total requests = count of all user messages across every session.
    const totalRequestsResult = await ChatLog.aggregate([
      { $unwind: "$messages" },
      { $match: { "messages.role": "user" } },
      { $count: "count" },
    ]);

    const totalRequests = totalRequestsResult[0]?.count || 0;

    // Today's requests = user messages sent today.
    const todayRequestsResult = await ChatLog.aggregate([
      { $unwind: "$messages" },
      {
        $match: {
          "messages.role": "user",
          "messages.timestamp": { $gte: startOfToday },
        },
      },
      { $count: "count" },
    ]);

    const todayRequests = todayRequestsResult[0]?.count || 0;

    // Average requests/day = total requests / days since first conversation.
    const earliestLog = await ChatLog.findOne(HAS_MESSAGES).sort({
      startedAt: 1,
    });

    let avgRequestsPerDay = 0;

    if (earliestLog) {
      const daysSinceStart = Math.max(
        1,
        Math.ceil(
          (Date.now() - earliestLog.startedAt.getTime()) /
            (1000 * 60 * 60 * 24)
        )
      );

      avgRequestsPerDay = Number(
        (totalRequests / daysSinceStart).toFixed(1)
      );
    }

    // Recent questions — last 10 user messages across all sessions.
    const recentQuestionsResult = await ChatLog.aggregate([
      { $unwind: "$messages" },
      { $match: { "messages.role": "user" } },
      { $sort: { "messages.timestamp": -1 } },
      { $limit: 10 },
      {
        $project: {
          _id: 0,
          content: "$messages.content",
          timestamp: "$messages.timestamp",
        },
      },
    ]);

    return res.status(200).json({
      success: true,
      stats: {
        totalConversations,
        totalRequests,
        todayRequests,
        avgRequestsPerDay,
      },
      recentQuestions: recentQuestionsResult,
    });
  } catch (error) {
    console.error("getAiUsageStats error:", error?.message);

    return res.status(500).json({
      success: false,
      message: "Could not fetch AI usage stats.",
    });
  }
};

// GET /api/admin/ai/conversations
// Step 2F — summary row per conversation for the admin list page.
//
// Deliberately lean: it sends visitor info, a count, and a preview of the
// last message — never the full messages array.

export const getAllConversations = async (req, res) => {
  try {
    const conversations = await ChatLog.aggregate([
      { $match: HAS_MESSAGES },
      { $sort: { lastActiveAt: -1 } },
      {
        $project: {
          _id: 0,
          sessionId: 1,
          visitor: 1,
          startedAt: 1,
          lastActiveAt: 1,
          messageCount: { $size: "$messages" },
          lastMessage: { $arrayElemAt: ["$messages", -1] },
        },
      },
    ]);

    return res.status(200).json({
      success: true,
      conversations,
    });
  } catch (error) {
    console.error("getAllConversations error:", error?.message);

    return res.status(500).json({
      success: false,
      message: "Could not fetch conversations.",
    });
  }
};

// GET /api/admin/ai/conversations/:sessionId
// Step 2G — full transcript for one conversation.

export const getConversationById = async (req, res) => {
  try {
    const { sessionId } = req.params;

    const conversation = await ChatLog.findOne({ sessionId });

    if (!conversation || conversation.messages.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found.",
      });
    }

    return res.status(200).json({
      success: true,
      conversation: {
        sessionId: conversation.sessionId,
        visitor: conversation.visitor,
        startedAt: conversation.startedAt,
        lastActiveAt: conversation.lastActiveAt,
        messages: conversation.messages,
      },
    });
  } catch (error) {
    console.error("getConversationById error:", error?.message);

    return res.status(500).json({
      success: false,
      message: "Could not fetch conversation.",
    });
  }
};

/* -------------------------------------------------------------------------- */
/*                         ADMIN AI CONFIGURATION                             */
/* -------------------------------------------------------------------------- */

const adminAi = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// Keep model names configurable through backend environment variables.
// These values are NEVER sent to the frontend.
const ADMIN_AI_PRIMARY_MODEL =
  process.env.ADMIN_AI_PRIMARY_MODEL || "gemini-3.6-flash";

const ADMIN_AI_FALLBACK_MODEL =
  process.env.ADMIN_AI_FALLBACK_MODEL || "gemini-3.5-flash-lite";

// Maximum attempts for one model.
const MAX_RETRIES_PER_MODEL = 3;

// Exponential backoff delays.
// Attempt 1 failure -> 1s
// Attempt 2 failure -> 2s
// Attempt 3 failure -> stop that model.
const RETRY_DELAYS_MS = [1000, 2000];

const sleep = (ms) =>
  new Promise((resolve) => setTimeout(resolve, ms));

/* -------------------------------------------------------------------------- */
/*                              ERROR HELPERS                                  */
/* -------------------------------------------------------------------------- */

function getGeminiStatus(error) {
  return (
    error?.status ||
    error?.code ||
    error?.response?.status ||
    error?.error?.code ||
    null
  );
}

function isRetryableGeminiError(error) {
  const status = Number(getGeminiStatus(error));

  // Gemini documents 429 and 5xx as transient/retryable cases.
  return (
    status === 408 ||
    status === 429 ||
    status === 500 ||
    status === 502 ||
    status === 503 ||
    status === 504
  );
}

function getGeminiErrorCode(error) {
  const status = getGeminiStatus(error);

  if (status) {
    return String(status);
  }

  return "UNKNOWN";
}

/* -------------------------------------------------------------------------- */
/*                         GEMINI GENERATION HELPER                            */
/* -------------------------------------------------------------------------- */

/**
 * Calls Gemini with automatic retry.
 *
 * For transient failures:
 *   attempt 1 -> wait 1 second
 *   attempt 2 -> wait 2 seconds
 *   attempt 3 -> stop
 *
 * Non-retryable errors are thrown immediately.
 */
async function generateAdminAiResponse(model, prompt) {
  let lastError = null;

  for (let attempt = 1; attempt <= MAX_RETRIES_PER_MODEL; attempt++) {
    try {
      const result = await adminAi.models.generateContent({
        model,
        contents: prompt,
      });

      return {
        result,
        model,
        attempts: attempt,
      };
    } catch (error) {
      lastError = error;

      const status = getGeminiStatus(error);

      console.error(
        `Admin AI model ${model} failed. Attempt ${attempt}/${MAX_RETRIES_PER_MODEL}. Status: ${status}`
      );

      // Do not retry invalid requests, authentication failures,
      // permission errors, invalid models, etc.
      if (!isRetryableGeminiError(error)) {
        throw error;
      }

      // No need to wait after the final attempt.
      if (attempt < MAX_RETRIES_PER_MODEL) {
        const delay = RETRY_DELAYS_MS[attempt - 1] || 2000;

        console.log(
          `Retrying Admin AI model ${model} in ${delay}ms...`
        );

        await sleep(delay);
      }
    }
  }

  throw lastError;
}

/**
 * Try the primary model first.
 *
 * If the primary model continues failing with a transient error,
 * try the fallback model.
 */
async function generateWithFallback(prompt) {
  let primaryError = null;

  try {
    return await generateAdminAiResponse(
      ADMIN_AI_PRIMARY_MODEL,
      prompt
    );
  } catch (error) {
    primaryError = error;

    console.error(
      `Admin AI primary model failed after retries: ${ADMIN_AI_PRIMARY_MODEL}`,
      error?.message
    );
  }

  // Only use the fallback for retryable/transient failures.
  // If the primary failed because of a bad API key, invalid request,
  // permission issue, etc., there is no benefit in trying another model.
  if (!isRetryableGeminiError(primaryError)) {
    throw primaryError;
  }

  // Avoid making the same request against the exact same model twice.
  if (ADMIN_AI_FALLBACK_MODEL === ADMIN_AI_PRIMARY_MODEL) {
    throw primaryError;
  }

  console.log(
    `Trying Admin AI fallback model: ${ADMIN_AI_FALLBACK_MODEL}`
  );

  try {
    return await generateAdminAiResponse(
      ADMIN_AI_FALLBACK_MODEL,
      prompt
    );
  } catch (fallbackError) {
    console.error(
      `Admin AI fallback model also failed: ${ADMIN_AI_FALLBACK_MODEL}`,
      fallbackError?.message
    );

    // Keep the original primary error as the underlying failure,
    // but attach fallback information for server-side logging.
    fallbackError.primaryError = primaryError;

    throw fallbackError;
  }
}

/* -------------------------------------------------------------------------- */
/*                            ADMIN AI SNAPSHOT                                */
/* -------------------------------------------------------------------------- */

function startOfDaysAgo(days) {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - days + 1);
  return d;
}

async function getAdminSnapshot() {
  const today = new Date();

  today.setHours(0, 0, 0, 0);

  const weekStart = startOfDaysAgo(7);

  const [
    views,
    uniqueVisitors,
    weekViews,
    contacts,
    unread,
    conversations,
    questions,
    recentContacts,
    recentQuestions,
    topPages,
    adminAiTotal,
    adminAiToday,
  ] = await Promise.all([
    Analytics.countDocuments(),

    Analytics.distinct("visitorId").then((x) => x.length),

    Analytics.countDocuments({ createdAt: { $gte: weekStart } }),

    Contact.countDocuments(),

    Contact.countDocuments({
      isRead: false,
    }),

    ChatLog.countDocuments({
      "messages.0": { $exists: true },
    }),

    ChatLog.aggregate([
      { $unwind: "$messages" },
      {
        $match: {
          "messages.role": "user",
        },
      },
      { $count: "count" },
    ]).then((x) => x[0]?.count || 0),

    // Full name/email/subject so the copilot can answer "who messaged me"
    // and "has X been replied to" style questions, not just a preview.
    Contact.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .select("name email subject message isRead createdAt")
      .lean(),

    ChatLog.aggregate([
      { $unwind: "$messages" },
      {
        $match: {
          "messages.role": "user",
        },
      },
      {
        $sort: {
          "messages.timestamp": -1,
        },
      },
      { $limit: 8 },
      {
        $project: {
          _id: 0,
          question: "$messages.content",
          timestamp: "$messages.timestamp",
        },
      },
    ]),

    // Which pages of the portfolio are actually getting looked at.
    Analytics.aggregate([
      { $group: { _id: "$page", views: { $sum: 1 }, visitors: { $addToSet: "$visitorId" } } },
      { $project: { _id: 0, page: "$_id", views: 1, visitors: { $size: "$visitors" } } },
      { $sort: { views: -1 } },
      { $limit: 5 },
    ]),

    // The copilot's own usage, so it can answer questions about itself
    // ("how much have you been used") without a separate lookup.
    AdminAiLog.countDocuments(),

    AdminAiLog.countDocuments({ createdAt: { $gte: today } }),
  ]);

  const todayViews = await Analytics.countDocuments({
    createdAt: {
      $gte: today,
    },
  });

  return {
    views,
    uniqueVisitors,
    todayViews,
    weekViews,
    topPages,
    contacts,
    unread,
    recentContacts,
    conversations,
    questions,
    recentQuestions,
    adminAiUsage: {
      total: adminAiTotal,
      today: adminAiToday,
    },
  };
}

/* -------------------------------------------------------------------------- */
/*                            ADMIN AI CHAT                                    */
/* -------------------------------------------------------------------------- */

export const chatWithAdminAI = async (req, res) => {
  let question = "";

  try {
    question =
      typeof req.body?.message === "string"
        ? req.body.message.trim()
        : "";

    if (!question) {
      return res.status(400).json({
        success: false,
        message: "Message is required.",
      });
    }

    if (question.length > 2000) {
      return res.status(400).json({
        success: false,
        message: "Message is too long (max 2000 characters).",
      });
    }

    const snapshot = await getAdminSnapshot();

    const prompt = `You are Kartikey's private portfolio admin copilot. You are only available to the authenticated portfolio owner.

Rules:
- Use the supplied live dashboard data when answering analytics questions.
- LIVE ADMIN DATA.topPages is sorted by views — use it for "which page/project
  gets the most attention" style questions. There is no per-project view
  tracking yet, only per-page, so don't claim to know which individual
  project is most viewed unless a page name makes that obvious.
- LIVE ADMIN DATA.adminAiUsage is this copilot's own usage (you), separate
  from LIVE ADMIN DATA.conversations/questions which are the public-facing
  visitor chat widget.
- contacts is the total message count and unread is how many are unread;
  recentContacts lists up to 10 of the newest with their isRead status.
- Never invent numbers. If a metric is not available, say so.
- You can summarize contact messages, AI questions, projects, experience and portfolio information from the context.
- Do not expose secrets, API keys, passwords, JWTs, database credentials or internal security details.
- Keep answers concise but useful.

PORTFOLIO CONTEXT:
${aiContext}

LIVE ADMIN DATA:
${JSON.stringify(snapshot)}

ADMIN QUESTION:
${question}`;

    /*
     * Primary model:
     *   up to 3 attempts
     *
     * If it continues returning a transient error:
     *   fallback model
     *   up to 3 attempts
     */
    const generation = await generateWithFallback(prompt);

    const result = generation.result;
    const answer =
      result?.text || "I couldn't generate an answer right now.";

    const tokensUsed =
      result?.usageMetadata?.totalTokenCount ?? null;

    const usedFallback =
      generation.model !== ADMIN_AI_PRIMARY_MODEL;

    /*
     * Keep logging successful AI usage.
     *
     * We only store the question/answer and token count.
     * Never store the API key.
     */
    await AdminAiLog.create({
      adminId: req.admin?.id,
      question,
      answer,
      tokensUsed,
    });

    return res.status(200).json({
      success: true,
      reply: answer,
      tokensUsed,
      model: generation.model,
      usedFallback,
      attempts: generation.attempts,
    });
  } catch (error) {
    const status = getGeminiStatus(error);
    const errorCode = getGeminiErrorCode(error);

    console.error("chatWithAdminAI error:", {
      message: error?.message,
      status,
      errorCode,
      primaryError: error?.primaryError?.message || null,
    });

    /*
     * IMPORTANT:
     *
     * We log the failure server-side but do not expose:
     * - Gemini API key
     * - raw Gemini error
     * - internal stack trace
     * - database details
     */
    try {
      await AdminAiLog.create({
        adminId: req.admin?.id,
        question,
        answer: "",
        tokensUsed: null,
      });
    } catch (logError) {
      console.error(
        "Failed to log Admin AI failure:",
        logError?.message
      );
    }

    /*
     * Clean user-facing messages.
     */

    if (isRetryableGeminiError(error)) {
      return res.status(503).json({
        success: false,
        message:
          "Admin AI is temporarily unavailable. Please try again in a moment.",
      });
    }

    if (Number(status) === 401 || Number(status) === 403) {
      return res.status(503).json({
        success: false,
        message:
          "Admin AI is temporarily unavailable. Please check the server AI configuration.",
      });
    }

    if (Number(status) === 404) {
      return res.status(503).json({
        success: false,
        message:
          "Admin AI is temporarily unavailable because the configured AI model could not be reached.",
      });
    }

    return res.status(500).json({
      success: false,
      message:
        "Admin AI could not process your request right now. Please try again.",
    });
  }
};

/* -------------------------------------------------------------------------- */
/*                          ADMIN AI USAGE STATS                               */
/* -------------------------------------------------------------------------- */

export const getAdminAiStats = async (req, res) => {
  try {
    const startOfToday = new Date();

    startOfToday.setHours(0, 0, 0, 0);

    const [total, today, recent] = await Promise.all([
      AdminAiLog.countDocuments(),

      AdminAiLog.countDocuments({
        createdAt: {
          $gte: startOfToday,
        },
      }),

      AdminAiLog.find()
        .sort({ createdAt: -1 })
        .limit(10)
        .select("question answer tokensUsed createdAt -_id")
        .lean(),
    ]);

    return res.json({
      success: true,
      stats: {
        total,
        today,
      },
      recent,
    });
  } catch (error) {
    console.error(
      "getAdminAiStats error:",
      error?.message
    );

    return res.status(500).json({
      success: false,
      message: "Could not fetch admin AI stats.",
    });
  }
};

/* -------------------------------------------------------------------------- */
/*                             DAILY BRIEFING                                  */
/* -------------------------------------------------------------------------- */

// GET /api/admin/ai/briefing
// Step 7 — one AI-generated summary + highlights per calendar day, cached
// in Mongo so the dashboard loading it repeatedly doesn't burn Gemini
// calls or eat into the admin AI rate limit. ?refresh=true forces a new
// generation for today even if one already exists.

export const getDailyBriefing = async (req, res) => {
  const dateKey = todayKey();
  const forceRefresh = req.query?.refresh === "true";

  try {
    if (!forceRefresh) {
      const cached = await DailyBriefing.findOne({ dateKey }).lean();

      if (cached) {
        return res.status(200).json({
          success: true,
          cached: true,
          briefing: {
            dateKey: cached.dateKey,
            summary: cached.summary,
            highlights: cached.highlights,
            generatedAt: cached.createdAt,
          },
        });
      }
    }

    const snapshot = await getAdminSnapshot();

    const prompt = `You are generating a short daily briefing for Kartikey, the owner of this portfolio's admin dashboard. He will read this first thing, so lead with what actually matters today.

Respond with ONLY raw JSON, no markdown fences, in exactly this shape:
{"summary": "2-3 sentence plain-language overview of today vs the past week", "highlights": ["short specific point", "short specific point"]}

Rules:
- 3 to 5 highlights, each one short sentence, specific, and numbers-first where relevant.
- Never invent numbers. Every figure must come from LIVE ADMIN DATA below.
- If activity is essentially flat or quiet, say so plainly instead of manufacturing urgency.
- Do not expose secrets, API keys, passwords, JWTs, database credentials or internal details.

LIVE ADMIN DATA:
${JSON.stringify(snapshot)}`;

    const generation = await generateWithFallback(prompt);
    const rawText = generation.result?.text || "";
    const cleaned = rawText.replace(/```json|```/g, "").trim();

    let parsed;
    try {
      parsed = JSON.parse(cleaned);
    } catch {
      parsed = { summary: cleaned || "No briefing available.", highlights: [] };
    }

    const tokensUsed = generation.result?.usageMetadata?.totalTokenCount ?? null;

    const saved = await DailyBriefing.findOneAndUpdate(
      { dateKey },
      {
        dateKey,
        summary:
          typeof parsed.summary === "string" && parsed.summary.trim()
            ? parsed.summary.trim()
            : "No summary generated.",
        highlights: Array.isArray(parsed.highlights)
          ? parsed.highlights.filter((h) => typeof h === "string").slice(0, 6)
          : [],
        model: generation.model,
        tokensUsed,
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    return res.status(200).json({
      success: true,
      cached: false,
      briefing: {
        dateKey: saved.dateKey,
        summary: saved.summary,
        highlights: saved.highlights,
        generatedAt: saved.createdAt,
      },
    });
  } catch (error) {
    console.error("getDailyBriefing error:", error?.message);

    if (isRetryableGeminiError(error)) {
      return res.status(503).json({
        success: false,
        message: "Daily briefing is temporarily unavailable. Please try again in a moment.",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Could not generate the daily briefing.",
    });
  }
};