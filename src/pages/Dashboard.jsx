import { useEffect, useState } from "react";
import api from "../services/api";

export default function Dashboard({ onLogout }) {
  const [briefs, setBriefs] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Charger les briefs au montage
  useEffect(() => {
    api.get("/briefs")
      .then((res) => setBriefs(res.data))
      .catch((err) => {
        console.error(err);
        setError("Impossible de charger les briefs.");
      })
      .finally(() => setLoading(false));
  }, []);

  const handleAddBrief = async (e) => {
    e.preventDefault();
    if (!title || !description) return;

    try {
      const res = await api.post("/briefs", { title, description });
      setBriefs([res.data, ...briefs]);
      setTitle("");
      setDescription("");
    } catch (err) {
      console.error(err);
      setError("Erreur lors de la création du brief.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    onLogout?.();
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Mon dashboard</h1>
        <button
          onClick={handleLogout}
          className="text-sm text-red-600 underline"
        >
          Déconnexion
        </button>
      </div>

      {loading ? (
        <p>Chargement...</p>
      ) : (
        <>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          {briefs.length === 0 ? (
            <p>Aucun brief pour l’instant.</p>
          ) : (
            <ul className="space-y-4">
              {briefs.map((brief) => (
                <li key={brief.id} className="bg-white p-4 rounded shadow">
                  <h3 className="text-lg font-semibold">{brief.title}</h3>
                  <p className="text-sm text-gray-600">{brief.description}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    Statut : {brief.status}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
}