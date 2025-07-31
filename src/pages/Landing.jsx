import { useAuth } from "../services/auth";
import api from "../services/api";
import noteIcon from "../assets/note-icon.png";
import linkIcon from "../assets/link-icon.png";
import checkIcon from "../assets/check-icon.png";
import CustomHelmet from "../components/CustomHelmet";
import { CheckCircle } from "lucide-react";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const monthlyId = import.meta.env.VITE_STRIPE_PRICE_MONTHLY;
const annualId = import.meta.env.VITE_STRIPE_PRICE_ANNUAL;

export default function Landing() {
  const { t } = useTranslation();
  const { isAuthenticated } = useAuth();

  const handleSubscribe = async (priceId) => {
    try {
      const res = await api.post("/stripe/checkout", { priceId });
      window.location.href = res.data.url;
    } catch (err) {
      console.error(err);
      toast.error(t("toast.stripe.error"));
    }
  };

  return (
    <>
      <CustomHelmet
        titleKey="meta.landing.title"
        descriptionKey="meta.landing.description"
        image="/og-landing.png"
        path="/"
      />
      <div className="min-h-screen bg-white text-gray-800">
        {/* Hero */}
        <section
          className="relative min-h-[70vh] flex flex-col justify-center items-center text-center text-white overflow-hidden"
          style={{
            backgroundImage: `url('/hero-bg.png')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="absolute inset-0 bg-black/20 z-0" />
          <div className="relative z-10 bg-white/80 backdrop-blur-sm p-6 rounded-lg max-w-xl shadow-md">
            <h1 className="text-4xl font-bold text-blue-700 mb-4">{t("hero.title")}</h1>
            <p className="text-gray-800 text-lg">
              {t("hero.subtitle")}
            </p>
            <div className="mt-6">
              <Link
                to={isAuthenticated ? "/dashboard" : "/register"}
                className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
              >
                {isAuthenticated ? t("button.hero.dashboard") : t("button.hero.subscribe")}
              </Link>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="px-6 py-16 bg-gray-50">
          <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-8 text-center">
            <Feature icon={<img src={noteIcon} alt="Note Icon" />} title={t("feature1.title")}>
              {t("feature1.description")}
            </Feature>
            <Feature icon={<img src={linkIcon} alt="Link Icon" />} title={t("feature2.title")}>
              {t("feature2.description")}
            </Feature>
            <Feature icon={<img src={checkIcon} alt="Check Icon" />} title={t("feature3.title")}>
              {t("feature3.description")}
            </Feature>
          </div>
        </section>

        {/* Tarification */}
        <section className="px-6 py-20 text-center max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold mb-6">{t("pricing.title")}</h2>
          <p className="mb-6 text-gray-600">{t("pricing.description")}</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* Mensuel */}
            <div className="border rounded-lg p-6 shadow-md bg-white hover:shadow-lg transition">
              <p className="text-2xl font-semibold">{t("pricing.monthly")}</p>
              <ul className="text-left text-sm text-gray-700 my-4">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" /> {t("pricing.monthly.feature1")}
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" /> {t("pricing.monthly.feature2")}
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" /> {t("pricing.monthly.feature3")}
                </li>
              </ul>
              {isAuthenticated ? (
                <button
                  onClick={() => handleSubscribe(monthlyId)} // remplace par ton vrai ID
                  className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700"
                >
                  {t("button.monthly.subscribe")}
                </button>
              ) : (
                <a
                  href="/login"
                  className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700"
                >
                  {t("button.login")}
                </a>
              )}
            </div>

            {/* Annuel */}
            <div className="border rounded-lg p-6 shadow-md bg-white hover:shadow-lg transition">
              <p className="text-2xl font-semibold">{t("pricing.annual")}</p>
              <p className="text-sm text-gray-500">{t("pricing.annual.description")}</p>
              <ul className="text-left text-sm text-gray-700 my-4">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" /> {t("pricing.annual.feature1")}
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" /> {t("pricing.annual.feature2")}
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" /> {t("pricing.annual.feature3")}
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" /> {t("pricing.annual.feature4")}
                </li>
              </ul>
              {isAuthenticated ? (
                <button
                  onClick={() => handleSubscribe(annualId)} // remplace par ton vrai ID
                  className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700"
                >
                  {t("button.annual.subscribe")}
                </button>
              ) : (
                <a
                  href="/login"
                  className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700"
                >
                  {t("button.login")}
                </a>
              )}
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

function Feature({ icon, title, children }) {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="w-24 h-24 mb-4">{icon}</div>
      <h3 className="font-semibold text-lg mb-2">{title}</h3>
      <p className="text-gray-600 text-sm">{children}</p>
    </div>
  );
}