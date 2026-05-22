import { getZodiacSign } from "@/utils/zodiac";
import { getZodiacCompatibility } from "@/data/demo/zodiacCompatibility";
import { getTierMatchConfig, seededShuffle, hashSeed } from "@/data/demo/demoMatchPoolSelector";
import { photoManifest } from "@/data/demo/photoManifest";
import { getCompatibilityBreakdownForMatch } from "@/data/demo/demoCompatibilityBreakdowns";
import { getRouteOrientationFromContext } from "@/lib/compatibilityVariantRouting";

const NAME_POOLS = {
  straightMale: ["Oliver", "James", "Daniel", "Marcus", "Theo", "Henry", "Luca", "Max", "Reuben", "Finn", "Nathan", "George", "Callum", "Sam", "Ethan", "Adam", "Leo", "Jack", "Ben", "Oscar"],
  straightFemale: ["Chloe", "Sophie", "Emily", "Olivia", "Grace", "Amelia", "Ella", "Maya", "Freya", "Isabella", "Lily", "Hannah", "Ruby", "Clara", "Ava", "Phoebe", "Zara", "Millie", "Sienna", "Beth"],
  lesbians: ["Amelia", "Maya", "Niamh", "Chloe", "Freya", "Jess", "Sophie", "Ella", "Ruby", "Zara", "Imogen", "Leah", "Clara", "Paige", "Hannah", "Olivia", "Lydia", "Erin", "Georgia", "Naomi"],
  gays: ["Jamie", "Callum", "Finn", "Reuben", "Noah", "Oliver", "Marcus", "Theo", "Luca", "Max", "Elliot", "Nathan", "Daniel", "George", "Sam", "Ben", "Leo", "Ryan", "Adam", "Oscar"],
  bisexualMale: ["Alex", "Jordan", "Theo", "Luca", "Max", "Ellis", "Noah", "Finn", "Marcus", "Reuben", "Jamie", "Kai", "Milo", "Sam", "Leo", "Oscar", "Ben", "Ethan", "Aaron", "Felix"],
  bisexualFemale: ["Maya", "Chloe", "Ava", "Sophie", "Ella", "Freya", "Ruby", "Zara", "Clara", "Liv", "Naomi", "Hannah", "Erin", "Grace", "Lily", "Imogen", "Paige", "Phoebe", "Millie", "Sienna"],
  transWoman: ["Isla", "Serena", "Eva", "Lena", "Sofia", "Aria", "Naomi", "Mila", "Jade", "Lara", "Elise", "Nova", "Imani", "Celeste", "Talia", "Amara", "Nina", "Skye", "Rina", "Yasmin"],
  transMen: ["Leo", "Elliot", "Max", "Noah", "Sam", "Theo", "Kai", "Luca", "Finn", "Ellis", "Rowan", "Jamie", "Alex", "Jude", "Milo", "Oscar", "Ben", "Aaron", "Felix", "Ryan"],
  nonBinary: ["Rowan", "Alex", "Jordan", "River", "Quinn", "Sage", "Riley", "Avery", "Eden", "Phoenix", "Sky", "Morgan", "Taylor", "Jules", "Blair", "Remy", "Kit", "Ash", "Harper", "Casey"],
};

const LOCATIONS = ["Peckham, London", "Hackney, London", "Clapham, London", "Shoreditch, London", "Brixton, London", "Islington, London", "Camden, London", "Battersea, London", "Bermondsey, London", "Walthamstow, London", "Dalston, London", "Greenwich, London", "Fulham, London", "Stratford, London", "Notting Hill, London", "London Fields, London", "Southbank, London", "Soho, London", "Kensington, London", "Chelsea, London"];
const VIBES = ["Warm, polished, and quietly ambitious.", "Social but intentional — happiest when conversation has depth.", "Low-key, loyal, and drawn to meaningful connection.", "Independent, affectionate, and clear about what they want."];

