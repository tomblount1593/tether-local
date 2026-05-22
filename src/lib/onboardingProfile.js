import { createElement } from "react";
import {
  Baby,
  BookOpen,
  BriefcaseBusiness,
  FileBadge2,
  Flag,
  GraduationCap,
  Heart,
  Languages,
  Landmark,
  MapPin,
  MessageSquareText,
  Orbit,
  PawPrint,
  Pill,
  Ruler,
  School,
  Cigarette,
  ScrollText,
  Sparkles,
  UserRound,
  Wine,
  Wrench,
} from "lucide-react";
import { getZodiacSign } from "@/utils/zodiac";
import {
  determineCompatibilityVariant,
  normalizeGenderIdentity,
  normalizeLookingFor,
  normalizeSexualPreference,
} from "@/lib/compatibilityVariantRouting";

export const PRONOUN_OPTIONS = [
  "He / him",
  "She / her",
  "They / them",
  "He / they",
  "She / they",
  "Prefer not to say",
];

export const EDUCATION_LEVEL_OPTIONS = [
  "GCSEs / Secondary School",
  "A Levels / College",
  "Apprenticeship",
  "Certificate / Diploma",
  "Bachelor's Degree",
  "Master's Degree",
  "PhD / Doctorate",
  "Other",
];

export const ETHNICITY_OPTIONS = [
  "Native American",
  "White / Caucasian",
  "Black / African / Caribbean",
  "South Asian",
  "East Asian",
  "Middle Eastern",
  "Mixed heritage",
  "Latinx / Hispanic",
  "Prefer not to say",
];

export const DATING_INTENTION_OPTIONS = [
  "Long-term relationship",
  "Serious dating",
  "Open to seeing where it goes",
  "Casual but meaningful",
  "Still figuring it out",
];

export const CHILDREN_OPTIONS = [
  "Don't have children",
  "Have children",
  "Prefer not to say",
];

export const FUTURE_FAMILY_DESIRE_OPTIONS = [
  "Want children",
  "Open to children",
  "Not sure yet",
  "Don't want children",
];

export const PET_OPTIONS = [
  "Dog owner",
  "Cat person",
  "No pets",
  "Rabbit owner",
  "Fish owner",
  "Prefer not to say",
];

export const DRINKING_OPTIONS = [
  "Sometimes",
  "No",
  "Yes",
  "Sober",
];

export const SMOKING_OPTIONS = [
  "No",
  "Sometimes",
  "Yes",
];

export const DRUGS_OPTIONS = [
  "No",
  "Sometimes",
  "Yes",
  "Prefer not to say",
];

export const RELIGION_OPTIONS = [
  "Spiritual",
  "Agnostic",
  "Christian",
  "Atheist",
  "Hindu",
  "Muslim",
  "Jewish",
  "Sikh",
  "Prefer not to say",
];

export const POLITICS_OPTIONS = [
  "Progressive",
  "Liberal",
  "Moderate",
  "Conservative",
  "Prefer not to say",
];

export const LANGUAGE_OPTIONS = [
  "English",
  "English + Spanish",
  "English + French",
  "English + Italian",
  "English + Portuguese",
  "English + Arabic",
];

export const SOCIAL_ENERGY_OPTIONS = [
  "Social but balanced",
  "Thoughtful communicator",
  "Quiet confidence",
  "Affectionate in person",
  "High energy",
  "Calm and grounded",
  "Playful",
  "Deep conversationalist",
];

export const RELATIONSHIP_RHYTHM_OPTIONS = [
  "Intentional from the start",
  "Slow burn",
  "Consistent communication",
  "Quality time matters",
  "Emotionally steady",
  "Clear intentions",
  "Independent but connected",
];

export const SMALL_THINGS_I_VALUE_OPTIONS = [
  "Humour without ego",
  "Directness",
  "Follow-through",
  "Comfortable silence",
  "Shared routines",
  "Good eye contact",
  "Thoughtfulness",
  "Kindness to others",
];

export const GREEN_FLAGS_OPTIONS = [
  "Consistent energy",
  "Makes effort",
  "Clear intentions",
  "Warm with people",
  "Emotionally available",
  "Good listener",
  "Secure communication",
  "Respectful disagreement",
];

