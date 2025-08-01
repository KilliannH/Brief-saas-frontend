import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export default function CookieNotice() {
  const [visible, setVisible] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    const accepted = localStorage.getItem("cookie-consent");
    if (!accepted) setVisible(true);
  }, []);

  const handleConsent = (value) => {
    localStorage.setItem("cookie-consent", value);
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 left-4 bg-white border shadow-lg p-4 rounded-xl z-50 w-[90%] max-w-md">
      <p className="text-sm text-gray-700 mb-4">{t("cookies.message")}</p>
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => handleConsent("denied")}
          className="px-4 py-1 text-sm border rounded text-gray-600 hover:bg-gray-100"
        >
          {t("cookies.button.deny")}
        </button>
        <button
          onClick={() => handleConsent("essentials")}
          className="px-4 py-1 text-sm border rounded text-blue-600 hover:bg-blue-50"
        >
          {t("cookies.button.essentials")}
        </button>
        <button
          onClick={() => handleConsent("accepted")}
          className="px-4 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          {t("cookies.button.accept")}
        </button>
      </div>
    </div>
  );
}