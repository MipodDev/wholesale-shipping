// components/ProductTable.jsx
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpDown } from "lucide-react";

const ProductTable = ({ products = [], onView }) => {
  const [sortKey, setSortKey] = useState("title");
  const [sortOrder, setSortOrder] = useState("asc");

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };

  const sortedProducts = [...products].sort((a, b) => {
    const valA = a[sortKey] || "";
    const valB = b[sortKey] || "";
    if (typeof valA === "string") {
      return sortOrder === "asc"
        ? valA.localeCompare(valB)
        : valB.localeCompare(valA);
    }
    return 0;
  });

  if (!Array.isArray(products)) return null;

  return (
    <div className="overflow-x-auto rounded-xl shadow border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900">
      <table className="min-w-full divide-y divide-zinc-200 dark:divide-zinc-700 text-sm">
        <thead className="sticky top-0 z-10 bg-zinc-100 dark:bg-zinc-800 text-white-700 dark:text-zinc-200 shadow">
          <tr>
            {[
              { key: "title", label: "Title" },
              { key: "status", label: "Status" },
              { key: "category", label: "Category" },
              { key: null, label: "SKUs" },
              { key: null, label: "Tags" },
              { key: null, label: "Actions" },
            ].map(({ key, label }) => (
              <th
                key={label}
                className={`px-4 py-3 text-left font-semibold select-none ${key ? "cursor-pointer" : ""}`}
                onClick={() => key && handleSort(key)}
              >
                <div className="flex items-center gap-1">
                  {label}
                  {key && <ArrowUpDown size={14} />}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
          <AnimatePresence>
            {sortedProducts.map((p) => (
              <motion.tr
                key={p.product_id}
                layout
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.2 }}
                className="hover:bg-zinc-50 dark:hover:bg-zinc-800"
              >
                <td className="px-4 py-2 font-medium text-zinc-900 dark:text-zinc-100">{p.title}</td>
                <td className="px-4 py-2 text-zinc-700 dark:text-zinc-300">{p.status}</td>
                <td className="px-4 py-2 text-zinc-700 dark:text-zinc-300">
                  {p.category || <span className="text-zinc-400 italic">—</span>}
                </td>
                <td className="px-4 py-2">
                  <div className="flex flex-wrap gap-1">
                    {p.unique_skus?.map((sku) => (
                      <span
                        key={sku}
                        className="bg-zinc-200 dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 px-2 py-0.5 rounded text-xs"
                      >
                        {sku}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-4 py-2">
                  <div className="flex flex-wrap gap-1">
                    {p.tags?.map((tag) => (
                      <span
                        key={tag}
                        className="bg-indigo-100 dark:bg-indigo-700 text-indigo-700 dark:text-white px-2 py-0.5 rounded text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-4 py-2 text-right">
                  <button
                    onClick={() => onView(p.product_id)}
                    className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium text-sm"
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

export default ProductTable;