import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const PAST_TYPES = [
  { id: "emotionally_available", label: "Emotionally available" },
  { id: "emotionally_unavailable", label: "Emotionally unavailable" },
  { id: "fun_adventurous", label: "Fun & adventurous" },
  { id: "serious_stable", label: "Serious & stable" },
  { id: "confident_assertive", label: "Confident & assertive" },
  { id: "soft_sensitive", label: "Soft & sensitive" },
  { id: "ambitious_driven", label: "Ambitious & driven" },
  { id: "creative_free_spirited", label: "Creative & free-spirited" },
  { id: "nurturing_caring", label: "Nurturing & caring" },
  { id: "independent_distant", label: "Independent / distant" },
  { id: "high_chemistry_low_stability", label: "High chemistry, low stability" },
  { id: "calm_grounded", label: "Calm & grounded" },
  { id: "expressive_intense", label: "Expressive & intense" },
  { id: "low_key_private", label: "Low-key & private" },
  { id: "socially_outgoing", label: "Socially outgoing" },
  { id: "avoidant_guarded", label: "Avoidant / guarded" },
  { id: "affectionate_warm", label: "Affectionate & warm" },
  { id: "inconsistent_mixed_signals", label: "Inconsistent / mixed signals" },
  { id: "relationship_ready", label: "Relationship-ready" },
  { id: "still_figuring_things_out", label: "Still figuring things out" },
];

const WORKED_WELL = [
  { id: "emotionally_available", label: "Emotionally available" },
  { id: "calm_grounded", label: "Calm & grounded" },
  { id: "consistent_reliable", label: "Consistent & reliable" },
  { id: "communicative", label: "Communicative" },
  { id: "affectionate_warm", label: "Affectionate & warm" },
  { id: "relationship_ready", label: "Relationship-ready" },
  { id: "emotionally_mature", label: "Emotionally mature" },
  { id: "aligned_on_values", label: "Aligned on values" },
  { id: "easy_to_be_with", label: "Easy to be with" },
  { id: "strong_chemistry", label: "Strong chemistry" },
];

const DIDNT_LAST = [
  { id: "emotionally_unavailable", label: "Emotionally unavailable" },
  { id: "inconsistent_mixed_signals", label: "Inconsistent / mixed signals" },
  { id: "intense_fast_start", label: "Intense but fast start" },
  { id: "high_chemistry_low_stability", label: "High chemistry, low stability" },
  { id: "avoidant_guarded", label: "Avoidant / guarded" },
  { id: "chaotic_unpredictable", label: "Chaotic & unpredictable" },
  { id: "overly_independent", label: "Overly independent" },
  { id: "attractive_but_misaligned", label: "Attractive but misaligned" },
  { id: "fun_but_not_serious", label: "Fun but not serious" },
];

const CHALLENGES = [
  { id: "being_fully_myself", label: "Being fully myself" },
  { id: "communicating_through_problems", label: "Communicating through problems" },
  { id: "maintaining_boundaries", label: "Maintaining boundaries" },
  { id: "dealing_with_negativity", label: "Dealing with negativity" },
  { id: "repeating_the_same_pattern", label: "Repeating the same pattern" },
  { id: "staying_when_not_right", label: "Staying when it's not right" },
  { id: "losing_interest_quickly", label: "Losing interest quickly" },
  { id: "choosing_unavailable_people", label: "Choosing unavailable people" },
  { id: "moving_too_fast", label: "Moving too fast" },
  { id: "struggling_to_open_up", label: "Struggling to open up" },
  { id: "avoiding_difficult_conversations", label: "Avoiding difficult conversations" },
  { id: "focusing_on_potential", label: "Focusing on potential over reality" },
];

const CLOSENESS_PATTERNS = [
  { id: "steady_and_open", label: "Steady & open", desc: "I warm up naturally and stay present" },
  { id: "want_reassurance_quickly", label: "I want reassurance early", desc: "I need to feel secure before fully opening up" },
  { id: "hold_back_and_protect", label: "I hold back at first", desc: "I protect myself while I figure things out" },
  { id: "closeness_then_overwhelmed", label: "I want closeness then feel overwhelmed", desc: "Intensity can flip to needing space" },
];

const CONFLICT_TENDENCIES = [
  { id: "say_yes_when_dont_want", label: "Say yes when I don't want to" },
  { id: "avoid_conflict", label: "Avoid conflict" },
  { id: "cant_be_myself", label: "Feel like I can't be myself" },
  { id: "focus_on_potential", label: "Focus on potential over reality" },
  { id: "try_to_convince", label: "Try to convince my partner I'm right" },
];

