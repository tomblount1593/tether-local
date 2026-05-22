import { hashSeed } from "@/data/demo/demoMatchPoolSelector";

export const dateLocations = [
  { id: "bao-soho", type: "venue", name: "Bao", area: "Soho", label: "Bao, Soho", dateType: "dinner", priceTier: "££", position: { lat: 51.513, lng: -0.136 }, tags: ["food", "casual", "popular"] },
  { id: "bar-termini-soho", type: "venue", name: "Bar Termini", area: "Soho", label: "Bar Termini, Soho", dateType: "drinks", priceTier: "££", position: { lat: 51.513, lng: -0.131 }, tags: ["drinks", "social"] },
  { id: "monmouth-london-bridge", type: "venue", name: "Monmouth Coffee", area: "London Bridge", label: "Monmouth Coffee, London Bridge", dateType: "coffee", priceTier: "£", position: { lat: 51.505, lng: -0.09 }, tags: ["coffee", "low-pressure"] },
  { id: "dishoom-kings-cross", type: "venue", name: "Dishoom", area: "King's Cross", label: "Dishoom, King's Cross", dateType: "dinner", priceTier: "££", position: { lat: 51.536, lng: -0.125 }, tags: ["food", "popular"] },
  { id: "lina-stores-soho", type: "venue", name: "Lina Stores", area: "Soho", label: "Lina Stores, Soho", dateType: "dinner", priceTier: "££", position: { lat: 51.513, lng: -0.136 }, tags: ["food", "intimate"] },
  { id: "watchhouse-marylebone", type: "venue", name: "WatchHouse", area: "Marylebone", label: "WatchHouse, Marylebone", dateType: "coffee", priceTier: "££", position: { lat: 51.519, lng: -0.151 }, tags: ["coffee", "stylish"] },
  { id: "coal-rooms-peckham", type: "venue", name: "Coal Rooms", area: "Peckham", label: "Coal Rooms, Peckham", dateType: "dinner", priceTier: "££", position: { lat: 51.474, lng: -0.069 }, tags: ["food", "local"] },
  { id: "forza-wine-peckham", type: "venue", name: "Forza Wine", area: "Peckham", label: "Forza Wine, Peckham", dateType: "drinks", priceTier: "££", position: { lat: 51.472, lng: -0.067 }, tags: ["drinks", "views"] },
  { id: "jolene-shoreditch", type: "venue", name: "Jolene", area: "Shoreditch", label: "Jolene, Shoreditch", dateType: "dinner", priceTier: "££", position: { lat: 51.529, lng: -0.075 }, tags: ["food", "trendy"] },
  { id: "towpath-hackney", type: "venue", name: "Towpath", area: "Hackney", label: "Towpath, Hackney", dateType: "dinner", priceTier: "££", position: { lat: 51.536, lng: -0.05 }, tags: ["food", "canal"] },
  { id: "southbank-walk", type: "walk", name: "Southbank Walk", area: "Southbank", label: "Southbank Walk", dateType: "walk", priceTier: "free", position: { lat: 51.506, lng: -0.116 }, tags: ["walk", "low-pressure", "outdoors"] },
  { id: "hampstead-heath-walk", type: "walk", name: "Hampstead Heath Walk", area: "Hampstead", label: "Hampstead Heath Walk", dateType: "walk", priceTier: "free", position: { lat: 51.56, lng: -0.165 }, tags: ["walk", "outdoors"] },
  { id: "greenwich-park-walk", type: "walk", name: "Greenwich Park Walk", area: "Greenwich", label: "Greenwich Park Walk", dateType: "walk", priceTier: "free", position: { lat: 51.477, lng: -0.001 }, tags: ["walk", "outdoors"] },
];

export function getDefaultDateLocation(match) {
  if (!match) return dateLocations[0];
  const suggested = `${match.firstDateSuggestion?.venueName || ""} ${match.firstDateSuggestion?.neighbourhood || ""}`.toLowerCase();
  if (suggested) {
    const found = dateLocations.find((loc) => `${loc.name} ${loc.area}`.toLowerCase().includes(suggested) || suggested.includes(loc.area.toLowerCase()));
    if (found) return found;
  }
  const index = hashSeed(String(match.id || "fallback")) % dateLocations.length;
  return dateLocations[index];
}
