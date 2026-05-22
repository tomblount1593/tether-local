import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { Calendar, Check, ChevronUp, Heart } from "lucide-react";
import { motion } from "framer-motion";
import { useTier } from "../hooks/useTier";
import { useCurrentDemoMatches } from "@/hooks/useCurrentDemoMatches";
import NextDatesTab from "../components/NextDatesTab";
import PastDatesTab from "../components/PastDatesTab";
import CompatibilityBreakdown from "../components/CompatibilityBreakdown";
import CompatibilityScoreBadge from "../components/CompatibilityScoreBadge";
import DateDetailsAccordion from "../components/DateDetailsAccordion";
import ProfileCompatibilityBanner from "../components/ProfileCompatibilityBanner";
import VerifiedBadge from "../components/VerifiedBadge";
import UpgradeDateBanner from "../components/UpgradeDateBanner";
import { getMatchesTabData } from "@/data/demo/demoMatchTabs";
import { MATCHES_REFERENCE } from "@/constants/matchesReference";
import { getBookDateRoute, getMatchDetailRoute } from "@/lib/matchFlowRoutes";

function getTierTabStyles(tier, isActive) {
  if (tier === "premium") {
    return isActive
      ? {
          background: "#37423a",
          color: "#f8f3f1",
          borderColor: "rgba(248,243,241,0.18)",
        }
      : {
          background: "#5b655d",
          color: "#f8f3f1",
          borderColor: "rgba(248,243,241,0.18)",
        };
  }

  if (tier === "concierge") {
    return isActive
      ? {
          background: "#d0c7b4",
          color: "#141916",
          borderColor: "rgba(210,198,178,0.30)",
        }
      : {
          background: "#232623",
          color: "#d8c6ae",
          borderColor: "rgba(216,198,174,0.18)",
        };
  }

  return isActive
    ? {
        background: "hsl(var(--primary))",
        color: "hsl(var(--primary-foreground))",
        borderColor: "hsl(var(--primary))",
      }
    : {
        background: "hsl(var(--background))",
        color: "hsl(var(--foreground))",
        borderColor: "hsl(var(--border))",
      };
}

function getTierStripStyles(tier) {
  if (tier === "premium") {
    return {
      background: "#737973",
      color: "#f8f3f1",
      borderColor: "rgba(248,243,241,0.28)",
    };
  }
  if (tier === "concierge") {
    return {
      background: "#232623",
      color: "#d8c6ae",
      borderColor: "rgba(216,198,174,0.28)",
    };
  }
  return {
    background: "hsl(var(--card))",
    color: "#37423a",
    borderColor: "hsl(var(--border))",
  };
}

function getTierCardStyles(tier) {
  if (tier === "premium") {
    return {
      background: "#5b655d",
      text: "#f8f3f1",
      muted: "rgba(248,243,241,0.78)",
      summary: "rgba(248,243,241,0.76)",
      badgeTrack: "rgba(248,243,241,0.24)",
    };
  }
  if (tier === "concierge") {
    return {
      background: "#232623",
      text: "#d8c6ae",
      muted: "rgba(216,198,174,0.78)",
      summary: "rgba(216,198,174,0.76)",
      badgeTrack: "rgba(216,198,174,0.24)",
    };
  }
  return {
    background: "hsl(var(--card))",
    text: "hsl(var(--foreground))",
    muted: "hsl(var(--muted-foreground))",
    summary: "hsl(var(--foreground) / 0.70)",
    badgeTrack: "rgba(55,66,58,0.18)",
  };
}

function EmptyState({ title, body }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-8 text-center">
      <Heart className="w-8 h-8 mx-auto mb-3 text-muted-foreground" />
      <p className="font-heading font-bold text-lg">{title}</p>
      <p className="text-sm text-muted-foreground mt-1">{body}</p>
    </div>
  );
}

