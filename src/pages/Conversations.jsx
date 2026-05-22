import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { ChevronUp, MessageCircle, Lock, Video } from "lucide-react";
import { motion } from "framer-motion";
import { useTier } from "../hooks/useTier";
import { useCurrentDemoMatches } from "@/hooks/useCurrentDemoMatches";
import CompatibilityScoreBadge from "@/components/CompatibilityScoreBadge";
import { MATCHES_REFERENCE } from "@/constants/matchesReference";
import { getChatRoute, getVideoCallRoute } from "@/lib/matchFlowRoutes";

function getUnlockThreshold(tier) {
  if (tier === "concierge") return 168; // 1 week
  if (tier === "premium") return 72;    // 72 hours
  return 24;                            // Core: 24 hours
}

function formatTimeUntil(hours) {
  if (hours < 1) return "less than an hour";
  if (hours < 24) return `${Math.round(hours)} hours`;
  const days = Math.round(hours / 24);
  return `${days} day${days > 1 ? "s" : ""}`;
}

function getConversationListTheme(tier = "standard") {
  if (tier === "premium") {
    return {
      cardBg: "#5b655d",
      cardBorder: "rgba(248,243,241,0.28)",
      divider: "rgba(248,243,241,0.22)",
      primaryText: "#f8f3f1",
      secondaryText: "rgba(248,243,241,0.78)",
      mutedText: "rgba(248,243,241,0.72)",
      badgeBorder: "rgba(248,243,241,0.38)",
      openBadgeBg: "rgba(248,243,241,0.12)",
      openBadgeText: "#f8f3f1",
      actionBg: "#737973",
      actionBorder: "rgba(248,243,241,0.22)",
      buttonBg: "#f8f3f1",
      buttonText: "#37423a",
      buttonSecondaryBg: "#5b655d",
      buttonSecondaryText: "#f8f3f1",
      lockBg: "#737973",
      lockBorder: "rgba(248,243,241,0.22)",
      badgeTrack: "rgba(248,243,241,0.20)",
    };
  }
  if (tier === "concierge") {
    return {
      cardBg: "#232623",
      cardBorder: "rgba(216,198,174,0.28)",
      divider: "rgba(216,198,174,0.22)",
      primaryText: "#d8c6ae",
      secondaryText: "rgba(216,198,174,0.74)",
      mutedText: "rgba(216,198,174,0.72)",
      badgeBorder: "rgba(216,198,174,0.4)",
      openBadgeBg: "rgba(216,198,174,0.12)",
      openBadgeText: "#d8c6ae",
      actionBg: "#232623",
      actionBorder: "rgba(216,198,174,0.22)",
      buttonBg: "#d8c6ae",
      buttonText: "#0a0d0a",
      buttonSecondaryBg: "#232623",
      buttonSecondaryText: "#d8c6ae",
      lockBg: "#232623",
      lockBorder: "rgba(216,198,174,0.22)",
      badgeTrack: "rgba(216,198,174,0.20)",
    };
  }
  return {
    cardBg: "hsl(var(--card))",
    cardBorder: "hsl(var(--primary))",
    divider: "hsl(var(--border))",
    primaryText: "hsl(var(--foreground))",
    secondaryText: "hsl(var(--muted-foreground))",
    mutedText: "hsl(var(--primary-foreground))",
    badgeBorder: "rgba(55,66,58,0.35)",
    openBadgeBg: "rgba(55,66,58,0.08)",
    openBadgeText: "#37423a",
    actionBg: "#DAD7D3",
    actionBorder: "transparent",
    buttonBg: "hsl(var(--primary))",
    buttonText: "hsl(var(--primary-foreground))",
    buttonSecondaryBg: "hsl(var(--primary))",
    buttonSecondaryText: "hsl(var(--primary-foreground))",
    lockBg: "hsl(var(--secondary))",
    lockBorder: "hsl(var(--border))",
    badgeTrack: "rgba(55,66,58,0.18)",
  };
}

