import { useEffect, useMemo, useState } from "react";
import { Clock, MapPin, Sparkles } from "lucide-react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import BackButton from "@/components/BackButton";
import CompatibilityScoreBadge from "@/components/CompatibilityScoreBadge";
import { MATCHES_REFERENCE } from "@/constants/matchesReference";
import { useCurrentMatch } from "@/hooks/useCurrentMatch";
import { getCompatibilityTone } from "@/lib/compatibilityTone";
import { getMatchesRouteWithTab } from "@/lib/matchFlowRoutes";
import { DATE_2_RECOMMENDATIONS, DATE_3_RECOMMENDATIONS } from "@/data/demo/demoDateExperience";

function getNextDateBookingTheme(tier = "standard") {
  if (tier === "premium") {
    return {
      isStandard: false,
      bannerBg: "#37423a",
      bannerText: "#f8f3f1",
      bannerSub: "rgba(248,243,241,0.82)",
      cardBg: "#5b655d",
      cardBorder: "rgba(248,243,241,0.30)",
      buttonInactiveBg: "#37423a",
      buttonInactiveText: "#f8f3f1",
      buttonInactiveBorder: "rgba(248,243,241,0.24)",
      buttonActiveBg: "#f8f3f1",
      buttonActiveText: "#141916",
      buttonActiveBorder: "#f8f3f1",
      recommendationInactiveSub: "rgba(248,243,241,0.82)",
      recommendationActiveSub: "rgba(20,25,22,0.80)",
    };
  }
  if (tier === "concierge") {
    return {
      isStandard: false,
      bannerBg: "#242623",
      bannerText: "#d2c6b2",
      bannerSub: "rgba(210,198,178,0.82)",
      cardBg: "#242623",
      cardBorder: "rgba(210,198,178,0.30)",
      buttonInactiveBg: "#242623",
      buttonInactiveText: "#d2c6b2",
      buttonInactiveBorder: "rgba(210,198,178,0.30)",
      buttonActiveBg: "#f8f3f1",
      buttonActiveText: "#141916",
      buttonActiveBorder: "#f8f3f1",
      recommendationInactiveSub: "rgba(210,198,178,0.82)",
      recommendationActiveSub: "rgba(20,25,22,0.80)",
    };
  }
  return {
    isStandard: true,
    bannerBg: "hsl(var(--primary))",
    bannerText: "hsl(var(--primary-foreground))",
    bannerSub: "rgba(248,243,241,0.90)",
    cardBg: "hsl(var(--card))",
    cardBorder: MATCHES_REFERENCE.darkGreenBorder,
    buttonInactiveBg: "#e7e5e1",
    buttonInactiveText: "hsl(var(--foreground))",
    buttonInactiveBorder: "hsl(var(--border))",
    buttonActiveBg: "hsl(var(--primary))",
    buttonActiveText: "hsl(var(--primary-foreground))",
    buttonActiveBorder: "hsl(var(--primary))",
    recommendationInactiveSub: "#37423a",
    recommendationActiveSub: "rgba(248,243,241,0.88)",
    neutralBannerBg: "hsl(var(--card))",
    neutralBannerBorder: MATCHES_REFERENCE.darkGreenBorder,
    neutralBannerText: "#37423a",
  };
}

function SectionBanner({ title, subtitle, theme }) {
  return (
    <div className="rounded-[20px] px-4 py-2.5 text-center" style={{ background: theme.bannerBg, color: theme.bannerText }}>
      <p className="font-heading font-bold text-base leading-tight">{title}</p>
      {subtitle ? <p className="font-body text-xs mt-0.5 leading-tight" style={{ color: theme.bannerSub }}>{subtitle}</p> : null}
    </div>
  );
}

function DynamicBanner({ planningStage, theme }) {
  if (theme.isStandard && !planningStage) {
    return (
      <div
        className="rounded-[20px] border-2 px-4 py-2.5 text-center"
        style={{ background: theme.neutralBannerBg, borderColor: theme.neutralBannerBorder, color: theme.neutralBannerText }}
      >
        <p className="font-heading font-bold text-base leading-tight">Congratulations — time for your next date</p>
        <p className="font-body text-xs mt-0.5 leading-tight" style={{ color: theme.neutralBannerText }}>
          Your connection is building. Let&apos;s explore deeper compatibility.
        </p>
      </div>
    );
  }

  const resolvedStage = planningStage === 3 ? 3 : 2;
  return (
    <SectionBanner
      theme={theme}
      title={resolvedStage === 3 ? "Congratulations — time for your 3rd date" : "Congratulations — time for your 2nd date"}
      subtitle={
        resolvedStage === 3
          ? "Your connection is building. Let’s explore deeper compatibility."
          : "Tether has refined your compatibility based on your first date."
      }
    />
  );
}

