import fs from "node:fs";
import path from "node:path";

const requiredPools = [
  "straightMale",
  "straightFemale",
  "lesbians",
  "gays",
  "bisexualMale",
  "bisexualFemale",
  "transWoman",
  "transMen",
  "nonBinary",
];

const folderMap = {
  straightMale: "straight-male",
  straightFemale: "straight-female",
  lesbians: "lesbians",
  gays: "gays",
  bisexualMale: "bisexual-male",
  bisexualFemale: "bisexual-female",
  transWoman: "trans-woman",
  transMen: "trans-men",
  nonBinary: "non-binary",
};

const requiredFiles = [
  "src/context/DemoUserContext.jsx",
  "src/hooks/useDemoUserContext.js",
  "src/hooks/useCurrentDemoMatches.js",
  "src/hooks/useCurrentMatch.js",
  "src/hooks/useCurrentBookingMatch.js",
  "src/data/demo/demoMatchPoolSelector.js",
  "src/data/demo/demoProfileGenerator.js",
  "src/data/demo/demoMatchProfiles.js",
  "src/data/demo/zodiacCompatibility.js",
  "src/utils/interestedUnlockVisibility.js",
];

const pageHookChecks = {
  "src/pages/Discover.jsx": "useCurrentDemoMatches",
  "src/pages/Matches.jsx": "useCurrentDemoMatches",
  "src/pages/Conversations.jsx": "useCurrentDemoMatches",
  "src/pages/MapDiscovery.jsx": "TetherGoogleMap",
  "src/pages/Profile.jsx": "useDemoUserContext",
  "src/pages/MatchDetail.jsx": "useCurrentMatch",
  "src/components/CompatibilityBreakdown.jsx": "useCurrentMatch",
  "src/pages/Insights.jsx": "useCurrentDemoMatches",
  "src/pages/InterestedInYou.jsx": "useCurrentDemoMatches",
  "src/pages/DateJourney.jsx": "useCurrentDemoMatches",
  "src/pages/DateBooking.jsx": "useCurrentMatch",
  "src/pages/PostDateFeedback.jsx": "useCurrentBookingMatch",
  "src/pages/ExpertChat.jsx": "useCurrentDemoMatches",
};

const pageEitherChecks = {
  "src/pages/MapDiscovery.jsx": ["useCurrentDemoMatches", "TetherGoogleMap"],
};

const noStaticFiles = [
  "src/pages/MatchDetail.jsx",
  "src/components/CompatibilityBreakdown.jsx",
  "src/pages/InterestedInYou.jsx",
  "src/pages/DateJourney.jsx",
  "src/pages/DateBooking.jsx",
  "src/pages/PostDateFeedback.jsx",
  "src/pages/ExpertChat.jsx",
  "src/pages/Insights.jsx",
];

const staticBanned = ["DEMO_PROFILES", "MATCH_DATA", "staticMatches", "mockMatches", "placeholderProfiles"];
const discoverMatchesBanned = [
  "STANDARD_PROFILES",
  "PREMIUM_PROFILES",
  "CONCIERGE_PROFILES",
  "FEMALE_STANDARD_PROFILES",
  "MIXED_STANDARD_PROFILES",
  "DEMO_BY_ORIENTATION",
];

const mathRandomScopes = [
  "src/pages",
  "src/components/CompatibilityBreakdown.jsx",
  "src/components/NextDatesTab.jsx",
  "src/components/PastDatesTab.jsx",
  "src/data/demo",
  "src/hooks",
];

const standardInterestedWorkflowChecks = [
  { pattern: "getScopedStandardInterestedPackKeyV5", message: "Scoped Standard pack key helper is not used" },
  { pattern: "tetherStandardInterestedPackV5", message: "V5 Standard pack key constant is missing" },
  { pattern: "OLD_STANDARD_INTERESTED_UNLOCK_KEY", message: "Missing old Standard unlock key migration reference constant usage" },
  { pattern: "removeItem(OLD_STANDARD_INTERESTED_UNLOCK_KEY)", message: "Old Standard unlock key is not removed during migration" },
  { pattern: "removeItem(STANDARD_INTERESTED_VISIBLE_CAP_KEY)", message: "Global Standard visible-cap key is not removed during migration" },
  { pattern: "cap: 3", message: "Unlock 3 pack missing" },
  { pattern: "cap: 12", message: "Unlock 12 pack missing" },
  { pattern: "cap: 50", message: "Unlock 50 pack missing" },
  { pattern: "Upgrade to Premium", message: "Premium upgrade banner/copy missing in Standard unlock panel" },
  { pattern: "getInterestedVisibility", message: "Visible-cap helper is not used by InterestedInYou page" },
  { pattern: "isStandard", message: "Standard-only unlock guard missing" },
  { pattern: "data-testid=\"standard-interested-unlock-options\"", message: "Unlock panel test id missing" },
  { pattern: "unlock-pack-3", message: "Unlock pack test id for 3 missing" },
  { pattern: "unlock-pack-12", message: "Unlock pack test id for 12 missing" },
  { pattern: "unlock-pack-50", message: "Unlock pack test id for 50 missing" },
  { pattern: "standard-unlock-reset-demo", message: "DEV reset unlock control test id missing" },
];

