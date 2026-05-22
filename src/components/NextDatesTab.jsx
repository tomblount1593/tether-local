import { Calendar, Clock, Sparkles } from "lucide-react";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import CompatibilityScoreBadge from "./CompatibilityScoreBadge";
import DateDetailsAccordion from "./DateDetailsAccordion";
import ProfileCompatibilityBanner from "./ProfileCompatibilityBanner";
import { MATCHES_REFERENCE } from "@/constants/matchesReference";
import {
  getBookNextDateRoute,
  getMatchDetailRoute,
  getQuickReflectionRoute,
  getWaitingResponseRoute,
} from "@/lib/matchFlowRoutes";

function getNextDatesTheme(tier = "standard") {
  if (tier === "premium") {
    return {
      border: "rgba(248,243,241,0.18)",
      internalBorder: "rgba(248,243,241,0.18)",
      surface: "#5b655d",
      stripBg: "#737973",
      stripText: "#f8f3f1",
      stripMuted: "rgba(248,243,241,0.78)",
      bullet: "rgba(248,243,241,0.78)",
      passiveBg: "#737973",
      passiveText: "#f8f3f1",
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
      bullet: "rgba(210,198,178,0.78)",
      passiveBg: "#242623",
      passiveText: "#d2c6b2",
      badgeTrack: "rgba(210,198,178,0.24)",
    };
  }
  return {
    border: MATCHES_REFERENCE.darkGreenBorder,
    internalBorder: "hsl(var(--border))",
    surface: "hsl(var(--card))",
    stripBg: "#e7e5e1",
    stripText: "#37423a",
    stripMuted: "rgba(55,66,58,0.8)",
    bullet: "rgba(55,66,58,0.7)",
    passiveBg: "#E7E5E2",
    passiveText: "#37423a",
    badgeTrack: "rgba(55,66,58,0.18)",
  };
}

function NameAge({ displayName, age }) {
  if (Number.isFinite(age) && age > 0) return <>{displayName}, {age}</>;
  return <>{displayName}</>;
}

function StageCircle({ stage }) {
  return (
    <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center flex-shrink-0">
      <span className="font-body font-semibold text-[13px] leading-none">{stage}</span>
    </div>
  );
}

