import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import CustomHelmet from "../components/CustomHelmet";
import i18n from "i18next";
import { useAuth } from "../services/auth";

const protocol = import.meta.env.VITE_BE_PROTOCOL;
const host = import.meta.env.VITE_BE_HOST;
const port = import.meta.env.VITE_BE_PORT;

const baseUrl = `${protocol}://${host}:${port}`

export default function Register() {
  const { t } = useTranslation();
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();

  const lang = i18n.language;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post(baseUrl + "/auth/signup", {
        email,
        password,
        firstname,
        lastname,
        language: lang,
      });

      const token = res.data.token;
      login(token); // connecte et redirige
      toast.success(t("register.toast.success"));
    } catch (err) {
      console.error(err);
      setError(t("register.error"));
      toast.error(t("register.toast.error"));
    }
  };

  return (
    <>
    <CustomHelmet
  title={t("helmet.register.title")}
  description={t("helmet.register.description")}
  path="/register"
/>
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-md w-full max-w-sm"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">{t("register.title")}</h2>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">{t("register.firstname")}</label>
          <input
            type="text"
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
            value={firstname}
            onChange={(e) => setFirstname(e.target.value)}
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">{t("register.lastname")}</label>
          <input
            type="text"
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
            value={lastname}
            onChange={(e) => setLastname(e.target.value)}
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">{t("register.email")}</label>
          <input
            type="email"
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium mb-1">{t("register.password")}</label>
          <input
            type="password"
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <div className="mb-4 flex items-start gap-2 text-sm">
          <input
            type="checkbox"
            id="acceptTerms"
            checked={acceptTerms}
            onChange={() => setAcceptTerms(!acceptTerms)}
            className="mt-1"
            required
          />
          <label htmlFor="acceptTerms">
            {t("register.terms.label")}{" "}
            <a
              href="/terms-of-use"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline hover:text-blue-800"
            >
              {t("register.terms.link")}
            </a>.
          </label>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
        >
          {t("register.button")}
        </button>
      </form>
    </div>
    </>
  );
}