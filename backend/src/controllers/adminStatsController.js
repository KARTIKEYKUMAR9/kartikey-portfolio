import Analytics from "../models/Analytics.js";
import Contact from "../models/Contact.js";
import ChatLog from "../models/ChatLog.js";
import AdminAiLog from "../models/AdminAiLog.js";

const startOfDay = (date = new Date()) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
};

const startOfDaysAgo = (days) => {
  const d = startOfDay();
  d.setDate(d.getDate() - days + 1);
  return d;
};

const buildDailySeries = async (Model, dateField, filter = {}) => {
  const start = startOfDaysAgo(7);
  const rows = await Model.aggregate([
    { $match: { ...filter, [dateField]: { $gte: start } } },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: `$${dateField}` } },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);
  const map = Object.fromEntries(rows.map((r) => [r._id, r.count]));
  return Array.from({ length: 7 }, (_, i) => {
    const d = startOfDay();
    d.setDate(d.getDate() - (6 - i));
    const key = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    return { date: key, count: map[key] || 0 };
  });
};

export async function getPortfolioStats(req, res) {
  try {
    const today = startOfDay();
    const weekStart = startOfDaysAgo(7);
    const monthStart = new Date(today);
    monthStart.setDate(1);

    const [
      totalPageViews,
      todayPageViews,
      weekPageViews,
      monthPageViews,
      uniqueVisitors,
      todayUniqueVisitors,
      totalContacts,
      unreadContacts,
      totalConversations,
      totalAiRequests,
      adminAiRequests,
      pageBreakdown,
      dailyViews,
      recentActivity,
    ] = await Promise.all([
      Analytics.countDocuments(),
      Analytics.countDocuments({ createdAt: { $gte: today } }),
      Analytics.countDocuments({ createdAt: { $gte: weekStart } }),
      Analytics.countDocuments({ createdAt: { $gte: monthStart } }),
      Analytics.distinct("visitorId").then((x) => x.length),
      Analytics.distinct("visitorId", { createdAt: { $gte: today } }).then((x) => x.length),
      Contact.countDocuments(),
      Contact.countDocuments({ isRead: false }),
      ChatLog.countDocuments({ "messages.0": { $exists: true } }),
      ChatLog.aggregate([
        { $unwind: "$messages" },
        { $match: { "messages.role": "user" } },
        { $count: "count" },
      ]).then((x) => x[0]?.count || 0),
      AdminAiLog.countDocuments(),
      Analytics.aggregate([
        { $group: { _id: "$page", views: { $sum: 1 }, visitors: { $addToSet: "$visitorId" } } },
        { $project: { _id: 0, page: "$_id", views: 1, visitors: { $size: "$visitors" } } },
        { $sort: { views: -1 } },
        { $limit: 10 },
      ]),
      buildDailySeries(Analytics, "createdAt"),
      Analytics.find().sort({ createdAt: -1 }).limit(8).select("page visitorId createdAt -_id").lean(),
    ]);

    return res.json({
      success: true,
      stats: {
        totalPageViews,
        todayPageViews,
        weekPageViews,
        monthPageViews,
        uniqueVisitors,
        todayUniqueVisitors,
        totalContacts,
        unreadContacts,
        totalConversations,
        totalAiRequests,
        adminAiRequests,
      },
      pageBreakdown,
      dailyViews,
      recentActivity,
    });
  } catch (error) {
    console.error("getPortfolioStats error:", error.message);
    return res.status(500).json({ success: false, message: "Could not fetch portfolio stats." });
  }
}

export async function getDashboardOverview(req, res) {
  try {
    const today = startOfDay();
    const [messages, ai, views, contacts, recentMessages] = await Promise.all([
      Contact.countDocuments(),
      ChatLog.countDocuments({ "messages.0": { $exists: true } }),
      Analytics.countDocuments(),
      Contact.countDocuments({ isRead: false }),
      Contact.find().sort({ createdAt: -1 }).limit(5).select("name email subject message isRead createdAt").lean(),
    ]);

    const [todayViews, todayAiRequests] = await Promise.all([
      Analytics.countDocuments({ createdAt: { $gte: today } }),
      ChatLog.aggregate([
        { $unwind: "$messages" },
        { $match: { "messages.role": "user", "messages.timestamp": { $gte: today } } },
        { $count: "count" },
      ]).then((x) => x[0]?.count || 0),
    ]);

    return res.json({
      success: true,
      overview: { messages, unreadMessages: contacts, aiConversations: ai, visitors: views, todayViews, todayAiRequests },
      recentMessages,
    });
  } catch (error) {
    console.error("getDashboardOverview error:", error.message);
    return res.status(500).json({ success: false, message: "Could not fetch dashboard overview." });
  }
}
