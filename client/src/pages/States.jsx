import StateSummary from "../components/StateSummary";
import StateFilters from "../components/StateFilters";
import StatesTable from "../components/StatesTable";
import StateModal from "../components/StateModal";
import { useEffect, useState } from "react";
import axios from "axios";

const StatesPage = () => {
  const [states, setStates] = useState([]);
  const [filteredStates, setFilteredStates] = useState([]);
  const [selectedState, setSelectedState] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const loadStates = async () => {
    const res = await axios.get("/web/states");
    console.log(res);
    setStates(res.data);
    setFilteredStates(res.data);
  };

  useEffect(() => {
    loadStates();
  }, []);

  return (
    <div className="p-4 space-y-6">
      <StateSummary states={states} />
      <StateFilters
        states={states}
        setFilteredStates={setFilteredStates}
      />
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
