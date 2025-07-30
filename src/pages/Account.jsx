import { useState, useEffect } from "react";
import api from "../services/api";
import { useAuth } from "../services/auth";
import { CheckCircle } from "lucide-react";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

const monthlyId = import.meta.env.VITE_STRIPE_PRICE_MONTHLY;
const annualId = import.meta.env.VITE_STRIPE_PRICE_ANNUAL;

export default function Account() {
  const { t } = useTranslation();
  const { user, token } = useAuth();

  const [form, setForm] = useState({
    firstname: "",
    lastname: "",
    profileImage: "",
  });
  const [planLabel, setPlanLabel] = useState("");
  const [targetPriceId, setTargetPriceId] = useState("");

  useEffect(() => {
    if (user) {
      setForm({
        firstname: user.firstname || "",
        lastname: user.lastname || "",
        profileImage: user.profileImage || "",
      });
    }
    if (user?.subscriptionActive) {
      switch (user.currentPriceId) {
        case import.meta.env.VITE_STRIPE_PRICE_MONTHLY:
          setPlanLabel(t("account.monthly.plan.label"));
          setTargetPriceId(import.meta.env.VITE_STRIPE_PRICE_YEARLY);
          break;
        case import.meta.env.VITE_STRIPE_PRICE_YEARLY:
          setPlanLabel(t("account.annual.plan.label"));
          setTargetPriceId(import.meta.env.VITE_STRIPE_PRICE_MONTHLY);
          break;
        default:
          setPlanLabel(t("account.unknown.plan.label"));
      }
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubscribe = async (priceId) => {
    try {
      const res = await api.post("/stripe/checkout", { priceId });
      window.location.href = res.data.url;
    } catch (err) {
      console.error(err);
      toast.error("Erreur lors de la redirection vers Stripe");
    }
  };

  const handleManage = async () => {
    const res = await api.post("/stripe/portal");
    window.location.href = res.data.url;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put("/me", form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success(t("account.toast.update.success"));
    } catch (err) {
      console.error(err);
      toast.error(t("account.toast.update.error"));
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">{t("account.title")}</h1>

      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 shadow rounded">
        <div>
          <label className="block text-sm font-medium mb-1">{t("account.form.firstname")}</label>
          <input
            name="firstname"
            type="text"
            className="w-full px-3 py-2 border rounded-md"
            value={form.firstname}
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">{t("account.form.lastname")}</label>
          <input
            name="lastname"
            type="text"
            className="w-full px-3 py-2 border rounded-md"
            value={form.lastname}
            onChange={handleChange}
          />
        </div>

        <div className="flex items-center gap-4">
          <div className="relative group">
            <img
              src={
                form.profileImage ||
                "https://ui-avatars.com/api/?name=" +
                encodeURIComponent(`${form.firstname} ${form.lastname}`) +
                "&background=ddd&color=333"
              }
              alt="Avatar"
              className="w-20 h-20 rounded-full object-cover border border-gray-300"
            />
            <label
              htmlFor="profileImage"
              className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 text-white text-xs rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition"
            >
              {t("account.form.image.edit")}
            </label>
          </div>

          <input
            id="profileImage"
            name="profileImage"
            type="text"
            placeholder={t("account.form.image.placeholder")}
            className="flex-1 px-3 py-2 border rounded-md"
            value={form.profileImage}
            onChange={handleChange}
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {t("account.form.button.submit")}
        </button>
      </form>

      {user?.subscriptionActive ? (
        <div className="pt-4 border-t mt-4">
          <span className="text-sm text-gray-600">{t("account.plan.title")} :</span>
          <div className="text-base font-medium mb-2">{planLabel}</div>

          <button
            onClick={handleManage}
            className="text-sm text-blue-600 hover:underline"
          >
            {t("account.plan.button.edit")}
          </button>
        </div>
      ) : (
        <section className="px-0 pt-10 text-center max-w-2xl mx-auto">
          <h2 className="text-xl font-semibold mb-4">{t("pricing.title")}</h2>
          <p className="mb-6 text-gray-600 text-sm">{t("pricing.description")}</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Mensuel */}
            <div className="border rounded-lg p-6 shadow-sm bg-white hover:shadow-md transition">
              <p className="text-lg font-semibold">{t("pricing.monthly")}</p>
              <ul className="text-left text-sm text-gray-700 my-4 space-y-2">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  {t("pricing.monthly.feature1")}
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  {t("pricing.monthly.feature2")}
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  {t("pricing.monthly.feature3")}
                </li>
              </ul>
              <button
                onClick={() => handleSubscribe(monthlyId)}
                className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 text-sm"
              >
                {t("button.monthly.subscribe")}
              </button>
            </div>

            {/* Annuel */}
            <div className="border rounded-lg p-6 shadow-sm bg-white hover:shadow-md transition">
              <p className="text-lg font-semibold">{t("pricing.annual")}</p>
              <p className="text-sm text-gray-500">{t("pricing.annual.description")}</p>
              <ul className="text-left text-sm text-gray-700 my-4 space-y-2">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  {t("pricing.annual.feature1")}
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  {t("pricing.annual.feature2")}
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  {t("pricing.annual.feature3")}
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  {t("pricing.annual.feature4")}
                </li>
              </ul>
              <button
                onClick={() => handleSubscribe(annualId)}
                className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 text-sm"
              >
                {t("button.annual.subscribe")}
              </button>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}