import {
  DEFAULT_STANDARD_INTERESTED_VISIBLE_CAP,
  getInterestedVisibility,
  getScopedStandardInterestedPackKeyV5,
  normaliseStandardVisibleCap,
  normaliseStandardPack,
} from "../src/utils/interestedUnlockVisibility.js";

function mockProfiles(count) {
  return Array.from({ length: count }).map((_, index) => ({ id: `m-${index + 1}` }));
}

function assertEqual(actual, expected, label) {
  if (actual !== expected) {
    throw new Error(`${label}: expected ${expected}, got ${actual}`);
  }
}

function runVisibilityCase(total, cap, expectedVisible, expectedHidden) {
  const result = getInterestedVisibility(mockProfiles(total), cap);
  assertEqual(result.visibleCount, expectedVisible, `visibleCount total=${total} cap=${cap}`);
  assertEqual(result.hiddenCount, expectedHidden, `hiddenCount total=${total} cap=${cap}`);
}

runVisibilityCase(5, 3, 3, 2);
runVisibilityCase(5, 12, 5, 0);
runVisibilityCase(20, 3, 3, 17);
runVisibilityCase(20, 12, 12, 8);
runVisibilityCase(20, 50, 20, 0);

assertEqual(normaliseStandardVisibleCap(undefined), DEFAULT_STANDARD_INTERESTED_VISIBLE_CAP, "normalise undefined");
assertEqual(normaliseStandardVisibleCap(null), DEFAULT_STANDARD_INTERESTED_VISIBLE_CAP, "normalise null");
assertEqual(normaliseStandardVisibleCap(0), DEFAULT_STANDARD_INTERESTED_VISIBLE_CAP, "normalise zero");
assertEqual(normaliseStandardVisibleCap("50"), 50, "normalise string 50");
assertEqual(normaliseStandardVisibleCap("bad-value"), DEFAULT_STANDARD_INTERESTED_VISIBLE_CAP, "normalise bad value");

const scopedKey = getScopedStandardInterestedPackKeyV5({
  membershipTier: "standard",
  genderIdentity: "female",
  sexualPreference: "bisexual",
  bisexualFilter: "show_mix",
  transNonBinaryFilter: "none",
});
if (!scopedKey.startsWith("tetherStandardInterestedPackV5:")) {
  throw new Error(`scoped key prefix failed: ${scopedKey}`);
}

assertEqual(normaliseStandardPack(undefined), null, "normalise pack undefined");
assertEqual(normaliseStandardPack("50"), 50, "normalise pack 50");
assertEqual(normaliseStandardPack("bad"), null, "normalise pack bad");

console.log("qa-standard-unlock: visibility cap logic passed");
