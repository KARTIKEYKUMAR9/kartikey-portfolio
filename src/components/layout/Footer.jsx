// import {
//   FaGithub,
//   FaLinkedin,
//   FaEnvelope,
//   FaPhone,
//   FaMapMarkerAlt,
// } from "react-icons/fa";

// import { profile } from "../../data/profile";

// export default function Footer() {
//   return (
//     <footer className="mt-24 border-t border-white/10 bg-slate-950">

//       <div className="max-w-7xl mx-auto px-6 py-12">

//         <div className="grid md:grid-cols-3 gap-10">

//           <div>
//             <h3 className="text-2xl font-bold text-white">
//               {profile.name}
//             </h3>

//             <p className="text-slate-400 mt-3">
//               {profile.title}
//             </p>
//           </div>

//           <div className="space-y-3 text-slate-300">

//             <div className="flex gap-3">
//               <FaMapMarkerAlt />
//               <span>{profile.location}</span>
//             </div>

//             <div className="flex gap-3">
//               <FaPhone />
//               <span>{profile.phone}</span>
//             </div>

//             <div className="flex gap-3">
//               <FaEnvelope />
//               <span>{profile.email}</span>
//             </div>

//           </div>

//           <div className="flex gap-5 text-2xl">

//             <a
//               href={profile.github}
//               target="_blank"
//               rel="noreferrer"
//             >
//               <FaGithub />
//             </a>

//             <a
//               href={profile.linkedin}
//               target="_blank"
//               rel="noreferrer"
//             >
//               <FaLinkedin />
//             </a>

//           </div>

//         </div>

//         <div className="mt-10 pt-6 border-t border-white/10 text-center text-slate-500">
//           © {new Date().getFullYear()} {profile.name}. All rights reserved.
//         </div>

//       </div>
//     </footer>
//   );
// }
import {
  FaGithub,
  FaLinkedin,
  FaEnvelope,
} from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 py-10 mt-20">

      <div className="max-w-6xl mx-auto px-6">

        <div className="flex flex-col md:flex-row items-center justify-between gap-6">

          <div>
            <h3 className="font-bold text-xl">
              Kartikey Kumar
            </h3>

            <p className="text-slate-400">
              Full Stack Developer
            </p>
          </div>

          <div className="flex gap-6 text-2xl">

            <a
              href="mailto:kartikeyk91@gmail.com"
            >
              <FaEnvelope />
            </a>

            <a
              href="https://github.com/KARTIKEYKUMAR9"
              target="_blank"
              rel="noreferrer"
            >
              <FaGithub />
            </a>

            <a
              href="https://www.linkedin.com/in/kartikey-kumar2002/"
              target="_blank"
              rel="noreferrer"
            >
              <FaLinkedin />
            </a>

          </div>

        </div>

        <div className="mt-8 text-center text-slate-500 text-sm">

          © {new Date().getFullYear()} Kartikey Kumar.
          All Rights Reserved.

        </div>

      </div>

    </footer>
  );
}