export const ONBOARDING_DEFAULT_MULTI = {
  social_energy: [],
  relationship_rhythm: [],
  small_things_i_value: [],
  green_flags: [],
};

const EDUCATION_ICON_KEYS = {
  "GCSEs / Secondary School": "school",
  "A Levels / College": "book",
  Apprenticeship: "tools",
  "Certificate / Diploma": "certificate",
  "Bachelor's Degree": "graduation_cap",
  "Master's Degree": "medal",
  "PhD / Doctorate": "doctorate",
  Other: "education",
};

const EDUCATION_ICON_COMPONENTS = {
  school: School,
  book: BookOpen,
  tools: Wrench,
  certificate: FileBadge2,
  graduation_cap: GraduationCap,
  medal: GraduationCap,
  doctorate: ScrollText,
  education: BookOpen,
};

export const HEIGHT_CM_RANGE = { min: 120, max: 230 };
export const HEIGHT_FEET_RANGE = { min: 3, max: 8 };
export const HEIGHT_INCHES_RANGE = { min: 0, max: 11 };

export const DEMO_MALE_BIO =
  "London, UK-based founder who values genuine chemistry and consistency. I'm happiest when connection feels natural and emotionally clear, and I'm looking for something with real substance. Big on good conversation and living well without losing depth or intention.";

export const DEMO_FEMALE_BIO =
  "London-based and drawn to genuine chemistry, emotional clarity, and consistency. I'm happiest when connection feels natural, thoughtful, and real. I value good conversation, warmth, and someone who brings intention without making dating feel forced.";

export const DEMO_MALE_LOOKING_FOR =
  "Someone emotionally available, consistent, and easy to be around. I'm drawn to chemistry that feels natural, but I value clarity and intention just as much.";

export const DEMO_FEMALE_LOOKING_FOR =
  "Someone emotionally available, consistent, and kind. I'm drawn to natural chemistry, but I value clarity, effort, and intention just as much.";

export const DEMO_MALE_WEEKEND =
  "A good mix of slow mornings, great food, seeing friends, and time to properly switch off. I like plans that feel relaxed but still have a little thought behind them.";

export const DEMO_FEMALE_WEEKEND =
  "A balance of slow mornings, good food, seeing people I care about, and having time to reset. I like plans that feel thoughtful without being overplanned.";

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

function ZodiacIcon({ sign, className = "w-3.5 h-3.5" }) {
  return createElement(
    "span",
    { className: `${className} inline-flex items-center justify-center leading-none`, style: { color: "currentColor", fontFamily: "inherit" } },
    ZODIAC_SYMBOLS[sign] || "✦",
  );
}

