// components/StateModal.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

const StateModal = ({ isOpen, stateCode, onClose }) => {
  const [stateData, setStateData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editableStatus, setEditableStatus] = useState("enabled");
  const [editableRules, setEditableRules] = useState([]);
  const [availableRules, setAvailableRules] = useState([]);

  useEffect(() => {
    if (isOpen && stateCode) {
      axios.get(`/web/states/${stateCode}`).then((res) => {
        setStateData(res.data);
        setEditableStatus(res.data.status);
        setEditableRules(res.data.rules.map((r) => r.name));
      });
      axios.get(`/web/rules`).then((res) => {
        setAvailableRules(res.data.map((r) => r.name));
      });
    }
  }, [isOpen, stateCode]);

  const handleSave = async () => {
    try {
      await axios.put(`/web/states/${stateCode}`, {
        status: editableStatus,
        rules: editableRules,
      });
      setIsEditing(false);
      onClose(); // Reload on reopen
    } catch (err) {
      console.error("Failed to save state:", err);
      alert("Error saving changes.");
    }
  };

  if (!isOpen || !stateData) return null;
  const { name, code, services, zipCodes } = stateData;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-6 max-w-2xl w-full relative text-white" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-3 right-4 text-zinc-400 hover:text-white text-lg">✕</button>
        <h2 className="text-2xl font-bold mb-2">
          {name} <span className="text-zinc-400 text-base">({code})</span>
        </h2>

        {/* Status */}
        <div className="mb-4">
          <label className="block font-semibold mb-1 text-green-400">Status</label>
          {isEditing ? (
            <select
              value={editableStatus}
              onChange={(e) => setEditableStatus(e.target.value)}
              className="bg-zinc-800 border border-zinc-600 rounded px-3 py-2 text-white w-full"
            >
              <option value="enabled">Enabled</option>
              <option value="disabled">Disabled</option>
            </select>
          ) : (
            <p className={`font-medium ${editableStatus === "enabled" ? "text-green-500" : "text-red-500"}`}>
              {editableStatus === "enabled" ? "✅ Enabled" : "❌ Disabled"}
            </p>
          )}
        </div>

        {/* Rules */}
        <div className="mb-4">
          <label className="block font-semibold mb-1 text-yellow-400">Rules</label>
          {isEditing ? (
            <select
              multiple
              value={editableRules}
              onChange={(e) =>
                setEditableRules(Array.from(e.target.selectedOptions, (opt) => opt.value))
              }
              className="bg-zinc-800 border border-zinc-600 rounded px-3 py-2 text-white w-full h-32"
            >
              {availableRules.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          ) : (
            editableRules.length > 0 ? (
              <ul className="list-disc list-inside text-sm text-zinc-300 mt-1">
                {editableRules.map((r, i) => <li key={i}>{r}</li>)}
              </ul>
            ) : (
              <p className="text-sm text-zinc-500">No rules applied.</p>
            )
          )}
        </div>

        {/* Services (Read-only) */}
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-purple-400">Services</h3>
          {services.length > 0 ? (
            <ul className="list-disc list-inside text-sm text-zinc-300 mt-1">
              {services.map((s, i) => (
                <li key={i}>
                  <span className="font-medium">{s.name}</span> — {s.description}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-zinc-500">No services defined.</p>
          )}
        </div>

        {/* Zip Codes (Read-only) */}
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-cyan-400">Zip Codes</h3>
          <p className="text-sm text-zinc-300">
            {zipCodes.length} zip code{zipCodes.length !== 1 ? "s" : ""} defined.
          </p>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2 mt-6">
          {isEditing ? (
            <>
              <button onClick={handleSave} className="bg-green-600 hover:bg-green-500 px-4 py-2 rounded text-white font-medium">Save</button>
              <button onClick={() => setIsEditing(false)} className="bg-zinc-700 hover:bg-zinc-600 px-4 py-2 rounded text-white font-medium">Cancel</button>
            </>
          ) : (
            <button onClick={() => setIsEditing(true)} className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded text-white font-medium">Edit</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default StateModal;
