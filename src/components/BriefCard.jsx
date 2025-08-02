import { useState } from "react";
import { useAuth } from "../services/auth";
import { useTranslation } from "react-i18next";
import { Edit, Trash2, Download, Send, CheckCircle, XCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function BriefCard({ brief, onDelete, onUpdate }) {
  const { user } = useAuth();
  const [showConfirm, setShowConfirm] = useState(false);
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const generatePdf = async (brief) => {
    const toastId = toast.loading(t("pdf.toast.loading")); // "Génération du PDF..."

    try {
      const res = await api.get(`/briefs/${brief.id}/pdf`, {
        responseType: "blob",
        headers: {
          "Accept-Language": i18n.language,
        },
      });

      const blob = new Blob([res.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `brief.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      toast.update(toastId, {
        render: t("pdf.toast.success"), // "PDF téléchargé avec succès"
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });
    } catch (err) {
      console.error("Erreur génération PDF :", err);
      toast.update(toastId, {
        render: t("pdf.toast.error"), // "Impossible de générer le PDF"
        type: "error",
        isLoading: false,
        autoClose: 4000,
      });
    }
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

      <Field label={t("briefcard.clientField.label")}>{brief.client?.name}</Field>
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
                const loadingToast = toast.loading(t("dashboard.toast.sending"));
                try {
                  const res = await api.post(`/briefs/${brief.id}/submit`);
                  toast.update(loadingToast, {
                    render: t("dashboard.toast.submitted"),
                    type: "success",
                    isLoading: false,
                    autoClose: 3000,
                  });
                  onUpdate(res.data); // mise à jour locale
                } catch (err) {
                  console.error(err);
                  toast.update(loadingToast, {
                    render: t("dashboard.toast.submitError"),
                    type: "error",
                    isLoading: false,
                    autoClose: 3000,
                  });
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