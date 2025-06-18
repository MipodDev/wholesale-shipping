import { FaBan, FaCheckCircle, FaExclamationTriangle, FaBalanceScale } from "react-icons/fa";

const RuleSummary = ({ rules }) => {
  if (!Array.isArray(rules)) return null;

  const total = rules.length;
  const bans = rules.filter((r) => r.type.toLowerCase() === "ban").length;
  const exemptions = rules.filter((r) => r.type.toLowerCase() === "exemption").length;
  const registries = rules.filter((r) => r.type.toLowerCase() === "registry").length;

  const cardClass =
    "flex items-center justify-between bg-zinc-900 border border-zinc-700 text-white rounded-xl px-5 py-4 shadow";

  const iconClass = "text-3xl";

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <div className={cardClass}>
        <div>
          <p className="text-sm text-zinc-400">Total Rules</p>
          <p className="text-2xl font-bold">{total}</p>
        </div>
        <FaBalanceScale className={`${iconClass} text-zinc-400`} />
      </div>

      <div className={cardClass}>
        <div>
          <p className="text-sm text-zinc-400">Bans</p>
          <p className="text-2xl font-bold text-red-400">{bans}</p>
        </div>
        <FaBan className={`${iconClass} text-red-400`} />
      </div>

      <div className={cardClass}>
        <div>
          <p className="text-sm text-zinc-400">Registries</p>
          <p className="text-2xl font-bold text-amber-400">{registries}</p>
        </div>
        <FaExclamationTriangle className={`${iconClass} text-amber-400`} />
      </div>

      <div className={cardClass}>
        <div>
          <p className="text-sm text-zinc-400">Exemptions</p>
          <p className="text-2xl font-bold text-green-400">{exemptions}</p>
        </div>
        <FaCheckCircle className={`${iconClass} text-green-400`} />
      </div>
    </div>
  );
};

export default RuleSummary;
