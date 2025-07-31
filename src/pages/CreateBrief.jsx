import { useState } from "react";
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
    clientName: "",
    clientEmail: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

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
          <Input label={t("create.form.clientName")} name="clientName" value={form.clientName} onChange={handleChange} />
          <Input label={t("create.form.clientEmail")} name="clientEmail" value={form.clientEmail} onChange={handleChange} />

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