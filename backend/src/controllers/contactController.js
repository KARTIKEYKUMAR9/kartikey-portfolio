import Contact from "../models/Contact.js";
import { sendContactEmail } from "../utils/sendEmail.js";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const LIMITS = {
  name: 100,
  email: 254,
  subject: 150,
  message: 2000,
};

export const createContact = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const fields = {
      name,
      email,
      subject,
      message,
    };

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

    // Save the contact first.
    // This is the important part: the visitor's message is safely stored
    // even if Gmail SMTP is temporarily unavailable.
    const contact = await Contact.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      subject: subject.trim(),
      message: message.trim(),
    });

    // Fire-and-forget email.
    //
    // DO NOT await this.
    // The API response should not depend on Gmail SMTP.
    sendContactEmail({
      name: contact.name,
      email: contact.email,
      subject: contact.subject,
      message: contact.message,
    })
      .then(() => {
        console.log("Contact email sent successfully ✅");
      })
      .catch((emailError) => {
        console.error(
          "Email sending failed ❌:",
          emailError.message
        );
      });

    return res.status(201).json({
      success: true,
      message: "Your message has been received successfully.",
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