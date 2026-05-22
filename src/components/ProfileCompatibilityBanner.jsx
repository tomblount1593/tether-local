import { Sparkles } from "lucide-react";

const TIER_STYLES = {
  standard: {
    light: {
      bg: "#e7e5e1",
      text: "#37423a",
      subText: "rgba(55,66,58,0.78)",
      border: "hsl(var(--border))",
    },
    dark: {
      bg: "#37423a",
      text: "#f8f3f1",
      subText: "rgba(248,243,241,0.80)",
      border: "hsl(var(--border))",
    },
  },
  premium: {
    light: {
      bg: "#37423a",
      text: "#f8f3f1",
      subText: "rgba(248,243,241,0.78)",
      border: "rgba(248,243,241,0.32)",
    },
    dark: {
      bg: "#37423a",
      text: "#f8f3f1",
      subText: "rgba(248,243,241,0.78)",
      border: "rgba(248,243,241,0.24)",
    },
  },
  concierge: {
    light: {
      bg: "#242623",
      text: "#d2c6b2",
      subText: "rgba(210,198,178,0.78)",
      border: "rgba(210,198,178,0.30)",
    },
    dark: {
      bg: "#242623",
      text: "#d2c6b2",
      subText: "rgba(210,198,178,0.78)",
      border: "rgba(210,198,178,0.30)",
    },
  },
};

export default function ProfileCompatibilityBanner({
  tier = "standard",
  dark = false,
  title = "View Profile & Compatibility Breakdown",
  subtitle = "See why this match works",
  onClick,
  backgroundOverride,
}) {
  const palette = (TIER_STYLES[tier] || TIER_STYLES.standard)[dark ? "dark" : "light"];
  const background = backgroundOverride || palette.bg;
  return (
    <button
      type="button"
      onClick={onClick}
      className="btn-hover-mid w-full border-t border-b transition-all"
      style={{ background, color: palette.text, borderColor: palette.border }}
    >
      <div className="w-full px-4 py-3">
        <div className="grid grid-cols-[1fr_auto_1fr] items-center min-h-[24px]">
          <div className="flex justify-end pr-2">
            <Sparkles className="w-3.5 h-3.5 flex-shrink-0" style={{ color: palette.text }} />
          </div>
          <p className="font-heading font-bold text-base leading-tight text-center" style={{ color: palette.text }}>
            {title}
          </p>
          <div />
        </div>
        <div className="text-center">
          <p className="text-xs font-body mt-0.5 leading-tight" style={{ color: palette.subText }}>
            {subtitle}
          </p>
        </div>
      </div>
    </button>
  );
}
