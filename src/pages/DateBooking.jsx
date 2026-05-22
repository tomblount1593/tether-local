import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCurrentMatch } from "@/hooks/useCurrentMatch";
import BackButton from "@/components/BackButton";
import DateLocationPicker from "@/components/DateLocationPicker";
import DateUpgradeAccordion from "@/components/DateUpgradeAccordion";
import DateReassuranceCard from "@/components/DateReassuranceCard";
import BookingConfirmationCard from "@/components/BookingConfirmationCard";
import { getDefaultDateLocation } from "@/data/demo/dateLocations";
import { useDemoBookings } from "@/hooks/useDemoBookings";
import CompatibilityScoreBadge from "@/components/CompatibilityScoreBadge";
import { getCompatibilityTone } from "@/lib/compatibilityTone";
import { MATCHES_REFERENCE } from "@/constants/matchesReference";
import { getConversationsRoute, getDateJourneyRoute, getMatchesRoute } from "@/lib/matchFlowRoutes";

const TIMES = ["18:00", "18:30", "19:00", "19:30", "20:00"];

function SectionBanner({ title, subtitle, tier }) {
  const bg = tier === "concierge" ? "#232623" : "#37423a";
  const color = tier === "concierge" ? "#d8c6ae" : "#f8f3f1";
  return (
    <div className="rounded-[20px] px-4 py-2.5 mb-3 text-center" style={{ background: bg, color }}>
      <p className="font-heading font-bold text-base leading-tight">{title}</p>
      {subtitle ? <p className="font-body text-xs mt-0.5 opacity-90 leading-tight">{subtitle}</p> : null}
    </div>
  );
}

