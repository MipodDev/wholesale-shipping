import { useEffect, useState } from "react";
import Select from "react-select";
import axios from "axios";
import { toast } from "react-toastify";

const ProductFilters = ({ filters, setFilters, pagination, setPagination }) => {
  const [options, setOptions] = useState({
    statuses: [],
    categories: [],
    tags: [],
  });
  const [localFilters, setLocalFilters] = useState(filters);
  const filtersEqual = (a, b) => {
    return (
      a.query === b.query &&
      JSON.stringify(a.status) === JSON.stringify(b.status) &&
      JSON.stringify(a.category) === JSON.stringify(b.category) &&
      JSON.stringify(a.tags) === JSON.stringify(b.tags)
    );
  };

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const res = await axios.get("/web/products/filters");
        setOptions(res.data);
      } catch (err) {
        console.error("Failed loading filter options", err);
              toast.error("Failed loading filter options.");

      }
    };
    fetchOptions();
  }, []);

  useEffect(() => {
    setLocalFilters(filters); // Keep local filters in sync with applied filters
  }, [filters]);

  const handleClear = () => {
    const cleared = { query: "", status: [], category: [], tags: [] };
    setLocalFilters(cleared);
    setFilters(cleared);
    setPagination({ skip: 0, limit: pagination.limit });
  };

  const handleReset = () => {
    setLocalFilters(filters); // Reset local filter changes to current applied values
  };

  const handleApply = () => {
    setFilters(localFilters);
    setPagination({ skip: 0, limit: pagination.limit });
  };

  const selectStyle = {
    control: (base) => ({
      ...base,
      backgroundColor: "#1c1c1c",
      borderColor: "#3f3f46",
      color: "#fff",
    }),
    menu: (base) => ({
      ...base,
      backgroundColor: "#1c1c1c",
      color: "#fff",
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isFocused ? "#3f3f46" : "#1c1c1c",
      color: "#fff",
      cursor: "pointer",
    }),
    multiValue: (base) => ({ ...base, backgroundColor: "#4f46e5" }),
    multiValueLabel: (base) => ({ ...base, color: "#fff" }),
    placeholder: (base) => ({ ...base, color: "#9ca3af" }),
    input: (base) => ({ ...base, color: "#fff" }),
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl shadow space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <input
          className="bg-zinc-800 text-white border border-zinc-600 rounded px-4 py-2 w-full"
          type="text"
          placeholder="Search by title or SKU..."
          value={localFilters.query}
          onChange={(e) =>
            setLocalFilters({ ...localFilters, query: e.target.value })
          }
        />
        <Select
          isMulti
          styles={selectStyle}
          options={options.statuses.map((s) => ({ label: s, value: s }))}
          value={localFilters.status.map((s) => ({ label: s, value: s }))}
          onChange={(vals) =>
            setLocalFilters({
              ...localFilters,
              status: vals.map((v) => v.value),
            })
          }
          placeholder="Status"
        />
        <Select
          isMulti
          styles={selectStyle}
          options={options.categories.map((c) => ({
            label: c || "Uncategorized",
            value: c,
          }))}
          value={localFilters.category.map((c) => ({
            label: c || "Uncategorized",
            value: c,
          }))}
          onChange={(vals) =>
            setLocalFilters({
              ...localFilters,
              category: vals.map((v) => v.value),
            })
          }
          placeholder="Category"
        />
        <Select
          isMulti
          styles={selectStyle}
          options={options.tags.map((t) => ({ label: t, value: t }))}
          value={localFilters.tags.map((t) => ({ label: t, value: t }))}
          onChange={(vals) =>
            setLocalFilters({ ...localFilters, tags: vals.map((v) => v.value) })
          }
          placeholder="Tags"
        />
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-2">
        <select
          className="bg-zinc-800 text-white border border-zinc-600 rounded px-3 py-2"
          value={pagination.limit}
          onChange={(e) =>
            setPagination((prev) => ({
              ...prev,
              limit: parseInt(e.target.value),
              skip: 0,
            }))
          }
        >
          {[25, 50, 100, 250].map((size) => (
            <option key={size} value={size}>
              {size} per page
            </option>
          ))}
        </select>

        <div className="flex gap-2 justify-end">
          <button
            onClick={handleClear}
            className="bg-zinc-700 hover:bg-zinc-600 text-white px-4 py-2 rounded-md"
          >
            Clear
          </button>
          <button
            onClick={handleReset}
            disabled={filtersEqual(localFilters, filters)}
            className={`px-4 py-2 rounded-md ${
              filtersEqual(localFilters, filters)
                ? "bg-zinc-800 text-zinc-400 cursor-not-allowed"
                : "bg-zinc-700 hover:bg-zinc-600 text-white"
            }`}
          >
            Reset
          </button>
          <button
            onClick={handleApply}
            className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-md"
          >
            Apply Search
          </button>
          <button
            onClick={async () => {
              try {
                const res = await axios.post("/api/products/synchronize/B2B");
                toast.success(res.data.message); // Or use a toast if you prefer
              } catch (err) {
                console.error("Synchronization failed", err);
                toast.error("Failed to synchronize products.");
              }
            }}
            className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-md"
          >
            Synchronize
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductFilters;
