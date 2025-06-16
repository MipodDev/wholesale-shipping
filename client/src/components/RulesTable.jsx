// components/RulesTable.jsx
import { motion, AnimatePresence } from "framer-motion";

const RulesTable = ({ rules = [], onView }) => {
  if (!Array.isArray(rules)) return null;

  return (
    <div className="no-caret overflow-x-auto rounded shadow bg-white/60 backdrop-blur-md border border-gray-200">
      <table className="min-w-full table-auto divide-y divide-gray-200">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-2 text-left">Name</th>
            <th className="p-2 text-left">Range</th>
            <th className="p-2 text-left">Type</th>
            <th className="p-2 text-left">States</th>
            <th className="p-2 text-left">Cities</th>
            <th className="p-2 text-left">Zip Codes</th>
            <th className="p-2 text-left">Product Lists</th>
            <th className="p-2 text-left">Skus</th>
            <th className="p-2 text-left"></th>
          </tr>
        </thead>
        <tbody>
          <AnimatePresence>
            {rules.map((r) => (
              <motion.tr
                key={r.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="border-b"
              >
                <td className="p-2">{r.name}</td>
                <td className="p-2">{r.range}</td>
                <td className="p-2">
                  {r.type === "Registry" && "⚠️ Registry"}
                  {r.type === "Ban" && "❌ Ban"}
                  {r.type === "Exemption" && "✅ Exemption"}
                </td>
                <td className="px-4 py-2">
                  {r.states?.map((state) => (
                    <span
                      key={state.code}
                      className="inline-block bg-gray-200 rounded px-2 py-1 text-xs mr-1"
                    >
                      {state.name} ({state.code})
                    </span>
                  ))}
                </td>
                <td className="p-2">{r.cities? r.cities.length : 0}</td>
                <td className="p-2">{r.zipCodes? r.zipCodes.length : 0}</td>
                <td className="px-4 py-2">
                  {r.lists?.map((list) => (
                    <span
                      key={list.id}
                      className="inline-block bg-gray-200 rounded px-2 py-1 text-xs mr-1"
                    >
                      {list.name}
                    </span>
                  ))}
                </td>
                <td className="p-2">{r.skus.length}</td>

                <td className="p-2">
                  <button
                    onClick={() => onView(r.id)}
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

export default RulesTable;
