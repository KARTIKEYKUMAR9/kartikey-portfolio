import { motion } from "framer-motion";
import {
  FaEnvelope,
  FaLinkedin,
  FaGithub,
} from "react-icons/fa";

import Layout from "../components/layout/Layout";
import SEO from "../components/common/SEO";
import ContactForm from "../components/contact/ContactForm";

export default function Contact() {
  return (
    <Layout>
      <SEO
        title="Contact | Kartikey Kumar"
        description="Get in touch with Kartikey Kumar for opportunities, projects, and collaborations."
      />

      <section className="relative py-28 px-6 overflow-hidden">
        {/* Background Glow */}
        <div className="absolute top-10 left-0 w-72 h-72 bg-cyan-500/10 blur-3xl rounded-full" />

        <div className="absolute bottom-0 right-0 w-72 h-72 bg-purple-500/10 blur-3xl rounded-full" />

        <div className="relative z-10 max-w-6xl mx-auto">

          {/* Page Header */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-14"
          >
            <span className="text-cyan-400 uppercase tracking-widest text-sm">
              Contact
            </span>

            <h1 className="mt-4 text-4xl md:text-5xl font-bold text-white">
              Let's Talk
            </h1>

            <p className="mt-6 max-w-2xl mx-auto text-slate-400 leading-8">
              Have a project in mind, want to collaborate, or just want to
              say hello? Feel free to send me a message.
            </p>
          </motion.div>

          {/* Contact Content */}
          <div className="grid lg:grid-cols-5 gap-8">

            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="
                lg:col-span-2
                relative
                overflow-hidden
                rounded-3xl
                border border-white/10
                bg-slate-900/60
                backdrop-blur-xl
                p-8 md:p-10
              "
            >
              <div className="absolute top-0 left-0 w-48 h-48 bg-cyan-500/20 blur-3xl rounded-full" />

              <div className="absolute bottom-0 right-0 w-48 h-48 bg-purple-500/20 blur-3xl rounded-full" />

              <div className="relative z-10">

                <h2 className="text-2xl md:text-3xl font-bold text-white">
                  Get In Touch
                </h2>

                <p className="mt-4 text-slate-400 leading-7">
                  I'm always interested in discussing new opportunities,
                  interesting projects, and collaborations.
                </p>

                {/* Email */}
                <a
                  href="mailto:kartikeyk91@gmail.com"
                  className="flex items-center gap-4 mt-10 group"
                >
                  <div
                    className="
                      w-12 h-12
                      flex items-center justify-center
                      rounded-xl
                      bg-cyan-500/10
                      border border-cyan-500/20
                      text-cyan-400
                      group-hover:bg-cyan-500
                      group-hover:text-slate-950
                      transition
                    "
                  >
                    <FaEnvelope />
                  </div>

                  <div>
                    <p className="text-sm text-slate-500">
                      Email
                    </p>

                    <p className="text-slate-300 group-hover:text-cyan-400 transition">
                      kartikeyk91@gmail.com
                    </p>
                  </div>
                </a>

                {/* Social Links */}
                <div className="flex gap-4 mt-8">

                  <a
                    href="https://www.linkedin.com/in/kartikey-kumar2002/"
                    target="_blank"
                    rel="noreferrer"
                    className="
                      w-11 h-11
                      flex items-center justify-center
                      rounded-xl
                      border border-white/10
                      text-slate-400
                      hover:text-cyan-400
                      hover:border-cyan-400
                      transition
                    "
                  >
                    <FaLinkedin />
                  </a>

                  <a
                    href="https://github.com/KARTIKEYKUMAR9"
                    target="_blank"
                    rel="noreferrer"
                    className="
                      w-11 h-11
                      flex items-center justify-center
                      rounded-xl
                      border border-white/10
                      text-slate-400
                      hover:text-cyan-400
                      hover:border-cyan-400
                      transition
                    "
                  >
                    <FaGithub />
                  </a>

                </div>

                <div className="mt-10 pt-8 border-t border-white/10">
                  <p className="text-slate-500 text-sm">
                    Usually responds within 24 hours.
                  </p>
                </div>

              </div>
            </motion.div>

            {/* Form Card */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="
                lg:col-span-3
                relative
                overflow-hidden
                rounded-3xl
                border border-white/10
                bg-slate-900/60
                backdrop-blur-xl
                p-8 md:p-10
              "
            >
              <ContactForm />
            </motion.div>

          </div>
        </div>
      </section>
    </Layout>
  );
}