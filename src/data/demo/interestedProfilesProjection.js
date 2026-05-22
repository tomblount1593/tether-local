import { hashSeed } from "@/data/demo/demoMatchPoolSelector";

const STANDARD_SPREAD = [90, 86, 82, 78, 74, 70, 66, 62, 88, 84, 80, 76, 72, 68, 64, 60, 89, 83, 77, 71];
const PREMIUM_SPREAD = [95, 92, 89, 87, 85, 94, 91, 88, 86, 90, 93, 89, 87, 85, 88];

function deterministicScore(index, seed, spread, min, max) {
  const base = spread[index % spread.length];
  const tweak = (hashSeed(`${seed}:${index}`) % 3) - 1;
  const value = base + tweak;
  return Math.max(min, Math.min(max, value));
}

export function projectInterestedProfiles(matches, context = {}, tier = "standard") {
  const seed = `${tier}:${context.genderIdentity || "u"}:${context.sexualPreference || "u"}:${context.bisexualFilter || "none"}:${context.transNonBinaryFilter || "none"}`;
  const sorted = [...(matches || [])].sort((a, b) => {
    if (b.compatibilityScore !== a.compatibilityScore) return b.compatibilityScore - a.compatibilityScore;
    return String(a.id).localeCompare(String(b.id));
  });

  return sorted.map((m, index) => {
    let score = m.compatibilityScore;
    if (tier === "standard") score = deterministicScore(index, seed, STANDARD_SPREAD, 60, 90);
    if (tier === "premium") score = deterministicScore(index, seed, PREMIUM_SPREAD, 85, 95);
    return {
      ...m,
      compatibilityScore: score,
    };
  });
}

