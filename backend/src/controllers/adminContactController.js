// backend/src/controllers/adminContactController.js
// Admin-only actions on contact messages. Kept separate from contactController.js,
// which only handles the public form submission.

import Contact from "../models/Contact.js";

// GET /api/admin/contact — list all messages, newest first
export const getAllMessages = async (req, res) => {
  try {
    const messages = await Contact.find().sort({ createdAt: -1 });
    return res.status(200).json({ success: true, messages });
  } catch (error) {
    console.error("getAllMessages error:", error.message);
    return res.status(500).json({ success: false, message: "Could not fetch messages." });
  }
};

// PATCH /api/admin/contact/:id/read — mark a message as read
export const markAsRead = async (req, res) => {
  try {
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { isRead: true },
      { new: true }
    );
    if (!contact) {
      return res.status(404).json({ success: false, message: "Message not found." });
    }
    return res.status(200).json({ success: true, contact });
  } catch (error) {
    console.error("markAsRead error:", error.message);
    return res.status(500).json({ success: false, message: "Could not update message." });
  }
};

// DELETE /api/admin/contact/:id — delete a message
export const deleteMessage = async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);
    if (!contact) {
      return res.status(404).json({ success: false, message: "Message not found." });
    }
    return res.status(200).json({ success: true, message: "Message deleted." });
  } catch (error) {
    console.error("deleteMessage error:", error.message);
    return res.status(500).json({ success: false, message: "Could not delete message." });
  }
};