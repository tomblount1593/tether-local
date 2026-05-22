import { useEffect, useState } from "react";
import { useTier } from "../hooks/useTier";

import { Sparkles, ChevronRight, ChevronUp } from "lucide-react";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import { motion } from "framer-motion";
import { getUserZodiacOverview, getZodiacSign } from "@/utils/zodiac";
import { useCurrentDemoMatches } from "@/hooks/useCurrentDemoMatches";
import { getDemoUserProfile } from "@/data/demo/demoUserProfiles";

// ─── Tier tokens ─────────────────────────────────────────────────────────────
const T = {
  core: {
    page: "bg-background",
    header: "text-foreground",
    headerSub: "text-muted-foreground",
    heroCard: "bg-card border border-border",
    heroTitle: "text-foreground",
    heroText: "text-muted-foreground",
    accent: "text-accent",
    accentHex: "#7A8A7B",
    statCard: "bg-card border border-border",
    statNum: "text-foreground",
    statLabel: "text-muted-foreground",
    sectionTitle: "text-foreground",
    aiCard: "bg-secondary border border-border",
    aiText: "text-muted-foreground",
    profileCard: "bg-card border border-border",
    profileLabel: "text-muted-foreground",
    profileValue: "text-foreground",
    tag: "bg-secondary text-muted-foreground",
    tagSelected: "bg-primary/10 text-primary",
    insightCard: "bg-secondary border border-border",
    insightText: "text-muted-foreground",
    chartStroke: "#7A8A7B",
    chartFill: "#7A8A7B",
    divider: "border-border",
  },
  premium: {
    page: "bg-[#5b655d]",
    header: "text-[#EEE7DA]",
    headerSub: "text-[rgba(248,243,241,0.78)]",
    heroCard: "bg-[#37423a] border border-[rgba(248,243,241,0.18)]",
    heroTitle: "text-[#EEE7DA]",
    heroText: "text-[rgba(248,243,241,0.78)]",
    accent: "text-[#EEE7DA]",
    accentHex: "#EEE7DA",
    statCard: "bg-[#37423a] border border-[rgba(248,243,241,0.18)]",
    statNum: "text-[#EEE7DA]",
    statLabel: "text-[rgba(248,243,241,0.78)]",
    sectionTitle: "text-[#EEE7DA]",
    aiCard: "bg-[rgba(55,66,58,0.46)] border border-[rgba(248,243,241,0.18)]",
    aiText: "text-[rgba(248,243,241,0.78)]",
    profileCard: "bg-[#37423a] border border-[rgba(248,243,241,0.18)]",
    profileLabel: "text-[rgba(248,243,241,0.56)]",
    profileValue: "text-[#EEE7DA]",
    tag: "bg-[rgba(248,243,241,0.08)] text-[rgba(248,243,241,0.78)] border border-[rgba(248,243,241,0.24)]",
    tagSelected: "bg-[#37423a] text-[#EEE7DA] border border-[rgba(248,243,241,0.24)]",
    insightCard: "bg-[rgba(55,66,58,0.46)] border border-[rgba(248,243,241,0.18)]",
    insightText: "text-[rgba(248,243,241,0.78)]",
    chartStroke: "#EEE7DA",
    chartFill: "#EEE7DA",
    divider: "border-[rgba(248,243,241,0.16)]",
  },
  concierge: {
    page: "bg-[#0a0d0a]",
    header: "text-[#d8c6ae]",
    headerSub: "text-[rgba(216,198,174,0.74)]",
    heroCard: "bg-[#232623] border border-[rgba(216,198,174,0.18)]",
    heroTitle: "text-[#d8c6ae]",
    heroText: "text-[rgba(216,198,174,0.74)]",
    accent: "text-[#d8c6ae]",
    accentHex: "#d8c6ae",
    statCard: "bg-[#232623] border border-[rgba(216,198,174,0.18)]",
    statNum: "text-[#d8c6ae]",
    statLabel: "text-[rgba(216,198,174,0.74)]",
    sectionTitle: "text-[#d8c6ae]",
    aiCard: "bg-[#232623] border border-[rgba(216,198,174,0.18)]",
    aiText: "text-[rgba(216,198,174,0.74)]",
    profileCard: "bg-[#232623] border border-[rgba(216,198,174,0.18)]",
    profileLabel: "text-[rgba(216,198,174,0.54)]",
    profileValue: "text-[#d8c6ae]",
    tag: "bg-[#232623] text-[rgba(216,198,174,0.74)] border border-[rgba(216,198,174,0.18)]",
    tagSelected: "bg-[rgba(216,198,174,0.12)] text-[#d8c6ae] border border-[rgba(216,198,174,0.20)]",
    insightCard: "bg-[#232623] border border-[rgba(216,198,174,0.18)]",
    insightText: "text-[rgba(216,198,174,0.74)]",
    chartStroke: "#d8c6ae",
    chartFill: "#d8c6ae",
    divider: "border-[rgba(216,198,174,0.18)]",
  },
};

