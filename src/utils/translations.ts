export function normalizeUiValue(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, "_");
}

const valueMap: Record<string, string> = {
  all: "Todas",

  urban: "Urbano",
  rural: "Rural",
  suburban: "Periurbano",

  male: "Hombre",
  female: "Mujer",

  secondary: "Secundaria",
  primary: "Primaria",
  university: "Universitaria",
  postgraduate: "Posgrado",
  doctorate: "Doctorado",
  vocational: "Formación profesional",
  vocational_higher: "FP superior",
  upper_secondary: "Secundaria superior",
  lower_secondary: "Secundaria básica",
  higher_education: "Educación superior",
  none: "Ninguno",

  affluent: "Acomodado",
  upper_middle: "Clase media-alta",
  middle: "Clase media",
  working: "Clase trabajadora",
  precarious: "Precario",
  low: "Bajo",

  very_often: "Muy frecuente",
  often: "Frecuente",
  frequently: "Frecuente",
  sometimes: "A veces",
  occasionally: "Ocasional",
  rarely: "Rara vez",
  never: "Nunca",

  heavy: "Muy alta",
  high: "Alta",
  daily: "Diaria",
  regular: "Normal",
  medium: "Media",
  moderate: "Moderada",
  light: "Baja",
  occasional: "Ocasional",
  rare: "Escasa",
  very_low: "Muy baja",

  phone_only: "Solo móvil",
  phone_plus_pc: "Móvil + PC",
  desktop_laptop_and_phone: "Sobremesa/portátil + móvil",
  desktop_and_phone: "Sobremesa + móvil",
  laptop_and_phone: "Portátil + móvil",
  multi_device: "Multidispositivo",
  computer_and_phone: "Ordenador + móvil",
  computer_access: "Acceso a ordenador",
  desktop_laptop_only: "Solo sobremesa/portátil",
  desktop_only: "Solo sobremesa",
  laptop_only: "Solo portátil",
  tablet_and_phone: "Tablet + móvil",
  tablet_only: "Solo tablet",
  shared_access: "Acceso compartido",
  limited_access: "Acceso limitado",
  no_access: "Sin acceso",

  tv: "TV",
  radio: "Radio",
  press: "Prensa",
  social_media: "Redes sociales",
  messaging_apps: "Apps de mensajería",
};

export function translateUiValue(value: string): string {
  const normalized = normalizeUiValue(value);

  if (valueMap[normalized]) {
    return valueMap[normalized];
  }

  if (value.includes("_")) {
    return value.replace(/_/g, " ");
  }

  return value;
}

export function translateChannelName(value: string): string {
  return translateUiValue(value);
}