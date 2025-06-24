// components/ProductSummary.jsx
import { FaBoxes, FaTags, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const iconColors = {
  total: "bg-zinc-500",
  active: "bg-green-600",
  inactive: "bg-red-600",
  unclassified: "bg-yellow-500",
};

const SummaryCard = ({ icon: Icon, label, value, colorKey, isLoading }) => (
  <div className="flex items-center gap-3 bg-zinc-800 p-4 rounded-xl border border-zinc-700 shadow-sm">
    <div className={`${iconColors[colorKey]} text-white p-2 rounded-full`}>
      <Icon className="h-5 w-5" />
    </div>
    <div>
      <div className="text-xs uppercase text-zinc-400 font-bold">{label}</div>
      {isLoading ? (
        <div className="h-6 w-10 bg-zinc-700 rounded animate-pulse mt-1" />
      ) : (
        <AnimatePresence mode="wait">
          <motion.div
            key={value}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="text-lg text-white"
          >
            {value}
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  </div>
);

const ProductSummary = ({ summary = {}, isLoading = false }) => {
  const { total = 0, active = 0, inactive = 0, unclassified = 0 } = summary;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
      <SummaryCard icon={FaBoxes} label="Total" value={total} colorKey="total" isLoading={isLoading} />
      <SummaryCard icon={FaCheckCircle} label="Active" value={active} colorKey="active" isLoading={isLoading} />
      <SummaryCard icon={FaTimesCircle} label="Inactive" value={inactive} colorKey="inactive" isLoading={isLoading} />
      <SummaryCard icon={FaTags} label="Unclassified" value={unclassified} colorKey="unclassified" isLoading={isLoading} />
    </div>
  );
};

export default ProductSummary;
