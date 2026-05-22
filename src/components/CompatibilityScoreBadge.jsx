import { getCompatibilityTone } from "@/lib/compatibilityTone";

export default function CompatibilityScoreBadge({ score, size = "md", showLabel = false, darkMode = false, scoreColor = null, trackColor = null, tier = "standard", surface = "light" }) {
  const sizes = {
    xs: { outer: "w-10 h-10", text: "text-[13px] font-bold", label: "text-[8px]" },
    sm: { outer: "w-12 h-12", text: "text-sm font-bold", label: "text-[9px]" },
    md: { outer: "w-16 h-16", text: "text-base font-bold", label: "text-[10px]" },
    lg: { outer: "w-20 h-20", text: "text-xl font-bold", label: "text-xs" }
  };
  const s = sizes[size];
  const radius = size === "lg" ? 34 : size === "md" ? 26 : size === "sm" ? 20 : 16.5;
  const stroke = size === "lg" ? 4.25 : size === "md" ? 3.4 : size === "sm" ? 3.1 : 2.8;
  const cx = size === "lg" ? 40 : size === "md" ? 32 : size === "sm" ? 24 : 20;
  const circumference = 2 * Math.PI * radius;
  const safeScore = Number.isFinite(Number(score)) ? Math.max(0, Math.min(100, Number(score))) : 0;
  const offset = circumference - safeScore / 100 * circumference;

  const tone = getCompatibilityTone(score, tier, darkMode ? "dark" : surface);
  const color = scoreColor || (darkMode ? tone.text : tone.text);
  const normalizedColor = typeof color === "string" ? color.trim().toLowerCase() : color;
  const normalizedTrackColor = typeof trackColor === "string" ? trackColor.trim().toLowerCase() : trackColor;
  const resolvedTrackColor =
    trackColor && normalizedTrackColor !== normalizedColor
      ? trackColor
      : tone.track;

  return (
    <div className={`relative ${s.outer} flex-shrink-0`} style={darkMode ? { filter: "drop-shadow(0 4px 10px rgba(0,0,0,0.26))" } : {}}>
      <svg className="w-full h-full -rotate-90" viewBox={`0 0 ${cx * 2} ${cx * 2}`}>
        <circle cx={cx} cy={cx} r={radius} stroke={resolvedTrackColor} strokeWidth={stroke} fill="none" />
        <circle
          cx={cx} cy={cx} r={radius}
          stroke={color}
          strokeWidth={stroke}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 0.8s ease" }} />
        
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={`${s.text} compatibility-score-text`} style={{ color }}>
          <span className="compatibility-score-number">{safeScore}</span>
          <span className="compatibility-score-symbol text-[60%]">%</span>
        </span>
        {showLabel && <span className={`${s.label}`} style={{ color }}>match</span>}
      </div>
    </div>);

}
