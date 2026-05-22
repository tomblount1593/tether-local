import { generateDemoProfiles } from "@/data/demo/demoProfileGenerator";
import { getMatchPhotoPoolsForDemoUser } from "@/data/demo/demoMatchPoolSelector";

export function getCurrentDemoMatches(context, audienceKey = "discover") {
  const pool = getMatchPhotoPoolsForDemoUser(context);
  return generateDemoProfiles({
    pool,
    membershipTier: context.membershipTier,
    selectedUserContext: context,
    audienceKey,
  });
}

export function validateNoDuplicatePhotos(profiles) {
  const set = new Set();
  for (const profile of profiles) {
    if (set.has(profile.photoPath)) return false;
    set.add(profile.photoPath);
  }
  return true;
}

export function validateNoDuplicateIds(profiles) {
  const set = new Set();
  for (const profile of profiles) {
    if (set.has(profile.id)) return false;
    set.add(profile.id);
  }
  return true;
}

