import { hashSeed } from "@/data/demo/demoMatchPoolSelector";

export const LONDON_CENTER = { lat: 51.5072, lng: -0.1276 };
export const LONDON_BOUNDS = { north: 51.7, south: 51.28, east: 0.25, west: -0.51 };
const DEFAULT_USER_POSITION = { lat: 51.513, lng: -0.136 };

export const londonMapAreas = [
  { id: "shoreditch", label: "Shoreditch", position: { lat: 51.525, lng: -0.078 } },
  { id: "soho", label: "Soho", position: { lat: 51.513, lng: -0.136 } },
  { id: "peckham", label: "Peckham", position: { lat: 51.472, lng: -0.069 } },
  { id: "islington", label: "Islington", position: { lat: 51.538, lng: -0.102 } },
  { id: "notting-hill", label: "Notting Hill", position: { lat: 51.515, lng: -0.205 } },
  { id: "brixton", label: "Brixton", position: { lat: 51.461, lng: -0.114 } },
  { id: "hackney", label: "Hackney", position: { lat: 51.545, lng: -0.055 } },
  { id: "camden", label: "Camden", position: { lat: 51.541, lng: -0.142 } },
  { id: "chelsea", label: "Chelsea", position: { lat: 51.487, lng: -0.17 } },
  { id: "london-bridge", label: "London Bridge", position: { lat: 51.505, lng: -0.087 } },
  { id: "clapham", label: "Clapham", position: { lat: 51.462, lng: -0.138 } },
  { id: "greenwich", label: "Greenwich", position: { lat: 51.482, lng: 0.009 } },
  { id: "hampstead", label: "Hampstead", position: { lat: 51.556, lng: -0.178 } },
  { id: "marylebone", label: "Marylebone", position: { lat: 51.522, lng: -0.15 } },
  { id: "southbank", label: "Southbank", position: { lat: 51.506, lng: -0.116 } },
  { id: "dalston", label: "Dalston", position: { lat: 51.546, lng: -0.075 } },
  { id: "kings-cross", label: "King's Cross", position: { lat: 51.532, lng: -0.124 } },
  { id: "richmond", label: "Richmond", position: { lat: 51.461, lng: -0.303 } },
  { id: "battersea", label: "Battersea", position: { lat: 51.47, lng: -0.172 } },
  { id: "bermondsey", label: "Bermondsey", position: { lat: 51.498, lng: -0.063 } },
];

export function normaliseAreaLabel(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[’']/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function getAreaByText(text) {
  const needle = normaliseAreaLabel(text);
  if (!needle) return null;
  return londonMapAreas.find((area) => needle.includes(area.id) || area.id.includes(needle)) || null;
}

export function getDeterministicJitter(seed, maxLatJitter = 0.004, maxLngJitter = 0.006) {
  const base = hashSeed(String(seed || "fallback"));
  const latRaw = ((base % 1000) / 999) * 2 - 1;
  const lngRaw = ((((base / 1000) | 0) % 1000) / 999) * 2 - 1;
  return { lat: latRaw * maxLatJitter, lng: lngRaw * maxLngJitter };
}

export function getAreaForMatch(match, index = 0, _context = {}) {
  const byNeighborhood = getAreaByText(match?.neighbourhood);
  if (byNeighborhood) return byNeighborhood;
  const byLocation = getAreaByText(match?.location);
  if (byLocation) return byLocation;
  const areaIndex = hashSeed(`${match?.id || "m"}:${index}`) % londonMapAreas.length;
  return londonMapAreas[areaIndex];
}

export function getMatchMapPosition(match, index = 0, context = {}) {
  const area = getAreaForMatch(match, index, context);
  const jitter = getDeterministicJitter(`${match?.id || "m"}:${index}:${context?.membershipTier || "standard"}`);
  const lat = Math.min(LONDON_BOUNDS.north, Math.max(LONDON_BOUNDS.south, area.position.lat + jitter.lat));
  const lng = Math.min(LONDON_BOUNDS.east, Math.max(LONDON_BOUNDS.west, area.position.lng + jitter.lng));
  return { lat, lng };
}

export function getUserMapPosition(context, demoUserProfile) {
  const area = getAreaByText(demoUserProfile?.location || context?.location || "");
  return area ? area.position : DEFAULT_USER_POSITION;
}
