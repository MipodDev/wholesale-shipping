// components/StateFilters.jsx
import React, { useState, useMemo, useEffect } from "react";
import { exportToCSV } from "../utils/exportToCSV";

const StateFilters = ({ states = [], setFilteredStates }) => {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [ruleFilter, setRuleFilter] = useState("");
  const [serviceFilter, setServiceFilter] = useState("");

  const allRules = useMemo(
    () =>
      Array.from(
        new Set(
          states.flatMap((s) =>
            Array.isArray(s?.rules) ? s.rules.map((rule) => rule.name) : []
          )
        )
      ),
    [states]
  );

  const allServices = useMemo(
    () =>
      Array.from(
        new Set(
          states.flatMap((s) =>
            Array.isArray(s?.services) ? s.services.map((svc) => svc.name) : []
          )
        )
      ),
    [states]
  );

  const allStatuses = useMemo(
    () =>
      Array.from(new Set((states || []).map((s) => s?.status).filter(Boolean))),
    [states]
  );

  const applyFilters = () => {
    let result = [...states];
    if (query) {
      const q = query.toLowerCase();
      result = result.filter(
        (s) =>
          s.name.toLowerCase().includes(q) || s.code.toLowerCase().includes(q)
      );
    }
    if (statusFilter) {
      result = result.filter((s) => s.status === statusFilter);
    }
    if (ruleFilter) {
      result = result.filter((s) =>
        s.rules?.some((r) => r.name === ruleFilter)
      );
      result = result.filter(
        (s) =>
          Array.isArray(s.rules) &&
          s.rules.some((r) => ruleFilter.includes(r.name))
      );
    }
    if (serviceFilter) {
      result = result.filter(
        (s) =>
          Array.isArray(s.services) &&
          s.services.some((svc) => serviceFilter.includes(svc.name))
      );
    }
    setFilteredStates(result);
  };
  useEffect(() => {
    applyFilters();
  }, [query, statusFilter, ruleFilter, serviceFilter, states]);

  const clearFilters = () => {
    setQuery("");
    setStatusFilter("");
    setRuleFilter("");
    setServiceFilter("");
    setFilteredStates(states);
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
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
          }}
        >
          <option value="">All Statuses</option>
          {allStatuses.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>

        <select
          className="no-caret border p-2 rounded"
          value={ruleFilter}
          onChange={(e) => {
            setRuleFilter(e.target.value);
          }}
        >
          <option value="">All Rules</option>
          {allRules.map((rule) => (
            <option key={rule} value={rule}>
              {rule}
            </option>
          ))}
        </select>

        <select
          className="no-caret border p-2 rounded"
          value={serviceFilter}
          onChange={(e) => {
            setServiceFilter(e.target.value);
          }}
        >
          <option value="">All Services</option>
          {allServices.map((service) => (
            <option key={service} value={service}>
              {service}
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
          onClick={() => exportToCSV(states, "FilteredStates.csv")}
          className="no-caret bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Export to CSV
        </button>
      </div>
    </div>
  );
};

export default StateFilters;
