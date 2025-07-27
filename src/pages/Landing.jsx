import { useAuth } from "../services/auth";
import api from "../services/api";
import { toast } from "react-toastify";

const monthlyId = import.meta.env.VITE_STRIPE_PRICE_MONTHLY;
const annualId = import.meta.env.VITE_STRIPE_PRICE_ANNUAL;

export default function Landing() {

  const { isAuthenticated } = useAuth();

  const handleSubscribe = async (priceId) => {
    try {
      const res = await api.post("/stripe/checkout", { priceId });
      window.location.href = res.data.url;
    } catch (err) {
      console.error(err);
      toast.error("Erreur de redirection vers Stripe");
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-800">
      {/* Hero */}
      <section className="px-6 py-24 text-center max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">Simplifiez vos briefs freelance avec BriefMate</h1>
        <p className="text-lg text-gray-600 mb-6">
          Créez, partagez et faites valider vos briefs en quelques minutes. Professionnel, rapide et sécurisé.
        </p>
        <a
          href="/login"
          className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700"
        >
          Créer un brief maintenant
        </a>
      </section>

      {/* Features */}
      <section className="px-6 py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-8 text-center">
          <Feature icon="📝" title="Briefs clairs">
            Titre, objectifs, budget, contraintes… le client ne peut rien oublier.
          </Feature>
          <Feature icon="🔗" title="Partage simplifié">
            Un simple lien + un code sécurisé pour valider.
          </Feature>
          <Feature icon="✅" title="Validation client">
            Le client valide officiellement sans créer de compte.
          </Feature>
        </div>
      </section>

      {/* Tarification */}
      <section className="px-6 py-20 text-center max-w-2xl mx-auto">
        <h2 className="text-3xl font-bold mb-6">Tarification</h2>
        <p className="mb-6 text-gray-600">Sans engagement. Deux formules :</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Mensuel */}
          <div className="border rounded-lg p-6 shadow-md bg-white">
            <p className="text-2xl font-semibold">7,99 €/mois</p>
            <ul className="text-left text-sm text-gray-700 my-4">
              <li>✅ Briefs illimités</li>
              <li>✅ Pages de validation client</li>
              <li>✅ Envoi automatique par mail</li>
            </ul>
            {isAuthenticated ? (
              <button
                onClick={() => handleSubscribe(monthlyId)} // remplace par ton vrai ID
                className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700"
              >
                S’abonner
              </button>
            ) : (
              <a
                href="/login"
                className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700"
              >
                Se connecter pour s’abonner
              </a>
            )}
          </div>

          {/* Annuel */}
          <div className="border rounded-lg p-6 shadow-md bg-white">
            <p className="text-2xl font-semibold">60 €/an</p>
            <p className="text-sm text-gray-500">Économisez 37%</p>
            <ul className="text-left text-sm text-gray-700 my-4">
              <li>✅ Briefs illimités</li>
              <li>✅ Pages de validation client</li>
              <li>✅ Envoi automatique par mail</li>
              <li>✅ Support prioritaire</li>
            </ul>
            {isAuthenticated ? (
              <button
                onClick={() => handleSubscribe(annualId)} // remplace par ton vrai ID
                className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700"
              >
                Choisir l’annuel
              </button>
            ) : (
              <a
                href="/login"
                className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700"
              >
                Se connecter pour s’abonner
              </a>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center py-6 text-gray-500 text-sm">
        © {new Date().getFullYear()} BriefMate — Made with ☕ by Killiann H.
      </footer>
    </div>
  );
}

function Feature({ icon, title, children }) {
  return (
    <div>
      <div className="text-4xl mb-2">{icon}</div>
      <h3 className="font-semibold text-lg mb-1">{title}</h3>
      <p className="text-sm text-gray-600">{children}</p>
    </div>
  );
}