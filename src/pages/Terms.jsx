import { useTranslation } from "react-i18next";
import CustomHelmet from "../components/CustomHelmet";
import ReactMarkdown from "react-markdown";

export default function Terms() {
  const { t } = useTranslation();

  return (
    <>
      <CustomHelmet
        titleKey="meta.terms.title"
        descriptionKey="meta.terms.description"
        path="/terms"
      />
    <div className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-6">{t("terms.title")}</h1>
      <div className="prose prose-sm sm:prose lg:prose-lg max-w-none">
        <ReactMarkdown>{t("terms.content")}</ReactMarkdown>
      </div>
    </div>
    </>
  );
}