// /pages/Rules.jsx
import RuleSummary from "../components/RuleSummary";
import RuleFilters from "../components/RuleFilters";
import RulesTable from "../components/RulesTable";
import RuleModal from "../components/RuleModal";
import { useEffect, useState } from "react";
import axios from "axios";

const RulesPage = () => {
  const [allRules, setAllRules] = useState([]);
  const [filteredRules, setFilteredRules] = useState([]);
  const [selectedRule, setSelectedRule] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const loadRules = async () => {
    const res = await axios.get("/web/rules");
    const cleaned = res.data.map((rule) => ({
      ...rule
    }));
    setAllRules(cleaned);
    setFilteredRules(cleaned);
  };

  useEffect(() => {
    loadRules();
  }, []);

  return (
    <div className="p-4 space-y-6">
      <RuleSummary rules={allRules} />
      <RuleFilters rules={allRules} setFilteredRules={setFilteredRules} />
      <RulesTable
        rules={filteredRules}
        onView={(ruleId) => {
          setSelectedRule(ruleId);
          setIsModalOpen(true);
        }}
      />
      <RuleModal
        isOpen={isModalOpen}
        ruleId={selectedRule}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default RulesPage;
