import { Sparkles } from "lucide-react";

export default function MatchReasonBadge({ reason, score }) {
  return (
    <div className="flex items-center gap-2 bg-primary/10 text-primary rounded-full px-3 py-1.5">
      <Sparkles className="w-3.5 h-3.5" />
      <span className="text-xs font-medium">
        {score ? `${score}% compatible` : reason || "Strong match"}
      </span>
    </div>
  );
}