import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const ranges = ["State", "City", "Zip Code", "Customer"];
const types = ["Ban", "Exemption", "Registry"];

const RuleModal = ({ isOpen, ruleId, onClose, refreshRules }) => {
  const isCreate = ruleId === null;
  const modalRef = useRef();

  const [ruleData, setRuleData] = useState(null);
  const [lists, setLists] = useState([]);
  const [isEditing, setIsEditing] = useState(isCreate);

  const [name, setName] = useState("");
  const [range, setRange] = useState("");
  const [type, setType] = useState("");
  const [selectedLists, setSelectedLists] = useState([]);
  const [listFilter, setListFilter] = useState("");

  const [expanded, setExpanded] = useState({ states: false, cities: false, skus: false, lists: false });

  useEffect(() => {
    if (isOpen) {
      axios.get("/web/lists").then((res) => setLists(res.data));

      if (!isCreate) {
        axios.get(`/web/rules/${ruleId}`).then((res) => {
          setRuleData(res.data);
          setName(res.data.name);
          setRange(res.data.range);
          setType(res.data.type);
          setSelectedLists(res.data.lists || []);
        });
      } else {
        setRuleData(null);
        setName("");
        setRange("");
        setType("");
        setSelectedLists([]);
      }
    }
  }, [isOpen, ruleId]);

  const handleBackdropClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      onClose();
    }
  };

  const handleSave = async () => {
    try {
      const payload = { name, range, type, lists: selectedLists };
      if (isCreate) {
        await axios.post("/web/rules", payload);
        toast.success("Rule created!");
      } else {
        await axios.put(`/web/rules/${ruleId}`, payload);
        toast.success("Rule updated!");
      }
      onClose();
      refreshRules?.();
    } catch (err) {
      console.error(err);
      toast.error("Failed to save rule.");
    }
  };

  const handleDelete = async () => {
    if (!ruleId) return;
    const confirmed = window.confirm("Are you sure you want to delete this rule?");
    if (!confirmed) return;
    try {
      await axios.delete(`/web/rules/${ruleId}`);
      toast.success("Rule deleted.");
      onClose();
      refreshRules?.();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete rule.");
    }
  };

  const handleDuplicate = async () => {
    if (!ruleData) return;
    try {
      const copy = {
        name: `${ruleData.name} (Copy)`,
        range: ruleData.range,
        type: ruleData.type,
        lists: ruleData.lists || [],
      };
      await axios.post("/web/rules", copy);
      toast.success("Rule duplicated!");
      refreshRules?.();
    } catch (err) {
      console.error(err);
      toast.error("Failed to duplicate rule.");
    }
  };

  const filteredLists = lists.filter((l) => l.name.toLowerCase().includes(listFilter.toLowerCase()));

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50"
      onClick={handleBackdropClick}
    >
      <div
        ref={modalRef}
        className="bg-zinc-900 text-white p-6 rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto border border-zinc-700 shadow-lg"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">
            {isCreate ? "Create Rule" : isEditing ? "Edit Rule" : ruleData?.name}
          </h2>
          <button onClick={onClose} className="text-zinc-400 hover:text-white text-xl">✕</button>
        </div>

        {/* Editable Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="text-sm mb-1 block">Name</label>
            <input
              type="text"
              disabled={!isEditing}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-zinc-800 border border-zinc-600 rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="text-sm mb-1 block">Range</label>
            <select
              disabled={!isEditing}
              value={range}
              onChange={(e) => setRange(e.target.value)}
              className="w-full bg-zinc-800 border border-zinc-600 rounded px-3 py-2"
            >
              <option value="">-- Select Range --</option>
              {ranges.map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          <div>
            <label className="text-sm mb-1 block">Type</label>
            <select
              disabled={!isEditing}
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full bg-zinc-800 border border-zinc-600 rounded px-3 py-2"
            >
              <option value="">-- Select Type --</option>
              {types.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
        </div>

        {/* List Selection */}
        <div className="mb-6">
          <label className="text-sm font-medium block mb-1">Filter Product Lists</label>
          <input
            type="text"
            placeholder="Search lists..."
            value={listFilter}
            onChange={(e) => setListFilter(e.target.value)}
            className="w-full mb-2 px-3 py-2 bg-zinc-800 border border-zinc-600 rounded"
          />

          <label className="text-sm font-medium block mb-1">Product Lists</label>
          <select
            multiple
            disabled={!isEditing}
            value={selectedLists.map((l) => l.id)}
            onChange={(e) => {
              const selected = Array.from(e.target.selectedOptions).map((opt) =>
                lists.find((l) => l.id === opt.value)
              );
              setSelectedLists(selected);
            }}
            className="w-full bg-zinc-800 border border-zinc-600 rounded px-3 py-2 h-32"
          >
            {filteredLists.map((l) => (
              <option key={l.id} value={l.id}>{l.name}</option>
            ))}
          </select>
        </div>

        {/* Summary Section */}
        {!isCreate && ruleData && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            {['states', 'cities', 'lists', 'skus'].map((key) => (
              <div key={key} className="bg-zinc-800 p-3 rounded border border-zinc-600">
                <p className="text-sm text-zinc-400 capitalize">{key}</p>
                <p
                  className="text-lg font-bold cursor-pointer"
                  onClick={() => setExpanded({ ...expanded, [key]: !expanded[key] })}
                >
                  {ruleData[key]?.length || 0} {expanded[key] ? "▲" : "▼"}
                </p>
                {expanded[key] && (
                  <ul className="text-xs mt-2 space-y-1 max-h-32 overflow-y-auto list-disc list-inside text-zinc-300">
                    {(ruleData[key] || []).map((item, i) => (
                      <li key={i}>{typeof item === 'object' ? item.name || item.code || item.id : item}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-between mt-4">
          <div className="flex gap-2">
            {!isCreate && (
              <>
                <button
                  onClick={handleDelete}
                  className="bg-red-600 hover:bg-red-500 px-4 py-2 rounded"
                >
                  Delete
                </button>
                <button
                  onClick={handleDuplicate}
                  className="bg-yellow-600 hover:bg-yellow-500 px-4 py-2 rounded"
                >
                  Duplicate
                </button>
              </>
            )}
          </div>

          <div className="flex gap-3">
            {isEditing ? (
              <>
                <button
                  onClick={handleSave}
                  className="bg-green-600 hover:bg-green-500 px-4 py-2 rounded"
                >
                  Save
                </button>
                {!isCreate && (
                  <button
                    onClick={() => setIsEditing(false)}
                    className="bg-zinc-700 hover:bg-zinc-600 px-4 py-2 rounded"
                  >
                    Cancel
                  </button>
                )}
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded"
              >
                Edit
              </button>
            )}
            {!isCreate && (
              <button
                onClick={async () => {
                  try {
                    await axios.post(`/web/rules/synchronize/${ruleId}`);
                    toast.success("Rule synchronized!");
                  } catch (err) {
                    console.error(err);
                    toast.error("Failed to synchronize.");
                  }
                }}
                className="bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded"
              >
                Synchronize
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RuleModal;
