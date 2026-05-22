import { useEffect, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTier, TIERS } from "../hooks/useTier";
import { Check, Sparkles, Crown, Star, ArrowLeft, ChevronRight } from "lucide-react";
import MembershipBanner from "../components/MembershipBanner";
import { motion } from "framer-motion";
import { getMembershipTheme } from "@/brand/membershipTheme";
import { getDiscoverRoute, getInterestedInYouRoute } from "@/lib/matchFlowRoutes";
import { getStoredDemoContext, saveDemoContext } from "@/data/demo/demoMatchPoolSelector";

const TIER_FEATURES = {
  standard: [
    "Specialist compatibility assessment — built on proven psychological frameworks",
    "20–30 compatibility-led matches per day",
    "Only profiles from 60% compatibility and above",
    "Compatibility clarity: potential, strong fit, exceptional fit",
    "Guided dating journey — 1st, 2nd, and 3rd date structure",
    "Pre-date chat + optional video call",
    "Post-date feedback and learning loop",
    "Free to use — £9 per date, pay when you meet",
  ],
  premium: [
    "Everything in Standard",
    "Only profiles from 75% compatibility and above",
    "Adjustable compatibility threshold for more control",
    "10–20 highly curated daily matches — quality over quantity",
    "Advanced compatibility filters and full match control",
    "Expanded radius: +10, +25, +50 miles",
    "Because the right person is often worth the distance.",
    "4 standard date bookings included per month",
    "Access to elevated venue options and discounted Premium dates",
    "Deeper compatibility insights and stronger matching transparency",
    "Smarter 2nd and 3rd date progression",
  ],
  concierge: [
    "Everything in Premium",
    "Only profiles from 85% compatibility and above",
    "Adjustable threshold for precision matching",
    "Unlimited curated daily matches",
    "Nationwide + global reach based on compatibility",
    "Advanced AI compatibility shortlist, personally reviewed by your expert",
    "Curated introductions — hand-selected, not endless browsing",
    "Dedicated dating expert via chat and video calls",
    "Discover + Map collaboration with your expert",
    "Premium date planning across all three dates",
    "All date bookings included — no per-date cost",
  ],
};

const TIER_ICONS = {
  standard: Star,
  premium: Sparkles,
  concierge: Crown,
};