export default function NextDatesTab({ tier = "standard", matches = [], sourceTab = "next", onOpenBreakdown }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [openDetailsId, setOpenDetailsId] = useState(null);
  const sharedCardBorder =
    tier === "concierge"
      ? "rgba(210,198,178,0.30)"
      : tier === "premium"
        ? "rgba(248,243,241,0.18)"
        : MATCHES_REFERENCE.darkGreenBorder;
  const theme = getNextDatesTheme(tier);
  const isConcierge = tier === "concierge";

  if (!matches.length) {
    return (
      <div className="rounded-2xl border border-border bg-card p-8 text-center">
        <p className="font-heading font-bold text-base">No next dates yet</p>
        <p className="text-xs font-body text-muted-foreground mt-1">When your next-step dates are ready, they’ll show up here.</p>
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
            <p className="font-heading font-bold text-[clamp(17px,4.2vw,21px)] leading-[1.1] text-primary-foreground whitespace-nowrap">
              The next dates
            </p>
            <div />
          </div>
        </div>
        <div
          className="border-b px-4 py-1 flex items-center justify-center min-h-[32px]"
          style={{ borderColor: theme.internalBorder, background: isConcierge ? "#0b0c0a" : theme.stripBg }}
        >
          <div className="grid grid-cols-[1fr_auto_1fr] items-center w-full">
            <div className="flex justify-end pr-2">
              <Sparkles className="w-3 h-3 flex-shrink-0" style={{ color: isConcierge ? "#d0c7b4" : theme.stripMuted }} />
            </div>
            <h2
              className="font-body text-[10px] leading-none font-semibold uppercase tracking-[0.16em] text-center whitespace-nowrap"
              style={{ color: isConcierge ? "#d0c7b4" : theme.stripMuted }}
            >
              Tether doesn&apos;t stop after Date 1
            </h2>
            <div />
          </div>
        </div>
        <div className="px-4 py-3">
          <ul className="mx-auto max-w-[31rem] space-y-2 text-[12px] font-body" style={{ color: theme.stripText }}>
            <li className="flex items-start gap-2 text-left">
              <span className="mt-[6px] h-1.5 w-1.5 rounded-full flex-shrink-0" style={{ background: theme.bullet }} />
              <span>After Date 1, we guide deeper clarity.</span>
            </li>
            <li className="flex items-start gap-2 text-left">
              <span className="mt-[6px] h-1.5 w-1.5 rounded-full flex-shrink-0" style={{ background: theme.bullet }} />
              <span>Date 2 is designed to be fun and build comfort and rhythm.</span>
            </li>
            <li className="flex items-start gap-2 text-left">
              <span className="mt-[6px] h-1.5 w-1.5 rounded-full flex-shrink-0" style={{ background: theme.bullet }} />
              <span>Date 3 is designed to test long-term relationship fit and confirm they&apos;re the right match for you.</span>
            </li>
          </ul>
        </div>
      </div>

      {matches.map((match, index) => (
        <div
          key={match.uiKey || `${match.id}-${index}`}
          className="rounded-2xl border bg-card overflow-hidden"
          style={{ borderColor: sharedCardBorder, background: theme.surface }}
          data-testid="next-date-card"
        >
          {(() => {
            const cardId = match.uiKey || `${match.id}-${index}`;
            const detailsOpen = openDetailsId === cardId;
            const showDateDetails = Boolean(match.showDateDetails);
            const isPassiveBookedState = match.progressionState === "date_booked";
            return (
              <>
            <button
              type="button"
            onClick={() => navigate(getMatchDetailRoute(location.pathname, match.id), {
              state: { fromMatchesTab: sourceTab, fromMatchesIndex: index },
            })}
            className="w-full px-4 py-4 grid grid-cols-[64px_minmax(0,1fr)_40px] gap-x-4 items-center text-left"
          >
            <img src={match.photoPath} alt={match.displayName} className="w-16 h-16 rounded-full object-cover self-center" data-testid="match-photo" />
            <div className="min-w-0 pl-1">
              <p className={MATCHES_REFERENCE.primaryTextClass} style={{ color: theme.stripText }} data-testid="match-name"><NameAge displayName={match.displayName} age={match.age} /></p>
              <p className="text-xs font-body mt-0.5" style={{ color: theme.stripMuted }}>{match.locationLabel}</p>
              <p className="text-[11px] font-body leading-relaxed mt-1.5" style={{ color: theme.stripMuted }}>{match.statusMessage}</p>
            </div>
            <div className="flex flex-col items-end min-h-[64px]">
              <StageCircle stage={`${match.dateStage}`} />
              {Number.isFinite(match.compatibilityScore) && (
                <div data-testid="match-score" className="mt-2.5">
                  <CompatibilityScoreBadge score={match.compatibilityScore} size="xs" tier={tier} scoreColor={theme.stripText} trackColor={theme.badgeTrack} />
                </div>
              )}
            </div>
          </button>
          <ProfileCompatibilityBanner
            tier={tier}
            backgroundOverride={isConcierge ? "#0b0c0a" : undefined}
            onClick={() => onOpenBreakdown?.(match, index)}
          />
          <div className="border-t border-border px-4 py-3 flex items-center justify-between gap-3" style={{ borderColor: theme.internalBorder }}>
            <div className="text-xs font-body text-muted-foreground flex items-center gap-2 min-w-0">
              <Calendar className="w-3.5 h-3.5" />
              <div className="leading-tight">{match.dateTimeLabel}</div>
            </div>
            <button
              type="button"
              onClick={() => {
                if (isPassiveBookedState) return;
                const route =
                  match.actionLabel === "Let's do a quick reflection"
                    ? getQuickReflectionRoute(location.pathname, match.id)
                    : match.actionLabel === "Waiting for response"
                      ? getWaitingResponseRoute(location.pathname, match.id)
                      : getBookNextDateRoute(location.pathname, match.id);
                navigate(route, { state: { matchData: match, sourceTab } });
              }}
              className={`w-[152px] min-h-[40px] rounded-lg px-3 py-2 text-center text-xs font-body font-semibold leading-tight ${
                isPassiveBookedState
                  ? "border"
                  : "btn-hover-dark border border-primary bg-primary text-primary-foreground"
              }`}
              style={isPassiveBookedState ? { color: theme.passiveText, background: theme.passiveBg, borderColor: theme.internalBorder } : undefined}
            >
              {match.actionLabel}
            </button>
          </div>
          {showDateDetails ? (
            <DateDetailsAccordion
              match={match}
              stageLabel={`${match.dateStage} Date`}
              open={detailsOpen}
              onOpenChange={(isOpen) => setOpenDetailsId(isOpen ? cardId : null)}
              tier={tier}
              buttonBackgroundOverride={tier === "concierge" ? "#d0c7b4" : null}
              buttonTextColorOverride={tier === "concierge" ? "#0b0c0a" : null}
            />
          ) : null}
          {match.feedbackRequired && (
            <div
              className={`border-t px-4 py-2.5 text-[11px] font-body flex items-center gap-1.5 ${detailsOpen && !isConcierge ? "bg-primary text-primary-foreground/85" : ""}`}
              style={
                isConcierge
                  ? { color: theme.stripText, background: "#0b0c0a", borderColor: theme.internalBorder }
                  : !detailsOpen
                    ? { color: theme.stripText, background: theme.stripBg, borderColor: theme.internalBorder }
                    : { borderColor: theme.internalBorder }
              }
            >
              <Clock className="w-3.5 h-3.5" style={isConcierge || !detailsOpen ? { color: theme.stripText } : undefined} />
              <span>Feedback needed before booking the next stage.</span>
            </div>
          )}
              </>
            );
          })()}
        </div>
      ))}
    </div>
  );
}
