import { Link } from "react-router-dom";
import { useAuth } from "../services/auth";
import { useState, useRef, useEffect } from "react";
import { BadgeCheck } from "lucide-react";
import logo from "../assets/logo.png";

export default function Navbar() {
  const { isAuthenticated, logout, user } = useAuth();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => setOpen((prev) => !prev);

  // Fermer le menu si on clique en dehors
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="px-6 py-4 border-b bg-white flex justify-between items-center shadow-sm sticky top-0 z-50">
      <Link to="/" className="flex items-center gap-2 pl-6">
        <img src={logo} alt="BriefMate logo" className="h-10 w-32 object-contain" />
      </Link>

      <div className="flex items-center gap-4 text-sm relative">
        {isAuthenticated ? (
          <>
            <Link
              to="/dashboard"
              className="text-gray-700 hover:underline"
            >
              Dashboard
            </Link>

            <div className="relative" ref={dropdownRef}>
              <button
  onClick={toggleDropdown}
  className="flex items-center gap-2 text-gray-800 font-medium"
>
  {/* Avatar */}
  <img
    src={
      user?.profileImage ||
      `https://ui-avatars.com/api/?name=${encodeURIComponent(
        user?.firstname ?? ""
      )}&background=ddd&color=333`
    }
    alt="Avatar"
    className="w-8 h-8 rounded-full object-cover border border-gray-300"
  />

  {/* Prénom + badge alignés */}
  <div className="flex items-center gap-2">
    {/* Seul ce span se souligne au hover */}
    <span className="text-sm hover:underline">{user?.firstname}</span>

    {user?.subscriptionActive && (
      <span className="bg-green-100 text-green-700 text-xs font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
        <BadgeCheck className="w-4 h-4" />
        Abonné
      </span>
    )}
  </div>
</button>

              {open && (
                <div className="absolute right-0 mt-2 w-48 bg-white shadow-md rounded border text-sm z-50">
                  <Link
                    to="/account"
                    className="block px-4 py-2 hover:bg-gray-100"
                    onClick={() => setOpen(false)}
                  >
                    Paramètres du compte
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    Déconnexion
                  </button>
                </div>
              )}
            </div>
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