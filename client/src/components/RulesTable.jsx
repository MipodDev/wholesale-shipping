import { motion } from "framer-motion";

export default function RulesTable({ rules, onViewRule }) {
  return (
    <div className="mt-4 overflow-auto rounded-lg border border-zinc-700">
      <table className="min-w-full text-sm text-left text-gray-300">
        <thead className="bg-zinc-900 text-xs uppercase text-gray-400 sticky top-0 z-10">
          <tr>
            <th scope="col" className="px-4 py-3 font-medium tracking-wider">
              Name
            </th>
            <th scope="col" className="px-4 py-3 font-medium tracking-wider">
              Type
            </th>
            <th scope="col" className="px-4 py-3 font-medium tracking-wider">
              Range
            </th>
            <th scope="col" className="px-4 py-3 font-medium tracking-wider">
              # of Lists
            </th>
            <th scope="col" className="px-4 py-3 font-medium tracking-wider">
              # of States
            </th>
            <th scope="col" className="px-4 py-3 font-medium tracking-wider">
              # of SKUs
            </th>
            <th scope="col" className="px-4 py-3 font-medium tracking-wider text-right">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-800 bg-zinc-800">
          {rules.map((rule, index) => (
            <motion.tr
              key={rule.id}
              className={`transition-colors hover:bg-zinc-700 ${
                index % 2 === 0 ? "bg-zinc-800" : "bg-zinc-900"
              }`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <td className="px-4 py-3 font-medium text-white">{rule.name}</td>
              <td className="px-4 py-3">
                <span className="bg-purple-700 text-white text-xs px-2 py-1 rounded-full">
                  {rule.type}
                </span>
              </td>
              <td className="px-4 py-3">
                <span className="bg-blue-700 text-white text-xs px-2 py-1 rounded-full">
                  {rule.range}
                </span>
              </td>
              <td className="px-4 py-3 text-center">{rule.lists?.length || 0}</td>
              <td className="px-4 py-3 text-center">{rule.states?.length || 0}</td>
              <td className="px-4 py-3 text-center">{rule.skus?.length || 0}</td>
              <td className="px-4 py-3 text-right">
                <button
                  onClick={() => onViewRule(rule.id)}
                  className="text-indigo-400 hover:text-indigo-200 text-sm font-medium"
                >
                  View
                </button>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