// ─── Demo data ────────────────────────────────────────────────────────────────
const compatTrend = [
  { label: "Week 1", initial: 88, realWorld: 72 },
  { label: "Week 2", initial: 90, realWorld: 76 },
  { label: "Week 3", initial: 87, realWorld: 80 },
  { label: "Week 4", initial: 91, realWorld: 85 },
  { label: "Week 5", initial: 89, realWorld: 88 },
];

const funnelData = [
  { stage: "Matched", count: 8 },
  { stage: "Booked", count: 6 },
  { stage: "Date 1", count: 5 },
  { stage: "Date 2", count: 2 },
  { stage: "Date 3", count: 1 },
];

const THEMES = [
  { label: "Strong conversation", positive: true, tooltip: "This has been consistent across your best dates" },
  { label: "Good lifestyle fit", positive: true, tooltip: "This has been consistent across your best dates" },
  { label: "Chemistry stronger than expected", positive: true, tooltip: "This has been consistent across your best dates" },
  { label: "Warmth & ease", positive: true, tooltip: "This has been consistent across your best dates" },
  { label: "Energy mismatch", positive: false, tooltip: "This has appeared in lower-rated dates" },
  { label: "Timing off", positive: false, tooltip: "This has appeared in lower-rated dates" },
];

const PROFILE_SECTIONS = [
  {
    section: "Your Type",
    said: "Strong physical attraction matters early",
    observed: "Attraction grows more when conversation and ease are strong",
  },
  {
    section: "Romantic Pattern",
    said: "You want calm and consistency",
    observed: "Your best outcomes come from emotionally available, grounded matches",
  },
  {
    section: "Intent & Values",
    said: "You want something serious",
    observed: "Best chemistry also comes with people who are relationship-ready now",
  },
  {
    section: "Lifestyle & Social Fit",
    said: "Social but balanced",
    observed: "Your strongest dates come from lower-friction lifestyle overlap",
  },
  {
    section: "First Impression & Vibe",
    said: "Polished and confident",
    observed: "Warmer, more relaxed presentation performs better in practice",
  },
];

const INSIGHT_BANNER_PRIMARY_TITLE_CLASS = "font-heading font-bold text-[clamp(17px,4.2vw,21px)] leading-[1.1]";

const PREMIUM_INSIGHTS = [
  "Lifestyle fit is your strongest predictor of a second date",
  "Dates with prior video calls convert 2× better",
  "Conversation ease outperforms pure physical attraction",
  "Your best second-date potential comes from people slightly outside your stated type",
];

const CONCIERGE_INSIGHTS = [
  "We're tightening around grounded, high-readiness profiles",
  "Warmer, lower-pressure matches convert best for you",
  "Shortlist is being refined based on your 5-date outcome data",
  "Recommended next focus: emotional availability + lifestyle overlap",
];

// ─── Sub-components ──────────────────────────────────────────────────────────
function SectionTitle({ t, children }) {
  return (
    <div className="mb-3">
      <div className="grid grid-cols-[1fr_auto_1fr] items-center min-h-[28px]">
        <div className="flex justify-end pr-2">
          <Sparkles className={`w-3.5 h-3.5 flex-shrink-0 ${t.accent}`} />
        </div>
        <h2 className={`text-[clamp(18px,4.8vw,22px)] leading-[1.15] font-heading font-bold text-center whitespace-nowrap ${t.sectionTitle}`}>
          {children}
        </h2>
        <div />
      </div>
    </div>
  );
}

