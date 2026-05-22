import { MEMBERSHIP_CHAT_OPEN_COPY } from "@/data/demo/dateUpgradeOptions";

export default function BookingConfirmationCard({ booking, matchName, membershipTier, onViewJourney, onBackToMatches }) {
  if (!booking) return null;

  return (
    <div className="rounded-2xl border border-border bg-card p-3.5 space-y-3">
      <h3 className="font-heading font-bold text-base">Date request sent</h3>
      <p className="text-xs text-muted-foreground leading-relaxed">
        We’ll ask {matchName} to confirm the time and location. Once you’re both set, chat and video call will open before the date.
      </p>
      <p className="text-sm font-semibold leading-snug">{MEMBERSHIP_CHAT_OPEN_COPY[membershipTier] || MEMBERSHIP_CHAT_OPEN_COPY.standard}</p>
      <div className="rounded-xl border border-border bg-background p-3 text-sm">
        <p><span className="font-semibold">When:</span> {booking.selectedDate} at {booking.selectedTime}</p>
        <p className="mt-1"><span className="font-semibold">Where:</span> {booking.selectedLocation?.label || "London"}</p>
      </div>
      <div className="flex gap-2">
        <button type="button" onClick={onViewJourney} className="flex-1 rounded-full bg-primary text-primary-foreground py-2.5 text-xs font-semibold">View Date Journey</button>
        <button type="button" onClick={onBackToMatches} className="flex-1 rounded-full border border-border py-2.5 text-xs font-semibold">Back to Matches</button>
      </div>
    </div>
  );
}
