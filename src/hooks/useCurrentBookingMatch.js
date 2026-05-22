import { useCurrentMatch } from "@/hooks/useCurrentMatch";
import { getBookingByBookingId } from "@/data/demo/demoBookings";

function bookingToMatchId(bookingId) {
  if (!bookingId) return null;
  const raw = String(bookingId);
  if (raw.startsWith("booking-")) return raw.replace("booking-", "");
  if (raw.startsWith("feedback-")) return raw.replace("feedback-", "");
  if (raw.startsWith("date-")) return raw.replace("date-", "");
  return null;
}

export function useCurrentBookingMatch(bookingId, audienceKey = "booking") {
  const booking = getBookingByBookingId(bookingId);
  const inferredMatchId = booking?.matchId || bookingToMatchId(bookingId) || bookingId;
  const result = useCurrentMatch(inferredMatchId, audienceKey);
  return { ...result, bookingMatchId: inferredMatchId, booking };
}
