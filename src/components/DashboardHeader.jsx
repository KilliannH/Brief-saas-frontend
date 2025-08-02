import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function DashboardHeader({
  filter,
  onFilterChange,
  isFreeLimited,
  totalPages,
  currentPage,
  onPageChange,
}) {
  const { t } = useTranslation();

  return (
    <div className="mb-6 space-y-4">
      {/* Ligne 1 : titre + filtre + bouton */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Titre + filtre */}
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold">{t("dashboard.title")}</h1>

          <select
            value={filter}
            onChange={(e) => onFilterChange(e.target.value)}
            className="border px-3 py-1 rounded text-sm"
          >
            <option value="ALL">{t("dashboard.filter.all")}</option>
            <option value="DRAFT">{t("dashboard.filter.draft")}</option>
            <option value="SUBMITTED">{t("dashboard.filter.submitted")}</option>
            <option value="VALIDATED">{t("dashboard.filter.validated")}</option>
          </select>
        </div>

        {/* Bouton nouveau brief */}
        <div className="flex flex-col md:flex-row items-start md:items-center gap-2">
          {isFreeLimited ? (
            <>
              <button
                disabled
                className="bg-gray-300 text-white px-4 py-2 rounded text-sm cursor-not-allowed flex items-center gap-2"
                title={t("dashboard.restriction.freePlan")}
              >
                <Plus size={16} />
                {t("button.new")}
              </button>
              <span className="text-sm text-gray-500">
                {t("dashboard.restriction.limitReached")}
              </span>
              <Link
                to="/account"
                className="text-blue-600 text-sm underline hover:text-blue-800"
              >
                {t("dashboard.restriction.upgradeLink")}
              </Link>
            </>
          ) : (
            <Link
              to="/briefs/new"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm flex items-center gap-2"
            >
              <Plus size={16} />
              {t("button.new")}
            </Link>
          )}
        </div>
      </div>

      {/* Ligne 2 : pagination centrée */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-2 space-x-2">
          <button
            onClick={() => onPageChange(Math.max(currentPage - 1, 0))}
            disabled={currentPage === 0}
            className="px-3 py-1 rounded bg-gray-200 text-gray-700 disabled:opacity-50"
          >
            {t("pagination.previous")}
          </button>

          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => onPageChange(i)}
              className={`px-3 py-1 rounded ${i === currentPage
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700"
              }`}
            >
              {i + 1}
            </button>
          ))}

          <button
            onClick={() => onPageChange(Math.min(currentPage + 1, totalPages - 1))}
            disabled={currentPage === totalPages - 1}
            className="px-3 py-1 rounded bg-gray-200 text-gray-700 disabled:opacity-50"
          >
            {t("pagination.next")}
          </button>
        </div>
      )}
    </div>
  );
}
