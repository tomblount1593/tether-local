export const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "";

export const GOOGLE_MAP_ID_BY_TIER = {
  standard: import.meta.env.VITE_GOOGLE_MAP_ID_STANDARD || "",
  premium: import.meta.env.VITE_GOOGLE_MAP_ID_PREMIUM || "",
  concierge: import.meta.env.VITE_GOOGLE_MAP_ID_CONCIERGE || "",
};

export function normaliseMembershipTier(tier) {
  const value = String(tier || "").toLowerCase();
  if (value.includes("concierge")) return "concierge";
  if (value.includes("premium")) return "premium";
  return "standard";
}

export function getGoogleMapIdForTier(tier = "standard") {
  const normalisedTier = normaliseMembershipTier(tier);
  return (
    GOOGLE_MAP_ID_BY_TIER[normalisedTier]
    || GOOGLE_MAP_ID_BY_TIER.standard
    || ""
  );
}

export function hasGoogleMapsConfig(tier = "standard") {
  return Boolean(GOOGLE_MAPS_API_KEY && getGoogleMapIdForTier(tier));
}

export function getGoogleMapsDebugConfig(tier = "standard") {
  const normalisedTier = normaliseMembershipTier(tier);
  return {
    tier: normalisedTier,
    hasApiKey: Boolean(GOOGLE_MAPS_API_KEY),
    mapId: getGoogleMapIdForTier(normalisedTier),
  };
}
