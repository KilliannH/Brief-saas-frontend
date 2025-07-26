import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Navbar() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    navigate("/");
  };

  return (
    <nav className="px-6 py-4 border-b bg-white flex justify-between items-center shadow-sm sticky top-0 z-50">
      <Link to="/" className="text-2xl font-bold text-blue-600">
        BriefMate
      </Link>

      <div className="flex gap-4 items-center text-sm">
        {isLoggedIn ? (
          <>
            <Link
              to="/dashboard"
              className="text-gray-700 hover:underline"
            >
              Dashboard
            </Link>
            <button
              onClick={handleLogout}
              className="text-gray-600 hover:underline"
            >
              Déconnexion
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="text-gray-700 hover:underline"
            >
              Connexion
            </Link>
            <Link
              to="/register"
              className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
            >
              Créer un compte
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}