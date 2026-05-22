import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const LIFESTYLE_IDENTITY = [
  { id: "social_and_outgoing", label: "Social & outgoing" },
  { id: "low_key_and_private", label: "Low-key & private" },
  { id: "routine_oriented", label: "Routine-oriented" },
  { id: "spontaneous", label: "Spontaneous" },
  { id: "scene_connected", label: "Scene-connected" },
  { id: "non_scene", label: "Non-scene" },
  { id: "saver", label: "Saver" },
  { id: "spender", label: "Spender" },
  { id: "career_first", label: "Career-first" },
  { id: "balance_first", label: "Balance-first" },
  { id: "planner", label: "Planner" },
  { id: "flexible", label: "Flexible" },
  { id: "wellness_focused", label: "Wellness-focused" },
  { id: "nightlife_oriented", label: "Nightlife-oriented" },
];

const WEEKEND_OPTIONS = [
  { id: "brunch_gym_dinner", label: "Brunch, gym, dinner", sub: "Active and social" },
  { id: "gallery_coffee_quiet_night", label: "Gallery, coffee, quiet night", sub: "Cultural and considered" },
  { id: "party_friends_late_night", label: "Party with friends, late night", sub: "High energy, social" },
  { id: "outdoors_reset", label: "Outdoors reset", sub: "Physical and grounding" },
  { id: "home_cooking_film_night", label: "Home cooking, film night", sub: "Cosy and domestic" },
  { id: "spontaneous_trip_away", label: "Spontaneous trip away", sub: "Adventurous and exploring" },
];

const PRACTICAL_DIFFERENCES = [
  { id: "different_sleep_schedules", label: "Different sleep schedules" },
  { id: "different_social_energy", label: "Different social energy" },
  { id: "different_work_intensity", label: "Different work intensity" },
  { id: "different_spending_habits", label: "Different spending habits" },
  { id: "different_cleanliness_levels", label: "Different cleanliness standards" },
  { id: "different_nightlife_preferences", label: "Different nightlife preferences" },
];

const COMMUNICATION_STYLE = [
  { id: "frequent_messages", label: "Frequent messages" },
  { id: "steady_not_constant", label: "Steady but not constant" },
  { id: "more_in_person_than_text", label: "More in-person than text" },
  { id: "playful_flirty", label: "Playful & flirty" },
  { id: "thoughtful_deeper", label: "Thoughtful and deeper" },
];

const CONFLICT_RESPONSE = [
  { value: "address_it_directly", label: "Address it directly", desc: "I face it head-on as soon as it's clear" },
  { value: "need_time_then_talk", label: "I need time then talk", desc: "I process first, then engage" },
  { value: "avoid_it_hope_fades", label: "I avoid it and hope it fades", desc: "Conflict makes me retreat" },
  { value: "emotionally_reactive", label: "I get emotionally reactive", desc: "Tension can bring out a bigger response" },
  { value: "go_quiet_withdraw", label: "I go quiet and withdraw", desc: "I pull back until I feel safe" },
];

const REPAIR_PREFERENCE = [
  { value: "directly_and_clearly", label: "Directly and clearly", desc: "I need it said plainly" },
  { value: "gently_and_reassuringly", label: "Gently and reassuringly", desc: "Warmth matters more than logic here" },
  { value: "give_me_space_first", label: "Give me space first", desc: "Let me come back to it when ready" },
  { value: "calmly_and_practically", label: "Calmly and practically", desc: "Low emotion, practical resolution" },
];

