import { motion } from "framer-motion";

const ServicesList = ({ services = [], onView }) => {
  if (!Array.isArray(services)) return null;

  return (
    <div className="no-caret grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {services.map((s) => (
        <motion.div
          key={s.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="bg-white/80 backdrop-blur-md shadow-md hover:shadow-lg transition rounded-xl p-6 border border-gray-200"
        >
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-gray-800 mb-1">{s.name}</h2>
            <p className="text-sm text-gray-600 italic">{s.description}</p>
          </div>

          <div className="space-y-2 text-sm text-gray-700">
            <div>
              <span className="font-semibold">States: </span>
              <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded text-xs font-medium">
                {s.provinces?.length ?? 0}
              </span>
            </div>
            <div>
              <span className="font-semibold">Base Price: </span>$
              {(s.price / 100).toFixed(2)}
            </div>
            <div>
              <span className="font-semibold">Min Order: </span>$
              {(s.minimum_order_value / 100).toFixed(2)}
            </div>
            <div>
              <span className="font-semibold">Per Box Value: </span>
              {s.per_box_value_set ?? "N/A"}
            </div>
            <div>
              <span className="font-semibold">Zip Codes: </span>
              {s.for_zips?.length ?? 0}
            </div>
            <div>
              <span className="font-semibold">Mapped Carrier: </span>
              {s.mapped_carrier || "—"}
            </div>
            <div>
              <span className="font-semibold">Service Name: </span>
              {s.service_name}
            </div>
            <div>
              <span className="font-semibold">Service Code: </span>
              <code className="bg-gray-100 px-1 rounded text-xs">{s.service_code}</code>
            </div>
            <div>
              <span className="font-semibold">Service ID: </span>
              <code className="text-xs text-gray-600 break-all">{s.id}</code>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default ServicesList;
