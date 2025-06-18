// components/RuleModal.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import { BadgeCheck, Ban, Map, ListOrdered } from "lucide-react";

const RuleModal = ({ isOpen, ruleId, onClose }) => {
  const [ruleData, setRuleData] = useState(null);

  useEffect(() => {
    if (isOpen && ruleId) {
      axios.get(`/web/rules/${ruleId}`).then((res) => setRuleData(res.data));
    }
  }, [isOpen, ruleId]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center px-4 sm:px-0">
      <div className="bg-zinc-900 text-white rounded-xl shadow-xl w-full max-w-3xl p-6 relative overflow-y-auto max-h-[90vh] border border-zinc-700">
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-zinc-400 hover:text-white text-xl"
        >
          ✕
        </button>

        <h2 className="text-2xl font-semibold mb-1">{ruleData?.name}</h2>
        <p className="text-sm text-zinc-400 mb-4">{ruleData?.type} - {ruleData?.range}</p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <div className="bg-zinc-800 rounded-lg p-4 flex flex-col items-center">
            <Map className="text-blue-400 mb-1" />
            <span className="text-sm text-zinc-400">States</span>
            <span className="text-lg font-bold">{ruleData?.states?.length || 0}</span>
          </div>
          <div className="bg-zinc-800 rounded-lg p-4 flex flex-col items-center">
            <Map className="text-yellow-400 mb-1" />
            <span className="text-sm text-zinc-400">Cities</span>
            <span className="text-lg font-bold">{ruleData?.cities?.length || 0}</span>
          </div>
          <div className="bg-zinc-800 rounded-lg p-4 flex flex-col items-center">
            <ListOrdered className="text-green-400 mb-1" />
            <span className="text-sm text-zinc-400">Lists</span>
            <span className="text-lg font-bold">{ruleData?.lists?.length || 0}</span>
          </div>
          <div className="bg-zinc-800 rounded-lg p-4 flex flex-col items-center">
            <Ban className="text-red-400 mb-1" />
            <span className="text-sm text-zinc-400">SKUs</span>
            <span className="text-lg font-bold">{ruleData?.skus?.length || 0}</span>
          </div>
        </div>

        <div className="space-y-6">
          {ruleData?.states?.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-2">States</h3>
              <div className="flex flex-wrap gap-2">
                {ruleData.states.map((s) => (
                  <span
                    key={s.code}
                    className="bg-blue-600/20 border border-blue-600 text-blue-300 px-2 py-1 rounded text-xs"
                  >
                    {s.name} ({s.code})
                  </span>
                ))}
              </div>
            </div>
          )}

          {ruleData?.cities?.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Cities</h3>
              <div className="flex flex-wrap gap-2">
                {ruleData.cities.map((c, i) => (
                  <span
                    key={i}
                    className="bg-yellow-600/20 border border-yellow-600 text-yellow-300 px-2 py-1 rounded text-xs"
                  >
                    {c}
                  </span>
                ))}
              </div>
            </div>
          )}

          {ruleData?.lists?.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Lists</h3>
              <ul className="list-disc list-inside text-sm text-zinc-300 space-y-1">
                {ruleData.lists.map((l) => (
                  <li key={l.id}>
                    <strong>{l.name}</strong> <span className="text-zinc-400">({l.category})</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {ruleData?.skus?.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-2">SKUs</h3>
              <div className="max-h-[200px] overflow-y-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 text-sm text-zinc-300">
                {ruleData.skus.map((sku, i) => (
                  <span key={i} className="bg-zinc-800 p-1 px-2 rounded border border-zinc-700">
                    {sku}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RuleModal;
