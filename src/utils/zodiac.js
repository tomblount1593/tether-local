const ZODIAC_RANGES = [
  { sign: "Capricorn", start: [12, 22], end: [1, 19] },
  { sign: "Aquarius", start: [1, 20], end: [2, 18] },
  { sign: "Pisces", start: [2, 19], end: [3, 20] },
  { sign: "Aries", start: [3, 21], end: [4, 19] },
  { sign: "Taurus", start: [4, 20], end: [5, 20] },
  { sign: "Gemini", start: [5, 21], end: [6, 20] },
  { sign: "Cancer", start: [6, 21], end: [7, 22] },
  { sign: "Leo", start: [7, 23], end: [8, 22] },
  { sign: "Virgo", start: [8, 23], end: [9, 22] },
  { sign: "Libra", start: [9, 23], end: [10, 22] },
  { sign: "Scorpio", start: [10, 23], end: [11, 21] },
  { sign: "Sagittarius", start: [11, 22], end: [12, 21] },
];

export const USER_DATE_OF_BIRTH = "1993-05-01";

export const MATCH_BIRTHDAYS_BY_NAME = {
  Finn: "1990-09-14",
  Reuben: "1988-03-07",
  Leon: "1994-08-18",
  Marcus: "1991-02-06",
  Jamie: "1992-11-09",
  Callum: "1995-06-14",
  "Étienne": "1992-01-12",
  Luca: "1993-07-08",
  Oliver: "1994-12-05",
  Noah: "1996-04-03",
  Sophia: "1991-09-22",
  Amelia: "1993-02-24",
  Maya: "1994-10-11",
  Isla: "1992-01-03",
  Freya: "1995-07-16",
  Naomi: "1991-11-18",
  Priya: "1993-05-27",
  Elena: "1990-08-04",
  Clara: "1996-01-28",
  Yasmin: "1992-04-07",
  Henrik: "1989-03-04",
  Daniel: "1993-10-03",
  River: "1994-02-01",
  Sage: "1992-07-29",
  Quinn: "1996-09-03",
  Ash: "1993-12-27",
  Rae: "1990-06-03",
  Juno: "1996-01-28",
  Sophie: "1992-04-17",
  Mia: "1993-05-08",
  Chloe: "1994-11-21",
  Ava: "1995-08-11",
  Grace: "1991-06-01",
  Isabelle: "1992-10-19",
  Margot: "1991-11-15",
  Zara: "1995-03-30",
  Nadia: "1994-02-24",
  Tom: "1993-05-01",
};

const TAURUS_PROFILE = {
  traits: ["steady", "loyal", "sensual", "grounded"],
  strongestSigns: ["Virgo", "Capricorn", "Cancer", "Pisces"],
  worthExploring: ["Leo", "Libra", "Scorpio"],
  consciousRhythm: ["Gemini", "Aquarius", "Sagittarius"],
};

const HIGH = new Set(["Virgo", "Capricorn", "Cancer", "Pisces"]);
const INTENSE = new Set(["Scorpio"]);
const EXPLORE = new Set(["Leo", "Libra"]);
const RHYTHM = new Set(["Gemini", "Aquarius", "Sagittarius", "Aries"]);

export function getZodiacSign(dateOfBirth) {
  if (!dateOfBirth) return null;
  const d = new Date(`${dateOfBirth}T12:00:00`);
  if (Number.isNaN(d.getTime())) return null;
  const month = d.getMonth() + 1;
  const day = d.getDate();

  for (const range of ZODIAC_RANGES) {
    const [sm, sd] = range.start;
    const [em, ed] = range.end;
    const wraps = sm > em;
    const afterStart = month > sm || (month === sm && day >= sd);
    const beforeEnd = month < em || (month === em && day <= ed);
    if ((wraps && (afterStart || beforeEnd)) || (!wraps && afterStart && beforeEnd)) {
      return range.sign;
    }
  }
  return null;
}

export function getUserSign() {
  return getZodiacSign(USER_DATE_OF_BIRTH) || "Taurus";
}

export function getCompatibilityLabel(userSign, matchSign) {
  if (userSign === "Taurus") {
    if (matchSign === "Taurus") return "Stable familiar rhythm";
    if (HIGH.has(matchSign)) return "Strong traditional fit";
    if (INTENSE.has(matchSign)) return "Magnetic contrast";
    if (EXPLORE.has(matchSign)) return "Worth exploring";
    if (RHYTHM.has(matchSign)) return "Needs conscious rhythm";
  }
  return "Worth exploring";
}

