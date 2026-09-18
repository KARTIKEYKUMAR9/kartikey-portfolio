import {
  FaGithub,
  FaLinkedin,
  FaEnvelope,
} from "react-icons/fa";
import { NavLink } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 py-10 mt-20">
      <div className="max-w-6xl mx-auto px-6">

        <div className="flex flex-col md:flex-row items-center justify-between gap-8">

          {/* Brand */}
          <div className="text-center md:text-left">
            <h3 className="font-bold text-xl text-white">
              Kartikey Kumar
            </h3>

            <p className="text-slate-400 mt-1">
              Full Stack Developer
            </p>
          </div>

          {/* Navigation */}
          <nav className="flex flex-wrap justify-center gap-5 text-sm">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `transition ${
                  isActive
                    ? "text-cyan-400"
                    : "text-slate-400 hover:text-cyan-400"
                }`
              }
            >
              Home
            </NavLink>

            <NavLink
              to="/about"
              className={({ isActive }) =>
                `transition ${
                  isActive
                    ? "text-cyan-400"
                    : "text-slate-400 hover:text-cyan-400"
                }`
              }
            >
              About
            </NavLink>

            <NavLink
              to="/experience"
              className={({ isActive }) =>
                `transition ${
                  isActive
                    ? "text-cyan-400"
                    : "text-slate-400 hover:text-cyan-400"
                }`
              }
            >
              Experience
            </NavLink>

            <NavLink
              to="/projects"
              className={({ isActive }) =>
                `transition ${
                  isActive
                    ? "text-cyan-400"
                    : "text-slate-400 hover:text-cyan-400"
                }`
              }
            >
              Projects
            </NavLink>

            <NavLink
              to="/contact"
              className={({ isActive }) =>
                `transition ${
                  isActive
                    ? "text-cyan-400"
                    : "text-slate-400 hover:text-cyan-400"
                }`
              }
            >
              Contact
            </NavLink>
          </nav>

          {/* Social Links */}
          <div className="flex gap-6 text-2xl">

            <a
              href="mailto:kartikeyk91@gmail.com"
              aria-label="Email Kartikey"
              className="text-slate-400 hover:text-cyan-400 transition"
            >
              <FaEnvelope />
            </a>

            <a
              href="https://github.com/KARTIKEYKUMAR9"
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub"
              className="text-slate-400 hover:text-cyan-400 transition"
            >
              <FaGithub />
            </a>

            <a
              href="https://www.linkedin.com/in/kartikey-kumar2002/"
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn"
              className="text-slate-400 hover:text-cyan-400 transition"
            >
              <FaLinkedin />
            </a>

          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-6 border-t border-white/10 text-center text-slate-500 text-sm">
          © {new Date().getFullYear()} Kartikey Kumar. All Rights Reserved.
        </div>

      </div>
    </footer>
  );
}