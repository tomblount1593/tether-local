import { useEffect, useMemo } from "react";
import { TrendingDown, TrendingUp } from "lucide-react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import BackButton from "@/components/BackButton";
import CompatibilityScoreBadge from "@/components/CompatibilityScoreBadge";
import { MATCHES_REFERENCE } from "@/constants/matchesReference";
import { useCurrentMatch } from "@/hooks/useCurrentMatch";
import { getCompatibilityTone } from "@/lib/compatibilityTone";
import { getMatchesRouteWithTab } from "@/lib/matchFlowRoutes";
import {
  getFallbackReflection,
  getNextStepSummary,
  getReflectionGrowthAreas,
  getReflectionHighlights,
  getStoredReflection,
  getTetherLearnings,
} from "@/data/demo/demoDateExperience";

function getFeedbackTheme(tier) {
  if (tier === "premium") {
    return {
      isStandard: false,
      sectionSurface: "#5b655d",
      sectionBorder: "rgba(248, 243, 241, 0.28)",
      sectionText: "#f8f3f1",
      mutedText: "rgba(248, 243, 241, 0.84)",
      innerSurface: "#f8f3f1",
      innerHeader: "rgba(55, 66, 58, 0.10)",
      sectionHeaderBg: "#5b655d",
      sectionHeaderText: "#f8f3f1",
      topBannerBg: "#5b655d",
      topBannerHeaderBg: "#5b655d",
      topBannerTitleText: "#f8f3f1",
      topBannerBodyText: "rgba(248, 243, 241, 0.84)",
      innerBorder: "rgba(55, 66, 58, 0.22)",
      innerTitle: "#37423a",
      innerText: "rgba(55, 66, 58, 0.86)",
      summaryStripBg: "#f8f3f1",
      summaryStripText: "rgba(55, 66, 58, 0.84)",
      iconColor: "#37423a",
    };
  }
  if (tier === "concierge") {
    return {
      isStandard: false,
      sectionSurface: "#242623",
      sectionBorder: "rgba(210, 198, 178, 0.30)",
      sectionText: "#d2c6b2",
      mutedText: "rgba(210, 198, 178, 0.84)",
      innerSurface: "#d2c6b2",
      innerHeader: "rgba(36, 38, 35, 0.08)",
      sectionHeaderBg: "#242623",
      sectionHeaderText: "#d2c6b2",
      topBannerBg: "#242623",
      topBannerHeaderBg: "#242623",
      topBannerTitleText: "#d2c6b2",
      topBannerBodyText: "rgba(210, 198, 178, 0.84)",
      innerBorder: "rgba(36, 38, 35, 0.20)",
      innerTitle: "#141916",
      innerText: "rgba(20, 25, 22, 0.86)",
      summaryStripBg: "#d2c6b2",
      summaryStripText: "rgba(20, 25, 22, 0.84)",
      iconColor: "#141916",
    };
  }
  return {
    isStandard: true,
    sectionSurface: "#37423a",
    sectionBorder: MATCHES_REFERENCE.darkGreenBorder,
    sectionText: "#f8f3f1",
    mutedText: "rgba(248, 243, 241, 0.85)",
    innerSurface: "#f8f3f1",
    innerHeader: "#e7e5e1",
    sectionHeaderBg: "#DAD7D3",
    sectionHeaderText: "#37423a",
    topBannerBg: "#f8f3f1",
    topBannerHeaderBg: "#DAD7D3",
    topBannerTitleText: "#37423a",
    topBannerBodyText: "#37423a",
    innerBorder: "hsl(var(--border))",
    innerTitle: "#37423a",
    innerText: "hsl(var(--muted-foreground))",
    summaryStripBg: "#f8f3f1",
    summaryStripText: "hsl(var(--muted-foreground))",
    iconColor: "hsl(var(--muted-foreground))",
  };
}

function TopBanner({ theme }) {
  return (
    <div
      className="overflow-hidden rounded-[26px] border text-center"
      style={{ borderColor: theme.sectionBorder, background: theme.topBannerBg }}
    >
      <div className="px-4 py-2.5 text-center" style={{ background: theme.topBannerHeaderBg }}>
        <p
          className="font-heading font-bold text-center"
          style={{ ...MATCHES_REFERENCE.insightTitleStyle, color: theme.topBannerTitleText }}
        >
          Your Date Reflection
        </p>
      </div>
      <div className="px-4 py-3 text-center">
        <p
          className="font-body text-center"
          style={{ ...MATCHES_REFERENCE.insightSecondaryStyle, color: theme.topBannerBodyText }}
        >
          How this date shaped your compatibility insights.
        </p>
      </div>
    </div>
  );
}

function InfoCard({ title, body, theme }) {
  return (
    <div className="rounded-xl border overflow-hidden" style={{ borderColor: theme.innerBorder, background: theme.innerSurface }}>
      <div className="px-3 py-1.5 min-h-[34px] flex items-center justify-center" style={{ background: theme.innerHeader }}>
        <p className="font-heading font-bold text-[15px] leading-tight text-center" style={{ color: theme.innerTitle }}>{title}</p>
      </div>
      <div className="px-3 py-2 min-h-[38px] flex items-center justify-center">
        <p className="text-[11px] font-body leading-relaxed text-center" style={{ color: theme.innerText }}>{body}</p>
      </div>
    </div>
  );
}

function Section({ title, children, theme }) {
  return (
    <section
      className="rounded-[26px] overflow-hidden border"
      style={{ borderColor: theme.sectionBorder, background: theme.sectionSurface }}
    >
      <div className="px-4 py-2.5 text-center" style={{ background: theme.sectionHeaderBg }}>
        <h2 className="font-heading font-bold text-base leading-tight" style={{ color: theme.sectionHeaderText }}>{title}</h2>
      </div>
      <div className={theme.isStandard ? "p-3 space-y-2.5" : "p-3.5 space-y-3"}>
        {children}
      </div>
    </section>
  );
}

