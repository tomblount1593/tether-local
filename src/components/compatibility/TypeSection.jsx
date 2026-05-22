import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const FACE_AESTHETICS = [
  { id: "cute_boy_next_door", label: "Boy-next-door", sub: "Cute, approachable, fresh" },
  { id: "handsome_classic", label: "Classic handsome", sub: "Timeless, clean, strong" },
  { id: "rugged_masculine", label: "Rugged", sub: "Masculine, textured, raw" },
  { id: "pretty_refined", label: "Pretty & refined", sub: "Delicate features, elegant" },
  { id: "striking_editorial", label: "Striking", sub: "Editorial, unusual, memorable" },
  { id: "mature_sophisticated", label: "Mature", sub: "Seasoned, distinguished, assured" },
  { id: "soft_gentle", label: "Soft & gentle", sub: "Kind features, warm eyes" },
];

const GROOMING = [
  { id: "clean_put_together", label: "Clean & put-together" },
  { id: "slightly_scruffy", label: "Slightly scruffy" },
  { id: "very_well_groomed", label: "Very well groomed" },
  { id: "natural_low_effort", label: "Natural, low-effort" },
  { id: "intentional_style", label: "Intentional style" },
  { id: "looks_after_themselves", label: "Clearly looks after himself" },
  { id: "healthy_fresh", label: "Healthy & fresh" },
];

const FACIAL_HAIR = [
  { id: "clean_shaven", label: "Clean shaven" },
  { id: "light_stubble", label: "Light stubble" },
  { id: "heavy_stubble", label: "Heavy stubble" },
  { id: "short_beard", label: "Short beard" },
  { id: "full_beard", label: "Full beard" },
  { id: "long_beard", label: "Long beard" },
  { id: "moustache", label: "Moustache" },
  { id: "goatee", label: "Goatee" },
];

const HAIR_STYLE = [
  { id: "bald_shaved", label: "Bald / shaved" },
  { id: "buzz_cut", label: "Buzz cut" },
  { id: "short_clean", label: "Short & clean" },
  { id: "textured_short", label: "Textured short" },
  { id: "medium_flow", label: "Medium / flow" },
  { id: "long_hair", label: "Long hair" },
  { id: "curly_textured", label: "Curly / textured" },
  { id: "dyed_alternative", label: "Dyed / alternative" },
];

const FACE_DETAILS = [
  { id: "nice_smile", label: "Nice smile" },
  { id: "straight_teeth", label: "Straight teeth" },
  { id: "bright_eyes", label: "Bright eyes" },
  { id: "expressive_eyes", label: "Expressive eyes" },
  { id: "strong_jawline", label: "Strong jawline" },
  { id: "soft_features", label: "Soft features" },
  { id: "intense_look", label: "Intense look" },
  { id: "warm_friendly", label: "Warm & friendly" },
];

const BODY_TYPES = [
  { id: "slim", label: "Slim" },
  { id: "lean", label: "Lean" },
  { id: "athletic", label: "Athletic" },
  { id: "muscular", label: "Muscular" },
  { id: "broad", label: "Broad" },
  { id: "stocky", label: "Stocky" },
  { id: "soft_dadbod", label: "Soft / dadbod" },
];

const HEIGHT_PREF = [
  { id: "shorter_than_me", label: "Shorter than me" },
  { id: "same_height", label: "Same height" },
  { id: "slightly_taller", label: "Slightly taller" },
  { id: "much_taller", label: "Much taller" },
  { id: "no_preference", label: "No preference" },
];

const STYLE_VISUAL = [
  { id: "clean_cut", label: "Clean-cut" },
  { id: "sporty", label: "Sporty" },
  { id: "casual", label: "Casual" },
  { id: "rugged", label: "Rugged" },
  { id: "artsy", label: "Artsy" },
  { id: "streetwear", label: "Streetwear" },
  { id: "minimal", label: "Minimal" },
  { id: "fashion_forward", label: "Fashion-forward" },
  { id: "glasses", label: "Glasses" },
  { id: "tattoos", label: "Tattoos" },
  { id: "piercings", label: "Piercings" },
  { id: "jewellery", label: "Jewellery" },
  { id: "body_hair", label: "Body hair" },
];

