import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const SELF_ENERGY = [
  { id: "polished", label: "Polished", sub: "Put-together, refined, clean" },
  { id: "relaxed", label: "Relaxed", sub: "Easy, unhurried, approachable" },
  { id: "creative", label: "Creative", sub: "Expressive, artistic, distinctive" },
  { id: "professional", label: "Professional", sub: "Structured, capable, assured" },
  { id: "sporty", label: "Sporty", sub: "Athletic, energetic, physical" },
  { id: "warm", label: "Warm", sub: "Open, inviting, generous" },
  { id: "understated", label: "Understated", sub: "Quiet confidence, no performance" },
  { id: "confident", label: "Confident", sub: "Present, grounded, certain" },
];

const INTENDED_IMPRESSION = [
  { id: "attractive", label: "Attractive" },
  { id: "approachable", label: "Approachable" },
  { id: "high_quality", label: "High-quality" },
  { id: "fun", label: "Fun" },
  { id: "serious_about_dating", label: "Serious about dating" },
  { id: "warm", label: "Warm" },
  { id: "confident", label: "Confident" },
];

const ENERGY_VIBE_PREF = [
  { id: "polished", label: "Polished" },
  { id: "relaxed", label: "Relaxed" },
  { id: "creative", label: "Creative" },
  { id: "grounded", label: "Grounded" },
  { id: "confident", label: "Confident" },
  { id: "soft", label: "Soft" },
  { id: "high_energy", label: "High energy" },
  { id: "understated", label: "Understated" },
];

const SEXUAL_ROLE = [
  { value: "top", label: "Top" },
  { value: "bottom", label: "Bottom" },
  { value: "versatile", label: "Versatile" },
  { value: "side", label: "Side" },
  { value: "flexible_depends_on_chemistry", label: "Flexible — depends on chemistry" },
];

const SEXUAL_DYNAMIC = [
  { value: "clearly_complementary", label: "Clearly complementary dynamic", desc: "I prefer a clear top/bottom dynamic" },
  { value: "another_versatile", label: "Another versatile person", desc: "Flexibility matters more than role" },
  { value: "flexible_depends_on_connection", label: "Flexible — depends on connection", desc: "Chemistry defines it each time" },
  { value: "still_exploring", label: "Still exploring", desc: "I'm figuring this out" },
];

const INTIMACY_PRIORITIES = [
  { id: "chemistry", label: "Chemistry" },
  { id: "affection", label: "Affection" },
  { id: "confidence", label: "Confidence" },
  { id: "emotional_safety", label: "Emotional safety" },
  { id: "playfulness", label: "Playfulness" },
  { id: "passion", label: "Passion" },
  { id: "consistency", label: "Consistency" },
  { id: "exploration", label: "Exploration" },
  { id: "tenderness", label: "Tenderness" },
  { id: "compatibility_from_start", label: "Compatibility from the start" },
];

