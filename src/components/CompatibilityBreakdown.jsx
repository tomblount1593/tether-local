import {
  AudioWaveform,
  Bird,
  BriefcaseBusiness,
  Cat,
  ChevronUp,
  Coffee,
  ChevronLeft,
  ChevronRight,
  Compass,
  Dog,
  Fish,
  GraduationCap,
  Heart,
  House,
  Languages,
  MapPin,
  MessageSquareText,
  Orbit,
  Rabbit,
  ShieldCheck,
  Star,
  Sparkles,
  Sunrise,
  Turtle,
  UserRound,
  X,
} from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import CompatibilityScoreBadge from "./CompatibilityScoreBadge";
import { useCurrentMatch } from "@/hooks/useCurrentMatch";
import { getCompatibilityBreakdownForMatch } from "@/data/demo/demoCompatibilityBreakdowns";
import { getCompatibilityTone } from "@/lib/compatibilityTone";
import BackButton from "@/components/BackButton";
import { hashSeed } from "@/data/demo/demoMatchPoolSelector";
import { getZodiacSign } from "@/utils/zodiac";
import { getZodiacCompatibility } from "@/data/demo/zodiacCompatibility";
import { useTier } from "@/hooks/useTier";
import { getProfilePreviewTheme } from "@/lib/profilePreviewTheme";

function getBreakdownTheme(tier) {
  if (tier === "premium") {
    return {
      darkHeader: "#37423a",
      darkText: "#f8f3f1",
      lightSurface: "#5b655d",
      lightText: "#f8f3f1",
      border: "rgba(248, 243, 241, 0.30)",
      muted: "rgba(248, 243, 241, 0.84)",
      cardSurface: "#5b655d",
      sectionSurface: "#5b655d",
      sectionHeaderSurface: "#737973",
      sectionHeaderText: "#f8f3f1",
      sectionBodyText: "rgba(248, 243, 241, 0.84)",
      chipSurface: "rgba(248, 243, 241, 0.10)",
      chipText: "#f8f3f1",
      noticeSurface: "#737973",
      noticeText: "#f8f3f1",
      atAGlanceSurface: "#737973",
      atAGlanceChipSurface: "#5b655d",
      atAGlanceChipText: "#f8f3f1",
    };
  }
  if (tier === "concierge") {
    return {
      darkHeader: "#d0c7b4",
      darkText: "#0b0c0a",
      lightSurface: "#242623",
      lightText: "#d2c6b2",
      border: "rgba(210, 198, 178, 0.30)",
      muted: "rgba(210, 198, 178, 0.84)",
      cardSurface: "#242623",
      sectionSurface: "#242623",
      sectionHeaderSurface: "#d0c7b4",
      sectionHeaderText: "#0b0c0a",
      sectionBodyText: "rgba(210, 198, 178, 0.86)",
      chipSurface: "rgba(210, 198, 178, 0.10)",
      chipText: "#d2c6b2",
      noticeSurface: "#242623",
      noticeText: "#d2c6b2",
      atAGlanceSurface: "#d2c6b2",
      atAGlanceChipSurface: "#242623",
      atAGlanceChipText: "#d2c6b2",
    };
  }
  return {
    darkHeader: "#37423a",
    darkText: "#f8f3f1",
    lightSurface: "#f8f3f1",
    lightText: "#37423a",
    border: "rgba(55, 66, 58, 0.18)",
    muted: "rgba(55, 66, 58, 0.82)",
    cardSurface: "#f8f3f1",
    sectionSurface: "#f8f3f1",
    sectionHeaderSurface: "#e7e5e1",
    sectionHeaderText: "#37423a",
    sectionBodyText: "hsl(var(--muted-foreground))",
    chipSurface: "#f8f3f1",
    chipText: "hsl(var(--muted-foreground))",
    noticeSurface: "#e7e5e1",
    noticeText: "#6d786d",
    atAGlanceSurface: "#37423a",
    atAGlanceChipSurface: "#e7e5e2",
    atAGlanceChipText: "hsl(var(--muted-foreground))",
  };
}

function clampHeading(fontMin, fontPreferred, fontMax) {
  return `clamp(${fontMin}px, ${fontPreferred}vw, ${fontMax}px)`;
}

const TITLE_SIZE = clampHeading(17, 4.4, 21);
const CARD_TITLE_SIZE = clampHeading(15, 3.95, 17);
const SUBTITLE_SIZE = clampHeading(12, 3.1, 14);
const BODY_SIZE = SUBTITLE_SIZE;
const INLINE_LABEL_SIZE = clampHeading(13, 3.35, 15);

function getHeaderScoreStyle(score, tier) {
  const tone = getCompatibilityTone(score, tier, "dark");
  return {
    text: tone.text,
    track: tone.track,
  };
}

function getSummaryBadgePalette(tier) {
  if (tier === "premium") {
    return {
      text: "#f8f3f1",
      track: "rgba(248, 243, 241, 0.24)",
    };
  }

  if (tier === "concierge") {
    return {
      text: "#d8c6ae",
      track: "rgba(216, 198, 174, 0.24)",
    };
  }

  return {
    text: "#37423a",
    track: "rgba(55, 66, 58, 0.18)",
  };
}

function normalizeCompatibilityHeading(title) {
  const normalized = String(title || "").trim();
  if (normalized === "Type Marker") return "Your Type Insights";
  if (normalized === "Romantic Pattern Marker") return "Romantic Pattern Insights";
  if (normalized === "Intent & Values Marker") return "Intent & Values Insights";
  if (normalized === "Lifestyle & Social Fit Marker") return "Lifestyle & Social Fit Insights";
  if (normalized === "First Impression & Vibe Marker") return "First Impression & Vibe Insights";
  if (normalized === "Star Sign Compatibility") return "Astrology Alignment Insights";
  if (normalized === "Tether Compatibility Opinion") return "Tether Compatibility Insights";
  return normalized;
}

function stripZodiacGlyphs(value) {
  return String(value || "").replace(/[♈-♓︎]/g, "").replace(/\s+\+\s+/g, " + ").trim();
}

const ZODIAC_SYMBOLS = {
  Aries: "♈︎",
  Taurus: "♉︎",
  Gemini: "♊︎",
  Cancer: "♋︎",
  Leo: "♌︎",
  Virgo: "♍︎",
  Libra: "♎︎",
  Scorpio: "♏︎",
  Sagittarius: "♐︎",
  Capricorn: "♑︎",
  Aquarius: "♒︎",
  Pisces: "♓︎",
};

const STAR_SIGN_PAIR_COPY = {
  "Taurus|Virgo": {
    strengths: "Steady emotional rhythm, grounded communication, and shared loyalty.",
    watchouts: "Both may avoid direct tension, so small issues should be addressed early.",
  },
  "Taurus|Cancer": {
    strengths: "Warmth, loyalty, emotional steadiness, and strong home-life compatibility.",
    watchouts: "Both may hold onto hurt longer than necessary.",
  },
  "Gemini|Libra": {
    strengths: "Easy conversation, humour, social rhythm, and intellectual curiosity.",
    watchouts: "Depth may need to be built intentionally rather than assumed.",
  },
  "Leo|Scorpio": {
    strengths: "Strong attraction, loyalty, intensity, and emotional magnetism.",
    watchouts: "Power dynamics or pride may need careful communication.",
  },
};

