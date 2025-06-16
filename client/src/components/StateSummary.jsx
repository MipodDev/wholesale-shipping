// components/StateSummary.jsx
import React from "react";

const StateSummary = ({ states }) => {
  if (!Array.isArray(states)) return null;

  const total = states.length;
  const enabled = states.filter(s => s.status === "enabled").length;
  const disabled = states.filter(s => s.status === "disabled").length;
  const ruleCount = states.reduce((acc, s) => acc + (s.rules?.length || 0), 0);

  return (
    <div className="mb-6 no-caret">
      <h1 className="text-3xl font-bold mb-4">States</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gray-100 p-4 rounded shadow">
          <h2 className="text-lg font-semibold">Total States</h2>
          <p className="text-2xl font-bold">{total}</p>
        </div>
        <div className="bg-green-100 p-4 rounded shadow">
          <h2 className="text-lg font-semibold">Enabled</h2>
          <p className="text-2xl font-bold">{enabled}</p>
        </div>
        <div className="bg-red-100 p-4 rounded shadow">
          <h2 className="text-lg font-semibold">Disabled</h2>
          <p className="text-2xl font-bold">{disabled}</p>
        </div>
        <div className="bg-blue-100 p-4 rounded shadow">
          <h2 className="text-lg font-semibold">Total Rules</h2>
          <p className="text-2xl font-bold">{ruleCount}</p>
        </div>
      </div>
    </div>
  );
};

export default StateSummary;
