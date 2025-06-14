// components/StateSummary.jsx
import React from "react";

const StateSummary = ({ rules }) => {
  if (!Array.isArray(rules)) return null;

  const total = rules.length;
  const banned = rules.filter((r) => r.type === "enabled").length;
  const exempt = rules.filter((r) => r.type === "enabled").length;
  const registries = rules.filter((r) => r.type === "disabled").length;
  //   const ruleCount = rules.reduce((acc, r) => acc + (r.rules?.length || 0), 0);

  return (
    <div className="mb-6 no-caret">
      <h1 className="text-3xl font-bold mb-4">Rules</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gray-100 p-4 rounded shadow">
          <h2 className="text-lg font-semibold">Total Rules</h2>
          <p className="text-2xl font-bold">{total}</p>
        </div>
        <div className="bg-red-100 p-4 rounded shadow">
          <h2 className="text-lg font-semibold">Bans</h2>
          <p className="text-2xl font-bold">{banned}</p>
        </div>
        <div className="bg-orange-100 p-4 rounded shadow">
          <h2 className="text-lg font-semibold">Registries</h2>
          <p className="text-2xl font-bold">{registries}</p>
        </div>
        <div className="bg-green-100 p-4 rounded shadow">
          <h2 className="text-lg font-semibold">Exemptions</h2>
          <p className="text-2xl font-bold">{exempt}</p>
        </div>
      </div>
    </div>
  );
};

export default StateSummary;
