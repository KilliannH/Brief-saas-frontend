import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";

export default function PublicBrief() {
  const { uuid } = useParams();
  const [brief, setBrief] = useState(null);
  const [code, setCode] = useState("");
  const [validated, setValidated] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get(`/briefs/public/${uuid}`)
      .then(res => setBrief(res.data))
      .catch(err => setError("Brief introuvable."));
  }, [uuid]);

  const handleValidate = async () => {
    try {
      await api.put(`/briefs/public/${uuid}/validate`, { code });
      setValidated(true);
    } catch (err) {
        if (err.response?.status === 403) {
            setError("Code de validation incorrect.");
        } else {
            setError("Erreur lors de la validation.");
        }
    }
  };

  if (error) return <p className="text-red-500 text-center mt-10">{error}</p>;
  if (!brief) return <p className="text-center mt-10">Chargement...</p>;

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

      {brief.clientValidated || validated ? (
        <div className="bg-green-100 text-green-700 p-4 rounded">
          ✅ Ce brief a déjà été validé.
        </div>
      ) : (
        <div className="mt-6 space-y-3 bg-gray-50 p-4 rounded border">
          <label className="block text-sm font-medium">
            Validez ce brief en tant que client :
          </label>
          <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Code de validation"
                className="w-full px-3 py-2 border rounded"
                required
            />
          <button
            onClick={handleValidate}
            className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700"
          >
            Valider ce brief
          </button>
        </div>
      )}
    </div>
  );
}

function Info({ label, children }) {
  return (
    <div>
      <span className="font-semibold text-gray-800">{label} :</span>
      <div className="text-gray-700">{children}</div>
    </div>
  );
}