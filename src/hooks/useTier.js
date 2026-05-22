import { useState, useEffect } from "react";

export const TIERS = {
  standard: {
    id: "standard",
    name: "Standard",
    price: "Free",
    priceDetail: "£9 per date",
    description: "Compatibility-led local dating",
    dailyMatches: 20,
    freeMonthlyDates: 0,
    distanceBonus: 0,
    hasAdvancedFilters: false,
    hasPriorityVisibility: false,
    hasConcierge: false,
    hasExpertChat: false,
  },
  premium: {
    id: "premium",
    name: "Premium",
    price: "£50",
    priceDetail: "per month",
    description: "Wider reach, better-fit discovery",
    dailyMatches: 15,
    freeMonthlyDates: 4,
    distanceBonus: 50,
    hasAdvancedFilters: true,
    hasPriorityVisibility: true,
    hasConcierge: false,
    hasExpertChat: false,
  },
  concierge: {
    id: "concierge",
    name: "Concierge",
    price: "£200",
    priceDetail: "per month",
    description: "Expert-led curated introductions",
    dailyMatches: 5,
    freeMonthlyDates: 999,
    distanceBonus: 100,
    hasAdvancedFilters: true,
    hasPriorityVisibility: true,
    hasConcierge: true,
    hasExpertChat: true,
  },
};

const TIER_EVENT = "tether_tier_change";

function applyTierToDOM(tier) {
  document.documentElement.setAttribute("data-tier", tier);
}

export function useTier() {
  const [tier, setTierState] = useState(() => {
    const saved = localStorage.getItem("tether_tier") || "standard";
    applyTierToDOM(saved);
    return saved;
  });

  useEffect(() => {
    const handler = (e) => {
      setTierState(e.detail);
    };
    window.addEventListener(TIER_EVENT, handler);
    return () => window.removeEventListener(TIER_EVENT, handler);
  }, []);

  const setTier = (newTier) => {
    localStorage.setItem("tether_tier", newTier);
    applyTierToDOM(newTier);
    window.dispatchEvent(new CustomEvent(TIER_EVENT, { detail: newTier }));
  };

  return { tier, setTier, tierData: TIERS[tier] || TIERS.standard };
}
