import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Heart, MapPin, ShieldCheck, Sparkles, X } from "lucide-react";
import { useCurrentDemoMatches } from "@/hooks/useCurrentDemoMatches";
import { useTier } from "@/hooks/useTier";
import { getDemoUserProfile } from "@/data/demo/demoUserProfiles";
import BackButton from "@/components/BackButton";
import CompatibilityScoreBadge from "@/components/CompatibilityScoreBadge";
import { projectInterestedProfiles } from "@/data/demo/interestedProfilesProjection";
import { setPendingDateBooking } from "@/data/demo/demoDateBookingState";
import { getCompatibilityBreakdownForMatch } from "@/data/demo/demoCompatibilityBreakdowns";
import { getCompatibilityTone } from "@/lib/compatibilityTone";
import { getZodiacCompatibility } from "@/data/demo/zodiacCompatibility";
import {
  OLD_STANDARD_INTERESTED_UNLOCK_KEY,
  STANDARD_INTERESTED_VISIBLE_CAP_KEY,
  STANDARD_INTERESTED_VISIBLE_CAP_KEY_V3,
  getInterestedVisibility,
  getScopedStandardInterestedPackKeyV5,
  normaliseStandardPack,
} from "@/utils/interestedUnlockVisibility";
import { getBookDateRoute, getMembershipRoute } from "@/lib/matchFlowRoutes";
import CompatibilityBreakdown from "@/components/CompatibilityBreakdown";
import { shouldEnableDevTools } from "@/components/dev/devToolsVisibility";

const PACKS = [
  { id: "pack-1", cap: 1, title: "Unlock 1 Match", each: "", total: "£3.99", save: "", detail: "Reveal 1 interested profile." },
  { id: "pack-3", cap: 3, title: "Unlock 3 matches", each: "£3.99 each", total: "£11.99", save: "", detail: "Reveal your top 3 interested profiles." },
  { id: "pack-12", cap: 12, title: "Unlock 12 matches", each: "£2.99 each", total: "£35.99", save: "Save 25%", detail: "Reveal up to 12 interested profiles." },
  { id: "pack-50", cap: 50, title: "Unlock 50 matches", each: "£1.99 each", total: "£99.99", save: "Save 50%", detail: "Reveal up to 50 interested profiles." },
];

const PREMIUM_BULLETS = [
  "See everyone who's interested in you",
  "15 stronger curated matches",
  "Advanced filters",
  "More visibility",
  "Chat and video call open 3 days before your date",
  "Premium date upgrades and venue suggestions",
];

const MODAL_TOKENS = {
  standard: {
    bg: "#f8f3f1",
    text: "#37423a",
    muted: "rgba(55,66,58,0.74)",
    surface: "rgba(212,210,205,0.42)",
    border: "rgba(55,66,58,0.22)",
    overlay: "rgba(10,13,10,0.55)",
    ctaBg: "#37423a",
    ctaText: "#f8f3f1",
    photoBorder: "rgba(55,66,58,0.22)",
    darkBanner: "#37423a",
    darkBannerText: "#f8f3f1",
  },
  premium: {
    bg: "#5b655d",
    text: "#f8f3f1",
    muted: "rgba(248,243,241,0.84)",
    surface: "rgba(55,66,58,0.44)",
    border: "rgba(248,243,241,0.24)",
    overlay: "rgba(10,13,10,0.62)",
    ctaBg: "#f8f3f1",
    ctaText: "#37423a",
    photoBorder: "rgba(248,243,241,0.32)",
    darkBanner: "#37423a",
    darkBannerText: "#f8f3f1",
  },
  concierge: {
    bg: "#0a0d0a",
    text: "#d8c6ae",
    muted: "rgba(216,198,174,0.82)",
    surface: "rgba(35,38,35,0.96)",
    border: "rgba(216,198,174,0.24)",
    overlay: "rgba(0,0,0,0.74)",
    ctaBg: "#d8c6ae",
    ctaText: "#0a0d0a",
    photoBorder: "rgba(216,198,174,0.34)",
    darkBanner: "#232623",
    darkBannerText: "#d8c6ae",
  },
};

