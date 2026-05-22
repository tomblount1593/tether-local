import CompatibilityScoreBadge from "./CompatibilityScoreBadge";
import { Sparkles } from "lucide-react";

export default function CompatibilityOverview({ matches, profiles, myEmail }) {
  if (!matches.length) return null;

  const avg = Math.round(matches.reduce((s, m) => s + (m.compatibility_score || 80), 0) / matches.length);
  const top = [...matches].sort((a, b) => (b.compatibility_score || 0) - (a.compatibility_score || 0)).slice(0, 3);

  const getOther = (m) => {
    const email = m.user_a_email === myEmail ? m.user_b_email : m.user_a_email;
    return profiles[email];
  };

  return (
    <div className="rounded-2xl overflow-hidden mb-5" style={{ background: '#141916' }}>
      <div className="px-4 pt-4 pb-3 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-1.5 mb-0.5">
            <Sparkles className="w-3.5 h-3.5" style={{ color: '#CBB9A3' }} />
            <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#CBB9A3' }}>Compatibility Overview</p>
          </div>
          <p className="font-heading text-2xl font-light" style={{ color: '#EEE7DA' }}>{avg}% average</p>
          <p className="text-xs mt-0.5" style={{ color: '#7A8A7B' }}>across {matches.length} {matches.length === 1 ? "match" : "matches"}</p>
        </div>
        <CompatibilityScoreBadge score={avg} size="md" darkMode />
      </div>

      {/* Top matches mini row */}
      <div className="px-4 pb-4 flex gap-3 overflow-x-auto">
        {top.map((m) => {
          const p = getOther(m);
          if (!p) return null;
          return (
            <div key={m.id} className="flex-shrink-0 flex flex-col items-center gap-1.5">
              <div className="relative">
                <img
                  src={p.photos?.[0] || "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop"}
                  alt={p.display_name}
                  className="w-10 h-10 rounded-full object-cover"
                  style={{ border: '2px solid #2F3B35' }}
                />
                <div className="absolute -bottom-0.5 -right-0.5 text-[9px] font-bold w-5 h-5 rounded-full flex items-center justify-center" style={{ background: '#EEE7DA', color: '#141916' }}>
                  {m.compatibility_score || 80}
                </div>
              </div>
              <p className="text-[10px]" style={{ color: '#7A8A7B' }}>{p.display_name}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}