export function getTaurusMatchInsight(matchSign) {
  const map = {
    Virgo: {
      compatibilityLabel: "Strong traditional fit",
      summary: "Grounded and steady - a traditionally strong earth-sign pairing.",
      whereItWorks: "Shared reliability, practical care, and calm day-to-day rhythm.",
      whereYouMayDiffer: "Both can lean into routine, so novelty needs to be chosen intentionally.",
      recommendation: "Not a dealbreaker - more of a rhythm to be aware of.",
    },
    Capricorn: {
      compatibilityLabel: "Strong traditional fit",
      summary: "A grounded pairing built around ambition, loyalty, and long-term direction.",
      whereItWorks: "You both value consistency, maturity, and follow-through.",
      whereYouMayDiffer: "The connection may need emotional softness so it doesn't become too practical.",
      recommendation: "Not a dealbreaker - more of a rhythm to be aware of.",
    },
    Cancer: {
      compatibilityLabel: "Warm emotional fit",
      summary: "A caring, emotionally steady pairing with strong comfort potential.",
      whereItWorks: "Cancer brings emotional warmth while Taurus brings reassurance and consistency.",
      whereYouMayDiffer: "You may need to balance sensitivity with direct communication.",
      recommendation: "Not a dealbreaker - more of a rhythm to be aware of.",
    },
    Pisces: {
      compatibilityLabel: "Gentle complementary fit",
      summary: "A soft, intuitive pairing where steadiness and imagination can balance well.",
      whereItWorks: "Taurus grounds Pisces while Pisces brings emotional openness and creativity.",
      whereYouMayDiffer: "Clear plans help prevent the connection from becoming too vague.",
      recommendation: "Not a dealbreaker - more of a rhythm to be aware of.",
    },
    Scorpio: {
      compatibilityLabel: "Magnetic contrast",
      summary: "A traditionally opposite-sign pairing with strong chemistry and emotional depth.",
      whereItWorks: "Both signs value loyalty and intensity once trust is built.",
      whereYouMayDiffer: "This works best when emotional intensity becomes honesty rather than control.",
      recommendation: "Not a dealbreaker - more of a rhythm to be aware of.",
    },
    Leo: {
      compatibilityLabel: "Warm expressive contrast",
      summary: "Not the most obvious traditional pairing, but warmth and loyalty can create strong chemistry.",
      whereItWorks: "Leo brings confidence and playfulness; Taurus brings steadiness and devotion.",
      whereYouMayDiffer: "Leo may want more visible excitement while Taurus prefers steadier pacing.",
      recommendation: "Not a dealbreaker - more of a rhythm to be aware of.",
    },
    Libra: {
      compatibilityLabel: "Aesthetic social potential",
      summary: "A Venus-ruled pairing with shared appreciation for beauty, warmth, and social ease.",
      whereItWorks: "You may connect through taste, charm, and a polished sense of romance.",
      whereYouMayDiffer: "Libra may move socially faster while Taurus needs grounded consistency.",
      recommendation: "Not a dealbreaker - more of a rhythm to be aware of.",
    },
    Gemini: {
      compatibilityLabel: "Curious contrast",
      summary: "Different rhythms, but this can work when curiosity is balanced with consistency.",
      whereItWorks: "Gemini brings lightness and conversation; Taurus brings grounding and follow-through.",
      whereYouMayDiffer: "Gemini may need variety while Taurus values routine.",
      recommendation: "Not a dealbreaker - more of a rhythm to be aware of.",
    },
    Aquarius: {
      compatibilityLabel: "Growth edge",
      summary: "A contrast pairing where independence and steadiness need conscious balance.",
      whereItWorks: "Different perspectives can keep the connection fresh when values still align.",
      whereYouMayDiffer: "You may need clearer communication around freedom, routine, and emotional pacing.",
      recommendation: "Not a dealbreaker - more of a rhythm to be aware of.",
    },
    Sagittarius: {
      compatibilityLabel: "Adventurous contrast",
      summary: "Different speeds, but there can be spark when adventure is balanced with reliability.",
      whereItWorks: "Sagittarius brings optimism and exploration; Taurus brings grounding.",
      whereYouMayDiffer: "Pacing and commitment expectations need to be named early.",
      recommendation: "Not a dealbreaker - more of a rhythm to be aware of.",
    },
    Aries: {
      compatibilityLabel: "Direct chemistry",
      summary: "A bold pairing with physical energy and direct attraction potential.",
      whereItWorks: "Aries brings momentum; Taurus brings patience and staying power.",
      whereYouMayDiffer: "Aries may move quickly while Taurus prefers to build trust gradually.",
      recommendation: "Not a dealbreaker - more of a rhythm to be aware of.",
    },
    Taurus: {
      compatibilityLabel: "Familiar steady rhythm",
      summary: "A stable same-sign pairing with shared comfort, loyalty, and sensuality.",
      whereItWorks: "You both value consistency and emotional security.",
      whereYouMayDiffer: "The connection may need variety so comfort doesn't become predictability.",
      recommendation: "Not a dealbreaker - more of a rhythm to be aware of.",
    },
  };
  return map[matchSign] || map.Libra;
}