function MultiChips({ options, selected, onToggle, limit }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => {
        const isSelected = selected.includes(o.id);
        return (
          <button
            key={o.id}
            onClick={() => {
              if (isSelected) onToggle(o.id);
              else if (!limit || selected.length < limit) onToggle(o.id);
            }}
            className="py-2 px-3.5 rounded-full text-sm font-medium border transition-all"
            style={{
              background: isSelected ? "hsl(var(--primary))" : "hsl(var(--secondary))",
              color: isSelected ? "hsl(var(--primary-foreground))" : "hsl(var(--foreground))",
              borderColor: isSelected ? "hsl(var(--primary))" : "transparent",
            }}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

function AestheticCards({ options, selected, onToggle }) {
  return (
    <div className="grid grid-cols-2 gap-2.5">
      {options.map((o) => {
        const isSelected = selected.includes(o.id);
        return (
          <button
            key={o.id}
            onClick={() => onToggle(o.id)}
            className="text-left p-4 rounded-2xl border-2 transition-all"
            style={{
              borderColor: isSelected ? "hsl(var(--primary))" : "hsl(var(--border))",
              background: isSelected ? "hsl(var(--primary)/0.07)" : "hsl(var(--card))",
            }}
          >
            <p className="text-sm font-semibold" style={{ color: isSelected ? "hsl(var(--primary))" : "hsl(var(--foreground))" }}>{o.label}</p>
            {o.sub && <p className="text-[11px] text-muted-foreground mt-0.5">{o.sub}</p>}
          </button>
        );
      })}
    </div>
  );
}

function SliderField({ label, sublabel, value, onChange, leftLabel, rightLabel }) {
  return (
    <div className="space-y-3">
      <div>
        <p className="text-base font-heading font-semibold">{label}</p>
        {sublabel && <p className="text-sm text-muted-foreground mt-1">{sublabel}</p>}
      </div>
      <div className="space-y-2">
        <input
          type="range" min={0} max={100} value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full"
          style={{ accentColor: "hsl(var(--primary))" }}
        />
        <div className="flex justify-between">
          <span className="text-xs text-muted-foreground">{leftLabel}</span>
          <span className="text-xs text-muted-foreground">{rightLabel}</span>
        </div>
      </div>
    </div>
  );
}

export default function TypeSection({ onComplete }) {
  const [page, setPage] = useState(0);
  const [faceDirection, setFaceDirection] = useState(50);
  const [faceAesthetics, setFaceAesthetics] = useState([]);
  const [grooming, setGrooming] = useState([]);
  const [facialHair, setFacialHair] = useState([]);
  const [hairStyle, setHairStyle] = useState([]);
  const [faceDetails, setFaceDetails] = useState([]);
  const [bodyTypes, setBodyTypes] = useState([]);
  const [heightPref, setHeightPref] = useState([]);
  const [styleVisual, setStyleVisual] = useState([]);
  const [flexibility, setFlexibility] = useState(50);

  const toggle = (setter) => (id) => setter((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);

  const pages = [
    {
      title: "Overall look",
      sub: "Select all that feel honest",
      canNext: faceAesthetics.length > 0,
      content: (
        <div className="space-y-5 overflow-y-auto" style={{ maxHeight: "55vh" }}>
          <SliderField
            label="What overall look draws you in?"
            sublabel=""
            value={faceDirection}
            onChange={setFaceDirection}
            leftLabel="Soft / boyish"
            rightLabel="Sharp / defined"
          />
          <div>
            <p className="text-sm font-semibold mb-1.5">Which looks feel like your type?</p>
            <p className="text-xs text-muted-foreground mb-3">Select all that apply</p>
            <AestheticCards options={FACE_AESTHETICS} selected={faceAesthetics} onToggle={toggle(setFaceAesthetics)} />
          </div>
        </div>
      ),
    },
    {
      title: "Grooming & hair",
      sub: "Select all that feel attractive to you",
      canNext: true,
      content: (
        <div className="space-y-5 overflow-y-auto" style={{ maxHeight: "55vh" }}>
          <div>
            <p className="text-sm font-semibold mb-3">Presentation styles you find attractive</p>
            <MultiChips options={GROOMING} selected={grooming} onToggle={toggle(setGrooming)} />
          </div>
          <div>
            <p className="text-sm font-semibold mb-3">Facial hair</p>
            <MultiChips options={FACIAL_HAIR} selected={facialHair} onToggle={toggle(setFacialHair)} />
          </div>
          <div>
            <p className="text-sm font-semibold mb-3">Hair style</p>
            <MultiChips options={HAIR_STYLE} selected={hairStyle} onToggle={toggle(setHairStyle)} />
          </div>
        </div>
      ),
    },
    {
      title: "Details & body",
      sub: "Select all that apply",
      canNext: true,
      content: (
        <div className="space-y-5 overflow-y-auto" style={{ maxHeight: "55vh" }}>
          <div>
            <p className="text-sm font-semibold mb-3">Facial details that stand out to you</p>
            <MultiChips options={FACE_DETAILS} selected={faceDetails} onToggle={toggle(setFaceDetails)} />
          </div>
          <div>
            <p className="text-sm font-semibold mb-3">Body types you find attractive</p>
            <MultiChips options={BODY_TYPES} selected={bodyTypes} onToggle={toggle(setBodyTypes)} />
          </div>
          <div>
            <p className="text-sm font-semibold mb-3">Height dynamic</p>
            <MultiChips options={HEIGHT_PREF} selected={heightPref} onToggle={toggle(setHeightPref)} />
          </div>
        </div>
      ),
    },
    {
      title: "Style & flexibility",
      sub: "Final touches",
      canNext: true,
      content: (
        <div className="space-y-6 overflow-y-auto" style={{ maxHeight: "55vh" }}>
          <div>
            <p className="text-sm font-semibold mb-3">Style details that make someone more your type</p>
            <p className="text-xs text-muted-foreground mb-3">Select all that apply</p>
            <MultiChips options={STYLE_VISUAL} selected={styleVisual} onToggle={toggle(setStyleVisual)} />
          </div>
          <SliderField
            label="How flexible are you on physical type?"
            sublabel="This helps us know whether to match closely or explore slightly beyond."
            value={flexibility}
            onChange={setFlexibility}
            leftLabel="Very specific"
            rightLabel="Very open"
          />
        </div>
      ),
    },
  ];

  const current = pages[page];

  const handleNext = () => {
    if (page < pages.length - 1) setPage((p) => p + 1);
    else onComplete({ faceDirection, faceAesthetics, grooming, facialHair, hairStyle, faceDetails, bodyTypes, heightPref, styleVisual, flexibility });
  };

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
      <Button onClick={handleNext} disabled={!current.canNext} className="rounded-full w-full">
        {page < pages.length - 1 ? "Continue" : "Complete Section"}
        <ArrowRight className="w-4 h-4 ml-2" />
      </Button>
    </div>
  );
}