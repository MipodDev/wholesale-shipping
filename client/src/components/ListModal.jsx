import { useEffect, useState } from "react";
import { FiTrash, FiX, FiSave } from "react-icons/fi";

const emptyList = {
  id: null,
  name: "",
  category: "",
  skus: [],
  include: [],
  exclude: [],
};

const ruleKeys = ["category", "tag", "flavor"];

const ListModal = ({ list, onClose, onSave, onDelete }) => {
  const [form, setForm] = useState(list || emptyList);
  const [hasChanges, setHasChanges] = useState(false);
  const isNew = !form?.id;

  useEffect(() => {
    setForm(list || emptyList);
  }, [list]);

  const updateField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const updateRule = (type, idx, field, value) => {
    const updated = [...form[type]];
    updated[idx][field] = value;
    updateField(type, updated);
  };

  const addRule = (type) => {
    updateField(type, [...form[type], { key: "category", value: "" }]);
  };

  const removeRule = (type, idx) => {
    const updated = [...form[type]];
    updated.splice(idx, 1);
    updateField(type, updated);
  };

  const handleSave = () => {
    onSave(form, isNew);
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-zinc-900 text-white rounded-lg shadow-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6 space-y-6">
        <div className="flex justify-between items-center border-b border-zinc-700 pb-3">
          <h2 className="text-xl font-bold">
            {isNew ? "New Product List" : `Edit: ${form.name}`}
          </h2>
          <button onClick={onClose} className="text-white hover:text-red-500">
            <FiX size={20} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Name"
            className="bg-zinc-800 p-2 rounded"
            value={form.name}
            onChange={(e) => updateField("name", e.target.value)}
          />
          <input
            type="text"
            placeholder="Category"
            className="bg-zinc-800 p-2 rounded"
            value={form.category}
            onChange={(e) => updateField("category", e.target.value)}
          />
        </div>

        <div>
          <label className="text-sm font-semibold">Inclusion Rules</label>
          <table className="w-full text-sm mt-2">
            <thead>
              <tr>
                <th className="text-left">Key</th>
                <th className="text-left">Value</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {form.include.map((rule, idx) => (
                <tr key={idx}>
                  <td>
                    <select
                      className="bg-zinc-800 p-1 rounded"
                      value={rule.key}
                      onChange={(e) => updateRule("include", idx, "key", e.target.value)}
                    >
                      {ruleKeys.map((key) => (
                        <option key={key} value={key}>
                          {key}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <input
                      type="text"
                      className="bg-zinc-800 p-1 rounded w-full"
                      value={rule.value}
                      onChange={(e) => updateRule("include", idx, "value", e.target.value)}
                    />
                  </td>
                  <td>
                    <button onClick={() => removeRule("include", idx)} className="text-red-400">
                      <FiTrash />
                    </button>
                  </td>
                </tr>
              ))}
              <tr>
                <td colSpan="3">
                  <button onClick={() => addRule("include")} className="text-blue-400 mt-2">
                    ➕ Add Include Rule
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div>
          <label className="text-sm font-semibold">Exclusion Rules</label>
          <table className="w-full text-sm mt-2">
            <thead>
              <tr>
                <th className="text-left">Key</th>
                <th className="text-left">Value</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {form.exclude.map((rule, idx) => (
                <tr key={idx}>
                  <td>
                    <select
                      className="bg-zinc-800 p-1 rounded"
                      value={rule.key}
                      onChange={(e) => updateRule("exclude", idx, "key", e.target.value)}
                    >
                      {ruleKeys.map((key) => (
                        <option key={key} value={key}>
                          {key}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <input
                      type="text"
                      className="bg-zinc-800 p-1 rounded w-full"
                      value={rule.value}
                      onChange={(e) => updateRule("exclude", idx, "value", e.target.value)}
                    />
                  </td>
                  <td>
                    <button onClick={() => removeRule("exclude", idx)} className="text-red-400">
                      <FiTrash />
                    </button>
                  </td>
                </tr>
              ))}
              <tr>
                <td colSpan="3">
                  <button onClick={() => addRule("exclude")} className="text-blue-400 mt-2">
                    ➕ Add Exclude Rule
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="flex justify-between items-center mt-4">
          <button
            onClick={() => onDelete(form.id)}
            className="text-red-500 border border-red-500 px-4 py-2 rounded hover:bg-red-500 hover:text-white"
          >
            Delete
          </button>
          <button
            onClick={handleSave}
            disabled={!hasChanges}
            className={`px-6 py-2 rounded ${
              hasChanges
                ? "bg-green-600 hover:bg-green-700 text-white"
                : "bg-zinc-700 text-zinc-400 cursor-not-allowed"
            }`}
          >
            <FiSave className="inline-block mr-2" />
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default ListModal;