function cleanStarSignName(value) {
  return stripZodiacGlyphs(value).replace(/\s+/g, " ").trim();
}

function formatStarSignLine(userSign, matchSign) {
  const userName = cleanStarSignName(userSign);
  const matchName = cleanStarSignName(matchSign);
  const userSymbol = ZODIAC_SYMBOLS[userName] || "";
  const matchSymbol = ZODIAC_SYMBOLS[matchName] || "";
  return {
    userName,
    matchName,
    userSymbol,
    matchSymbol,
  };
}

function getAstrologyCopy(starSignCompatibility = {}, context = {}, active = {}) {
  const derivedCompatibility = getZodiacCompatibility(context?.birthDate || "1993-05-01", active?.birthDate || "1993-09-14");
  const fallbackUserSign = getZodiacSign(context?.birthDate || "") || derivedCompatibility.userSign || "";
  const fallbackMatchSign = active?.zodiac || getZodiacSign(active?.birthDate || "") || derivedCompatibility.matchSign || "";
  const userName = cleanStarSignName(starSignCompatibility.userSign || fallbackUserSign);
  const matchName = cleanStarSignName(starSignCompatibility.matchSign || fallbackMatchSign);
  const pairKey = `${userName}|${matchName}`;
  const reversePairKey = `${matchName}|${userName}`;
  const pairCopy = STAR_SIGN_PAIR_COPY[pairKey] || STAR_SIGN_PAIR_COPY[reversePairKey];
  const summaryText = String(starSignCompatibility.summary || "").trim();

  const strengthsText = Array.isArray(starSignCompatibility.strengths) && starSignCompatibility.strengths.length
    ? starSignCompatibility.strengths.join(", ")
    : pairCopy?.strengths || "Shared chemistry, emotional rhythm, and strong early-date ease.";
  const watchoutsText = Array.isArray(starSignCompatibility.watchouts) && starSignCompatibility.watchouts.length
    ? starSignCompatibility.watchouts.join(", ")
    : pairCopy?.watchouts || "Differences may show up in pace or communication style, so clarity helps early.";

  return {
    signLine: formatStarSignLine(userName, matchName),
    summaryText,
    strengthsText,
    watchoutsText,
  };
}

function buildProfileInsightSignals(markers = [], astrologyCopy = {}) {
  const markerLabels = {
    type: "Natural attraction",
    romantic_pattern: "Closeness rhythm",
    intent_values: "Dating intent",
    lifestyle_social: "Lifestyle fit",
    vibe: "Easy chemistry",
  };

  const markerIcons = {
    type: Sparkles,
    romantic_pattern: Orbit,
    intent_values: Compass,
    lifestyle_social: House,
    vibe: MessageSquareText,
  };

  const summarySignals = markers.slice(0, 5).map((marker) => ({
    key: marker.id,
    icon: markerIcons[marker.id] || Sparkles,
    label: markerLabels[marker.id] || marker.subtitle || marker.title,
  }));

  const userName = astrologyCopy?.signLine?.userName;
  const matchName = astrologyCopy?.signLine?.matchName;
  const astrologyLabel = userName && matchName ? `${userName} + ${matchName}` : "Star sign alignment";

  return [
    ...summarySignals,
    {
      key: "astrology",
      icon: Star,
      label: astrologyLabel,
    },
  ];
}

const GAY_STANDARD_PROFILE_CONTENT = {
  socialTrait: [
    "I tend to make people feel comfortable quite quickly.",
    "I ask a lot of questions when I'm interested in someone.",
    "I'm usually quieter in groups than I am one-to-one.",
    "I normally connect through humour before anything else.",
    "I'm more expressive once I trust someone.",
    "I come across calm at first, but I'm warmer than people expect.",
  ],
  socialEnergy: [
    "Calm socially",
    "Naturally playful",
    "Quiet confidence",
    "Warm energy",
    "Thoughtful communicator",
    "More introverted at first",
    "Affectionate in person",
    "Social but balanced",
    "Emotionally expressive",
    "Independent but connected",
  ],
  relationshipRhythm: [
    "I prefer steady communication over constant communication.",
    "I build attraction gradually, but I'm clear when I feel it.",
    "I value emotional consistency more than intensity.",
    "I like dating that feels intentional from the start.",
    "I'm more comfortable when communication feels balanced on both sides.",
    "I appreciate emotional openness without it feeling forced.",
  ],
  smallThings: [
    "Good eye contact",
    "Calm energy",
    "Comfortable silence",
    "Follow-through",
    "Playfulness",
    "Curiosity",
    "Thoughtful messages",
    "Emotional honesty",
    "Shared routines",
    "Affection",
    "Humour without ego",
    "Directness",
  ],
  idealDateEnergy: [
    "Somewhere we can actually hear each other talk.",
    "Low-pressure but still engaging.",
    "Relaxed drinks and strong conversation.",
    "Something playful without feeling performative.",
    "An environment where connection feels natural.",
    "A date that feels comfortable enough to be ourselves quickly.",
  ],
  greenFlags: [
    "Emotionally communicative",
    "Clear intentions",
    "Consistent energy",
    "Affectionate",
    "Good listener",
    "Honest communicator",
    "Calm under pressure",
    "Makes effort",
    "Emotionally available",
    "Warm with people",
  ],
};

function pickItems(items, seed, count) {
  const keyed = items.map((item, index) => ({
    item,
    sortKey: hashSeed(`${seed}:${index}:${item}`),
  }));
  return keyed.sort((a, b) => a.sortKey - b.sortKey).slice(0, count).map((entry) => entry.item);
}

const GAY_STANDARD_PROFILE_ROLES = [
  "consultant",
  "brand strategist",
  "product lead",
  "creative director",
  "architect",
  "operations lead",
  "founder",
  "marketing lead",
  "property developer",
  "design manager",
  "lawyer",
  "investment associate",
];

const GAY_STANDARD_PROFILE_ASPIRATIONS = [
  "building a life that feels both calm and full",
  "making more room for travel, good food, and the right person",
  "creating something meaningful outside of work too",
  "finding a relationship that feels grounded as well as exciting",
  "meeting someone I can genuinely build with",
  "living well without losing depth or intention",
];

const GAY_STANDARD_PROFILE_VALUES = [
  "easy conversation",
  "genuine chemistry",
  "consistency",
  "emotional clarity",
  "strong follow-through",
  "spontaneity with the right person",
];

const GAY_STANDARD_PROFILE_ETHNICITIES = [
  "Black / African Descent",
  "East Asian",
  "Hispanic / Latino",
  "Middle Eastern",
  "Native American",
  "Pacific Islander",
  "South Asian",
  "Southeast Asian",
  "White / Caucasian",
  "Other",
  "Prefer not to say",
];

