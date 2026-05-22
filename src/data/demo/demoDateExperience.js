const REFLECTIONS_KEY = "tetherDemoDateReflections";

function readReflections() {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(REFLECTIONS_KEY);
    const parsed = raw ? JSON.parse(raw) : {};
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function writeReflections(value) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(REFLECTIONS_KEY, JSON.stringify(value));
}

export function getStoredReflection(matchId) {
  const all = readReflections();
  return all[String(matchId)] || null;
}

export function saveStoredReflection(matchId, reflection) {
  const all = readReflections();
  const next = {
    ...all,
    [String(matchId)]: reflection,
  };
  writeReflections(next);
  return reflection;
}

function toLabel(value, fallback = "Mixed") {
  return typeof value === "string" && value.trim() ? value : fallback;
}

export function buildReflectionChips(reflection) {
  if (!reflection) return [];
  const chips = [];

  if (reflection.conversation === "Very natural" || reflection.conversation === "Mostly easy") {
    chips.push("Good conversation chemistry");
  }
  if (reflection.humour === "Strongly aligned" || reflection.humour === "Mostly aligned") {
    chips.push("Good humour alignment");
  }
  if (reflection.continueGuidance === "Yes, continue" || reflection.interestGrowth === "Strong yes" || reflection.anotherDate === "Strong yes") {
    chips.push("Interested in Date 3");
  }
  if (reflection.attraction === "Much stronger" || reflection.attraction === "Slightly stronger") {
    chips.push("Chemistry felt strong");
  }

  return chips.slice(0, 3);
}

export function getFallbackReflection(match, dateNumber = 2) {
  const name = match?.displayName || "your match";
  const lowerDate = dateNumber === 3 ? "third" : "second";
  return {
    matchId: String(match?.id || "fallback"),
    dateNumber,
    attraction: "About the same",
    conversation: "Mostly easy",
    chemistry: "Possibly",
    comfort: "Mostly aligned",
    energy: "Mostly aligned",
    humour: "Strongly aligned",
    emotionalBalance: "Mostly aligned",
    timeTogether: "Mostly",
    lifestyleFit: "Mostly",
    routinesFit: "Mostly",
    interestGrowth: dateNumber === 3 ? "Strong yes" : "Yes",
    anotherDate: dateNumber === 3 ? "Yes" : "Strong yes",
    romanticPotential: "Yes",
    positives: `${name} felt warm, easy to talk to, and more grounded in person.`,
    missing: `Nothing major felt missing, though the pacing could still settle more naturally on a ${lowerDate} date.`,
    expectationFit: "Better than expected",
    continueGuidance: "Yes, continue",
    submittedAt: new Date().toISOString(),
  };
}

export function getReflectionSummary(reflection, match) {
  const active = reflection || getFallbackReflection(match);
  const chemistryLine =
    active.attraction === "Much stronger" || active.attraction === "Slightly stronger"
      ? "Attraction strengthened in person."
      : active.attraction === "Weaker than expected"
        ? "Initial attraction softened slightly in person."
        : "Attraction felt broadly consistent in person.";

  const emotionalLine =
    active.comfort === "Strongly aligned" || active.emotionalBalance === "Strongly aligned"
      ? "Emotional comfort and ease looked strong."
      : active.comfort === "Misaligned" || active.emotionalBalance === "Misaligned"
        ? "Emotional rhythm felt a little uneven."
        : "Emotional fit showed some promise with a few mixed signals.";

  return {
    chemistryLine,
    emotionalLine,
    chips: buildReflectionChips(active),
  };
}

export function getReflectionHighlights(reflection) {
  const active = reflection || {};
  const items = [];
  if (active.conversation === "Very natural" || active.conversation === "Mostly easy") {
    items.push({ title: "Conversation chemistry", body: "Conversation felt natural and easy to sustain in person." });
  }
  if (active.humour === "Strongly aligned" || active.humour === "Mostly aligned") {
    items.push({ title: "Humour alignment", body: "Shared humour and social rhythm came through clearly." });
  }
  if (active.comfort === "Strongly aligned" || active.comfort === "Mostly aligned") {
    items.push({ title: "Emotional comfort", body: "The interaction carried a reassuring sense of comfort and ease." });
  }
  if (active.attraction === "Much stronger" || active.attraction === "Slightly stronger" || active.chemistry === "Definitely") {
    items.push({ title: "Attraction strength", body: "Real-world attraction felt present and more credible in person." });
  }
  return items.slice(0, 4);
}