export default function Membership() {
  const navigate = useNavigate();
  const location = useLocation();
  const { tier, setTier } = useTier();
  const searchParams = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const isPostOnboardingEntry = useMemo(() => {
    const fromState = location.state?.entryPoint === "post_onboarding";
    const fromQuery = searchParams.get("entryPoint") === "post_onboarding";
    return fromState || fromQuery;
  }, [location.state, searchParams]);
  const displayTier = isPostOnboardingEntry ? "standard" : tier;
  const activeTheme = getMembershipTheme(displayTier);
  const fromInterested = useMemo(() => {
    const fromState = location.state?.from === "interested-in-you";
    const fromQuery = searchParams.get("from") === "interested-in-you";
    return fromState || fromQuery;
  }, [location.state, searchParams]);

  useEffect(() => {
    if (location.state?.from === "profile-membership") {
      window.scrollTo({ top: 0, behavior: "auto" });
    }
  }, [location.state]);

  const pageTheme = useMemo(() => {
    if (displayTier === "concierge") {
      return {
        bg: "#0a0d0a",
        surface: "#232623",
        primary: "#d8c6ae",
        secondary: "rgba(216,198,174,0.74)",
        border: "rgba(216,198,174,0.22)",
      };
    }
    if (displayTier === "premium") {
      return {
        bg: "#5b655d",
        surface: "#37423a",
        primary: "#f8f3f1",
        secondary: "rgba(248,243,241,0.72)",
        border: "rgba(248,243,241,0.22)",
      };
    }
    return {
      bg: "#f8f3f1",
      surface: "#37423a",
      primary: "#f8f3f1",
      secondary: "rgba(248,243,241,0.78)",
      border: "rgba(55,66,58,0.22)",
    };
  }, [displayTier]);

  const handleSelect = (tierId) => {
    setTier(tierId);
    const nextContext = {
      ...getStoredDemoContext(location.pathname),
      membershipTier: tierId,
    };
    saveDemoContext(nextContext);
    // Keep small delay for tier state propagation before routing.
    setTimeout(() => navigate(getDiscoverRoute(location.pathname, localStorage.getItem("tether_orientation") || "gay")), 100);
  };

  return (
    <div className="min-h-screen pb-10" style={{ background: pageTheme.bg, color: pageTheme.primary }}>
      {/* Banner */}
      <div style={{ position: 'sticky', top: 0, zIndex: 200 }}>
        <MembershipBanner forcedTier={displayTier} />
      </div>
      {/* Header */}
      <div className="px-4 py-3 flex items-center gap-3" style={{ background: pageTheme.surface, borderBottom: `1px solid ${pageTheme.border}` }}>
        <button
          onClick={() => (fromInterested ? navigate(getInterestedInYouRoute(location.pathname)) : navigate(-1))}
          className="text-muted-foreground"
          style={{ color: pageTheme.secondary }}
          data-testid={fromInterested ? "membership-back-to-interested" : undefined}
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="font-heading font-bold text-xl page-title" style={{ color: pageTheme.primary }}>Membership</h1>
          <p className="text-xs font-body" style={{ color: pageTheme.secondary }}>{fromInterested ? "Back to Interested In You" : "Choose your tier"}</p>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 pt-4 space-y-4">
        <div className="text-center mb-4">
          <img src={activeTheme.wordmark} alt={`${displayTier} Tether`} className="mx-auto mb-3 h-10 w-auto" />
          <p className="text-xs font-body font-semibold uppercase tracking-widest mb-2" style={{ color: displayTier === "standard" ? "#37423a" : pageTheme.secondary }}>Tether Membership</p>
          <h2 className="text-2xl font-heading font-bold" style={{ color: displayTier === "standard" ? "#37423a" : pageTheme.primary }}>Find the right fit.</h2>
          <p className="text-sm font-body mt-1 max-w-xs mx-auto" style={{ color: displayTier === "standard" ? "rgba(55,66,58,0.72)" : pageTheme.secondary }}>Three tiers. One goal — helping you meet the right person faster.</p>
        </div>

        {Object.values(TIERS).map((t, i) => {
          const Icon = TIER_ICONS[t.id];
          const isActive = displayTier === t.id;
          const isConcierge = t.id === "concierge";
          const isPremium = t.id === "premium";

          let cardStyle = {};
          let headerStyle = {};

          if (t.id === "standard") {
            cardStyle = { background: "#f8f3f1", borderColor: isActive ? "#37423a" : "rgba(55,66,58,0.28)" };
            headerStyle = { background: "#37423a", color: "#f8f3f1" };
          } else if (t.id === "premium") {
            cardStyle = { background: "#5b655d", borderColor: isActive ? "rgba(248,243,241,0.58)" : "rgba(248,243,241,0.24)" };
            headerStyle = { background: "#37423a", color: "#f8f3f1" };
          } else {
            cardStyle = { background: "#0a0d0a", borderColor: isActive ? "rgba(216,198,174,0.64)" : "rgba(216,198,174,0.24)" };
            headerStyle = { background: "#232623", color: "#d8c6ae" };
          }

          const textColor = t.id === "standard" ? "#37423a" : t.id === "premium" ? "#f8f3f1" : "#d8c6ae";

          return (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="rounded-3xl border-2 overflow-hidden"
              style={{ ...cardStyle, borderWidth: isActive ? 2 : 1.5 }}
            >
              {/* Card header */}
              <div
                className="pl-5 pr-3 py-4 grid items-start gap-x-2"
                style={{ ...headerStyle, gridTemplateColumns: "36px minmax(0,1fr) 76px" }}
              >
                <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "rgba(255,255,255,0.12)" }}>
                  <Icon className="w-4.5 h-4.5" style={{ color: "#CBB9A3" }} />
                </div>
                <div className="min-w-0">
                  <p className="h-[24px] flex items-end font-heading font-bold text-sm leading-tight">{t.name}</p>
                  <p className="h-[16px] flex items-start text-xs font-body opacity-70 leading-tight mt-1 whitespace-nowrap">{t.description}</p>
                </div>
                <div className="w-[76px] justify-self-end text-center">
                  <p className="h-[24px] flex items-end justify-center font-heading font-bold text-xl leading-tight">{t.price}</p>
                  <p className="h-[16px] flex items-start justify-center text-[11px] font-body opacity-60 leading-tight mt-1 whitespace-nowrap">{t.priceDetail}</p>
                </div>
              </div>

              {/* Features */}
              <div className="px-5 py-4 space-y-2">
                {TIER_FEATURES[t.id].map((feature) => (
                  <div key={feature} className="flex items-start gap-2.5">
                    <div className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: t.id === "standard" ? "#2F3B35" : "#CBB9A3" }}>
                      <Check className="w-2.5 h-2.5" style={{ color: t.id === "standard" ? "#EEE7DA" : "#141916" }} />
                    </div>
                    <span className="text-xs font-body leading-relaxed" style={{ color: textColor }}>{feature}</span>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <div className="px-5 pb-5">
                <button
                  onClick={() => handleSelect(t.id)}
                  className="w-full py-3 rounded-2xl text-sm font-semibold flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                  style={{
                    background: isActive ? (t.id === "standard" ? "#37423a" : "#d8c6ae") : "transparent",
                    color: isActive ? (t.id === "standard" ? "#f8f3f1" : "#0a0d0a") : textColor,
                    border: isActive ? "none" : `1px solid ${t.id === "standard" ? "rgba(55,66,58,0.24)" : t.id === "premium" ? "rgba(248,243,241,0.24)" : "rgba(216,198,174,0.24)"}`,
                  }}
                >
                  {isActive ? "Current tier" : `Switch to ${t.name}`}
                  {!isActive && <ChevronRight className="w-4 h-4" />}
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
