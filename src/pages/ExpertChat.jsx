import { useState } from "react";
import { ArrowLeft, Video, Phone, Calendar, ChevronRight, MessageSquare, Send } from "lucide-react";

import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useTier } from "../hooks/useTier";
import { useCurrentDemoMatches } from "@/hooks/useCurrentDemoMatches";
import { getRouteOrientationFromContext } from "@/lib/compatibilityVariantRouting";

const EXPERT_BY_ORIENTATION = {
  gay: {
    name: "Sophia Laurent",
    title: "Senior Dating Expert & Match Curator",
    photo: "/match-photos/straight-female/istockphoto-1303539316-612x612.jpg",
    bio: "Sophia has worked in luxury matchmaking for 8 years. She specialises in helping gay professionals find emotionally compatible partners through a blend of AI analysis and human intuition.",
    availability: "Next available: Today, 4pm",
  },
  lesbian: {
    name: "Sophia Laurent",
    title: "Senior Dating Expert & Match Curator",
    photo: "/match-photos/straight-female/istockphoto-1303539316-612x612.jpg",
    bio: "Sophia has 8 years in luxury matchmaking, specialising in helping women find meaningful, compatible connections through curated introductions and deep compatibility analysis.",
    availability: "Next available: Today, 4pm",
  },
  straight: {
    name: "James Hartley",
    title: "Senior Dating Expert & Match Curator",
    photo: "/match-photos/straight-male/photo-1506794778202-cad84cf45f1d.jpg",
    bio: "James has 7 years in premium matchmaking, helping professional singles find emotionally and lifestyle-compatible partners through data-driven curation and personal insight.",
    availability: "Next available: Today, 3pm",
  },
  bisexual: {
    name: "Sophia Laurent",
    title: "Senior Dating Expert & Match Curator",
    photo: "/match-photos/straight-female/istockphoto-1303539316-612x612.jpg",
    bio: "Sophia brings 8 years of luxury matchmaking experience and specialises in inclusive, identity-affirming introductions — matching across the full spectrum of attraction with care and precision.",
    availability: "Next available: Today, 4pm",
  },
  trans_nonbinary: {
    name: "Alex Mercer",
    title: "Senior Dating Expert & Inclusive Match Curator",
    photo: "/match-photos/non-binary/istockphoto-1330959452-612x612.jpg",
    bio: "Alex specialises in inclusive matchmaking for trans and non-binary members. With 6 years of experience, they bring deep understanding of identity, safety, and authentic compatibility.",
    availability: "Next available: Today, 5pm",
  },
};

const UPCOMING_SESSIONS = [
  { type: "Video call", date: "Wed 9 Apr", time: "4:00pm", topic: `Review your top 3 matches` },
];

