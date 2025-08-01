import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { ChevronDown, Globe } from "lucide-react";

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const toggleMenu = () => setOpen((prev) => !prev);

  const handleChangeLang = async (lang) => {
    await i18n.changeLanguage(lang);
    setOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={toggleMenu}
        className="text-sm text-gray-700 hover:underline flex items-center gap-1"
      >
        <Globe className="w-4 h-4" />
        {i18n.language.toUpperCase()}
        <ChevronDown className="w-4 h-4" />
      </button>

      {open && (
        <div className="absolute bg-white border rounded shadow-md mt-2 w-28 z-10">
          <button
            onClick={() => handleChangeLang("fr")}
            className={`block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm ${i18n.language === "fr" ? "font-bold" : ""
              }`}
          >
            🇫🇷 Français
          </button>
          <button
            onClick={() => handleChangeLang("en")}
            className={`block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm ${i18n.language === "en" ? "font-bold" : ""
              }`}
          >
            🇬🇧 English
          </button>
        </div>
      )}
    </div>
  );
}