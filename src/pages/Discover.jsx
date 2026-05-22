import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, MapPin, SlidersHorizontal, Sparkles, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTier } from "../hooks/useTier";
import { useCurrentDemoMatches } from "@/hooks/useCurrentDemoMatches";
import VerifiedBadge from "../components/VerifiedBadge";
import CompatibilityScoreBadge from "@/components/CompatibilityScoreBadge";
import { getInterestedInYouRoute } from "@/lib/matchFlowRoutes";
import CompatibilityBreakdown from "@/components/CompatibilityBreakdown";
import { getRouteOrientationFromContext } from "@/lib/compatibilityVariantRouting";

const BISEXUAL_FILTER_OPTIONS = [
  { value: "prefer_guys", label: "Prefer Guys" },
  { value: "prefer_girls", label: "Prefer Girls" },
  { value: "show_mix", label: "Show me a Mix" },
];

const TRANS_NB_FILTER_OPTIONS = [
  { value: "prefer_cis_men", label: "Prefer Cis Men" },
  { value: "prefer_cis_women", label: "Prefer Cis Women" },
  { value: "prefer_trans_men", label: "Prefer Trans Men" },
  { value: "prefer_trans_women", label: "Prefer Trans Women" },
  { value: "prefer_non_binary", label: "Prefer Non-Binary" },
  { value: "show_mix", label: "Show me a Mix" },
];

function getDiscoverTheme(tier) {
  if (tier === "premium") {
    return {
      summarySurface: "#5b655d",
      summaryBorder: "rgba(248, 243, 241, 0.18)",
      summaryText: "#f8f3f1",
      summaryMuted: "rgba(248, 243, 241, 0.84)",
      actionOutlineSurface: "#5b655d",
      actionOutlineBorder: "rgba(248, 243, 241, 0.18)",
      actionOutlineText: "#f8f3f1",
      sectionSurface: "#5b655d",
      photoBorder: "rgba(248, 243, 241, 0.18)",
    };
  }
  if (tier === "concierge") {
    return {
      summarySurface: "#232623",
      summaryBorder: "rgba(216, 198, 174, 0.24)",
      summaryText: "#d8c6ae",
      summaryMuted: "rgba(216, 198, 174, 0.84)",
      actionOutlineSurface: "#232623",
      actionOutlineBorder: "rgba(216, 198, 174, 0.24)",
      actionOutlineText: "#d8c6ae",
      sectionSurface: "#232623",
      photoBorder: "rgba(216, 198, 174, 0.24)",
    };
  }
  return {
    summarySurface: "hsl(var(--card))",
    summaryBorder: "hsl(var(--border))",
    summaryText: "hsl(var(--foreground))",
    summaryMuted: "hsl(var(--muted-foreground))",
    actionOutlineSurface: "hsl(var(--card))",
    actionOutlineBorder: "hsl(var(--border))",
    actionOutlineText: "hsl(var(--muted-foreground))",
    sectionSurface: "hsl(var(--background))",
    photoBorder: "hsl(var(--border))",
  };
}

