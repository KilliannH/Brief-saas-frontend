import { Link } from "react-router-dom";
import { useAuth } from "../services/auth";
import { useState, useRef, useEffect } from "react";
import { Menu, X, BadgeCheck } from "lucide-react";
import logo from "../assets/logo.png";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "./LanguageSwitcher";

export default function Navbar() {
  const { isAuthenticated, logout, user } = useAuth();
  const [openMenu, setOpenMenu] = useState(false);
  const menuRef = useRef(null);
  const { t } = useTranslation();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpenMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <nav className="px-6 py-4 border-b bg-white flex justify-between items-center shadow-sm sticky top-0 z-50">
        {/* Logo + Langue */}
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center gap-2">
            <img src={logo} alt="BriefMate logo" className="h-10 w-32 object-contain" />
          </Link>
          <div className="hidden md:block">
            <LanguageSwitcher />
          </div>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-4 text-sm">
          {isAuthenticated ? (
            <>
              <Link to="/clients" className="text-gray-700 hover:underline">
                {t("navbar.clients")}
              </Link>
              <Link to="/dashboard" className="text-gray-700 hover:underline">
                {t("navbar.dashboard")}
              </Link>
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setOpenMenu(openMenu === "user" ? null : "user")}
                  className="flex items-center gap-2 text-gray-800 font-medium"
                >
                  <img
                    src={
                      user?.profileImage ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.firstname ?? "")}&background=ddd&color=333`
                    }
                    alt="Avatar"
                    className="w-8 h-8 rounded-full object-cover border border-gray-300"
                  />
                  <span className="text-sm hover:underline">{user?.firstname}</span>
                  {user?.subscriptionActive && (
                    <span className="bg-green-100 text-green-700 text-xs font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
                      <BadgeCheck className="w-4 h-4" />
                      {t("navbar.badge")}
                    </span>
                  )}
                </button>
                {openMenu === "user" && (
                  <div className="absolute right-0 mt-2 w-48 bg-white shadow-md rounded border text-sm z-50">
                    <Link
                      to="/account"
                      className="block px-4 py-2 hover:bg-gray-100"
                      onClick={() => setOpenMenu(null)}
                    >
                      {t("navbar.menu.account")}
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        setOpenMenu(null);
                      }}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                    >
                      {t("navbar.menu.logout")}
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="text-gray-700 hover:underline">
                {t("navbar.login")}
              </Link>
              <Link to="/register" className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700">
                {t("navbar.button")}
              </Link>
            </>
          )}
        </div>

        {/* Hamburger menu (mobile only) */}
        <div className="md:hidden">
          <button onClick={() => setOpenMenu(!openMenu)} aria-label="Toggle menu">
            {openMenu ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu drawer */}
      {openMenu && (
        <div className="md:hidden fixed top-0 left-0 w-full bg-white z-40 shadow-lg border-b animate-fadeInDown p-6 space-y-4">
          <div className="flex justify-between items-center">
            <img src={logo} alt="BriefMate logo" className="h-8" />
            <button onClick={() => setOpenMenu(false)} aria-label="Close menu">
              <X size={24} />
            </button>
          </div>

          <LanguageSwitcher />

          {isAuthenticated ? (
            <>
              <Link to="/clients" className="block text-gray-800" onClick={() => setOpenMenu(false)}>
                {t("navbar.clients")}
              </Link>
              <Link to="/dashboard" className="block text-gray-800" onClick={() => setOpenMenu(false)}>
                {t("navbar.dashboard")}
              </Link>
              <Link to="/account" className="block text-gray-800" onClick={() => setOpenMenu(false)}>
                {t("navbar.menu.account")}
              </Link>
              <button
                onClick={() => {
                  logout();
                  setOpenMenu(false);
                }}
                className="block text-left text-red-600 w-full"
              >
                {t("navbar.menu.logout")}
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="block text-gray-800" onClick={() => setOpenMenu(false)}>
                {t("navbar.login")}
              </Link>
              <Link
                to="/register"
                className="block bg-blue-600 text-white text-center px-3 py-2 rounded hover:bg-blue-700"
                onClick={() => setOpenMenu(false)}
              >
                {t("navbar.button")}
              </Link>
            </>
          )}
        </div>
      )}
    </>
  );
}
