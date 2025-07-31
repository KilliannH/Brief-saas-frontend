import { useTranslation } from "react-i18next";
import CustomHelmet from "../components/CustomHelmet";
import ReactMarkdown from "react-markdown";

export default function Legal() {
  const { t } = useTranslation();

  return (
    <>
    <CustomHelmet
        titleKey="meta.legal.title"
        descriptionKey="meta.legal.description"
        path="/legal"
      />
    <div className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-6">{t("legal.title")}</h1>
      <div className="prose prose-sm sm:prose lg:prose-lg max-w-none">
        <ReactMarkdown>{t("legal.content")}</ReactMarkdown>
      </div>
    </div>
    </>
  );
}