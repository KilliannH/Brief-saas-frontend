import { useState, useEffect } from "react";
import api from "../services/api";
import { useAuth } from "../services/auth";
import { toast } from "react-toastify";

export default function Account() {
  const { user, token } = useAuth();
  const [form, setForm] = useState({
    firstname: "",
    lastname: "",
    profileImage: "",
  });

  useEffect(() => {
    if (user) {
      setForm({
        firstname: user.firstname || "",
        lastname: user.lastname || "",
        profileImage: user.profileImage || "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put("/me", form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Profil mis à jour !");
    } catch (err) {
      console.error(err);
      toast.error("Erreur lors de la mise à jour.");
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Mon profil</h1>

      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 shadow rounded">
        <div>
          <label className="block text-sm font-medium mb-1">Prénom</label>
          <input
            name="firstname"
            type="text"
            className="w-full px-3 py-2 border rounded-md"
            value={form.firstname}
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Nom</label>
          <input
            name="lastname"
            type="text"
            className="w-full px-3 py-2 border rounded-md"
            value={form.lastname}
            onChange={handleChange}
          />
        </div>

        <div className="flex items-center gap-4">
  <div className="relative group">
    <img
      src={
        form.profileImage ||
        "https://ui-avatars.com/api/?name=" +
          encodeURIComponent(`${form.firstname} ${form.lastname}`) +
          "&background=ddd&color=333"
      }
      alt="Avatar"
      className="w-20 h-20 rounded-full object-cover border border-gray-300"
    />
    <label
      htmlFor="profileImage"
      className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 text-white text-xs rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition"
    >
      Modifier
    </label>
  </div>

  <input
    id="profileImage"
    name="profileImage"
    type="text"
    placeholder="Coller une URL d’image ici"
    className="flex-1 px-3 py-2 border rounded-md"
    value={form.profileImage}
    onChange={handleChange}
  />
</div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Enregistrer les modifications
        </button>
      </form>
    </div>
  );
}