function StatCard({ t, number, label, sub }) {
  const topBg = t === T.concierge ? "#d2c6b2" : "#37423a";
  const topText = t === T.concierge ? "#141916" : "#f8f3f1";
  const borderColor = t === T.premium
    ? "rgba(248,243,241,0.18)"
    : t === T.concierge
      ? "rgba(210,198,178,0.30)"
      : "rgba(55,66,58,0.18)";

  const bodyBg = t === T.premium
    ? "rgba(55,66,58,0.46)"
    : t === T.concierge
      ? "#d2c6b2"
      : "#f8f3f1";

  const labelColor = t === T.concierge ? "#141916" : t === T.premium ? "#f8f3f1" : "#37423a";
  const subColor = t === T.concierge ? "rgba(20,25,22,0.78)" : t === T.premium ? "rgba(248,243,241,0.78)" : "rgba(55,66,58,0.72)";

  return (
    <div
      className="rounded-[24px] overflow-hidden border"
      style={{ borderColor, background: bodyBg }}
    >
      <div className="px-3 py-2" style={{ background: topBg }}>
        <p className="font-heading font-bold text-center leading-none" style={{ color: topText, fontSize: "clamp(17px,4.2vw,20px)" }}>
          {number}
        </p>
        <p className="font-heading font-bold text-center leading-none mt-1 whitespace-nowrap" style={{ color: topText, fontSize: "clamp(14px,3.2vw,16px)" }}>
          {label}
        </p>
      </div>
      <div className="px-3 py-2.5 text-center">
        {sub && (
          <p
            className="font-body leading-none"
            style={{ color: subColor, fontSize: "clamp(11px,2.9vw,13px)" }}
          >
            {sub}
          </p>
        )}
      </div>
    </div>
  );
}

function getUnifiedSecondaryTextColor(tier) {
  if (tier === "premium") return "rgba(248,243,241,0.78)";
  if (tier === "concierge") return "rgba(210,198,178,0.78)";
  return "hsl(var(--muted-foreground))";
}

function getInsightBreakdownCardTheme(tier) {
  if (tier === "premium") {
    return {
      surface: "rgba(55,66,58,0.46)",
      border: "rgba(248,243,241,0.18)",
      headerBg: "#37423a",
      headerText: "#f8f3f1",
      labelText: "rgba(248,243,241,0.78)",
      valueText: "#f8f3f1",
    };
  }
  if (tier === "concierge") {
    return {
      surface: "#242623",
      border: "rgba(210,198,178,0.30)",
      headerBg: "#d2c6b2",
      headerText: "#141916",
      labelText: "rgba(210,198,178,0.78)",
      valueText: "#d2c6b2",
    };
  }
  return {
    surface: "#f8f3f1",
    border: "rgba(55,66,58,0.18)",
    headerBg: "#37423a",
    headerText: "#f8f3f1",
    labelText: "rgba(55,66,58,0.72)",
    valueText: "#37423a",
  };
}

function getInsightPanelSurface(tier) {
  if (tier === "premium") return "#737973";
  if (tier === "concierge") return "#0a0d0a";
  return "#d4d2cd";
}

// ─── Theme tag colour system ─────────────────────────────────────────────────
// Tether brand palette: Moss Black #141916 · Muted Pine #2F3B35 · Oat Cream #EEE7DA · Clay Beige #CBB9A3 · Dusty Sage #7A8A7B
const THEME_COLORS = {
  core: {
    positive: { bg: "rgba(122,138,123,0.12)", color: "#2F3B35", border: "#4a6b55" },
    friction: { bg: "rgba(203,185,163,0.15)", color: "#8B5A2B", border: "#a06a3a" },
  },
  premium: {
    positive: { bg: "rgba(47,59,53,0.65)", color: "#9ec4a0", border: "#6a8a70" },
    friction: { bg: "rgba(180,140,80,0.1)", color: "#c9a66a", border: "#8a6a3a" },
  },
  concierge: {
    positive: { bg: "rgba(216,198,174,0.12)", color: "#d8c6ae", border: "rgba(216,198,174,0.20)" },
    friction: { bg: "rgba(35,38,35,0.88)", color: "rgba(216,198,174,0.74)", border: "rgba(216,198,174,0.20)" },
  },
};

