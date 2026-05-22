import { TOM_PROFILE } from "@/constants/profilePresets";
import { getRouteOrientationFromContext } from "@/lib/compatibilityVariantRouting";

const tomPhotos = (TOM_PROFILE.photos || []).map((p) => (typeof p === "string" ? p : p.src));

export const demoUserProfiles = {
  straightMale: {
    key: "straightMale",
    displayName: "Tom",
    age: 30,
    birthDate: "1993-05-01",
    location: "London, UK",
    photoSet: tomPhotos,
    bio: "Founder by day, explorer whenever possible. I've stood at the pyramids, danced at weddings, and believe the best connections happen in real life.",
  },
  gayMale: {
    key: "gayMale",
    displayName: "Tom",
    age: 30,
    birthDate: "1993-05-01",
    location: "London, UK",
    photoSet: tomPhotos,
    bio: "Founder by day, explorer whenever possible. I've stood at the pyramids, danced at weddings, and believe the best connections happen in real life.",
  },
  bisexualMale: {
    key: "bisexualMale",
    displayName: "Tom",
    age: 30,
    birthDate: "1993-05-01",
    location: "London, UK",
    photoSet: tomPhotos,
    bio: "Founder by day, explorer whenever possible. I've stood at the pyramids, danced at weddings, and believe the best connections happen in real life.",
  },
  straightFemale: {
    key: "straightFemale",
    displayName: "Sophie",
    age: 30,
    birthDate: "1994-03-18",
    location: "London, UK",
    photoSet: ["/match-photos/straight-female/photo-1494790108377-be9c29b29330.jpg"],
    bio: "Curious, warm, and intentional. I value emotional honesty and real follow-through.",
  },
  lesbianFemale: {
    key: "lesbianFemale",
    displayName: "Amelia",
    age: 29,
    birthDate: "1995-07-11",
    location: "London, UK",
    photoSet: ["/match-photos/lesbians/istockphoto-1398386411-612x612.jpg"],
    bio: "Creative, grounded, and quietly ambitious. I care about emotional pace and reciprocity.",
  },
  bisexualFemale: {
    key: "bisexualFemale",
    displayName: "Maya",
    age: 31,
    birthDate: "1993-10-03",
    location: "London, UK",
    photoSet: ["/match-photos/bisexual-female/istockphoto-1386479313-612x612.jpg"],
    bio: "Playful but intentional. Drawn to depth, chemistry, and people who communicate well.",
  },
  transWoman: {
    key: "transWoman",
    displayName: "Isla",
    age: 30,
    birthDate: "1994-01-03",
    location: "London, UK",
    photoSet: ["/match-photos/trans-woman/istockphoto-1313259777-612x612.jpg"],
    bio: "Warm, stylish, and clear-hearted. Looking for compatibility that feels safe and mutual.",
  },
  transMan: {
    key: "transMan",
    displayName: "Leo",
    age: 31,
    birthDate: "1993-08-14",
    location: "London, UK",
    photoSet: ["/match-photos/trans-men/istockphoto-1340512572-612x612.jpg"],
    bio: "Low-key, thoughtful, and direct. I value consistency and real emotional availability.",
  },
  nonBinary: {
    key: "nonBinary",
    displayName: "Rowan",
    age: 29,
    birthDate: "1996-02-06",
    location: "London, UK",
    photoSet: ["/match-photos/non-binary/istockphoto-1330959452-612x612.jpg"],
    bio: "Grounded, expressive, and open-minded. Drawn to emotionally safe, intentional connections.",
  },
};

export function getDemoUserProfile(context) {
  const c = context || {};
  const pref = getRouteOrientationFromContext(c);
  const gender = c.genderIdentity || "male";

  if (pref === "gay" && gender === "male") return demoUserProfiles.gayMale;
  if (pref === "bisexual" && gender === "male") return demoUserProfiles.bisexualMale;
  if (pref === "straight" && gender === "male") return demoUserProfiles.straightMale;

  if (pref === "lesbian") {
    if (gender === "trans_female") return demoUserProfiles.transWoman;
    if (gender === "non_binary") return demoUserProfiles.nonBinary;
    return demoUserProfiles.lesbianFemale;
  }

  if (pref === "straight") {
    if (gender === "female") return demoUserProfiles.straightFemale;
    if (gender === "trans_male") return demoUserProfiles.transMan;
    if (gender === "trans_female") return demoUserProfiles.transWoman;
    if (gender === "non_binary") return demoUserProfiles.nonBinary;
  }

  if (pref === "bisexual") {
    if (gender === "female") return demoUserProfiles.bisexualFemale;
    if (gender === "trans_male") return demoUserProfiles.transMan;
    if (gender === "trans_female") return demoUserProfiles.transWoman;
    if (gender === "non_binary") return demoUserProfiles.nonBinary;
  }

  if (pref === "trans_nonbinary") {
    if (gender === "trans_male") return demoUserProfiles.transMan;
    if (gender === "trans_female") return demoUserProfiles.transWoman;
    if (gender === "female") return demoUserProfiles.straightFemale;
    if (gender === "male") return demoUserProfiles.straightMale;
    return demoUserProfiles.nonBinary;
  }

  if (gender === "female") return demoUserProfiles.straightFemale;
  if (gender === "trans_male") return demoUserProfiles.transMan;
  if (gender === "trans_female") return demoUserProfiles.transWoman;
  if (gender === "non_binary") return demoUserProfiles.nonBinary;
  return demoUserProfiles.straightMale;
}