const GAY_STANDARD_PROFILE_EDUCATION = [
  "UCL",
  "King's College London",
  "LSE",
  "University of Manchester",
  "University of Bristol",
  "Leeds",
  "Nottingham",
  "Edinburgh",
  "Durham",
  "Exeter",
];

const GAY_STANDARD_TETHER_SIGNAL_GROUPS = {
  social: [
    "Calm socially",
    "Naturally playful",
    "Better one-to-one",
    "Quiet confidence",
    "Social but grounded",
    "Low-key energy",
    "Warm quickly",
    "Relaxed presence",
    "Thoughtful in groups",
    "Soft-spoken",
    "Friendly but selective",
    "Effortlessly social",
    "More intimate than loud",
    "Protective energy",
    "Gentle masculinity",
    "Magnetic in person",
    "Reads the room well",
    "Dry humour",
    "Flirty without trying",
    "Independent socially",
  ],
  emotional: [
    "Emotionally direct",
    "Emotionally available",
    "Slow-burn chemistry",
    "Affectionate energy",
    "Deep conversationalist",
    "Calm under pressure",
    "Consistent communicator",
    "Thoughtful communicator",
    "Emotionally reassuring",
    "Loyal once invested",
    "Soft but assertive",
    "Private but caring",
    "Grounded emotionally",
    "Secure energy",
    "Naturally nurturing",
    "Open once comfortable",
    "Reflective by nature",
    "Deep feeler",
    "Honest with emotions",
    "Emotionally steady",
  ],
  rhythm: [
    "Better in person than texting",
    "Slow to open up",
    "Dates intentionally",
    "Needs real chemistry",
    "Enjoys emotional closeness",
    "Takes time to trust",
    "More quality than quantity",
    "Values consistency",
    "Naturally relationship-minded",
    "Enjoys building with someone",
    "Balanced independence",
    "Wants depth over attention",
    "Comfortable with vulnerability",
    "Prefers mutual effort",
    "Enjoys everyday intimacy",
    "Calm dating pace",
    "Present and attentive",
    "Thoughtful with affection",
  ],
  attraction: [
    "Warm presence",
    "Grounded energy",
    "Soft confidence",
    "Calm intensity",
    "Romantic energy",
    "Masculine presence",
    "Gentle energy",
    "Clean-cut vibe",
    "Creative energy",
    "Playful chemistry",
    "Quiet charm",
    "Emotion-first attraction",
    "Strong eye contact",
    "Easy to be around",
    "Naturally expressive",
    "Safe energy",
    "Calm masculinity",
    "Intentional energy",
    "Subtle flirtation",
    "Confident but warm",
  ],
};

const GAY_STANDARD_FACT_PRONOUNS = ["He / him", "He / they"];
const GAY_STANDARD_FACT_OPEN_TO = [
  "Open to a relationship",
  "Open to something meaningful",
  "Open to long-term",
  "Open to seeing where it goes",
  "Open to building with someone",
  "Open to the right connection",
];
const GAY_STANDARD_FACT_CHILDREN = ["Don't have children", "Have children"];
const GAY_STANDARD_FACT_FAMILY_PLANS = ["Want children", "Don't want children", "Open to children", "Not sure yet"];
const GAY_STANDARD_FACT_PETS = [
  { type: "dog", label: "Dog owner" },
  { type: "cat", label: "Cat person" },
  { type: "bird", label: "Bird owner" },
  { type: "fish", label: "Fish owner" },
  { type: "reptile", label: "Reptile owner" },
  { type: "rabbit", label: "Rabbit owner" },
  { type: "horse", label: "Horse person" },
  { type: "none", label: "No pets" },
];
const GAY_STANDARD_FACT_DRINKING = ["Yes", "Sometimes", "No", "Sober"];
const GAY_STANDARD_FACT_SMOKING = ["Yes", "Sometimes", "No"];
const GAY_STANDARD_FACT_DRUGS = ["Yes", "Sometimes", "No"];
const GAY_STANDARD_FACT_RELIGION = ["Spiritual", "Christian", "Muslim", "Jewish", "Hindu", "Buddhist", "Agnostic", "Atheist"];
const GAY_STANDARD_FACT_POLITICS = ["Liberal", "Moderate", "Progressive", "Prefer not to say"];
const GAY_STANDARD_FACT_LANGUAGES = ["English + Spanish", "English + French", "English + Italian", "English + Portuguese"];
const GAY_STANDARD_FACT_ZODIAC = [
  { sign: "Aries", symbol: "♈︎" },
  { sign: "Taurus", symbol: "♉︎" },
  { sign: "Gemini", symbol: "♊︎" },
  { sign: "Cancer", symbol: "♋︎" },
  { sign: "Leo", symbol: "♌︎" },
  { sign: "Virgo", symbol: "♍︎" },
  { sign: "Libra", symbol: "♎︎" },
  { sign: "Scorpio", symbol: "♏︎" },
  { sign: "Sagittarius", symbol: "♐︎" },
  { sign: "Capricorn", symbol: "♑︎" },
  { sign: "Aquarius", symbol: "♒︎" },
  { sign: "Pisces", symbol: "♓︎" },
];

const STANDARD_VARIANT_ORIENTATIONS = new Set(["gay", "straight", "bisexual", "lesbian", "trans_nonbinary", "queer", "pansexual", "fluid", "open_preference", "open-preference"]);

function isStandardVariantProfile(tier, context) {
  return tier === "standard" && STANDARD_VARIANT_ORIENTATIONS.has(String(context?.sexualPreference || "").toLowerCase());
}

function getOrientationDisplayLabel(preference = "") {
  const normalized = String(preference || "").toLowerCase();
  if (normalized === "gay") return "Gay";
  if (normalized === "straight") return "Straight";
  if (normalized === "bisexual") return "Bisexual";
  if (normalized === "lesbian") return "Lesbian";
  if (normalized === "trans_nonbinary") return "Trans / non-binary";
  if (normalized === "queer") return "Queer";
  if (normalized === "pansexual") return "Pansexual";
  if (normalized === "fluid") return "Fluid";
  if (normalized === "open_preference" || normalized === "open-preference") return "Open preference";
  return "Open";
}

function inferProfileIdentity(active = {}, context = {}) {
  const sourceKey = String(active?.sourceFolderKey || "");
  if (sourceKey === "straightFemale" || sourceKey === "lesbians" || sourceKey === "bisexualFemale") {
    return { gender: "Woman", pronouns: "She / her" };
  }
  if (sourceKey === "transWoman") {
    return { gender: "Trans woman", pronouns: "She / her" };
  }
  if (sourceKey === "transMen") {
    return { gender: "Trans man", pronouns: "He / him" };
  }
  if (sourceKey === "nonBinary") {
    return { gender: "Non-binary", pronouns: "They / them" };
  }
  if (sourceKey === "straightMale" || sourceKey === "gays" || sourceKey === "bisexualMale") {
    return { gender: "Man", pronouns: "He / him" };
  }

  const genderIdentity = String(active?.genderIdentity || context?.genderIdentity || "").toLowerCase();
  if (genderIdentity === "female") return { gender: "Woman", pronouns: "She / her" };
  if (genderIdentity === "trans_female") return { gender: "Trans woman", pronouns: "She / her" };
  if (genderIdentity === "trans_male") return { gender: "Trans man", pronouns: "He / him" };
  if (genderIdentity === "non_binary") return { gender: "Non-binary", pronouns: "They / them" };
  return { gender: "Man", pronouns: "He / him" };
}

