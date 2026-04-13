import { GeoJSON, MapContainer, TileLayer } from "react-leaflet";
import spainCcaa from "../data/spain-ccaa.json";
import { translateUiValue } from "../utils/translations";

type SpainRegionsMapProps = {
  selectedRegion: string;
  onSelectRegion: (region: string) => void;
};

const REGION_NAME_MAP: Record<string, string> = {
  Andalucía: "Andalucía",
  Aragon: "Aragón",
  Aragón: "Aragón",
  Asturias: "Asturias",
  "Principado de Asturias": "Asturias",
  Baleares: "Baleares",
  "Illes Balears": "Baleares",
  Canarias: "Canarias",
  Cantabria: "Cantabria",
  "Castilla y León": "Castilla Y León",
  "Castilla Y León": "Castilla Y León",
  "Castilla-La Mancha": "Castilla-La Mancha",
  Cataluña: "Cataluña",
  Catalonia: "Cataluña",
  Ceuta: "Ceuta",
  "Comunidad Valenciana": "Comunidad Valenciana",
  "Comunitat Valenciana": "Comunidad Valenciana",
  Extremadura: "Extremadura",
  Galicia: "Galicia",
  "La Rioja": "La Rioja",
  Madrid: "Madrid",
  "Comunidad de Madrid": "Madrid",
  Melilla: "Melilla",
  Murcia: "Murcia",
  "Región de Murcia": "Murcia",
  Navarra: "Navarra",
  "Navarra / Nafarroa": "Navarra",
  "País Vasco": "País Vasco",
  Euskadi: "País Vasco",
  "País Vasco / Euskadi": "País Vasco",
};

function getRegionName(feature: any): string {
  const raw =
    feature?.properties?.shapeName ??
    feature?.properties?.name ??
    feature?.properties?.NAME_1 ??
    "";

  return REGION_NAME_MAP[raw] ?? raw;
}

export default function SpainRegionsMap({
  selectedRegion,
  onSelectRegion,
}: SpainRegionsMapProps) {
  return (
    <section className="rounded-[28px] border border-[#bfe8f3] bg-[#d9f0ec] p-6 shadow-sm">
      <div className="mb-4">
        <h2 className="text-2xl font-bold tracking-tight text-[#121b33]">
          Mapa de España
        </h2>
        <p className="mt-1 text-sm text-[#4b6275]">
          Haz clic en una comunidad autónoma para filtrar por región.
        </p>
      </div>

      <div className="h-[420px] w-full overflow-hidden rounded-[20px] border border-[#b7dce8]">
        <MapContainer
          center={[40.2, -3.7]}
          zoom={5}
          scrollWheelZoom={false}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            attribution="&copy; OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <GeoJSON
            data={spainCcaa as any}
            style={(feature: any) => {
              const regionName = getRegionName(feature);
              const isSelected = regionName === selectedRegion;

              return {
                color: isSelected ? "#0ea5ea" : "#7fbfd2",
                weight: isSelected ? 3 : 1.5,
                fillColor: isSelected ? "#0ea5ea" : "#d9f0ec",
                fillOpacity: isSelected ? 0.35 : 0.55,
              };
            }}
            onEachFeature={(feature: any, layer: any) => {
              const regionName = getRegionName(feature);

              layer.bindTooltip(translateUiValue(regionName), {
                sticky: true,
              });

              layer.on({
                click: () => {
                  onSelectRegion(
                    selectedRegion === regionName ? "All" : regionName
                  );
                },
                mouseover: () => {
                  layer.setStyle({
                    weight: 3,
                    fillOpacity: 0.7,
                  });
                },
                mouseout: () => {
                  layer.setStyle({
                    color:
                      regionName === selectedRegion ? "#0ea5ea" : "#7fbfd2",
                    weight: regionName === selectedRegion ? 3 : 1.5,
                    fillColor:
                      regionName === selectedRegion ? "#0ea5ea" : "#d9f0ec",
                    fillOpacity: regionName === selectedRegion ? 0.35 : 0.55,
                  });
                },
              });
            }}
          />
        </MapContainer>
      </div>
    </section>
  );
}