function ThemeTags({ tier }) {
  const [tooltip, setTooltip] = useState(null);
  const colors = THEME_COLORS[tier] || THEME_COLORS.core;
  return (
    <div className="relative">
      <div className="flex flex-wrap justify-center gap-2">
        {THEMES.map((theme, i) => {
          const style = theme.positive ? colors.positive : colors.friction;
          return (
            <button
              key={theme.label}
              onClick={() => setTooltip(tooltip === i ? null : i)}
              className="text-[10px] font-body font-semibold px-3 py-1.5 rounded-full border transition-all"
              style={{ background: style.bg, color: style.color, borderColor: style.border }}
            >
              {theme.label}
            </button>
          );
        })}
      </div>
      {tooltip !== null && (
        <p className="mt-3 text-center text-[10px] font-body italic opacity-70" style={{ color: THEMES[tooltip].positive ? (THEME_COLORS[tier] || THEME_COLORS.core).positive.color : (THEME_COLORS[tier] || THEME_COLORS.core).friction.color }}>
          {THEMES[tooltip].tooltip}
        </p>
      )}
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function Insights() {
  const { tier } = useTier();
  const { context, matches } = useCurrentDemoMatches("insights");
  const userProfile = getDemoUserProfile(context);
  const [showScrollTopBanner, setShowScrollTopBanner] = useState(false);
  const t = T[tier] || T.core;
  const userSign = getZodiacSign(userProfile?.birthDate || context?.birthDate || "1993-05-01") || "Taurus";
  const zodiac = getUserZodiacOverview(userSign);
  const totalDates = Math.min((matches || []).length, 5);
  const avgScore = matches?.length ? Math.round(matches.reduce((a, m) => a + m.compatibilityScore, 0) / matches.length) : 0;
  const insightBreakdownTheme = getInsightBreakdownCardTheme(tier);
  const unifiedSecondaryColor = getUnifiedSecondaryTextColor(tier);
  const insightPanelSurface = getInsightPanelSurface(tier);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY || window.pageYOffset || 0;
      const shouldShow = scrollTop > 420;
      setShowScrollTopBanner((current) => (current === shouldShow ? current : shouldShow));
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className={`min-h-screen pb-6 ${t.page}`}>
      {showScrollTopBanner ? (
        <div className="fixed left-1/2 top-[72px] z-[40] flex -translate-x-1/2 justify-center px-4">
          <button
            type="button"
            onClick={() => {
              window.scrollTo({ top: 0, behavior: "smooth" });
              setShowScrollTopBanner(false);
            }}
            className="inline-flex min-w-[240px] items-center justify-center gap-2 rounded-full border border-border bg-card px-5 py-2 text-xs font-body text-foreground shadow-sm btn-hover-light whitespace-nowrap"
          >
            <ChevronUp className="w-3.5 h-3.5" />
            <span>View your Insights above</span>
          </button>
        </div>
      ) : null}
      <div className="max-w-lg mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
          <div>
            <h1 className={`text-xl font-heading font-bold ${t.header}`}>Insights</h1>
            <p className={`text-xs mt-0.5 font-body ${t.headerSub}`}>How your dating journey is evolving</p>
          </div>
        </motion.div>

        {/* Hero summary card */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <div
            className="rounded-[26px] overflow-hidden border"
            style={{ borderColor: insightBreakdownTheme.border, background: insightBreakdownTheme.surface }}
          >
            <div className="px-4 py-2" style={{ background: insightBreakdownTheme.headerBg }}>
              <p
                className="font-heading font-bold text-[clamp(17px,4.2vw,21px)] leading-[1.1] text-center"
                style={{ color: insightBreakdownTheme.headerText }}
              >
                Your Journey So Far
              </p>
            </div>
            <div className="border-b px-4 py-1 flex items-center justify-center min-h-[32px]" style={{ background: insightPanelSurface, borderColor: insightBreakdownTheme.border }}>
              <div className="grid grid-cols-[1fr_auto_1fr] items-center w-full">
                <div className="flex justify-end pr-2">
                  <Sparkles
                    className="w-3 h-3 flex-shrink-0"
                    style={{ color: tier === "concierge" ? "#d2c6b2" : "#37423a" }}
                  />
                </div>
                <h2
                  className="font-body text-[10px] leading-none font-semibold uppercase tracking-[0.16em] text-center whitespace-nowrap"
                  style={{ color: tier === "concierge" ? "#d2c6b2" : tier === "standard" ? "#37423a" : undefined }}
                >
                  You&apos;ve had {totalDates} dates so far
                </h2>
                <div />
              </div>
            </div>
            <div className="px-4 py-3">
              <ul className={`mx-auto max-w-[31rem] space-y-2 text-[12px] font-body ${t.heroText}`}>
              <li className="flex items-start gap-2 text-left"><span className={`mt-1 w-1.5 h-1.5 rounded-full flex-shrink-0`} style={{ background: t.accentHex }} />3 felt genuinely aligned in person</li>
              <li className="flex items-start gap-2 text-left"><span className="mt-1 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: t.accentHex }} />2 progressed beyond the first date</li>
              <li className="flex items-start gap-2 text-left"><span className="mt-1 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: t.accentHex }} />Your strongest dates come from better lifestyle and emotional fit</li>
              {(tier === "premium" || tier === "concierge") && (
                <li className="flex items-start gap-2 text-left"><span className="mt-1 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: t.accentHex }} />Compatibility accuracy has improved by 18% since your first date</li>
              )}
              </ul>
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18 }}>
          <SectionTitle t={t}>Compatibility Lens</SectionTitle>
          <div
            className={`rounded-[26px] overflow-hidden ${t.insightCard}`}
            style={
              tier === "concierge"
                ? { background: "#242623", borderColor: "rgba(210,198,178,0.30)" }
                : tier === "standard"
                  ? { background: "#d4d2ce", borderColor: "rgba(55,66,58,0.18)" }
                  : undefined
            }
          >
            <div
              className="px-4 py-2 flex items-center justify-center"
              style={{
                background: tier === "concierge" ? "#d2c6b2" : "#37423a",
              }}
            >
              <h3
                className={`${INSIGHT_BANNER_PRIMARY_TITLE_CLASS} text-center`}
                style={{ color: tier === "concierge" ? "#141916" : "#f8f3f1" }}
              >
                Star Sign Compatibility Insights
              </h3>
            </div>
            <div className="p-4">
              <p className="text-[12px] leading-relaxed font-body text-center" style={{ color: tier === "standard" ? "#37423a" : unifiedSecondaryColor }}>
                Your birthday places you under {userSign} — {zodiac.traits.join(", ")}.
              </p>
              <p className="text-[12px] mt-2 leading-relaxed font-body text-center" style={{ color: tier === "standard" ? "#37423a" : unifiedSecondaryColor }}>
                Traditionally, {userSign} tends to flow well with {zodiac.strongestSigns.join(", ")}.
                We&apos;re also seeing strong potential beyond the obvious when humour, lifestyle fit, and communication are aligned.
              </p>
              <div className="mt-4 space-y-4">
                <div className="text-center">
                  <h4 className={`${INSIGHT_BANNER_PRIMARY_TITLE_CLASS} ${t.heroTitle}`} style={tier === "concierge" ? { color: "#d2c6b2" } : tier === "standard" ? { color: "#37423a" } : undefined}>Strong traditional fit</h4>
                  <p className="text-[12px] font-body mt-1 text-center" style={{ color: tier === "standard" ? "#37423a" : unifiedSecondaryColor }}>{zodiac.strongestSigns.join(", ")}</p>
                </div>
                <div className="text-center">
                  <h4 className={`${INSIGHT_BANNER_PRIMARY_TITLE_CLASS} ${t.heroTitle}`} style={tier === "concierge" ? { color: "#d2c6b2" } : tier === "standard" ? { color: "#37423a" } : undefined}>Worth exploring</h4>
                  <p className="text-[12px] font-body mt-1 text-center" style={{ color: tier === "standard" ? "#37423a" : unifiedSecondaryColor }}>{zodiac.worthExploring.join(", ")}</p>
                </div>
                <div className="text-center">
                  <h4 className={`${INSIGHT_BANNER_PRIMARY_TITLE_CLASS} ${t.heroTitle}`} style={tier === "concierge" ? { color: "#d2c6b2" } : tier === "standard" ? { color: "#37423a" } : undefined}>Needs conscious rhythm</h4>
                  <p className="text-[12px] font-body mt-1 text-center" style={{ color: tier === "standard" ? "#37423a" : unifiedSecondaryColor }}>{zodiac.consciousRhythm.join(", ")}</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stat grid */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <SectionTitle t={t}>Key Metrics</SectionTitle>
          <div className="grid grid-cols-2 gap-3">
            <StatCard t={t} number={String(totalDates)} label="Total dates" sub="Since joining" />
            <StatCard t={t} number="40%" label="2nd date rate" sub="Industry avg: 22%" />
            <StatCard t={t} number="3×" label="Chemistry stronger" sub="than expected" />
            <StatCard t={t} number={`${avgScore}%`} label="Average compatibility" sub="Current pool" />
          </div>
          {(tier === "premium" || tier === "concierge") && (
            <div className="grid grid-cols-2 gap-3 mt-3">
              <StatCard t={t} number="Lifestyle" label="Strongest fit driver" sub="Outperforming attraction" />
              <StatCard t={t} number="Energy" label="Most common drop-off" sub="Across 2 dates" />
            </div>
          )}
        </motion.div>

        {/* What we're learning — AI summary */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <SectionTitle t={t}>What We're Learning</SectionTitle>
          <div className={`rounded-2xl p-4 ${t.aiCard}`}>
            <p className="text-[12px] leading-relaxed font-body text-center" style={{ color: unifiedSecondaryColor }}>
              From your compatibility assessment, you said you were most drawn to polished, confident profiles with strong initial attraction.
            </p>
            <p className="text-[12px] leading-relaxed mt-3 font-body text-center" style={{ color: unifiedSecondaryColor }}>
              Based on your dates and feedback, we've observed that your strongest outcomes come from men with warmer energy, better lifestyle fit, and a more grounded presence.
            </p>
            <p className="text-[12px] leading-relaxed mt-3 font-body text-center" style={{ color: unifiedSecondaryColor }}>
              We're now gradually adjusting your recommendations to reflect this — prioritising real-world chemistry over initial type preference.
            </p>
            {tier === "concierge" && (
              <p className="text-[12px] leading-relaxed mt-3 font-body text-center" style={{ color: unifiedSecondaryColor }}>
                Your Concierge profile is being refined. Future introductions will tighten around emotional availability, relationship readiness, and lifestyle overlap.
              </p>
            )}
          </div>
        </motion.div>

        {/* Date funnel chart */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <SectionTitle t={t}>Date Progression</SectionTitle>
          <div className={`rounded-2xl p-4 ${t.statCard}`}>
            <ResponsiveContainer width="100%" height={140}>
              <BarChart data={funnelData} barSize={28}>
                <XAxis dataKey="stage" tick={{ fontSize: 9, fill: t.accentHex }} axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip
                  contentStyle={{ background: "transparent", border: "none", fontSize: 10 }}
                  labelStyle={{ color: t.accentHex }}
                  itemStyle={{ color: t.accentHex }}
                />
                <Bar dataKey="count" fill={t.accentHex} radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Compatibility trend chart */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
          <SectionTitle t={t}>Compatibility Accuracy Trend</SectionTitle>
          <div className={`rounded-2xl p-4 ${t.statCard}`}>
            <p className="text-[10px] mb-3 font-body" style={{ color: unifiedSecondaryColor }}>Initial score vs real-world fit learning over time</p>
            <ResponsiveContainer width="100%" height={130}>
              <AreaChart data={compatTrend}>
                <XAxis dataKey="label" tick={{ fontSize: 9, fill: t.accentHex }} axisLine={false} tickLine={false} />
                <YAxis hide domain={[60, 100]} />
                <Tooltip
                  contentStyle={{ background: "transparent", border: "none", fontSize: 10 }}
                  labelStyle={{ color: t.accentHex }}
                  itemStyle={{ color: t.accentHex }}
                />
                <Area type="monotone" dataKey="initial" stroke={t.accentHex} strokeOpacity={0.3} strokeWidth={1.5} fill={t.accentHex} fillOpacity={0.05} name="Initial score" />
                <Area type="monotone" dataKey="realWorld" stroke={t.accentHex} strokeWidth={2} fill={t.accentHex} fillOpacity={0.15} name="Real-world fit" />
              </AreaChart>
            </ResponsiveContainer>
            <div className="flex gap-3 mt-2">
              <div className="flex items-center gap-1.5"><span className="w-3 h-0.5 rounded" style={{ background: t.accentHex, opacity: 0.35 }} /><span className="text-[9px] font-body" style={{ color: unifiedSecondaryColor }}>Initial score</span></div>
              <div className="flex items-center gap-1.5"><span className="w-3 h-0.5 rounded" style={{ background: t.accentHex }} /><span className="text-[9px] font-body" style={{ color: unifiedSecondaryColor }}>Real-world fit</span></div>
            </div>
          </div>
        </motion.div>

        {/* Compatibility profile vs real life */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <SectionTitle t={t}>Your Profile vs Real-Life Outcomes</SectionTitle>
          <div className="space-y-2">
            {PROFILE_SECTIONS.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.05 }}
                className="rounded-[26px] overflow-hidden border"
                style={{ borderColor: insightBreakdownTheme.border, background: insightBreakdownTheme.surface }}
              >
                <div
                  className="px-5 py-2.5"
                  style={{ background: tier === "concierge" ? "#0a0d0a" : insightBreakdownTheme.headerBg }}
                >
                  <p
                    className="font-heading font-bold text-[clamp(17px,4.2vw,21px)] leading-[1.1] text-center"
                    style={{ color: insightBreakdownTheme.headerText }}
                  >
                    {s.section}
                  </p>
                </div>
                <div className="px-4 py-3">
                  <div className="grid gap-y-2" style={{ gridTemplateColumns: "7.8rem 1fr" }}>
                    <span className="font-heading text-[clamp(14px,3.6vw,16px)] leading-none whitespace-nowrap pt-px" style={{ color: tier === "standard" ? "#37423a" : insightBreakdownTheme.labelText }}>You said</span>
                    <span className="text-[clamp(12px,3vw,14px)] leading-snug font-body" style={{ color: unifiedSecondaryColor }}>{s.said}</span>
                    <span className="font-heading text-[clamp(14px,3.6vw,16px)] leading-none whitespace-nowrap pt-px" style={{ color: tier === "standard" ? "#37423a" : insightBreakdownTheme.labelText }}>We've observed</span>
                    <span className="text-[clamp(12px,3vw,14px)] leading-snug font-body" style={{ color: unifiedSecondaryColor }}>{s.observed}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Common themes */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
          <SectionTitle t={t}>Common Themes From Your Dates</SectionTitle>
          <div className={`rounded-2xl p-5 ${t.statCard}`}>
            <ThemeTags tier={tier} />
          </div>
        </motion.div>

        {/* Premium insights */}
        {(tier === "premium" || tier === "concierge") && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <SectionTitle t={t}>{tier === "concierge" ? "Concierge Strategy" : "Premium Insights"}</SectionTitle>
            <div className="space-y-2">
              {(tier === "concierge" ? CONCIERGE_INSIGHTS : PREMIUM_INSIGHTS).map((ins, i) => (
                <div key={i} className={`rounded-2xl px-4 py-3 flex items-center gap-3 ${t.insightCard}`}>
                  <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: t.accentHex }} />
                  <p className="text-[11px] font-body flex-1" style={{ color: unifiedSecondaryColor }}>{ins}</p>
                  <ChevronRight className={`w-3.5 h-3.5 flex-shrink-0 ${t.accent}`} />
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Concierge strategy footer */}
        {tier === "concierge" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}>
            <div className={`rounded-2xl p-5 ${t.heroCard}`}>
              <p className={`text-[10px] font-body font-semibold uppercase tracking-widest mb-2 ${t.accent}`}>Concierge Matching Strategy</p>
              <p className={`font-heading text-base font-bold mb-2 ${t.heroTitle}`}>Your shortlist is being refined.</p>
              <p className="text-[11px] leading-relaxed font-body" style={{ color: unifiedSecondaryColor }}>
                Based on your real-world dating outcomes, we're adjusting future introductions to prioritise emotional availability, grounded presence, and lifestyle alignment over initial type preferences. Your next curated matches will reflect this.
              </p>
            </div>
          </motion.div>
        )}

      </div>
    </div>
  );
}