const PRIVATE_BOUNDARIES = [
  { id: "monogamous_sexually", label: "Monogamous sexually" },
  { id: "open_to_non_monogamy", label: "Open to non-monogamy" },
  { id: "affectionate_touch_oriented", label: "Affectionate / touch-oriented" },
  { id: "more_reserved_physically", label: "More reserved physically" },
  { id: "lower_sexual_frequency", label: "Lower sexual frequency" },
  { id: "higher_sexual_frequency", label: "Higher sexual frequency" },
  { id: "sober_intimacy_preference", label: "Sober intimacy preference" },
  { id: "sti_conscious", label: "STI-conscious preferences" },
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

function EnergyCard({ option, selected, onToggle }) {
  const sel = selected.includes(option.id);
  return (
    <button
      onClick={() => onToggle(option.id)}
      className="text-left p-4 rounded-2xl border-2 transition-all"
      style={{
        borderColor: sel ? "hsl(var(--primary))" : "hsl(var(--border))",
        background: sel ? "hsl(var(--primary)/0.07)" : "hsl(var(--card))",
      }}
    >
      <p className="text-sm font-semibold" style={{ color: sel ? "hsl(var(--primary))" : "hsl(var(--foreground))" }}>{option.label}</p>
      <p className="text-[11px] text-muted-foreground mt-0.5">{option.sub}</p>
    </button>
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

export default function PresentationSection({ onComplete }) {
  const [page, setPage] = useState(0);
  const [selfEnergy, setSelfEnergy] = useState([]);
  const [intendedImpression, setIntendedImpression] = useState([]);
  const [energyVibePref, setEnergyVibePref] = useState([]);
  const [sexualRole, setSexualRole] = useState("");
  const [sexualDynamic, setSexualDynamic] = useState("");
  const [intimacyPriorities, setIntimacyPriorities] = useState([]);
  const [affectionImportance, setAffectionImportance] = useState(75);
  const [privateBoundaries, setPrivateBoundaries] = useState([]);
  const [flexibility, setFlexibility] = useState(50);

  const tog = (setter) => (id) => setter((p) => p.includes(id) ? p.filter((x) => x !== id) : [...p, id]);
  const togIP = (id) => setIntimacyPriorities((p) => p.includes(id) ? p.filter((x) => x !== id) : p.length < 5 ? [...p, id] : p);

  const pages = [
    {
      title: "Your energy & vibe",
      sub: "Be honest — this shapes who finds you first",
      canNext: selfEnergy.length > 0,
      content: (
        <div className="space-y-5 overflow-y-auto" style={{ maxHeight: "55vh" }}>
          <div>
            <p className="text-sm font-semibold mb-3">What energy do you naturally give off?</p>
            <p className="text-xs text-muted-foreground mb-3">Select all that apply</p>
            <div className="grid grid-cols-2 gap-2.5">
              {SELF_ENERGY.map((o) => <EnergyCard key={o.id} option={o} selected={selfEnergy} onToggle={tog(setSelfEnergy)} />)}
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold mb-3">What first impression do you want to give?</p>
            <Chips options={INTENDED_IMPRESSION} selected={intendedImpression} onToggle={tog(setIntendedImpression)} />
          </div>
          <div>
            <p className="text-sm font-semibold mb-3">What energy are you usually drawn to?</p>
            <Chips options={ENERGY_VIBE_PREF} selected={energyVibePref} onToggle={tog(setEnergyVibePref)} />
          </div>
        </div>
      ),
    },
    {
      title: "Physical & intimacy fit",
      sub: "Private — used only for matching accuracy",
      canNext: !!sexualRole && !!sexualDynamic,
      content: (
        <div className="space-y-5 overflow-y-auto" style={{ maxHeight: "55vh" }}>
          <div>
            <p className="text-sm font-semibold mb-3">What feels most natural for you sexually?</p>
            <div className="grid grid-cols-2 gap-2">
              {SEXUAL_ROLE.map((o) => (
                <button
                  key={o.value}
                  onClick={() => setSexualRole(o.value)}
                  className="py-3 px-3 rounded-xl text-sm font-medium border transition-all"
                  style={{
                    background: sexualRole === o.value ? "hsl(var(--primary))" : "hsl(var(--secondary))",
                    color: sexualRole === o.value ? "hsl(var(--primary-foreground))" : "hsl(var(--foreground))",
                    borderColor: sexualRole === o.value ? "hsl(var(--primary))" : "transparent",
                  }}
                >
                  {o.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold mb-3">What dynamic usually works best?</p>
            <div className="space-y-2">
              {SEXUAL_DYNAMIC.map((o) => <SelectCard key={o.value} option={o} selected={sexualDynamic} onSelect={setSexualDynamic} />)}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Intimacy priorities",
      sub: "Used only to improve compatibility accuracy",
      canNext: true,
      content: (
        <div className="space-y-5 overflow-y-auto" style={{ maxHeight: "55vh" }}>
          <div>
            <p className="text-sm font-semibold mb-1.5">What matters most for intimacy compatibility?</p>
            <p className="text-xs text-muted-foreground mb-3">Select up to 5</p>
            <Chips options={INTIMACY_PRIORITIES} selected={intimacyPriorities} onToggle={togIP} limit={5} />
          </div>
          <div className="space-y-3">
            <p className="text-sm font-semibold">How important is physical affection outside sex?</p>
            <input type="range" min={0} max={100} value={affectionImportance} onChange={(e) => setAffectionImportance(Number(e.target.value))} className="w-full" style={{ accentColor: "hsl(var(--primary))" }} />
            <div className="flex justify-between">
              <span className="text-xs text-muted-foreground">Not a major factor</span>
              <span className="text-xs text-muted-foreground">Very important</span>
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold mb-1.5">Is there anything matching should quietly respect?</p>
            <p className="text-xs text-muted-foreground mb-3">Select all that apply — this is private</p>
            <Chips options={PRIVATE_BOUNDARIES} selected={privateBoundaries} onToggle={tog(setPrivateBoundaries)} />
          </div>
          <div className="space-y-3">
            <p className="text-sm font-semibold">How flexible are you on vibe, chemistry and intimacy fit?</p>
            <input type="range" min={0} max={100} value={flexibility} onChange={(e) => setFlexibility(Number(e.target.value))} className="w-full" style={{ accentColor: "hsl(var(--primary))" }} />
            <div className="flex justify-between">
              <span className="text-xs text-muted-foreground">Very specific</span>
              <span className="text-xs text-muted-foreground">Very open</span>
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
      <div className="overflow-y-auto" style={{ maxHeight: "55vh" }}>{current.content}</div>
      <Button
        onClick={() => {
          if (page < pages.length - 1) setPage((p) => p + 1);
          else onComplete({ selfEnergy, intendedImpression, energyVibePref, sexualRole, sexualDynamic, intimacyPriorities, affectionImportance, privateBoundaries, flexibility });
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