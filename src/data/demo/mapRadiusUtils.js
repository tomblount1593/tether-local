const EARTH_RADIUS_MILES = 3958.8;

function toRadians(value) {
  return (Number(value) * Math.PI) / 180;
}

export function getDistanceMiles(a, b) {
  if (!a || !b) return Number.POSITIVE_INFINITY;
  const lat1 = toRadians(a.lat);
  const lat2 = toRadians(b.lat);
  const deltaLat = toRadians(b.lat - a.lat);
  const deltaLng = toRadians(b.lng - a.lng);

  const hav =
    Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(deltaLng / 2) * Math.sin(deltaLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(hav), Math.sqrt(1 - hav));
  return EARTH_RADIUS_MILES * c;
}

export const milesBetween = getDistanceMiles;

export function milesToMeters(miles) {
  return (Number(miles) || 0) * 1609.344;
}

export function getBoundsForRadius(center, radiusMiles) {
  if (!center || !Number.isFinite(center.lat) || !Number.isFinite(center.lng)) {
    return null;
  }
  const radius = Math.max(0.05, Number(radiusMiles) || 1);
  const lat = center.lat;
  const lng = center.lng;
  const latDelta = (radius / EARTH_RADIUS_MILES) * (180 / Math.PI);
  const lngDelta = ((radius / EARTH_RADIUS_MILES) * (180 / Math.PI)) / Math.max(Math.cos((lat * Math.PI) / 180), 0.00001);
  return {
    north: lat + latDelta,
    south: lat - latDelta,
    east: lng + lngDelta,
    west: lng - lngDelta,
  };
}

export function filterMatchesByRadius(matchesWithPositions, userPosition, radiusMiles, distanceScale = 1) {
  const radius = Number(radiusMiles) || 25;
  const scale = Number(distanceScale) || 1;
  return (matchesWithPositions || []).filter((entry) => {
    const effectiveMiles = getDistanceMiles(userPosition, entry.position) * scale;
    return effectiveMiles <= radius;
  });
}

export function getEffectiveMiles(userPosition, position, distanceScale = 1) {
  const scale = Number(distanceScale) || 1;
  return getDistanceMiles(userPosition, position) * scale;
}

export function splitMatchesByRadius(matchesWithPositions, userPosition, radiusMiles, distanceScale = 1) {
  const radius = Number(radiusMiles) || 25;
  const inRadius = [];
  const outOfRadius = [];
  for (const entry of matchesWithPositions || []) {
    const effectiveMiles = getEffectiveMiles(userPosition, entry.position, distanceScale);
    const item = { ...entry, distanceMiles: effectiveMiles };
    if (effectiveMiles <= radius) inRadius.push(item);
    else outOfRadius.push(item);
  }
  return { inRadius, outOfRadius };
}
