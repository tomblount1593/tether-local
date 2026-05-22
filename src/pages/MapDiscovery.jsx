import { useEffect, useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";
import { useTier } from "../hooks/useTier";
import TetherGoogleMap from "@/components/TetherGoogleMap";
import { getGoogleMapIdForTier } from "@/config/googleMaps";

const STANDARD_RADIUS_OPTIONS = [
  { label: "+10 mi", value: 10 },
  { label: "+25 mi", value: 25 },
  { label: "+50 mi", value: 50 },
];

const ELEVATED_RADIUS_OPTIONS = [
  { label: "1 mi", value: 1 },
  { label: "2.5 mi", value: 2.5 },
  { label: "5 mi", value: 5 },
  { label: "7.5 mi", value: 7.5 },
  { label: "10 mi", value: 10 },
];

const SORT_OPTIONS = [
  { value: "compatibility", label: "Compatibility" },
  { value: "distance", label: "Distance" },
  { value: "newest", label: "Newest" },
];

function formatMiles(miles) {
  const value = Number(miles);
  if (!Number.isFinite(value)) return "0";
  return Number.isInteger(value) ? String(value) : value.toFixed(1);
}

function radiusControlTestId(value) {
  const radius = Number(value);
  if (radius === 2.5) return "map-radius-control-25";
  if (radius === 7.5) return "map-radius-control-75";
  return `map-radius-control-${formatMiles(radius)}`;
}

export default function MapDiscovery() {
  const { tier } = useTier();
  const isPremium = tier === "premium";
  const isConcierge = tier === "concierge";
  const isElevated = isPremium || isConcierge;
  const radiusOptions = useMemo(
    () => (isElevated
      ? ELEVATED_RADIUS_OPTIONS
      : STANDARD_RADIUS_OPTIONS),
    [isElevated],
  );
  const [radius, setRadius] = useState(() => (isElevated ? 5 : (radiusOptions[0]?.value || 10)));
  const [sortBy, setSortBy] = useState("compatibility");
  const [sortOpen, setSortOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(0);
  const [outRadiusCount, setOutRadiusCount] = useState(0);
  const [distanceScope, setDistanceScope] = useState("local");
  const mapId = getGoogleMapIdForTier(tier);

  const scopeOptions = useMemo(() => {
    if (isConcierge) {
      return [
        { value: "local", label: "Local radius" },
        { value: "nationwide", label: "Nationwide" },
        { value: "global", label: "Global" },
      ];
    }
    if (isPremium) return [];
    return SORT_OPTIONS;
  }, [isPremium, isConcierge]);

  const activeButtonStyle = {
    background: "var(--onboarding-control-active-bg)",
    color: "var(--onboarding-control-active-text)",
    borderColor: "var(--onboarding-control-active-border)",
  };

  const inactiveButtonStyle = {
    background: "var(--onboarding-control-bg)",
    color: "var(--onboarding-control-text)",
    borderColor: "var(--onboarding-control-border)",
  };

  const countCopy = useMemo(() => {
    if (visibleCount === 0) return `Showing 0 nearby potential matches`;
    if (visibleCount === 1) return "Showing 1 nearby potential match";
    return `Showing ${visibleCount} nearby potential matches`;
  }, [visibleCount]);

  useEffect(() => {
    if (isElevated) {
      const numeric = Number(radius);
      if (!Number.isFinite(numeric)) {
        setRadius(5);
        return;
      }
      const clamped = Math.max(1, Math.min(50, numeric));
      if (clamped !== numeric) setRadius(clamped);
      return;
    }
    if (!radiusOptions.some((opt) => opt.value === radius)) {
      setRadius(radiusOptions[0]?.value || 10);
    }
  }, [isElevated, radiusOptions, radius]);

  useEffect(() => {
    if (!isConcierge) {
      setDistanceScope("local");
    }
  }, [isConcierge]);

  const increaseRadius = () => {
    const idx = radiusOptions.findIndex((opt) => opt.value === radius);
    if (idx < 0) return;
    const next = radiusOptions[Math.min(idx + 1, radiusOptions.length - 1)];
    if (next && next.value !== radius) setRadius(next.value);
  };

  const handleMapExpandRequest = (targetMiles) => {
    const target = Math.max(1, Math.min(50, Number(targetMiles) || 1));
    setDistanceScope("local");
    setRadius(Math.ceil(target));
  };

  return (
    <div
      className={`map-page map-page--${tier} max-w-lg mx-auto`}
      data-testid="map-page"
      style={{
        height: "calc(100dvh - var(--membership-banner-height) - var(--bottom-nav-height))",
        minHeight: 0,
        overflow: "hidden",
      }}
    >
      <div className="map-page-content">
        <div className="map-page-head" data-testid="map-page-header">
          <h1 className="font-heading font-bold text-xl page-title" data-testid="map-title">Nearby Potential Matches</h1>
          <p className="text-sm font-body text-muted-foreground" data-testid="map-subtitle">See where your best matches are</p>
          <p className="text-xs font-body text-muted-foreground mt-1" data-testid="map-count">{countCopy}</p>

          <div className={`map-page-controls ${isElevated ? "map-page-controls--elevated" : ""}`}>
            {radiusOptions.map((r) => (
              <button
                type="button"
                key={r.value}
                aria-pressed={radius === r.value}
                onClick={() => setRadius(r.value)}
                className="map-radius-btn"
                style={radius === r.value ? activeButtonStyle : inactiveButtonStyle}
                data-testid={radiusControlTestId(r.value)}
              >
                {r.label}
              </button>
            ))}

            <div className="relative">
              <button
                type="button"
                onClick={() => setSortOpen((v) => !v)}
                className="map-radius-btn map-sort-btn"
                style={sortOpen ? activeButtonStyle : inactiveButtonStyle}
                data-testid="map-radius-dropdown"
              >
                {isElevated
                  ? `Adjust Mile Radius · ${formatMiles(radius)} mi`
                  : SORT_OPTIONS.find((s) => s.value === sortBy)?.label || "Compatibility"}
                <ChevronDown className={`map-sort-btn__chevron w-3.5 h-3.5 transition-transform ${sortOpen ? "rotate-180" : ""}`} />
              </button>

              {sortOpen && (
                <div className="map-sort-dropdown">
                  {isElevated ? (
                    <div className="map-radius-adjuster">
                      <p className="map-radius-adjuster__title">Adjust Mile Radius</p>
                      <div className="map-radius-adjuster__row">
                        <span>1 mi</span>
                        <input
                          data-testid="map-radius-slider"
                          type="range"
                          min={1}
                          max={50}
                          step={1}
                          value={radius}
                          onInput={(e) => {
                            setDistanceScope("local");
                            setRadius(Math.round(Number(e.currentTarget.value)));
                          }}
                          onChange={(e) => {
                            setDistanceScope("local");
                            setRadius(Math.round(Number(e.currentTarget.value)));
                          }}
                          className="map-radius-adjuster__slider"
                        />
                        <span>50 mi</span>
                      </div>
                      <p className="map-radius-adjuster__value" data-testid="map-radius-slider-value">{formatMiles(radius)} miles</p>
                      {scopeOptions.length > 0 && scopeOptions.map((option) => {
                        const selected = distanceScope === option.value;
                        return (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() => setDistanceScope(option.value)}
                            className="map-sort-dropdown__item map-sort-dropdown__item--center"
                            style={selected ? activeButtonStyle : undefined}
                          >
                            {option.label}
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    scopeOptions.map((option) => {
                      const selected = sortBy === option.value;
                      return (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => {
                            setSortBy(option.value);
                            setSortOpen(false);
                          }}
                          className="map-sort-dropdown__item"
                          style={selected ? activeButtonStyle : undefined}
                        >
                          {option.label}
                        </button>
                      );
                    })
                  )}
                </div>
              )}
            </div>
          </div>

          {visibleCount === 0 && (
            <button
              type="button"
              className="map-expand-btn"
              onClick={increaseRadius}
            >
              Expand radius
            </button>
          )}
        </div>

        <div
          className="tether-map-card"
          data-testid="tether-map-card"
          data-map-tier={tier}
          data-map-id={mapId}
          data-active-radius={formatMiles(radius)}
          data-visible-match-count={String(visibleCount)}
          data-out-radius-count={String(outRadiusCount)}
        >
          <TetherGoogleMap
            radiusMiles={radius}
            sortBy={sortBy}
            onVisibleCountChange={setVisibleCount}
            onOutOfRadiusCountChange={setOutRadiusCount}
            radiusOptions={radiusOptions.map((opt) => opt.value)}
            distanceScope={distanceScope}
            onRequestExpandDistance={handleMapExpandRequest}
          />
        </div>
      </div>
    </div>
  );
}
