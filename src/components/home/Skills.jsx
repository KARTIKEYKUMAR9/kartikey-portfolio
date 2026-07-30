import Reveal from "../common/Reveal";

import {
  FaReact,
  FaNodeJs,
  FaGitAlt,
  FaGithub,
} from "react-icons/fa";

import {
  SiJavascript,
  SiRedux,
  SiTailwindcss,
  SiExpress,
  SiMongodb,
  SiMysql,
  SiPostman,
  SiVite,
} from "react-icons/si";

const skillCategories = [
  {
    title: "Frontend",
    skills: [
      { name: "React", icon: <FaReact /> },
      { name: "JavaScript", icon: <SiJavascript /> },
      { name: "Redux", icon: <SiRedux /> },
      { name: "Tailwind CSS", icon: <SiTailwindcss /> },
      { name: "React Router", icon: <FaReact /> },
    ],
  },

  {
    title: "Backend",
    skills: [
      { name: "Node.js", icon: <FaNodeJs /> },
      { name: "Express.js", icon: <SiExpress /> },
      { name: "REST APIs", icon: <FaNodeJs /> },
    ],
  },

  {
    title: "Database",
    skills: [
      { name: "MongoDB", icon: <SiMongodb /> },
      { name: "MySQL", icon: <SiMysql /> },
    ],
  },

  {
    title: "Tools",
    skills: [
      { name: "Git", icon: <FaGitAlt /> },
      { name: "GitHub", icon: <FaGithub /> },
      { name: "Postman", icon: <SiPostman /> },
      { name: "Vite", icon: <SiVite /> },
    ],
  },
];

export default function Skills() {
  return (
    <section className="relative py-28 px-6 overflow-hidden">

      {/* Background Glow */}

      <div className="absolute top-20 left-10 w-72 h-72 bg-cyan-500/10 blur-[120px] rounded-full"></div>

      <div className="absolute bottom-20 right-10 w-72 h-72 bg-purple-500/10 blur-[120px] rounded-full"></div>

      <div className="max-w-7xl mx-auto relative z-10">

        {/* Heading */}

        <Reveal>
          <div className="text-center">

            <span className="text-cyan-400 uppercase tracking-[4px] text-sm">
              Technical Skills
            </span>

            <h2 className="mt-4 text-4xl md:text-5xl font-bold">
              Technologies I Work With
            </h2>

            <p className="mt-6 text-slate-400 max-w-2xl mx-auto leading-8">
              A collection of technologies and tools I use to build
              responsive, scalable, and high-performance web applications.
            </p>

          </div>
        </Reveal>

        {/* Skill Categories */}

        <div className="grid md:grid-cols-2 gap-8 mt-20">

          {skillCategories.map((category, index) => (
            <Reveal
              key={category.title}
              delay={index * 0.15}
            >
              <div
                className="
                  group
                  p-8
                  rounded-3xl
                  bg-slate-900/60
                  border
                  border-white/10
                  backdrop-blur-xl
                  transition-all
                  duration-300
                  hover:border-cyan-400/40
                  hover:shadow-[0_0_40px_rgba(34,211,238,0.15)]
                "
              >

                <h3 className="text-2xl font-bold text-cyan-400 mb-8">
                  {category.title}
                </h3>

                <div className="flex flex-wrap gap-4">

                  {category.skills.map((skill) => (
                    <div
                      key={skill.name}
                      className="
                        flex
                        items-center
                        gap-3
                        px-4
                        py-3
                        rounded-xl
                        bg-white/5
                        border
                        border-white/10
                        hover:border-cyan-400/40
                        hover:text-cyan-400
                        transition-all
                        duration-300
                      "
                    >

                      <span className="text-xl">
                        {skill.icon}
                      </span>

                      <span className="text-sm font-medium">
                        {skill.name}
                      </span>

                    </div>
                  ))}

                </div>

              </div>
            </Reveal>
          ))}

        </div>

      </div>

    </section>
  );
}