// components/StateFilters.jsx
import React, { useState, useMemo, useEffect } from "react";
import { exportToCSV } from "../utils/exportToCSV";

const RuleFilters = ({ rules = [], setFilteredRules }) => {
  const [query, setQuery] = useState("");
  const [rangeFilter, setRangeFilter] = useState("");
  const [stateFilter, setStateFilter] = useState("");

  const [listFilter, setListFilter] = useState("");

  const allStates = useMemo(
    () =>
      Array.from(
        new Set(
          rules.flatMap((r) =>
            Array.isArray(r?.states) ? r.states.map((state) => state.name) : []
          )
        )
      ),
    [rules]
  );

  const allLists = useMemo(
    () =>
      Array.from(
        new Set(
          rules.flatMap((r) =>
            Array.isArray(r?.lists) ? r.lists.map((list) => list.name) : []
          )
        )
      ),
    [rules]
  );

  const allRanges = useMemo(
    () =>
      Array.from(new Set((rules || []).map((s) => s?.range).filter(Boolean))),
    [rules]
  );

  const applyFilters = () => {
    let result = [...rules];
    if (query) {
      const q = query.toLowerCase();
      result = result.filter(
        (s) =>
          s.name.toLowerCase().includes(q) || s.code.toLowerCase().includes(q)
      );
    }
    if (rangeFilter) {
      result = result.filter((r) => r.range === rangeFilter);
    }
    if (stateFilter) {
      result = result.filter((r) =>
        r.states?.some((s) => s.name === stateFilter)
      );
      result = result.filter(
        (r) =>
          Array.isArray(r.states) &&
          r.states.some((s) => stateFilter.includes(s.name))
      );
    }
    if (listFilter) {
      result = result.filter(
        (r) =>
          Array.isArray(r.lists) &&
          r.lists.some((list) => listFilter.includes(list.name))
      );
    }
    setFilteredRules(result);
  };
  useEffect(() => {
    applyFilters();
  }, [query, rangeFilter, stateFilter, listFilter, rules]);

  const clearFilters = () => {
    setQuery("");
    setRangeFilter("");
    setStateFilter("");
    setListFilter("");
    setFilteredRules(rules);
  };

  return (
    <div className="bg-white/60 backdrop-blur-md border border-gray-200 rounded-lg p-4 mb-4 shadow-inner">
      <div className="flex flex-wrap gap-4 items-center">
        <input
          type="text"
          placeholder="Search by name or code"
          className="border p-2 rounded w-60"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
          }}
        />

        <select
          className="no-caret border p-2 rounded"
          value={rangeFilter}
          onChange={(e) => {
            setRangeFilter(e.target.value);
          }}
        >
          <option value="">All Ranges</option>
          {allRanges.map((range) => (
            <option key={range} value={range}>
              {range}
            </option>
          ))}
        </select>

        <select
          className="no-caret border p-2 rounded"
          value={stateFilter}
          onChange={(e) => {
            setStateFilter(e.target.value);
          }}
        >
          <option value="">All States</option>
          {allStates.map((state) => (
            <option key={state} value={state}>
              {state}
            </option>
          ))}
        </select>

        <select
          className="no-caret border p-2 rounded"
          value={listFilter}
          onChange={(e) => {
            setListFilter(e.target.value);
          }}
        >
          <option value="">All Product Lists</option>
          {allLists.map((list) => (
            <option key={list} value={list}>
              {list}
            </option>
          ))}
        </select>

        <button
          onClick={clearFilters}
          className="no-caret bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
        >
          Clear
        </button>
        <button
          onClick={() => exportToCSV(rules, "FilteredRules.csv")}
          className="no-caret bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Export to CSV
        </button>
      </div>
    </div>
  );
};

export default RuleFilters;