const DEMO_PROFILE_DATASETS = {
  male_gay_men: {
    location: "London, UK",
    education: "Exeter",
    work: "Founder",
    ethnicity: "Native American",
    height_cm: 180,
    pronouns: "He / him",
    dating_intention: "Long-term relationship",
    children: "Don't have children",
    future_family_desire: "Want children",
    pets: "Dog owner",
    drinking: "Sometimes",
    smoking: "No",
    drugs: "No",
    religion: "Agnostic",
    politics: "Progressive",
    languages: "English + Portuguese",
    bio: DEMO_MALE_BIO,
    prompt_looking_for: DEMO_MALE_LOOKING_FOR,
    prompt_ideal_weekend: "A good mix of slow mornings, great food, seeing friends, and time to properly switch off.",
    social_energy: ["Social but balanced", "Thoughtful communicator", "Quiet confidence"],
    relationship_rhythm: ["Intentional from the start", "Consistent communication", "Emotionally steady"],
    small_things_i_value: ["Directness", "Comfortable silence", "Follow-through"],
    green_flags: ["Consistent energy", "Emotionally available", "Makes effort"],
  },
  male_straight_women: {
    location: "London, UK",
    education: "Exeter",
    work: "Founder",
    ethnicity: "Native American",
    height_cm: 180,
    pronouns: "He / him",
    dating_intention: "Long-term relationship",
    children: "Don't have children",
    future_family_desire: "Want children",
    pets: "Dog owner",
    drinking: "Sometimes",
    smoking: "No",
    drugs: "No",
    religion: "Agnostic",
    politics: "Progressive",
    languages: "English + Portuguese",
    bio: DEMO_MALE_BIO,
    prompt_looking_for: DEMO_MALE_LOOKING_FOR,
    prompt_ideal_weekend: DEMO_MALE_WEEKEND,
    social_energy: ["Calm and grounded", "Thoughtful communicator", "Playful"],
    relationship_rhythm: ["Intentional from the start", "Quality time matters", "Clear intentions"],
    small_things_i_value: ["Directness", "Shared routines", "Thoughtfulness"],
    green_flags: ["Consistent energy", "Warm with people", "Secure communication"],
  },
  male_bisexual_men_women: {
    location: "London, UK",
    education: "King's College London",
    work: "Product lead",
    ethnicity: "Mixed heritage",
    height_cm: 179,
    pronouns: "He / him",
    dating_intention: "Long-term relationship",
    children: "Don't have children",
    future_family_desire: "Open to children",
    pets: "Dog owner",
    drinking: "Sometimes",
    smoking: "No",
    drugs: "No",
    religion: "Spiritual",
    politics: "Progressive",
    languages: "English + Spanish",
    bio: "Grounded, open-minded, and drawn to chemistry that feels emotionally safe. I value connection that has warmth, honesty, and enough curiosity to grow into something real.",
    prompt_looking_for: "Someone emotionally mature, warm, and self-aware. Chemistry matters to me, but so does steadiness and the ability to communicate clearly.",
    prompt_ideal_weekend: "Great food, a bit of spontaneity, seeing people I love, and enough space to properly reset.",
    social_energy: ["Social but balanced", "Deep conversationalist", "Playful"],
    relationship_rhythm: ["Slow burn", "Consistent communication", "Independent but connected"],
    small_things_i_value: ["Humour without ego", "Directness", "Kindness to others"],
    green_flags: ["Makes effort", "Good listener", "Respectful disagreement"],
  },
  female_straight_men: {
    location: "London, UK",
    education: "UCL",
    work: "Creative strategist",
    ethnicity: "Mixed ethnicity",
    height_cm: 170,
    pronouns: "She / her",
    dating_intention: "Long-term relationship",
    children: "Don't have children",
    future_family_desire: "Open to children",
    pets: "Cat person",
    drinking: "Sometimes",
    smoking: "No",
    drugs: "No",
    religion: "Spiritual",
    politics: "Progressive",
    languages: "English + French",
    bio: "Drawn to emotionally grounded people, thoughtful conversation, and connection that feels calm and genuine. I value consistency, warmth, and relationships that feel intentional without becoming performative.",
    prompt_looking_for: DEMO_FEMALE_LOOKING_FOR,
    prompt_ideal_weekend: DEMO_FEMALE_WEEKEND,
    social_energy: ["Thoughtful communicator", "Calm and grounded", "Affectionate in person"],
    relationship_rhythm: ["Intentional from the start", "Emotionally steady", "Quality time matters"],
    small_things_i_value: ["Thoughtfulness", "Kindness to others", "Follow-through"],
    green_flags: ["Makes effort", "Emotionally available", "Warm with people"],
  },
  female_lesbian_women: {
    location: "London, UK",
    education: "Bristol",
    work: "Creative director",
    ethnicity: "White / Caucasian",
    height_cm: 168,
    pronouns: "She / her",
    dating_intention: "Long-term relationship",
    children: "Don't have children",
    future_family_desire: "Open to children",
    pets: "Dog owner",
    drinking: "Sometimes",
    smoking: "No",
    drugs: "No",
    religion: "Agnostic",
    politics: "Progressive",
    languages: "English + Italian",
    bio: "Warm, expressive, and quietly intentional. I'm drawn to women who feel emotionally clear, grounded in themselves, and easy to relax around.",
    prompt_looking_for: "Someone self-aware, emotionally available, and genuinely kind. I like chemistry that feels natural, but I care just as much about steadiness and reciprocity.",
    prompt_ideal_weekend: "Coffee, movement, a little culture, and the kind of time together that feels both easy and meaningful.",
    social_energy: ["Thoughtful communicator", "Quiet confidence", "Affectionate in person"],
    relationship_rhythm: ["Slow burn", "Emotionally steady", "Clear intentions"],
    small_things_i_value: ["Comfortable silence", "Thoughtfulness", "Good eye contact"],
    green_flags: ["Warm with people", "Secure communication", "Good listener"],
  },
  female_bisexual_men_women: {
    location: "London, UK",
    education: "King's College London",
    work: "Brand strategist",
    ethnicity: "Mixed heritage",
    height_cm: 169,
    pronouns: "She / her",
    dating_intention: "Long-term relationship",
    children: "Don't have children",
    future_family_desire: "Not sure yet",
    pets: "Cat person",
    drinking: "Sometimes",
    smoking: "No",
    drugs: "No",
    religion: "Spiritual",
    politics: "Progressive",
    languages: "English + Spanish",
    bio: "Playful, emotionally aware, and drawn to people who feel both warm and genuine. I like connection that has chemistry, curiosity, and a sense of ease.",
    prompt_looking_for: "Someone emotionally available, consistent, and kind. I'm drawn to people who feel open, grounded, and easy to be around.",
    prompt_ideal_weekend: "Good food, a bit of spontaneity, and time that feels connected rather than over-structured.",
    social_energy: ["Social but balanced", "Playful", "Deep conversationalist"],
    relationship_rhythm: ["Slow burn", "Consistent communication", "Independent but connected"],
    small_things_i_value: ["Humour without ego", "Thoughtfulness", "Kindness to others"],
    green_flags: ["Consistent energy", "Makes effort", "Good listener"],
  },
  non_binary_default: {
    location: "London, UK",
    education: "UCL",
    work: "Consultant",
    ethnicity: "South Asian",
    height_cm: 173,
    pronouns: "They / them",
    dating_intention: "Long-term relationship",
    children: "Don't have children",
    future_family_desire: "Open to children",
    pets: "No pets",
    drinking: "Sometimes",
    smoking: "No",
    drugs: "No",
    religion: "Agnostic",
    politics: "Progressive",
    languages: "English + Arabic",
    bio: "Grounded, emotionally curious, and happiest in connection that feels safe, thoughtful, and real. I value people who know themselves and communicate with care.",
    prompt_looking_for: "Someone emotionally available, thoughtful, and steady. I value chemistry, but I care most about clarity, softness, and mutual respect.",
    prompt_ideal_weekend: "Slow mornings, good conversation, something a little cultural or outdoors, and enough time to come back to myself.",
    social_energy: ["Thoughtful communicator", "Calm and grounded", "Deep conversationalist"],
    relationship_rhythm: ["Intentional from the start", "Quality time matters", "Independent but connected"],
    small_things_i_value: ["Thoughtfulness", "Directness", "Kindness to others"],
    green_flags: ["Emotionally available", "Respectful disagreement", "Makes effort"],
  },
  trans_male_default: {
    location: "London, UK",
    education: "Manchester",
    work: "Product designer",
    ethnicity: "Latinx / Hispanic",
    height_cm: 176,
    pronouns: "He / him",
    dating_intention: "Long-term relationship",
    children: "Don't have children",
    future_family_desire: "Want children",
    pets: "Dog owner",
    drinking: "Sometimes",
    smoking: "No",
    drugs: "No",
    religion: "Agnostic",
    politics: "Progressive",
    languages: "English + Spanish",
    bio: "Warm, grounded, and clear about wanting something real. I value emotional safety, humour, and people who feel consistent in how they show up.",
    prompt_looking_for: "Someone kind, emotionally available, and easy to trust. I care about chemistry, but I'm most drawn to steadiness and warmth.",
    prompt_ideal_weekend: "A mix of good food, movement, seeing people I love, and a little downtime to properly reset.",
    social_energy: ["Social but balanced", "Thoughtful communicator", "Calm and grounded"],
    relationship_rhythm: ["Consistent communication", "Clear intentions", "Emotionally steady"],
    small_things_i_value: ["Follow-through", "Comfortable silence", "Thoughtfulness"],
    green_flags: ["Good listener", "Secure communication", "Warm with people"],
  },
  trans_female_default: {
    location: "London, UK",
    education: "Cambridge",
    work: "Comms consultant",
    ethnicity: "Black / African / Caribbean",
    height_cm: 171,
    pronouns: "She / her",
    dating_intention: "Long-term relationship",
    children: "Don't have children",
    future_family_desire: "Open to children",
    pets: "Cat person",
    drinking: "Sometimes",
    smoking: "No",
    drugs: "No",
    religion: "Spiritual",
    politics: "Progressive",
    languages: "English",
    bio: "Stylish, thoughtful, and drawn to connection that feels calm, intentional, and emotionally honest. I value warmth, effort, and people who make dating feel easy to trust.",
    prompt_looking_for: "Someone emotionally grounded, kind, and clear in how they communicate. Chemistry matters to me, but not without intention and consistency.",
    prompt_ideal_weekend: "Good food, a little beauty or culture, and time together that feels both light and meaningful.",
    social_energy: ["Quiet confidence", "Affectionate in person", "Thoughtful communicator"],
    relationship_rhythm: ["Intentional from the start", "Quality time matters", "Emotionally steady"],
    small_things_i_value: ["Kindness to others", "Follow-through", "Good eye contact"],
    green_flags: ["Makes effort", "Emotionally available", "Respectful disagreement"],
  },
  queer_default: {
    location: "London, UK",
    education: "Imperial",
    work: "Research strategist",
    ethnicity: "Mixed heritage",
    height_cm: 172,
    pronouns: "They / them",
    dating_intention: "Long-term relationship",
    children: "Don't have children",
    future_family_desire: "Not sure yet",
    pets: "No pets",
    drinking: "Sometimes",
    smoking: "No",
    drugs: "No",
    religion: "Spiritual",
    politics: "Progressive",
    languages: "English + French",
    bio: "Open-minded, emotionally articulate, and drawn to people who feel grounded in themselves. I like chemistry with depth, but I care most about honesty, care, and emotional steadiness.",
    prompt_looking_for: "Someone thoughtful, self-aware, and emotionally available. I value warmth, clarity, and a connection that feels genuinely mutual.",
    prompt_ideal_weekend: "A balance of rest, good conversation, a little culture, and plans that feel easy rather than performative.",
    social_energy: ["Deep conversationalist", "Thoughtful communicator", "Social but balanced"],
    relationship_rhythm: ["Slow burn", "Independent but connected", "Quality time matters"],
    small_things_i_value: ["Directness", "Thoughtfulness", "Kindness to others"],
    green_flags: ["Secure communication", "Good listener", "Makes effort"],
  },
  pansexual_default: {
    location: "London, UK",
    education: "Bristol",
    work: "Strategy consultant",
    ethnicity: "Mixed heritage",
    height_cm: 174,
    pronouns: "They / them",
    dating_intention: "Long-term relationship",
    children: "Don't have children",
    future_family_desire: "Open to children",
    pets: "Dog owner",
    drinking: "Sometimes",
    smoking: "No",
    drugs: "No",
    religion: "Agnostic",
    politics: "Progressive",
    languages: "English + French",
    bio: "Emotionally grounded, open-hearted, and drawn to connection that feels warm, intentional, and easy to trust. I value chemistry, but I care just as much about steadiness, kindness, and people who communicate well.",
    prompt_looking_for: "Someone emotionally available, thoughtful, and secure in themselves. I like chemistry that feels natural, but I value consistency and clarity just as much.",
    prompt_ideal_weekend: "A slow start, somewhere good to eat, a little spontaneity, and enough time together for things to feel genuinely connected.",
    social_energy: ["Social but balanced", "Playful", "Thoughtful communicator"],
    relationship_rhythm: ["Consistent communication", "Independent but connected", "Clear intentions"],
    small_things_i_value: ["Humour without ego", "Thoughtfulness", "Comfortable silence"],
    green_flags: ["Emotionally available", "Makes effort", "Respectful disagreement"],
  },
};