function formatBaseLocation(active) {
  const rawLocation = String(active?.distanceLabel || active?.location || active?.locationLabel || "London");
  const [baseLocation] = rawLocation.split("·");
  return baseLocation.trim();
}

function EthnicityGlyph({ className = "w-3.5 h-3.5" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="12" r="7.5" />
      <circle cx="9.5" cy="9.5" r="3.2" />
      <path d="M14.8 14.8a3.2 3.2 0 0 0 4.5 0" />
    </svg>
  );
}

function HorseGlyph({ className = "w-3.5 h-3.5" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M6 15.5V9.8l3.2-2.8 3.5.5 2.6 2.4v5.6" />
      <path d="M9.2 7l1.1-2h2.1l1.2 2" />
      <path d="M7.5 12h8" />
      <path d="M8.2 15.5v3M13.8 15.5v3" />
    </svg>
  );
}

function getPetIcon(type) {
  if (type === "dog") return Dog;
  if (type === "cat") return Cat;
  if (type === "bird") return Bird;
  if (type === "fish") return Fish;
  if (type === "reptile") return Turtle;
  if (type === "rabbit") return Rabbit;
  if (type === "horse") return HorseGlyph;
  return House;
}

function buildStandardVariantAtAGlance(active, context, tier) {
  if (!isStandardVariantProfile(tier, context)) return [];

  const seed = String(active?.id || active?.displayName || "at-a-glance");
  const pet = pickItems(GAY_STANDARD_FACT_PETS, `${seed}:pet`, 1)[0];
  const zodiac = pickItems(GAY_STANDARD_FACT_ZODIAC, `${seed}:zodiac`, 1)[0];
  const profileIdentity = inferProfileIdentity(active, context);

  return [
    { icon: UserRound, label: profileIdentity.gender },
    { icon: Orbit, label: getOrientationDisplayLabel(context?.sexualPreference) },
    { icon: MessageSquareText, label: profileIdentity.pronouns },
    { icon: Sparkles, label: pickItems(GAY_STANDARD_FACT_OPEN_TO, `${seed}:open-to`, 1)[0] },
    { icon: House, label: pickItems(GAY_STANDARD_FACT_CHILDREN, `${seed}:children`, 1)[0] },
    { icon: Compass, label: pickItems(GAY_STANDARD_FACT_FAMILY_PLANS, `${seed}:family-plans`, 1)[0] },
    { icon: getPetIcon(pet.type), label: pet.label },
    { icon: Coffee, label: `Drinking: ${pickItems(GAY_STANDARD_FACT_DRINKING, `${seed}:drinking`, 1)[0]}` },
    { icon: Sunrise, label: `Smoking: ${pickItems(GAY_STANDARD_FACT_SMOKING, `${seed}:smoking`, 1)[0]}` },
    { icon: Sparkles, label: `Drugs: ${pickItems(GAY_STANDARD_FACT_DRUGS, `${seed}:drugs`, 1)[0]}` },
    { icon: Star, label: pickItems(GAY_STANDARD_FACT_RELIGION, `${seed}:religion`, 1)[0] },
    { icon: AudioWaveform, label: pickItems(GAY_STANDARD_FACT_POLITICS, `${seed}:politics`, 1)[0] },
    { icon: Languages, label: pickItems(GAY_STANDARD_FACT_LANGUAGES, `${seed}:languages`, 1)[0] },
    { icon: null, glyph: zodiac.symbol, label: zodiac.sign },
  ];
}

function buildGayStandardAbout(active, seed) {
  const location = formatBaseLocation(active);
  const role = pickItems(GAY_STANDARD_PROFILE_ROLES, `${seed}:role`, 1)[0];
  const aspiration = pickItems(GAY_STANDARD_PROFILE_ASPIRATIONS, `${seed}:aspiration`, 1)[0];
  const valueA = pickItems(GAY_STANDARD_PROFILE_VALUES, `${seed}:value-a`, 1)[0];
  const valueB = pickItems(
    GAY_STANDARD_PROFILE_VALUES.filter((value) => value !== valueA),
    `${seed}:value-b`,
    1,
  )[0];

  return `${location}-based ${role} who values ${valueA} and ${valueB}. I'm happiest when connection feels natural and emotionally clear, and I'm looking for something with real substance. Big on good conversation and ${aspiration}.`;
}

function toTitleCase(value = "") {
  return String(value)
    .split(" ")
    .map((part) => (part ? `${part.charAt(0).toUpperCase()}${part.slice(1)}` : part))
    .join(" ");
}

function buildProfileHeaderMeta(active, context, tier) {
  const seed = String(active?.id || active?.displayName || "profile-meta");
  const isStandardVariant = isStandardVariantProfile(tier, context);

  const job = isStandardVariant
    ? toTitleCase(pickItems(GAY_STANDARD_PROFILE_ROLES, `${seed}:header-job`, 1)[0])
    : "Senior Consultant";
  const education = isStandardVariant
    ? pickItems(GAY_STANDARD_PROFILE_EDUCATION, `${seed}:header-education`, 1)[0]
    : "University of Bristol";
  const ethnicity = isStandardVariant
    ? pickItems(GAY_STANDARD_PROFILE_ETHNICITIES, `${seed}:header-ethnicity`, 1)[0]
    : "White / Caucasian";

  return [
    { icon: BriefcaseBusiness, label: job },
    { icon: GraduationCap, label: education },
    { icon: EthnicityGlyph, label: ethnicity },
  ];
}

function buildWhatTheyreAboutSignals(active, context, tier) {
  if (!isStandardVariantProfile(tier, context)) return [];

  const seed = String(active?.id || active?.displayName || "tether-signals");
  const primarySignals = [
    { icon: AudioWaveform, label: pickItems(GAY_STANDARD_TETHER_SIGNAL_GROUPS.social, `${seed}:signal-social`, 1)[0] },
    { icon: Orbit, label: pickItems(GAY_STANDARD_TETHER_SIGNAL_GROUPS.emotional, `${seed}:signal-emotional`, 1)[0] },
    { icon: MessageSquareText, label: pickItems(GAY_STANDARD_TETHER_SIGNAL_GROUPS.rhythm, `${seed}:signal-rhythm`, 1)[0] },
  ];
  const secondaryPool = [
    { icon: Compass, label: pickItems(GAY_STANDARD_TETHER_SIGNAL_GROUPS.attraction, `${seed}:signal-attraction-a`, 1)[0] },
    { icon: Sparkles, label: pickItems(GAY_STANDARD_TETHER_SIGNAL_GROUPS.attraction, `${seed}:signal-attraction-b`, 1)[0] },
    { icon: EthnicityGlyph, label: pickItems(GAY_STANDARD_TETHER_SIGNAL_GROUPS.emotional, `${seed}:signal-emotional-b`, 1)[0] },
    { icon: AudioWaveform, label: pickItems(GAY_STANDARD_TETHER_SIGNAL_GROUPS.social, `${seed}:signal-social-b`, 1)[0] },
    { icon: Orbit, label: pickItems(GAY_STANDARD_TETHER_SIGNAL_GROUPS.rhythm, `${seed}:signal-rhythm-b`, 1)[0] },
  ];

  return [...primarySignals, ...pickItems(secondaryPool, `${seed}:secondary-energy`, 2)];
}

