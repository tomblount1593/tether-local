function resolveTier(tier) {
  return tier === "concierge" ? "concierge" : tier === "premium" ? "premium" : "standard";
}

export function getCompatibilityTone(_score, tier = "standard", surface = "light") {
  const safeTier = resolveTier(tier);
  const isDark = surface === "dark";

  if (safeTier === "concierge") {
    return isDark
      ? {
          text: "var(--concierge-compatibility-on-dark)",
          bg: "rgba(216, 198, 174, 0.12)",
          border: "rgba(216, 198, 174, 0.26)",
          track: "var(--concierge-compatibility-track-dark)",
        }
      : {
          text: "var(--concierge-compatibility-on-light)",
          bg: "rgba(35, 38, 35, 0.08)",
          border: "rgba(35, 38, 35, 0.18)",
          track: "var(--concierge-compatibility-track-light)",
        };
  }

  if (safeTier === "premium") {
    return isDark
      ? {
          text: "var(--premium-compatibility-on-dark)",
          bg: "rgba(248, 243, 241, 0.12)",
          border: "rgba(248, 243, 241, 0.26)",
          track: "var(--premium-compatibility-track-dark)",
        }
      : {
          text: "var(--premium-compatibility-on-light)",
          bg: "rgba(55, 66, 58, 0.08)",
          border: "rgba(55, 66, 58, 0.18)",
          track: "var(--premium-compatibility-track-light)",
        };
  }

  return isDark
    ? {
        text: "var(--standard-compatibility-on-dark)",
        bg: "rgba(248, 243, 241, 0.10)",
        border: "rgba(248, 243, 241, 0.24)",
        track: "var(--standard-compatibility-track-dark)",
      }
    : {
        text: "var(--standard-compatibility-on-light)",
        bg: "rgba(55, 66, 58, 0.08)",
        border: "rgba(55, 66, 58, 0.18)",
        track: "var(--standard-compatibility-track-light)",
      };
}
