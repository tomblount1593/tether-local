import { useMemo } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { LoaderCircle } from "lucide-react";
import BackButton from "@/components/BackButton";
import CompatibilityScoreBadge from "@/components/CompatibilityScoreBadge";
import { MATCHES_REFERENCE } from "@/constants/matchesReference";
import { useCurrentMatch } from "@/hooks/useCurrentMatch";
import { getCompatibilityTone } from "@/lib/compatibilityTone";
import { getMatchesRouteWithTab } from "@/lib/matchFlowRoutes";
import { buildReflectionChips, getStoredReflection } from "@/data/demo/demoDateExperience";

function getWaitingTheme(tier = "standard") {
  if (tier === "premium") {
    return {
      isStandard: false,
      darkSurface: "#37423a",
      darkText: "#f8f3f1",
      darkBorder: "rgba(248,243,241,0.30)",
      lightSurface: "#f8f3f1",
      lightHeader: "#737973",
      lightText: "#37423a",
      lightBorder: "rgba(248,243,241,0.30)",
      buttonBg: "#37423a",
      buttonText: "#f8f3f1",
      topBannerBg: "#37423a",
      topBannerHeaderBg: "#37423a",
      topBannerTitleText: "#f8f3f1",
      topBannerBodyText: "#f8f3f1",
      sectionHeaderBg: "#37423a",
      sectionHeaderText: "#f8f3f1",
    };
  }
  if (tier === "concierge") {
    return {
      isStandard: false,
      darkSurface: "#242623",
      darkText: "#d2c6b2",
      darkBorder: "rgba(210,198,178,0.30)",
      lightSurface: "#d2c6b2",
      lightHeader: "#d2c6b2",
      lightText: "#141916",
      lightBorder: "rgba(210,198,178,0.30)",
      buttonBg: "#242623",
      buttonText: "#d2c6b2",
      topBannerBg: "#242623",
      topBannerHeaderBg: "#242623",
      topBannerTitleText: "#d2c6b2",
      topBannerBodyText: "#d2c6b2",
      sectionHeaderBg: "#242623",
      sectionHeaderText: "#d2c6b2",
    };
  }
  return {
    isStandard: true,
    darkSurface: "hsl(var(--primary))",
    darkText: "hsl(var(--primary-foreground))",
    darkBorder: MATCHES_REFERENCE.darkGreenBorder,
    lightSurface: "#f8f3f1",
    lightHeader: "#e7e5e1",
    lightText: "#37423a",
    lightBorder: "hsl(var(--border))",
    buttonBg: "hsl(var(--primary))",
    buttonText: "hsl(var(--primary-foreground))",
    topBannerBg: "#f8f3f1",
    topBannerHeaderBg: "#DAD7D3",
    topBannerTitleText: "#37423a",
    topBannerBodyText: "#37423a",
    sectionHeaderBg: "#DAD7D3",
    sectionHeaderText: "#37423a",
  };
}

function TopBanner({ theme }) {
  return (
    <div
      className="overflow-hidden rounded-[26px] border text-center"
      style={{ borderColor: theme.darkBorder, background: theme.topBannerBg }}
    >
      <div className="px-4 py-2.5 text-center" style={{ background: theme.topBannerHeaderBg }}>
        <p
          className="font-heading font-bold text-center"
          style={{ ...MATCHES_REFERENCE.insightTitleStyle, color: theme.topBannerTitleText }}
        >
          Waiting for their response
        </p>
      </div>
      <div className="px-4 py-3 text-center">
        <p
          className="font-body text-center"
          style={{ ...MATCHES_REFERENCE.insightSecondaryStyle, color: theme.topBannerBodyText }}
        >
          Your feedback has been submitted. Tether will update compatibility insights once both reflections are complete.
        </p>
      </div>
    </div>
  );
}

function StatusCard({ value, lines, theme }) {
  return (
    <div className="rounded-xl border overflow-hidden" style={{ borderColor: theme.lightBorder, background: theme.lightSurface }}>
      <div className="px-3 py-1.5 min-h-[34px] flex items-center justify-center" style={{ background: theme.lightHeader }}>
        <p className="font-heading font-bold text-[15px] leading-tight text-center" style={{ color: theme.lightText }}>{value}</p>
      </div>
      <div className="px-3 py-2 min-h-[44px] flex items-center justify-center">
        <p className="text-[10px] font-body leading-snug text-center" style={{ color: theme.lightText }}>
          {lines.map((line) => (
            <span key={line} className="block">{line}</span>
          ))}
        </p>
      </div>
    </div>
  );
}

