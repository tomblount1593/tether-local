import { hashSeed } from "@/data/demo/demoMatchPoolSelector";
import { getRouteOrientationFromContext } from "@/lib/compatibilityVariantRouting";

const MARKER_META = [
  {
    id: "type",
    title: "Your Type Insights",
    subtitle: "Visual and personality attraction",
    summaries: [
      "{name} aligns with your preference for confident, socially comfortable people with a direct first impression.",
      "{name} matches the attraction cues you usually respond to in real life, especially warmth and presence.",
      "This match reflects your preference for people who feel grounded, expressive, and naturally engaging.",
    ],
  },
  {
    id: "romantic_pattern",
    title: "Romantic Pattern Insights",
    subtitle: "Conflict and closeness rhythm",
    summaries: [
      "You both prefer warmth without intensity, which suggests lower friction in early dating.",
      "Your communication rhythms are compatible enough to make repair conversations feel easier.",
      "This pairing suggests a balanced pace between emotional closeness and personal space.",
    ],
  },
  {
    id: "intent_values",
    title: "Intent & Values Insights",
    subtitle: "Relationship direction",
    summaries: [
      "Your answers suggest similar expectations around emotional availability and dating momentum.",
      "You appear aligned on clarity, consistency, and what a meaningful relationship should feel like.",
      "This match shares your level of intent, which reduces mixed signals in early stages.",
    ],
  },
  {
    id: "lifestyle_social",
    title: "Lifestyle & Social Fit Insights",
    subtitle: "Real-world routine fit",
    summaries: [
      "Your social habits and preferred date pace are compatible enough to make first plans feel natural.",
      "Day-to-day rhythm looks compatible, with similar energy around plans, rest, and social time.",
      "Practical fit is strong here, especially around schedule style and how you like to spend free time.",
    ],
  },
  {
    id: "vibe",
    title: "First Impression & Vibe Insights",
    subtitle: "Chemistry signal",
    summaries: [
      "This match is likely to feel easy to talk to quickly, with enough contrast to keep curiosity alive.",
      "Early chemistry signals are strong, especially for conversational flow and emotional tone.",
      "First-impression compatibility looks promising and likely to translate into a comfortable date.",
    ],
  },
];

function getTone(score) {
  if (score >= 85) return "exceptional";
  if (score >= 75) return "strong";
  return "potential";
}

function scoreFromMarker(marker, fallback) {
  const value = Number(marker?.score);
  if (Number.isFinite(value)) return Math.max(0, Math.min(100, value));
  return fallback;
}

function genderContextLine(context = {}) {
  const pref = getRouteOrientationFromContext(context);
  if (pref === "gay") return "This reads like a strong male-male compatibility profile with clear communication potential.";
  if (pref === "lesbian") return "This reads as a thoughtful fit with strong emotional reciprocity and social ease.";
  if (pref === "bisexual") return "This profile reflects flexible attraction patterns with strong intent alignment.";
  if (pref === "trans_nonbinary") return "This profile suggests identity-safe compatibility with strong respect and communication signals.";
  return "This profile shows practical compatibility with clear potential for a comfortable first date.";
}

export function getCompatibilityBreakdownForMatch(match, context = {}) {
  if (!match) return null;
  const name = String(match.displayName || "This match");
  const baseScore = Number(match.compatibilityScore) || 72;
  const markersSource = match.compatibilityMarkers || {};
  const sourceList = [
    markersSource.typeMarker,
    markersSource.romanticPatternMarker,
    markersSource.intentValuesMarker,
    markersSource.lifestyleSocialMarker,
    markersSource.firstImpressionVibeMarker,
  ];

  const variationPattern = [-3, 4, 8, 2, -1];
  let markers = MARKER_META.map((meta, idx) => {
    const fallbackScore = Math.max(55, Math.min(95, baseScore + variationPattern[idx]));
    const rawScore = scoreFromMarker(sourceList[idx], fallbackScore);
    const markerScore = Math.max(55, Math.min(95, Math.round(rawScore * 0.6 + fallbackScore * 0.4)));
    const summaryIndex = hashSeed(`${match.id}:${meta.id}:summary`) % meta.summaries.length;
    return {
      id: meta.id,
      title: meta.title,
      subtitle: meta.subtitle,
      summary: meta.summaries[summaryIndex].replaceAll("{name}", name),
      score: markerScore,
      tone: getTone(markerScore),
    };
  });

  const highCount = markers.filter((marker) => marker.score >= 75).length;
  if (highCount < 2) {
    markers = markers.map((marker, idx) => {
      if (idx === 2) {
        const boostedScore = Math.max(marker.score, 76);
        return { ...marker, score: boostedScore, tone: getTone(boostedScore) };
      }
      if (idx === 3) {
        const boostedScore = Math.max(marker.score, 78);
        return { ...marker, score: boostedScore, tone: getTone(boostedScore) };
      }
      return marker;
    });
  }

  return {
    overallRead: genderContextLine(context),
    markers,
    whereYouAlign: (match.compatibilityBreakdown?.whereYouAlign || ["Communication", "Intent", "Lifestyle rhythm"]).slice(0, 3),
    whereYouMayDiffer: (match.compatibilityBreakdown?.whereYouMayDiffer || ["Pace", "Social energy"]).slice(0, 2),
    tetherAdvice:
      match.compatibilityBreakdown?.tetherAdvice ||
      "Lead with clarity and keep the first date low-pressure to let chemistry build naturally.",
  };
}

export function getCompatibilityBreakdown(match, context = {}) {
  return getCompatibilityBreakdownForMatch(match, context);
}
