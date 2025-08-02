import BriefCard from "./BriefCard";
import { useTranslation } from "react-i18next";

export default function BriefCardContainer({ briefs, onDelete, onUpdate }) {
  const { t } = useTranslation();

  if (briefs.length === 0) {
    return <p className="text-gray-600">{t("dashboard.noBrief")}</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {briefs.map((brief) => (
        <BriefCard
          key={brief.id}
          brief={brief}
          onDelete={onDelete}
          onUpdate={onUpdate}
        />
      ))}
    </div>
  );
}