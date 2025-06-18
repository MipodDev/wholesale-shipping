import { useState, useMemo, useEffect } from "react";
import { exportToCSV } from "../utils/exportToCSV";
import { FiRefreshCw, FiDownload } from "react-icons/fi";

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
            Array.isArray(r?.states) ? r.states.map((s) => s.name) : []
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
            Array.isArray(r?.lists) ? r.lists.map((l) => l.name) : []
          )
        )
      ),
    [rules]
  );

  const allRanges = useMemo(
    () =>
      Array.from(new Set((rules || []).map((r) => r?.range).filter(Boolean))),
    [rules]
  );

  const applyFilters = () => {
    let result = [...rules];
    if (query) {
      const q = query.toLowerCase();
      result = result.filter(
        (r) =>
          r.name.toLowerCase().includes(q) ||
          r.code.toLowerCase().includes(q)
      );
    }
    if (rangeFilter) {
      result = result.filter((r) => r.range === rangeFilter);
    }
    if (stateFilter) {
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
          r.lists.some((l) => listFilter.includes(l.name))
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
    <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-4 mb-4 shadow-sm">
      <div className="flex flex-wrap gap-4 items-center">
        <input
          type="text"
          placeholder="🔍 Search name or code"
          className="bg-zinc-800 text-white placeholder-zinc-400 px-4 py-2 rounded-md border border-zinc-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        <select
          className="bg-zinc-800 text-white px-4 py-2 rounded-md border border-zinc-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
          value={rangeFilter}
          onChange={(e) => setRangeFilter(e.target.value)}
        >
          <option value="">All Ranges</option>
          {allRanges.map((range) => (
            <option key={range} value={range}>
              {range}
            </option>
          ))}
        </select>

        <select
          className="bg-zinc-800 text-white px-4 py-2 rounded-md border border-zinc-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
          value={stateFilter}
          onChange={(e) => setStateFilter(e.target.value)}
        >
          <option value="">All States</option>
          {allStates.map((state) => (
            <option key={state} value={state}>
              {state}
            </option>
          ))}
        </select>

        <select
          className="bg-zinc-800 text-white px-4 py-2 rounded-md border border-zinc-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
          value={listFilter}
          onChange={(e) => setListFilter(e.target.value)}
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
          className="flex items-center gap-2 bg-zinc-700 hover:bg-zinc-600 text-white px-4 py-2 rounded-md transition"
        >
          <FiRefreshCw className="text-purple-400" />
          Clear
        </button>

        <button
          onClick={() => exportToCSV(rules, "FilteredRules.csv")}
          className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md transition"
        >
          <FiDownload />
          Export CSV
        </button>
      </div>
    </div>
  );
};

export default RuleFilters;
