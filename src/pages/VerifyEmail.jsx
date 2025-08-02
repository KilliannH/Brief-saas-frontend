import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import CustomHelmet from "../components/CustomHelmet";
import { CheckCircle, XCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import Loader from "../components/Loader";

export default function VerifyEmail() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState("loading"); // 'loading' | 'success' | 'error'
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      setStatus("error");
      return;
    }

    api
      .get(`/auth/verify?token=${token}`)
      .then(() => setStatus("success"))
      .catch(() => setStatus("error"));
  }, [token]);

  return (
    <>
      <CustomHelmet
        titleKey="meta.verify.title"
        descriptionKey="meta.verify.description"
        path="/verify"
      />
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white p-6 rounded-lg shadow-md max-w-md w-full text-center">
        {status === "loading" && (
          <div className="flex flex-col items-center gap-4">
            <Loader />
            <p className="text-sm text-gray-700">{t("verifyEmail.inProgress")}</p>
          </div>
        )}

        {status === "success" && (
          <div className="flex flex-col items-center gap-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
            <p className="text-sm text-green-700 font-semibold">
              {t("verifyEmail.success")}
            </p>
            <button
              onClick={() => navigate("/login")}
              className="mt-2 px-4 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
            >
              {t("verifyEmail.success.button")}
            </button>
          </div>
        )}

        {status === "error" && (
          <div className="flex flex-col items-center gap-4">
            <XCircle className="w-8 h-8 text-red-600" />
            <p className="text-sm text-red-700 font-semibold">
              {t("verifyEmail.error")}
            </p>
            <button
              onClick={() => navigate("/register")}
              className="mt-2 px-4 py-1 bg-gray-600 text-white text-sm rounded hover:bg-gray-700"
            >
              {t("verifyEmail.error.button")}
            </button>
          </div>
        )}
      </div>
    </div>
    </>
  );
}