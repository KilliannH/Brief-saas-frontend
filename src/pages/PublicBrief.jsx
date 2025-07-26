import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";
import { toast } from "react-toastify";
import ValidationModal from "../components/ValidationModal";

export default function PublicBrief() {
  const { uuid } = useParams(); // public UUID
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
      .catch(() => toast.error("Brief introuvable"))
      .finally(() => setLoading(false));
  }, [uuid]);

  const handleValidate = async (code) => {
    try {
      await api.put(`/briefs/public/${uuid}/validate`, { code });
      toast.success("Brief validé avec succès !");
      setValidated(true);
      setShowModal(false);
    } catch (err) {
      toast.error("Code invalide ou erreur lors de la validation.");
    }
  };

  if (loading) return <p className="text-center py-10">Chargement du brief...</p>;
  if (!brief) return <p className="text-center py-10 text-red-500">Brief introuvable.</p>;

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">{brief.title}</h1>
      <p className="text-gray-700">{brief.description}</p>

      <Info label="Client">{brief.clientName}</Info>
      <Info label="Audience cible">{brief.targetAudience}</Info>
      <Info label="Budget">{brief.budget}</Info>
      <Info label="Deadline">{brief.deadline?.slice(0, 10)}</Info>
      <Info label="Contraintes">{brief.constraints}</Info>

      <Info label="Objectifs">
        <ul className="list-disc ml-5">
          {brief.objectives?.map((o, i) => <li key={i}>{o}</li>)}
        </ul>
      </Info>

      <Info label="Livrables attendus">
        <ul className="list-disc ml-5">
          {brief.deliverables?.map((d, i) => <li key={i}>{d}</li>)}
        </ul>
      </Info>

      {validated ? (
        <div className="bg-green-100 text-green-700 p-4 rounded">
          ✅ Ce brief a déjà été validé.
        </div>
      ) : (
        <>
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Valider le brief
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
