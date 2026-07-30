import { FaGithub, FaExternalLinkAlt } from "react-icons/fa";
import { projects } from "../../data/projects";

export default function FeaturedProjects() {
  return (
    <section className="py-28 px-6">

      <div className="max-w-6xl mx-auto">

        <div className="text-center">

          <span className="text-cyan-400 uppercase tracking-widest">
            Projects
          </span>

          <h2 className="mt-4 text-4xl md:text-5xl font-bold">
            Featured Work
          </h2>

          <p className="mt-5 text-slate-400 max-w-2xl mx-auto">
            A selection of projects showcasing my frontend and full stack development skills.
          </p>

        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">

          {projects.map((project) => (
            <div
              key={project.id}
              className="
                group
                bg-slate-900/60
                backdrop-blur-xl
                border
                border-white/10
                rounded-3xl
                p-7
                hover:border-cyan-500/40
                hover:-translate-y-2
                transition-all
                duration-300
              "
            >

              <h3 className="text-2xl font-semibold">
                {project.title}
              </h3>

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
                    px-4 py-2
                    rounded-xl
                    border border-white/10
                    hover:border-cyan-400
                    transition
                  "
                >
                  <FaGithub />
                  Code
                </a>

                <a
                  href={project.live}
                  target="_blank"
                  rel="noreferrer"
                  className="
                    flex items-center gap-2
                    px-4 py-2
                    rounded-xl
                    bg-cyan-500
                    hover:bg-cyan-400
                    transition
                  "
                >
                  <FaExternalLinkAlt />
                  Live
                </a>

              </div>

            </div>
          ))}

        </div>

      </div>

    </section>
  );
}