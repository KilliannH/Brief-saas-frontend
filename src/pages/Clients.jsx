import { useEffect, useState } from "react";
import api from "../services/api";
import { Plus, Trash2, Edit } from "lucide-react";
import Loader from "../components/Loader";
import { toast } from "react-toastify";
import CustomHelmet from "../components/CustomHelmet";
import { useTranslation } from "react-i18next";

export default function Clients() {
    const { t } = useTranslation();
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState({ name: "", email: "" });
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingClient, setEditingClient] = useState(null);
    const MAX_CLIENTS_FREE = 1;
    const hasReachedLimit = clients.length >= MAX_CLIENTS_FREE;

    const fetchClients = async () => {
        try {
            const res = await api.get("/clients");
            setClients(res.data);
        } catch (err) {
            console.error(err);
            toast.error(t("clients.fetch.error"));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchClients();
    }, []);

    const deleteClient = async (id) => {
        if (!window.confirm(t("clients.modal.delete.title"))) return;
        try {
            await api.delete(`/clients/${id}`);
            setClients(prev => prev.filter(c => c.id !== id));
            toast.success(t("client.delete.success"));
        } catch (err) {
            console.error(err);
            toast.error(t("client.delete.error"));
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post("/clients", form);
            setClients(prev => [...prev, res.data]);
            toast.success(t("client.create.success"));
            setShowModal(false);
            setForm({ name: "", email: "" });
        } catch (err) {
            if (err.response?.status === 403) {
                toast.error(t("client.restriction.clientLimitReached"));
            } else {
                toast.error(t("client.create.error"));
            }
        }
    };

    if (loading) {
        return (
            <main className="flex flex-col min-h-screen">
                <div className="flex-grow p-6 max-w-5xl mx-auto w-full">
                    <Loader />
                </div>;
            </main>
        );
    }

    return (
        <>
            <CustomHelmet
                titleKey="meta.clients.title"
                descriptionKey="meta.clients.description"
                path="/clients"
            />
            <main className="flex flex-col min-h-screen">
                <div className="flex-grow p-6 max-w-5xl mx-auto w-full">
                    <div className="p-6 max-w-3xl mx-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h1 className="text-2xl font-bold">{t("clients.title")}</h1>
                            <button
                                onClick={() => !hasReachedLimit && setShowModal(true)}
                                className={`px-3 py-1 rounded flex items-center gap-2 ${hasReachedLimit
                                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                    : "bg-blue-600 text-white hover:bg-blue-700"
                                    }`}
                                disabled={hasReachedLimit}
                                title={hasReachedLimit ? t("clients.restriction.clientLimitReached") : ""}
                            >
                                <Plus size={16} />
                                {t("clients.add")}
                            </button>
                        </div>

                        {(
                            <>
                                {clients.length === 0 ? (
                                    <p>{t("clients.noClient")}</p>
                                ) : (
                                    <ul className="divide-y">
                                        {clients.map((client) => (
                                            <li key={client.id} className="flex justify-between items-center py-3">
                                                <div>
                                                    <p className="font-medium">{client.name}</p>
                                                    <p className="text-sm text-gray-600">{client.email}</p>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => {
                                                            setEditingClient(client);
                                                            setShowEditModal(true);
                                                        }}
                                                        className="text-blue-600 hover:text-blue-800 p-1 rounded transition-colors"
                                                        title={t("clients.edit")}
                                                    >
                                                        <Edit size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => deleteClient(client.id)}
                                                        className="text-red-600 hover:text-red-800 p-1 rounded transition-colors"
                                                        title={t("clients.delete")}
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </>
                        )}

                        {showModal && (
                            <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                                <div className="bg-white rounded-lg p-6 w-full max-w-sm shadow-lg animate-fadeInScale">
                                    <h2 className="text-lg font-bold mb-4">{t("clients.modal.add.title")}</h2>
                                    <form onSubmit={handleCreate} className="space-y-4">
                                        <input
                                            type="text"
                                            placeholder={t("clients.modal.add.name")}
                                            value={form.name}
                                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                                            className="w-full border px-3 py-2 rounded"
                                            required
                                        />
                                        <input
                                            type="email"
                                            placeholder={t("clients.modal.add.email")}
                                            value={form.email}
                                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                                            className="w-full border px-3 py-2 rounded"
                                            required
                                        />
                                        <div className="flex justify-end gap-3">
                                            <button
                                                type="button"
                                                onClick={() => setShowModal(false)}
                                                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                                            >
                                                {t("clients.modal.add.dismiss")}
                                            </button>
                                            <button
                                                type="submit"
                                                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                            >
                                                {t("clients.modal.add.ok")}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        )}

                        {showEditModal && editingClient && (
                            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                                <div className="bg-white p-6 rounded shadow-md w-full max-w-sm animate-fadeInScale">
                                    <h2 className="text-lg font-semibold mb-4">{t("clients.modal.edit.title") || "Modifier le client"}</h2>
                                    <input
                                        type="text"
                                        value={editingClient.name}
                                        onChange={(e) =>
                                            setEditingClient({ ...editingClient, name: e.target.value })
                                        }
                                        placeholder={t("clients.modal.add.name")}
                                        className="w-full mb-3 px-3 py-2 border rounded"
                                    />
                                    <input
                                        type="email"
                                        value={editingClient.email}
                                        onChange={(e) =>
                                            setEditingClient({ ...editingClient, email: e.target.value })
                                        }
                                        placeholder={t("clients.modal.add.email")}
                                        className="w-full mb-4 px-3 py-2 border rounded"
                                    />
                                    <div className="flex justify-end gap-2">
                                        <button
                                            onClick={() => setShowEditModal(false)}
                                            className="text-sm text-gray-500"
                                        >
                                            {t("clients.modal.add.dismiss")}
                                        </button>
                                        <button
                                            onClick={async () => {
                                                try {
                                                    const res = await api.put(`/clients/${editingClient.id}`, editingClient);
                                                    setClients((prev) =>
                                                        prev.map((c) => (c.id === res.data.id ? res.data : c))
                                                    );
                                                    toast.success(t("client.edit.success") || "Client modifié !");
                                                    setShowEditModal(false);
                                                    setEditingClient(null);
                                                } catch {
                                                    toast.error(t("client.edit.error") || "Erreur lors de la modification");
                                                }
                                            }}
                                            className="bg-blue-600 text-white px-4 py-1 rounded text-sm hover:bg-blue-700"
                                        >
                                            {t("clients.modal.add.ok")}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </>
    );
}