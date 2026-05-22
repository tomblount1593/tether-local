import { getMatchesTabData } from "../src/data/demo/demoMatchTabs.js";

function mockMatch(index) {
  return {
    id: `m-${index + 1}`,
    displayName: `Match ${index + 1}`,
    age: 25 + (index % 10),
    photoPath: `/match-photos/straight-female/profile-${index + 1}.jpg`,
    compatibilityScore: 60 + (index % 39),
    distanceLabel: "Soho, London",
    location: "Soho, London",
    oneLineVibe: "Warm and grounded.",
    shortBio: "Warm and grounded.",
    firstDateSuggestion: {
      venueName: "Bao",
      neighbourhood: "Soho",
    },
  };
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function assertNoBadStrings(value, label) {
  const v = String(value ?? "");
  assert(!v.includes("NaN"), `${label} contains NaN`);
  assert(!v.includes("undefined"), `${label} contains undefined`);
  assert(!v.includes("null"), `${label} contains null`);
}

function validateCards(cards, group) {
  for (const card of cards) {
    assert(card.displayName, `${group}: missing displayName`);
    assert(card.photoPath, `${group}: missing photoPath`);
    assert(Number.isFinite(card.compatibilityScore), `${group}: invalid compatibilityScore`);
    assertNoBadStrings(card.displayName, `${group}: displayName`);
    assertNoBadStrings(card.locationLabel, `${group}: locationLabel`);
  }
}

function runScenario(label, totalMatches) {
  const matches = Array.from({ length: totalMatches }).map((_, i) => mockMatch(i));
  const tabs = getMatchesTabData(matches, {});
  validateCards(tabs.newMatches, `${label}:newMatches`);
  validateCards(tabs.firstDateBooked, `${label}:firstDateBooked`);
  validateCards(tabs.nextDates, `${label}:nextDates`);
  validateCards(tabs.pastDatesFeedback, `${label}:pastDatesFeedback`);

  for (const row of tabs.nextDates) {
    assert(row.dateStage, `${label}:nextDates missing dateStage`);
    assert(row.actionLabel, `${label}:nextDates missing actionLabel`);
    assert(row.statusMessage, `${label}:nextDates missing statusMessage`);
  }

  for (const row of tabs.pastDatesFeedback) {
    assert(Number.isFinite(row.initialScore), `${label}:pastDatesFeedback invalid initialScore`);
    assert(row.feedbackStatus, `${label}:pastDatesFeedback missing feedbackStatus`);
    assert(row.actionLabel, `${label}:pastDatesFeedback missing actionLabel`);
    assert(row.statusMessage, `${label}:pastDatesFeedback missing statusMessage`);
    assertNoBadStrings(row.statusMessage, `${label}:statusMessage`);
  }
}

const scenarios = [
  ["standard-straight", 20],
  ["standard-gay", 20],
  ["standard-lesbian", 20],
  ["standard-bisexual", 20],
  ["standard-trans_nonbinary", 20],
  ["premium-straight", 15],
  ["premium-gay", 15],
  ["premium-lesbian", 15],
  ["premium-bisexual", 15],
  ["premium-trans_nonbinary", 15],
  ["concierge-straight", 5],
  ["concierge-gay", 5],
  ["concierge-lesbian", 5],
  ["concierge-bisexual", 5],
  ["concierge-trans_nonbinary", 5],
];

for (const [label, total] of scenarios) runScenario(label, total);

console.log("qa-ui-data: match tab projection integrity passed");
