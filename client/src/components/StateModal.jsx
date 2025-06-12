import React, { useEffect, useState } from "react";
import axios from "axios";

const StateModal = ({ isOpen, stateCode, onClose }) => {
  const [stateData, setStateData] = useState(null);

  useEffect(() => {
    if (isOpen && stateCode) {
      axios.get(`/web/states/${stateCode}`).then((res) => setStateData(res.data));
    }
  }, [isOpen, stateCode]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-4 text-gray-500 hover:text-black"
        >
          ✕
        </button>
        <h2 className="text-xl font-semibold mb-4">
          {stateData?.name} ({stateData?.code})
        </h2>
        <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-[400px]">
          {JSON.stringify(stateData, null, 2)}
        </pre>
      </div>
    </div>
  );
};

export default StateModal;
