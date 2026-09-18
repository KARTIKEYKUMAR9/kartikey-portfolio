import { Link } from "react-router-dom";

function AdminNotFound() {
  return (
    <div className="flex flex-col items-center justify-center text-center py-20">
      <p className="text-5xl font-bold text-slate-700">404</p>
      <h1 className="text-lg font-semibold text-white mt-4">
        Admin page not found
      </h1>
      <p className="text-sm text-slate-500 mt-1 max-w-xs">
        This admin page doesn't exist or may have moved.
      </p>
      <Link
        to="/admin/dashboard"
        className="mt-6 bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
      >
        Back to Dashboard
      </Link>
    </div>
  );
}

export default AdminNotFound;