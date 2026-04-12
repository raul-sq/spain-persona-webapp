export type AgeGroup = string;
export type AreaType = string;
export type Region = string;

export type ChannelName =
  | "Social media"
  | "TV"
  | "Press"
  | "Radio"
  | "Messaging apps";

export interface PersonaSegment {
  id: string;
  label: string;
  region: Region;
  areaType: AreaType;
  ageGroup: AgeGroup;
  size: number;
  trustInstitution: number;
  priceSensitivity: number;
  topIssue: string;
  channels: Record<ChannelName, number>;
  genderTop: string;
  deviceAccessTop: string;
  internetIntensityTop: string;
  educationTop: string;
  socioeconomicTierTop: string;
  readingFrequencyTop: string;
  readinessScore: number;
}

export interface Filters {
  region: Region | "All";
  areaType: AreaType | "All";
  ageGroup: AgeGroup | "All";
}

export interface Snapshot {
  totalSize: number;
  dominantRegion: Region | "—";
  dominantAreaType: AreaType | "—";
  topChannel: ChannelName | "—";
  avgTrust: number;
  avgPriceSensitivity: number;
  topIssue: string;
  segmentCount: number;
}

export interface ChartDatum {
  name: string;
  value: number;
}