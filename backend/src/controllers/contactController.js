import Contact from "../models/Contact.js";
import { sendContactEmail } from "../utils/sendEmail.js";

// Same pattern as visitorController.js's EMAIL_REGEX — kept local rather
// than shared, since the two forms have independent validation rules
// (this one requires an email; the visitor form treats it as optional).
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const LIMITS = { name: 100, email: 254, subject: 150, message: 2000 };

export const createContact = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Before this, any string type was accepted for every field. A bot (or
    // a hand-crafted request) could POST a 5 MB "message" and Mongoose would
    // happily write it to the database — no schema-level cap exists on
    // String fields unless you add one. Checking type and length here stops
    // that at the door, before it ever reaches Mongo or your inbox.
    const fields = { name, email, subject, message };
    for (const [field, value] of Object.entries(fields)) {
      if (typeof value !== "string" || !value.trim()) {
        return res.status(400).json({
          success: false,
          message: `${field} must be a non-empty string.`,
        });
      }
      if (value.trim().length > LIMITS[field]) {
        return res.status(400).json({
          success: false,
          message: `${field} must be ${LIMITS[field]} characters or less.`,
        });
      }
    }

    if (!EMAIL_REGEX.test(email.trim())) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid email address.",
      });
    }

    const contact = await Contact.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      subject: subject.trim(),
      message: message.trim(),
    });

    try {
      await sendContactEmail({
        name: contact.name,
        email: contact.email,
        subject: contact.subject,
        message: contact.message,
      });

      console.log("Contact email sent successfully ✅");
    } catch (emailError) {
      console.error("Email sending failed ❌:", emailError.message);
    }

    return res.status(201).json({
      success: true,
      message: "Message sent successfully",
      contact,
    });
  } catch (error) {
    console.error("Create contact error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};