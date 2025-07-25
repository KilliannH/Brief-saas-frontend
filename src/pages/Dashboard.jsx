import { useEffect, useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import { Edit, Trash2 } from "lucide-react";

export default function Dashboard() {
  const [briefs, setBriefs] = useState([]);

  useEffect(() => {
    api.get("/briefs")
      .then(res => setBriefs(res.data))
      .catch(err => console.error(err));
  }, []);

  const handleDelete = async (id) => {
  try {
    await api.delete(`/briefs/${id}`);
    setBriefs(briefs.filter((b) => b.id !== id)); // mise à jour locale
  } catch (err) {
    console.error("Erreur suppression :", err);
    alert("Erreur lors de la suppression.");
  }
};

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Mes briefs</h1>

      {briefs.length === 0 ? (
        <p className="text-gray-600">Aucun brief pour le moment.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {briefs.map((brief) => (
            <BriefCard key={brief.id} brief={brief} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  );
}

function BriefCard({ brief, onDelete }) {
  const navigate = useNavigate();
  return (
    <div className="bg-white shadow-md rounded-lg p-4 space-y-2 relative">
      <div className="absolute top-2 right-2 flex gap-2">
        <button
          onClick={() => navigate(`/briefs/${brief.id}/edit`)}
          className="text-blue-600 hover:text-blue-800"
          title="Modifier"
        >
          <Edit size={18} />
        </button>

        <button
          onClick={() => {
            if (window.confirm("Confirmer la suppression ?")) {
              onDelete(brief.id);
            }
          }}
          className="text-red-600 hover:text-red-800"
          title="Supprimer"
        >
          <Trash2 size={18} />
        </button>
      </div>


      <h2 className="text-xl font-semibold">{brief.title}</h2>
      <p className="text-sm text-gray-600">{brief.description}</p>

      <Field label="Client">{brief.clientName}</Field>
      <Field label="Budget">{brief.budget}</Field>
      <Field label="Deadline">{brief.deadline?.slice(0, 10)}</Field>
      <Field label="Audience">{brief.targetAudience}</Field>

      <Field label="Objectifs">
        <ul className="list-disc ml-5">
          {brief.objectives?.map((o, i) => <li key={i}>{o}</li>)}
        </ul>
      </Field>

      <Field label="Livrables">
        <ul className="list-disc ml-5">
          {brief.deliverables?.map((d, i) => <li key={i}>{d}</li>)}
        </ul>
      </Field>

      <Field label="Contraintes">{brief.constraints}</Field>

      <div className="text-sm text-gray-500">
        Statut : <strong>{brief.status}</strong> <br />
        Validation client :{" "}
        {brief.clientValidated ? (
          <span className="text-green-600">✅ Validé</span>
        ) : (
          <span className="text-red-600">⛔ Non validé</span>
        )}
      </div>

      <a
        href={`/public/briefs/${brief.publicUuid}`}
        className="text-blue-600 underline text-sm"
        target="_blank"
        rel="noreferrer"
      >
        Voir la version client
      </a>
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