import type {
  ChannelName,
  ChartDatum,
  Filters,
  PersonaSegment,
  Snapshot,
} from "../types/persona";

type ChannelChartDatum = {
  name: ChannelName;
  value: number;
};

const CHANNEL_NAMES: ChannelName[] = [
  "Social media",
  "TV",
  "Press",
  "Radio",
  "Messaging apps",
];

export function getFilterOptions(data: PersonaSegment[]) {
  return {
    regions: [...new Set(data.map((item) => item.region))].sort(),
    areaTypes: [...new Set(data.map((item) => item.areaType))].sort(),
    ageGroups: [...new Set(data.map((item) => item.ageGroup))].sort(sortAgeGroups),
  };
}

export function filterSegments(
  data: PersonaSegment[],
  filters: Filters
): PersonaSegment[] {
  return data.filter((item) => {
    const matchesRegion =
      filters.region === "All" || item.region === filters.region;
    const matchesAreaType =
      filters.areaType === "All" || item.areaType === filters.areaType;
    const matchesAgeGroup =
      filters.ageGroup === "All" || item.ageGroup === filters.ageGroup;

    return matchesRegion && matchesAreaType && matchesAgeGroup;
  });
}

export function buildSnapshot(data: PersonaSegment[]): Snapshot {
  if (data.length === 0) {
    return {
      totalSize: 0,
      dominantRegion: "—",
      dominantAreaType: "—",
      topChannel: "—",
      avgTrust: 0,
      avgPriceSensitivity: 0,
      topIssue: "—",
      segmentCount: 0,
    };
  }

  const totalSize = sumWeightedSize(data);
  const channelChart = buildChannelChart(data);

  return {
    totalSize: roundTo(totalSize, 1),
    dominantRegion: topWeightedValue(
      data.map((item) => ({ name: item.region, weight: item.size }))
    ),
    dominantAreaType: topWeightedValue(
      data.map((item) => ({ name: item.areaType, weight: item.size }))
    ),
    topChannel: channelChart[0]?.name ?? "—",
    avgTrust: weightedAverage(data, (item) => item.trustInstitution),
    avgPriceSensitivity: weightedAverage(data, (item) => item.priceSensitivity),
    topIssue: topWeightedValue(
      data.map((item) => ({ name: item.topIssue, weight: item.size }))
    ),
    segmentCount: data.length,
  };
}

export function buildAgeChart(data: PersonaSegment[]): ChartDatum[] {
  const totals = new Map<string, number>();

  data.forEach((item) => {
    totals.set(item.ageGroup, (totals.get(item.ageGroup) ?? 0) + item.size);
  });

  return [...totals.entries()]
    .sort((a, b) => sortAgeGroups(a[0], b[0]))
    .map(([name, value]) => ({
      name,
      value: roundTo(value, 1),
    }));
}

export function buildChannelChart(data: PersonaSegment[]): ChannelChartDatum[] {
  const totals = createEmptyChannelTotals();

  if (data.length === 0) {
    return CHANNEL_NAMES.map((name) => ({ name, value: 0 }));
  }

  const totalSize = sumWeightedSize(data);

  data.forEach((item) => {
    CHANNEL_NAMES.forEach((channel) => {
      totals[channel] += item.channels[channel] * item.size;
    });
  });

  return CHANNEL_NAMES.map((name) => ({
    name,
    value: roundTo(totals[name] / totalSize, 1),
  })).sort((a, b) => b.value - a.value);
}

function createEmptyChannelTotals(): Record<ChannelName, number> {
  return {
    "Social media": 0,
    TV: 0,
    Press: 0,
    Radio: 0,
    "Messaging apps": 0,
  };
}

function sumWeightedSize(data: PersonaSegment[]): number {
  return data.reduce((sum, item) => sum + item.size, 0);
}

function weightedAverage(
  data: PersonaSegment[],
  selector: (item: PersonaSegment) => number
): number {
  const totalSize = sumWeightedSize(data);

  if (totalSize === 0) {
    return 0;
  }

  const weightedSum = data.reduce(
    (sum, item) => sum + selector(item) * item.size,
    0
  );

  return roundTo(weightedSum / totalSize, 1);
}

function topWeightedValue(items: { name: string; weight: number }[]): string {
  const totals = new Map<string, number>();

  items.forEach((item) => {
    totals.set(item.name, (totals.get(item.name) ?? 0) + item.weight);
  });

  return [...totals.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? "—";
}

function sortAgeGroups(a: string, b: string): number {
  return getAgeGroupOrderValue(a) - getAgeGroupOrderValue(b);
}

function getAgeGroupOrderValue(value: string): number {
  const rangeMatch = value.match(/^(\d+)\s*-\s*(\d+)$/);
  if (rangeMatch) {
    return Number(rangeMatch[1]);
  }

  const plusMatch = value.match(/^(\d+)\+$/);
  if (plusMatch) {
    return Number(plusMatch[1]);
  }

  return Number.MAX_SAFE_INTEGER;
}

function roundTo(value: number, decimals: number): number {
  return Number(value.toFixed(decimals));
}