export const MEMBERSHIP_CHAT_OPEN_COPY = {
  standard: "Chat and video call open 1 day before your date.",
  premium: "Chat and video call open 3 days before your date.",
  concierge: "Chat and video call open 1 week before your date.",
};

export const MEMBERSHIP_CHAT_OPEN_HOURS = {
  standard: 24,
  premium: 72,
  concierge: 168,
};

export const dateUpgradeOptionsByTier = {
  standard: {
    membershipLabel: "Standard",
    coreDateLabel: "Guided date booking",
    coreDateCost: "£9",
    includedFeatures: [
      "Walk & Talk route suggestion",
      "Coffee/low-pressure meet suggestion",
      "Verified match",
      "Chat opens 1 day before",
      "Optional video call opens 1 day before",
    ],
    discountCopy: "No member discount",
    options: [
      {
        id: "coffee-tea-upgrade",
        name: "Coffee / Tea Upgrade",
        costLabel: "£6 extra",
        description: "A simple low-pressure first meet.",
        note: "Great for a quick vibe check.",
      },
      {
        id: "cocktail-mocktail",
        name: "Cocktail / Mocktail",
        costLabel: "£12 extra",
        description: "A more social first-date setting.",
        note: "Alcohol and non-alcohol options available.",
      },
      {
        id: "dinner-upgrade",
        name: "Dinner Upgrade",
        costLabel: "£50 extra",
        description: "A more considered evening together.",
        note: "Dietary requirements captured on selection.",
      },
    ],
  },
  premium: {
    membershipLabel: "Premium",
    coreDateLabel: "Guided date booking",
    coreDateCost: "Included with Premium demo",
    includedFeatures: [
      "Curated venue suggestions",
      "Cocktail / Mocktail included",
      "Chat opens 3 days before",
      "Optional video call opens 3 days before",
      "Priority reschedule support",
    ],
    discountCopy: "Reduced upgrade pricing compared with Standard",
    options: [
      {
        id: "cocktail-mocktail",
        name: "Cocktail / Mocktail",
        costLabel: "Included",
        description: "Included with your membership — just show up.",
        note: "Alcohol and non-alcohol options available.",
        included: true,
      },
      {
        id: "dinner-upgrade",
        name: "Dinner Upgrade",
        costLabel: "£35 extra",
        description: "A more considered evening together.",
        note: "Premium members receive a reduced upgrade rate.",
      },
      {
        id: "curated-venue-upgrade",
        name: "Curated Venue Upgrade",
        costLabel: "£15 extra",
        description: "We suggest a more tailored location based on your match.",
        note: "Based on area, vibe, and date type.",
      },
    ],
  },
  concierge: {
    membershipLabel: "Concierge",
    coreDateLabel: "Concierge-guided date planning",
    coreDateCost: "Included",
    includedFeatures: [
      "Concierge curated venue shortlist",
      "Cocktail / Mocktail included",
      "Chat opens 1 week before",
      "Optional video call opens 1 week before",
      "Concierge reschedule assistance",
      "Priority venue/date setting support",
    ],
    discountCopy: "Concierge support and curation included",
    options: [
      {
        id: "cocktail-mocktail",
        name: "Cocktail / Mocktail",
        costLabel: "Included",
        description: "Included with your membership — just show up.",
        note: "Alcohol and non-alcohol options available.",
        included: true,
      },
      {
        id: "dinner-upgrade",
        name: "Dinner Upgrade",
        costLabel: "£50 extra",
        description: "A more considered evening together.",
        note: "Dietary requirements captured on selection.",
      },
      {
        id: "concierge-date-setting",
        name: "Concierge Date Setting",
        costLabel: "Included",
        description: "We refine the setting around your match, location, and date style.",
        note: "Your concierge layer helps make the date feel natural.",
        included: true,
      },
    ],
  },
};

export function getDateUpgradeConfig(membershipTier) {
  return dateUpgradeOptionsByTier[membershipTier] || dateUpgradeOptionsByTier.standard;
}