const LIFESTYLE_AXES = [
  { key: "social_vs_lowkey", left: "Low-key", right: "Social" },
  { key: "routine_vs_spontaneous", left: "Routine", right: "Spontaneous" },
  { key: "scene_vs_nonscene", left: "Non-scene", right: "Scene-connected" },
  { key: "saver_vs_spender", left: "Saver", right: "Spender" },
  { key: "career_vs_balance", left: "Balance-first", right: "Career-first" },
  { key: "planner_vs_flexible", left: "Planner", right: "Flexible" },
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

export default function LifestyleSection({ onComplete }) {
  const [page, setPage] = useState(0);
  const [lifestyleIdentity, setLifestyleIdentity] = useState([]);
  const [idealWeekend, setIdealWeekend] = useState([]);
  const [axisValues, setAxisValues] = useState({ social_vs_lowkey: 50, routine_vs_spontaneous: 50, scene_vs_nonscene: 50, saver_vs_spender: 50, career_vs_balance: 50, planner_vs_flexible: 50 });
  const [practicalDifferences, setPracticalDifferences] = useState([]);
  const [communicationStyle, setCommunicationStyle] = useState([]);
  const [conflictResponse, setConflictResponse] = useState("");
  const [repairPreference, setRepairPreference] = useState("");
  const [flexibility, setFlexibility] = useState(50);

  const togLS = (id) => setLifestyleIdentity((p) => p.includes(id) ? p.filter((x) => x !== id) : [...p, id]);
  const togWk = (id) => setIdealWeekend((p) => p.includes(id) ? p.filter((x) => x !== id) : p.length < 3 ? [...p, id] : p);
  const togPD = (id) => setPracticalDifferences((p) => p.includes(id) ? p.filter((x) => x !== id) : [...p, id]);
  const togCS = (id) => setCommunicationStyle((p) => p.includes(id) ? p.filter((x) => x !== id) : [...p, id]);

  const pages = [
    {
      title: "Which lifestyle patterns feel most like you?",
      sub: "Select all that apply",
      canNext: lifestyleIdentity.length > 0,
      content: (
        <div className="space-y-5 overflow-y-auto" style={{ maxHeight: "55vh" }}>
          <Chips options={LIFESTYLE_IDENTITY} selected={lifestyleIdentity} onToggle={togLS} />
          <div>
            <p className="text-sm font-semibold mb-1.5">What kind of weekend feels best?</p>
            <p className="text-xs text-muted-foreground mb-3">Choose up to 3</p>
            <div className="grid grid-cols-2 gap-2.5">
              {WEEKEND_OPTIONS.map((o) => {
                const sel = idealWeekend.includes(o.id);
                return (
                  <button
                    key={o.id}
                    onClick={() => togWk(o.id)}
                    className="text-left p-3.5 rounded-2xl border-2 transition-all"
                    style={{
                      borderColor: sel ? "hsl(var(--primary))" : "hsl(var(--border))",
                      background: sel ? "hsl(var(--primary)/0.07)" : "hsl(var(--card))",
                    }}
                  >
                    <p className="text-sm font-semibold" style={{ color: sel ? "hsl(var(--primary))" : "hsl(var(--foreground))" }}>{o.label}</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">{o.sub}</p>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Where do you sit on these?",
      sub: "Drag each slider to where you naturally land",
      canNext: true,
      content: (
        <div className="space-y-5 overflow-y-auto" style={{ maxHeight: "55vh" }}>
          {LIFESTYLE_AXES.map((axis) => (
            <div key={axis.key} className="space-y-1.5">
              <div className="flex justify-between">
                <span className="text-xs text-muted-foreground">{axis.left}</span>
                <span className="text-xs text-muted-foreground">{axis.right}</span>
              </div>
              <input
                type="range" min={0} max={100}
                value={axisValues[axis.key]}
                onChange={(e) => setAxisValues((prev) => ({ ...prev, [axis.key]: Number(e.target.value) }))}
                className="w-full"
                style={{ accentColor: "hsl(var(--primary))" }}
              />
            </div>
          ))}
          <div>
            <p className="text-sm font-semibold mb-3">Which practical differences are okay for you in a relationship?</p>
            <Chips options={PRACTICAL_DIFFERENCES} selected={practicalDifferences} onToggle={togPD} />
          </div>
        </div>
      ),
    },
    {
      title: "Communication & conflict",
      sub: "How you naturally connect and navigate tension",
      canNext: !!conflictResponse && !!repairPreference,
      content: (
        <div className="space-y-5 overflow-y-auto" style={{ maxHeight: "55vh" }}>
          <div>
            <p className="text-sm font-semibold mb-3">How do you naturally communicate interest?</p>
            <Chips options={COMMUNICATION_STYLE} selected={communicationStyle} onToggle={togCS} />
          </div>
          <div>
            <p className="text-sm font-semibold mb-3">When tension comes up, I usually…</p>
            <div className="space-y-2">
              {CONFLICT_RESPONSE.map((o) => <SelectCard key={o.value} option={o} selected={conflictResponse} onSelect={setConflictResponse} />)}
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold mb-3">How do you prefer someone handles tension with you?</p>
            <div className="space-y-2">
              {REPAIR_PREFERENCE.map((o) => <SelectCard key={o.value} option={o} selected={repairPreference} onSelect={setRepairPreference} />)}
            </div>
          </div>
          <div className="space-y-3">
            <p className="text-sm font-semibold">How flexible are you on lifestyle & day-to-day fit?</p>
            <input type="range" min={0} max={100} value={flexibility} onChange={(e) => setFlexibility(Number(e.target.value))} className="w-full" style={{ accentColor: "hsl(var(--primary))" }} />
            <div className="flex justify-between">
              <span className="text-xs text-muted-foreground">Need very close alignment</span>
              <span className="text-xs text-muted-foreground">Open if connection is strong</span>
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
          else onComplete({ lifestyleIdentity, idealWeekend, axisValues, practicalDifferences, communicationStyle, conflictResponse, repairPreference, flexibility });
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