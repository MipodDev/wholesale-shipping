// components/StatesTable.jsx
import React from "react";
import { motion, AnimatePresence } from "framer-motion";

const StatesTable = ({ states = [], onView }) => {
  if (!Array.isArray(states)) return null;

  return (
    <div className="no-caret overflow-x-auto rounded shadow bg-white/60 backdrop-blur-md border border-gray-200">
      <table className="min-w-full table-auto divide-y divide-gray-200">
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
          <AnimatePresence>
            {states.map((s) => (
              <motion.tr
                key={s.code}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="border-b"
              >
                <td className="p-2">{s.code}</td>
                <td className="p-2">{s.name}</td>
                <td className="px-4 py-2">
                  {s.status === "enabled" ? (
                    <span className="text-green-600 font-semibold">
                      ✅ Enabled
                    </span>
                  ) : (
                    <span className="text-red-600 font-semibold">
                      ❌ Disabled
                    </span>
                  )}
                </td>

                <td className="px-4 py-2">
                  {s.rules?.map((rule) => (
                    <span
                      key={rule.name}
                      className="inline-block bg-gray-200 rounded px-2 py-1 text-xs mr-1"
                    >
                      {rule.name}
                    </span>
                  ))}
                </td>
                <td className="p-2">{s.zipCodes}</td>
                <td className="px-4 py-2">
                  {s.services?.map((svc) => (
                    <span
                      key={svc.name}
                      className="inline-block bg-gray-200 rounded px-2 py-1 text-xs mr-1"
                    >
                      {svc.name}
                    </span>
                  ))}
                </td>

                <td className="p-2">
                  <button
                    onClick={() => onView(s.code)}
                    className="text-blue-600 hover:underline"
                  >
                    View
                  </button>
                </td>
              </motion.tr>
            ))}
          </AnimatePresence>
        </tbody>
      </table>
    </div>
  );
};

export default StatesTable;
