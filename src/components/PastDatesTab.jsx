import { BookOpen, Sparkles, TrendingDown } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTier } from "@/hooks/useTier";
import { getCompatibilityTone } from "@/lib/compatibilityTone";
import CompatibilityScoreBadge from "./CompatibilityScoreBadge";
import { MATCHES_REFERENCE } from "@/constants/matchesReference";
import { getQuickReflectionRoute, getViewFeedbackRoute } from "@/lib/matchFlowRoutes";

function getPastDatesTheme(tier = "standard") {
  if (tier === "premium") {
    return {
      border: "rgba(248,243,241,0.18)",
      internalBorder: "rgba(248,243,241,0.18)",
      surface: "#5b655d",
      stripBg: "#737973",
      stripText: "#f8f3f1",
      stripMuted: "rgba(248,243,241,0.78)",
      badgeTrack: "rgba(248,243,241,0.20)",
    };
  }
  if (tier === "concierge") {
    return {
      border: "rgba(210,198,178,0.30)",
      internalBorder: "rgba(210,198,178,0.30)",
      surface: "#242623",
      stripBg: "#242623",
      stripText: "#d2c6b2",
      stripMuted: "rgba(210,198,178,0.78)",
      badgeTrack: "rgba(210,198,178,0.24)",
    };
  }
  return {
    border: MATCHES_REFERENCE.darkGreenBorder,
    internalBorder: "hsl(var(--border))",
    surface: "hsl(var(--card))",
    stripBg: "#e7e5e1",
    stripText: "#37423a",
    stripMuted: "rgba(55,66,58,0.72)",
    badgeTrack: "rgba(55,66,58,0.18)",
  };
}

function NameAge({ displayName, age }) {
  if (Number.isFinite(age) && age > 0) return <>{displayName}, {age}</>;
  return <>{displayName}</>;
}

export default function PastDatesTab({ matches = [], sourceTab = "past" }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { tier } = useTier();
  const sharedCardBorder =
    tier === "concierge"
      ? "rgba(210,198,178,0.30)"
      : tier === "premium"
        ? "rgba(248,243,241,0.18)"
        : MATCHES_REFERENCE.darkGreenBorder;
  const theme = getPastDatesTheme(tier);
  if (!matches.length) {
    return (
      <div className="rounded-2xl border border-border bg-card p-8 text-center">
        <p className="font-heading font-bold text-base">No past dates yet</p>
        <p className="text-xs font-body text-muted-foreground mt-1">Past date feedback will appear here once dates are completed.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border bg-card overflow-hidden" style={{ borderColor: sharedCardBorder, background: theme.surface }}>
        <div className="px-4 py-2.5 bg-primary text-primary-foreground text-center">
          <div className="grid grid-cols-[1fr_auto_1fr] items-center min-h-[28px]">
            <div className="flex justify-end pr-2">
              <Sparkles className="w-4 h-4 text-primary-foreground/80" />
            </div>
            <p className="font-heading font-bold text-[clamp(17px,4.2vw,21px)] leading-[1.1] text-primary-foreground">Past dates & feedback</p>
            <div />
          </div>
        </div>
        <div className="p-4" style={tier === "premium" ? { background: theme.stripBg } : undefined}>
          <p className="font-body text-[12px] leading-relaxed text-center" style={{ color: theme.stripMuted }}>
            This is where Tether learns from your real-world chemistry to continuously refine your matches — evolving with every date to better understand who you’re genuinely most compatible with.
          </p>
        </div>
      </div>

      {matches.map((match, index) => (
        <div
          key={match.uiKey || `${match.id}-${index}`}
          className="rounded-2xl border bg-card overflow-hidden"
          style={{ borderColor: sharedCardBorder, background: theme.surface }}
          data-testid="past-date-card"
        >
          <div className="p-4 flex items-center gap-3">
            <img src={match.photoPath} alt={match.displayName} className="w-16 h-16 rounded-full object-cover" data-testid="match-photo" />
            <div className="flex-1 min-w-0">
              <p className={MATCHES_REFERENCE.primaryTextClass} style={{ color: theme.stripText }} data-testid="match-name"><NameAge displayName={match.displayName} age={match.age} /></p>
              <p className="text-xs font-body mt-0.5" style={{ color: theme.stripMuted }}>{match.locationLabel}</p>
              <p className="text-[11px] font-body mt-1 leading-relaxed" style={{ color: theme.stripMuted }}>{match.venueName} · {match.dateStage}</p>
            </div>
            {Number.isFinite(match.initialScore) && (
              <div data-testid="match-score">
                <CompatibilityScoreBadge score={match.initialScore} size="sm" tier={tier} scoreColor={theme.stripText} trackColor={theme.badgeTrack} />
              </div>
            )}
          </div>

          {Number.isFinite(match.updatedScore) && Number.isFinite(match.scoreDelta) && (
            <div
              className="border-t px-4 py-2.5 text-[11px] font-body flex items-center justify-center gap-1.5"
              style={{ color: theme.stripText, background: tier === "concierge" ? "#0b0c0a" : theme.stripBg, borderColor: theme.internalBorder }}
            >
              <TrendingDown className="w-3.5 h-3.5" style={{ color: theme.stripText }} />
              <span>
                Initial{" "}
                <span style={{ color: tier === "premium" || tier === "concierge" ? theme.stripText : getCompatibilityTone(match.initialScore, tier).text }}>{match.initialScore}%</span>
                {" "}→ Updated fit{" "}
                <span style={{ color: tier === "premium" || tier === "concierge" ? theme.stripText : getCompatibilityTone(match.updatedScore, tier).text }}>{match.updatedScore}%</span>
              </span>
            </div>
          )}

          <div className="border-t border-border px-4 py-3 flex items-center justify-between gap-3" style={{ borderColor: theme.internalBorder }}>
            <p className="text-xs font-body text-muted-foreground min-w-0" data-testid="feedback-status">{match.statusMessage}</p>
            <button
              type="button"
              onClick={() => {
                const route =
                  match.feedbackStatus === "not_completed"
                    ? getQuickReflectionRoute(location.pathname, match.id)
                    : getViewFeedbackRoute(location.pathname, match.id);
                navigate(route, { state: { matchData: match, sourceTab } });
              }}
              className="btn-hover-dark w-[152px] min-h-[40px] rounded-lg border border-primary bg-primary px-3 py-2 text-center text-xs font-body font-semibold leading-tight text-primary-foreground flex items-center justify-center gap-1.5"
            >
              <BookOpen className="w-3.5 h-3.5" />
              {match.actionLabel}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