export default function Matches() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const { tier } = useTier();
  const { matches } = useCurrentDemoMatches("matches");
  const [breakdownId, setBreakdownId] = useState(null);
  const [breakdownMatch, setBreakdownMatch] = useState(null);
  const [breakdownSourceIndex, setBreakdownSourceIndex] = useState(null);
  const [breakdownSourceTab, setBreakdownSourceTab] = useState(null);
  const [showViewAllMatchesBanner, setShowViewAllMatchesBanner] = useState(false);
  const [showScrollTopBanner, setShowScrollTopBanner] = useState(false);
  const pageTopRef = useRef(null);
  const activeTabParam = searchParams.get("tab");
  const activeTab = ["new", "pending", "next", "past"].includes(activeTabParam) ? activeTabParam : "new";
  const stripStyles = getTierStripStyles(tier);
  const cardStyles = getTierCardStyles(tier);
  const sharedCardBorder =
    tier === "concierge"
      ? "rgba(216,198,174,0.28)"
      : tier === "premium"
        ? "rgba(248,243,241,0.28)"
        : MATCHES_REFERENCE.darkGreenBorder;

  const projected = useMemo(() => getMatchesTabData(matches || [], {}), [matches]);
  const { newMatches, firstDateBooked, nextDates, pastDatesFeedback } = projected;
  const tabCounts = { new: newMatches.length, pending: firstDateBooked.length, next: nextDates.length, past: pastDatesFeedback.length };
  const totalMatches = newMatches.length + firstDateBooked.length + nextDates.length;

  const nameAge = (m) => (Number.isFinite(m.age) && m.age > 0 ? `${m.displayName}, ${m.age}` : m.displayName);

  useEffect(() => {
    const targetMatchId = location.state?.scrollToMatchId;
    const shouldShowBanner = location.state?.showViewAllMatchesBanner;
    const fromMatchesIndex = Number(location.state?.fromMatchesIndex);
    const fromMatchesTab = location.state?.fromMatchesTab;
    if (!targetMatchId || !["new", "pending", "next"].includes(activeTab) || fromMatchesTab !== activeTab) return;

    const timer = window.setTimeout(() => {
      const target = document.querySelector(`[data-match-card-id="${targetMatchId}"]`);
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "center" });
        const shouldActivateBanner = Boolean(shouldShowBanner) && Number.isFinite(fromMatchesIndex) && fromMatchesIndex > 0;
        if (shouldActivateBanner) {
          window.setTimeout(() => setShowViewAllMatchesBanner(true), 420);
        } else {
          setShowViewAllMatchesBanner(false);
        }
      }
      window.history.replaceState({}, "", location.pathname + location.search);
    }, 160);

    return () => window.clearTimeout(timer);
  }, [location.pathname, location.search, location.state, activeTab]);

  useEffect(() => {
    if (!showViewAllMatchesBanner) return;

    const handleScroll = () => {
      const scrollTop = window.scrollY || window.pageYOffset || 0;
      if (scrollTop <= 140) {
        setShowViewAllMatchesBanner(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [showViewAllMatchesBanner]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY || window.pageYOffset || 0;
      const shouldShow = scrollTop > 420;
      setShowScrollTopBanner((current) => (current === shouldShow ? current : shouldShow));
      if (scrollTop <= 140) {
        setShowViewAllMatchesBanner(false);
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [activeTab]);

  const topBannerLabel = activeTab === "past" ? "View all Past Dates" : "View all matches above";
  const shouldShowTopBanner = showViewAllMatchesBanner || showScrollTopBanner;

  return (
    <>
      <div ref={pageTopRef} className="max-w-lg mx-auto px-4 py-6" data-testid="matches-page">
        <div className="mb-4">
          <h1 className="text-xl font-heading font-bold text-foreground">Matches</h1>
          <p className="text-xs font-body text-muted-foreground mb-4">{totalMatches} compatible {totalMatches === 1 ? "match" : "matches"}</p>

          <div className="grid grid-cols-2 gap-2.5">
            {[{ key: "new", label: "New Matches", testId: "matches-tab-new" }, { key: "pending", label: "First Dates", testId: "matches-tab-first-date" }, { key: "next", label: "The Next Dates", testId: "matches-tab-next-dates" }, { key: "past", label: "Past Dates & Feedback", testId: "matches-tab-past-feedback" }].map(({ key, label, testId }) => {
              const isActive = activeTab === key;
              const tabStyles = getTierTabStyles(tier, isActive);
              const hoverClass = isActive || tier !== "standard" ? "btn-hover-dark" : "btn-hover-light";
              return (
                <button
                  key={key}
                  onClick={() => setSearchParams(key === "new" ? {} : { tab: key })}
                  data-testid={testId}
                  className={`rounded-2xl px-2.5 py-2.5 min-h-[62px] inline-flex items-center justify-center gap-1.5 text-center transition-all border ${hoverClass}`}
                  style={tabStyles}
                >
                  <div className="inline-grid grid-cols-[auto_auto] items-center justify-center gap-x-1.5">
                    <span className="font-body font-semibold text-[13px] leading-[1.15] text-center">
                      {key === "past" ? (
                        <>
                          Past Dates &amp;
                          <br />
                          Feedback
                        </>
                      ) : (
                        label
                      )}
                    </span>
                    {tabCounts[key] > 0 ? (
                      <span className="self-center text-[10px] font-bold px-1.5 py-0.5 rounded-full border border-current/20">
                        {tabCounts[key]}
                      </span>
                    ) : (
                      <div />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {shouldShowTopBanner ? (
          <div className="fixed left-1/2 top-[72px] z-[40] flex -translate-x-1/2 justify-center px-4">
            <button
              type="button"
              onClick={() => {
                window.scrollTo({ top: 0, behavior: "smooth" });
                setShowViewAllMatchesBanner(false);
                setShowScrollTopBanner(false);
              }}
              className={`inline-flex min-w-[240px] items-center justify-center gap-2 rounded-full border border-border bg-card px-5 py-2 text-xs font-body text-foreground shadow-sm whitespace-nowrap ${tier === "standard" ? "btn-hover-light" : "btn-hover-dark"}`}
            >
              <ChevronUp className="w-3.5 h-3.5" />
              <span>{topBannerLabel}</span>
            </button>
          </div>
        ) : null}

        {activeTab === "new" && (
          newMatches.length ? (
            <div className="space-y-4">
              {newMatches.map((match, i) => (
                <motion.div key={match.uiKey || `${match.id}-${i}`} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                  <div
                    className="rounded-2xl border overflow-hidden bg-card"
                    style={{ borderColor: sharedCardBorder, background: cardStyles.background }}
                    data-testid="match-card"
                    data-match-card-id={match.id}
                  >
                    <Link
                      to={getMatchDetailRoute(location.pathname, match.id)}
                      state={{ fromMatchesTab: activeTab, fromMatchesIndex: i }}
                      className="flex items-center gap-4 p-4 block"
                    >
                      <div className="relative flex-shrink-0">
                        <img src={match.photoPath} alt={match.displayName} className="w-16 h-16 rounded-full object-cover" data-testid="match-photo" />
                        {match.verified && (
                          <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full flex items-center justify-center bg-primary">
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="text-primary-foreground"><polyline points="20 6 9 17 4 12" /></svg>
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-heading font-bold text-base" style={{ color: cardStyles.text }} data-testid="match-name">{nameAge(match)}</p>
                        <p className="text-xs font-body mt-0.5" style={{ color: cardStyles.muted }}>{match.locationLabel}</p>
                        <p className="text-[11px] font-body mt-1.5 leading-relaxed italic" style={{ color: cardStyles.summary }}>{match.oneLineVibe}</p>
                      </div>
                      {Number.isFinite(match.compatibilityScore) && (
                        <div data-testid="match-score"><CompatibilityScoreBadge score={match.compatibilityScore} size="sm" tier={tier} scoreColor={cardStyles.text} trackColor={cardStyles.badgeTrack} /></div>
                      )}
                    </Link>

                    <ProfileCompatibilityBanner
                      tier={tier}
                      backgroundOverride={tier === "concierge" ? "#0b0c0a" : undefined}
                      onClick={() => {
                        setBreakdownId(match.id);
                        setBreakdownMatch(match);
                        setBreakdownSourceIndex(i);
                        setBreakdownSourceTab(activeTab);
                      }}
                    />

                    <div className="px-0 py-0">
                      <button onClick={() => navigate(getBookDateRoute(location.pathname, match.id))} className="btn-hover-dark w-full px-4 py-2.5 rounded-none bg-primary text-primary-foreground transition-all active:scale-[0.98]">
                        <div className="grid grid-cols-[1fr_auto_1fr] items-center min-h-[20px]">
                          <div className="flex justify-end pr-2">
                            <Calendar className="w-4 h-4 flex-shrink-0" />
                          </div>
                          <p className="font-heading font-bold text-base leading-tight text-center">
                            Book a Date{tier === "standard" ? " — £9" : ""}
                          </p>
                          <div />
                        </div>
                      </button>
                    </div>
                    <UpgradeDateBanner tier={tier} centered bannerBackgroundOverride={tier === "concierge" ? "#0b0c0a" : null} />
                  </div>
                </motion.div>
              ))}
            </div>
          ) : <EmptyState title="No new matches" body="When someone you're interested in matches back, they'll appear here." />
        )}

        {activeTab === "pending" && (
          firstDateBooked.length ? (
            <div className="space-y-4">
              {firstDateBooked.map((match, i) => (
                <motion.div key={match.uiKey || `${match.id}-${i}`} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                  {(() => {
                    const isConfirmedDate = match.firstDateState === "confirmed";
                    return (
                  <div
                    className="rounded-2xl border overflow-hidden bg-card"
                    style={{ borderColor: sharedCardBorder, background: cardStyles.background }}
                    data-testid="match-card"
                  >
                    <Link
                      to={getMatchDetailRoute(location.pathname, match.id)}
                      state={{ fromMatchesTab: activeTab, fromMatchesIndex: i }}
                      className="p-4 flex items-center gap-4 text-left block"
                    >
                      <img src={match.photoPath} alt={match.displayName} className="w-16 h-16 rounded-full object-cover" data-testid="match-photo" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <p className="font-heading font-bold text-base" style={{ color: cardStyles.text }} data-testid="match-name">{nameAge(match)}</p>
                          <VerifiedBadge size="sm" />
                        </div>
                        <p className="text-xs font-body" style={{ color: cardStyles.muted }}>{match.locationLabel}</p>
                      </div>
                      {Number.isFinite(match.compatibilityScore) && (
                        <div data-testid="match-score"><CompatibilityScoreBadge score={match.compatibilityScore} size="sm" tier={tier} scoreColor={cardStyles.text} trackColor={cardStyles.badgeTrack} /></div>
                      )}
                    </Link>
                    <ProfileCompatibilityBanner
                      tier={tier}
                      backgroundOverride={tier === "concierge" ? "#0b0c0a" : undefined}
                      onClick={() => {
                        setBreakdownId(match.id);
                        setBreakdownMatch(match);
                        setBreakdownSourceIndex(i);
                        setBreakdownSourceTab(activeTab);
                      }}
                    />
                    <div className="px-4 py-2.5 border-t text-[11px] font-body text-center" style={stripStyles}>
                      <div className="grid grid-cols-[1fr_auto_1fr] items-center min-h-[18px]">
                        <div className="flex justify-end pr-2">
                          <Check className="w-3.5 h-3.5 flex-shrink-0" style={{ color: isConfirmedDate ? stripStyles.color : "transparent" }} />
                        </div>
                        <span className="leading-none whitespace-nowrap">{match.statusBannerText}</span>
                        <div />
                      </div>
                    </div>
                    {match.showDateDetails ? (
                      <DateDetailsAccordion
                        match={match}
                        stageLabel="1st Date"
                        tier={tier}
                        buttonBackgroundOverride={tier === "concierge" ? "#d0c7b4" : null}
                        buttonTextColorOverride={tier === "concierge" ? "#0b0c0a" : null}
                      />
                    ) : null}
                  </div>
                    );
                  })()}
                </motion.div>
              ))}
            </div>
          ) : <EmptyState title="No booked dates" body="Book your first date from new matches." />
        )}

        {activeTab === "next" && (
          <NextDatesTab
            tier={tier}
            matches={nextDates}
            sourceTab="next"
            onOpenBreakdown={(match, index) => {
              setBreakdownId(match.id);
              setBreakdownMatch(match);
              setBreakdownSourceIndex(index);
              setBreakdownSourceTab("next");
            }}
          />
        )}
        {activeTab === "past" && <PastDatesTab tier={tier} matches={pastDatesFeedback} sourceTab="past" />}
      </div>

      {breakdownId && (
        <CompatibilityBreakdown
          matchId={breakdownId}
          matchData={breakdownMatch}
          showProfileJumpButton={["new", "pending", "next"].includes(breakdownSourceTab || activeTab)}
          onBack={() => {
            if (["new", "pending", "next"].includes(breakdownSourceTab || activeTab) && Number.isFinite(breakdownSourceIndex) && breakdownSourceIndex > 0) {
              window.setTimeout(() => setShowViewAllMatchesBanner(true), 120);
            }
            setBreakdownId(null);
            setBreakdownMatch(null);
            setBreakdownSourceIndex(null);
            setBreakdownSourceTab(null);
          }}
          onBookDate={() => {
            navigate(getBookDateRoute(location.pathname, breakdownId));
            setBreakdownId(null);
            setBreakdownMatch(null);
            setBreakdownSourceIndex(null);
            setBreakdownSourceTab(null);
          }}
          onViewProfile={() => {
            navigate(getMatchDetailRoute(location.pathname, breakdownId), {
              state: {
                fromMatchesTab: breakdownSourceTab || activeTab,
                fromMatchesIndex: breakdownSourceIndex,
              },
            });
            setBreakdownId(null);
            setBreakdownMatch(null);
            setBreakdownSourceIndex(null);
            setBreakdownSourceTab(null);
          }}
        />
      )}
    </>
  );
}