export default function ExpertChat() {
  const navigate = useNavigate();
  const { tier } = useTier();
  const { context, matches } = useCurrentDemoMatches("expert");
  const orientation = getRouteOrientationFromContext(context) || "gay";
  const EXPERT = EXPERT_BY_ORIENTATION[orientation] || EXPERT_BY_ORIENTATION.gay;
  const shortlist = (matches || []).slice(0, 5).sort((a, b) => b.compatibilityScore - a.compatibilityScore);
  const primaryName = shortlist[0]?.displayName || "your top match";
  const secondaryName = shortlist[1]?.displayName || "your second match";
  const PAST_NOTES = [
    {
      date: "Mon 31 Mar",
      note: `Reviewed ${primaryName} and ${secondaryName} — both are strong on values, lifestyle fit, and relationship readiness. Recommended ${primaryName} first, with ${secondaryName} as a close follow-up.`,
    },
  ];
  const DEMO_MESSAGES = [
    { role: "expert", content: "Hi, I've reviewed your latest shortlist and wanted to share a quick recommendation before we speak.", time: "Mon 31 Mar, 10:42am" },
    { role: "user", content: `Perfect timing — I was just looking at ${secondaryName}'s profile.`, time: "Mon 31 Mar, 11:05am" },
    { role: "expert", content: `${secondaryName} is a strong fit. I'd still sequence ${primaryName} first so we can compare feedback cleanly.`, time: "Mon 31 Mar, 11:08am" },
    { role: "user", content: `Makes sense. Should I wait until after my date with ${primaryName}?`, time: "Mon 31 Mar, 11:15am" },
    { role: "expert", content: "Yes. Give each introduction space, then I’ll refine your shortlist from post-date signals.", time: "Mon 31 Mar, 11:17am" },
  ];
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState(DEMO_MESSAGES);
  const [view, setView] = useState("overview"); // overview | chat

  const handleSend = () => {
    if (!message.trim()) return;
    setMessages(prev => [...prev, { role: "user", content: message, time: "Just now" }]);
    setMessage("");
    setTimeout(() => {
      setMessages(prev => [...prev, {
        role: "expert",
        content: "Thanks for your message. I'll respond shortly — or we can cover this in our Wednesday call if you prefer.",
        time: "Just now"
      }]);
    }, 1200);
  };

  const palette = tier === "concierge"
    ? {
        bg: "#0a0d0a",
        cardBg: "#232623",
        accent: "#d8c6ae",
        text: "#d8c6ae",
        muted: "rgba(216,198,174,0.74)",
        border: "rgba(216,198,174,0.18)",
      }
    : {
        bg: "#141916",
        cardBg: "#1e2820",
        accent: "#CBB9A3",
        text: "#EEE7DA",
        muted: "#7A8A7B",
        border: "#2F3B35",
      };
  const { bg, cardBg, accent, text, muted, border } = palette;

  return (
    <div className="min-h-screen flex flex-col" style={{ background: bg }}>
      {/* Header */}
      <div className="sticky top-0 z-10 border-b flex items-center gap-3 px-4 py-3" style={{ background: bg, borderColor: border }}>
        <button onClick={() => navigate(-1)} style={{ color: muted }}>
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1">
          <h1 className="font-heading font-bold text-xl page-title" style={{ color: text }}>Concierge Expert</h1>
          <p className="text-xs" style={{ color: muted }}>Your dedicated matchmaking advisor</p>
        </div>
      </div>

      {/* Tab switcher */}
      <div className="flex px-4 pt-4 gap-2">
        {["overview", "chat"].map((v) => (
          <button
            key={v}
            onClick={() => setView(v)}
            className="flex-1 py-2.5 rounded-xl text-sm font-medium capitalize transition-all"
            style={{
              background: view === v ? accent : cardBg,
              color: view === v ? "#0a0d0a" : text,
            }}
          >
            {v === "chat" ? "Message Expert" : "Overview"}
          </button>
        ))}
      </div>

      {view === "overview" && (
        <div className="flex-1 px-4 py-5 space-y-4 overflow-auto pb-24">
          {/* Expert card */}
          <div className="rounded-2xl p-4 flex items-center gap-4" style={{ background: cardBg }}>
            <img src={EXPERT.photo} alt={EXPERT.name} className="w-16 h-16 rounded-full object-cover flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="font-heading font-bold" style={{ color: text }}>{EXPERT.name}</p>
              <p className="text-xs mt-0.5" style={{ color: accent }}>{EXPERT.title}</p>
              <p className="text-xs mt-1.5 leading-relaxed" style={{ color: muted }}>{EXPERT.bio}</p>
            </div>
          </div>

          {/* Upcoming session */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider mb-2.5" style={{ color: muted }}>Upcoming Session</p>
            {UPCOMING_SESSIONS.map((s, i) => (
              <motion.div key={i} className="rounded-2xl p-4 flex items-center gap-4" style={{ background: cardBg }}
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "rgba(216,198,174,0.10)" }}>
                  <Video className="w-5 h-5" style={{ color: accent }} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold" style={{ color: text }}>{s.type} — {s.date} at {s.time}</p>
                  <p className="text-xs mt-0.5" style={{ color: muted }}>{s.topic}</p>
                </div>
                <ChevronRight className="w-4 h-4 flex-shrink-0" style={{ color: muted }} />
              </motion.div>
            ))}
          </div>

          {/* Quick actions */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider mb-2.5" style={{ color: muted }}>Quick Actions</p>
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: Video, label: "Book Video Call", desc: "Discuss your matches" },
                { icon: Phone, label: "Request Call Back", desc: "Available same day" },
                { icon: Calendar, label: "View Schedule", desc: "Upcoming sessions" },
                { icon: MessageSquare, label: "Leave a Note", desc: "For your next review" },
              ].map(({ icon: Icon, label, desc }) => (
                <button key={label} className="rounded-2xl p-4 text-left transition-all active:scale-[0.97]" style={{ background: cardBg }}>
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center mb-2.5" style={{ background: "rgba(216,198,174,0.10)" }}>
                    <Icon className="w-4 h-4" style={{ color: accent }} />
                  </div>
                  <p className="text-xs font-semibold" style={{ color: text }}>{label}</p>
                  <p className="text-[10px] mt-0.5" style={{ color: muted }}>{desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Expert notes */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider mb-2.5" style={{ color: muted }}>Expert Notes</p>
            {PAST_NOTES.map((n, i) => (
              <div key={i} className="rounded-2xl p-4" style={{ background: cardBg }}>
                <p className="text-[10px] font-semibold uppercase tracking-wider mb-1.5" style={{ color: accent }}>{n.date}</p>
                <p className="text-xs leading-relaxed" style={{ color: text }}>{n.note}</p>
              </div>
            ))}
            {shortlist.length > 0 && (
              <div className="rounded-2xl p-4 mt-3" style={{ background: cardBg }}>
                <p className="text-[10px] font-semibold uppercase tracking-wider mb-2" style={{ color: accent }}>Current Shortlist</p>
                {shortlist.map((m) => (
                  <div key={m.id} className="flex items-center justify-between py-1.5">
                    <p className="text-xs" style={{ color: text }}>{m.displayName}</p>
                    <p className="text-xs font-semibold" style={{ color: accent }}>{m.compatibilityScore}%</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {view === "chat" && (
        <div className="flex-1 flex flex-col">
          <div className="flex-1 px-4 py-4 space-y-4 overflow-auto pb-4">
            {messages.map((msg, i) => (
              <div key={i} className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                {msg.role === "expert" && (
                  <img src={EXPERT.photo} alt="" className="w-8 h-8 rounded-full object-cover flex-shrink-0 mt-0.5" />
                )}
                <div className={`max-w-[80%] ${msg.role === "user" ? "items-end" : "items-start"} flex flex-col gap-1`}>
                  <div className="rounded-2xl px-4 py-3" style={{
                    background: msg.role === "user" ? accent : cardBg,
                    color: msg.role === "user" ? "#0a0d0a" : text,
                  }}>
                    <p className="text-sm leading-relaxed">{msg.content}</p>
                  </div>
                  <p className="text-[10px] px-1" style={{ color: muted }}>{msg.time}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="px-4 pb-6 pt-3 flex gap-3 border-t" style={{ borderColor: border, background: bg }}>
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Message Sophia..."
              className="flex-1 rounded-2xl px-4 py-3 text-sm outline-none"
              style={{ background: cardBg, color: text, border: `1px solid ${border}` }}
            />
            <button
              onClick={handleSend}
              className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
              style={{ background: accent }}
            >
              <Send className="w-4 h-4" style={{ color: "#0a0d0a" }} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
