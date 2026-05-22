const PREMIUM_STYLE = [
  { elementType: "geometry", stylers: [{ color: "#eceee9" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#38423b" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#eceee9" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#37423a" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#c7cbc5" }] },
  { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#9ca59d" }] },
  { featureType: "poi.park", elementType: "geometry", stylers: [{ color: "#d8ddd6" }] },
  { featureType: "transit.line", elementType: "geometry", stylers: [{ color: "#9fa8a0" }] },
];

const CONCIERGE_STYLE = [
  { elementType: "geometry", stylers: [{ color: "#d8c6ae" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#0f1512" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#d8c6ae" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#0a0d0a" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#f2e7d8" }] },
  { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#e4d2bc" }] },
  { featureType: "poi.park", elementType: "geometry", stylers: [{ color: "#cdb89e" }] },
  { featureType: "transit.line", elementType: "geometry", stylers: [{ color: "#b9a58d" }] },
];

export function getLocalStyleForTier(tier) {
  if (tier === "premium") return PREMIUM_STYLE;
  if (tier === "concierge") return CONCIERGE_STYLE;
  return null;
}
