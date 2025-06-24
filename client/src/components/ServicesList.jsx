// ServicesList.jsx
import { motion } from "framer-motion";

const ServicesList = ({ services = [], onView }) => {
  if (!Array.isArray(services)) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {services.map((s) => (
        <motion.div
          key={s.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="bg-zinc-900 border border-zinc-700 hover:shadow-md transition rounded-2xl p-6 shadow-inner"
        >
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-white">{s.name}</h2>
            <p className="text-sm text-zinc-400 italic">{s.description}</p>
          </div>

          <div className="space-y-2 text-sm text-zinc-300">
            <div>
              <span className="font-semibold text-white">States:</span>{" "}
              <span className="bg-purple-700/20 text-purple-300 px-2 py-0.5 rounded text-xs font-medium">
                {s.provinces?.length ?? 0}
              </span>
            </div>
            <div>
              <span className="font-semibold text-white">Base Price:</span> $
              {(s.price / 100).toFixed(2)}
            </div>
            <div>
              <span className="font-semibold text-white">Min Order:</span> $
              {(s.minimum_order_value / 100).toFixed(2)}
            </div>
            <div>
              <span className="font-semibold text-white">Per Box Value:</span>{" "}
              {s.per_box_value_set ?? "—"}
            </div>
            <div>
              <span className="font-semibold text-white">Zip Codes:</span>{" "}
              {s.for_zips?.length ?? 0}
            </div>
            <div>
              <span className="font-semibold text-white">Mapped Carrier:</span>{" "}
              {s.mapped_carrier || "—"}
            </div>
            <div>
              <span className="font-semibold text-white">Service Name:</span>{" "}
              {s.service_name}
            </div>
            <div>
              <span className="font-semibold text-white">Service Code:</span>{" "}
              <code className="bg-zinc-800 px-2 py-0.5 rounded text-xs text-purple-300">
                {s.service_code}
              </code>
            </div>
            <div>
              <span className="font-semibold text-white">Service ID:</span>{" "}
              <code className="text-xs text-zinc-400 break-all">{s.id}</code>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default ServicesList;
