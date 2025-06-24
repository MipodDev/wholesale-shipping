import React, { useState, useMemo, useEffect } from "react";
import { exportToCSV } from "../utils/exportToCSV";
import { FiRefreshCw, FiDownload, FiRepeat } from "react-icons/fi";
import axios from "axios";
import { toast } from "react-toastify";

const StateFilters = ({ states = [], setFilteredStates }) => {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [ruleFilter, setRuleFilter] = useState("");
  const [serviceFilter, setServiceFilter] = useState("");

  const allRules = useMemo(
    () =>
      Array.from(
        new Set(states.flatMap((s) => s?.rules?.map((r) => r.name) || []))
      ),
    [states]
  );

  const allServices = useMemo(
    () =>
      Array.from(
        new Set(
          states.flatMap((s) => s?.services?.map((svc) => svc.name) || [])
        )
      ),
    [states]
  );

  const allStatuses = useMemo(
    () => Array.from(new Set(states.map((s) => s?.status).filter(Boolean))),
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
    }

    if (serviceFilter) {
      result = result.filter((s) =>
        s.services?.some((svc) => svc.name === serviceFilter)
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

  const handleSynchronize = async () => {
    try {
      const res = await axios.post("/api/states/synchronize");
      toast.success(res.data.message || "Rules Synchronized!");
    } catch (err) {
      toast.error("Synchronization failed:", err);
      alert("Failed to initiate synchronization.");
    }
  };

  return (
    <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-4 mb-4 shadow-sm">
      <div className="flex flex-wrap gap-4 items-center">
        <input
          type="text"
          placeholder="🔍 Search by name or code"
          className="bg-zinc-800 text-white placeholder-zinc-400 px-4 py-2 rounded-md border border-zinc-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        <select
          className="bg-zinc-800 text-white px-4 py-2 rounded-md border border-zinc-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All Statuses</option>
          {allStatuses.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>

        <select
          className="bg-zinc-800 text-white px-4 py-2 rounded-md border border-zinc-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
          value={ruleFilter}
          onChange={(e) => setRuleFilter(e.target.value)}
        >
          <option value="">All Rules</option>
          {allRules.map((rule) => (
            <option key={rule} value={rule}>
              {rule}
            </option>
          ))}
        </select>

        <select
          className="bg-zinc-800 text-white px-4 py-2 rounded-md border border-zinc-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
          value={serviceFilter}
          onChange={(e) => setServiceFilter(e.target.value)}
        >
          <option value="">All Services</option>
          {allServices.map((svc) => (
            <option key={svc} value={svc}>
              {svc}
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
          onClick={() => exportToCSV(states, "FilteredStates.csv")}
          className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md transition"
        >
          <FiDownload />
          Export CSV
        </button>

        <button
          onClick={handleSynchronize}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-md transition"
        >
          <FiRepeat />
          Synchronize
        </button>
      </div>
    </div>
  );
};

export default StateFilters;
