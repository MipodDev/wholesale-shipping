import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import RuleModal from "../components/RuleModal";
import RulesTable from "../components/RulesTable";
import RuleFilters from "../components/RuleFilters";
import RuleSummary from "../components/RuleSummary";

const Rules = () => {
  const [rules, setRules] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({ type: "", range: "" });
  const [selectedRuleId, setSelectedRuleId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchRules = async () => {
    try {
      const res = await axios.get("/web/rules");
      setRules(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load rules.");
    }
  };

  useEffect(() => {
    fetchRules();
  }, []);

  useEffect(() => {
    let result = [...rules];
    if (search) {
      result = result.filter((r) =>
        r.name.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (filters.type) {
      result = result.filter((r) => r.type === filters.type);
    }
    if (filters.range) {
      result = result.filter((r) => r.range === filters.range);
    }
    setFiltered(result);
  }, [search, filters, rules]);

  const openModal = (id) => {
    setSelectedRuleId(id);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedRuleId(null);
    setIsModalOpen(false);
  };

  const handleSynchronizeAll = async () => {
    try {
      await axios.post("/web/rules/synchronize");
      toast.success("All rules synchronized!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to synchronize all rules.");
    }
  };

  return (
    <div className="p-6 text-white">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Rules</h1>
        <div className="flex gap-3">
          <button
            onClick={() => openModal(null)}
            className="bg-green-600 hover:bg-green-500 px-4 py-2 rounded"
          >
            Create Rule
          </button>
          <button
            onClick={handleSynchronizeAll}
            className="bg-purple-600 hover:bg-purple-500 px-4 py-2 rounded"
          >
            Synchronize All
          </button>
        </div>
      </div>
<RuleSummary rules={filtered} />

      <RuleFilters search={search} setSearch={setSearch} filters={filters} setFilters={setFilters} />
      <RulesTable rules={filtered} onViewRule={openModal} />

      <RuleModal
        isOpen={isModalOpen}
        ruleId={selectedRuleId}
        onClose={closeModal}
        refreshRules={fetchRules}
      />
    </div>
  );
};

export default Rules;
