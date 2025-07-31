import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";
import CustomHelmet from "../components/CustomHelmet";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

export default function EditBrief() {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState(null);

  useEffect(() => {
    api.get(`/briefs/${id}`)
      .then(res => setForm(res.data))
      .catch(() => toast.error(t("edit.toast.fetch.error")));
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleListChange = (field, index, value) => {
    const updated = [...form[field]];
    updated[index] = value;
    setForm({ ...form, [field]: updated });
  };

  const addToList = (field) => {
    setForm({ ...form, [field]: [...form[field], ""] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/briefs/${id}`, form);
      toast.success(t("edit.toast.submit.success"));
      navigate("/dashboard");
    } catch {
      toast.error(t("edit.toast.submit.error"));
    }
  };

  if (!form) return <p className="text-center mt-10">{t("edit.form.loading")}</p>;
  
  return (
    <>
    <CustomHelmet
  title={t("helmet.editBrief.title")}
  description={t("helmet.editBrief.description")}
  path="/briefs/:id/edit"
/>
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">{t("edit.title")}</h1>

      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded shadow">
        <Input label={t("edit.form.title")} name="title" value={form.title} onChange={handleChange} />
        <Textarea label={t("edit.form.description")} name="description" value={form.description} onChange={handleChange} />
        <Textarea label={t("edit.form.audience")} name="targetAudience" value={form.targetAudience} onChange={handleChange} />
        <Input label={t("edit.form.budget")} name="budget" value={form.budget} onChange={handleChange} />
        <Input label={t("edit.form.deadline")} type="date" name="deadline" value={form.deadline?.slice(0, 16)} onChange={handleChange} />
        <Textarea label={t("edit.form.constraints")} name="constraints" value={form.constraints} onChange={handleChange} />
        <Input label={t("edit.form.clientName")} name="clientName" value={form.clientName} onChange={handleChange} />
        <Input label={t("edit.form.clientEmail")} name="clientEmail" value={form.clientEmail} onChange={handleChange} />

        <FieldList field="objectives" label={t("edit.form.objectives")} values={form.objectives} onChange={handleListChange} onAdd={addToList} />
        <FieldList field="deliverables" label={t("edit.form.deliverables")} values={form.deliverables} onChange={handleListChange} onAdd={addToList} />

        <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
          {t("edit.form.button.submit")}
        </button>
      </form>
    </div>
    </>
  );
}

function Input({ label, name, value, onChange, type = "text" }) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1">{label}</label>
      <input
        name={name}
        value={value || ""}
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
        value={value || ""}
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
        {t("edit.form.button.add")}
      </button>
    </div>
  );
}