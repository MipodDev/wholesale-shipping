import React, { useState, useEffect } from "react";
import { exportToCSV } from "../utils/exportToCSV";

const StateFilters = ({ originalStates, setFilteredStates }) => {
  const [query, setQuery] = useState("");

  useEffect(() => {
    setFilteredStates(originalStates);
  }, [originalStates, setFilteredStates]);

  const handleSearch = (e) => {
    const q = e.target.value.toLowerCase();
    setQuery(q);
    setFilteredStates(
      originalStates.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.code.toLowerCase().includes(q)
      )
    );
  };

  return (
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
      <input
        type="text"
        placeholder="Search by name or code"
        className="border p-2 rounded w-full md:w-64"
        value={query}
        onChange={handleSearch}
      />
      <button
        onClick={() => exportToCSV(originalStates, "FilteredStates.csv")}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Export to CSV
      </button>
    </div>
  );
};

export default StateFilters;
