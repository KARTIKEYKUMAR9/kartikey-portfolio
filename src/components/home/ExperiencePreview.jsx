import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";

export default function ExperiencePreview() {
  return (
    <section className="py-28 px-6">
      <div className="max-w-6xl mx-auto">

        <div className="text-center">
          <span className="text-cyan-400 uppercase tracking-widest">
            Experience
          </span>

          <h2 className="mt-4 text-4xl md:text-5xl font-bold">
            Professional Journey
          </h2>

          <p className="mt-5 text-slate-400 max-w-2xl mx-auto">
            My current professional experience and contributions.
          </p>
        </div>

        <div className="mt-20 flex justify-center">
          <div className="relative max-w-3xl w-full">

            {/* Timeline Line */}
            <div className="absolute left-6 top-0 bottom-0 w-[2px] bg-cyan-500/30"></div>

            {/* Timeline Item */}
            <div className="relative pl-20">

              <div className="absolute left-[14px] top-2 w-6 h-6 rounded-full bg-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.8)]"></div>

              <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-3xl p-8 hover:border-cyan-500/40 transition">

                <span className="text-cyan-400 font-medium">
                  Sep 2025 – Present
                </span>

                <h3 className="text-2xl font-bold mt-3">
                  Frontend Developer
                </h3>

                <p className="text-slate-400 mt-2">
                  Meon Technologies Private Limited
                </p>

                <ul className="mt-6 space-y-3 text-slate-300">
                  <li>
                    • Developed responsive and user-friendly interfaces.
                  </li>

                  <li>
                    • Integrated APIs and business workflows.
                  </li>

                  <li>
                    • Improved validation, accessibility, and UI performance.
                  </li>

                  <li>
                    • Collaborated with backend developers for seamless integrations.
                  </li>
                </ul>

              </div>

            </div>
          </div>
        </div>

        <div className="text-center mt-12">
          <Link
            to="/experience"
            className="inline-flex items-center gap-3 px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 transition"
          >
            View Full Experience
            <FaArrowRight />
          </Link>
        </div>

      </div>
    </section>
  );
}