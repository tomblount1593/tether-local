import { useEffect, useState } from "react";
import { ChevronDown, Clock3, MapPin, Sparkles } from "lucide-react";
import { getDefaultDateLocation } from "@/data/demo/dateLocations";
import { MATCHES_REFERENCE } from "@/constants/matchesReference";

function getDateDetailsTheme(tier = "standard") {
  if (tier === "premium") {
    return {
      surface: "rgba(55,66,58,0.46)",
      surfaceAlt: "#37423a",
      border: "rgba(248,243,241,0.18)",
      titleText: "#f8f3f1",
      bodyText: "rgba(248,243,241,0.78)",
      noteBg: "rgba(55,66,58,0.46)",
      noteBorder: "rgba(248,243,241,0.18)",
      noteText: "#f8f3f1",
    };
  }

  if (tier === "concierge") {
    return {
      surface: "#242623",
      surfaceAlt: "#242623",
      border: "rgba(210,198,178,0.30)",
      titleText: "#d2c6b2",
      bodyText: "rgba(210,198,178,0.78)",
      noteBg: "#242623",
      noteBorder: "rgba(210,198,178,0.30)",
      noteText: "#d2c6b2",
    };
  }

  return {
    surface: "#f8f3f1",
    surfaceAlt: "#e7e5e1",
    border: "hsl(var(--border))",
    titleText: "#37423a",
    bodyText: "hsl(var(--muted-foreground))",
    noteBg: "#f8f3f1",
    noteBorder: MATCHES_REFERENCE.darkGreenBorder,
    noteText: "#37423a",
  };
}

function toTitleCase(value = "") {
  return String(value)
    .replace(/[_-]/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function DetailItem({ label, value, theme }) {
  return (
    <div className="overflow-hidden rounded-xl border" style={{ borderColor: theme.border, background: theme.surface }}>
      <div className="px-3 py-0.5 min-h-[24px] flex items-center justify-center" style={{ background: theme.surfaceAlt }}>
        <p className="font-heading font-bold text-[15px] leading-tight text-center" style={{ color: theme.titleText }}>{label}</p>
      </div>
      <div className="px-3 py-0.5 min-h-[26px] flex items-center justify-center">
        <p className="text-[11px] font-body leading-snug text-center" style={{ color: theme.bodyText }}>{value}</p>
      </div>
    </div>
  );
}

export default function DateDetailsAccordion({
  match,
  stageLabel = "",
  open: controlledOpen,
  onOpenChange,
  tier = "standard",
  buttonBackgroundOverride = null,
  buttonTextColorOverride = null,
}) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  const open = typeof controlledOpen === "boolean" ? controlledOpen : uncontrolledOpen;

  useEffect(() => {
    if (typeof controlledOpen === "boolean") return;
    onOpenChange?.(uncontrolledOpen);
  }, [onOpenChange, controlledOpen, uncontrolledOpen]);
  const location = getDefaultDateLocation(match);
  const venue = match?.venueName || location?.name || "Planned venue";
  const area = match?.neighbourhood || location?.area || "London";
  const dateType = stageLabel || location?.dateType || "Date";
  const tags = Array.isArray(location?.tags) && location.tags.length ? location.tags.slice(0, 3).join(" · ") : "Relaxed first-meet setting";
  const keyAddress = location?.label || `${venue}, ${area}`;
  const bookingStatus = match?.bookingStatus || "Confirmed";
  const recommendationNote = match?.tetherRecommendationNote || "Tether picked this setting to keep the date feeling easy and natural.";
  const theme = getDateDetailsTheme(tier);
  const standardDetailBannerBg = tier === "standard" ? theme.surfaceAlt : theme.surface;
  const tierButtonStyle =
    tier === "premium"
      ? { background: "#37423a", color: "#f8f3f1" }
      : tier === "concierge"
        ? { background: "#242623", color: "#d2c6b2", borderColor: "rgba(210,198,178,0.30)" }
        : undefined;
  const buttonStyle = buttonBackgroundOverride
    ? {
        ...tierButtonStyle,
        background: buttonBackgroundOverride,
        ...(buttonTextColorOverride ? { color: buttonTextColorOverride } : {}),
      }
    : tierButtonStyle;

  return (
    <div className="border-t border-border">
      <button
        type="button"
        onClick={() => {
          const next = !open;
          if (typeof controlledOpen === "boolean") {
            onOpenChange?.(next);
            return;
          }
          setUncontrolledOpen(next);
        }}
        className="btn-hover-dark w-full bg-primary px-4 py-2.5 text-primary-foreground"
        style={buttonStyle}
      >
        <div className="grid grid-cols-[1fr_auto_auto_1fr] items-center min-h-[18px]">
          <div />
          <p className="font-heading font-bold text-[15px] leading-tight text-center whitespace-nowrap">
            Click for Date Details
          </p>
          <div className="pl-2">
            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${open ? "rotate-180" : ""}`} />
          </div>
          <div />
        </div>
        </button>

      {open ? (
        <div className="px-4 py-1.5 bg-card border-t border-border space-y-1.5">
          <DetailItem label="Date type" value={toTitleCase(dateType)} theme={theme} />

          <div className="grid grid-cols-2 gap-1.5">
            <DetailItem label="Venue" value={venue} theme={theme} />
            <DetailItem label="Booking status" value={bookingStatus} theme={theme} />
            <DetailItem label="Time" value={match?.dateTimeLabel || "To be confirmed"} theme={theme} />
            <DetailItem label="Area" value={area} theme={theme} />
          </div>

          <div className="rounded-xl border px-3 py-1.25 space-y-0.5" style={{ borderColor: theme.border, background: standardDetailBannerBg }}>
            <div className="flex items-center justify-center gap-1.5" style={{ color: theme.titleText }}>
              <MapPin className="w-3.5 h-3.5" />
              <p className="font-heading font-bold text-[15px] leading-tight text-center">Key address</p>
            </div>
            <p className="text-[11px] font-body leading-snug text-center" style={{ color: theme.bodyText }}>{keyAddress}</p>
          </div>

          <div className="rounded-xl border px-3 py-1.25 space-y-0.5" style={{ borderColor: theme.border, background: standardDetailBannerBg }}>
            <div className="flex items-center justify-center gap-1.5" style={{ color: theme.titleText }}>
              <Sparkles className="w-3.5 h-3.5" />
              <p className="font-heading font-bold text-[15px] leading-tight text-center">What it is</p>
            </div>
            <p className="text-[11px] font-body leading-snug text-center" style={{ color: theme.bodyText }}>{tags}</p>
          </div>

          <div className="rounded-xl border px-3 py-1.25 space-y-0.5" style={{ borderColor: theme.border, background: standardDetailBannerBg }}>
            <div className="flex items-center justify-center gap-1.5" style={{ color: theme.titleText }}>
              <Sparkles className="w-3.5 h-3.5" />
              <p className="font-heading font-bold text-[15px] leading-tight text-center">Tether note</p>
            </div>
            <p className="text-[11px] font-body leading-snug text-center" style={{ color: theme.bodyText }}>{recommendationNote}</p>
          </div>

          <div
            className="rounded-xl border px-3 py-0.75 text-center"
            style={{ borderColor: theme.noteBorder, background: theme.noteBg }}
          >
            <div className="inline-flex items-start justify-center gap-1.5 text-left" style={{ color: theme.noteText }}>
              <Clock3 className="w-3.5 h-3.5 mt-[1px] flex-shrink-0" />
              <p className="text-[11px] font-body leading-snug">
                <span className="block">Arrive a few minutes early so the handoff</span>
                <span className="block">into the date feels easy.</span>
              </p>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
