import { Link } from "react-router-dom";

export default function Navbar({ onLogout }) {
  return (
    <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center">
      <div className="text-xl font-bold text-blue-600">
        <Link to="/">Brief SaaS</Link>
      </div>

      <div className="flex gap-4 items-center">
        <Link to="/dashboard" className="text-gray-700 hover:text-blue-600">
          Dashboard
        </Link>

        <Link to="/briefs/new" className="text-gray-700 hover:text-blue-600">
          Nouveau brief
        </Link>

        <button
          onClick={onLogout}
          className="text-red-500 hover:text-red-700 text-sm underline"
        >
          Déconnexion
        </button>
      </div>
    </nav>
  );
}