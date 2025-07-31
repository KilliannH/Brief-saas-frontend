import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";
import CustomHelmet from "../components/CustomHelmet";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { CheckCircle } from "lucide-react"
import ValidationModal from "../components/ValidationModal";

export default function PublicBrief() {
  const { t } = useTranslation();
  const { uuid } = useParams();
  const [brief, setBrief] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [validated, setValidated] = useState(false);

  useEffect(() => {
    api.get(`/briefs/public/${uuid}`)
      .then(res => {
        setBrief(res.data);
        setValidated(res.data.clientValidated);
      })
      .catch(() => toast.error(t("publicBrief.toast.fetch.error")))
      .finally(() => setLoading(false));
  }, [uuid]);

  const handleValidate = async (code) => {
    try {
      await api.put(`/briefs/public/${uuid}/validate`, { code });
      toast.success(t("publicBrief.toast.submit.success"));
      setValidated(true);
      setShowModal(false);
    } catch (err) {
      toast.error(t("publicBrief.toast.submit.error"));
    }
  };

  if (loading) return <p className="text-center py-10">{t("publicBrief.form.loading")}</p>;
  if (!brief) return <p className="text-center py-10 text-red-500">{t("publicBrief.form.loadingError")}</p>;

  return (
    <>
      {brief && (
        <CustomHelmet
          title={`${brief.clientName} – BriefMate`}
          description={t("brief.public.meta", { client: brief.clientName })}
          path={`/public/briefs/${uuid}`}
        />
      )}
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">{brief.title}</h1>
      <p className="text-gray-700">{brief.description}</p>

      <Info label={t("publicBrief.form.client")}>{brief.clientName}</Info>
      <Info label={t("publicBrief.form.audience")}>{brief.targetAudience}</Info>
      <Info label={t("publicBrief.form.budget")}>{brief.budget}</Info>
      <Info label={t("publicBrief.form.deadline")}>{brief.deadline?.slice(0, 10)}</Info>
      <Info label={t("publicBrief.form.constraints")}>{brief.constraints}</Info>

      <Info label={t("publicBrief.form.objectives")}>
        <ul className="list-disc ml-5">
          {brief.objectives?.map((o, i) => <li key={i}>{o}</li>)}
        </ul>
      </Info>

      <Info label={t("publicBrief.form.deliverables")}>
        <ul className="list-disc ml-5">
          {brief.deliverables?.map((d, i) => <li key={i}>{d}</li>)}
        </ul>
      </Info>

      {validated ? (
        <div className="bg-green-100 text-green-700 p-4 rounded flex items-center gap-2">
          <CheckCircle className="w-5 h-5" />
          <span>{t("publicBrief.form.alreadyValidated")}</span>
        </div>
      ) : (
        <>
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            {t("publicBrief.form.button.submit")}
          </button>

          {showModal && (
            <ValidationModal
              onClose={() => setShowModal(false)}
              onValidate={handleValidate}
            />
          )}
        </>
      )}
    </div>
    </>
  );
}

function Info({ label, children }) {
  return (
    <div>
      <span className="font-medium text-gray-700">{label} :</span>
      <div className="text-gray-800">{children}</div>
    </div>
  );
}
