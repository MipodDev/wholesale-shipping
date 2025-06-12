import React from "react";

const StatesTable = ({ states = [], onView }) => {
  if (!Array.isArray(states)) return null;

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border rounded shadow">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-2 text-left">Code</th>
            <th className="p-2 text-left">Name</th>
            <th className="p-2 text-left">Status</th>
            <th className="p-2 text-left">Rules</th>
            <th className="p-2 text-left">Zip Codes</th>
            <th className="p-2 text-left">Services</th>
            <th className="p-2 text-left"></th>
          </tr>
        </thead>
        <tbody>
          {states.map((s) => (
            <tr key={s.code} className="border-t">
              <td className="p-2">{s.code}</td>
              <td className="p-2">{s.name}</td>
              <td className="p-2">{s.status}</td>
              <td className="p-2">{s.rules?.length || 0}</td>
              <td className="p-2">{s.zipCodes}</td>
              <td className="p-2">{s.services}</td>
              <td className="p-2">
                <button
                  onClick={() => onView(s.code)}
                  className="text-blue-600 hover:underline"
                >
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StatesTable;