function buildGayStandardProfileReview(active) {
  const seed = String(active?.id || active?.displayName || "gay-standard-profile");
  const about = buildGayStandardAbout(active, seed);
  const socialTrait = pickItems(GAY_STANDARD_PROFILE_CONTENT.socialTrait, `${seed}:social-trait`, 1)[0];
  const relationshipRhythm = pickItems(GAY_STANDARD_PROFILE_CONTENT.relationshipRhythm, `${seed}:relationship-rhythm`, 1)[0];

  return [
    { title: "About", body: about },
    { title: "What you'd notice about me", body: socialTrait },
    { title: "Social Energy", chips: pickItems(GAY_STANDARD_PROFILE_CONTENT.socialEnergy, `${seed}:social-energy`, 4) },
    { title: "Relationship Rhythm", body: relationshipRhythm },
    { title: "Small things I value", chips: pickItems(GAY_STANDARD_PROFILE_CONTENT.smallThings, `${seed}:small-things`, 6) },
    { title: "Green Flags", chips: pickItems(GAY_STANDARD_PROFILE_CONTENT.greenFlags, `${seed}:green-flags`, 5) },
  ];
}

function buildProfileReviewCards(active, context, tier) {
  if (isStandardVariantProfile(tier, context)) {
    return buildGayStandardProfileReview(active);
  }

  return [
    { title: "About", body: active.shortBio || active.reason || active.compatibilityBreakdown?.overallRead || "Thoughtful, grounded, and open to genuine connection." },
    { title: "What stands out", body: active.oneLineVibe || active.shortBio || "Strong signals of warmth, clarity, and real-world compatibility." },
  ];
}

