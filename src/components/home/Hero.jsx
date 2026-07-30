import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

import {
  FaGithub,
  FaLinkedin,
  FaDownload,
  FaReact,
  FaNodeJs,
  FaGitAlt,
} from "react-icons/fa";

import {
  SiJavascript,
  SiTailwindcss,
  SiRedux,
} from "react-icons/si";

import { profile } from "../../data/profile";
import profileImage from "../../assets/images/profile.jpg";
import resume from "../../assets/resume.pdf";

const floatingIcons = [
  {
    icon: <FaReact />,
    className: "top-0 left-0 md:-left-8 lg:-left-10",
  },
  {
    icon: <SiJavascript />,
    className: "top-12 right-0 md:-right-10 lg:-right-8",
  },
  {
    icon: <SiTailwindcss />,
    className: "bottom-10 md:bottom-20 left-0 md:-left-8 lg:-left-12",
  },
  {
    icon: <SiRedux />,
    className: "bottom-0 right-0 md:-right-10 lg:-right-0",
  },
  {
    icon: <FaNodeJs />,
    className: "top-1/2 right-0 md:-right-10 lg:-right-14",
  },
  {
    icon: <FaGitAlt />,
    className: "top-[30%] md:top-1/2 left-0 md:-left-8 lg:-left-14",
  },
];

export default function Hero() {
  const [position, setPosition] = useState({
    x: 0,
    y: 0,
  });

  return (
    <section
      className="relative min-h-screen flex items-center overflow-hidden"
      onMouseMove={(e) => {
        const x = (e.clientX - window.innerWidth / 2) / 50;
        const y = (e.clientY - window.innerHeight / 2) / 50;

        setPosition({ x, y });
      }}
    >
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,#06b6d433,transparent_30%),radial-gradient(circle_at_bottom_right,#8b5cf633,transparent_30%)]" />

      {/* Glow Effects */}
      <div className="absolute top-20 left-10 h-72 w-72 rounded-full bg-cyan-500/20 blur-3xl" />

      <div className="absolute bottom-10 right-10 h-72 w-72 rounded-full bg-purple-500/20 blur-3xl" />

      <div className="relative max-w-6xl mx-auto px-6 w-full">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* LEFT SIDE */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Availability Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 mb-8">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />

              <span className="text-sm text-cyan-300">
                Available for Opportunities
              </span>
            </div>

            {/* Intro */}
            <p className="text-cyan-400 text-lg font-medium">
              Hello, I'm
            </p>

            {/* Name */}
            <h1 className="mt-4 text-6xl md:text-8xl font-extrabold leading-tight bg-gradient-to-r from-white via-cyan-300 to-cyan-500 bg-clip-text text-transparent">
              {profile.name}
            </h1>

            {/* Title */}
            <h2 className="mt-5 text-2xl md:text-3xl text-slate-300 font-medium">
              {profile.title}
            </h2>

            {/* Description */}
            <p className="mt-8 text-slate-400 text-lg leading-8 max-w-xl">
              {profile.tagline}
            </p>

            {/* Buttons */}
            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                to="/projects"
                className="px-8 py-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 transition font-medium"
              >
                View Projects
              </Link>

              <a
                href={resume}
                download="Kartikey_Kumar_Resume.pdf"
                className="px-8 py-4 rounded-xl border border-white/10 hover:border-cyan-400 transition flex items-center gap-3 font-medium"
              >
                <FaDownload />
                Resume
              </a>
            </div>

            {/* Social Icons */}
            <div className="mt-10 flex gap-6 text-3xl">
              <a
                href={profile.github}
                target="_blank"
                rel="noreferrer"
                className="text-slate-400 hover:text-cyan-400 transition"
              >
                <FaGithub />
              </a>

              <a
                href={profile.linkedin}
                target="_blank"
                rel="noreferrer"
                className="text-slate-400 hover:text-cyan-400 transition"
              >
                <FaLinkedin />
              </a>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-10 mt-12">
              <div>
                <h3 className="text-3xl font-bold text-cyan-400">
                  1+
                </h3>

                <p className="text-slate-400 text-sm mt-1">
                  Years Experience
                </p>
              </div>

              <div>
                <h3 className="text-3xl font-bold text-cyan-400">
                  5+
                </h3>

                <p className="text-slate-400 text-sm mt-1">
                  Projects
                </p>
              </div>

              <div>
                <h3 className="text-3xl font-bold text-cyan-400">
                  MCA
                </h3>

                <p className="text-slate-400 text-sm mt-1">
                  Graduate
                </p>
              </div>
            </div>
          </motion.div>

          {/* RIGHT SIDE */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="flex justify-center"
          >
            <div
              className="relative px-10 md:px-0"
              style={{
                transform: `translate(${position.x}px, ${position.y}px)`,
              }}
            >
              {/* Floating Icons */}
              {floatingIcons.map((item, index) => (
                <motion.div
                  key={index}
                  animate={{
                    y: [0, -15, 0],
                  }}
                  transition={{
                    duration: 3 + index,
                    repeat: Infinity,
                  }}
                  className={`
                    absolute
                    ${item.className}
                    z-20
                    text-4xl
                    p-3
                    rounded-2xl
                    bg-slate-900/80
                    border
                    border-white/10
                    backdrop-blur-xl
                    text-cyan-400
                    shadow-lg
                  `}
                >
                  {item.icon}
                </motion.div>
              ))}

              {/* Glow */}
              <div className="absolute -inset-4 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-3xl blur-3xl opacity-40" />

              {/* Rotating Border */}
              <motion.div
                animate={{
                  rotate: 360,
                }}
                transition={{
                  duration: 20,
                  repeat: Infinity,
                  ease: "linear",
                }}
                className="absolute -inset-3 rounded-3xl border border-cyan-500/20"
              />

              {/* Image */}
              <img
                src={profileImage}
                alt="Kartikey Kumar"
                className="
                  relative
                  w-[340px]
                  md:w-[450px]
                  rounded-3xl
                  border
                  border-white/10
                  object-cover
                  shadow-2xl
                "
              />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        animate={{
          y: [0, 15, 0],
        }}
        transition={{
          repeat: Infinity,
          duration: 2,
        }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <div className="w-6 h-10 border border-white/20 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-cyan-400 rounded-full mt-2" />
        </div>
      </motion.div>
    </section>
  );
}