const STANDARD_VARIANT_ORIENTATIONS = new Set(["gay", "straight", "bisexual", "lesbian", "trans_nonbinary", "queer", "pansexual", "fluid", "open_preference", "open-preference"]);

const ZODIAC_SYMBOLS = {
  Aries: "♈︎",
  Taurus: "♉︎",
  Gemini: "♊︎",
  Cancer: "♋︎",
  Leo: "♌︎",
  Virgo: "♍︎",
  Libra: "♎︎",
  Scorpio: "♏︎",
  Sagittarius: "♐︎",
  Capricorn: "♑︎",
  Aquarius: "♒︎",
  Pisces: "♓︎",
};

function cleanStarSignName(value = "") {
  return String(value).replace(/[♈-♓︎]/g, "").replace(/\s+/g, " ").trim();
}

function formatAstrologySubtitle(match, context) {
  const derived = getZodiacCompatibility(context?.birthDate || "1993-05-01", match?.birthDate || "1993-09-14");
  const userSign = cleanStarSignName(match?.starSignCompatibility?.userSign || derived.userSign);
  const matchSign = cleanStarSignName(match?.starSignCompatibility?.matchSign || match?.zodiac || derived.matchSign);
  const userSymbol = ZODIAC_SYMBOLS[userSign] || "";
  const matchSymbol = ZODIAC_SYMBOLS[matchSign] || "";

  if (userSign && matchSign) {
    return `${userSymbol ? `${userSymbol} ` : ""}${userSign} + ${matchSymbol ? `${matchSymbol} ` : ""}${matchSign}`;
  }
  return "Astrology alignment";
}

function getStarSignMarker(match, context) {
  const summary = match?.starSignCompatibility?.summary || "";
  const combined = `${match?.starSignCompatibility?.userSign || ""} ${match?.starSignCompatibility?.matchSign || ""} ${summary}`.toLowerCase();
  let score = 72;
  if (combined.includes("high")) score = 92;
  else if (combined.includes("medium")) score = 82;
  return {
    title: "Astrology Alignment Insights",
    subtitle: formatAstrologySubtitle(match, context),
    summary: summary || "Astrological signals suggest an easy conversational flow.",
    score,
  };
}

function buildMarkerSet(match, context) {
  const breakdown = getCompatibilityBreakdownForMatch(match, context);
  const markers = (breakdown?.markers || []).map((item) => ({
    title: item.title,
    subtitle: item.subtitle || "Compatibility signal",
    summary: item.summary,
    score: item.score,
  }));
  return [...markers, getStarSignMarker(match, context)];
}

