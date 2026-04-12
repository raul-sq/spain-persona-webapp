import type { Filters } from "../types/persona";

type FilterBarProps = {
  filters: Filters;
  regions: string[];
  areaTypes: string[];
  ageGroups: string[];
  onChange: (key: keyof Filters, value: string) => void;
  onReset: () => void;
};

export default function FilterBar({
  filters,
  regions,
  areaTypes,
  ageGroups,
  onChange,
  onReset,
}: FilterBarProps) {
  return (
    <section className="rounded-[28px] border border-[#bfe8f3] bg-[#d9f0ec] p-6 shadow-sm">
      <div className="mb-5">
        <h2 className="text-2xl font-bold tracking-tight text-[#121b33]">
          Filters
        </h2>
      </div>

      <div className="flex flex-col gap-4 lg:flex-row lg:items-end">
        <div className="grid flex-1 gap-4 md:grid-cols-3">
          <label className="text-left">
            <span className="mb-2 block text-sm font-medium text-[#4b6275]">
              Region
            </span>
            <select
              value={filters.region}
              onChange={(e) => onChange("region", e.target.value)}
              className="w-full rounded-xl border border-[#b7dce8] bg-[#f7fbfc] px-4 py-3 text-sm text-[#121b33] outline-none transition focus:border-[#0ea5ea]"
            >
              <option>All</option>
              {regions.map((region) => (
                <option key={region}>{region}</option>
              ))}
            </select>
          </label>

          <label className="text-left">
            <span className="mb-2 block text-sm font-medium text-[#4b6275]">
              Area type
            </span>
            <select
              value={filters.areaType}
              onChange={(e) => onChange("areaType", e.target.value)}
              className="w-full rounded-xl border border-[#b7dce8] bg-[#f7fbfc] px-4 py-3 text-sm text-[#121b33] outline-none transition focus:border-[#0ea5ea]"
            >
              <option>All</option>
              {areaTypes.map((areaType) => (
                <option key={areaType}>{areaType}</option>
              ))}
            </select>
          </label>

          <label className="text-left">
            <span className="mb-2 block text-sm font-medium text-[#4b6275]">
              Age group
            </span>
            <select
              value={filters.ageGroup}
              onChange={(e) => onChange("ageGroup", e.target.value)}
              className="w-full rounded-xl border border-[#b7dce8] bg-[#f7fbfc] px-4 py-3 text-sm text-[#121b33] outline-none transition focus:border-[#0ea5ea]"
            >
              <option>All</option>
              {ageGroups.map((ageGroup) => (
                <option key={ageGroup}>{ageGroup}</option>
              ))}
            </select>
          </label>
        </div>

        <button
          onClick={onReset}
          className="rounded-xl border border-[#b7dce8] bg-[#f7fbfc] px-5 py-3 text-sm font-medium text-[#121b33] transition hover:border-[#0ea5ea]"
        >
          Reset filters
        </button>
      </div>
    </section>
  );
}