import { useEffect, useState } from "react";
import api from "../services/api";
import { useAuth } from "../services/auth";
import { useNavigate, Link } from "react-router-dom";
import { Edit, Trash2, Plus, Download, Send } from "lucide-react";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import Loader from "../components/Loader";
import { CheckCircle, XCircle } from "lucide-react";

export default function Dashboard() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [briefs, setBriefs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/briefs")
      .then(res => setBriefs(res.data))
      .catch(err => {
        console.error(err);
        toast.error(t("dashboard.toast.fetchError"));
      })
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    try {
      await api.delete(`/briefs/${id}`);
      setBriefs(prev => prev.filter((b) => b.id !== id));
    } catch (err) {
      console.error("Erreur suppression :", err);
      toast.error(t("dashboard.toast.error"));
    }
  };

  const updateBrief = (updatedBrief) => {
    setBriefs((prev) =>
      prev.map((b) => (b.id === updatedBrief.id ? updatedBrief : b))
    );
  };

  if (loading) return <Loader />;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{t("dashboard.title")}</h1>

        {/* Restriction : 1 brief max pour comptes gratuits */}
        {!user?.subscriptionActive && briefs.length >= 1 ? (
          <div className="flex items-center gap-2">
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
          </div>
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

      {briefs.length === 0 ? (
        <p className="text-gray-600">{t("dashboard.noBrief")}</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {briefs.map((brief) => (
            <BriefCard key={brief.id} brief={brief} onDelete={handleDelete} onUpdate={updateBrief} />
          ))}
        </div>
      )}
    </div>
  );
}

function BriefCard({ brief, onDelete, onUpdate }) {
  const { user } = useAuth();
  const [showConfirm, setShowConfirm] = useState(false);
  const { t } = useTranslation();
  const navigate = useNavigate();

  const generatePdf = (brief) => {
    // Todo
  };

  return (
    <div id={`brief-${brief.id}`} className="bg-white shadow-md rounded-lg p-4 space-y-2 relative">
      <div className="absolute top-2 right-2 flex gap-2">
        {user?.subscriptionActive ? (
          <button
            onClick={() => generatePdf(brief)}
            className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
            title={t("briefcard.buttonDownload.title")}
          >
            <Download size={18} />
          </button>
        ) : (
          <button
            onClick={() => toast.info(t("dashboard.restriction.pdf"))}
            className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
            title={t("briefcard.buttonDownload.title")}
          >
            <Download size={18} />
          </button>
        )}
        {brief.clientValidated ? (
          <span
            className="text-gray-400 cursor-not-allowed"
            title={t("briefcard.buttonEditBlocked.title")}
          >
            <Edit size={18} />
          </span>
        ) : (
          <button
            onClick={() => {
              if (brief.status !== "DRAFT") {
                setShowConfirm(true);
              } else {
                // Le brief est déjà en brouillon, on redirige directement
                navigate(`/briefs/${brief.id}/edit`);
              }
            }}
            className="text-blue-600 hover:text-blue-800"
            title={t("briefcard.buttonEdit.title")}
          >
            <Edit size={18} />
          </button>
        )}

        <button
          onClick={() => {
            if (window.confirm(t("dashboard.modal.delete"))) {
              onDelete(brief.id);
              toast.success(t("dashboard.toast.delete"));
            }
          }}
          className="text-red-600 hover:text-red-800"
          title={t("briefcard.buttonDelete.title")}
        >
          <Trash2 size={18} />
        </button>
      </div>


      <h2 className="text-xl font-semibold">{brief.title}</h2>
      <p className="text-sm text-gray-600">{brief.description}</p>

      <Field label={t("briefcard.clientField.label")}>{brief.clientName}</Field>
      <Field label={t("briefcard.budgetField.label")}>{brief.budget}</Field>
      <Field label={t("briefcard.deadlineField.label")}>{brief.deadline?.slice(0, 10)}</Field>
      <Field label={t("briefcard.audienceField.label")}>{brief.targetAudience}</Field>

      <Field label={t("briefcard.objectivesField.label")}>
        <ul className="list-disc ml-5">
          {brief.objectives?.map((o, i) => <li key={i}>{o}</li>)}
        </ul>
      </Field>

      <Field label={t("briefcard.deliverablesField.label")}>
        <ul className="list-disc ml-5">
          {brief.deliverables?.map((d, i) => <li key={i}>{d}</li>)}
        </ul>
      </Field>

      <Field label={t("briefcard.constraintsField.label")}>{brief.constraints}</Field>

      <div className="text-sm text-gray-500 flex flex-col gap-1">
        <div>
          <div>
            {t("briefcard.status")} : <strong>{t(`briefcard.status.${brief.status}`)}</strong>
          </div>

          {brief.status === "DRAFT" && (
            <button
              onClick={async () => {
                try {
                  const res = await api.post(`/briefs/${brief.id}/submit`);
                  toast.success(t("dashboard.toast.submitted"));

                  // mettre à jour le brief localement
                  onUpdate(res.data);
                } catch (err) {
                  console.error(err);
                  toast.error(t("dashboard.toast.submitError"));
                }
              }}
              className="flex items-center gap-1 text-blue-600 hover:underline text-sm mt-1"
            >
              <Send className="w-4 h-4" />
              {t("briefcard.sendToClient")}
            </button>
          )}
        </div>

        <div className="flex items-center gap-1">
          {t("briefcard.clientValidation")} :{" "}
          {brief.clientValidated ? (
            <span className="flex items-center text-green-600">
              <CheckCircle className="w-4 h-4 mr-1" />
              {t("briefcard.clientValidation.validate")}
            </span>
          ) : (
            <span className="flex items-center text-red-600">
              <XCircle className="w-4 h-4 mr-1" />
              {t("briefcard.clientValidation.unvalidate")}
            </span>
          )}
        </div>
      </div>

      <a
        href={`/public/briefs/${brief.publicUuid}`}
        className="text-blue-600 underline text-sm"
        target="_blank"
        rel="noopener noreferrer"
      >
        {t("briefcard.clientLink")}
      </a>
      {showConfirm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          {/* Modale animée */}
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md animate-fadeInScale">
            <p className="text-sm text-gray-700 mb-6">
              {t("briefcard.edit.confirm")}
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-3 py-1 text-sm border rounded hover:bg-gray-100 text-gray-700"
              >
                {t("cancel")}
              </button>
              <button
                onClick={async () => {
                  try {
                    const res = await api.patch(`/briefs/${brief.id}`, {
                      status: "DRAFT",
                    });
                    toast.success(t("briefcard.toast.setToDraft"));
                    onUpdate(res.data);
                    navigate(`/briefs/${brief.id}/edit`);
                  } catch (err) {
                    console.error(err);
                    toast.error(t("briefcard.toast.setToDraftError"));
                  }
                }}
                className="px-4 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                {t("confirm")}
              </button>
            </div>
          </div>
        </div>)}
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <span className="text-sm font-medium text-gray-700">{label} :</span>
      <div className="text-sm text-gray-800">{children}</div>
    </div>
  );
}