export default function Conversations() {
  const navigate = useNavigate();
  const { tier } = useTier();
  const { matches } = useCurrentDemoMatches("conversations");
  const [showScrollTopBanner, setShowScrollTopBanner] = useState(false);
  const conversationTheme = getConversationListTheme(tier);
  const threshold = getUnlockThreshold(tier);
  const demoChats = (matches || []).map((m, i) => ({
    id: m.id,
    name: m.displayName,
    age: m.age,
    location: (m.location || "London").split(",")[0],
    photo: m.photoPath,
    verified: true,
    score: m.compatibilityScore,
    venue: m.firstDateSuggestion?.venueName || "Barrafina",
    date: i % 2 ? "Friday, 7:30 PM" : "Tomorrow, 7:00 PM",
    hoursUntil: 8 + i * 12,
  }));

  const unlockLabel = { concierge: "1 week before your date", premium: "72 hours before your date", standard: "24 hours before your date" }[tier] || "24 hours before your date";

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
    <div className="max-w-lg mx-auto px-4 py-6" data-testid="chat-list-page">
      {showScrollTopBanner ? (
        <div className="fixed left-1/2 top-[72px] z-[40] flex -translate-x-1/2 justify-center px-4">
          <button
            type="button"
            onClick={() => {
              window.scrollTo({ top: 0, behavior: "smooth" });
              setShowScrollTopBanner(false);
            }}
            className={`inline-flex min-w-[240px] items-center justify-center gap-2 rounded-full border border-border bg-card px-5 py-2 text-xs font-body text-foreground shadow-sm whitespace-nowrap ${tier === "standard" ? "btn-hover-light" : "btn-hover-dark"}`}
          >
            <ChevronUp className="w-3.5 h-3.5" />
            <span>View all chats above</span>
          </button>
        </div>
      ) : null}
      {/* Header */}
      <div className="mb-5">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-heading font-bold">Chat</h1>
        </div>
        <p className="text-xs text-muted-foreground mt-1">Chat and video call open {unlockLabel}</p>
      </div>

      <div className="space-y-3">
        {demoChats.map((chat, i) => {
          const isUnlocked = chat.hoursUntil <= threshold;
          const timeStr = formatTimeUntil(chat.hoursUntil);

          return (
            <motion.div key={chat.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
              <div
                className="rounded-2xl border overflow-hidden"
                style={{ opacity: isUnlocked ? 1 : 0.92, borderColor: conversationTheme.cardBorder, background: conversationTheme.cardBg }}
                data-testid="chat-profile-card"
              >
                {/* Profile row */}
                <div className="flex items-center gap-4 p-4">
                  <div className="relative flex-shrink-0">
                    <img
                      src={chat.photo}
                      alt={chat.name}
                      className={`w-16 h-16 rounded-full object-cover ${!isUnlocked ? "grayscale opacity-70" : ""}`}
                    />
                    {isUnlocked && (
                      <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-green-500 border-2 border-card" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className={MATCHES_REFERENCE.primaryTextClass}>{chat.name}, {chat.age}</span>
                      {chat.verified && (
                        <div className="w-4 h-4 rounded-full flex items-center justify-center" style={{ border: `1px solid ${conversationTheme.badgeBorder}`, background: conversationTheme.actionBg }}>
                          <svg width="7" height="7" viewBox="0 0 24 24" fill="none" stroke="currentColor" style={{ color: conversationTheme.primaryText }} strokeWidth="3.5"><polyline points="20 6 9 17 4 12" /></svg>
                        </div>
                      )}
                      {isUnlocked && <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full border" style={{ background: conversationTheme.openBadgeBg, color: conversationTheme.openBadgeText, borderColor: conversationTheme.badgeBorder }}>Open</span>}
                    </div>
                    <p className="truncate mt-0.5 text-xs font-body" style={{ color: conversationTheme.secondaryText }}>{chat.venue} · {chat.date}</p>
                  </div>
                  <div className="flex-shrink-0">
                    <CompatibilityScoreBadge
                      score={chat.score}
                      size="sm"
                      tier={tier}
                      scoreColor={conversationTheme.primaryText}
                      trackColor={conversationTheme.badgeTrack}
                    />
                  </div>
                </div>

                {/* Status / actions */}
                {isUnlocked ? (
                  <div className="px-4 pb-4 pt-3 flex gap-2 border-t" style={{ borderColor: conversationTheme.divider, background: conversationTheme.actionBg }}>
                    <button
                      onClick={() => navigate(getChatRoute(window.location.pathname, chat.id))}
                      data-testid="chat-open-button"
                      className="btn-hover-light flex-1 min-h-[42px] flex items-center justify-center gap-2 px-3 py-2 rounded-xl border transition-all active:scale-95"
                      style={{ background: conversationTheme.buttonBg, color: conversationTheme.buttonText, borderColor: conversationTheme.actionBorder }}
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span className={`inline-flex items-center leading-none ${MATCHES_REFERENCE.compactButtonClass}`}>Chat</span>
                    </button>
                    <button
                      onClick={() => navigate(getVideoCallRoute(window.location.pathname, chat.id))}
                      data-testid="chat-open-button"
                      className="btn-hover-light flex-1 min-h-[42px] flex flex-col items-center justify-center px-3 py-2 rounded-xl border transition-all active:scale-95"
                      style={{ background: conversationTheme.buttonSecondaryBg, color: conversationTheme.buttonSecondaryText, borderColor: conversationTheme.actionBorder }}
                    >
                      {tier === "standard" ? (
                        <>
                          <span className={`inline-flex items-center gap-1.5 leading-none ${MATCHES_REFERENCE.compactButtonClass}`}>
                            <Video className="w-4 h-4" /> Video Call
                          </span>
                          <span className="mt-0.5 text-[9px] font-body leading-none" style={{ color: conversationTheme.mutedText }}>(Optional)</span>
                        </>
                      ) : (
                        <>
                          <span className={`flex items-center gap-1.5 ${MATCHES_REFERENCE.compactButtonClass}`}>
                            <Video className="w-4 h-4" /> Video Call
                          </span>
                          <span className="mt-0.5 text-[10px] font-body leading-none" style={{ color: conversationTheme.mutedText }}>Optional</span>
                        </>
                      )}
                    </button>
                  </div>
                ) : (
                  <div className="px-4 pb-4">
                    <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl border" style={{ background: conversationTheme.lockBg, borderColor: conversationTheme.lockBorder }}>
                      <Lock className="w-3.5 h-3.5 flex-shrink-0" style={{ color: conversationTheme.mutedText }} />
                      <p className="text-xs font-body" style={{ color: conversationTheme.secondaryText }}>
                        Chat and video call open in <span className="font-semibold" style={{ color: conversationTheme.primaryText }}>{timeStr}</span>
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
