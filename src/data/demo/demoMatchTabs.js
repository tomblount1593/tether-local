const VENUE_FALLBACKS = [
  { venueName: "Bao", neighbourhood: "Soho" },
  { venueName: "Bar Termini", neighbourhood: "Soho" },
  { venueName: "Monmouth Coffee", neighbourhood: "London Bridge" },
  { venueName: "Dishoom", neighbourhood: "King's Cross" },
  { venueName: "Lina Stores", neighbourhood: "Soho" },
  { venueName: "WatchHouse", neighbourhood: "Marylebone" },
];

const DATE_DETAIL_NOTES = [
  "Tether picked this for an easy first-meet rhythm and relaxed conversation.",
  "This setting supports comfort, chemistry, and a natural handoff into the date.",
  "A low-pressure setting that gives you both space to settle in and connect.",
  "Best for steady conversation flow and a balanced first in-person read.",
];

function safeString(value, fallback = "") {
  const v = typeof value === "string" ? value.trim() : "";
  return v || fallback;
}

function safeNumber(value, fallback = null) {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function getFallbackVenue(matchId = "") {
  const idx = Math.abs(String(matchId).split("").reduce((acc, c) => acc + c.charCodeAt(0), 0)) % VENUE_FALLBACKS.length;
  return VENUE_FALLBACKS[idx];
}

function getDetailNote(matchId = "") {
  const idx = Math.abs(String(matchId).split("").reduce((acc, c) => acc + c.charCodeAt(0), 0)) % DATE_DETAIL_NOTES.length;
  return DATE_DETAIL_NOTES[idx];
}

export function getDisplayName(match) {
  return safeString(match?.displayName, safeString(match?.name, "Tether match"));
}

export function getAge(match) {
  const age = safeNumber(match?.age, null);
  return age && age > 0 ? age : null;
}

export function getPhotoPath(match) {
  return safeString(match?.photoPath, safeString(match?.image, ""));
}

export function getLocationLabel(match) {
  return safeString(match?.distanceLabel, safeString(match?.location, "London"));
}

export function getCompatibilityScore(match) {
  const score = safeNumber(match?.compatibilityScore, safeNumber(match?.score, 0));
  return Number.isFinite(score) ? Math.max(0, Math.min(100, Math.round(score))) : 0;
}

export function getVenueName(match) {
  return safeString(match?.firstDateSuggestion?.venueName, safeString(match?.venueName, getFallbackVenue(match?.id).venueName));
}

export function getDateTimeLabel(match, index = 0) {
  const slots = ["Tomorrow, 7:00 PM", "Friday, 7:30 PM", "Saturday, 6:30 PM", "Sunday, 5:30 PM"];
  return slots[index % slots.length];
}

function toBaseCard(match, index = 0) {
  const displayName = getDisplayName(match);
  const age = getAge(match);
  const photoPath = getPhotoPath(match);
  const locationLabel = getLocationLabel(match);
  const score = getCompatibilityScore(match);
  const fallbackVenue = getFallbackVenue(match?.id);
  return {
    id: safeString(match?.id, `demo-${index}`),
    uiKey: `${safeString(match?.id, `demo-${index}`)}-${index}`,
    displayName,
    age,
    photoPath,
    photos: Array.isArray(match?.photos) ? match.photos.filter(Boolean) : [photoPath].filter(Boolean),
    locationLabel,
    neighbourhood: safeString(match?.firstDateSuggestion?.neighbourhood, fallbackVenue.neighbourhood),
    compatibilityScore: score,
    venueName: getVenueName(match),
    shortBio: safeString(match?.shortBio, ""),
    oneLineVibe: safeString(match?.oneLineVibe, safeString(match?.shortBio, "")),
    verified: true,
  };
}

function isFiniteScore(v) {
  return Number.isFinite(Number(v));
}

function safeDelta(initialScore, updatedScore) {
  if (!isFiniteScore(initialScore) || !isFiniteScore(updatedScore)) return null;
  return Math.round(Number(updatedScore) - Number(initialScore));
}

export function getMatchesTabData(matches = [], _context = {}) {
  const base = (matches || []).map((m, i) => toBaseCard(m, i)).filter((m) => m.photoPath && m.displayName);

  const total = base.length;
  const firstDateBookedCount = Math.max(1, Math.min(total, Math.floor(total * 0.3)));
  const firstDateBooked = base.slice(0, firstDateBookedCount).map((m, i) => ({
    ...m,
    dateTimeLabel: getDateTimeLabel(m, i),
    bookingStatus: i % 3 === 1 ? "Pending confirmation" : "Confirmed",
    tetherRecommendationNote: getDetailNote(m.id),
    firstDateState: i % 3 === 1 ? "waiting_confirmation" : "confirmed",
  })).map((m) => ({
    ...m,
    showDateDetails: m.firstDateState === "confirmed",
    statusBannerText:
      m.firstDateState === "confirmed"
        ? `${m.venueName} · ${m.dateTimeLabel}`
        : "Waiting for your match to confirm date details",
  }));
  const newMatches = base.slice(firstDateBookedCount);

  const nextDates = base.slice(0, Math.min(total, 6)).map((m, i) => ({
    ...m,
    dateStage: i % 2 === 0 ? "3rd" : "2nd",
    stageNumber: i % 2 === 0 ? 3 : 2,
    dateTimeLabel: getDateTimeLabel(m, i),
    bookingStatus: i % 4 === 3 ? "Confirmed" : "Pending",
    tetherRecommendationNote: getDetailNote(m.id),
    progressionState:
      i % 4 === 0
        ? "feedback_required"
        : i % 4 === 1
          ? "waiting_for_response"
          : i % 4 === 2
            ? "ready_for_next_date"
            : "date_booked",
  })).map((m) => ({
    ...m,
    feedbackRequired: m.progressionState === "feedback_required",
    statusMessage:
      m.progressionState === "feedback_required"
        ? "Tell us how your last date felt before booking the next one."
        : m.progressionState === "waiting_for_response"
          ? "Waiting to hear back from your match."
          : m.progressionState === "ready_for_next_date"
            ? "You’re both open to the next step."
            : "Your next date is confirmed.",
    actionLabel:
      m.progressionState === "feedback_required"
        ? "Let's do a quick reflection"
        : m.progressionState === "waiting_for_response"
          ? "Waiting for response"
          : m.progressionState === "ready_for_next_date"
            ? "Book next date"
            : "Date booked",
    showDateDetails: m.progressionState === "date_booked",
  }));

  const pastDatesFeedback = base.slice(0, Math.min(total, 5)).map((m, i) => {
    const initialScore = getCompatibilityScore(m);
    const updatedScore = i === 0 ? null : Math.max(initialScore - (8 + (i % 6)), 50);
    const feedbackStatus = i === 0 ? "not_completed" : i % 3 === 0 ? "not_continued" : "completed";
    return {
      ...m,
      dateStage: i % 3 === 0 ? "1st Date" : i % 3 === 1 ? "2nd Date" : "3rd Date",
      feedbackStatus,
      initialScore,
      updatedScore,
      scoreDelta: safeDelta(initialScore, updatedScore),
      statusMessage:
        feedbackStatus === "not_completed"
          ? "Feedback not yet completed"
          : feedbackStatus === "completed"
            ? "Feedback completed"
            : "You decided not to continue",
      actionLabel: feedbackStatus === "not_completed" ? "Give Feedback" : "View Feedback",
      dateTimeLabel: getDateTimeLabel(m, i),
    };
  });

  return {
    newMatches,
    firstDateBooked,
    nextDates,
    pastDatesFeedback,
  };
}
