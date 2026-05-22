import { useState, useEffect, useRef } from "react";
import { ChevronDown, Crown, Check, ArrowRight } from "lucide-react";
import { useTier } from "../hooks/useTier";
import { Link, useLocation } from "react-router-dom";
import { getMembershipTheme } from "@/brand/membershipTheme";
import DevPill from "@/components/dev/DevPill";
import { shouldEnableDevTools } from "@/components/dev/devToolsVisibility";
import { getMembershipRoute } from "@/lib/matchFlowRoutes";

const STRIP = {
  standard: { sym: "✦", useIcon: false, label: "STANDARD MEMBER", bg: "#f8f3f1", border: "rgba(55,66,58,0.22)", text: "#37423a" },
  premium:  { sym: "✧", useIcon: false, label: "PREMIUM MEMBER",  bg: "#37423a", border: "rgba(248,243,241,0.24)", text: "#f8f3f1" },
  concierge:{ sym: null, useIcon: true,  label: "CONCIERGE MEMBER",bg: "#232623", border: "rgba(216,198,174,0.24)", text: "#d8c6ae" },
};

const PANEL = {
  standard: {
    panelBg: "#f8f3f1", panelBorder: "rgba(55,66,58,0.16)",
    text: "#37423a", muted: "rgba(55,66,58,0.72)", checkBg: "#37423a", checkColor: "#f8f3f1",
    sym: "✦", title: "Standard — Free",
    valueLine: "Compatibility-led dating designed for real outcomes.",
    body: [
      "A smarter way to date — focused on real compatibility, real chemistry, and real-world connection.",
      "We do not optimise for swipes. We optimise for people you will actually want to meet.",
    ],
    features: [
      "Advanced compatibility system",
      "Only profiles from 60% compatibility and above",
      "20–30 curated matches per day",
      "Real-world dating focus",
      "Pre-date chat + video call",
      "£9 per standard date",
      "Date upgrades available",
      "Guided 1st → 3rd date journey",
    ],
    contrast: "No endless swiping. No guesswork. Just better matches, better dates, and a clearer path forward.",
    positionLine: null,
    upgrade: {
      bg: "#37423a", border: "rgba(55,66,58,0.30)", text: "#f8f3f1", muted: "rgba(248,243,241,0.70)",
      sym: "✧", title: "Want more control and better dates?",
      bullets: [
        "See who likes you",
        "Advanced filters",
        "4 standard dates included for free",
        "Discounted premium date upgrades",
        "More Premium venues",
      ],
      cta: "Upgrade to Premium", ctaColor: "#f8f3f1",
    },
  },
  premium: {
    panelBg: "#37423a", panelBorder: "rgba(248,243,241,0.16)",
    text: "#f8f3f1", muted: "rgba(248,243,241,0.72)", checkBg: "#d8c6ae", checkColor: "#0a0d0a",
    sym: "✧", title: "Premium — £50/month",
    valueLine: "More control. Better matches. Stronger outcomes.",
    body: ["More control, better dates, and smarter matching — designed to help you find the right person faster."],
    features: [
      "Only profiles from 75% compatibility and above",
      "Adjustable compatibility threshold for more control",
      "Refined compatibility matching",
      "10–20 curated matches per day",
      "Advanced filters",
      "Expanded radius (local + up to 50 miles)",
      "4 standard dates included for free",
      "Discounted premium date upgrades",
      "More Premium venues for 1st → 3rd date journey",
      "Deeper compatibility insights",
    ],
    contrast: "Because the right person is often worth the distance.",
    positionLine: "Premium members are significantly more likely to progress beyond the first date.",
    upgrade: {
      bg: "#232623", border: "rgba(216,198,174,0.22)", text: "#f8f3f1", muted: "rgba(248,243,241,0.72)",
      sym: "♛", title: "Want a more curated experience?",
      bullets: [
        "Curated introductions",
        "Dedicated Dating Expert",
        "Exclusive & Curated Dating Planner",
        "All standard and premium dates included",
        "Access to elevated, exclusive date experiences",
      ],
      cta: "Upgrade to Concierge", ctaColor: "#d8c6ae",
    },
  },
  concierge: {
    panelBg: "#0a0d0a", panelBorder: "rgba(216,198,174,0.16)",
    text: "#d8c6ae", muted: "rgba(216,198,174,0.74)", checkBg: "#d8c6ae", checkColor: "#0a0d0a",
    sym: "♛", title: "Concierge — £200/month",
    valueLine: "Curated with expert support.",
    body: ["A curated dating experience with your own expert — focused on finding someone truly right for you."],
    features: [
      "Only profiles from 85% compatibility and above",
      "Adjustable threshold for precision matching",
      "AI + expert matching",
      "Curated introductions",
      "Nationwide + global reach",
      "Dedicated Dating Expert",
      "Unlimited matches",
      "Direct access to your dating expert via chat and video",
      "Exclusive & Curated date planning",
      "All standard and premium dates included",
      "Access to elevated, exclusive date experiences",
    ],
    contrast: "Designed to maximise your chances of meeting the right person.",
    positionLine: null,
    upgrade: null,
  },
};

