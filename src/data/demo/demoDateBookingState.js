const PENDING_DATE_BOOKING_KEY = "tetherPendingDateBooking";

export function setPendingDateBooking(matchId, source = "interested-in-you", extras = {}) {
  if (typeof window === "undefined" || !matchId) return;
  const payload = {
    matchId: String(matchId),
    source,
    createdAt: new Date().toISOString(),
    membershipTier: extras.membershipTier || "standard",
    sexualPreference: extras.sexualPreference || "straight",
  };
  window.localStorage.setItem(PENDING_DATE_BOOKING_KEY, JSON.stringify(payload));
}

export function getPendingDateBooking() {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(PENDING_DATE_BOOKING_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || !parsed.matchId) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function clearPendingDateBooking() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(PENDING_DATE_BOOKING_KEY);
}