function ProfilePreviewModal({ match, tier, onPass, onInterested, context }) {
  const tokens = MODAL_TOKENS[tier] || MODAL_TOKENS.standard;
  const markerSet = buildMarkerSet(match, context);
  const insight = markerSet[0]?.summary || match?.compatibilityBreakdown?.overallRead || "There is meaningful potential here with clear real-world compatibility signals.";
  return (
    <div className="interested-date-modal-overlay" style={{ "--interested-modal-overlay-bg": tokens.overlay }} onClick={(e) => e.target === e.currentTarget && onPass()}>
      <div
        className="interested-preview-modal"
        style={{
          "--interested-modal-bg": tokens.bg,
          "--interested-modal-text": tokens.text,
          "--interested-modal-muted": tokens.muted,
          "--interested-modal-surface": tokens.surface,
          "--interested-modal-border": tokens.border,
        }}
      >
        <div className="interested-preview-imageWrap">
          <img src={match?.photoPath} alt={match?.displayName} className="interested-preview-image" />
        </div>
        <div className="interested-preview-content">
          <div className="interested-preview-meta">
            <div>
              <p className="font-heading font-bold text-2xl">{match?.displayName}, {match?.age}</p>
              <p className="text-sm font-body mt-1 flex items-center gap-1"><ShieldCheck size={15} /> Verified</p>
              <p className="text-sm font-body mt-1 flex items-center gap-1"><MapPin size={15} /> {match?.distanceLabel || match?.location}</p>
            </div>
            <CompatibilityScoreBadge
              score={Number(match?.compatibilityScore) || 65}
              size="md"
              tier={tier}
              scoreColor={tokens.text}
              trackColor={tokens.border}
            />
          </div>
          <div className="interested-preview-insight">
            <p className="interested-preview-insight-label">Tether match insight</p>
            <p className="interested-preview-insight-title">Why we think this is a strong fit</p>
            <p className="interested-preview-insight-copy">{insight}</p>
          </div>
          <div className="interested-preview-actions">
            <button type="button" className="interested-preview-pass btn-hover-light" onClick={onPass}>Pass</button>
            <button type="button" className="interested-preview-interested btn-hover-dark" onClick={onInterested}><Heart size={18} /> Interested</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function getInterestedListTheme(tier = "standard") {
  if (tier === "premium") {
    return {
      cardBg: "#5b655d",
      border: "rgba(248,243,241,0.28)",
      text: "#f8f3f1",
      muted: "rgba(248,243,241,0.78)",
      badgeTrack: "rgba(248,243,241,0.20)",
    };
  }
  if (tier === "concierge") {
    return {
      cardBg: "#232623",
      border: "rgba(216,198,174,0.28)",
      text: "#d8c6ae",
      muted: "rgba(216,198,174,0.78)",
      badgeTrack: "rgba(216,198,174,0.20)",
    };
  }
  return {
    cardBg: "hsl(var(--card))",
    border: "hsl(var(--border))",
    text: "hsl(var(--foreground))",
    muted: "hsl(var(--muted-foreground))",
    badgeTrack: "rgba(55,66,58,0.18)",
  };
}

function DateConfirmationModal({
  match,
  tier = "standard",
  user,
  context,
  onClose,
  onBook,
}) {
  const modalRef = useRef(null);
  const closeRef = useRef(null);
  const restoreRef = useRef(null);
  const tokens = MODAL_TOKENS[tier] || MODAL_TOKENS.standard;
  const summaryItems = buildMarkerSet(match, context);
  const userFirstName = String(user?.displayName || "You").split(" ")[0];
  const matchFirstName = String(match?.displayName || "Match").split(" ")[0];
  const titleUserName = userFirstName && userFirstName.toLowerCase() !== "you" ? userFirstName : "You";
  const titleMatchName = matchFirstName || "Match";

  useEffect(() => {
    restoreRef.current = document.activeElement;
    closeRef.current?.focus();
    const keyHandler = (event) => {
      if (event.key === "Escape") onClose();
      if (event.key === "Tab" && modalRef.current) {
        const focusables = modalRef.current.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        if (!focusables.length) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", keyHandler);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", keyHandler);
      if (restoreRef.current && typeof restoreRef.current.focus === "function") {
        restoreRef.current.focus();
      }
    };
  }, [onClose]);

  return (
    <div
      className="interested-date-modal-overlay"
      data-testid="interested-date-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="interested-date-modal-title"
      style={{ "--interested-modal-overlay-bg": tokens.overlay }}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        ref={modalRef}
        className="interested-date-modal"
        style={{
          "--interested-modal-bg": tokens.bg,
          "--interested-modal-text": tokens.text,
          "--interested-modal-muted": tokens.muted,
          "--interested-modal-surface": tokens.surface,
          "--interested-modal-border": tokens.border,
          "--modal-photo-border": tokens.photoBorder,
          "--modal-cta-bg": tokens.ctaBg,
          "--modal-cta-text": tokens.ctaText,
          "--interested-modal-dark-banner": tokens.darkBanner,
          "--interested-modal-dark-banner-text": tokens.darkBannerText,
        }}
      >
        <button ref={closeRef} type="button" className="interested-date-modal-close" data-testid="interested-date-modal-close" aria-label="Close date confirmation" onClick={onClose}>
          <X size={20} />
        </button>

        <div className="interested-date-modal-scroll">
          <div className="interested-date-modal-photos">
            <div className="interested-date-modal-photoCard interested-date-modal-photoCard--user">
              <img src={user?.photoSet?.[0] || user?.photoPath} alt={user?.displayName || "You"} data-testid="interested-date-modal-user-photo" />
            </div>
            <div className="interested-date-modal-photoCard interested-date-modal-photoCard--match">
              <img src={match?.photoPath} alt={match?.displayName || "Match"} data-testid="interested-date-modal-match-photo" />
            </div>
          </div>

          <h2 id="interested-date-modal-title" className="interested-date-modal-title" data-testid="interested-date-modal-title">
            <span className="interested-date-modal-title-names">{titleUserName}</span>
            <span className="interested-date-modal-title-amp">&amp;</span>
            <span className="interested-date-modal-title-names">{titleMatchName}</span>
            <span className="interested-date-modal-title-sub">are going on a date!</span>
            <span className="interested-date-modal-title-divider interested-date-modal-title-divider--below" />
          </h2>

          <div className="interested-date-modal-summary" data-testid="interested-date-modal-summary">
            <div className="interested-date-modal-summary-inlineHead">
              <Sparkles size={18} />
              <p className="interested-date-modal-summary-title">Why we think this is a good match</p>
            </div>
            <div className="interested-date-modal-markers">
            {summaryItems.map((item) => {
              const markerScore = Number(item.score) || 65;
              const tone = getCompatibilityTone(markerScore, tier, "dark");
              const modalScoreColor = tone.text;
              const modalTrackColor = tone.track;
              return (
                <div key={`${item.title}-${item.score}`} className="interested-date-modal-marker" data-testid="interested-date-modal-marker">
                  <div className="interested-date-modal-marker-head">
                    <div className="interested-date-modal-marker-head-meta">
                      <div className="interested-date-modal-marker-copy">
                        <p>{item.title}</p>
                        <p className="interested-date-modal-marker-subtitle">{item.subtitle}</p>
                      </div>
                      <CompatibilityScoreBadge score={markerScore} size="sm" tier={tier} scoreColor={modalScoreColor} trackColor={modalTrackColor} />
                    </div>
                  </div>
                    <div className="interested-date-modal-marker-body">
                      <p className="interested-date-modal-marker-summary">{item.summary}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="interested-date-modal-footer">
          <button type="button" className="interested-date-modal-primary btn-hover-dark" data-testid="interested-date-modal-click-to-book" onClick={onBook}>
            Click to book your date
          </button>
          <button type="button" className="interested-date-modal-secondary btn-hover-light" data-testid="interested-date-modal-not-now" onClick={onClose}>
            Not now
          </button>
        </div>
      </div>
    </div>
  );
}

export default function InterestedInYou() {
  const location = useLocation();
  const navigate = useNavigate();
  const { tier } = useTier();
  const { context, matches, setContext } = useCurrentDemoMatches("interested");
  const effectiveTier = tier || context.membershipTier || "standard";
  const isStandard = effectiveTier === "standard";
  const [confirmedPack, setConfirmedPack] = useState(null);
  const [pendingPack, setPendingPack] = useState(null);
  const [showOptions, setShowOptions] = useState(true);
  const [notice, setNotice] = useState("");
  const showDevButton = shouldEnableDevTools(location.pathname);
  const [previewInterestedMatch, setPreviewInterestedMatch] = useState(null);
  const [selectedInterestedMatch, setSelectedInterestedMatch] = useState(null);

  const stableContext = useMemo(() => ({ ...context, membershipTier: effectiveTier }), [context, effectiveTier]);
  const interestedListTheme = useMemo(() => getInterestedListTheme(effectiveTier), [effectiveTier]);
  const isStandardVariant = isStandard && STANDARD_VARIANT_ORIENTATIONS.has(String(stableContext?.sexualPreference || "").toLowerCase());
  const useBreakdownPreview = isStandardVariant || effectiveTier === "concierge";
  const demoUser = useMemo(() => getDemoUserProfile(stableContext), [stableContext]);
  const packKey = useMemo(() => getScopedStandardInterestedPackKeyV5(stableContext), [stableContext]);

  useEffect(() => {
    if (context.membershipTier !== effectiveTier) setContext({ membershipTier: effectiveTier });
  }, [context.membershipTier, effectiveTier, setContext]);

  useEffect(() => {
    if (!isStandard || typeof window === "undefined") return;
    try {
      localStorage.removeItem(OLD_STANDARD_INTERESTED_UNLOCK_KEY);
      localStorage.removeItem(STANDARD_INTERESTED_VISIBLE_CAP_KEY);
      Object.keys(localStorage).forEach((key) => {
        if (
          key.startsWith(`${STANDARD_INTERESTED_VISIBLE_CAP_KEY}:`) ||
          key.startsWith(`${STANDARD_INTERESTED_VISIBLE_CAP_KEY_V3}:`) ||
          key.startsWith("tetherStandardInterestedPackV4:")
        ) {
          localStorage.removeItem(key);
        }
      });
      setConfirmedPack(normaliseStandardPack(localStorage.getItem(packKey)));
    } catch {
      setConfirmedPack(null);
    }
  }, [isStandard, packKey]);

  useEffect(() => {
    if (!isStandard) return;
    const fromUnlock = location.state?.entry === "standard_unlock_cta" || new URLSearchParams(location.search).get("entry") === "unlock";
    if (fromUnlock) setShowOptions(true);
  }, [isStandard, location.search, location.state]);

  const interestedProfiles = useMemo(
    () => projectInterestedProfiles(matches || [], stableContext, effectiveTier),
    [matches, stableContext, effectiveTier],
  );

  const visibleData = useMemo(() => {
    if (!isStandard) return getInterestedVisibility(interestedProfiles, effectiveTier === "concierge" ? 5 : 15);
    if (!confirmedPack) return { visibleProfiles: [], hiddenProfiles: interestedProfiles, hiddenCount: interestedProfiles.length };
    return getInterestedVisibility(interestedProfiles, confirmedPack);
  }, [isStandard, interestedProfiles, confirmedPack, effectiveTier]);

  const hiddenCount = visibleData.hiddenCount ?? visibleData.hiddenProfiles.length;

  const confirmUnlock = () => {
    if (!pendingPack || typeof window === "undefined") return;
    const nextPack = Math.max(confirmedPack || 0, pendingPack.cap);
    try {
      localStorage.setItem(packKey, String(nextPack));
    } catch {}
    setConfirmedPack(nextPack);
    setPendingPack(null);
    setShowOptions(false);
    const nextView = getInterestedVisibility(interestedProfiles, nextPack);
    setNotice(
      nextView.hiddenCount > 0
        ? `Unlocked. You can now view up to ${nextPack} interested profiles. ${nextView.hiddenCount} profiles remain hidden.`
        : `Unlocked. You can now view up to ${nextPack} interested profiles. You’re seeing all available interested profiles.`,
    );
  };

  const openPreview = (match) => setPreviewInterestedMatch(match);
  const closePreview = () => setPreviewInterestedMatch(null);
  const movePreviewToConfirmation = () => {
    if (!previewInterestedMatch) return;
    setSelectedInterestedMatch(previewInterestedMatch);
    setPreviewInterestedMatch(null);
  };
  const closeDateModal = () => setSelectedInterestedMatch(null);
  const handleClickToBookDate = () => {
    if (!selectedInterestedMatch) return;
    setPendingDateBooking(selectedInterestedMatch.id, "interested-in-you", {
      membershipTier: effectiveTier,
      sexualPreference: stableContext.sexualPreference,
    });
    setSelectedInterestedMatch(null);
    navigate(`${getBookDateRoute(location.pathname, selectedInterestedMatch.id)}?source=interested-in-you`, {
      state: { source: "interested-in-you", matchId: selectedInterestedMatch.id, openBooking: true },
    });
  };

  if (!isStandard) {
    return (
      <div className="max-w-lg mx-auto min-h-screen bg-background px-4 py-6">
        <div className="flex items-center gap-2 mb-4">
          <BackButton />
          <h1 className="font-heading font-bold text-xl">Interested In You</h1>
        </div>
        <div className="space-y-3">
          {visibleData.visibleProfiles.map((m) => (
            <button
              key={m.id}
              onClick={() => openPreview(m)}
              className="btn-hover-light w-full rounded-2xl border p-3 flex items-center gap-3 text-left"
              style={{ background: interestedListTheme.cardBg, borderColor: interestedListTheme.border }}
              data-testid="interested-profile-card"
              data-profile-testid={`interested-profile-card-${m.id}`}
            >
              <img src={m.photoPath} alt={m.displayName} className="w-14 h-14 rounded-full object-cover" />
              <div className="flex-1">
                <p className="font-heading font-bold text-base" style={{ color: interestedListTheme.text }}>{m.displayName}, {m.age}</p>
                <p className="text-xs font-body" style={{ color: interestedListTheme.muted }}>{m.distanceLabel || m.location}</p>
              </div>
              <CompatibilityScoreBadge score={m.compatibilityScore} size="sm" tier={effectiveTier} scoreColor={interestedListTheme.text} trackColor={interestedListTheme.badgeTrack} />
            </button>
          ))}
        </div>
        {previewInterestedMatch && !useBreakdownPreview ? (
          <ProfilePreviewModal
            match={previewInterestedMatch}
            tier={effectiveTier}
            context={stableContext}
            onPass={closePreview}
            onInterested={movePreviewToConfirmation}
          />
        ) : null}
        {previewInterestedMatch && useBreakdownPreview ? (
          <CompatibilityBreakdown
            matchData={previewInterestedMatch}
            onBack={closePreview}
            tier={effectiveTier}
            showCompatibility={false}
            headerTitle="Profile"
            secondaryActionLabel="Pass"
            onSecondaryAction={closePreview}
            primaryActionLabel="Interested"
            onPrimaryAction={movePreviewToConfirmation}
          />
        ) : null}
        {selectedInterestedMatch ? (
          <DateConfirmationModal
            match={selectedInterestedMatch}
            user={demoUser}
            context={stableContext}
            tier={effectiveTier}
            onClose={closeDateModal}
            onBook={handleClickToBookDate}
          />
        ) : null}
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto min-h-screen bg-background px-4 py-6" data-testid="standard-interested-page">
      <div className="flex items-center gap-2 mb-4">
        <BackButton />
        <h1 className="font-heading font-bold text-xl">Interested In You</h1>
      </div>

      {showOptions ? (
        <div className="space-y-3" data-testid="standard-interested-unlock-options">
          <div className="rounded-2xl border border-border bg-card p-4" data-testid="interested-unlock-summary">
            <p className="font-heading font-bold text-lg">Unlock Who's Interested In You</p>
            <p className="mt-1 text-sm font-body text-muted-foreground">
              See who already likes you. Unlock interested profiles as you go, or upgrade to Premium to see more of who&apos;s interested.
            </p>
            <p className="mt-2 text-xs font-body text-muted-foreground">You have {interestedProfiles.length} interested profiles waiting.</p>
          </div>

          <div className="rounded-xl border overflow-hidden" style={{ background: "#5b655d", borderColor: "rgba(55, 66, 58, 0.28)" }} data-testid="premium-upgrade-banner">
            <div className="w-full px-3 py-2.5 text-center" style={{ background: "#37423a", color: "#f8f3f1" }}>
              <p className="font-heading font-bold text-lg leading-tight">Upgrade to Premium</p>
            </div>
            <div className="px-3 py-3 text-center">
              <p className="font-heading font-bold text-lg mt-0.5" style={{ color: "#f8f3f1" }}>£50/month</p>
              <div className="mt-2 space-y-1">
                {PREMIUM_BULLETS.map((item) => (
                  <p key={item} className="text-[11px] font-body text-left" style={{ color: "rgba(248, 243, 241, 0.92)" }}>• {item}</p>
                ))}
              </div>
              <button
                type="button"
                onClick={() => navigate(`${getMembershipRoute(location.pathname)}?from=interested-in-you&plan=premium`, { state: { from: "interested-in-you", plan: "premium" } })}
                className="btn-hover-mid-strong w-full mt-3 rounded-xl border px-3 py-2 text-center"
                style={{ background: "#f8f3f1", borderColor: "#f8f3f1", color: "#37423a" }}
              >
                <p className="text-xs font-body font-semibold">Upgrade to Premium</p>
              </button>
            </div>
          </div>

          {PACKS.map((pack) => {
            const isCurrent = confirmedPack === pack.cap;
            const isLockedByHigher = confirmedPack && confirmedPack > pack.cap;
            const isPending = pendingPack?.cap === pack.cap;
            const isActive = isCurrent || isPending;
            return (
              <button
                key={pack.id}
                type="button"
                onClick={() => {
                  if (isCurrent || isLockedByHigher) return;
                  setPendingPack(pack);
                  setNotice("");
                }}
                className={`w-full rounded-xl border px-3 py-2 text-left ${isActive ? "btn-hover-dark" : "btn-hover-mid-strong"}`}
                style={isActive
                  ? { background: "#37423a", borderColor: "#37423a", color: "#f8f3f1", opacity: 1 }
                  : { background: "rgba(55, 66, 58, 0.08)", borderColor: "rgba(55, 66, 58, 0.28)", color: "#37423a" }}
                disabled={isCurrent || isLockedByHigher}
                data-testid={
                  pack.cap === 1
                    ? "unlock-pack-1"
                    : pack.cap === 3
                      ? "unlock-pack-3"
                      : pack.cap === 12
                        ? "unlock-pack-12"
                        : "unlock-pack-50"
                }
              >
                <div className="flex items-center gap-2">
                  <p className="text-lg font-heading font-bold leading-tight flex-1">{pack.title} - {pack.total}</p>
                  {isCurrent ? (
                    <span
                      className="inline-flex items-center justify-center rounded-full border px-2 py-0.5 text-[11px] font-body font-semibold"
                      style={isActive
                        ? { borderColor: "rgba(248, 243, 241, 0.6)", color: "#f8f3f1" }
                        : { borderColor: "rgba(55, 66, 58, 0.35)", color: "#37423a" }}
                    >
                      Current
                    </span>
                  ) : null}
                </div>
                {pack.each ? <p className="text-xs font-body opacity-90" data-testid="unlock-pack-price-each">{pack.each}</p> : null}
                {pack.save ? <p className="text-[11px] font-body mt-0.5 opacity-95" data-testid="unlock-pack-save-badge">{pack.save}</p> : null}
                <p className="text-xs font-body mt-1 opacity-90">{pack.detail}</p>
              </button>
            );
          })}

          {confirmedPack === 50 ? (
            <div className="rounded-xl border px-3 py-2 text-xs font-body" style={{ background: "rgba(55, 66, 58, 0.08)", borderColor: "rgba(55, 66, 58, 0.24)", color: "#37423a" }}>
              You&apos;re seeing all available interested profiles in this demo.
            </div>
          ) : null}

          {pendingPack ? (
            <div className="rounded-xl border px-3 py-3" style={{ background: "rgba(55, 66, 58, 0.08)", borderColor: "rgba(55, 66, 58, 0.26)" }} data-testid="unlock-confirmation">
              <p className="font-heading font-bold text-lg leading-tight" style={{ color: "#37423a" }}>{pendingPack.title}?</p>
              <p className="text-xs font-body mt-1" style={{ color: "rgba(55, 66, 58, 0.78)" }}>
                {pendingPack.cap === 1 && `This will reveal 1 interested profile. You'll still have ${Math.max(0, interestedProfiles.length - 1)} hidden profiles available to unlock later.`}
                {pendingPack.cap === 3 && `This will reveal your top 3 interested profiles. You'll still have ${Math.max(0, interestedProfiles.length - 3)} hidden profiles available to unlock later.`}
                {pendingPack.cap === 12 && "This will reveal up to 12 interested profiles."}
                {pendingPack.cap === 50 && "This will reveal up to 50 interested profiles."}
              </p>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <button type="button" onClick={confirmUnlock} className="btn-hover-dark rounded-xl px-3 py-2 text-xs font-body font-semibold" style={{ background: "#37423a", color: "#f8f3f1" }} data-testid="confirm-unlock">
                  Confirm unlock
                </button>
                <button type="button" onClick={() => setPendingPack(null)} className="btn-hover-mid-strong rounded-xl border px-3 py-2 text-xs font-body font-semibold" style={{ borderColor: "rgba(55, 66, 58, 0.28)", color: "#37423a" }} data-testid="cancel-unlock">
                  Cancel
                </button>
              </div>
            </div>
          ) : null}

          {showDevButton ? (
            <div className="rounded-lg border px-3 py-2" style={{ background: "rgba(55, 66, 58, 0.04)", borderColor: "rgba(55, 66, 58, 0.16)" }}>
              <button
                type="button"
                onClick={() => {
                  try {
                    Object.keys(localStorage).forEach((key) => {
                      if (key.startsWith("tetherStandardInterestedPackV5:")) localStorage.removeItem(key);
                    });
                  } catch {}
                  setConfirmedPack(null);
                  setPendingPack(null);
                  setNotice("Reset demo unlock.");
                }}
                className="btn-hover-mid-strong rounded-lg border px-2 py-1 text-[11px] font-body"
                style={{ borderColor: "rgba(55,66,58,0.24)", color: "#37423a" }}
                data-testid="standard-unlock-reset-demo"
              >
                Reset demo unlock
              </button>
            </div>
          ) : null}
        </div>
      ) : (
        <div data-testid="standard-interested-results">
          {notice ? (
            <div className="rounded-xl border px-3 py-2 text-xs font-body mb-3" style={{ background: "rgba(55, 66, 58, 0.08)", borderColor: "rgba(55, 66, 58, 0.26)", color: "#37423a" }} data-testid="unlock-success-banner">
              {notice}
            </div>
          ) : null}

          <div className="space-y-3">
            {visibleData.visibleProfiles.map((m) => (
              <button
                key={m.id}
                onClick={() => openPreview(m)}
                className="btn-hover-light w-full rounded-2xl border border-border bg-card p-3 flex items-center gap-3 text-left"
                data-testid="interested-profile-card"
                data-profile-testid={`interested-profile-card-${m.id}`}
              >
                <img src={m.photoPath} alt={m.displayName} className="w-14 h-14 rounded-full object-cover" />
                <div className="flex-1">
                  <p className="font-heading font-bold text-base">{m.displayName}, {m.age}</p>
                  <p className="text-xs font-body text-muted-foreground">{m.distanceLabel || m.location}</p>
                </div>
                <div data-testid="standard-interested-score">
                  <CompatibilityScoreBadge score={m.compatibilityScore} size="sm" tier="standard" />
                </div>
              </button>
            ))}
          </div>

          {hiddenCount > 0 ? (
            <div className="mt-4 rounded-xl border px-3 py-3 text-center" style={{ background: "rgba(55, 66, 58, 0.06)", borderColor: "rgba(55, 66, 58, 0.20)" }} data-testid="locked-profile-banner">
              <p className="font-heading font-bold text-lg" style={{ color: "#37423a" }}>{hiddenCount} more interested profiles</p>
              <p className="text-sm font-body mt-1" style={{ color: "rgba(55, 66, 58, 0.74)" }}>
                Unlock more profiles or upgrade to Premium to see everyone who&apos;s interested.
              </p>
              <div className="mt-2 space-y-1">
                {Array.from({ length: Math.min(hiddenCount, 3) }).map((_, i) => (
                  <div key={i} className="rounded-lg border px-2 py-1 text-[11px] font-body" style={{ borderColor: "rgba(55, 66, 58, 0.18)", color: "rgba(55, 66, 58, 0.7)" }} data-testid="locked-profile-placeholder">
                    Locked profile · Compatibility hidden · Area hidden
                  </div>
                ))}
              </div>
              <button type="button" className="btn-hover-dark mt-3 rounded-xl px-3 py-2 text-xs font-body font-semibold" style={{ background: "#37423a", color: "#f8f3f1" }} onClick={() => setShowOptions(true)} data-testid="unlock-more-interested-profiles">
                Unlock more interested profiles
              </button>
            </div>
          ) : null}
        </div>
      )}

      {previewInterestedMatch && !isStandardVariant ? (
        <ProfilePreviewModal
          match={previewInterestedMatch}
          tier={effectiveTier}
          context={stableContext}
          onPass={closePreview}
          onInterested={movePreviewToConfirmation}
        />
      ) : null}
      {previewInterestedMatch && isStandardVariant ? (
        <CompatibilityBreakdown
          matchData={previewInterestedMatch}
          onBack={closePreview}
          showCompatibility={false}
          headerTitle="Profile"
          secondaryActionLabel="Pass"
          onSecondaryAction={closePreview}
          primaryActionLabel="Interested"
          onPrimaryAction={movePreviewToConfirmation}
        />
      ) : null}
      {selectedInterestedMatch ? (
        <DateConfirmationModal
          match={selectedInterestedMatch}
          user={demoUser}
          context={stableContext}
          tier={effectiveTier}
          onClose={closeDateModal}
          onBook={handleClickToBookDate}
        />
      ) : null}
    </div>
  );
}
