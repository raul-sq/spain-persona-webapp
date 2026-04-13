import type { Filters } from "../types/persona";
import { translateUiValue } from "../utils/translations";

type FilterBarProps = {
  filters: Filters;
  areaTypes: string[];
  ageGroups: string[];
  onChange: (key: keyof Filters, value: string) => void;
  onReset: () => void;
};

export default function FilterBar({
  filters,
  areaTypes,
  ageGroups,
  onChange,
  onReset,
}: FilterBarProps) {
  return (
    <div className="flex h-full flex-col">
      <div className="mb-4 rounded-[20px] border border-[#b7dce8] bg-[#f7fbfc] p-3">
        <p className="text-sm font-medium text-[#4b6275]">Región seleccionada</p>
        <p className="mt-1 text-lg font-semibold text-[#121b33]">
          {translateUiValue(filters.region)}
        </p>
      </div>

      <div className="flex flex-col gap-3 lg:flex-row lg:items-end">
        <div className="grid flex-1 gap-3 md:grid-cols-2">
          <label className="text-left">
            <span className="mb-2 block text-sm font-medium text-[#4b6275]">
              Tipo de área
            </span>
            <select
              value={filters.areaType}
              onChange={(e) => onChange("areaType", e.target.value)}
              className="w-full rounded-xl border border-[#b7dce8] bg-[#f7fbfc] px-3 py-2 text-sm text-[#121b33] outline-none transition focus:border-[#0ea5ea]"
            >
              <option value="All">{translateUiValue("All")}</option>
              {areaTypes.map((areaType) => (
                <option key={areaType} value={areaType}>
                  {translateUiValue(areaType)}
                </option>
              ))}
            </select>
          </label>

          <label className="text-left">
            <span className="mb-2 block text-sm font-medium text-[#4b6275]">
              Grupo de edad
            </span>
            <select
              value={filters.ageGroup}
              onChange={(e) => onChange("ageGroup", e.target.value)}
              className="w-full rounded-xl border border-[#b7dce8] bg-[#f7fbfc] px-3 py-2 text-sm text-[#121b33] outline-none transition focus:border-[#0ea5ea]"
            >
              <option value="All">{translateUiValue("All")}</option>
              {ageGroups.map((ageGroup) => (
                <option key={ageGroup} value={ageGroup}>
                  {translateUiValue(ageGroup)}
                </option>
              ))}
            </select>
          </label>
        </div>

        <button
          onClick={onReset}
          className="rounded-xl border border-[#b7dce8] bg-[#f7fbfc] px-4 py-2 text-sm font-medium text-[#121b33] transition hover:border-[#0ea5ea] lg:self-end"
        >
          Restablecer filtros
        </button>
      </div>
    </div>
  );
}