import { useState } from "react";
import { ChevronDown, Crown } from "lucide-react";
import { useTier } from "../hooks/useTier";

/**
 * A pill button that shows the current membership tier and opens a
 * dropdown so the user can switch tiers (demo control).
 *
 * Props
 *   className   – extra classes on the wrapper <div>
 *   pillStyle   – inline style object applied to the pill button (for themed pages)
 *   dropdownPos – "right" (default) | "left" | "center" — dropdown alignment
 */
export default function MembershipDropdown({ className = "", pillStyle = {}, dropdownPos = "right" }) {
  const { tier, setTier } = useTier();
  const [open, setOpen] = useState(false);

  const label =
    tier === "standard" ? "Standard" :
    tier === "premium"  ? "Premium"  : "Concierge";

  const isConc = tier === "concierge";

  const dropClass =
    dropdownPos === "left"   ? "left-0 right-auto" :
    dropdownPos === "center" ? "left-1/2 -translate-x-1/2" :
    "right-0 left-auto";

  // Concierge pill style — dark themed with clay-beige accent
  const concPill = {
    background: "#2F3B35",
    border: "1px solid #3d4f45",
    color: "#CBB9A3",
  };

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border transition-all"
        style={isConc ? concPill : { background: "hsl(var(--secondary))", border: "1px solid hsl(var(--border))", color: "hsl(var(--muted-foreground))", ...pillStyle }}
      >
        {isConc && <Crown className="w-3 h-3 flex-shrink-0" style={{ color: "#CBB9A3" }} />}
        {label}
        <ChevronDown
          className="w-3 h-3 transition-transform duration-200"
          style={{ transform: open ? "rotate(180deg)" : "none", color: isConc ? "#CBB9A3" : undefined }}
        />
      </button>

      {open && (
        <>
          {/* backdrop */}
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className={`absolute top-full mt-1.5 w-36 rounded-2xl border border-border bg-card shadow-lg overflow-hidden z-50 ${dropClass}`}>
            {["standard", "premium", "concierge"].map(t => (
              <button
                key={t}
                onClick={() => { setTier(t); setOpen(false); }}
                className="w-full text-left px-4 py-2.5 text-sm transition-all hover:bg-secondary"
                style={{ fontWeight: tier === t ? 700 : 400, color: "hsl(var(--foreground))" }}
              >
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}