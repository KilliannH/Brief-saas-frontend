import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth } from "../services/auth";
import { useTranslation } from "react-i18next";

const protocol = import.meta.env.VITE_BE_PROTOCOL;
const host = import.meta.env.VITE_BE_HOST;
const port = import.meta.env.VITE_BE_PORT;

const baseUrl = `${protocol}://${host}:${port}`

export default function Login() {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post(baseUrl + "/auth/login", {
        email,
        password,
      });

      const token = res.data.token;
      login(token); // met à jour le contexte et redirige
      toast.success(t("login.toast.success"));
    } catch (err) {
      console.error(err);
      setError(t("login.error"));
      toast.error(t("login.toast.error"));
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-md w-full max-w-sm"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">{t("login.title")}</h2>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">{t("login.email")}</label>
          <input
            type="email"
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium mb-1">{t("login.password")}</label>
          <input
            type="password"
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
        >
          {t("login.button")}
        </button>
      </form>
    </div>
  );
}
