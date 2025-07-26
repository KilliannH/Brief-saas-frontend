export default function Landing() {
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

      {/* Pricing */}
      <section className="px-6 py-20 text-center max-w-2xl mx-auto">
        <h2 className="text-3xl font-bold mb-6">Tarification</h2>
        <p className="mb-6 text-gray-600">Sans engagement. Une seule formule claire :</p>
        <div className="border rounded-lg p-6 shadow-md bg-white inline-block">
          <p className="text-2xl font-semibold">7,99 €/mois</p>
          <p className="text-gray-500 mb-2">ou 60 €/an</p>
          <ul className="text-left text-sm text-gray-700 mb-4">
            <li>✅ Briefs illimités</li>
            <li>✅ Pages de validation client</li>
            <li>✅ Envoi automatique par mail</li>
          </ul>
          <a
            href="/login"
            className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700"
          >
            Démarrer maintenant
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center py-6 text-gray-500 text-sm">
        © {new Date().getFullYear()} BriefMate — Made with ☕ by Killiann
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