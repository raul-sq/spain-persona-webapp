import { useMemo, useState } from "react";
import FilterBar from "./components/FilterBar";
import SnapshotCard from "./components/SnapshotCard";
import AgeChart from "./components/AgeChart";
import ChannelChart from "./components/ChannelChart";
import SpainRegionsMap from "./components/SpainRegionsMap";
import realPersonaData from "./data/realPersonaData.json";
import {
  buildAgeChart,
  buildChannelChart,
  buildSnapshot,
  filterSegments,
  getFilterOptions,
} from "./services/personaService";
import type { Filters, PersonaSegment } from "./types/persona";
import {
  translateChannelName,
  translateUiValue,
} from "./utils/translations";

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
  return [filters.region, filters.areaType, filters.ageGroup]
    .map((value) => translateUiValue(value))
    .join(" · ");
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
  ]
    .map((value) => translateUiValue(value))
    .join(" · ");
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
    () =>
      buildChannelChart(filteredData).map((item) => ({
        ...item,
        name: translateChannelName(item.name),
      })),
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

  function handleRegionSelect(region: string) {
    setFilters((current) => ({
      ...current,
      region,
    }));
  }

  function handleReset() {
    setFilters(initialFilters);
  }

  const compactNumber = new Intl.NumberFormat("es", {
    notation: "compact",
    maximumFractionDigits: 1,
  });

  return (
    <div className="min-h-screen bg-[#f3f6f7] text-[#121b33]">
      <main className="mx-auto max-w-7xl p-8">
        <header className="mb-8">
          <p className="text-sm font-medium uppercase tracking-wide text-[#0ea5ea]">
            Saturdays.AI · Basado en apol/spain-reference-personas-frontier
          </p>
          <h1 className="mt-2 text-4xl font-bold tracking-tight text-[#121b33]">
            Spain Persona Frontier
          </h1>
          <p className="mt-3 max-w-3xl text-base text-[#4b6275]">
            Explora segmentos de audiencia en España desde la óptica del acceso
            a dispositivos.
          </p>
        </header>

        <section className="rounded-[28px] border border-[#bfe8f3] bg-[#d9f0ec] p-6 shadow-sm">
          <div className="mb-6">
            <h2 className="text-2xl font-bold tracking-tight text-[#121b33]">
              Filtros
            </h2>
            <p className="mt-2 text-sm text-[#4b6275]">
              Combina filtros demográficos con selección geográfica para acotar
              el segmento visualizado.
            </p>
            <p className="mt-2 text-sm text-[#4b6275]">
              Haz clic en una comunidad autónoma para filtrar por región.
            </p>
          </div>

          <div className="grid gap-6 xl:grid-cols-[1fr_1.1fr] xl:items-start">
            <FilterBar
              filters={filters}
              areaTypes={options.areaTypes}
              ageGroups={options.ageGroups}
              onChange={handleFilterChange}
              onReset={handleReset}
            />

            <SpainRegionsMap
              selectedRegion={filters.region}
              onSelectRegion={handleRegionSelect}
            />
          </div>
        </section>

        <section className="mt-6 rounded-[28px] border border-[#bfe8f3] bg-[#d9f0ec] p-6 shadow-sm">
          <div className="mb-4">
            <h2 className="text-3xl font-bold tracking-tight text-[#121b33]">
              Caso de uso: acceso a dispositivos
            </h2>
            <p className="mt-1 text-sm text-[#4b6275]">
              Señal central de acceso digital para el segmento actualmente
              seleccionado.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <p className="text-sm text-[#4b6275]">Acceso a dispositivos</p>
              <p className="mt-1 text-lg font-semibold text-[#121b33]">
                {translateUiValue(dominantSegment?.deviceAccessTop ?? "—")}
              </p>
            </div>
            <div>
              <p className="text-sm text-[#4b6275]">Intensidad de internet</p>
              <p className="mt-1 text-lg font-semibold text-[#121b33]">
                {translateUiValue(dominantSegment?.internetIntensityTop ?? "—")}
              </p>
            </div>
          </div>
        </section>

        <section className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          <SnapshotCard
            title="Segmento seleccionado"
            value={formatSelectedSegment(filters)}
            description={`Tema principal: ${snapshot.topIssue}`}
          />
          <SnapshotCard
            title="Tamaño estimado"
            value={compactNumber.format(snapshot.totalSize)}
            description={`Construido a partir de ${snapshot.segmentCount} segmentos coincidentes.`}
          />
          <SnapshotCard
            title="Canal principal"
            value={translateChannelName(snapshot.topChannel)}
            description="Agregado a partir de las fuentes principales de noticias."
          />
          <SnapshotCard
            title="Perfil típico"
            value={formatTypicalProfile(dominantSegment)}
            description="Género, educación, nivel socioeconómico y frecuencia de lectura dominantes en el segmento seleccionado."
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