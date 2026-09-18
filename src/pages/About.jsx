import { motion } from "framer-motion";
import { FaGraduationCap, FaBriefcase, FaCode } from "react-icons/fa";

import Layout from "../components/layout/Layout";
import PageWrapper from "../components/common/PageWrapper";
import SEO from "../components/common/SEO";

export default function About() {
  return (
    <Layout>
      <SEO
        title="About | Kartikey Kumar"
        description="Learn more about Kartikey Kumar, Frontend Developer, MCA graduate, and software engineer passionate about modern web development."
      />

      <PageWrapper>
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

              <h1 className="mt-4 text-4xl md:text-5xl font-bold">
                Building Modern Digital Experiences
              </h1>

              <p className="mt-8 text-slate-400 leading-8 text-lg max-w-4xl">
                I'm a Full Stack Developer with professional experience as a
                Frontend Developer at Meon Technologies Private Limited. I
                specialize in building responsive user interfaces and robust web
                applications, combining frontend excellence with backend
                development, APIs, and databases — recently rebuilding this very
                portfolio into a full-stack platform with a Node/Express +
                MongoDB backend, a Gemini-powered AI assistant, and a private
                admin dashboard with live analytics. With an MCA from Galgotias
                University, I am passionate about continuous learning, solving
                real-world problems, and creating high-quality digital
                experiences.
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
                  Master of Computer Applications (MCA) from Galgotias
                  University.
                </p>
              </div>

              <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-3xl p-8 hover:border-cyan-500/40 transition">
                <FaCode className="text-cyan-400 text-4xl" />

                <h3 className="mt-5 text-xl font-semibold">Development</h3>

                <p className="mt-3 text-slate-400">
                  Passionate about React, JavaScript, modern UI development, and
                  web performance.
                </p>
              </div>
            </div>

            {/* Journey */}

            <div className="mt-24">
              <h2 className="text-4xl font-bold">My Journey</h2>

              <div className="mt-10 space-y-8">
                <div className="border-l-2 border-cyan-500 pl-6">
                  <h3 className="text-xl font-semibold">2022 - Started MCA</h3>

                  <p className="text-slate-400 mt-2">
                    Joined Galgotias University and strengthened my
                    understanding of software development concepts.
                  </p>
                </div>

                <div className="border-l-2 border-cyan-500 pl-6">
                  <h3 className="text-xl font-semibold">
                    Built Full Stack Projects
                  </h3>

                  <p className="text-slate-400 mt-2">
                    Developed projects using React, Node.js, MongoDB, REST APIs,
                    and modern frontend technologies.
                  </p>
                </div>

                <div className="border-l-2 border-cyan-500 pl-6">
                  <h3 className="text-xl font-semibold">
                    2025 - Frontend Developer
                  </h3>

                  <p className="text-slate-400 mt-2">
                    Started professional journey at Meon Technologies, working
                    on production-grade applications and business workflows.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </PageWrapper>
    </Layout>
  );
}