function SelectorButton({ active, children, onClick, theme }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-full border px-3 py-2 text-xs font-body font-semibold leading-tight transition-colors"
      style={
        active
          ? { background: theme.buttonActiveBg, color: theme.buttonActiveText, borderColor: theme.buttonActiveBorder }
          : { background: theme.buttonInactiveBg, color: theme.buttonInactiveText, borderColor: theme.buttonInactiveBorder }
      }
    >
      {children}
    </button>
  );
}

export default function NextDateBooking() {
  const { matchId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { context, match: fallbackMatch } = useCurrentMatch(matchId, "matches");
  const match = location.state?.matchData || fallbackMatch;
  const sourceTab = location.state?.sourceTab || "next";
  const membershipTier = context?.membershipTier || "standard";
  const theme = useMemo(() => getNextDateBookingTheme(membershipTier), [membershipTier]);
  const initialStage = Number(match?.stageNumber) === 3 ? 3 : 2;
  const [planningStage, setPlanningStage] = useState(theme.isStandard ? null : initialStage);
  const [selectedRecommendationId, setSelectedRecommendationId] = useState(
    theme.isStandard ? null : (initialStage === 3 ? DATE_3_RECOMMENDATIONS[0]?.id : DATE_2_RECOMMENDATIONS[0]?.id)
  );
  const [submitted, setSubmitted] = useState(false);
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, []);

  const scoreTone = useMemo(
    () => getCompatibilityTone(Number(match?.compatibilityScore) || 65, membershipTier),
    [match?.compatibilityScore, membershipTier]
  );

  const resolvedPlanningStage = planningStage || initialStage;
  const recommendations = resolvedPlanningStage === 3 ? DATE_3_RECOMMENDATIONS : DATE_2_RECOMMENDATIONS;
  const selectedRecommendation =
    recommendations.find((item) => item.id === selectedRecommendationId) || null;

  if (!match) return null;

  const profileSummaryCard = (
    <div
      className="rounded-2xl border-2 p-3.5 flex items-center gap-3"
      style={{ borderColor: theme.cardBorder, background: theme.cardBg }}
    >
      <img src={match.photoPath} alt={match.displayName} className="w-14 h-14 rounded-full object-cover" />
      <div className="flex-1 min-w-0">
        <p className={MATCHES_REFERENCE.primaryTextClass}>{match.displayName}, {match.age}</p>
        <p className={`${MATCHES_REFERENCE.secondaryTextClass} flex items-center gap-1 mt-0.5`}>
          <MapPin className="w-3 h-3" />
          {match.locationLabel}
        </p>
      </div>
      <CompatibilityScoreBadge
        score={Number(match.compatibilityScore) || 65}
        size="sm"
        tier={membershipTier}
        scoreColor={scoreTone.text}
      />
    </div>
  );

  const planningStageSection = (
    <section className="rounded-2xl border p-3.5 space-y-3" style={{ borderColor: theme.cardBorder, background: theme.cardBg }}>
      <SectionBanner theme={theme} title="Planning Stage" subtitle="Choose which date you&apos;re planning" />
      <div className="flex items-center justify-center gap-2">
        <SelectorButton
          active={planningStage === 2}
          theme={theme}
          onClick={() => {
            setPlanningStage(2);
            setSelectedRecommendationId(DATE_2_RECOMMENDATIONS[0]?.id);
          }}
        >
          Planning Date 2
        </SelectorButton>
        <SelectorButton
          active={planningStage === 3}
          theme={theme}
          onClick={() => {
            setPlanningStage(3);
            setSelectedRecommendationId(DATE_3_RECOMMENDATIONS[0]?.id);
          }}
        >
          Planning Date 3
        </SelectorButton>
      </div>
    </section>
  );

  return (
    <div className="max-w-lg mx-auto min-h-screen bg-background px-4 py-6 space-y-4" data-testid="book-next-date-page">
      <div className="flex items-center gap-2">
        <BackButton onClick={() => navigate(getMatchesRouteWithTab(location.pathname, sourceTab))} />
        <h1 className="font-heading font-bold text-xl">Book next date</h1>
      </div>

      {theme.isStandard ? (
        <>
          {profileSummaryCard}
          {planningStageSection}
          <DynamicBanner planningStage={planningStage} theme={theme} />
        </>
      ) : (
        <>
          <DynamicBanner planningStage={resolvedPlanningStage} theme={theme} />
          {profileSummaryCard}
          {planningStageSection}
        </>
      )}

      <section className="rounded-2xl border p-3.5 space-y-3" style={{ borderColor: theme.cardBorder, background: theme.cardBg }}>
        <SectionBanner
          theme={theme}
          title={resolvedPlanningStage === 3 ? "Date 3 Recommendations" : "Date 2 Recommendations"}
          subtitle={resolvedPlanningStage === 3 ? "Deeper compatibility and shared rhythm" : "Comfort, chemistry, and easy conversation"}
        />

        <div className="space-y-2.5">
          {recommendations.map((item) => {
            const active = selectedRecommendationId === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setSelectedRecommendationId(item.id)}
                className="w-full rounded-2xl border px-3.5 py-3 text-left transition-colors"
                style={
                  active
                    ? { background: theme.buttonActiveBg, color: theme.buttonActiveText, borderColor: theme.buttonActiveBorder }
                    : { background: theme.buttonInactiveBg, color: theme.buttonInactiveText, borderColor: theme.buttonInactiveBorder }
                }
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-heading font-bold text-base leading-tight">{item.title}</p>
                    <p className="font-body text-xs mt-0.5" style={{ color: active ? theme.recommendationActiveSub : theme.recommendationInactiveSub }}>
                      {item.subtitle}
                    </p>
                  </div>
                  {active ? <Sparkles className="w-4 h-4 flex-shrink-0" /> : null}
                </div>
                <p className="text-[11px] font-body leading-relaxed mt-2" style={{ color: active ? theme.recommendationActiveSub : theme.recommendationInactiveSub }}>
                  {item.compatibilityReason}
                </p>
                {item.lifestyleReason ? (
                  <p className="text-[11px] font-body leading-relaxed mt-1" style={{ color: active ? theme.recommendationActiveSub : theme.recommendationInactiveSub }}>
                    {item.lifestyleReason}
                  </p>
                ) : null}
                {item.pacingReason ? (
                  <p className="text-[11px] font-body leading-relaxed mt-1" style={{ color: active ? theme.recommendationActiveSub : theme.recommendationInactiveSub }}>
                    {item.pacingReason}
                  </p>
                ) : null}
                <div className="flex items-center gap-4 mt-2" style={{ color: active ? theme.recommendationActiveSub : theme.recommendationInactiveSub }}>
                  <span className="text-[11px] font-body">{item.vibe}</span>
                  {item.duration ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-body">
                      <Clock className="w-3 h-3" />
                      {item.duration}
                    </span>
                  ) : null}
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {submitted && selectedRecommendation ? (
        <section className="rounded-2xl border border-border bg-card p-3.5 space-y-3">
          <h2 className="font-heading font-bold text-base leading-tight">Next date plan saved</h2>
          <p className="text-xs font-body text-muted-foreground leading-relaxed">
            Tether will use this choice to guide the next stage of compatibility pacing.
          </p>
          <div className="rounded-xl border border-border bg-[#f8f3f1] p-3">
            <p className="font-heading font-bold text-sm leading-tight">{selectedRecommendation.title}</p>
            <p className="text-xs font-body text-muted-foreground mt-1">{selectedRecommendation.subtitle}</p>
          </div>
        </section>
      ) : null}

      <button
        type="button"
        onClick={() => setSubmitted(true)}
        disabled={theme.isStandard ? !planningStage || !selectedRecommendationId : false}
        className="btn-hover-dark w-full rounded-full px-5 py-3 text-sm font-semibold"
        style={{ background: theme.bannerBg, color: theme.bannerText }}
      >
        Confirm Next Date
      </button>
    </div>
  );
}