function getDemoDatasetKey({
  genderIdentity = "",
  sexualPreference = "",
  lookingFor = "",
} = {}) {
  const normalizedGender = normalizeGenderIdentity(genderIdentity);
  const normalizedPreference = normalizeSexualPreference(sexualPreference);
  const normalizedLookingFor = normalizeLookingFor(lookingFor);

  if (normalizedPreference === "pansexual") return "pansexual_default";
  if (normalizedPreference === "queer") return "queer_default";
  if (normalizedGender === "non_binary") return "non_binary_default";
  if (normalizedGender === "trans_male") return "trans_male_default";
  if (normalizedGender === "trans_female") return "trans_female_default";

  if (normalizedGender === "male") {
    if (normalizedPreference === "gay" && normalizedLookingFor === "men") return "male_gay_men";
    if (normalizedPreference === "straight" && normalizedLookingFor === "women") return "male_straight_women";
    if (normalizedPreference === "bisexual") return "male_bisexual_men_women";
    if (normalizedPreference === "gay") return "male_gay_men";
    if (normalizedPreference === "straight") return "male_straight_women";
  }

  if (normalizedGender === "female") {
    if (normalizedPreference === "lesbian" && normalizedLookingFor === "women") return "female_lesbian_women";
    if (normalizedPreference === "straight" && normalizedLookingFor === "men") return "female_straight_men";
    if (normalizedPreference === "bisexual") return "female_bisexual_men_women";
    if (normalizedPreference === "lesbian") return "female_lesbian_women";
    if (normalizedPreference === "straight") return "female_straight_men";
  }

  if (normalizedPreference === "bisexual") {
    return normalizedGender === "female" ? "female_bisexual_men_women" : "male_bisexual_men_women";
  }

  return normalizedGender === "female" ? "female_straight_men" : "male_gay_men";
}

