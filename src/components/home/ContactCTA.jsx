import {
  FaEnvelope,
  FaLinkedin,
  FaGithub,
  FaFileDownload,
} from "react-icons/fa";

import { Link } from "react-router-dom";

import resume from "../../assets/Kartikey_Kumar_Resume.pdf";

export default function ContactCTA() {
  return (
    <section className="py-28 px-6">
      <div className="max-w-5xl mx-auto">
        <div
          className="
            relative
            overflow-hidden
            rounded-3xl
            border
            border-white/10
            bg-slate-900/60
            backdrop-blur-xl
            p-10
            md:p-16
          "
        >
          {/* Glow Effects */}

          <div className="absolute top-0 left-0 w-72 h-72 bg-cyan-500/20 blur-3xl rounded-full"></div>

          <div className="absolute bottom-0 right-0 w-72 h-72 bg-purple-500/20 blur-3xl rounded-full"></div>

          <div className="relative z-10 text-center">
            <span className="text-cyan-400 uppercase tracking-widest">
              Contact
            </span>

            <h2 className="mt-4 text-4xl md:text-5xl font-bold">
              Let's Build Something Amazing Together
            </h2>

            <p className="mt-6 text-slate-400 max-w-2xl mx-auto leading-8">
              I'm always open to discussing new opportunities, innovative
              projects, and collaborations.
            </p>

            {/* Buttons */}

            <div className="flex flex-wrap justify-center gap-4 mt-10">
              <Link
                to="/contact"
                className="
    flex items-center gap-3
    px-6 py-4
    rounded-xl
    bg-cyan-500
    hover:bg-cyan-400
    transition
  "
              >
                <FaEnvelope />
                Contact Me
              </Link>

              <a
                href="https://www.linkedin.com/in/kartikey-kumar2002/"
                target="_blank"
                rel="noreferrer"
                className="
                  flex items-center gap-3
                  px-6 py-4
                  rounded-xl
                  border border-white/10
                  hover:border-cyan-400
                  transition
                "
              >
                <FaLinkedin />
                LinkedIn
              </a>

              <a
                href="https://github.com/KARTIKEYKUMAR9"
                target="_blank"
                rel="noreferrer"
                className="
                  flex items-center gap-3
                  px-6 py-4
                  rounded-xl
                  border border-white/10
                  hover:border-cyan-400
                  transition
                "
              >
                <FaGithub />
                GitHub
              </a>

              <a
                href={resume}
                download
                className="
                  flex items-center gap-3
                  px-6 py-4
                  rounded-xl
                  border border-white/10
                  hover:border-cyan-400
                  transition
                "
              >
                <FaFileDownload />
                Resume
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
