import Navbar from "./Navbar";
import Footer from "./Footer";

import BackToTop from "../../components/common/BackToTop";

export default function Layout({
  children,
}) {
  return (
    <>
      <BackToTop />
      <Navbar />

      <main className="pt-20">
        {children}
      </main>

      <Footer />
    </>
  );
}