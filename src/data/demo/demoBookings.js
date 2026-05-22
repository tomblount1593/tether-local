import { MEMBERSHIP_CHAT_OPEN_HOURS } from "@/data/demo/dateUpgradeOptions";
import { hashSeed } from "@/data/demo/demoMatchPoolSelector";

const BOOKINGS_KEY = "tetherDemoBookings";
const CANCELLATION_KEY = "tetherDemoCancellationCountBeforeFirstDate";

export function getStoredBookings() {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(BOOKINGS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveStoredBookings(bookings) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(BOOKINGS_KEY, JSON.stringify(bookings));
}

export function getCancellationCount() {
  if (typeof window === "undefined") return 0;
  return Number(window.localStorage.getItem(CANCELLATION_KEY) || 0);
}

export function setCancellationCount(count) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(CANCELLATION_KEY, String(Math.max(0, count)));
}

function getUpgradeStatus(match, selectedUpgradeId) {
  if (!selectedUpgradeId) return "not_selected";
  const score = Number(match?.compatibilityScore || 70);
  if (score >= 88) return "accepted_by_match";
  if (score <= 67) return "declined_by_match";
  return "pending_match_response";
}

export function buildDemoBooking({
  match,
  membershipTier,
  selectedDate,
  selectedTime,
  selectedLocation,
  selectedUpgradeId,
  upgradeTiming,
}) {
  const createdAt = new Date().toISOString();
  const bookingId = `booking-${String(match?.id || "fallback")}`;
  const bookingDate = new Date(`${selectedDate}T${selectedTime || "19:00"}:00`);
  const unlockHours = MEMBERSHIP_CHAT_OPEN_HOURS[membershipTier] || 24;
  const chatOpensAt = new Date(bookingDate.getTime() - unlockHours * 60 * 60 * 1000).toISOString();
  const upgradeStatus = getUpgradeStatus(match, selectedUpgradeId);

  return {
    bookingId,
    matchId: String(match?.id || "fallback"),
    selectedDate,
    selectedTime,
    selectedLocation,
    selectedUpgradeId: selectedUpgradeId || null,
    upgradeTiming: upgradeTiming || "decide_after_confirmation",
    upgradeStatus,
    bookingStatus: "pending_match_confirmation",
    createdAt,
    chatOpensAt,
    videoCallOpensAt: chatOpensAt,
    membershipTier,
  };
}

export function upsertBooking(nextBooking) {
  const existing = getStoredBookings();
  const filtered = existing.filter((b) => String(b.bookingId) !== String(nextBooking.bookingId));
  const next = [nextBooking, ...filtered];
  saveStoredBookings(next);
  return nextBooking;
}

export function getBookingByBookingId(bookingId) {
  const all = getStoredBookings();
  return all.find((b) => String(b.bookingId) === String(bookingId)) || null;
}

export function getBookingByMatchId(matchId) {
  const all = getStoredBookings();
  return all.find((b) => String(b.matchId) === String(matchId)) || null;
}

export function getDateJourneyStage(booking) {
  if (!booking) return 1;
  const hash = hashSeed(`${booking.bookingId}:${booking.selectedDate}:${booking.selectedTime}`);
  const stage = (hash % 7) + 1;
  return stage;
}
