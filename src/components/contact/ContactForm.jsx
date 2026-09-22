import { useState } from "react";
import {
  FaEnvelope,
  FaUser,
  FaPaperPlane,
} from "react-icons/fa";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState({
    type: "",
    message: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));

    setStatus({
      type: "",
      message: "",
    });
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.subject.trim()) {
      newErrors.subject = "Subject is required";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    } else if (formData.message.trim().length < 10) {
      newErrors.message = "Message must be at least 10 characters";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setIsLoading(true);

      setStatus({
        type: "",
        message: "",
      });

      const response = await fetch(
        `${API_URL}/api/contact`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      setStatus({
        type: "success",
        message: "Your message has been sent successfully! 🚀",
      });

      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
    } catch (error) {
      setStatus({
        type: "error",
        message:
          error.message || "Unable to send message. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative z-10 space-y-6">
      {/* Name */}
      <div>
        <label className="block text-sm text-slate-300 mb-2">
          Name
        </label>

        <div className="relative">
          <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />

          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Your name"
            className="
              w-full
              pl-11 pr-4 py-4
              rounded-xl
              bg-slate-950/60
              border border-white/10
              text-white
              placeholder:text-slate-600
              outline-none
              focus:border-cyan-400
              transition
            "
          />
        </div>

        {errors.name && (
          <p className="mt-2 text-sm text-red-400">
            {errors.name}
          </p>
        )}
      </div>

      {/* Email */}
      <div>
        <label className="block text-sm text-slate-300 mb-2">
          Email
        </label>

        <div className="relative">
          <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />

          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="your@email.com"
            className="
              w-full
              pl-11 pr-4 py-4
              rounded-xl
              bg-slate-950/60
              border border-white/10
              text-white
              placeholder:text-slate-600
              outline-none
              focus:border-cyan-400
              transition
            "
          />
        </div>

        {errors.email && (
          <p className="mt-2 text-sm text-red-400">
            {errors.email}
          </p>
        )}
      </div>

      {/* Subject */}
      <div>
        <label className="block text-sm text-slate-300 mb-2">
          Subject
        </label>

        <input
          type="text"
          name="subject"
          value={formData.subject}
          onChange={handleChange}
          placeholder="What would you like to discuss?"
          className="
            w-full
            px-4 py-4
            rounded-xl
            bg-slate-950/60
            border border-white/10
            text-white
            placeholder:text-slate-600
            outline-none
            focus:border-cyan-400
            transition
          "
        />

        {errors.subject && (
          <p className="mt-2 text-sm text-red-400">
            {errors.subject}
          </p>
        )}
      </div>

      {/* Message */}
      <div>
        <label className="block text-sm text-slate-300 mb-2">
          Message
        </label>

        <textarea
          name="message"
          value={formData.message}
          onChange={handleChange}
          placeholder="Write your message..."
          rows="6"
          className="
            w-full
            px-4 py-4
            rounded-xl
            bg-slate-950/60
            border border-white/10
            text-white
            placeholder:text-slate-600
            outline-none
            focus:border-cyan-400
            transition
            resize-none
          "
        />

        {errors.message && (
          <p className="mt-2 text-sm text-red-400">
            {errors.message}
          </p>
        )}
      </div>

      {/* Status */}
      {status.message && (
        <div
          className={`rounded-xl px-4 py-3 text-sm ${
            status.type === "success"
              ? "bg-green-500/10 border border-green-500/20 text-green-400"
              : "bg-red-500/10 border border-red-500/20 text-red-400"
          }`}
        >
          {status.message}
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={isLoading}
        className="
          w-full
          flex items-center justify-center gap-3
          px-6 py-4
          rounded-xl
          bg-cyan-500
          hover:bg-cyan-400
          text-slate-950
          font-semibold
          transition
          disabled:opacity-50
          disabled:cursor-not-allowed
        "
      >
        {isLoading ? (
          "Sending..."
        ) : (
          <>
            <FaPaperPlane />
            Send Message
          </>
        )}
      </button>
    </form>
  );
}