const RuleFilters = ({ search, setSearch, filters, setFilters }) => {
  return (
    <div className="flex gap-4 mb-4">
      <input
        type="text"
        placeholder="Search rule name..."
        className="bg-zinc-800 px-4 py-2 rounded text-white border border-zinc-700 w-full"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <select
        value={filters.type}
        onChange={(e) => setFilters({ ...filters, type: e.target.value })}
        className="bg-zinc-800 text-white px-3 py-2 rounded border border-zinc-700"
      >
        <option value="">All Types</option>
        <option value="Ban">Ban</option>
        <option value="Restriction">Restriction</option>
        <option value="Exemption">Exemption</option>
      </select>
      <select
        value={filters.range}
        onChange={(e) => setFilters({ ...filters, range: e.target.value })}
        className="bg-zinc-800 text-white px-3 py-2 rounded border border-zinc-700"
      >
        <option value="">All Ranges</option>
        <option value="State">State</option>
        <option value="City">City</option>
        <option value="Zip">Zip</option>
      </select>
    </div>
  );
};

export default RuleFilters;
