import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { HiOutlineMenuAlt3, HiX } from "react-icons/hi";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinkClass = ({ isActive }) =>
    `relative px-4 py-2 transition ${
      isActive ? "text-cyan-400" : "text-slate-300 hover:text-cyan-400"
    }`;

  return (
    <header
      className={`
        fixed
        top-0
        left-0
        w-full
        z-50
        transition-all
        duration-300
        ${
          isScrolled
            ? "bg-slate-950/80 backdrop-blur-xl border-b border-white/10"
            : "bg-transparent"
        }
      `}
    >
      <div className="max-w-6xl mx-auto px-6">
        <div className="h-20 flex items-center justify-between">
          {/* Logo */}

          <NavLink to="/" className="text-2xl font-bold">
            <span className="text-cyan-400">K</span>
            artikey
          </NavLink>

          {/* Desktop Menu */}

          <nav className="hidden md:flex items-center gap-2">
            <NavLink to="/" className={navLinkClass}>
              Home
            </NavLink>

            <NavLink to="/about" className={navLinkClass}>
              About
            </NavLink>

            <NavLink to="/experience" className={navLinkClass}>
              Experience
            </NavLink>

            <NavLink to="/projects" className={navLinkClass}>
              Projects
            </NavLink>

            <NavLink to="/contact" className={navLinkClass}>
              Contact
            </NavLink>
          </nav>

          {/* Mobile Button */}

          <button
            className="md:hidden text-3xl"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <HiX /> : <HiOutlineMenuAlt3 />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}

      <div
        className={`
          md:hidden
          overflow-hidden
          transition-all
          duration-300
          ${isOpen ? "max-h-80 border-t border-white/10" : "max-h-0"}
          bg-slate-950/95
          backdrop-blur-xl
        `}
      >
        <div className="flex flex-col p-6 gap-4">
          <NavLink to="/" onClick={() => setIsOpen(false)}>
            Home
          </NavLink>

          <NavLink to="/about" onClick={() => setIsOpen(false)}>
            About
          </NavLink>

          <NavLink to="/experience" onClick={() => setIsOpen(false)}>
            Experience
          </NavLink>

          <NavLink to="/projects" onClick={() => setIsOpen(false)}>
            Projects
          </NavLink>

          <NavLink to="/contact" onClick={() => setIsOpen(false)}>
            Contact
          </NavLink>
        </div>
      </div>
    </header>
  );
}
