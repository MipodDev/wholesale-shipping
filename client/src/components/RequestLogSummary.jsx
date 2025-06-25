import React, { useEffect, useState } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import LoggedRequestModal from "./LoggedRequestModal";
ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function RequestLogSummary() {
  const [data, setData] = useState(null);
  const [selectedLog, setSelectedLog] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    axios.get("/web/summary/logs").then((res) => setData(res.data));
  }, []);

  const openModal = async (id) => {
    const res = await axios.get(`/web/summary/logs/${id}`);
    setSelectedLog(res.data);
    setModalOpen(true);
  };

  if (!data) return <div className="text-white">Loading log summary...</div>;

  const chartData = {
    labels: ["Approved + No Rules", "Approved + Rules", "Denied"],
    datasets: [
      {
        label: "Request Volume",
        data: [
          data.chart.approved_no_rules,
          data.chart.approved_with_rules,
          data.chart.denied_with_rules,
        ],
        backgroundColor: "#3b82f6",
      },
    ],
  };

  return (
    <div className="bg-zinc-800 p-6 rounded text-white">
      <h2 className="text-lg font-bold mb-2">📦 Request Log Summary</h2>

      {/* Request Counts */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Stat label="Requests (24h)" value={data.count24h} />
        <Stat label="Requests (7d)" value={data.count7d} />
        <Stat label="Requests (30d)" value={data.count30d} />
        <Stat label="Denied (24h)" value={data.denied24h} />
      </div>

      {/* Last 10 Table */}
      <div className="mt-6">
        <h3 className="font-semibold mb-2">Last 10 Requests</h3>
        <table className="w-full text-sm border border-zinc-600">
          <thead className="bg-zinc-700">
            <tr>
              <th className="px-2 py-1 border">Site</th>
              <th className="px-2 py-1 border">Type</th>
              <th className="px-2 py-1 border">Approved</th>
              <th className="px-2 py-1 border">Rules</th>
              <th className="px-2 py-1 border">Time</th>
              <th className="px-2 py-1 border">View</th>
            </tr>
          </thead>
          <tbody>
            {data.last10.map((log) => (
              <tr
                key={log._id}
                className="border-t border-zinc-700 text-center"
              >
                <td className="px-2 py-1">{log.site}</td>
                <td className="px-2 py-1">{log.type}</td>
                <td className="px-2 py-1">
                  {log.approval?.allow ? "✅" : "❌"}
                </td>
                <td className="px-2 py-1">{log.rules?.length}</td>
                <td className="px-2 py-1">
                  {new Date(log.createdAt).toLocaleString()}
                </td>
                <td className="px-2 py-1">
                  <button
                    className="text-blue-400 underline hover:text-blue-300"
                    onClick={() => openModal(log._id)}
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Chart */}
      <div className="mb-6">
        <h3 className="font-semibold mb-2">Approval Outcomes (Last 30d)</h3>
        <Bar data={chartData} />
      </div>

      <LoggedRequestModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        log={selectedLog}
      />
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="bg-zinc-700 p-4 rounded text-center">
      <div className="text-sm">{label}</div>
      <div className="text-2xl font-bold">{value}</div>
    </div>
  );
}
