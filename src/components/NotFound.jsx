import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import CustomHelmet from "../components/CustomHelmet";
import notFoundImg from "../assets/404_illustration.png";

export default function NotFound() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center p-6"
        style={{ backgroundColor: "rgb(243, 243, 244)" }}>
      <CustomHelmet
        titleKey="helmet.404.title"
        descriptionKey="helmet.404.description"
        path="/404"
      />
      <img
        src={notFoundImg}
        alt="404 illustration"
        className="max-w-xs mb-8"
      />
      <h1 className="text-3xl font-bold mb-2">{t("notfound.title")}</h1>
      <p className="text-gray-600 mb-6">{t("notfound.description")}</p>
      <Link
        to="/"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm"
      >
        {t("notfound.back")}
      </Link>
    </div>
  );
}