export default function MembershipBanner({ forcedTier = null }) {
  const { tier } = useTier();
  const activeTier = forcedTier || tier;
  const theme = getMembershipTheme(activeTier);
  const [open, setOpen] = useState(false);
  const [bannerBottom, setBannerBottom] = useState(37);
  const location = useLocation();
  const stripRef = useRef(null);

  // Close on navigation
  useEffect(() => { setOpen(false); }, [location.pathname]);

  // Measure strip height so fixed panel sits exactly below it
  useEffect(() => {
    if (stripRef.current) {
      const rect = stripRef.current.getBoundingClientRect();
      setBannerBottom(rect.bottom);
    }
  }, [open, activeTier]);

  // Close on outside click/tap
  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (stripRef.current && !stripRef.current.contains(e.target)) {
        // Check if click is inside the panel (which is fixed, outside DOM tree)
        const panel = document.getElementById("membership-panel");
        if (panel && panel.contains(e.target)) return;
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    document.addEventListener("touchstart", handler);
    return () => {
      document.removeEventListener("mousedown", handler);
      document.removeEventListener("touchstart", handler);
    };
  }, [open]);

  const s = STRIP[activeTier] || STRIP.standard;
  const p = PANEL[activeTier] || PANEL.standard;
  const showDevButton = shouldEnableDevTools(location.pathname);


  // Determine divider color based on tier
  const dividerColor = activeTier === "concierge" ? "rgba(216,198,174,0.2)" : activeTier === "premium" ? "rgba(248,243,241,0.18)" : "rgba(55,66,58,0.16)";

  return (
    <div style={{ position: "relative" }}>
      {/* ── Strip ─────────────────────────────────────────────────── */}
      <div
        ref={stripRef}
        className="membership-banner"
        style={{
          width: "100%",
          display: "grid",
          gridTemplateColumns: "1fr auto 1fr",
          alignItems: "center",
          height: "var(--membership-banner-height, 48px)",
          background: s.bg,
          borderBottom: `1px solid ${s.border}`,
          position: "relative",
          zIndex: 2,
        }}
      >
        <div />
        <button
          type="button"
          onClick={() => {
            if (stripRef.current) {
              setBannerBottom(stripRef.current.getBoundingClientRect().bottom);
            }
            setOpen(o => !o);
          }}
          className="membership-banner-label"
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            background: "transparent",
            border: "none",
            cursor: "pointer",
            WebkitTapHighlightColor: "transparent",
            outline: "none",
          }}
        >
          {s.useIcon
            ? <Crown style={{ width: 12, height: 12, color: s.text, flexShrink: 0 }} />
            : <span style={{ fontSize: 11, color: s.text, opacity: 0.7, flexShrink: 0, lineHeight: 1 }}>{s.sym}</span>
          }
          <span style={{ fontSize: 10.5, fontWeight: 600, color: s.text, letterSpacing: "0.14em", lineHeight: 1, fontFamily: "var(--font-body)" }}>
            {s.label}
          </span>
          <ChevronDown style={{
            width: 12, height: 12, color: s.text, opacity: 0.7, flexShrink: 0,
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.25s ease",
          }} />
        </button>

        <div style={{ justifySelf: "end", paddingRight: "clamp(10px, 3vw, 16px)" }}>
          {showDevButton ? (
            <DevPill tier={activeTier} onClick={() => window.dispatchEvent(new Event("tether-dev-toggle"))} />
          ) : null}
        </div>
      </div>

      {/* ── Divider line (sits at bottom of banner, hidden when dropdown open) ────────────────────────── */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "1px",
          background: dividerColor,
          pointerEvents: "none",
          opacity: open ? 0 : 1,
          transition: "opacity 0.25s ease",
          zIndex: 2,
        }}
      />

      {/* ── Backdrop ─────────────────────────────────────────────── */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{
            position: "fixed", inset: 0, zIndex: 9998,
            background: "rgba(0,0,0,0.3)",
          }}
        />
      )}

      {/* ── Dropdown panel — fixed so it is NEVER clipped ────────── */}
      <div
        id="membership-panel"
        style={{
          position: "fixed",
          top: bannerBottom,
          left: 0,
          right: 0,
          zIndex: 9999,
          background: p.panelBg,
          borderBottom: `1px solid ${p.panelBorder}`,
          borderBottomLeftRadius: 16,
          borderBottomRightRadius: 16,
          boxShadow: "0 8px 32px rgba(0,0,0,0.25)",
          maxHeight: "75vh",
          overflowY: "auto",
          transform: open ? "translateY(0)" : "translateY(-110%)",
          transition: "transform 0.28s cubic-bezier(0.4,0,0.2,1)",
          pointerEvents: open ? "auto" : "none",
        }}
      >
        <div style={{ padding: "20px 20px 28px", maxWidth: 512, margin: "0 auto" }}>
          <div style={{ marginBottom: 18, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
            <img src={theme.logo} alt={`${activeTier} logo`} style={{ width: 40, height: 40, borderRadius: 12 }} />
            <img src={theme.wordmark} alt={`${activeTier} wordmark`} style={{ height: 28, width: "auto" }} />
          </div>

          {/* Title */}
          <div style={{ marginBottom: 16 }}>
            <p style={{ fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.12em", color: p.muted, marginBottom: 6, fontFamily: "var(--font-body)", textAlign: "center" }}>
              {p.sym} {p.title}
            </p>
            <p style={{ fontSize: 32, fontWeight: 700, color: p.text, lineHeight: 1.12, fontFamily: "var(--font-heading)", textAlign: "center" }}>
              {p.valueLine}
            </p>
          </div>

          {/* Body */}
          <div style={{ marginBottom: 16 }}>
            {p.body.map((para, i) => (
              <p key={i} style={{ fontSize: 14, color: p.muted, lineHeight: 1.58, marginBottom: 6, fontFamily: "var(--font-body)" }}>{para}</p>
            ))}
          </div>

          {/* Features */}
          <div style={{ marginBottom: 16 }}>
            {p.features.map((f) => (
              <div key={f} style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 8 }}>
                <div style={{
                  width: 14, height: 14, borderRadius: "50%", background: p.checkBg,
                  display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1,
                }}>
                  <Check style={{ width: 8, height: 8, color: p.checkColor }} />
                </div>
                <span style={{ fontSize: 14, color: p.text, lineHeight: 1.45, fontFamily: "var(--font-body)" }}>{f}</span>
              </div>
            ))}
          </div>

          {/* Contrast line */}
          {p.contrast && (
            <p style={{
              fontSize: 11, color: p.muted, fontStyle: "italic", lineHeight: 1.5,
              paddingTop: 12, marginBottom: 12,
              borderTop: `1px solid ${p.panelBorder}`,
            }}>{p.contrast}</p>
          )}

          {/* Positioning line */}
          {p.positionLine && (
            <p style={{ fontSize: 11, color: p.muted, fontWeight: 500, marginBottom: 12 }}>{p.positionLine}</p>
          )}

          {/* Upgrade block */}
          {p.upgrade && (
            <div style={{
              background: p.upgrade.bg, border: `1px solid ${p.upgrade.border}`,
              borderRadius: 12, padding: "16px",
            }}>
              <p style={{ fontSize: 12, fontWeight: 600, color: p.upgrade.text, marginBottom: 10 }}>
                {p.upgrade.title}
              </p>
              <ul style={{ marginBottom: 14, padding: 0, listStyle: "none" }}>
                {p.upgrade.bullets.map((b) => (
                  <li key={b} style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 6 }}>
                    <span style={{ flexShrink: 0, opacity: 0.8, fontSize: 11, marginTop: 1 }}>{p.upgrade.sym}</span>
                    <span style={{ fontSize: 11, color: p.upgrade.muted, lineHeight: 1.4 }}>{b}</span>
                  </li>
                ))}
              </ul>
              <Link
                to={getMembershipRoute(location.pathname)}
                onClick={() => setOpen(false)}
                style={{
                  display: "inline-flex", alignItems: "center", gap: 6,
                  fontSize: 12, fontWeight: 700, color: p.upgrade.ctaColor,
                  textDecoration: "none",
                }}
              >
                {p.upgrade.cta} <ArrowRight style={{ width: 12, height: 12 }} />
              </Link>
            </div>
          )}

        </div>
        </div>
        </div>
        );
        }
