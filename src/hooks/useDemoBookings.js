import { useCallback, useMemo, useState } from "react";
import {
  buildDemoBooking,
  getBookingByBookingId,
  getBookingByMatchId,
  getCancellationCount,
  getStoredBookings,
  setCancellationCount,
  upsertBooking,
} from "@/data/demo/demoBookings";

export function useDemoBookings() {
  const [bookings, setBookings] = useState(() => getStoredBookings());
  const [cancellationCountBeforeFirstCompletedDate, setCancelCount] = useState(() => getCancellationCount());

  const refresh = useCallback(() => {
    setBookings(getStoredBookings());
    setCancelCount(getCancellationCount());
  }, []);

  const createBooking = useCallback((payload) => {
    const booking = buildDemoBooking(payload);
    upsertBooking(booking);
    refresh();
    return booking;
  }, [refresh]);

  const incrementCancellationCount = useCallback(() => {
    const next = cancellationCountBeforeFirstCompletedDate + 1;
    setCancellationCount(next);
    setCancelCount(next);
  }, [cancellationCountBeforeFirstCompletedDate]);

  const byBookingId = useCallback((bookingId) => getBookingByBookingId(bookingId), []);
  const byMatchId = useCallback((matchId) => getBookingByMatchId(matchId), []);

  return useMemo(
    () => ({
      bookings,
      createBooking,
      refresh,
      cancellationCountBeforeFirstCompletedDate,
      incrementCancellationCount,
      getBookingByBookingId: byBookingId,
      getBookingByMatchId: byMatchId,
    }),
    [bookings, createBooking, refresh, cancellationCountBeforeFirstCompletedDate, incrementCancellationCount, byBookingId, byMatchId],
  );
}