const disallowedStandardAdditivePatterns = [
  /visible\s*=\s*3\s*\+\s*unlocked/i,
  /baseVisible\s*\+\s*purchased/i,
  /DEFAULT_STANDARD_VISIBLE_CAP\s*\+\s*/i,
];

function walk(target) {
  const abs = path.resolve(process.cwd(), target);
  if (!fs.existsSync(abs)) return [];
  const stat = fs.statSync(abs);
  if (stat.isFile()) return [abs];
  return fs.readdirSync(abs).flatMap((entry) => walk(path.join(target, entry)));
}

function resolveVisibleHiddenForQa(totalProfiles, visibleCap) {
  const defaultCap = 3;
  const safeCap = Math.max(defaultCap, Number(visibleCap) || defaultCap);
  const visibleCount = Math.min(safeCap, totalProfiles);
  const hiddenCount = Math.max(0, totalProfiles - visibleCount);
  return { visibleCount, hiddenCount };
}

function isSourceFile(abs) {
  return [".js", ".jsx", ".ts", ".tsx"].some((ext) => abs.endsWith(ext));
}

let ok = true;

for (const key of requiredPools) {
  const folder = folderMap[key];
  const abs = path.resolve(process.cwd(), "public", "match-photos", folder);
  if (!fs.existsSync(abs)) {
    ok = false;
    console.error(`Missing folder: public/match-photos/${folder}`);
    continue;
  }
  const files = fs.readdirSync(abs).filter((f) => !f.startsWith("."));
  if (!files.length) {
    ok = false;
    console.error(`No files in folder: ${folder}`);
    continue;
  }
  if (new Set(files).size !== files.length) {
    ok = false;
    console.error(`Duplicate filenames in folder: ${folder}`);
  }
}

for (const rel of requiredFiles) {
  if (!fs.existsSync(path.resolve(process.cwd(), rel))) {
    ok = false;
    console.error(`Missing required file: ${rel}`);
  }
}

for (const [rel, hookName] of Object.entries(pageHookChecks)) {
  const abs = path.resolve(process.cwd(), rel);
  if (!fs.existsSync(abs)) continue;
  const content = fs.readFileSync(abs, "utf8");
  if (!content.includes(hookName)) {
    ok = false;
    console.error(`Missing expected central hook '${hookName}' in ${rel}`);
  }
}

for (const [rel, tokens] of Object.entries(pageEitherChecks)) {
  const abs = path.resolve(process.cwd(), rel);
  if (!fs.existsSync(abs)) continue;
  const content = fs.readFileSync(abs, "utf8");
  if (!tokens.some((token) => content.includes(token))) {
    ok = false;
    console.error(`Missing one of expected integration tokens ${tokens.join(", ")} in ${rel}`);
  }
}

for (const rel of noStaticFiles) {
  const abs = path.resolve(process.cwd(), rel);
  if (!fs.existsSync(abs)) continue;
  const content = fs.readFileSync(abs, "utf8");
  for (const pattern of staticBanned) {
    if (content.includes(pattern)) {
      ok = false;
      console.error(`Static data pattern '${pattern}' found in ${rel}`);
    }
  }
}

for (const rel of ["src/pages/Discover.jsx", "src/pages/Matches.jsx"]) {
  const abs = path.resolve(process.cwd(), rel);
  if (!fs.existsSync(abs)) continue;
  const content = fs.readFileSync(abs, "utf8");
  for (const pattern of [...staticBanned, ...discoverMatchesBanned]) {
    if (content.includes(pattern)) {
      ok = false;
      console.error(`Legacy static block pattern '${pattern}' found in ${rel}`);
    }
  }
  if (!content.includes("matches.length") && !content.includes("visible.length")) {
    ok = false;
    console.error(`Count display in ${rel} may not be based on current matches length`);
  }
}