function buildBirthday(index) {
  const year = 1988 + (index % 12);
  const month = (index % 12) + 1;
  const day = ((index * 3) % 27) + 1;
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function marker(score, label, subtitle, explanation, tone) {
  return { score, label, subtitle, explanation, tone };
}

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

function buildProfilePhotos(entry, seed) {
  const pool = photoManifest[entry.sourceFolderKey] || [];
  const ordered = seededShuffle(pool, `${seed}:${entry.photoPath}:profile-photos`);
  const photos = [entry.photoPath, ...ordered.filter((path) => path !== entry.photoPath)].slice(0, 4);
  return photos;
}

function buildTierScoreDistribution(count, membershipTier, seed) {
  if (membershipTier === "premium") {
    // Premium: mostly strong/excellent compatibility.
    const high = [95, 94, 93, 92, 91];
    const mid = [90, 89, 88, 87, 86, 85, 90, 89, 88, 87];
    return seededShuffle([...high, ...mid], `${seed}:premium-scores`).slice(0, count);
  }
  if (membershipTier === "concierge") {
    // Concierge: skewed to exceptional compatibility.
    const conciergePool = [98, 96, 94, 92, 89, 88];
    return seededShuffle(conciergePool, `${seed}:concierge-scores`).slice(0, count);
  }
  // Standard: potential + strong mix.
  const standardPool = [79, 78, 77, 76, 75, 74, 73, 72, 71, 70, 69, 68, 67, 66, 65, 64, 79, 77, 75, 73];
  return seededShuffle(standardPool, `${seed}:standard-scores`).slice(0, count);
}

export function generateDemoProfiles({ pool, membershipTier, selectedUserContext, audienceKey = "discover" }) {
  const cfg = getTierMatchConfig(membershipTier);
  const routeOrientation = getRouteOrientationFromContext(selectedUserContext);
  const seed = `${membershipTier}:${selectedUserContext.genderIdentity}:${routeOrientation}:${selectedUserContext.bisexualFilter || "show_mix"}:${selectedUserContext.transNonBinaryFilter || "show_mix"}:${selectedUserContext.lookingFor || "open_to_all"}:${audienceKey}`;
  const ordered = seededShuffle(pool, `${seed}:ordered`).slice(0, cfg.count);
  const tierScores = buildTierScoreDistribution(cfg.count, membershipTier, seed);

  return ordered.map((entry, index) => {
    const source = entry.sourceFolderKey;
    const names = NAME_POOLS[source] || NAME_POOLS.straightFemale;
    const canonicalIndex = hashSeed(entry.photoPath) % 1000;
    const displayName = names[canonicalIndex % names.length];
    const age = 24 + (canonicalIndex % 19);
    const birthDate = buildBirthday(canonicalIndex);
    const zodiac = getZodiacSign(birthDate) || "Libra";
    const compatibilityScore = clamp(tierScores[index] ?? cfg.maxScore, cfg.minScore, cfg.maxScore);
    const m1 = clamp(compatibilityScore + ((canonicalIndex % 9) - 4), 0, 100);
    const m2 = clamp(compatibilityScore + ((canonicalIndex % 7) - 3), 0, 100);
    const m3 = clamp(compatibilityScore + ((canonicalIndex % 11) - 5), 0, 100);
    const m4 = clamp(compatibilityScore + ((canonicalIndex % 13) - 6), 0, 100);
    const m5 = clamp(compatibilityScore + ((canonicalIndex % 5) - 2), 0, 100);
    const star = getZodiacCompatibility(selectedUserContext.birthDate || "1993-05-01", birthDate);
    const draft = {
      id: `${source}-${canonicalIndex}`,
      sourceFolderKey: source,
      photoPath: entry.photoPath,
      photos: buildProfilePhotos(entry, seed),
      displayName,
      age,
      birthDate,
      zodiac,
      location: LOCATIONS[canonicalIndex % LOCATIONS.length],
      distanceLabel: membershipTier === "concierge" ? ["Paris · 215 miles", "Amsterdam · 222 miles", "Brighton · 54 miles", "Manchester · 163 miles", "London"][index % 5] : undefined,
      shortBio: VIBES[canonicalIndex % VIBES.length],
      oneLineVibe: VIBES[(canonicalIndex + 1) % VIBES.length],
      compatibilityScore,
      compatibilityTier: membershipTier,
      compatibilityBreakdown: {
        overallRead: "There is real potential here with clear signals of practical compatibility.",
        whereYouAlign: ["Emotional availability", "Lifestyle rhythm", "Dating intent"],
        whereYouMayDiffer: ["Different communication rhythm", "Different social pace"],
        tetherAdvice: "Lead with clarity on pace and expectations and this is likely to feel natural.",
      },
      starSignCompatibility: star,
      firstDateSuggestion: {
        venueName: ["Barrafina", "Dishoom", "Bar Termini", "Bao", "Quo Vadis"][canonicalIndex % 5],
        neighbourhood: ["Soho", "Shoreditch", "King's Cross", "Notting Hill", "Islington"][canonicalIndex % 5],
        dateType: ["coffee", "drinks", "dinner", "gallery", "walk"][canonicalIndex % 5],
      },
      matchStatus: index % 4 === 0 ? "first_date_booked" : index % 4 === 1 ? "new" : index % 4 === 2 ? "next_date" : "past_date_feedback",
    };

    const enriched = getCompatibilityBreakdownForMatch(draft, selectedUserContext);
    const markerMap = enriched?.markers || [];

    return {
      ...draft,
      compatibilityMarkers: {
        typeMarker: marker(m1, "Your Type Insights", markerMap[0]?.subtitle, markerMap[0]?.summary, markerMap[0]?.tone),
        romanticPatternMarker: marker(m2, "Romantic Pattern Insights", markerMap[1]?.subtitle, markerMap[1]?.summary, markerMap[1]?.tone),
        intentValuesMarker: marker(m3, "Intent & Values Insights", markerMap[2]?.subtitle, markerMap[2]?.summary, markerMap[2]?.tone),
        lifestyleSocialMarker: marker(m4, "Lifestyle & Social Fit Insights", markerMap[3]?.subtitle, markerMap[3]?.summary, markerMap[3]?.tone),
        firstImpressionVibeMarker: marker(m5, "First Impression & Vibe Insights", markerMap[4]?.subtitle, markerMap[4]?.summary, markerMap[4]?.tone),
      },
      compatibilityBreakdown: {
        ...draft.compatibilityBreakdown,
        overallRead: enriched?.overallRead || draft.compatibilityBreakdown.overallRead,
        whereYouAlign: enriched?.whereYouAlign || draft.compatibilityBreakdown.whereYouAlign,
        whereYouMayDiffer: enriched?.whereYouMayDiffer || draft.compatibilityBreakdown.whereYouMayDiffer,
        tetherAdvice: enriched?.tetherAdvice || draft.compatibilityBreakdown.tetherAdvice,
      },
    };
  });
}
