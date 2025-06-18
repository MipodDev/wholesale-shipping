// components/StateModal.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

const StateModal = ({ isOpen, stateCode, onClose }) => {
  const [stateData, setStateData] = useState(null);

  useEffect(() => {
    if (isOpen && stateCode) {
      axios.get(`/web/states/${stateCode}`).then((res) => setStateData(res.data));
    }
  }, [isOpen, stateCode]);

  if (!isOpen || !stateData) return null;

  const { name, code, status, rules, services, zipCodes } = stateData;

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-zinc-900 border border-zinc-700 rounded-xl p-6 max-w-2xl w-full relative text-white"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-zinc-400 hover:text-white text-lg"
        >
          ✕
        </button>

        <h2 className="text-2xl font-bold mb-2">
          {name} <span className="text-zinc-400 text-base">({code})</span>
        </h2>
        <p
          className={`mb-4 font-medium ${
            status === "enabled" ? "text-green-500" : "text-red-500"
          }`}
        >
          Status: {status === "enabled" ? "✅ Enabled" : "❌ Disabled"}
        </p>

        <div className="mb-4">
          <h3 className="text-lg font-semibold text-yellow-400">Rules</h3>
          {rules.length > 0 ? (
            <ul className="list-disc list-inside text-sm text-zinc-300 mt-1">
              {rules.map((r, i) => (
                <li key={i}>{r.name}</li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-zinc-500">No rules applied.</p>
          )}
        </div>

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

        <div>
          <h3 className="text-lg font-semibold text-cyan-400">Zip Codes</h3>
          <p className="text-sm text-zinc-300">
            {zipCodes.length} zip code{zipCodes.length !== 1 ? "s" : ""} defined.
          </p>
        </div>
      </div>
    </div>
  );
};

export default StateModal;
