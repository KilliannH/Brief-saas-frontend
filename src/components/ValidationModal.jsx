import { useState } from "react";
import { useTranslation } from "react-i18next";

export default function ValidationModal({ onClose, onValidate }) {
  const { t } = useTranslation();
  const [code, setCode] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (code.length === 6) {
      onValidate(code);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-md p-6 w-full max-w-sm animate-fadeInScale">
        <h2 className="text-xl font-semibold mb-4">{t("validationModal.title")}</h2>
        <p className="text-sm text-gray-600 mb-4">
          {t("validationModal.description")}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={6}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded text-center tracking-widest text-lg"
            placeholder="••••••"
          />
          <div className="flex justify-between gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:underline"
            >
              {t("validationModal.button.cancel")}
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              disabled={code.length !== 6}
            >
              {t("validationModal.button.submit")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}