export function getDobIso(dob = {}) {
  if (!dob.day || !dob.month || !dob.year) return "";
  const day = String(dob.day).padStart(2, "0");
  const month = String(dob.month).padStart(2, "0");
  const year = String(dob.year);
  return `${year}-${month}-${day}`;
}

export function getAgeFromDob(dob = {}) {
  const iso = typeof dob === "string" ? dob : getDobIso(dob);
  if (!iso) return null;
  const birth = new Date(`${iso}T12:00:00`);
  if (Number.isNaN(birth.getTime())) return null;
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) age -= 1;
  return age >= 18 ? age : null;
}

export function getDerivedStarSign(dob = {}) {
  const iso = typeof dob === "string" ? dob : getDobIso(dob);
  return getZodiacSign(iso) || "";
}

function clampNumber(value, min, max) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return null;
  return Math.min(max, Math.max(min, numeric));
}

export function centimetersToFeetInches(cmValue) {
  const cm = clampNumber(cmValue, HEIGHT_CM_RANGE.min, HEIGHT_CM_RANGE.max);
  if (!cm) return { feet: 6, inches: 0 };
  const totalInches = Math.round(cm / 2.54);
  const feet = Math.floor(totalInches / 12);
  const inches = totalInches % 12;
  return { feet, inches };
}

