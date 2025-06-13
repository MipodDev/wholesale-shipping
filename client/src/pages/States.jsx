// /pages/States.jsx
import StateSummary from "../components/StateSummary";
import StateFilters from "../components/StateFilters";
import StatesTable from "../components/StatesTable";
import StateModal from "../components/StateModal";
import { useEffect, useState } from "react";
import axios from "axios";

const StatesPage = () => {
  const [allStates, setAllStates] = useState([]);
  const [filteredStates, setFilteredStates] = useState([]);
  const [selectedState, setSelectedState] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const loadStates = async () => {
    const res = await axios.get("/web/states");
    const cleaned = res.data.map((state) => ({
      ...state,
      services: Array.isArray(state.services) ? state.services : [],
      rules: Array.isArray(state.rules) ? state.rules : [],
    }));
    setAllStates(cleaned);
    setFilteredStates(cleaned);
  };

  useEffect(() => {
    loadStates();
  }, []);

  return (
    <div className="p-4 space-y-6">
      <StateSummary states={allStates} />
      <StateFilters states={allStates} setFilteredStates={setFilteredStates} />
      <StatesTable
        states={filteredStates}
        onView={(stateCode) => {
          setSelectedState(stateCode);
          setIsModalOpen(true);
        }}
      />
      <StateModal
        isOpen={isModalOpen}
        stateCode={selectedState}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default StatesPage;
