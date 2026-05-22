import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const INTENT_OPTIONS = [
  { value: "long_term_partner", label: "Long-term partner", desc: "Building something real and lasting" },
  { value: "serious_relationship", label: "Serious relationship", desc: "Intentional, exclusive, leading somewhere" },
  { value: "open_to_see", label: "Open to see where it goes", desc: "Exploring without a hard timeline" },
  { value: "casual_meaningful", label: "Casual but meaningful", desc: "Connection without pressure" },
  { value: "casual_low_pressure", label: "Casual, low pressure", desc: "Light, fun, no expectations" },
];

const READINESS_OPTIONS = [
  { value: "fully_ready", label: "Fully ready", desc: "I'm here and ready for this" },
  { value: "mostly_ready", label: "Mostly ready", desc: "I'm in a good place, just taking it steady" },
  { value: "unsure", label: "Unsure", desc: "I want connection but feel uncertain" },
  { value: "want_connection", label: "Connection without full commitment", desc: "I want closeness, not a formal label yet" },
];

const SERIOUSNESS_RESPONSE = [
  { value: "lean_in", label: "I lean in", desc: "Seriousness feels exciting and motivating" },
  { value: "take_time_stay_present", label: "I take my time but stay present", desc: "I'm intentional — not fast, not avoidant" },
  { value: "unsure_pull_back", label: "I get unsure and pull back", desc: "Getting serious can make me second-guess" },
  { value: "want_closeness_overwhelmed", label: "I want closeness then feel overwhelmed", desc: "Intimacy can shift to needing space" },
];

const CORE_VALUES = [
  { id: "emotional_stability", label: "Emotional stability" },
  { id: "ambition", label: "Ambition" },
  { id: "independence", label: "Independence" },
  { id: "affection", label: "Affection" },
  { id: "consistency", label: "Consistency" },
  { id: "fun_adventure", label: "Fun & adventure" },
  { id: "loyalty", label: "Loyalty" },
  { id: "growth", label: "Growth" },
  { id: "family", label: "Family" },
  { id: "confidence", label: "Confidence" },
  { id: "humour", label: "Humour" },
  { id: "calm", label: "Calm" },
  { id: "reliability", label: "Reliability" },
  { id: "emotional_maturity", label: "Emotional maturity" },
  { id: "openness", label: "Openness" },
];

const FUTURE_TOPICS = [
  { id: "marriage", label: "Marriage" },
  { id: "children_parenting", label: "Children / parenting" },
  { id: "where_to_live", label: "Where to live" },
  { id: "career_ambition", label: "Career ambition" },
  { id: "finances", label: "Finances" },
  { id: "religion_spirituality", label: "Religion / spirituality" },
  { id: "family_closeness", label: "Family closeness" },
  { id: "relationship_structure", label: "Relationship structure" },
];

const REL_STRUCTURE = [
  { value: "monogamous", label: "Monogamous", desc: "Exclusively one person" },
  { value: "open", label: "Open", desc: "Connected but non-exclusive" },
  { value: "flexible", label: "Flexible", desc: "Open to conversation — no strong stance yet" },
];

const COMMITMENT_STYLE = [
  { id: "give_generously", label: "I give generously" },
  { id: "stay_invested_through_conflict", label: "I stay invested through conflict" },
  { id: "enjoy_sharing_life_deeply", label: "I enjoy sharing life deeply" },
  { id: "focus_on_the_good", label: "I focus on the good" },
  { id: "want_to_grow_together", label: "I want to grow together" },
];