export function getZodiacCompatibility(userSign, matchSign) {
  if (userSign === "Taurus") {
    return getTaurusMatchInsight(matchSign || "Libra");
  }
  const label = getCompatibilityLabel(userSign, matchSign);
  const pair = `${userSign} + ${matchSign}`;
  const byLabel = {
    "Strong traditional fit": {
      summary: `${pair} is traditionally grounded and steady.`,
      whereItWorks: "Shared reliability, emotional patience, and practical care.",
      whereYouMayDiffer: "Comfort can become routine unless novelty is chosen intentionally.",
      recommendation: "Keep momentum with small new experiences together.",
    },
    "Magnetic contrast": {
      summary: `${pair} can feel magnetic when trust and honesty are strong.`,
      whereItWorks: "Depth, loyalty, and strong emotional presence.",
      whereYouMayDiffer: "Intensity and control can surface if communication gets unclear.",
      recommendation: "Name expectations early and keep emotional pacing explicit.",
    },
    "Needs conscious rhythm": {
      summary: `${pair} can work well with clear communication around pace.`,
      whereItWorks: "Fresh perspective, growth, and complementary strengths.",
      whereYouMayDiffer: "Routine vs spontaneity can create friction.",
      recommendation: "Agree on a rhythm that protects both stability and freedom.",
    },
    "Stable familiar rhythm": {
      summary: `${pair} is steady and familiar from the start.`,
      whereItWorks: "Mutual loyalty, consistency, and comfort.",
      whereYouMayDiffer: "Both may avoid change for too long.",
      recommendation: "Add variety to keep connection energised.",
    },
    "Worth exploring": {
      summary: `${pair} is not always an obvious traditional match, but can still work beautifully.`,
      whereItWorks: "Chemistry can grow with strong humour and lifestyle fit.",
      whereYouMayDiffer: "Different emotional pacing may need clearer check-ins.",
      recommendation: "Treat this as a curiosity-led match, not a fixed script.",
    },
  };
  return { compatibilityLabel: label, ...(byLabel[label] || byLabel["Worth exploring"]) };
}

export function getZodiacInsightCopy(userSign, matchSign) {
  const c = getZodiacCompatibility(userSign, matchSign);
  return {
    short: `${userSign} + ${matchSign}: ${c.summary.replace(`${userSign} + ${matchSign} `, "")}`,
    ...c,
  };
}

export function getUserZodiacOverview(userSign) {
  if (userSign !== "Taurus") {
    return {
      traits: ["steady", "loyal", "emotionally aware"],
      strongestSigns: ["Cancer", "Virgo", "Capricorn"],
      worthExploring: ["Libra", "Leo", "Scorpio"],
      consciousRhythm: ["Gemini", "Aquarius", "Sagittarius"],
    };
  }
  return TAURUS_PROFILE;
}

export function getBirthdayForName(name) {
  return MATCH_BIRTHDAYS_BY_NAME[name] || null;
}

export function enrichWithZodiac(profile) {
  const dateOfBirth = profile.dateOfBirth || getBirthdayForName(profile.display_name || profile.name);
  const zodiacSign = profile.zodiacSign || (dateOfBirth ? getZodiacSign(dateOfBirth) : null);
  return { ...profile, dateOfBirth, zodiacSign };
}
