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
  const [showBanner, setShowBanner] = useState(true);
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
      {showBanner && (
        <div className="bg-blue-50 text-blue-900 text-center text-sm py-2 px-4 border-b border-blue-100 relative">
          🚀 <strong>{t("banner.title")}</strong> – {t("banner.description")}{" "}
          <a
            href="https://www.producthunt.com/posts/briefmate"
            target="_blank"
            rel="noopener noreferrer"
            className="underline font-medium hover:text-blue-600"
          >
            Product Hunt
          </a>!
          <button
            onClick={() => setShowBanner(false)}
            className="absolute right-3 top-2 text-blue-700 hover:text-blue-900"
            aria-label="Close banner"
          >
            ×
          </button>
        </div>
      )}
      {/* NAVBAR */}
      <nav className="px-6 py-4 border-b bg-white flex justify-between items-center shadow-sm sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center gap-2">
            <img src={logo} alt="BriefMate logo" className="h-10 w-32 object-contain" />
          </Link>
          <div className="hidden md:block">
            <LanguageSwitcher />
          </div>
        </div>

        <div className="hidden md:flex items-center gap-4 text-sm">
          {isAuthenticated ? (
            <>
              <Link to="/clients" className="text-gray-700 hover:underline">{t("navbar.clients")}</Link>
              <Link to="/dashboard" className="text-gray-700 hover:underline">{t("navbar.dashboard")}</Link>

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
              <Link to="/login" className="text-gray-700 hover:underline">{t("navbar.login")}</Link>
              <Link to="/register" className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700">
                {t("navbar.button")}
              </Link>
            </>
          )}
        </div>

        {/* Hamburger */}
        <div className="md:hidden">
          <button onClick={() => setOpenMenu(true)} aria-label="Toggle menu">
            <Menu size={24} />
          </button>
        </div>
      </nav>

      {/* Overlay (fade-in / fade-out) */}
      <div
        className={`fixed inset-0 z-40 bg-black transition-opacity duration-300 ease-in-out ${openMenu ? "opacity-40 pointer-events-auto" : "opacity-0 pointer-events-none"
          }`}
        onClick={() => setOpenMenu(false)}
      />

      {/* Side drawer */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white z-50 shadow-md transition-transform duration-300 ease-in-out transform ${openMenu ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <img src={logo} alt="BriefMate logo" className="h-8" />
          <button onClick={() => setOpenMenu(false)}><X size={24} /></button>
        </div>

        <div className="p-4 space-y-4">
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
                className="text-red-600 text-left w-full"
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
      </div>
    </>
  );
}