const interestedInYouPath = path.resolve(process.cwd(), "src/pages/InterestedInYou.jsx");
if (fs.existsSync(interestedInYouPath)) {
  const interestedInYou = fs.readFileSync(interestedInYouPath, "utf8");
  for (const check of standardInterestedWorkflowChecks) {
    if (!interestedInYou.includes(check.pattern)) {
      ok = false;
      console.error(`Interested workflow check failed: ${check.message}`);
    }
  }
  if (!interestedInYou.includes("getInterestedVisibility(interestedProfiles, confirmedPack)")) {
    ok = false;
    console.error("Interested workflow check failed: visible list is not derived from cap-based slice");
  }
  for (const pattern of disallowedStandardAdditivePatterns) {
    if (pattern.test(interestedInYou)) {
      ok = false;
      console.error(`Interested workflow check failed: additive unlock logic pattern found (${pattern})`);
    }
  }
}

const discoverPath = path.resolve(process.cwd(), "src/pages/Discover.jsx");
if (fs.existsSync(discoverPath)) {
  const discover = fs.readFileSync(discoverPath, "utf8");
  if (!discover.includes("tier === \"standard\"")) {
    ok = false;
    console.error("Discover Standard CTA check failed: missing standard-tier branch");
  }
  if (!discover.includes("navigate(\"/interested-in-you")) {
    ok = false;
    console.error("Discover Standard CTA check failed: Standard CTA does not navigate to /interested-in-you");
  }
}

const visibilityCases = [
  { total: 5, cap: 3, visible: 3, hidden: 2 },
  { total: 5, cap: 12, visible: 5, hidden: 0 },
  { total: 20, cap: 12, visible: 12, hidden: 8 },
  { total: 20, cap: 50, visible: 20, hidden: 0 },
];
for (const test of visibilityCases) {
  const got = resolveVisibleHiddenForQa(test.total, test.cap);
  if (got.visibleCount !== test.visible || got.hiddenCount !== test.hidden) {
    ok = false;
    console.error(
      `Visibility cap logic failed for total=${test.total} cap=${test.cap}: got ${got.visibleCount}/${got.hiddenCount}, expected ${test.visible}/${test.hidden}`,
    );
  }
}

for (const target of mathRandomScopes) {
  for (const abs of walk(target)) {
    if (!isSourceFile(abs)) continue;
    const content = fs.readFileSync(abs, "utf8");
    if (content.includes("Math.random")) {
      ok = false;
      console.error(`Data-critical Math.random found in ${path.relative(process.cwd(), abs)}`);
    }
  }
}

const allSrc = walk("src").filter(isSourceFile);
for (const abs of allSrc) {
  const rel = path.relative(process.cwd(), abs);
  if (rel.includes("node_modules")) continue;
  const content = fs.readFileSync(abs, "utf8");
  if (content.includes("tetherStandardInterestedUnlockCount")) {
    const allowed = rel === "src/utils/interestedUnlockVisibility.js" || rel === "src/pages/InterestedInYou.jsx";
    if (!allowed) {
      ok = false;
      console.error(`Old Standard unlock key unexpectedly used in ${rel}`);
    }
  }
}
for (const abs of allSrc) {
  const content = fs.readFileSync(abs, "utf8");
  const rel = path.relative(process.cwd(), abs);
  if (/\bApto\b|\bAPTO\b|\bapto\b/.test(content)) {
    ok = false;
    console.error(`Apto reference found in ${rel}`);
  }
  if (content.includes("/Users/tomblount/") || content.includes("file://")) {
    ok = false;
    console.error(`Absolute local runtime path found in ${rel}`);
  }
}

const assessmentFiles = allSrc.filter((abs) => /Onboarding|Assessment|Compatibility/i.test(path.basename(abs)));
for (const abs of assessmentFiles) {
  const content = fs.readFileSync(abs, "utf8");
  const rel = path.relative(process.cwd(), abs);
  if (content.includes("photoManifest") || content.includes("match-photos") || content.includes("useCurrentDemoMatches")) {
    ok = false;
    console.error(`Assessment photo regression risk in ${rel}`);
  }
}