export default function ViewDateFeedback() {
  const { matchId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { context, match: fallbackMatch } = useCurrentMatch(matchId, "matches");
  const match = location.state?.matchData || fallbackMatch;
  const sourceTab = location.state?.sourceTab || "matches";
  const membershipTier = context?.membershipTier || "standard";
  const theme = useMemo(() => getFeedbackTheme(membershipTier), [membershipTier]);
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, []);
  const scoreTone = useMemo(
    () => getCompatibilityTone(Number(match?.updatedScore || match?.initialScore || match?.compatibilityScore) || 65, membershipTier),
    [match?.updatedScore, match?.initialScore, match?.compatibilityScore, membershipTier]
  );
  const reflection =
    getStoredReflection(matchId) ||
    location.state?.reflection ||
    getFallbackReflection(match, match?.dateStage === "3rd Date" ? 3 : 2);

  const highlights = getReflectionHighlights(reflection);
  const growthAreas = getReflectionGrowthAreas(reflection);
  const tetherLearnings = getTetherLearnings(reflection);
  const nextStepSummary = getNextStepSummary(reflection);
  const beforeScore = Number(match?.initialScore || match?.compatibilityScore || 65);
  const afterScore = Number(match?.updatedScore || beforeScore);

  if (!match) return null;

  return (
    <div className="max-w-lg mx-auto min-h-screen bg-background px-4 py-6 space-y-4" data-testid="view-feedback-page">
      <div className="flex items-center gap-2">
        <BackButton onClick={() => navigate(getMatchesRouteWithTab(location.pathname, sourceTab))} />
        <h1 className="font-heading font-bold text-xl">View feedback</h1>
      </div>

      <TopBanner theme={theme} />

      <div
        className="rounded-2xl border-2 p-3.5 flex items-center gap-3"
        style={{ borderColor: theme.sectionBorder, background: theme.sectionSurface }}
      >
        <img src={match.photoPath} alt={match.displayName} className="w-14 h-14 rounded-full object-cover" />
        <div className="flex-1 min-w-0">
          <p className={MATCHES_REFERENCE.primaryTextClass} style={{ color: theme.sectionText }}>{match.displayName}, {match.age}</p>
          <p className={`${MATCHES_REFERENCE.secondaryTextClass} mt-0.5`} style={{ color: theme.mutedText }}>{match.locationLabel}</p>
          <p className={`${MATCHES_REFERENCE.summaryTextClass} mt-1`} style={{ color: theme.mutedText }}>{match.venueName} · {match.dateStage}</p>
        </div>
        <CompatibilityScoreBadge
          score={afterScore}
          size="sm"
          tier={membershipTier}
          scoreColor={theme.sectionText}
          trackColor={theme.sectionBorder}
        />
      </div>

      <Section title="Date summary" theme={theme}>
        <div className="grid grid-cols-2 gap-2.5">
          <InfoCard title="Date type" body={match.dateStage || "Date"} theme={theme} />
          <InfoCard title="Venue" body={match.venueName || "Planned venue"} theme={theme} />
          <InfoCard title="Before" body={`${beforeScore}% compatibility`} theme={theme} />
          <InfoCard title="After" body={`${afterScore}% compatibility`} theme={theme} />
        </div>
        <div
          className="rounded-xl border px-3 py-2 flex items-center justify-center gap-2 text-[10px] font-body"
          style={{ borderColor: theme.innerBorder, background: theme.summaryStripBg, color: theme.summaryStripText }}
        >
          {afterScore >= beforeScore ? <TrendingUp className="w-3.5 h-3.5" style={{ color: theme.iconColor }} /> : <TrendingDown className="w-3.5 h-3.5" style={{ color: theme.iconColor }} />}
          <span>
            Emotional alignment summary: {reflection.comfort === "Strongly aligned" || reflection.comfort === "Mostly aligned"
              ? "comfort and ease looked promising."
              : "the date showed mixed emotional rhythm."}
          </span>
        </div>
      </Section>

      <Section title="What went well" theme={theme}>
        <div className="space-y-2.5">
          {highlights.map((item) => (
            <InfoCard key={item.title} title={item.title} body={item.body} theme={theme} />
          ))}
        </div>
      </Section>

      <Section title="Growth areas" theme={theme}>
        <div className="space-y-2.5">
          {(growthAreas.length ? growthAreas : [{ title: "No major friction", body: "This date did not show any major compatibility friction worth flagging." }]).map((item) => (
            <InfoCard key={item.title} title={item.title} body={item.body} theme={theme} />
          ))}
        </div>
      </Section>

      <Section title="What Tether learned" theme={theme}>
        <div className="space-y-2.5">
          {tetherLearnings.map((item) => (
            <InfoCard key={item} title="Compatibility insight" body={item} theme={theme} />
          ))}
        </div>
      </Section>

      <Section title="Next step" theme={theme}>
        <InfoCard
          title={nextStepSummary}
          body={
            nextStepSummary === "Connection looked promising"
              ? "This date suggests strong enough real-world chemistry to explore the next stage."
              : nextStepSummary === "Wait for mutual interest"
                ? "There is still enough promise here to wait for more clarity before pushing forward."
                : nextStepSummary === "Compatibility weakened slightly"
                  ? "This pairing may have lost some momentum after real-world chemistry was tested."
                : "Tether sees enough signal here to keep exploring thoughtfully."
          }
          theme={theme}
        />
      </Section>
    </div>
  );
}