export function feetInchesToCentimeters(feetValue, inchesValue) {
  const feet = clampNumber(feetValue, HEIGHT_FEET_RANGE.min, HEIGHT_FEET_RANGE.max);
  const inches = clampNumber(inchesValue, HEIGHT_INCHES_RANGE.min, HEIGHT_INCHES_RANGE.max);
  if (feet === null || inches === null) return null;
  return Math.round(((feet * 12) + inches) * 2.54);
}

export function buildHeightData({
  unit = "cm",
  cmValue = null,
  feetValue = null,
  inchesValue = null,
} = {}) {
  if (unit === "ft") {
    const safeFeet = clampNumber(feetValue, HEIGHT_FEET_RANGE.min, HEIGHT_FEET_RANGE.max);
    const safeInches = clampNumber(inchesValue, HEIGHT_INCHES_RANGE.min, HEIGHT_INCHES_RANGE.max);
    if (safeFeet === null || safeInches === null) {
      return {
        unit: "ft",
        cmValue: null,
        feetValue: null,
        inchesValue: null,
        displayValue: "",
      };
    }
    return {
      unit: "ft",
      cmValue: null,
      feetValue: safeFeet,
      inchesValue: safeInches,
      displayValue: `${safeFeet} ft ${safeInches}"`,
    };
  }

  const safeCm = clampNumber(cmValue, HEIGHT_CM_RANGE.min, HEIGHT_CM_RANGE.max);
  if (safeCm === null) {
    return {
      unit: "cm",
      cmValue: null,
      feetValue: null,
      inchesValue: null,
      displayValue: "",
    };
  }
  return {
    unit: "cm",
    cmValue: safeCm,
    feetValue: null,
    inchesValue: null,
    displayValue: `${safeCm} cm`,
  };
}