// Scenario/mapping lockdown checks from central source files
const selectorFile = path.resolve(process.cwd(), "src/data/demo/demoMatchPoolSelector.js");
const selector = fs.readFileSync(selectorFile, "utf8");
const userProfilesFile = path.resolve(process.cwd(), "src/data/demo/demoUserProfiles.ts");
const userProfiles = fs.readFileSync(userProfilesFile, "utf8");
const generatorFile = path.resolve(process.cwd(), "src/data/demo/demoProfileGenerator.js");
const generator = fs.readFileSync(generatorFile, "utf8");

const selectorMustContain = [
  'count: 20, minScore: 60, maxScore: 79',
  'count: 15, minScore: 85, maxScore: 95',
  'count: 5, minScore: 85, maxScore: 98',
  'prefer_guys',
  'prefer_girls',
  'show_mix',
  'prefer_cis_men',
  'prefer_cis_women',
  'prefer_trans_men',
  'prefer_trans_women',
  'prefer_non_binary',
  'buildMix(["bisexualMale", "bisexualFemale"]',
  'buildMix(["straightMale", "straightFemale", "transMen", "transWoman", "nonBinary"]',
];
for (const pattern of selectorMustContain) {
  if (!selector.includes(pattern)) {
    ok = false;
    console.error(`Scenario mapping missing in demoMatchPoolSelector.js: ${pattern}`);
  }
}

const userProfileMustContain = [
  'displayName: "Tom"',
  "straightMale",
  "gayMale",
  "bisexualMale",
  "straightFemale",
  "lesbianFemale",
  "bisexualFemale",
  "transWoman",
  "transMan",
  "nonBinary",
];
for (const pattern of userProfileMustContain) {
  if (!userProfiles.includes(pattern)) {
    ok = false;
    console.error(`Demo user profile mapping missing in demoUserProfiles.ts: ${pattern}`);
  }
}

const generatorMustContain = [
  "compatibilityMarkers",
  "compatibilityBreakdown",
  "starSignCompatibility",
  "firstDateSuggestion",
  "getZodiacSign",
  "compatibilityScore",
];
for (const pattern of generatorMustContain) {
  if (!generator.includes(pattern)) {
    ok = false;
    console.error(`Generator capability missing in demoProfileGenerator.js: ${pattern}`);
  }
}

const mapDiscoveryPath = path.resolve(process.cwd(), "src/pages/MapDiscovery.jsx");
if (fs.existsSync(mapDiscoveryPath)) {
  const mapPage = fs.readFileSync(mapDiscoveryPath, "utf8");
  const requiredMapPageTokens = ["TetherGoogleMap", "radius", "sortBy", "onVisibleCountChange"];
  for (const token of requiredMapPageTokens) {
    if (!mapPage.includes(token)) {
      ok = false;
      console.error(`Map page refinement token missing in MapDiscovery.jsx: ${token}`);
    }
  }
}

const mapComponentPath = path.resolve(process.cwd(), "src/components/TetherGoogleMap.jsx");
if (fs.existsSync(mapComponentPath)) {
  const mapComponent = fs.readFileSync(mapComponentPath, "utf8");
  const requiredMapComponentTokens = [
    "useCurrentDemoMatches(\"map\")",
    "You are here",
    "splitMatchesByRadius",
    "compatibilityScore",
    "routeForMatch",
    "TetherRadiusCircle",
    "map-out-radius-marker",
    "map-radius-warning",
  ];
  for (const token of requiredMapComponentTokens) {
    if (!mapComponent.includes(token)) {
      ok = false;
      console.error(`Map component refinement token missing in TetherGoogleMap.jsx: ${token}`);
    }
  }
}

const mapRadiusUtilsPath = path.resolve(process.cwd(), "src/data/demo/mapRadiusUtils.js");
if (!fs.existsSync(mapRadiusUtilsPath)) {
  ok = false;
  console.error("Missing map radius helper file: src/data/demo/mapRadiusUtils.js");
} else {
  const mapRadiusUtils = fs.readFileSync(mapRadiusUtilsPath, "utf8");
  for (const token of ["milesBetween", "filterMatchesByRadius"]) {
    if (!mapRadiusUtils.includes(token)) {
      ok = false;
      console.error(`Map radius helper token missing in mapRadiusUtils.js: ${token}`);
    }
  }
}

if (!ok) process.exit(1);
console.log("qa-demo-data: manifest and central-wiring checks passed");