export default function CompatibilityBreakdown({
  matchId,
  matchData,
  tier: tierOverride,
  onBack,
  onBookDate,
  onViewProfile,
  showCompatibility = true,
  headerTitle,
  secondaryActionLabel,
  onSecondaryAction,
  primaryActionLabel,
  onPrimaryAction,
  showProfileMatchNotice = true,
  openAtCompatibility = false,
  showProfileJumpButton = false,
}) {
  const { tier: activeTier } = useTier();
  const { context, match } = useCurrentMatch(matchId, "breakdown");
  const active = matchData || match;
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);
  const scrollContainerRef = useRef(null);
  const profileTopRef = useRef(null);
  const compatibilitySectionRef = useRef(null);
  const jumpButtonRef = useRef(null);
  const [showJumpButton, setShowJumpButton] = useState(Boolean(openAtCompatibility && showProfileJumpButton));
  const safeActive = active || {};
  const tier = tierOverride || activeTier || context?.membershipTier || "standard";
  const theme = getBreakdownTheme(tier);
  const isConcierge = tier === "concierge";
  const previewTheme = getProfilePreviewTheme(tier);
  const isConciergeProfilePreview = tier === "concierge" && !showCompatibility;
  const previewBannerBg = isConciergeProfilePreview ? "#d0c7b4" : theme.darkHeader;
  const previewBannerText = isConciergeProfilePreview ? "#0b0c0a" : theme.darkText;
  const previewSummaryBg = isConciergeProfilePreview ? "#0b0c0a" : theme.sectionSurface;
  const previewProfileSummaryText = isConciergeProfilePreview ? "#d0c7b4" : theme.sectionBodyText;
  const topProfileHeaderBg = isConcierge ? previewTheme.headerBg : previewBannerBg;
  const topProfileHeaderText = isConcierge ? previewTheme.headerText : previewBannerText;
  const topProfileSummaryBg = isConcierge ? previewTheme.summaryBg : previewSummaryBg;
  const topProfileSummaryText = isConcierge ? previewTheme.summaryText : theme.sectionBodyText;
  const topProfileSectionHeaderBg = isConcierge ? previewTheme.sectionHeaderBg : theme.sectionHeaderSurface;
  const topProfileSectionHeaderText = isConcierge ? previewTheme.sectionHeaderText : theme.sectionHeaderText;
  const topProfileSectionBodyBg = isConcierge ? previewTheme.sectionBodyBg : (isConciergeProfilePreview ? previewSummaryBg : theme.sectionSurface);
  const topProfileSectionBodyText = isConcierge ? previewTheme.sectionBodyText : previewProfileSummaryText;
  const topProfileAtAGlanceTitleText = isConcierge ? "#141916" : tier === "standard" ? theme.darkText : theme.sectionBodyText;
  const topProfileScorePalette = getSummaryBadgePalette(tier);
  const isStandardProfilePreview = tier === "standard";
  const standardInsightChipStyle = isStandardProfilePreview
    ? {
        background: "#e7e5e2",
        color: theme.sectionBodyText,
        borderColor: theme.border,
      }
    : null;
  const enriched = getCompatibilityBreakdownForMatch(active, context);
  const markers = enriched?.markers || [];
  const photos = useMemo(() => {
    if (Array.isArray(safeActive.photos) && safeActive.photos.length) return safeActive.photos.filter(Boolean);
    return [safeActive.photoPath || safeActive.photo].filter(Boolean);
  }, [safeActive]);
  const photoCount = photos.length;
  const currentPhoto = photos[Math.min(activePhotoIndex, Math.max(photoCount - 1, 0))] || safeActive.photoPath || safeActive.photo;
  const profileReviewCards = buildProfileReviewCards(safeActive, context, tier);
  const useStackedMatchProfileActions = !showCompatibility
    && secondaryActionLabel === "View Compatibility Breakdown"
    && primaryActionLabel === "Book a Date";
  useEffect(() => {
    setActivePhotoIndex(0);
  }, [active?.id]);
  useEffect(() => {
    setShowJumpButton(Boolean(openAtCompatibility && showProfileJumpButton));
  }, [openAtCompatibility, showProfileJumpButton, active?.id]);
  useEffect(() => {
    if (!openAtCompatibility) return;
    const timer = window.setTimeout(() => {
      const scrollHost = scrollContainerRef.current;
      const sectionEl = compatibilitySectionRef.current;
      if (scrollHost && sectionEl) {
        const jumpButtonHeight = jumpButtonRef.current?.offsetHeight || 0;
        const topOffset = 96 + jumpButtonHeight;
        const targetTop = sectionEl.offsetTop - topOffset;
        scrollHost.scrollTo({
          top: Math.max(0, targetTop),
          behavior: "smooth",
        });
      }
    }, 120);
    return () => window.clearTimeout(timer);
  }, [openAtCompatibility, active?.id]);
  useEffect(() => {
    if (!showProfileJumpButton) return undefined;
    const scrollHost = scrollContainerRef.current;
    if (!scrollHost) return undefined;

    const handleScroll = () => {
      const nextVisible = scrollHost.scrollTop > 180;
      setShowJumpButton((current) => (current === nextVisible ? current : nextVisible));
    };

    handleScroll();
    scrollHost.addEventListener("scroll", handleScroll, { passive: true });
    return () => scrollHost.removeEventListener("scroll", handleScroll);
  }, [showProfileJumpButton, active?.id]);
  const markerAverage = markers.length
    ? Math.round(markers.reduce((sum, marker) => sum + Number(marker.score || 0), 0) / markers.length)
    : Number(safeActive.compatibilityScore || safeActive.score || 75);
  const overallScore = markerAverage;
  const overallHeaderScoreStyle = getHeaderScoreStyle(overallScore, tier);
  const starScore = Math.min(95, Math.max(60, Math.round((overallScore + 6) / 2) * 2));
  const starHeaderScoreStyle = getHeaderScoreStyle(starScore, tier);
  const astrologyCopy = getAstrologyCopy(active?.starSignCompatibility, context, safeActive);
  const profileInsightSignals = buildProfileInsightSignals(markers, astrologyCopy);
  const headerMeta = buildProfileHeaderMeta(safeActive, context, tier);
  const atAGlanceFacts = buildStandardVariantAtAGlance(safeActive, context, tier);
  const theirEnergySignals = buildWhatTheyreAboutSignals(safeActive, context, tier);
  if (!active) return null;

  return (
    <motion.div
      initial={{ opacity: 0, x: 32 }}
      animate={{ opacity: 1, x: 0 }}
      className="fixed inset-0 z-[300] overflow-y-auto bg-background"
      data-testid="compatibility-breakdown-page"
      ref={scrollContainerRef}
    >
      <div className="sticky top-0 z-10 px-4 py-3 flex items-center gap-3 bg-background">
        <BackButton onClick={onBack} />
        <p className="font-heading font-bold text-base flex-1 text-foreground">
          {headerTitle || (showCompatibility ? "Profile & Compatibility Breakdown" : "Profile")}
        </p>
      </div>

      <div ref={profileTopRef} className="max-w-xl mx-auto px-6 py-5 space-y-5 pb-36">
        <div className="rounded-[30px] overflow-hidden border" style={{ borderColor: theme.border, background: theme.cardSurface }}>
          <div className="relative aspect-[3/4] overflow-hidden" style={{ background: theme.cardSurface }}>
            <img src={currentPhoto} alt={active.displayName || active.name} className="w-full h-full object-cover" />
            {photoCount > 1 ? (
              <>
                <button
                  type="button"
                  aria-label="Previous photo"
                  onClick={() => setActivePhotoIndex((value) => (value - 1 + photoCount) % photoCount)}
                  className="absolute left-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full border border-white/45 bg-white/88 text-[rgba(55,66,58,0.92)] backdrop-blur-md shadow-[0_6px_18px_rgba(0,0,0,0.20)] inline-flex items-center justify-center transition-colors hover:bg-white/92 active:bg-white/95"
                >
                  <ChevronLeft className="w-5 h-5" strokeWidth={2.4} />
                </button>
                <button
                  type="button"
                  aria-label="Next photo"
                  onClick={() => setActivePhotoIndex((value) => (value + 1) % photoCount)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full border border-white/45 bg-white/88 text-[rgba(55,66,58,0.92)] backdrop-blur-md shadow-[0_6px_18px_rgba(0,0,0,0.20)] inline-flex items-center justify-center transition-colors hover:bg-white/92 active:bg-white/95"
                >
                  <ChevronRight className="w-5 h-5" strokeWidth={2.4} />
                </button>
                <div className="absolute top-4 left-1/2 -translate-x-1/2 flex items-center gap-2">
                  {photos.map((photo, index) => (
                    <span
                      key={`${photo}-${index}`}
                      className={`h-1.5 rounded-full transition-all ${index === activePhotoIndex ? "w-10 bg-white" : "w-2.5 bg-white/60"}`}
                    />
                  ))}
                </div>
              </>
            ) : null}
          </div>

          <div className="px-4 py-4 border-t" style={{ borderColor: theme.border, background: theme.cardSurface }}>
            <div className="rounded-2xl border overflow-hidden" style={{ borderColor: theme.border, background: theme.sectionSurface }}>
              <div className="px-5 py-2.5 min-h-[45px] flex items-center justify-center text-center" style={{ background: topProfileHeaderBg, color: topProfileHeaderText }}>
                <div className="flex items-center justify-center gap-2 min-w-0">
                  <h2 className="font-heading font-bold text-[17px] leading-[1.1]">
                    {active.displayName || active.name}, {active.age}
                  </h2>
                  {(active.verified || active.is_verified) ? <ShieldCheck className="w-5 h-5 flex-shrink-0" style={{ color: topProfileHeaderText }} /> : null}
                </div>
              </div>
              <div className="px-5 py-4 flex items-start justify-between gap-4" style={{ background: topProfileSummaryBg }}>
                <div className="flex-1 min-w-0">
                  <div className="grid grid-cols-[16px_minmax(0,1fr)] items-center gap-2.5 text-xs font-body" style={{ color: topProfileSummaryText }}>
                    <MapPin className="w-3.5 h-3.5" />
                    <span className="leading-tight">{active.distanceLabel || active.location || active.locationLabel}</span>
                  </div>
                  <div className="mt-3 grid gap-2.5">
                    {headerMeta.map((item) => {
                      const Icon = item.icon;
                      return (
                        <div key={item.label} className="grid grid-cols-[16px_minmax(0,1fr)] items-center gap-2.5 text-xs font-body" style={{ color: topProfileSummaryText }}>
                          <Icon className="w-3.5 h-3.5" />
                          <span className="leading-tight">{item.label}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className="flex-shrink-0 pt-0.5">
                  <CompatibilityScoreBadge
                    score={overallScore}
                    size="md"
                    tier={tier}
                    scoreColor={topProfileScorePalette.text}
                    trackColor={topProfileScorePalette.track}
                  />
                </div>
              </div>
              {atAGlanceFacts.length ? (
                <div className="border-t px-5 py-3" style={{ background: theme.atAGlanceSurface, borderColor: theme.border }}>
                  <p className="text-[11px] font-body font-semibold uppercase tracking-[0.14em] text-center mb-2.5" style={{ color: topProfileAtAGlanceTitleText }}>
                    At a glance
                  </p>
                  <div
                    className="flex gap-2 overflow-x-auto pb-1"
                    style={{
                      scrollSnapType: "x mandatory",
                      scrollbarWidth: "none",
                      WebkitOverflowScrolling: "touch",
                    }}
                  >
                    {atAGlanceFacts.map((item) => {
                      const Icon = item.icon;
                      return (
                        <div
                          key={item.label}
                          className="shrink-0 inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-body"
                          style={{
                            background: theme.atAGlanceChipSurface,
                            borderColor: theme.border,
                            color: theme.atAGlanceChipText,
                            scrollSnapAlign: "start",
                          }}
                        >
                          {Icon ? <Icon className="w-3.5 h-3.5 flex-shrink-0" /> : <span className="w-3.5 text-center text-[13px] leading-none flex-shrink-0">{item.glyph}</span>}
                          <span className="leading-none whitespace-nowrap">{item.label}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : null}
            </div>
          </div>

          <div className="px-4 pb-4 space-y-4" style={{ background: theme.cardSurface }}>
            <div
              className="rounded-2xl border overflow-hidden"
              style={{ background: isConcierge ? "#0b0c0a" : previewSummaryBg, color: theme.sectionBodyText, borderColor: theme.border }}
            >
              <div className="px-5 py-2.5 text-center" style={{ background: previewBannerBg, color: previewBannerText }}>
                <p className="text-[11px] font-body font-semibold uppercase tracking-[0.14em] opacity-90">
                  Tether Match Insight
                </p>
              </div>
              <div className="px-5 pt-3 pb-4 text-center">
                <p className="font-heading font-bold leading-[1.15]" style={{ fontSize: TITLE_SIZE }}>
                  Why we think this is a strong fit
                </p>
                <p className="mt-3 text-[12px] font-body leading-relaxed opacity-95">
                  {enriched?.overallRead || active.compatibilityBreakdown?.overallRead || active.reason}
                </p>
                <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
                  {profileInsightSignals.map((signal) => {
                    const Icon = signal.icon;
                    return (
                      <span
                        key={signal.key}
                        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-body ${isStandardProfilePreview ? "border" : ""}`}
                        style={standardInsightChipStyle || { background: theme.chipSurface, color: theme.chipText }}
                      >
                        <Icon
                          className="w-3.5 h-3.5 flex-shrink-0"
                          style={{
                            color: isConcierge
                              ? previewTheme.symbol
                              : isConciergeProfilePreview
                                ? "#d0c7b4"
                                : isStandardProfilePreview
                                  ? theme.sectionBodyText
                                  : theme.darkText,
                          }}
                        />
                        <span className="leading-none whitespace-nowrap">{signal.label}</span>
                      </span>
                    );
                  })}
                </div>
              </div>
              {!showCompatibility && showProfileMatchNotice ? (
                <div className="border-t px-5 min-h-[58px] flex items-center justify-center text-center" style={{ background: previewBannerBg, color: previewBannerText, borderColor: theme.border }}>
                  <p className="text-[12px] font-body leading-relaxed">
                    You can see your full compatibility breakdown once you're a match
                  </p>
                </div>
              ) : null}
            </div>
            {profileReviewCards.map((card) => (
              <div
                key={card.title}
                className="rounded-2xl border overflow-hidden"
                style={{
                  borderColor: theme.border,
                  background: topProfileSectionBodyBg,
                }}
              >
                <div className="px-5 py-2.5 text-center" style={{ background: topProfileSectionHeaderBg, color: topProfileSectionHeaderText }}>
                  <p className="font-heading font-bold leading-[1.1]" style={{ fontSize: TITLE_SIZE }}>{card.title}</p>
                </div>
                <div className="px-5 py-3" style={{ background: topProfileSectionBodyBg }}>
                  {card.body ? (
                    <p className="text-[12px] font-body leading-relaxed text-center" style={{ color: topProfileSectionBodyText }}>{card.body}</p>
                  ) : null}
                  {card.chips ? (
                    <div className="flex flex-wrap justify-center gap-2">
                      {card.chips.map((chip) => (
                        <span
                          key={chip}
                          className="inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-body"
                          style={{ borderColor: theme.border, background: theme.chipSurface, color: topProfileSectionBodyText }}
                        >
                          {chip}
                        </span>
                      ))}
                    </div>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </div>

        {showCompatibility ? (
        <>
        {showProfileJumpButton && showJumpButton ? (
          <div className="sticky top-[66px] z-[5] -mb-2 flex justify-center">
            <button
              ref={jumpButtonRef}
              type="button"
              onClick={() => {
                profileTopRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
                setShowJumpButton(false);
              }}
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-xs font-body text-foreground shadow-sm btn-hover-light"
            >
              <ChevronUp className="w-3.5 h-3.5" />
              <span>View Profile Details</span>
            </button>
          </div>
        ) : null}
        <div ref={compatibilitySectionRef} className="rounded-[30px] overflow-hidden border-[2px]" style={{ borderColor: theme.darkHeader, background: theme.lightSurface }}>
          <div className="px-4 py-2.5 border-b" style={{ background: theme.darkHeader, borderColor: theme.border }}>
            <div className="grid grid-cols-[1fr_auto_1fr] items-center min-h-[28px]">
              <div className="flex justify-end pr-2">
                <Sparkles className="w-4 h-4" style={{ color: theme.darkText }} />
              </div>
              <p
                className="font-heading font-bold leading-[1.1] text-center whitespace-nowrap"
                style={{ color: theme.darkText, fontSize: TITLE_SIZE }}
              >
                Match Compatibility Breakdown
              </p>
              <div />
            </div>
          </div>
          <div className="px-5 py-2.5">
            <p className="leading-snug font-body" style={{ color: theme.muted, fontSize: BODY_SIZE }}>
              {enriched?.overallRead || active.compatibilityBreakdown?.overallRead || active.reason}
            </p>
          </div>
          <div className="px-3 pb-2.5 space-y-2.5">
          {markers.map((m) => (
            <div key={m.id} className="rounded-[24px] overflow-hidden border" style={{ borderColor: theme.border, background: theme.lightSurface }} data-testid="compatibility-marker-card">
              <div className="px-4 py-2.5 flex items-center justify-between gap-3" style={{ background: theme.darkHeader }}>
                <div className="min-w-0">
                  <p
                    className="leading-none font-heading font-bold whitespace-nowrap"
                    style={{ color: theme.darkText, fontSize: CARD_TITLE_SIZE }}
                    data-testid="compatibility-marker-title"
                  >
                    {normalizeCompatibilityHeading(m.title)}
                  </p>
                  <p
                    className="mt-1 font-body"
                    style={{ color: theme.darkText, opacity: 0.84, fontSize: SUBTITLE_SIZE }}
                    data-testid="compatibility-marker-subtitle"
                  >
                    {m.subtitle}
                  </p>
                </div>
                <div data-testid="compatibility-marker-score">
                  <CompatibilityScoreBadge
                    score={m.score}
                    size="sm"
                    tier={tier}
                    scoreColor={theme.darkText}
                    trackColor={theme.darkText}
                  />
                </div>
              </div>
              <div className="px-5 py-2.5">
                <p
                  className="leading-snug font-body"
                  style={{ color: theme.muted, fontSize: BODY_SIZE }}
                  data-testid="compatibility-marker-summary"
                >
                  {m.summary}
                </p>
              </div>
            </div>
          ))}
          </div>

          <div className="px-3 pb-2.5">
        <div className="rounded-[24px] overflow-hidden border" style={{ borderColor: theme.border, background: theme.lightSurface }}>
          <div className="px-4 py-2.5 flex items-center justify-between gap-3" style={{ background: theme.darkHeader }}>
            <div className="min-w-0">
              <p className="leading-none font-heading font-bold whitespace-nowrap" style={{ color: theme.darkText, fontSize: CARD_TITLE_SIZE }}>
                {normalizeCompatibilityHeading("Star Sign Compatibility")}
              </p>
              <p
                className="mt-1 font-body whitespace-nowrap"
                style={{ color: theme.darkText, opacity: 0.84, fontSize: SUBTITLE_SIZE }}
              >
                {astrologyCopy.signLine.userName ? (
                  <span>
                    <span className="inline-block mr-1 align-middle text-[0.92em] leading-none" style={{ color: theme.darkText, opacity: 0.78 }}>
                      {astrologyCopy.signLine.userSymbol}
                    </span>
                    <span className="align-middle">{astrologyCopy.signLine.userName}</span>
                  </span>
                ) : null}
                {astrologyCopy.signLine.userName && astrologyCopy.signLine.matchName ? <span className="mx-2 inline-block align-middle">+</span> : null}
                {astrologyCopy.signLine.matchName ? (
                  <span>
                    <span className="inline-block mr-1 align-middle text-[0.92em] leading-none" style={{ color: theme.darkText, opacity: 0.78 }}>
                      {astrologyCopy.signLine.matchSymbol}
                    </span>
                    <span className="align-middle">{astrologyCopy.signLine.matchName}</span>
                  </span>
                ) : null}
              </p>
            </div>
            <div data-testid="compatibility-marker-score">
              <CompatibilityScoreBadge
                score={starScore}
                size="sm"
                tier={tier}
                scoreColor={theme.darkText}
                trackColor={theme.darkText}
              />
            </div>
          </div>
          <div className="px-5 py-2.5">
            {astrologyCopy.summaryText ? (
              <p className="leading-snug font-body" style={{ color: theme.muted, fontSize: BODY_SIZE }}>{astrologyCopy.summaryText}</p>
            ) : null}
            <div className={astrologyCopy.summaryText ? "mt-3" : ""}>
              <p className="font-heading leading-none whitespace-nowrap" style={{ color: theme.lightText, fontSize: CARD_TITLE_SIZE }}>Strengths:</p>
              <p className="mt-1 leading-snug font-body" style={{ color: theme.muted, fontSize: BODY_SIZE }}>{astrologyCopy.strengthsText}</p>
            </div>
            <div className="mt-3">
              <p className="font-heading leading-none whitespace-nowrap" style={{ color: theme.lightText, fontSize: CARD_TITLE_SIZE }}>Watchouts:</p>
              <p className="mt-1 leading-snug font-body" style={{ color: theme.muted, fontSize: BODY_SIZE }}>{astrologyCopy.watchoutsText}</p>
            </div>
          </div>
        </div>
          </div>

          <div className="px-3 pb-2.5">
        <div className="rounded-[24px] overflow-hidden border" style={{ borderColor: theme.border, background: theme.lightSurface }}>
          <div className="px-4 py-2.5 flex items-center justify-between gap-3" style={{ background: theme.darkHeader }}>
            <div className="min-w-0">
              <p className="leading-none font-heading font-bold whitespace-nowrap" style={{ color: theme.darkText, fontSize: CARD_TITLE_SIZE }}>
                {normalizeCompatibilityHeading("Tether Compatibility Opinion")}
              </p>
              <p className="mt-1 font-body" style={{ color: theme.darkText, opacity: 0.84, fontSize: SUBTITLE_SIZE }}>Final relationship-fit summary</p>
            </div>
            <div data-testid="compatibility-marker-score">
              <CompatibilityScoreBadge
                score={overallScore}
                size="sm"
                tier={tier}
                scoreColor={theme.darkText}
                trackColor={theme.darkText}
              />
            </div>
          </div>
          <div className="px-5 py-2.5">
            <p className="leading-snug font-body" style={{ color: theme.muted, fontSize: BODY_SIZE }}>{enriched?.overallRead || active.compatibilityBreakdown?.overallRead}</p>
            <div className="mt-3">
              <p className="font-heading leading-none whitespace-nowrap" style={{ color: theme.lightText, fontSize: CARD_TITLE_SIZE }}>Where You Align:</p>
              <p className="mt-1 leading-snug font-body" style={{ color: theme.muted, fontSize: BODY_SIZE }}>
                {(enriched?.whereYouAlign || active.compatibilityBreakdown?.whereYouAlign || []).join(" • ")}
              </p>
            </div>
            <div className="mt-3">
              <p className="font-heading leading-none whitespace-nowrap" style={{ color: theme.lightText, fontSize: CARD_TITLE_SIZE }}>Where You May Differ:</p>
              <p className="mt-1 leading-snug font-body" style={{ color: theme.muted, fontSize: BODY_SIZE }}>
                {(enriched?.whereYouMayDiffer || active.compatibilityBreakdown?.whereYouMayDiffer || []).join(" • ")}
              </p>
            </div>
            <p className="mt-3 leading-snug font-body" style={{ color: theme.muted, fontSize: BODY_SIZE }}>{enriched?.tetherAdvice || active.compatibilityBreakdown?.tetherAdvice}</p>
          </div>
        </div>
          </div>
        </div>
        </>
        ) : null}

        {showCompatibility ? (
          <button
            onClick={onBookDate}
            className="btn-hover-dark w-full rounded-full bg-primary text-primary-foreground py-3 text-sm font-semibold"
          >
            Book Date
          </button>
        ) : useStackedMatchProfileActions ? (
          <div className="space-y-4">
            <button
              onClick={onSecondaryAction}
              className="btn-hover-light w-full rounded-xl border border-border py-3 text-sm font-semibold text-foreground text-center"
              style={{ background: "#e7e5e1" }}
            >
              {secondaryActionLabel}
            </button>
            <button
              onClick={onPrimaryAction}
              className="btn-hover-dark w-full rounded-xl bg-primary text-primary-foreground py-3 text-sm font-semibold"
            >
              {primaryActionLabel}
            </button>
          </div>
        ) : primaryActionLabel && onPrimaryAction && secondaryActionLabel && onSecondaryAction ? (
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={onSecondaryAction}
              className="btn-hover-light h-12 rounded-xl border-2 border-border bg-card text-muted-foreground flex items-center justify-center gap-2 text-sm font-medium"
            >
              <X className="w-5 h-5" />
              <span>{secondaryActionLabel}</span>
            </button>
            <button
              onClick={onPrimaryAction}
              className="btn-hover-dark h-12 rounded-xl bg-primary text-primary-foreground flex items-center justify-center gap-2 text-sm font-medium"
            >
              <Heart className="w-5 h-5" />
              <span>{primaryActionLabel}</span>
            </button>
          </div>
        ) : (
          <button
            onClick={onSecondaryAction}
            className="btn-hover-dark w-full rounded-full bg-primary text-primary-foreground py-3 text-sm font-semibold"
          >
            {secondaryActionLabel || "Continue"}
          </button>
        )}
      </div>
    </motion.div>
  );
}
