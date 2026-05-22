export const STANDARD_INTERESTED_VISIBLE_CAP_KEY = "tetherStandardInterestedVisibleCap";
export const STANDARD_INTERESTED_VISIBLE_CAP_KEY_V3 = "tetherStandardInterestedVisibleCapV3";
export const STANDARD_INTERESTED_PACK_KEY_V5 = "tetherStandardInterestedPackV5";
export const OLD_STANDARD_INTERESTED_UNLOCK_KEY = "tetherStandardInterestedUnlockCount";
export const DEFAULT_STANDARD_INTERESTED_VISIBLE_CAP = 3;

export function normaliseStandardVisibleCap(value) {
  const numberValue = Number(value);
  if (!Number.isFinite(numberValue)) return DEFAULT_STANDARD_INTERESTED_VISIBLE_CAP;
  if (numberValue === 1) return 1;
  if (numberValue < DEFAULT_STANDARD_INTERESTED_VISIBLE_CAP) return DEFAULT_STANDARD_INTERESTED_VISIBLE_CAP;
  if (numberValue === 3) return 3;
  if (numberValue === 12) return 12;
  if (numberValue === 50) return 50;
  return DEFAULT_STANDARD_INTERESTED_VISIBLE_CAP;
}

export function getInterestedVisibility(profiles, visibleCap) {
  const list = Array.isArray(profiles) ? profiles : [];
  const safeCap = normaliseStandardVisibleCap(visibleCap);
  const cappedVisibleCount = Math.min(safeCap, list.length);
  return {
    visibleCap: safeCap,
    totalCount: list.length,
    visibleProfiles: list.slice(0, cappedVisibleCount),
    hiddenProfiles: list.slice(cappedVisibleCount),
    visibleCount: cappedVisibleCount,
    hiddenCount: Math.max(list.length - cappedVisibleCount, 0),
  };
}

export function getStandardInterestedContextKey(context = {}) {
  const c = context || {};
  const parts = [
    "standard",
    c.genderIdentity || "unknown_gender",
    c.sexualPreference || "unknown_preference",
    c.bisexualFilter || "none",
    c.transNonBinaryFilter || "none",
  ];
  return parts.join(":");
}

export function getScopedStandardInterestedVisibleCapKey(context = {}) {
  return `${STANDARD_INTERESTED_VISIBLE_CAP_KEY}:${getStandardInterestedContextKey(context)}`;
}

export function getScopedStandardInterestedVisibleCapKeyV3(context = {}) {
  return `${STANDARD_INTERESTED_VISIBLE_CAP_KEY_V3}:${getStandardInterestedContextKey(context)}`;
}

export function normaliseStandardPack(value) {
  const numberValue = Number(value);
  if (numberValue === 1) return 1;
  if (numberValue === 3) return 3;
  if (numberValue === 12) return 12;
  if (numberValue === 50) return 50;
  return null;
}

export function getScopedStandardInterestedPackKeyV5(context = {}) {
  return `${STANDARD_INTERESTED_PACK_KEY_V5}:${getStandardInterestedContextKey(context)}`;
}
