import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useCurrentDemoMatches } from "@/hooks/useCurrentDemoMatches";
import BackButton from "@/components/BackButton";
import { useTier } from "@/hooks/useTier";
import { getCompatibilityTone } from "@/lib/compatibilityTone";

export default function DateJourney() {
  const navigate = useNavigate();
  const { tier } = useTier();
  const { matches } = useCurrentDemoMatches("date-journey");
  const stages = useMemo(() => (matches || []).slice(0, 4), [matches]);

  return (
    <div className="max-w-lg mx-auto min-h-screen bg-background px-4 py-6">
      <div className="flex items-center gap-2 mb-4">
        <BackButton />
        <h1 className="font-heading font-bold text-xl">Date Journey</h1>
      </div>
      <div className="space-y-3">
        {stages.map((m, i) => (
          <div key={m.id} className="rounded-2xl border border-border bg-card p-3 flex items-center gap-3">
            <img src={m.photoPath} alt={m.displayName} className="w-14 h-14 rounded-full object-cover" />
            <div className="flex-1">
              <p className="font-semibold">Date {i + 1} · {m.displayName}</p>
              <p className="text-xs text-muted-foreground">{m.firstDateSuggestion?.venueName} · {m.firstDateSuggestion?.neighbourhood}</p>
            </div>
            <p
              className="text-sm font-bold"
              style={{ color: getCompatibilityTone(m.compatibilityScore, tier).text }}
            >
              {m.compatibilityScore}%
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