export function getReflectionGrowthAreas(reflection) {
  const active = reflection || {};
  const items = [];
  if (active.energy === "Mixed" || active.energy === "Misaligned") {
    items.push({ title: "Pacing differences", body: "Energy and pacing may have needed more adjustment to feel natural." });
  }
  if (active.lifestyleFit === "Unsure" || active.lifestyleFit === "Probably not") {
    items.push({ title: "Lifestyle mismatch", body: "Lifestyle rhythm may need more evidence before it feels like a long-term fit." });
  }
  if (active.conversation === "Mixed" || active.conversation === "Forced") {
    items.push({ title: "Communication rhythm", body: "Conversation flow did not fully settle into an easy mutual rhythm." });
  }
  if (active.emotionalBalance === "Mixed" || active.emotionalBalance === "Misaligned") {
    items.push({ title: "Emotional mismatch", body: "The emotional balance felt a little uneven at times." });
  }
  return items.slice(0, 4);
}

export function getTetherLearnings(reflection) {
  const active = reflection || {};
  const insights = [];
  if (active.humour === "Strongly aligned" || active.humour === "Mostly aligned") {
    insights.push("You respond strongly to shared humour and an easy conversational rhythm.");
  }
  if (active.comfort === "Strongly aligned" || active.emotionalBalance === "Strongly aligned") {
    insights.push("Emotional comfort appears to be a strong driver of attraction for you in real life.");
  }
  if (active.lifestyleFit === "Mostly" || active.lifestyleFit === "Yes definitely") {
    insights.push("Lifestyle compatibility appears increasingly important in long-term attraction.");
  }
  if (active.energy === "Mixed" || active.energy === "Misaligned") {
    insights.push("Energy alignment may matter more for sustained chemistry than initial attraction alone.");
  }
  if (!insights.length) {
    insights.push("Tether is still refining what chemistry and comfort look like most consistently for you.");
  }
  return insights.slice(0, 3);
}

export function getNextStepSummary(reflection) {
  const active = reflection || {};
  if (active.continueGuidance === "No chemistry") {
    return "Compatibility weakened slightly";
  }
  if (active.continueGuidance === "Unsure") {
    return "Wait for mutual interest";
  }
  if (active.interestGrowth === "Strong yes" || active.anotherDate === "Strong yes") {
    return "Connection looked promising";
  }
  return "Explore another date";
}

export const DATE_2_RECOMMENDATIONS = [
  {
    id: "wine-bar",
    title: "Relaxed wine bar",
    subtitle: "Comfort-first conversation",
    vibe: "Warm, unhurried, easy to settle into",
    duration: "90 mins",
    compatibilityReason: "Designed to encourage longer conversation and emotional comfort.",
  },
  {
    id: "casual-cocktails",
    title: "Casual cocktails",
    subtitle: "Low-pressure chemistry check",
    vibe: "Playful, social, lightly polished",
    duration: "75 mins",
    compatibilityReason: "A good fit when humour and conversational rhythm are building well.",
  },
  {
    id: "rooftop-drinks",
    title: "Rooftop drinks",
    subtitle: "Softer atmosphere, stronger ease",
    vibe: "Scenic, relaxed, lightly elevated",
    duration: "90 mins",
    compatibilityReason: "Helps test comfort and attraction in a setting that still feels easy.",
  },
  {
    id: "walk-coffee",
    title: "Walk + coffee",
    subtitle: "Calm, natural pacing",
    vibe: "Open, easy, conversational",
    duration: "60 mins",
    compatibilityReason: "Good when Tether wants to observe natural rhythm without too much structure.",
  },
  {
    id: "jazz-bar",
    title: "Jazz bar",
    subtitle: "Chemistry with atmosphere",
    vibe: "Moody, intimate, expressive",
    duration: "90 mins",
    compatibilityReason: "Useful when attraction seems promising and emotional ease is already present.",
  },
  {
    id: "dessert-date",
    title: "Dessert date",
    subtitle: "Short and sweet momentum",
    vibe: "Light, charming, low pressure",
    duration: "60 mins",
    compatibilityReason: "Keeps the date playful while allowing chemistry to deepen naturally.",
  },
  {
    id: "market-stroll",
    title: "Market stroll",
    subtitle: "Movement and conversation",
    vibe: "Curious, relaxed, social",
    duration: "75 mins",
    compatibilityReason: "Works well for testing shared pace, humour, and spontaneous interaction.",
  },
  {
    id: "relaxed-dinner",
    title: "Relaxed dinner",
    subtitle: "A deeper conversational setting",
    vibe: "Comfortable, thoughtful, grounded",
    duration: "2 hours",
    compatibilityReason: "Best when the first date already showed emotional ease and mutual interest.",
  },
];