const CORE_NEED = [
  { value: "stability", label: "Stability", desc: "Groundedness and safety" },
  { value: "enjoyment", label: "Enjoyment", desc: "Fun, ease, and pleasure together" },
  { value: "care", label: "Care", desc: "Being truly looked after" },
  { value: "deep_understanding", label: "Deep understanding", desc: "Being genuinely known" },
  { value: "exploration", label: "Exploration", desc: "Growing and discovering together" },
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

function SelectCard({ option, selected, onSelect }) {
  return (
    <button
      onClick={() => onSelect(option.value)}
      className="w-full text-left p-4 rounded-2xl border-2 transition-all"
      style={{
        borderColor: selected === option.value ? "hsl(var(--primary))" : "hsl(var(--border))",
        background: selected === option.value ? "hsl(var(--primary)/0.06)" : "hsl(var(--card))",
      }}
    >
      <p className="text-sm font-semibold" style={{ color: selected === option.value ? "hsl(var(--primary))" : "hsl(var(--foreground))" }}>{option.label}</p>
      {option.desc && <p className="text-xs text-muted-foreground mt-0.5">{option.desc}</p>}
    </button>
  );
}

export default function IntentValuesSection({ onComplete }) {
  const [page, setPage] = useState(0);
  const [intent, setIntent] = useState("");
  const [readiness, setReadiness] = useState("");
  const [seriousnessResponse, setSeriousnessResponse] = useState("");
  const [coreNeed, setCoreNeed] = useState("");
  const [commitmentStyle, setCommitmentStyle] = useState([]);
  const [coreValues, setCoreValues] = useState([]);
  const [futureTopics, setFutureTopics] = useState([]);
  const [relStructure, setRelStructure] = useState("");
  const [nonNegotiableStrength, setNonNegotiableStrength] = useState(50);
  const [flexibility, setFlexibility] = useState(50);

  const togValues = (id) => setCoreValues((p) => p.includes(id) ? p.filter((x) => x !== id) : p.length < 5 ? [...p, id] : p);
  const togFuture = (id) => setFutureTopics((p) => p.includes(id) ? p.filter((x) => x !== id) : [...p, id]);
  const togCommit = (id) => setCommitmentStyle((p) => p.includes(id) ? p.filter((x) => x !== id) : p.length < 3 ? [...p, id] : p);

  const pages = [
    {
      title: "What are you looking for right now?",
      sub: "Be honest — there's no wrong answer",
      canNext: !!intent,
      content: (
        <div className="space-y-2">
          {INTENT_OPTIONS.map((o) => <SelectCard key={o.value} option={o} selected={intent} onSelect={setIntent} />)}
        </div>
      ),
    },
    {
      title: "How ready do you feel?",
      sub: "This helps us calibrate timing and pace",
      canNext: !!readiness && !!seriousnessResponse,
      content: (
        <div className="space-y-5 overflow-y-auto" style={{ maxHeight: "55vh" }}>
          <div className="space-y-2">
            {READINESS_OPTIONS.map((o) => <SelectCard key={o.value} option={o} selected={readiness} onSelect={setReadiness} />)}
          </div>
          <div>
            <p className="text-sm font-semibold mb-3">How do you usually respond when something gets serious?</p>
            <div className="space-y-2">
              {SERIOUSNESS_RESPONSE.map((o) => <SelectCard key={o.value} option={o} selected={seriousnessResponse} onSelect={setSeriousnessResponse} />)}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Values & priorities",
      sub: "Pick up to 5 — no judgment",
      canNext: coreValues.length > 0 && !!coreNeed,
      content: (
        <div className="space-y-5 overflow-y-auto" style={{ maxHeight: "55vh" }}>
          <div>
            <p className="text-xs text-muted-foreground mb-3">Select up to 5 values that matter most to you in a relationship</p>
            <Chips options={CORE_VALUES} selected={coreValues} onToggle={togValues} limit={5} />
          </div>
          <div>
            <p className="text-sm font-semibold mb-3">What do you need most in a relationship right now?</p>
            <div className="space-y-2">
              {CORE_NEED.map((o) => <SelectCard key={o.value} option={o} selected={coreNeed} onSelect={setCoreNeed} />)}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Commitment & future fit",
      sub: "Helps us understand direction and structure",
      canNext: !!relStructure,
      content: (
        <div className="space-y-6 overflow-y-auto" style={{ maxHeight: "55vh" }}>
          <div>
            <p className="text-sm font-semibold mb-1.5">When I commit to someone, I naturally…</p>
            <p className="text-xs text-muted-foreground mb-3">Select up to 3</p>
            <Chips options={COMMITMENT_STYLE} selected={commitmentStyle} onToggle={togCommit} limit={3} />
          </div>
          <div>
            <p className="text-sm font-semibold mb-3">Which future topics matter most to align on?</p>
            <Chips options={FUTURE_TOPICS} selected={futureTopics} onToggle={togFuture} />
          </div>
          <div>
            <p className="text-sm font-semibold mb-3">Relationship structure</p>
            <div className="space-y-2">
              {REL_STRUCTURE.map((o) => <SelectCard key={o.value} option={o} selected={relStructure} onSelect={setRelStructure} />)}
            </div>
          </div>
          <div className="space-y-3">
            <p className="text-sm font-semibold">How strongly do your non-negotiables need to be matched?</p>
            <input type="range" min={0} max={100} value={nonNegotiableStrength} onChange={(e) => setNonNegotiableStrength(Number(e.target.value))} className="w-full" style={{ accentColor: "hsl(var(--primary))" }} />
            <div className="flex justify-between">
              <span className="text-xs text-muted-foreground">Mostly flexible</span>
              <span className="text-xs text-muted-foreground">Strongly non-negotiable</span>
            </div>
          </div>
          <div className="space-y-3">
            <p className="text-sm font-semibold">How flexible are you overall on intent and values?</p>
            <input type="range" min={0} max={100} value={flexibility} onChange={(e) => setFlexibility(Number(e.target.value))} className="w-full" style={{ accentColor: "hsl(var(--primary))" }} />
            <div className="flex justify-between">
              <span className="text-xs text-muted-foreground">Very specific</span>
              <span className="text-xs text-muted-foreground">Open on some things</span>
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
          else onComplete({ intent, readiness, seriousnessResponse, coreNeed, commitmentStyle, coreValues, futureTopics, relStructure, nonNegotiableStrength, flexibility });
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