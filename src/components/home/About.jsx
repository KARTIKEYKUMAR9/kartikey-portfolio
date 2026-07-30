import { motion } from "framer-motion";
import { FaGraduationCap, FaBriefcase, FaCode } from "react-icons/fa";

export default function About() {
  return (
    <section className="py-28 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-cyan-400 uppercase tracking-widest">
            About Me
          </span>

          <h2 className="mt-4 text-4xl md:text-5xl font-bold">
            Building Modern Digital Experiences
          </h2>

          <p className="mt-8 text-slate-400 leading-8 text-lg max-w-4xl">
            I'm a Full Stack Developer with professional experience as a
            Frontend Developer at Meon Technologies Private Limited. I
            specialize in building responsive user interfaces and robust web
            applications, combining frontend excellence with backend
            development, APIs, and databases. With an MCA from Galgotias
            University, I am passionate about continuous learning, solving
            real-world problems, and creating high-quality digital experiences.
          </p>
        </motion.div>

        {/* Cards */}

        <div className="grid md:grid-cols-3 gap-6 mt-16">
          <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-3xl p-8 hover:border-cyan-500/40 transition">
            <FaBriefcase className="text-cyan-400 text-4xl" />

            <h3 className="mt-5 text-xl font-semibold">Experience</h3>

            <p className="mt-3 text-slate-400">
              Frontend Developer at Meon Technologies, building scalable and
              responsive interfaces.
            </p>
          </div>

          <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-3xl p-8 hover:border-cyan-500/40 transition">
            <FaGraduationCap className="text-cyan-400 text-4xl" />

            <h3 className="mt-5 text-xl font-semibold">Education</h3>

            <p className="mt-3 text-slate-400">
              Master of Computer Applications (MCA) from Galgotias University.
            </p>
          </div>

          <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-3xl p-8 hover:border-cyan-500/40 transition">
            <FaCode className="text-cyan-400 text-4xl" />

            <h3 className="mt-5 text-xl font-semibold">Development</h3>

            <p className="mt-3 text-slate-400">
              Passionate about React, JavaScript, modern UI development, and web
              performance.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