export const DATE_3_RECOMMENDATIONS = [
  {
    id: "cooking-class",
    title: "Cooking class",
    subtitle: "Shared experience with depth",
    vibe: "Playful, collaborative, revealing",
    duration: "2 hours",
    compatibilityReason: "Shows how you work together in real time.",
    lifestyleReason: "Tests shared rhythm, energy, and comfort in a more involved setting.",
    pacingReason: "A strong fit when Date 2 suggested growing trust and natural teamwork.",
  },
  {
    id: "gallery-visit",
    title: "Gallery visit",
    subtitle: "Conversation through shared taste",
    vibe: "Calm, thoughtful, expressive",
    duration: "90 mins",
    compatibilityReason: "Brings out values, humour, and curiosity more naturally.",
    lifestyleReason: "Good for seeing whether your interests and pace complement each other.",
    pacingReason: "Works when Tether sees strong conversation and emotional balance forming.",
  },
  {
    id: "live-music",
    title: "Live music",
    subtitle: "Chemistry with shared atmosphere",
    vibe: "Energetic, memorable, emotive",
    duration: "2 hours",
    compatibilityReason: "Lets attraction and emotional presence show up in a more vivid environment.",
    lifestyleReason: "Useful when lifestyle fit looks promising but still needs real-world testing.",
    pacingReason: "A good choice when connection feels strong and you want to deepen it naturally.",
  },
  {
    id: "sunday-market",
    title: "Sunday market",
    subtitle: "Lifestyle rhythm test",
    vibe: "Open, social, everyday",
    duration: "90 mins",
    compatibilityReason: "Shows how natural the connection feels in a real-life, low-script setting.",
    lifestyleReason: "Helps assess long-term rhythm, spontaneity, and shared comfort.",
    pacingReason: "Ideal when Tether sees promise but wants to test everyday compatibility.",
  },
  {
    id: "wellness-spa",
    title: "Wellness afternoon",
    subtitle: "Slower, calmer connection",
    vibe: "Soft, restorative, intimate",
    duration: "2 hours",
    compatibilityReason: "Works well when emotional comfort is becoming a defining strength.",
    lifestyleReason: "Reveals whether you both value the same kind of pace and recharge.",
    pacingReason: "Best for pairs building a calm, secure rhythm rather than high intensity.",
  },
  {
    id: "day-activity",
    title: "Day activity",
    subtitle: "Compatibility in motion",
    vibe: "Engaged, curious, experiential",
    duration: "2-3 hours",
    compatibilityReason: "Shows how interest holds up beyond a simple sit-down date.",
    lifestyleReason: "Helps test stamina, flexibility, and how naturally you move together.",
    pacingReason: "Useful when Tether sees momentum and wants to explore real-life fit more deeply.",
  },
  {
    id: "outdoor-activity",
    title: "Outdoor activity",
    subtitle: "Shared momentum and ease",
    vibe: "Fresh, active, lightly adventurous",
    duration: "2 hours",
    compatibilityReason: "Good for testing whether attraction and comfort still hold in a different context.",
    lifestyleReason: "Reveals alignment around energy, movement, and real-world rhythm.",
    pacingReason: "Best when both people seem open, active, and naturally engaged.",
  },
  {
    id: "experience-dinner",
    title: "Experience-led dinner",
    subtitle: "Depth with a little structure",
    vibe: "Intentional, polished, immersive",
    duration: "2 hours",
    compatibilityReason: "Combines conversation depth with a more memorable shared setting.",
    lifestyleReason: "Useful when long-term fit looks promising and you want to test substance.",
    pacingReason: "A good Date 3 option when connection has clearly been building well.",
  },
];
