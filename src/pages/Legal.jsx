import { useTranslation } from "react-i18next";
import ReactMarkdown from "react-markdown";

export default function Legal() {
  const { t } = useTranslation();

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-6">{t("legal.title")}</h1>
      <div className="prose prose-sm sm:prose lg:prose-lg max-w-none">
        <ReactMarkdown>{t("legal.content")}</ReactMarkdown>
      </div>
    </div>
  );
}