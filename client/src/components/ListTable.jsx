import { FiEdit2, FiEye, FiPlus, FiRefreshCcw } from "react-icons/fi";

const ListTable = ({ lists, onEdit, onView, onCreate, onSync }) => {
  return (
    <div className="bg-zinc-900 border border-zinc-700 rounded-xl shadow overflow-auto max-h-[60vh]">
      <div className="flex justify-end p-4">
        <button
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
          onClick={onCreate}
        >
          <FiPlus /> New List
        </button>
      </div>
      <table className="min-w-full table-auto text-sm divide-y divide-zinc-700 text-zinc-100">
        <thead className="bg-zinc-800 text-zinc-300">
          <tr>
            <th className="p-3 text-left font-medium">Name</th>
            <th className="p-3 text-left font-medium">Category</th>
            <th className="p-3 text-left font-medium">Skus</th>
            <th className="p-3 text-left font-medium">Include</th>
            <th className="p-3 text-left font-medium">Exclude</th>
            <th className="p-3 text-left font-medium">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-800">
          {lists.map((list) => (
            <tr key={list.id} className="hover:bg-zinc-800">
              <td className="p-3">{list.name}</td>
              <td className="p-3">{list.category}</td>
              <td className="p-3">{list.skus}</td>
              <td className="p-3">
                {(list.include || []).map((rule, idx) => (
                  <span key={idx} className="inline-block text-xs bg-zinc-700 px-2 py-0.5 rounded mr-1 mb-1">
                    {rule.key}:{rule.value}
                  </span>
                ))}
              </td>
              <td className="p-3">
                {(list.exclude || []).map((rule, idx) => (
                  <span key={idx} className="inline-block text-xs bg-zinc-700 px-2 py-0.5 rounded mr-1 mb-1">
                    {rule.key}:{rule.value}
                  </span>
                ))}
              </td>
              <td className="p-3 flex gap-2">
                <button onClick={() => onView(list)} className="text-blue-300 hover:text-blue-400" title="View">
                  <FiEye />
                </button>
                <button onClick={() => onEdit(list)} className="text-yellow-300 hover:text-yellow-400" title="Edit">
                  <FiEdit2 />
                </button>
                <button onClick={() => onSync(list.id)} className="text-green-300 hover:text-green-400" title="Sync">
                  <FiRefreshCcw />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ListTable;