export default function WaitingResponse() {
  const { matchId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { context, match: fallbackMatch } = useCurrentMatch(matchId, "matches");
  const match = location.state?.matchData || fallbackMatch;
  const sourceTab = location.state?.sourceTab || "matches";
  const membershipTier = context?.membershipTier || "standard";
  const theme = useMemo(() => getWaitingTheme(membershipTier), [membershipTier]);
  const reflection = location.state?.reflection || getStoredReflection(matchId);
  const chips = useMemo(() => buildReflectionChips(reflection), [reflection]);
  const scoreTone = useMemo(
    () => getCompatibilityTone(Number(match?.compatibilityScore) || 65, membershipTier),
    [match?.compatibilityScore, membershipTier]
  );

  if (!match) return null;

  return (
    <div className="max-w-lg mx-auto min-h-screen bg-background px-4 py-6 space-y-4" data-testid="waiting-response-page">
      <div className="flex items-center gap-2">
        <BackButton onClick={() => navigate(getMatchesRouteWithTab(location.pathname, sourceTab))} />
        <h1 className="font-heading font-bold text-xl">Waiting for response</h1>
      </div>

      <TopBanner theme={theme} />

      <div
        className="rounded-2xl border-2 p-3.5 flex items-center gap-3"
        style={{ borderColor: theme.darkBorder, background: theme.darkSurface }}
      >
        <img src={match.photoPath} alt={match.displayName} className="w-14 h-14 rounded-full object-cover" />
        <div className="flex-1 min-w-0">
          <p className={MATCHES_REFERENCE.primaryTextClass} style={{ color: theme.darkText }}>{match.displayName}, {match.age}</p>
          <p className={`${MATCHES_REFERENCE.secondaryTextClass} mt-0.5`} style={{ color: theme.darkText }}>{match.locationLabel}</p>
          <p className={`${MATCHES_REFERENCE.summaryTextClass} mt-1`} style={{ color: theme.darkText }}>
            We&apos;ll unlock updated compatibility insight once both reflections are in.
          </p>
        </div>
        <CompatibilityScoreBadge
          score={Number(match.compatibilityScore) || 65}
          size="sm"
          tier={membershipTier}
          scoreColor={scoreTone.text}
        />
      </div>

      <section className="rounded-[26px] overflow-hidden border" style={{ borderColor: theme.darkBorder, background: theme.darkSurface }}>
        <div className="px-4 py-2.5 text-center" style={{ background: theme.sectionHeaderBg }}>
          <h2 className="font-heading font-bold text-base leading-tight" style={{ color: theme.sectionHeaderText }}>Reflection Submitted</h2>
        </div>
        <div className={theme.isStandard ? "p-3 space-y-2.5" : "p-3.5 space-y-3"}>
          <div className="rounded-xl border px-3 py-3 flex items-center justify-center gap-3 text-center" style={{ borderColor: theme.lightBorder, background: theme.lightSurface }}>
            <LoaderCircle className="w-4 h-4 animate-spin flex-shrink-0" style={{ color: theme.lightText }} />
            <div>
              <p className="text-[11px] font-body" style={{ color: theme.lightText }}>
                Compatibility learning will refresh as soon as they respond.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <StatusCard value="1" lines={["Your reflection", "in"]} theme={theme} />
            <StatusCard value="1" lines={["Waiting on", "them"]} theme={theme} />
            <StatusCard value="2" lines={["Needed to", "update"]} theme={theme} />
          </div>
        </div>
      </section>

      {!!chips.length && (
        <section
          className="rounded-[26px] overflow-hidden border bg-card"
          style={{ borderColor: MATCHES_REFERENCE.darkGreenBorder }}
        >
          <div className="px-4 py-2 bg-primary text-center">
            <h2 className="font-heading font-bold text-base leading-tight text-primary-foreground">What you shared</h2>
          </div>
          <div className="p-3.5">
            <div className="flex flex-wrap justify-center gap-2">
              {chips.map((chip) => (
                <span key={chip} className="rounded-full bg-[#e7e5e1] px-3 py-2 text-[11px] font-body text-foreground">
                  {chip}
                </span>
              ))}
            </div>
          </div>
        </section>
      )}

      <button
        type="button"
        onClick={() => navigate(getMatchesRouteWithTab(location.pathname, sourceTab))}
        className="btn-hover-dark w-full rounded-full px-5 py-3 text-sm font-semibold"
        style={{ background: theme.darkSurface, color: theme.darkText }}
      >
        Back to Matches
      </button>
    </div>
  );
}
