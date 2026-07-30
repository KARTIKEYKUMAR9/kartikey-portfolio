import { useEffect, useState } from "react";
import { FaArrowUp } from "react-icons/fa";

export default function BackToTop() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const handleScroll = () =>
      setShow(window.scrollY > 500);

    window.addEventListener("scroll", handleScroll);

    return () =>
      window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!show) return null;

  return (
    <button
      onClick={() =>
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        })
      }
      className="
        fixed
        bottom-6
        right-6
        z-50
        h-12
        w-12
        rounded-full
        bg-cyan-500
        hover:bg-cyan-400
        flex
        items-center
        justify-center
      "
    >
      <FaArrowUp />
    </button>
  );
}