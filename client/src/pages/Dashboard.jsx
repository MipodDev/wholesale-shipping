// pages/Dashboard.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import RequestLogSummary from "../components/RequestLogSummary";

const SyncSummary = ({ summary }) => {
  if (!summary) return null;
  return (
    <div className="bg-zinc-800 p-6 rounded text-white">
      <h2 className=" font-bold text-lg">Sync Summary</h2>
      <p>
        The tables listed below have bulk synchronization procedures within the
        application.
      </p>
      <table className="w-full text-left mt-4 mb-6 border-collapse border border-zinc-600 text-white">
        <thead>
          <tr>
            <th className="border border-zinc-600 px-4 py-2">Table Name</th>
            <th className="border border-zinc-600 px-4 py-2">Status</th>
            <th className="border border-zinc-600 px-4 py-2">Last Modified</th>
          </tr>
        </thead>
        <AnimatePresence>
          <tbody>
            {summary.map((s) => (
              <motion.tr
                key={s._id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="border-b border-zinc-700 hover:bg-zinc-800"
              >
                <td className="border border-zinc-600 px-4 py-2">{s.table}</td>
                <td className="border border-zinc-600 px-4 py-2">{s.status}</td>
                <td className="border border-zinc-600 px-4 py-2">
                  {s.updatedAt}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </AnimatePresence>
      </table>
    </div>
  );
};

export default function Dashboard() {
  const [syncDetails, setSyncDetails] = useState(null);

  const fetchSyncDetails = async () => {
    try {
      const res = await axios.get("/web/summary/sync");
      setSyncDetails(res.data);
    } catch (err) {
      console.error("Failed to fetch sync summary:", err);
      toast.error("Failed to fetch sync summary");
    }
  };

  useEffect(() => {
    fetchSyncDetails();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-white text-2xl mb-6 font-bold">Dashboard</h1>
      <SyncSummary summary={syncDetails} />
      <div className="mt-10">
        <RequestLogSummary />
      </div>
    </div>
  );
}