export default function DateBooking() {
  const { matchId } = useParams();
  const navigate = useNavigate();
  const routeLocation = useLocation();
  const { context, match } = useCurrentMatch(matchId, "book-date");
  const membershipTier = context?.membershipTier || "standard";
  const { createBooking, cancellationCountBeforeFirstCompletedDate } = useDemoBookings();
  const [date, setDate] = useState(new Date(Date.now() + 3 * 86400000).toISOString().split("T")[0]);
  const [time, setTime] = useState("19:00");
  const [customTime, setCustomTime] = useState("");
  const [locationPickerOpen, setLocationPickerOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [selectedUpgradeId, setSelectedUpgradeId] = useState(null);
  const [upgradeTiming, setUpgradeTiming] = useState("decide_after_confirmation");
  const [booking, setBooking] = useState(null);
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, []);
  const scoreTone = getCompatibilityTone(Number(match?.compatibilityScore) || 65, membershipTier);
  const primaryOutlineStyle =
    membershipTier === "concierge"
      ? { borderColor: "#d8c6ae" }
      : membershipTier === "premium"
        ? { borderColor: "#37423a" }
        : { borderColor: "#37423a" };
  if (!match) {
    return (
      <div className="max-w-lg mx-auto min-h-screen bg-background px-4 py-6" data-testid="date-booking-page">
        <div className="flex items-center gap-2">
          <BackButton />
          <h1 className="font-heading font-bold text-xl">Book a Date</h1>
        </div>
        <div className="rounded-2xl border border-border bg-card p-4 mt-4">
          <p className="font-body text-sm">We couldn’t load this match. Please return to Interested In You.</p>
        </div>
      </div>
    );
  }

  const selectedMeetingLocation = selectedLocation || getDefaultDateLocation(match, context);
  const showConfidenceCheck = cancellationCountBeforeFirstCompletedDate >= 3;
  const upgradeStatus = (() => {
    if (!selectedUpgradeId) return "not_selected";
    if (upgradeTiming === "decide_after_confirmation") return "pending_match_response";
    if ((match.compatibilityScore || 0) >= 88) return "accepted_by_match";
    if ((match.compatibilityScore || 0) <= 67) return "declined_by_match";
    return "pending_match_response";
  })();

  const submitBooking = () => {
    const created = createBooking({
      match,
      membershipTier,
      selectedDate: date,
      selectedTime: time,
      selectedLocation: selectedMeetingLocation,
      selectedUpgradeId,
      upgradeTiming,
    });
    setBooking(created);
  };

  return (
    <div className="max-w-lg mx-auto min-h-screen bg-background px-4 py-6 space-y-4" data-testid="date-booking-page">
      <div className="flex items-center gap-2">
        <BackButton />
        <h1 className="font-heading font-bold text-xl">Book a Date</h1>
      </div>

      <div
        className="rounded-2xl border-2 bg-card overflow-hidden"
        style={{ ...primaryOutlineStyle, borderColor: MATCHES_REFERENCE.darkGreenBorder }}
        data-testid="date-booking-selected-match"
      >
        <div className="p-3.5 flex items-center gap-3 bg-card">
          <img src={match.photoPath} alt={match.displayName} className="w-14 h-14 rounded-full object-cover" />
          <div className="flex-1">
            <p className={MATCHES_REFERENCE.primaryTextClass}>{match.displayName}, {match.age}</p>
            <p className={`${MATCHES_REFERENCE.secondaryTextClass} flex items-center gap-1 mt-0.5`}><MapPin className="w-3 h-3" />{match.distanceLabel || match.location}</p>
          </div>
          <CompatibilityScoreBadge score={Number(match.compatibilityScore) || 65} size="sm" tier={membershipTier} scoreColor={scoreTone.text} />
        </div>
        <div className="border-t border-border bg-card/80 px-3.5 py-3">
          <DateUpgradeAccordion
            membershipTier={membershipTier}
            selectedUpgradeId={selectedUpgradeId}
            onSelectUpgrade={setSelectedUpgradeId}
            upgradeTiming={upgradeTiming}
            onUpgradeTimingChange={setUpgradeTiming}
            upgradeStatus={upgradeStatus}
            embedded
          />
        </div>
      </div>

      <div className="min-w-0 rounded-2xl border-2 border-primary bg-card p-3.5 space-y-3" style={primaryOutlineStyle} data-testid="date-booking-time-options">
        <SectionBanner title="Date" subtitle="Choose your day" tier={membershipTier} />
        <input aria-label="Date" value={date} onChange={(e) => setDate(e.target.value)} type="date" className="date-booking-native-input w-full rounded-xl border border-border bg-[#e7e5e1] px-3 py-2 text-sm" />
        <SectionBanner title="Time" subtitle="Pick a suitable time" tier={membershipTier} />
        <div className="min-w-0 grid grid-cols-5 gap-2">
          {TIMES.map((t) => (
            <button
              type="button"
              aria-pressed={time === t}
              key={t}
              onClick={() => setTime(t)}
              className={`min-h-[40px] rounded-lg px-2 py-2 text-xs font-semibold border ${time === t ? "bg-primary text-primary-foreground border-primary" : "border-border bg-[#e7e5e1]"}`}
            >
              {t}
            </button>
          ))}
        </div>
        <div className="min-w-0 rounded-xl border border-border bg-[#e7e5e1] px-3 py-2">
          <label htmlFor="custom-booking-time" className="block text-xs font-medium mb-1">
            Choose another time that suits you
          </label>
          <input
            id="custom-booking-time"
            type="time"
            value={customTime}
            onChange={(e) => {
              setCustomTime(e.target.value);
              if (e.target.value) setTime(e.target.value);
            }}
            className="date-booking-native-input w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
          />
        </div>
      </div>

      <div className="min-w-0 rounded-2xl border-2 border-primary bg-card p-3.5 space-y-3" style={primaryOutlineStyle} data-testid="date-booking-location-options">
        <SectionBanner title="Preferred location" subtitle="Pick where to meet" tier={membershipTier} />
        <div className="rounded-xl border border-border bg-background p-3 text-center">
          <p className="text-sm font-semibold">{selectedLocation ? "Preferred location" : "Choose preferred location"}</p>
          <p className="text-sm mt-1">{selectedMeetingLocation?.label || "London, UK"}</p>
          <p className="text-xs text-muted-foreground mt-1">We’ll suggest a balanced meeting point once both people confirm.</p>
        </div>
        <button type="button" onClick={() => setLocationPickerOpen(true)} className="block w-full rounded-full border border-border bg-[#e7e5e1] px-5 py-2.5 text-xs font-semibold text-center">
          {selectedLocation ? "Change" : "Choose location"}
        </button>
      </div>

      <div className="rounded-2xl border-2 border-primary bg-card p-3.5" style={primaryOutlineStyle}>
        <SectionBanner title="Worried about the date?" subtitle="We’ve got you covered" tier={membershipTier} />
        <DateReassuranceCard
          membershipTier={membershipTier}
          showConfidenceBanner={showConfidenceCheck}
          onViewChatOptions={() => navigate(getConversationsRoute(routeLocation.pathname))}
        />
      </div>

      <Button className="w-full rounded-full text-sm" onClick={submitBooking}>Confirm Booking</Button>

      <BookingConfirmationCard
        booking={booking}
        matchName={match.displayName}
        membershipTier={membershipTier}
        onViewJourney={() => navigate(getDateJourneyRoute(routeLocation.pathname))}
        onBackToMatches={() => navigate(getMatchesRoute(routeLocation.pathname))}
      />

      <DateLocationPicker
        isOpen={locationPickerOpen}
        onClose={() => setLocationPickerOpen(false)}
        onSelect={setSelectedLocation}
        selectedLocation={selectedMeetingLocation}
      />
    </div>
  );
}
