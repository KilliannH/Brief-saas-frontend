import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import CustomHelmet from "../components/CustomHelmet";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

export default function CreateBrief() {
  const { t } = useTranslation();
  const [form, setForm] = useState({
    title: "",
    description: "",
    objectives: [""],
    targetAudience: "",
    budget: "",
    deadline: "",
    deliverables: [""],
    constraints: "",
    clientId: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [clients, setClients] = useState([]);
  const [showClientModal, setShowClientModal] = useState(false);
  const [newClient, setNewClient] = useState({ name: "", email: "" });

  const navigate = useNavigate();

  useEffect(() => {
    api.get("/clients")
      .then((res) => setClients(res.data))
      .catch(() => toast.error(t("create.toast.fetch.error")));
  }, []);


  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleListChange = (field, index, value) => {
    const list = [...form[field]];
    list[index] = value;
    setForm({ ...form, [field]: list });
  };

  const addToList = (field) => {
    setForm({ ...form, [field]: [...form[field], ""] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.post("/briefs", form);
      toast.success(t("create.toast.success"));
      navigate("/dashboard");
    } catch (err) {
      if (err.response?.status === 403) {
        toast.error(t("dashboard.restriction.limitReached"));
      } else {
        toast.error(t("create.toast.error"));
      }
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <CustomHelmet
        title={t("helmet.createBrief.title")}
        description={t("helmet.createBrief.description")}
        path="/briefs/new"
      />
      <div className="max-w-3xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">{t("create.title")}</h1>

        <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded shadow">
          <Input label={t("create.form.title")} name="title" value={form.title} onChange={handleChange} />
          <Textarea label={t("create.form.description")} name="description" value={form.description} onChange={handleChange} />
          <Textarea label={t("create.form.audience")} name="targetAudience" value={form.targetAudience} onChange={handleChange} />
          <Input label={t("create.form.budget")} name="budget" value={form.budget} onChange={handleChange} />
          <Input label={t("create.form.deadline")} name="deadline" type="date" value={form.deadline} onChange={handleChange} />
          <Textarea label={t("create.form.constraints")} name="constraints" value={form.constraints} onChange={handleChange} />
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Client
          </label>
          <select
            value={form.clientId}
            onChange={(e) => setForm({ ...form, clientId: e.target.value })}
            className="w-full border rounded px-3 py-2"
          >
            <option value="">{t("brief.form.selectClient")}</option>
            {clients.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.email})
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={() => setShowClientModal(true)}
            className="text-blue-600 text-sm mt-2"
          >
            + {t("create.button.addClient")}
          </button>

          <FieldList field="objectives" label={t("create.form.objectives")} values={form.objectives} onChange={handleListChange} onAdd={addToList} />
          <FieldList field="deliverables" label={t("create.form.deliverables")} values={form.deliverables} onChange={handleListChange} onAdd={addToList} />

          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 flex items-center justify-center gap-2"
            disabled={isSubmitting}
          >
            {isSubmitting && (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
            )}
            {isSubmitting ? t("create.button.isSubmitting") : t("create.button.submit")}
          </button>
        </form>
      </div>
      {showClientModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-md w-full max-w-sm animate-fadeInScale">
            <h2 className="text-lg font-semibold mb-4">{t("clients.modal.add.title")}</h2>
            <input
              type="text"
              placeholder={t("clients.modal.add.name")}
              value={newClient.name}
              onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
              className="w-full mb-3 px-3 py-2 border rounded"
            />
            <input
              type="email"
              placeholder={t("clients.modal.add.email")}
              value={newClient.email}
              onChange={(e) => setNewClient({ ...newClient, email: e.target.value })}
              className="w-full mb-4 px-3 py-2 border rounded"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowClientModal(false)}
                className="text-sm text-gray-500"
              >
                {t("clients.modal.add.dismiss")}
              </button>
              <button
                onClick={async () => {
                  try {
                    const res = await api.post("/clients", newClient);
                    setClients((prev) => [...prev, res.data]);
                    setForm({ ...form, clientId: res.data.id });
                    toast.success(t("client.create.success"));
                    setNewClient({ name: "", email: "" });
                    setShowClientModal(false);
                  } catch {
                    toast.error(t("client.create.error"));
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
    </>
  );
}

function Input({ label, name, value, onChange, type = "text" }) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1">{label}</label>
      <input
        name={name}
        value={value}
        onChange={onChange}
        type={type}
        className="w-full px-3 py-2 border rounded"
        required
      />
    </div>
  );
}

function Textarea({ label, name, value, onChange }) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1">{label}</label>
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        rows="3"
        className="w-full px-3 py-2 border rounded"
        required
      />
    </div>
  );
}

function FieldList({ field, label, values, onChange, onAdd }) {
  const { t } = useTranslation();
  return (
    <div>
      <label className="block text-sm font-medium mb-1">{label}</label>
      {values.map((val, idx) => (
        <input
          key={idx}
          value={val}
          onChange={(e) => onChange(field, idx, e.target.value)}
          className="w-full mb-2 px-3 py-2 border rounded"
          required
        />
      ))}
      <button
        type="button"
        onClick={() => onAdd(field)}
        className="text-blue-600 text-sm mt-1"
      >
        {t("create.form.button.add")}
      </button>
    </div>
  );
}