export default function Discover() {
  const navigate = useNavigate();
  const { tier } = useTier();
  const { context, setContext, matches } = useCurrentDemoMatches("discover");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dismissed, setDismissed] = useState(new Set());
  const [sheetOpen, setSheetOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);

  const routeOrientation = getRouteOrientationFromContext(context);
  const isBisexual = routeOrientation === "bisexual";
  const isTransNb = routeOrientation === "trans_nonbinary";
  const activeFilter = isBisexual ? (context.bisexualFilter || "show_mix") : isTransNb ? (context.transNonBinaryFilter || "show_mix") : "";
  const discoverTheme = useMemo(() => getDiscoverTheme(tier), [tier]);

  const visible = useMemo(() => (matches || []).filter((m) => !dismissed.has(m.id)), [matches, dismissed]);
  const current = visible[currentIndex] || null;

  const onPass = () => {
    if (!current) return;
    setDismissed((prev) => new Set(prev).add(current.id));
    setCurrentIndex(0);
    setSheetOpen(false);
  };

  const onInterested = () => {
    if (!current) return;
    setDismissed((prev) => new Set(prev).add(current.id));
    setCurrentIndex(0);
    setSheetOpen(false);
  };

  const applyFilter = (value) => {
    if (isBisexual) setContext({ bisexualFilter: value });
    if (isTransNb) setContext({ transNonBinaryFilter: value });
    setCurrentIndex(0);
    setDismissed(new Set());
    setFilterOpen(false);
  };

  if (!visible.length) {
    return (
      <div className="discover-page max-w-lg mx-auto px-4" style={{ height: "calc(100dvh - var(--membership-banner-height) - var(--bottom-nav-height))", overflow: "hidden", paddingTop: "var(--discover-section-gap)", paddingBottom: "var(--discover-section-gap)" }}>
        <div className="h-full rounded-2xl border border-border bg-card flex flex-col items-center justify-center text-center px-6">
          <Sparkles className="w-8 h-8 text-muted-foreground mb-3" />
          <p className="font-heading font-bold text-lg">That&apos;s all for today</p>
          <p className="text-sm text-muted-foreground mt-1">We&apos;ll refresh your curated matches soon.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="discover-page max-w-lg mx-auto px-4" style={{ height: "calc(100dvh - var(--membership-banner-height) - var(--bottom-nav-height))", overflow: "hidden", paddingTop: "var(--discover-section-gap)", paddingBottom: "var(--discover-section-gap)" }}>
      <div className="discover-content" style={{ height: "100%", minHeight: 0, overflow: "hidden", display: "grid", gridTemplateRows: "auto var(--discover-section-gap) minmax(0,1fr) var(--discover-section-gap) auto var(--discover-section-gap) auto" }}>
        <div className="discovery-header w-full discovery-header--has-actions">
          <div className="discovery-title-stack min-w-0 flex-1">
            <h1 className="discovery-title page-title text-xl font-heading font-bold text-foreground">
              <span className="discovery-title-line">Today&apos;s Most</span>
              <span className="discovery-title-line">Compatible Matches</span>
            </h1>
            <p className="text-[11px] text-muted-foreground mt-0.5 leading-none">{Math.min(currentIndex + 1, visible.length)} of {visible.length}</p>
          </div>
          {((isBisexual || isTransNb) || tier === "standard" || tier === "premium" || tier === "concierge") && (
            <div className="discovery-header-actions">
              {(isBisexual || isTransNb) && (
                <div className="relative">
                  <button onClick={() => setFilterOpen((v) => !v)} className="discovery-filter-button btn-hover-light flex items-center justify-center gap-1 text-xs font-medium px-2.5 rounded-lg border border-border transition-all flex-shrink-0">
                    <SlidersHorizontal className="w-3.5 h-3.5" />
                    {activeFilter === "show_mix" ? "Filters" : "Filtered"}
                  </button>
                  {filterOpen && (
                    <div className="absolute right-0 mt-2 z-30 rounded-xl border shadow-lg p-1.5 min-w-[220px]" style={{ background: "hsl(var(--card))", borderColor: "hsl(var(--border))" }}>
                      {(isBisexual ? BISEXUAL_FILTER_OPTIONS : TRANS_NB_FILTER_OPTIONS).map((option) => {
                        const selected = activeFilter === option.value;
                        return (
                          <button key={option.value} type="button" onClick={() => applyFilter(option.value)} className="btn-hover-light w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-colors" style={{ background: selected ? "hsl(var(--primary))" : "transparent", color: selected ? "hsl(var(--primary-foreground))" : "hsl(var(--foreground))" }}>
                            {option.label}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
              {tier === "standard" && (
                <div className="discovery-interest-banner-wrap">
                  <button
                    onClick={() => navigate(`${getInterestedInYouRoute(window.location.pathname)}?entry=unlock`, { state: { entry: "standard_unlock_cta" } })}
                    className="discovery-upgrade-banner discovery-interest-banner btn-hover-mid flex flex-col items-center justify-center text-center text-[8px] font-semibold px-2.5 rounded-lg transition-all leading-snug"
                    data-testid="standard-unlock-interested-cta"
                  >
                    <span className="discovery-interest-banner-text">Unlock Who&apos;s</span>
                    <span className="discovery-interest-banner-text">Interested In You</span>
                    <span className="discovery-interest-banner-text mt-0.5 opacity-75">From £3.99</span>
                  </button>
                </div>
              )}
              {(tier === "premium" || tier === "concierge") && (
                <div className="discovery-interest-banner-wrap">
                  <button onClick={() => navigate(getInterestedInYouRoute(window.location.pathname))} className="discovery-upgrade-banner discovery-interest-banner btn-hover-mid flex flex-col items-center justify-center text-center text-[8px] font-semibold px-2.5 rounded-lg transition-all leading-snug">
                    <span className="discovery-interest-banner-text">Someone&apos;s</span>
                    <span className="discovery-interest-banner-text">Interested in You</span>
                    <span className="discovery-interest-banner-text mt-0.5 opacity-75">(1 New Interest)</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
        <div />

        <AnimatePresence mode="wait">
          <motion.div key={current.id} initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} transition={{ duration: 0.25 }} style={{ height: "100%" }} className="contents">
            <div className="discover-photo-area">
              <div className="discover-photo-frame shadow-sm border" style={{ background: discoverTheme.sectionSurface, borderColor: discoverTheme.photoBorder }}>
                <div className="h-full overflow-hidden">
                  <img src={current.photoPath} alt={current.displayName} className="w-full h-full object-cover" />
                </div>
              </div>
            </div>
            <div />
            <div
              className="discover-match-card rounded-2xl px-4 py-3 flex items-center justify-between border"
              style={{ background: discoverTheme.summarySurface, borderColor: discoverTheme.summaryBorder }}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <h3 className="font-heading font-bold text-base truncate" style={{ color: discoverTheme.summaryText }}>{current.displayName}, {current.age}</h3>
                  <VerifiedBadge size="sm" />
                </div>
                <div className="flex items-center gap-1" style={{ color: discoverTheme.summaryMuted }}>
                  <MapPin className="w-3 h-3 flex-shrink-0" />
                  <span className="text-xs truncate">{current.distanceLabel || current.location}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0 ml-3">
                <CompatibilityScoreBadge
                  score={current.compatibilityScore}
                  size="sm"
                  tier={tier}
                  scoreColor={discoverTheme.summaryText}
                  trackColor={discoverTheme.summaryBorder}
                />
                <button
                  onClick={() => setSheetOpen(true)}
                  className="btn-hover-light text-xs font-medium px-3 py-1.5 rounded-lg border transition-all"
                  style={{
                    background: discoverTheme.actionOutlineSurface,
                    borderColor: discoverTheme.actionOutlineBorder,
                    color: discoverTheme.summaryText,
                  }}
                >
                  View
                </button>
              </div>
            </div>
            <div />
            <div className="discover-actions" style={{ gap: "clamp(14px, 4vw, 24px)" }}>
              <button
                onClick={onPass}
                className="btn-hover-light flex-1 h-12 rounded-xl border-2 flex items-center justify-center gap-2 transition-all active:scale-95"
                style={{
                  background: discoverTheme.actionOutlineSurface,
                  borderColor: discoverTheme.actionOutlineBorder,
                  color: discoverTheme.actionOutlineText,
                }}
              >
                <X className="w-5 h-5" />
                <span className="text-sm font-medium">Pass</span>
              </button>
              <button onClick={onInterested} className="btn-hover-dark flex-1 h-12 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95 bg-primary text-primary-foreground">
                <Heart className="w-5 h-5" />
                <span className="text-sm font-medium">Interested</span>
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {sheetOpen && current ? (
        <CompatibilityBreakdown
          matchData={current}
          onBack={() => setSheetOpen(false)}
          showCompatibility={false}
          headerTitle="Profile"
          secondaryActionLabel="Pass"
          onSecondaryAction={onPass}
          primaryActionLabel="Interested"
          onPrimaryAction={onInterested}
        />
      ) : null}
    </div>
  );
}
