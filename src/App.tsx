import { useMemo, useState } from "react";
import FilterBar from "./components/FilterBar";
import SnapshotCard from "./components/SnapshotCard";
import AgeChart from "./components/AgeChart";
import ChannelChart from "./components/ChannelChart";
import realPersonaData from "./data/realPersonaData.json";
import {
  buildAgeChart,
  buildChannelChart,
  buildSnapshot,
  filterSegments,
  getFilterOptions,
} from "./services/personaService";
import type { Filters, PersonaSegment } from "./types/persona";

const initialFilters: Filters = {
  region: "All",
  areaType: "All",
  ageGroup: "All",
};

function getDominantSegment(data: PersonaSegment[]): PersonaSegment | null {
  if (data.length === 0) {
    return null;
  }

  return data.reduce((largest, current) =>
    current.size > largest.size ? current : largest
  );
}

function formatSelectedSegment(filters: Filters): string {
  return [filters.region, filters.areaType, filters.ageGroup].join(" · ");
}

function formatTypicalProfile(segment: PersonaSegment | null): string {
  if (!segment) {
    return "—";
  }

  return [
    segment.genderTop,
    segment.educationTop,
    segment.socioeconomicTierTop,
    segment.readingFrequencyTop,
  ].join(" · ");
}

export default function App() {
  const [filters, setFilters] = useState<Filters>(initialFilters);

  const typedData = realPersonaData as PersonaSegment[];

  const options = useMemo(() => getFilterOptions(typedData), [typedData]);

  const filteredData = useMemo(
    () => filterSegments(typedData, filters),
    [typedData, filters]
  );

  const snapshot = useMemo(() => buildSnapshot(filteredData), [filteredData]);
  const ageChartData = useMemo(() => buildAgeChart(filteredData), [filteredData]);
  const channelChartData = useMemo(
    () => buildChannelChart(filteredData),
    [filteredData]
  );

  const dominantSegment = useMemo(
    () => getDominantSegment(filteredData),
    [filteredData]
  );

  function handleFilterChange(key: keyof Filters, value: string) {
    setFilters((current) => ({
      ...current,
      [key]: value,
    }));
  }

  function handleReset() {
    setFilters(initialFilters);
  }

  const compactNumber = new Intl.NumberFormat("en", {
    notation: "compact",
    maximumFractionDigits: 1,
  });

  return (
    <div className="min-h-screen bg-[#f3f6f7] text-[#121b33]">
      <main className="mx-auto max-w-6xl p-8">
        <header className="mb-8">
          <p className="text-sm font-medium uppercase tracking-wide text-[#0ea5ea]">
            Saturdays.AI · Powered by apol/spain-reference-personas-frontier
          </p>
          <h1 className="mt-2 text-4xl font-bold tracking-tight text-[#121b33]">
            Spain Persona Frontier
          </h1>
          <p className="mt-3 max-w-3xl text-base text-[#4b6275]">
            Explore Spanish audience segments through the lens of device access
            for practical AI training.
          </p>
        </header>

        <FilterBar
          filters={filters}
          regions={options.regions}
          areaTypes={options.areaTypes}
          ageGroups={options.ageGroups}
          onChange={handleFilterChange}
          onReset={handleReset}
        />

        <section className="mt-6 rounded-[28px] border border-[#bfe8f3] bg-[#d9f0ec] p-6 shadow-sm">
          <div className="mb-4">
            <h2 className="text-3xl font-bold tracking-tight text-[#121b33]">
              Use case: Device access for AI Training
            </h2>
            <p className="mt-1 text-sm text-[#4b6275]">
              Core digital access signal for the currently selected segment.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <p className="text-sm text-[#4b6275]">Device access</p>
              <p className="mt-1 text-lg font-semibold text-[#121b33]">
                {dominantSegment?.deviceAccessTop ?? "—"}
              </p>
            </div>
            <div>
              <p className="text-sm text-[#4b6275]">Internet intensity</p>
              <p className="mt-1 text-lg font-semibold text-[#121b33]">
                {dominantSegment?.internetIntensityTop ?? "—"}
              </p>
            </div>
          </div>
        </section>

        <section className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          <SnapshotCard
            title="Selected segment"
            value={formatSelectedSegment(filters)}
            description={`Top issue: ${snapshot.topIssue}`}
          />
          <SnapshotCard
            title="Estimated size"
            value={compactNumber.format(snapshot.totalSize)}
            description={`Built from ${snapshot.segmentCount} matching segments.`}
          />
          <SnapshotCard
            title="Top channel"
            value={snapshot.topChannel}
            description="Aggregated from primary news sources."
          />
          <SnapshotCard
            title="Typical profile"
            value={formatTypicalProfile(dominantSegment)}
            description="Dominant gender, education, socioeconomic tier and reading frequency in the selected segment."
          />
        </section>

        <section className="mt-8 grid gap-6 xl:grid-cols-2">
          <AgeChart data={ageChartData} />
          <ChannelChart data={channelChartData} />
        </section>
      </main>
    </div>
  );
}
