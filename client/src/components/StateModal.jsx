// components/StateModal.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

const StateModal = ({ isOpen, stateCode, onClose }) => {
  const [stateData, setStateData] = useState(null);

  useEffect(() => {
    if (isOpen && stateCode) {
      axios
        .get(`/web/states/${stateCode}`)
        .then((res) => setStateData(res.data));
    }
  }, [isOpen, stateCode]);

  if (!isOpen || !stateData) return null;

  const { name, code, status, rules, services, zipCodes } = stateData;

  return (
    <div
      className="fixed inset-0 bg-white/30 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={() => onClose()} // ← This triggers close when clicking the background
    >
      <div
        className="bg-white shadow-lg rounded-lg p-6 max-w-lg w-full"
        onClick={(e) => e.stopPropagation()} // ← Prevents closing when clicking inside the modal
      >
        <button
          onClick={() => onClose()}
          className="absolute top-2 right-4 text-gray-500 hover:text-black text-lg"
        >
          ✕
        </button>

        <h2 className="no-caret text-2xl font-bold mb-2">
          {name} <span className="text-gray-500">({code})</span>
        </h2>
        <p
          className={`no-caret mb-4 font-medium ${
            status === "enabled" ? "text-green-600" : "text-red-600"
          }`}
        >
          Status: {status === "enabled" ? "✅ Enabled" : "❌ Disabled"}
        </p>

        {/* Rules Section */}
        <div className="no-caret mb-4">
          <h3 className="text-lg font-semibold">Rules</h3>
          {rules.length > 0 ? (
            <ul className="list-disc list-inside text-sm text-gray-700 mt-1">
              {rules.map((r, i) => (
                <li key={i}>{r.name}</li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500">No rules applied.</p>
          )}
        </div>

        {/* Services Section */}
        <div className="no-caret mb-4">
          <h3 className="text-lg font-semibold">Services</h3>
          {services.length > 0 ? (
            <ul className="list-disc list-inside text-sm text-gray-700 mt-1">
              {services.map((s, i) => (
                <li key={i}>
                  <span className="font-medium">{s.name}</span> —{" "}
                  {s.description}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500">No services defined.</p>
          )}
        </div>

        {/* Zip Codes Section */}
        <div>
          <h3 className="no-caret text-lg font-semibold">Zip Codes</h3>
          <p className="text-sm text-gray-700">
            {zipCodes.length} zip code{zipCodes.length !== 1 ? "s" : ""}{" "}
            defined.
          </p>
        </div>
      </div>
    </div>
  );
};

export default StateModal;
