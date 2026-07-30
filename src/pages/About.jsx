import Layout from "../components/layout/Layout";
import { FaGraduationCap, FaBriefcase, FaCode } from "react-icons/fa";

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
        <section className="relative py-28 px-6">
          <div className="max-w-6xl mx-auto">
            {/* Heading */}

            <div className="text-center">
              <span className="text-cyan-400 uppercase tracking-widest">
                About Me
              </span>

              <h1 className="mt-4 text-5xl md:text-6xl font-bold">
                Turning Ideas Into
                <span className="text-cyan-400"> Digital Experiences</span>
              </h1>

              <p className="mt-8 text-slate-400 max-w-3xl mx-auto leading-8 text-lg">
                I'm Kartikey Kumar, an aspiring Software Engineer and Full Stack Developer focused on building responsive, scalable, and user-centric web applications. Currently working as a Frontend Developer, I combine frontend expertise with backend knowledge to create complete digital solutions.
              </p>
            </div>

            {/* Cards */}

            <div className="grid md:grid-cols-3 gap-8 mt-20">
              <div className="bg-slate-900/60 border border-white/10 rounded-3xl p-8 backdrop-blur-xl">
                <FaBriefcase className="text-5xl text-cyan-400" />

                <h3 className="mt-5 text-2xl font-semibold">Experience</h3>

                <p className="mt-4 text-slate-400 leading-7">
                  Currently working as a Frontend Developer at Meon Technologies
                  Private Limited, contributing to scalable web applications and
                  modern user interfaces.
                </p>
              </div>

              <div className="bg-slate-900/60 border border-white/10 rounded-3xl p-8 backdrop-blur-xl">
                <FaGraduationCap className="text-5xl text-cyan-400" />

                <h3 className="mt-5 text-2xl font-semibold">Education</h3>

                <p className="mt-4 text-slate-400 leading-7">
                  Master of Computer Applications (MCA) from Galgotias
                  University (2022 – 2024), with a strong foundation in software
                  development and problem solving.
                </p>
              </div>

              <div className="bg-slate-900/60 border border-white/10 rounded-3xl p-8 backdrop-blur-xl">
                <FaCode className="text-5xl text-cyan-400" />

                <h3 className="mt-5 text-2xl font-semibold">Development</h3>

                <p className="mt-4 text-slate-400 leading-7">
                  Specialized in React.js, JavaScript, Redux, Tailwind CSS, API
                  Integration, and building high-performance web applications.
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

            {/* Strengths */}

            <div className="mt-24">
              <h2 className="text-4xl font-bold">Core Strengths</h2>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
                {[
                  "Problem Solving",
                  "Quick Learner",
                  "Team Collaboration",
                  "UI Development",
                ].map((item) => (
                  <div
                    key={item}
                    className="bg-slate-900/60 border border-white/10 rounded-2xl p-6 text-center hover:border-cyan-400/40 hover:shadow-[0_0_40px_rgba(34,211,238,0.15)]"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </PageWrapper>
    </Layout>
  );
}
