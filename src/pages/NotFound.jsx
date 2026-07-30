import { Link } from "react-router-dom";
import PageWrapper from "../components/common/PageWrapper";

import SEO from "../components/common/SEO";

export default function NotFound() {
  return (
    <PageWrapper>
      <SEO
        title="Page Not Found | Kartikey Kumar"
        description="The page you are looking for does not exist."
      />
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="text-center">
          <h1 className="text-8xl font-bold text-cyan-400">404</h1>

          <h2 className="text-3xl font-semibold mt-4">Page Not Found</h2>

          <p className="text-slate-400 mt-4 max-w-lg">
            Oops! The page you're looking for doesn't exist or may have been
            moved or under development.
          </p>

          <Link
            to="/"
            className="inline-block mt-8 px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 transition"
          >
            Go Home
          </Link>
        </div>
      </div>
    </PageWrapper>
  );
}
