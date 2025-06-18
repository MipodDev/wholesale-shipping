import { FiCheckCircle, FiXCircle, FiMap } from "react-icons/fi";
import { MdGavel } from "react-icons/md";
import CountUp from "react-countup";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const InfoCard = ({ label, icon, value, color, loading }) => (
  <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-4 flex items-center gap-4 w-full sm:w-60">
    <div className={`text-2xl ${color}`}>{icon}</div>
    <div>
      <div className="text-zinc-400 text-sm">{label}</div>
      <div className="text-white text-xl font-semibold">
        {loading ? <Skeleton width={50} /> : <CountUp end={value} duration={1.5} />}
      </div>
    </div>
  </div>
);

const StateSummary = ({ states = [], isLoading }) => {
  const total = states?.length || 0;
  const enabled = states?.filter((s) => s.status === "enabled")?.length || 0;
  const disabled = states?.filter((s) => s.status === "disabled")?.length || 0;
  const withRules = states?.filter((s) => s.rules?.length > 0)?.length || 0;

  return (
    <div className="flex flex-wrap gap-4 mb-6">
      <InfoCard
        label="Total States"
        value={total}
        icon={<FiMap />}
        color="text-zinc-400"
        loading={isLoading}
      />
      <InfoCard
        label="Enabled"
        value={enabled}
        icon={<FiCheckCircle />}
        color="text-green-400"
        loading={isLoading}
      />
      <InfoCard
        label="Disabled"
        value={disabled}
        icon={<FiXCircle />}
        color="text-red-400"
        loading={isLoading}
      />
      <InfoCard
        label="With Rules"
        value={withRules}
        icon={<MdGavel />}
        color="text-yellow-400"
        loading={isLoading}
      />
    </div>
  );
};

export default StateSummary;