export function getHeightDataFromProfile(profile = {}) {
  if (profile.height?.displayValue) return profile.height;
  if (profile.height_unit === "ft") {
    return buildHeightData({
      unit: "ft",
      feetValue: profile.height_feet,
      inchesValue: profile.height_inches,
    });
  }
  return buildHeightData({
    unit: profile.height_unit || "cm",
    cmValue: profile.height_cm,
  });
}

export function formatHeightLabel(heightValue, fallbackCmValue = null) {
  if (heightValue?.displayValue) return heightValue.displayValue;
  const normalized = buildHeightData({
    unit: heightValue?.unit || "cm",
    cmValue: heightValue?.cmValue ?? fallbackCmValue,
    feetValue: heightValue?.feetValue,
    inchesValue: heightValue?.inchesValue,
  });
  return normalized.displayValue;
}

export function buildEducationData({
  level = "",
  institution = "",
} = {}) {
  const displayLevel =
    level === "Bachelor's Degree"
      ? "Bachelor's"
      : level === "Master's Degree"
        ? "Master's"
        : level === "PhD / Doctorate"
          ? "PhD"
          : level || "";
  const displayInstitution = institution || "";
  const iconKey = EDUCATION_ICON_KEYS[level] || "education";
  return {
    level,
    institution,
    displayInstitution,
    displayLevel,
    iconKey,
  };
}

export function getEducationDataFromProfile(profile = {}) {
  if (profile.education_details?.displayInstitution || profile.education_details?.displayLevel) {
    return profile.education_details;
  }
  if (profile.education_level || profile.education_institution) {
    return buildEducationData({
      level: profile.education_level,
      institution: profile.education_institution || profile.education,
    });
  }
  if (profile.education) {
    return buildEducationData({
      level: "Bachelor's Degree",
      institution: profile.education,
    });
  }
  return buildEducationData();
}

export function getEducationIconComponent(iconKey = "education") {
  return EDUCATION_ICON_COMPONENTS[iconKey] || BookOpen;
}

export function getDefaultProfileDetails(genderIdentity = "") {
  const normalizedGender = normalizeGenderIdentity(genderIdentity);
  if (normalizedGender === "female") {
    return {
      pronouns: "She / her",
      education_level: "Bachelor's Degree",
      education_institution: "King's College London",
      education_details: buildEducationData({
        level: "Bachelor's Degree",
        institution: "King's College London",
      }),
      education: "King's College London",
      work: "Creative Lead",
      ethnicity: "Mixed heritage",
      dating_intention: "Serious dating",
      children: "Don't have children",
      future_family_desire: "Open to children",
      pets: "Dog owner",
      drinking: "Sometimes",
      smoking: "No",
      drugs: "No",
      religion: "Spiritual",
      politics: "Progressive",
      languages: "English + French",
    };
  }
  return {
    pronouns: "He / him",
    education_level: "Bachelor's Degree",
    education_institution: "Exeter",
    education_details: buildEducationData({
      level: "Bachelor's Degree",
      institution: "Exeter",
    }),
    education: "Exeter",
    work: "Founder",
    ethnicity: "Native American",
    dating_intention: "Long-term relationship",
    children: "Don't have children",
    future_family_desire: "Want children",
    pets: "Dog owner",
    drinking: "Sometimes",
    smoking: "No",
    drugs: "No",
    religion: "Agnostic",
    politics: "Progressive",
    languages: "English + Portuguese",
  };
}

export function getDemoProfileDefaults({
  genderIdentity = "",
  sexualPreference = "",
  lookingFor = "",
} = {}) {
  const key = getDemoDatasetKey({ genderIdentity, sexualPreference, lookingFor });
  return key ? DEMO_PROFILE_DATASETS[key] || null : null;
}

