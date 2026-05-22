import { useEffect, useMemo, useRef, useState } from "react";
import { CheckCircle2, ChevronDown, MapPin } from "lucide-react";

const COMING_SOON_CITIES = [
  "Manchester",
  "Birmingham",
  "Liverpool",
  "Newcastle",
  "Leeds",
  "Bristol",
  "Edinburgh",
  "Glasgow",
  "Cardiff",
  "Nottingham",
  "Sheffield",
  "Brighton",
  "Oxford",
  "Cambridge",
  "Bath",
];

export default function LocationAvailabilitySelector({
  selectedCity = "",
  onSelectCity,
  theme = "standard",
  showError = false,
}) {
  const [open, setOpen] = useState(false);
  const [tappedDisabled, setTappedDisabled] = useState(false);
  const rootRef = useRef(null);
  const panelId = "city-availability-panel";

  const palette = useMemo(() => {
    if (theme === "concierge") {
      return {
        bg: "#0a0d0a",
        card: "#232623",
        primary: "#d8c6ae",
        secondary: "rgba(216,198,174,0.78)",
        border: "rgba(216,198,174,0.28)",
        disabledText: "rgba(216,198,174,0.38)",
        disabledBg: "rgba(35,38,35,0.72)",
      };
    }
    if (theme === "premium") {
      return {
        bg: "#5b655d",
        card: "#37423a",
        primary: "#f8f3f1",
        secondary: "rgba(248,243,241,0.78)",
        border: "rgba(248,243,241,0.22)",
        disabledText: "rgba(248,243,241,0.42)",
        disabledBg: "rgba(55,66,58,0.36)",
      };
    }
    return {
      bg: "#f8f3f1",
      card: "#f8f3f1",
      primary: "#37423a",
      secondary: "rgba(55,66,58,0.72)",
      border: "rgba(55,66,58,0.28)",
      disabledText: "rgba(55,66,58,0.38)",
      disabledBg: "rgba(212,210,205,0.36)",
    };
  }, [theme]);

  const londonSelected = selectedCity === "London";
  const cityLabel = londonSelected ? "London" : "Choose city";
  const citySubLabel = londonSelected ? "Available now" : "Select your city";
  const shouldShowMessage = showError || tappedDisabled;

  useEffect(() => {
    const handleOutside = (event) => {
      if (!rootRef.current) return;
      if (!rootRef.current.contains(event.target)) setOpen(false);
    };
    const handleKey = (event) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", handleOutside);
    document.addEventListener("touchstart", handleOutside);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleOutside);
      document.removeEventListener("touchstart", handleOutside);
      document.removeEventListener("keydown", handleKey);
    };
  }, []);

  return (
    <div className="space-y-2" ref={rootRef}>
      <p className="app-section-title text-muted-foreground">City Availability</p>

      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="onboarding-control w-full rounded-xl border px-4 py-2.5 transition-all"
        data-selected={londonSelected ? "true" : "false"}
        style={{ borderColor: palette.border, color: londonSelected ? undefined : palette.primary }}
        aria-expanded={open}
        aria-controls={panelId}
      >
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <MapPin className="h-4 w-4" />
            <div className="text-left">
              <p className="onboarding-control-title">{cityLabel}</p>
              <p className="onboarding-control-subtitle" style={{ color: londonSelected ? undefined : palette.secondary }}>{citySubLabel}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {londonSelected ? <CheckCircle2 className="h-4 w-4" /> : null}
            <ChevronDown
              className="h-4 w-4 transition-transform"
              style={{ color: londonSelected ? undefined : palette.secondary, transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
            />
          </div>
        </div>
      </button>

      <div
        id={panelId}
        className="overflow-hidden rounded-2xl border transition-all duration-200"
        style={{
          background: palette.card,
          borderColor: palette.border,
          maxHeight: open ? "320px" : "0px",
          opacity: open ? 1 : 0,
          padding: open ? "12px" : "0 12px",
          overflowY: open ? "auto" : "hidden",
        }}
      >
        <div className="space-y-2">
          <button
            type="button"
            onClick={() => {
              onSelectCity("London");
              setTappedDisabled(false);
              setOpen(false);
            }}
            className="onboarding-control w-full rounded-xl border px-3 py-1.5 text-left"
            data-selected={londonSelected ? "true" : "false"}
            style={{
              borderColor: palette.border,
              color: londonSelected ? undefined : palette.primary,
            }}
            aria-selected={londonSelected}
          >
            <div className="flex items-center justify-between gap-2">
              <div>
                <p className="onboarding-control-title">London</p>
                <p className="onboarding-control-subtitle" style={{ color: palette.secondary }}>Available now</p>
              </div>
              {londonSelected ? <CheckCircle2 className="h-4 w-4" /> : null}
            </div>
          </button>

          {COMING_SOON_CITIES.map((city) => (
            <button
              key={city}
              type="button"
              onClick={() => setTappedDisabled(true)}
              className="onboarding-control onboarding-control--disabled w-full rounded-xl border px-3 py-2 text-left"
              style={{ borderColor: palette.border, background: palette.disabledBg, color: palette.disabledText }}
              aria-disabled="true"
            >
              <div className="flex items-center justify-between gap-2">
                <p className="onboarding-control-title">{city}</p>
                <p className="onboarding-control-subtitle">Coming soon</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {shouldShowMessage ? (
        <p className="text-xs" style={{ color: palette.secondary }}>
          Tether is currently available in London. More cities are coming soon.
        </p>
      ) : null}
    </div>
  );
}
