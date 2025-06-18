// components/StatesTable.jsx
import { motion, AnimatePresence } from "framer-motion";

const StatesTable = ({ states = [], onView }) => {
  if (!Array.isArray(states)) return null;

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-700 bg-zinc-900 shadow-lg">
      <table className="min-w-full table-auto text-sm text-gray-100">
        <thead className="bg-zinc-800 sticky top-0 z-10">
          <tr className="text-left text-gray-300">
            <th className="p-3">Code</th>
            <th className="p-3">Name</th>
            <th className="p-3">Status</th>
            <th className="p-3">Rules</th>
            <th className="p-3">Zip Codes</th>
            <th className="p-3">Services</th>
            <th className="p-3">Actions</th>
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
                className="border-b border-zinc-700 hover:bg-zinc-800"
              >
                <td className="p-3 font-medium">{s.code}</td>
                <td className="p-3">{s.name}</td>
                <td className="p-3">
                  {s.status === "enabled" ? (
                    <span className="text-green-400 font-semibold">✅ Enabled</span>
                  ) : (
                    <span className="text-red-400 font-semibold">❌ Disabled</span>
                  )}
                </td>
                <td className="p-3">
                  {s.rules?.length ? (
                    s.rules.map((rule) => (
                      <span
                        key={rule.name}
                        className="inline-block bg-gray-700 text-gray-200 rounded-full px-2 py-1 text-xs mr-1"
                      >
                        {rule.name}
                      </span>
                    ))
                  ) : (
                    <span className="text-gray-400 italic">None</span>
                  )}
                </td>
                <td className="p-3">{s.zipCodes ?? 0}</td>
                <td className="p-3">
                  {s.services?.length ? (
                    s.services.map((svc) => (
                      <span
                        key={svc.name}
                        className="inline-block bg-gray-700 text-gray-200 rounded-full px-2 py-1 text-xs mr-1"
                      >
                        {svc.name}
                      </span>
                    ))
                  ) : (
                    <span className="text-gray-400 italic">None</span>
                  )}
                </td>
                <td className="p-3">
                  <button
                    onClick={() => onView(s.code)}
                    className="text-purple-400 hover:underline hover:text-purple-300"
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