function Chips({ options, selected, onToggle, limit }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => {
        const sel = selected.includes(o.id);
        return (
          <button
            key={o.id}
            onClick={() => {
              if (sel) onToggle(o.id);
              else if (!limit || selected.length < limit) onToggle(o.id);
            }}
            className="py-2 px-3.5 rounded-full text-sm font-medium border transition-all"
            style={{
              background: sel ? "hsl(var(--primary))" : "hsl(var(--secondary))",
              color: sel ? "hsl(var(--primary-foreground))" : "hsl(var(--foreground))",
              borderColor: sel ? "hsl(var(--primary))" : "transparent",
            }}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

export default function RomanticPatternSection({ onComplete }) {
  const [page, setPage] = useState(0);
  const [pastTypes, setPastTypes] = useState([]);
  const [workedWell, setWorkedWell] = useState([]);
  const [didntLast, setDidntLast] = useState([]);
  const [challenges, setChallenges] = useState([]);
  const [closenessPattern, setClosenessPattern] = useState("");
  const [conflictTendencies, setConflictTendencies] = useState([]);
  const [growthOrientation, setGrowthOrientation] = useState(75);
  const [patternFlexibility, setPatternFlexibility] = useState(50);

  const tog = (setter) => (id) => setter((p) => p.includes(id) ? p.filter((x) => x !== id) : [...p, id]);

  const pages = [
    {
      title: "Who have you dated before?",
      sub: "Select all that feel honest",
      canNext: pastTypes.length > 0,
      content: (
        <div className="overflow-y-auto" style={{ maxHeight: "55vh" }}>
          <Chips options={PAST_TYPES} selected={pastTypes} onToggle={tog(setPastTypes)} />
        </div>
      ),
    },
    {
      title: "What has actually worked?",
      sub: "Choose up to 5 — not who you're attracted to, who was genuinely compatible",
      canNext: workedWell.length > 0,
      content: (
        <div className="space-y-5 overflow-y-auto" style={{ maxHeight: "55vh" }}>
          <Chips options={WORKED_WELL} selected={workedWell} onToggle={tog(setWorkedWell)} limit={5} />
          <div>
            <p className="text-sm font-semibold mb-3">Which patterns felt exciting but usually didn't last?</p>
            <p className="text-xs text-muted-foreground mb-3">Choose up to 5</p>
            <Chips options={DIDNT_LAST} selected={didntLast} onToggle={tog(setDidntLast)} limit={5} />
          </div>
        </div>
      ),
    },
    {
      title: "What tends to be hardest for you?",
      sub: "Select all that feel honest — this is completely private",
      canNext: true,
      content: (
        <div className="space-y-5 overflow-y-auto" style={{ maxHeight: "55vh" }}>
          <Chips options={CHALLENGES} selected={challenges} onToggle={tog(setChallenges)} />
          <div>
            <p className="text-sm font-semibold mb-3">When things aren't working, I sometimes…</p>
            <p className="text-xs text-muted-foreground mb-3">Select all that apply</p>
            <Chips options={CONFLICT_TENDENCIES} selected={conflictTendencies} onToggle={tog(setConflictTendencies)} />
          </div>
        </div>
      ),
    },
    {
      title: "Closeness & flexibility",
      sub: "No judgment — helps us find what works for you",
      canNext: !!closenessPattern,
      content: (
        <div className="space-y-6 overflow-y-auto" style={{ maxHeight: "55vh" }}>
          <div>
            <p className="text-sm font-semibold mb-3">When you start liking someone, what feels most familiar?</p>
            <div className="space-y-2">
              {CLOSENESS_PATTERNS.map((o) => (
                <button
                  key={o.id}
                  onClick={() => setClosenessPattern(o.id)}
                  className="w-full text-left p-4 rounded-2xl border-2 transition-all"
                  style={{
                    borderColor: closenessPattern === o.id ? "hsl(var(--primary))" : "hsl(var(--border))",
                    background: closenessPattern === o.id ? "hsl(var(--primary)/0.06)" : "hsl(var(--card))",
                  }}
                >
                  <p className="text-sm font-semibold">{o.label}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{o.desc}</p>
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-3">
            <p className="text-sm font-semibold">Growth in a relationship matters to me</p>
            <input type="range" min={0} max={100} value={growthOrientation} onChange={(e) => setGrowthOrientation(Number(e.target.value))} className="w-full" style={{ accentColor: "hsl(var(--primary))" }} />
            <div className="flex justify-between">
              <span className="text-xs text-muted-foreground">Strongly disagree</span>
              <span className="text-xs text-muted-foreground">Strongly agree</span>
            </div>
          </div>
          <div className="space-y-3">
            <p className="text-sm font-semibold">How flexible are you about dating outside your usual pattern?</p>
            <input type="range" min={0} max={100} value={patternFlexibility} onChange={(e) => setPatternFlexibility(Number(e.target.value))} className="w-full" style={{ accentColor: "hsl(var(--primary))" }} />
            <div className="flex justify-between">
              <span className="text-xs text-muted-foreground">My patterns define what works</span>
              <span className="text-xs text-muted-foreground">Very open to something different</span>
            </div>
          </div>
        </div>
      ),
    },
  ];

  const current = pages[page];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-1">
        {pages.map((_, i) => (
          <div key={i} className={`h-1 flex-1 rounded-full transition-all ${i <= page ? "bg-primary" : "bg-border"}`} />
        ))}
      </div>
      <div>
        <h3 className="text-base font-heading font-semibold">{current.title}</h3>
        <p className="text-xs text-muted-foreground mt-0.5">{current.sub}</p>
      </div>
      {current.content}
      <Button
        onClick={() => {
          if (page < pages.length - 1) setPage((p) => p + 1);
          else onComplete({ pastTypes, workedWell, didntLast, challenges, closenessPattern, conflictTendencies, growthOrientation, patternFlexibility });
        }}
        disabled={!current.canNext}
        className="rounded-full w-full"
      >
        {page < pages.length - 1 ? "Continue" : "Complete Section"}
        <ArrowRight className="w-4 h-4 ml-2" />
      </Button>
    </div>
  );
}