export function getDemoAutoFillCopy({
  genderIdentity = "",
  sexualPreference = "",
  lookingFor = "",
} = {}) {
  const defaults = getDemoProfileDefaults({ genderIdentity, sexualPreference, lookingFor });
  if (!defaults) return null;
  return {
    height_cm: defaults.height_cm,
    height_unit: "cm",
    height_feet: null,
    height_inches: null,
    height_display_value: `${defaults.height_cm} cm`,
    height: buildHeightData({ unit: "cm", cmValue: defaults.height_cm }),
    pronouns: defaults.pronouns,
    education_level: defaults.education_level || "Bachelor's Degree",
    education_institution: defaults.education,
    education_details: buildEducationData({
      level: defaults.education_level || "Bachelor's Degree",
      institution: defaults.education,
    }),
    education: defaults.education,
    work: defaults.work,
    ethnicity: defaults.ethnicity,
    location: defaults.location === "London, UK" ? "London" : defaults.location,
    dating_intention: defaults.dating_intention,
    children: defaults.children,
    future_family_desire: defaults.future_family_desire,
    pets: defaults.pets,
    drinking: defaults.drinking,
    smoking: defaults.smoking,
    drugs: defaults.drugs,
    religion: defaults.religion,
    politics: defaults.politics,
    languages: defaults.languages,
    bio: defaults.bio,
    prompt_looking_for: defaults.prompt_looking_for,
    prompt_ideal_weekend: defaults.prompt_ideal_weekend,
    social_energy: defaults.social_energy,
    relationship_rhythm: defaults.relationship_rhythm,
    small_things_i_value: defaults.small_things_i_value,
    green_flags: defaults.green_flags,
  };
}

export function applyDefaultProfileDetails(
  formData,
  genderIdentity = "",
  sexualPreference = "",
  lookingFor = "",
) {
  const defaults =
    getDemoProfileDefaults({ genderIdentity, sexualPreference, lookingFor }) ||
    getDefaultProfileDetails(genderIdentity);
  const next = { ...formData };
  Object.entries(defaults).forEach(([key, value]) => {
    if (!next[key]) next[key] = value;
  });
  return next;
}

export function createAtAGlanceItems(profile = {}) {
  const educationDetails = getEducationDataFromProfile(profile);
  const items = [
    { key: "gender_identity", icon: UserRound, value: profile.gender_identity_label || profile.gender_identity },
    { key: "sexual_preference", icon: Orbit, value: profile.sexual_preference_label || profile.sexual_preference },
    { key: "pronouns", icon: MessageSquareText, value: profile.pronouns },
    { key: "dating_intention", icon: Heart, value: profile.dating_intention },
    { key: "height_cm", icon: Ruler, value: formatHeightLabel(profile.height, profile.height_cm) },
    { key: "education_level", icon: getEducationIconComponent(educationDetails.iconKey), value: educationDetails.displayLevel },
    { key: "children", icon: Baby, value: profile.children },
    { key: "future_family_desire", icon: Baby, value: profile.future_family_desire },
    { key: "pets", icon: PawPrint, value: profile.pets },
    { key: "drinking", icon: Wine, value: profile.drinking },
    { key: "smoking", icon: Cigarette, value: profile.smoking },
    { key: "drugs", icon: Pill, value: profile.drugs },
    { key: "religion", icon: Landmark, value: profile.religion },
    { key: "politics", icon: Flag, value: profile.politics },
    { key: "languages", icon: Languages, value: profile.languages },
    {
      key: "star_sign",
      icon: profile.derived_star_sign
        ? (props) => ZodiacIcon({ sign: profile.derived_star_sign || profile.star_sign, ...props })
        : Sparkles,
      value: profile.derived_star_sign || profile.star_sign,
    },
  ];

  return items.filter((item) => item.value).map((item) => ({
    ...item,
    label: item.value,
  }));
}

export function createSecondaryBannerItems(profile = {}) {
  const educationDetails = getEducationDataFromProfile(profile);
  return [
    { key: "location", icon: MapPin, value: profile.location },
    { key: "education", icon: GraduationCap, value: educationDetails.displayInstitution },
    { key: "work", icon: BriefcaseBusiness, value: profile.work },
    { key: "ethnicity", icon: UserRound, value: profile.ethnicity },
  ].filter((item) => item.value);
}
