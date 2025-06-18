// components/RulesTable.jsx
import { motion, AnimatePresence } from "framer-motion";

const RulesTable = ({ rules = [], onView }) => {
  if (!Array.isArray(rules)) return null;

  return (
    <div className="overflow-x-auto rounded-xl shadow border border-zinc-700 bg-zinc-900">
      <table className="min-w-full table-auto divide-y divide-zinc-700 text-sm text-zinc-100">
        <thead className="bg-zinc-800 text-zinc-300">
          <tr>
            <th className="p-3 text-left font-medium">Name</th>
            <th className="p-3 text-left font-medium">Range</th>
            <th className="p-3 text-left font-medium">Type</th>
            <th className="p-3 text-left font-medium">States</th>
            <th className="p-3 text-left font-medium">Cities</th>
            <th className="p-3 text-left font-medium">Zip Codes</th>
            <th className="p-3 text-left font-medium">Product Lists</th>
            <th className="p-3 text-left font-medium">SKUs</th>
            <th className="p-3 text-left font-medium"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-800">
          <AnimatePresence>
            {rules.map((r) => (
              <motion.tr
                key={r.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="hover:bg-zinc-800/70"
              >
                <td className="p-3">{r.name}</td>
                <td className="p-3 capitalize">{r.range}</td>
                <td className="p-3">
                  {r.type === "Registry" && (
                    <span className="text-yellow-400">⚠️ Registry</span>
                  )}
                  {r.type === "Ban" && (
                    <span className="text-red-400">❌ Ban</span>
                  )}
                  {r.type === "Exemption" && (
                    <span className="text-green-400">✅ Exemption</span>
                  )}
                </td>
                <td className="p-3">
                  {r.states?.map((s) => (
                    <span
                      key={s.code}
                      className="inline-block bg-zinc-800 text-zinc-300 border border-zinc-600 rounded px-2 py-0.5 text-xs mr-1"
                    >
                      {s.name} ({s.code})
                    </span>
                  ))}
                </td>
                <td className="p-3">{r.cities?.length || 0}</td>
                <td className="p-3">{r.zipCodes?.length || 0}</td>
                <td className="p-3">
                  {r.lists?.map((list) => (
                    <span
                      key={list.id}
                      className="inline-block bg-purple-900/60 text-purple-300 border border-purple-800 rounded px-2 py-0.5 text-xs mr-1"
                    >
                      {list.name}
                    </span>
                  ))}
                </td>
                <td className="p-3">{r.skus?.length || 0}</td>
                <td className="p-3">
                  <button
                    onClick={() => onView(r.id)}
                    className="text-blue-400 hover:text-blue-300 transition"
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

export default RulesTable;
