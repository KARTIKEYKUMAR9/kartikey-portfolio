import Layout from "../components/layout/Layout";
import { experiences } from "../data/experience";

import PageWrapper from "../components/common/PageWrapper";

import SEO from "../components/common/SEO";

export default function Experience() {
  return (
    <Layout>
      <SEO
        title="Experience | Kartikey Kumar"
        description="Professional experience of Kartikey Kumar as a Frontend Developer working with React, JavaScript, APIs, and modern web technologies."
      />
      <PageWrapper>
        <section className="py-28 px-6">
          <div className="max-w-6xl mx-auto">
            {/* Header */}

            <div className="text-center">
              <span className="text-cyan-400 uppercase tracking-widest">
                Experience
              </span>

              <h1 className="mt-4 text-5xl md:text-6xl font-bold">
                Professional Experience
              </h1>

              <p className="mt-6 text-slate-400 max-w-3xl mx-auto">
                My professional journey, contributions, and experience building
                modern web applications.
              </p>
            </div>

            {/* Timeline */}

            <div className="mt-24 relative">
              <div className="absolute left-5 top-0 bottom-0 w-[2px] bg-cyan-500/30"></div>

              {experiences.map((exp) => (
                <div key={exp.id} className="relative pl-16 mb-16">
                  {/* Timeline Dot */}

                  <div className="absolute left-0 top-4 w-10 h-10 rounded-full bg-cyan-500 flex items-center justify-center shadow-[0_0_20px_rgba(34,211,238,0.8)]">
                    <div className="w-4 h-4 bg-white rounded-full"></div>
                  </div>

                  {/* Card */}

                  <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-3xl p-8 hover:border-cyan-500/40 transition">
                    <div className="flex flex-wrap justify-between gap-4">
                      <div>
                        <h2 className="text-3xl font-bold">{exp.role}</h2>

                        <p className="text-cyan-400 mt-2">{exp.company}</p>
                      </div>

                      <div className="text-slate-400">
                        {exp.startDate} — {exp.endDate}
                      </div>
                    </div>

                    {/* Tech Stack */}

                    <div className="flex flex-wrap gap-3 mt-8">
                      {exp.technologies.map((tech) => (
                        <span
                          key={tech}
                          className="px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-sm"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    {/* Responsibilities */}

                    <div className="mt-8">
                      <h3 className="text-xl font-semibold">
                        Key Responsibilities
                      </h3>

                      <ul className="mt-4 space-y-3">
                        {exp.responsibilities.map((item) => (
                          <li key={item} className="text-slate-400 flex gap-3">
                            <span className="text-cyan-400">•</span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </PageWrapper>
    </Layout>
  );
}
