import { GeoJSON, MapContainer, TileLayer } from "react-leaflet";
import type { Feature, GeoJsonObject } from "geojson";
import type { LatLngExpression, Path, PathOptions } from "leaflet";
import spainCcaa from "../data/spain-ccaa.json";

type SpainRegionsMapProps = {
  selectedRegion: string;
  onSelectRegion: (region: string) => void;
};

type RegionFeatureProperties = {
  shapeName?: string;
  name?: string;
  NAME_1?: string;
};

const MAP_CENTER: LatLngExpression = [40.2, -3.7];

const FILTER_REGION_NAME_MAP: Record<string, string> = {
  Andalucía: "Andalucía",
  Aragón: "Aragón",
  Aragon: "Aragón",
  Asturias: "Asturias",
  "Principado de Asturias": "Asturias",
  Baleares: "Baleares",
  "Illes Balears": "Baleares",
  Canarias: "Canarias",
  Cantabria: "Cantabria",
  "Castilla y León": "Castilla y León",
  "Castilla Y León": "Castilla y León",
  "Castilla-La Mancha": "Castilla-La Mancha",
  Cataluña: "Cataluña",
  "Cataluña/Catalunya": "Cataluña",
  Ceuta: "Ceuta",
  "Ciudad Autónoma de Ceuta": "Ceuta",
  "Comunidad Valenciana": "Comunidad Valenciana",
  "Comunitat Valenciana": "Comunidad Valenciana",
  Extremadura: "Extremadura",
  Galicia: "Galicia",
  "La Rioja": "La Rioja",
  Madrid: "Madrid",
  "Comunidad de Madrid": "Madrid",
  Melilla: "Melilla",
  "Ciudad Autónoma de Melilla": "Melilla",
  Murcia: "Murcia",
  "Región de Murcia": "Murcia",
  Navarra: "Navarra",
  "Comunidad Foral de Navarra": "Navarra",
  "País Vasco": "País Vasco",
  Euskadi: "País Vasco",
  "País Vasco / Euskadi": "País Vasco",
  "País Vasco/Euskadi": "País Vasco",
};

const DISPLAY_REGION_NAME_MAP: Record<string, string> = {
  "Cataluña/Catalunya": "Cataluña/Catalunya",
  "País Vasco/Euskadi": "País Vasco/Euskadi",
  "Comunidad Foral de Navarra": "Navarra/Nafarroa",
  "Comunitat Valenciana": "Comunidad Valenciana/Comunitat Valenciana",
  "Ciudad Autónoma de Ceuta": "Ceuta",
  "Ciudad Autónoma de Melilla": "Melilla",
};

function getRawRegionName(feature?: Feature | null): string {
  const properties = feature?.properties as RegionFeatureProperties | undefined;

  return properties?.shapeName ?? properties?.name ?? properties?.NAME_1 ?? "";
}

function getFilterRegionName(feature?: Feature | null): string {
  const raw = getRawRegionName(feature);
  return FILTER_REGION_NAME_MAP[raw] ?? raw;
}

function getDisplayRegionName(feature?: Feature | null): string {
  const raw = getRawRegionName(feature);
  return DISPLAY_REGION_NAME_MAP[raw] ?? getFilterRegionName(feature);
}

function getRegionStyle(
  regionName: string,
  selectedRegion: string
): PathOptions {
  const isSelected = regionName === selectedRegion;

  return {
    color: isSelected ? "#0ea5ea" : "#7fbfd2",
    weight: isSelected ? 3 : 1.5,
    fillColor: isSelected ? "#0ea5ea" : "#d9f0ec",
    fillOpacity: isSelected ? 0.4 : 0.55,
  };
}

export default function SpainRegionsMap({
  selectedRegion,
  onSelectRegion,
}: SpainRegionsMapProps) {
  return (
    <div className="h-full">
      <div className="h-[280px] w-full overflow-hidden rounded-[20px] border border-[#b7dce8] md:h-[320px] xl:h-[360px]">
        <MapContainer
          center={MAP_CENTER}
          zoom={5}
          scrollWheelZoom={false}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            attribution="© OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <GeoJSON
            key={`spain-regions-${selectedRegion}`}
            data={spainCcaa as GeoJsonObject}
            style={(feature) => {
              const regionName = getFilterRegionName(feature);
              return getRegionStyle(regionName, selectedRegion);
            }}
            onEachFeature={(feature, layer) => {
              const filterRegionName = getFilterRegionName(feature);
              const displayRegionName = getDisplayRegionName(feature);
              const pathLayer = layer as Path;

              layer.bindTooltip(displayRegionName, {
                sticky: true,
              });

              layer.on({
                click: () => {
                  onSelectRegion(
                    selectedRegion === filterRegionName
                      ? "All"
                      : filterRegionName
                  );
                },
                mouseover: () => {
                  pathLayer.setStyle({
                    weight: 3,
                    fillOpacity: 0.7,
                  });
                },
                mouseout: () => {
                  pathLayer.setStyle(
                    getRegionStyle(filterRegionName, selectedRegion)
                  );
                },
              });
            }}
          />
        </MapContainer>
      </div>
    </div>
  );
}