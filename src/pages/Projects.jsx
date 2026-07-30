import Layout from "../components/layout/Layout";
import { projects } from "../data/projects";
import { FaGithub, FaExternalLinkAlt } from "react-icons/fa";
import PageWrapper from "../components/common/PageWrapper";

import SEO from "../components/common/SEO";

export default function Projects() {
  return (
    <Layout>
      <SEO
        title="Projects | Kartikey Kumar"
        description="Explore projects built by Kartikey Kumar including React applications, full stack projects, and modern web solutions."
      />
      <PageWrapper>
        <section className="py-28 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center">
              <span className="text-cyan-400 uppercase tracking-widest">
                Projects
              </span>

              <h1 className="mt-4 text-5xl md:text-6xl font-bold">My Work</h1>

              <p className="mt-6 text-slate-400 max-w-3xl mx-auto">
                A collection of projects showcasing my experience in frontend
                and full stack development.
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8 mt-20">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className="
                  bg-slate-900/60
                  border
                  border-white/10
                  rounded-3xl
                  overflow-hidden
                  backdrop-blur-xl
                  hover:border-cyan-500/40
                  transition
                "
                >
                  {/* Banner */}

                  <div className="h-60 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 flex items-center justify-center">
                    <h2 className="text-3xl font-bold">{project.title}</h2>
                  </div>

                  <div className="p-8">
                    <span className="text-cyan-400">{project.category}</span>

                    <p className="mt-4 text-slate-400 leading-7">
                      {project.description}
                    </p>

                    <div className="flex flex-wrap gap-2 mt-6">
                      {project.technologies.map((tech) => (
                        <span
                          key={tech}
                          className="
                          px-3
                          py-1
                          rounded-full
                          text-sm
                          bg-cyan-500/10
                          border
                          border-cyan-500/20
                          text-cyan-300
                        "
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    <div className="flex gap-4 mt-8">
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noreferrer"
                        className="
                        flex items-center gap-2
                        px-5 py-3
                        border border-white/10
                        rounded-xl
                        hover:border-cyan-400
                        transition
                      "
                      >
                        <FaGithub />
                        GitHub
                      </a>

                      <a
                        href={project.live}
                        target="_blank"
                        rel="noreferrer"
                        className="
                        flex items-center gap-2
                        px-5 py-3
                        rounded-xl
                        bg-cyan-500
                        hover:bg-cyan-400
                        transition
                      "
                      >
                        <FaExternalLinkAlt />
                        Live Demo
                      </a>
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
