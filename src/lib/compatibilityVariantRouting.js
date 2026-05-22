import { normalizeOrientation } from "@/lib/matchFlowRoutes";

export const GENDER_IDENTITY_OPTIONS = [
  "Male",
  "Female",
  "Non-binary",
  "Trans male",
  "Trans female",
];

export const SEXUAL_PREFERENCE_OPTIONS = [
  "Straight",
  "Gay",
  "Lesbian",
  "Bisexual",
  "Pansexual",
  "Queer",
];

export const LOOKING_FOR_OPTIONS = [
  "Men",
  "Women",
  "Men & Women",
  "Non-binary people",
  "Open to all",
];

const ONBOARDING_DRAFT_KEY = "tetherOnboardingDraft";

export function normalizeGenderIdentity(value = "") {
  const normalized = String(value || "").trim().toLowerCase();
  if (normalized === "male") return "male";
  if (normalized === "female") return "female";
  if (["non-binary", "non binary", "non_binary"].includes(normalized)) return "non_binary";
  if (["trans male", "trans_male", "trans man"].includes(normalized)) return "trans_male";
  if (["trans female", "trans_female", "trans woman"].includes(normalized)) return "trans_female";
  return "male";
}

export function normalizeSexualPreference(value = "") {
  const normalized = String(value || "").trim().toLowerCase();
  if (["straight", "gay", "lesbian", "bisexual", "pansexual", "queer"].includes(normalized)) {
    return normalized;
  }
  if (normalized === "open-preference" || normalized === "open_preference" || normalized === "fluid") {
    return "queer";
  }
  return "straight";
}

export function normalizeLookingFor(value = "") {
  const normalized = String(value || "").trim().toLowerCase();
  if (normalized === "men") return "men";
  if (normalized === "women") return "women";
  if (["men & women", "men_and_women", "men_women"].includes(normalized)) return "men_women";
  if (["non-binary people", "non binary people", "non_binary_people"].includes(normalized)) return "non_binary_people";
  if (["open to all", "open_to_all"].includes(normalized)) return "open_to_all";
  return "open_to_all";
}

function getLegacyFilters(routeOrientation, lookingFor) {
  if (routeOrientation === "bisexual") {
    if (lookingFor === "men") return { bisexualFilter: "prefer_guys", transNonBinaryFilter: "show_mix" };
    if (lookingFor === "women") return { bisexualFilter: "prefer_girls", transNonBinaryFilter: "show_mix" };
    return { bisexualFilter: "show_mix", transNonBinaryFilter: "show_mix" };
  }

  if (routeOrientation === "trans_nonbinary") {
    if (lookingFor === "men") return { bisexualFilter: "show_mix", transNonBinaryFilter: "prefer_cis_men" };
    if (lookingFor === "women") return { bisexualFilter: "show_mix", transNonBinaryFilter: "prefer_cis_women" };
    if (lookingFor === "non_binary_people") return { bisexualFilter: "show_mix", transNonBinaryFilter: "prefer_non_binary" };
    return { bisexualFilter: "show_mix", transNonBinaryFilter: "show_mix" };
  }

  return { bisexualFilter: "show_mix", transNonBinaryFilter: "show_mix" };
}

function buildResult(input, config) {
  const routeOrientation = config.routeOrientation;
  const filters = getLegacyFilters(routeOrientation, input.lookingFor);

  return {
    genderIdentity: input.genderIdentity,
    sexualPreference: input.sexualPreference,
    lookingFor: input.lookingFor,
    sexualVariant: config.sexualVariant,
    compatibilityAssessment: config.compatibilityAssessment,
    compatibilityFramework: config.compatibilityFramework,
    eligibleMatchGenders: config.eligibleMatchGenders,
    onboardingRoute: `/onboarding-${routeOrientation === "trans_nonbinary" ? "trans-nonbinary" : routeOrientation}`,
    assessmentRoute: config.assessmentRoute,
    attractionFramework: config.attractionFramework,
    intimacyFramework: config.intimacyFramework,
    profileMarkerFramework: config.profileMarkerFramework,
    routeOrientation,
    ...filters,
  };
}

export function determineCompatibilityVariant(args = {}) {
  const input = {
    genderIdentity: normalizeGenderIdentity(args.genderIdentity),
    sexualPreference: normalizeSexualPreference(args.sexualPreference),
    lookingFor: normalizeLookingFor(args.lookingFor),
  };

  const isMultiAttraction = ["bisexual", "pansexual", "queer"].includes(input.sexualPreference);

  if (input.genderIdentity === "female" && input.sexualPreference === "straight" && input.lookingFor === "men") {
    return buildResult(input, {
      sexualVariant: "straight_female",
      compatibilityAssessment: "Straight Female Gender Assessment",
      compatibilityFramework: "Female attracted-to-men framework",
      assessmentRoute: "/assessment/straight-female",
      eligibleMatchGenders: ["male"],
      attractionFramework: "female_attracted_to_men",
      intimacyFramework: "straight_female_intimacy",
      profileMarkerFramework: "straight_female_markers",
      routeOrientation: "straight",
    });
  }

  if (input.genderIdentity === "male" && input.sexualPreference === "straight" && input.lookingFor === "women") {
    return buildResult(input, {
      sexualVariant: "straight_male",
      compatibilityAssessment: "Straight Male Gender Assessment",
      compatibilityFramework: "Male attracted-to-women framework",
      assessmentRoute: "/assessment/straight-male",
      eligibleMatchGenders: ["female"],
      attractionFramework: "male_attracted_to_women",
      intimacyFramework: "straight_male_intimacy",
      profileMarkerFramework: "straight_male_markers",
      routeOrientation: "straight",
    });
  }

  if (input.genderIdentity === "male" && input.sexualPreference === "gay" && input.lookingFor === "men") {
    return buildResult(input, {
      sexualVariant: "gay_male",
      compatibilityAssessment: "Gay Male Compatibility Assessment",
      compatibilityFramework: "Male attracted-to-men framework",
      assessmentRoute: "/assessment/gay-male",
      eligibleMatchGenders: ["male"],
      attractionFramework: "male_attracted_to_men",
      intimacyFramework: "gay_male_intimacy",
      profileMarkerFramework: "gay_male_markers",
      routeOrientation: "gay",
    });
  }

  if (input.genderIdentity === "female" && input.sexualPreference === "lesbian" && input.lookingFor === "women") {
    return buildResult(input, {
      sexualVariant: "lesbian_female",
      compatibilityAssessment: "Lesbian Compatibility Assessment",
      compatibilityFramework: "Female attracted-to-women framework",
      assessmentRoute: "/assessment/lesbian",
      eligibleMatchGenders: ["female"],
      attractionFramework: "female_attracted_to_women",
      intimacyFramework: "lesbian_intimacy",
      profileMarkerFramework: "lesbian_markers",
      routeOrientation: "lesbian",
    });
  }

  if (input.genderIdentity === "female" && isMultiAttraction && ["men_women", "open_to_all"].includes(input.lookingFor)) {
    return buildResult(input, {
      sexualVariant: "bisexual_female",
      compatibilityAssessment: "Bisexual Compatibility Assessment",
      compatibilityFramework: "Mixed attraction framework",
      assessmentRoute: "/assessment/bisexual",
      eligibleMatchGenders: ["male", "female", "non_binary"],
      attractionFramework: "mixed_attraction_female",
      intimacyFramework: "bisexual_female_intimacy",
      profileMarkerFramework: "bisexual_female_markers",
      routeOrientation: "bisexual",
    });
  }

  if (input.genderIdentity === "male" && isMultiAttraction && ["men_women", "open_to_all"].includes(input.lookingFor)) {
    return buildResult(input, {
      sexualVariant: "bisexual_male",
      compatibilityAssessment: "Bisexual Compatibility Assessment",
      compatibilityFramework: "Mixed attraction framework",
      assessmentRoute: "/assessment/bisexual",
      eligibleMatchGenders: ["male", "female", "non_binary"],
      attractionFramework: "mixed_attraction_male",
      intimacyFramework: "bisexual_male_intimacy",
      profileMarkerFramework: "bisexual_male_markers",
      routeOrientation: "bisexual",
    });
  }

  if (input.genderIdentity === "trans_female" && input.sexualPreference === "straight" && input.lookingFor === "men") {
    return buildResult(input, {
      sexualVariant: "trans_female_straight",
      compatibilityAssessment: "Straight Female Gender Assessment",
      compatibilityFramework: "Female attracted-to-men framework",
      assessmentRoute: "/assessment/straight-female",
      eligibleMatchGenders: ["male"],
      attractionFramework: "female_attracted_to_men",
      intimacyFramework: "straight_female_intimacy",
      profileMarkerFramework: "straight_female_markers",
      routeOrientation: "straight",
    });
  }

  if (input.genderIdentity === "trans_male" && input.sexualPreference === "straight" && input.lookingFor === "women") {
    return buildResult(input, {
      sexualVariant: "trans_male_straight",
      compatibilityAssessment: "Straight Male Gender Assessment",
      compatibilityFramework: "Male attracted-to-women framework",
      assessmentRoute: "/assessment/straight-male",
      eligibleMatchGenders: ["female"],
      attractionFramework: "male_attracted_to_women",
      intimacyFramework: "straight_male_intimacy",
      profileMarkerFramework: "straight_male_markers",
      routeOrientation: "straight",
    });
  }

  if (input.genderIdentity === "trans_female" && input.sexualPreference === "lesbian" && input.lookingFor === "women") {
    return buildResult(input, {
      sexualVariant: "trans_female_lesbian",
      compatibilityAssessment: "Lesbian Compatibility Assessment",
      compatibilityFramework: "Female attracted-to-women framework",
      assessmentRoute: "/assessment/lesbian",
      eligibleMatchGenders: ["female"],
      attractionFramework: "female_attracted_to_women",
      intimacyFramework: "lesbian_intimacy",
      profileMarkerFramework: "lesbian_markers",
      routeOrientation: "lesbian",
    });
  }

  if (input.genderIdentity === "trans_male" && input.sexualPreference === "gay" && input.lookingFor === "men") {
    return buildResult(input, {
      sexualVariant: "trans_male_gay",
      compatibilityAssessment: "Gay Male Compatibility Assessment",
      compatibilityFramework: "Male attracted-to-men framework",
      assessmentRoute: "/assessment/gay-male",
      eligibleMatchGenders: ["male"],
      attractionFramework: "male_attracted_to_men",
      intimacyFramework: "gay_male_intimacy",
      profileMarkerFramework: "gay_male_markers",
      routeOrientation: "gay",
    });
  }

  if (input.genderIdentity === "non_binary" && isMultiAttraction && input.lookingFor === "men") {
    return buildResult(input, {
      sexualVariant: "nonbinary_attracted_masc",
      compatibilityAssessment: "Non-Binary Masc Assessment",
      compatibilityFramework: "Masc-attraction framework",
      assessmentRoute: "/assessment/nonbinary-masc",
      eligibleMatchGenders: ["masculine_presenting"],
      attractionFramework: "nonbinary_masc_attraction",
      intimacyFramework: "nonbinary_masc_intimacy",
      profileMarkerFramework: "nonbinary_masc_markers",
      routeOrientation: "trans_nonbinary",
    });
  }

  if (input.genderIdentity === "non_binary" && isMultiAttraction && input.lookingFor === "women") {
    return buildResult(input, {
      sexualVariant: "nonbinary_attracted_femme",
      compatibilityAssessment: "Non-Binary Femme Assessment",
      compatibilityFramework: "Femme-attraction framework",
      assessmentRoute: "/assessment/nonbinary-femme",
      eligibleMatchGenders: ["feminine_presenting"],
      attractionFramework: "nonbinary_femme_attraction",
      intimacyFramework: "nonbinary_femme_intimacy",
      profileMarkerFramework: "nonbinary_femme_markers",
      routeOrientation: "trans_nonbinary",
    });
  }

  if (input.genderIdentity === "non_binary" && isMultiAttraction && ["men_women", "open_to_all", "non_binary_people"].includes(input.lookingFor)) {
    return buildResult(input, {
      sexualVariant: "nonbinary_open",
      compatibilityAssessment: "Non-Binary Open Assessment",
      compatibilityFramework: "Fluid attraction framework",
      assessmentRoute: "/assessment/nonbinary-open",
      eligibleMatchGenders: ["open"],
      attractionFramework: "nonbinary_fluid_attraction",
      intimacyFramework: "nonbinary_open_intimacy",
      profileMarkerFramework: "nonbinary_open_markers",
      routeOrientation: "trans_nonbinary",
    });
  }

  if (input.genderIdentity === "female" && isMultiAttraction) {
    return buildResult(input, {
      sexualVariant: "bisexual_female",
      compatibilityAssessment: "Bisexual Compatibility Assessment",
      compatibilityFramework: "Mixed attraction framework",
      assessmentRoute: "/assessment/bisexual",
      eligibleMatchGenders: input.lookingFor === "men" ? ["male"] : input.lookingFor === "women" ? ["female"] : ["male", "female", "non_binary"],
      attractionFramework: "mixed_attraction_female",
      intimacyFramework: "bisexual_female_intimacy",
      profileMarkerFramework: "bisexual_female_markers",
      routeOrientation: "bisexual",
    });
  }

  if (input.genderIdentity === "male" && isMultiAttraction) {
    return buildResult(input, {
      sexualVariant: "bisexual_male",
      compatibilityAssessment: "Bisexual Compatibility Assessment",
      compatibilityFramework: "Mixed attraction framework",
      assessmentRoute: "/assessment/bisexual",
      eligibleMatchGenders: input.lookingFor === "men" ? ["male"] : input.lookingFor === "women" ? ["female"] : ["male", "female", "non_binary"],
      attractionFramework: "mixed_attraction_male",
      intimacyFramework: "bisexual_male_intimacy",
      profileMarkerFramework: "bisexual_male_markers",
      routeOrientation: "bisexual",
    });
  }

  if (input.genderIdentity === "trans_female" && isMultiAttraction) {
    return buildResult(input, {
      sexualVariant: input.lookingFor === "women" ? "trans_female_lesbian" : "bisexual_female",
      compatibilityAssessment: input.lookingFor === "women" ? "Lesbian Compatibility Assessment" : "Bisexual Compatibility Assessment",
      compatibilityFramework: input.lookingFor === "women" ? "Female attracted-to-women framework" : "Mixed attraction framework",
      assessmentRoute: input.lookingFor === "women" ? "/assessment/lesbian" : "/assessment/bisexual",
      eligibleMatchGenders: input.lookingFor === "women" ? ["female"] : input.lookingFor === "men" ? ["male"] : ["male", "female", "non_binary"],
      attractionFramework: input.lookingFor === "women" ? "female_attracted_to_women" : "mixed_attraction_female",
      intimacyFramework: input.lookingFor === "women" ? "lesbian_intimacy" : "bisexual_female_intimacy",
      profileMarkerFramework: input.lookingFor === "women" ? "lesbian_markers" : "bisexual_female_markers",
      routeOrientation: input.lookingFor === "women" ? "lesbian" : "bisexual",
    });
  }

  if (input.genderIdentity === "trans_male" && isMultiAttraction) {
    return buildResult(input, {
      sexualVariant: input.lookingFor === "men" ? "trans_male_gay" : "bisexual_male",
      compatibilityAssessment: input.lookingFor === "men" ? "Gay Male Compatibility Assessment" : "Bisexual Compatibility Assessment",
      compatibilityFramework: input.lookingFor === "men" ? "Male attracted-to-men framework" : "Mixed attraction framework",
      assessmentRoute: input.lookingFor === "men" ? "/assessment/gay-male" : "/assessment/bisexual",
      eligibleMatchGenders: input.lookingFor === "women" ? ["female"] : input.lookingFor === "men" ? ["male"] : ["male", "female", "non_binary"],
      attractionFramework: input.lookingFor === "men" ? "male_attracted_to_men" : "mixed_attraction_male",
      intimacyFramework: input.lookingFor === "men" ? "gay_male_intimacy" : "bisexual_male_intimacy",
      profileMarkerFramework: input.lookingFor === "men" ? "gay_male_markers" : "bisexual_male_markers",
      routeOrientation: input.lookingFor === "men" ? "gay" : "bisexual",
    });
  }

  return buildResult(input, {
    sexualVariant: "straight_male",
    compatibilityAssessment: "Straight Male Gender Assessment",
    compatibilityFramework: "Male attracted-to-women framework",
    assessmentRoute: "/assessment/straight-male",
    eligibleMatchGenders: ["female"],
    attractionFramework: "male_attracted_to_women",
    intimacyFramework: "straight_male_intimacy",
    profileMarkerFramework: "straight_male_markers",
    routeOrientation: "straight",
  });
}

export function getRouteOrientationFromContext(context = {}) {
  const routeOrientation = normalizeOrientation(context.routeOrientation || "");
  if (routeOrientation) return routeOrientation.replace(/-/g, "_");

  const variant = String(context.sexualVariant || "").trim().toLowerCase();
  if (["straight_female", "straight_male", "trans_female_straight", "trans_male_straight"].includes(variant)) return "straight";
  if (["gay_male", "trans_male_gay"].includes(variant)) return "gay";
  if (["lesbian_female", "trans_female_lesbian"].includes(variant)) return "lesbian";
  if (["bisexual_female", "bisexual_male"].includes(variant)) return "bisexual";
  if (variant.startsWith("nonbinary_")) return "trans_nonbinary";

  const rawPref = normalizeSexualPreference(context.sexualPreference || "");
  if (["bisexual", "pansexual", "queer"].includes(rawPref)) return "bisexual";
  if (rawPref === "gay") return "gay";
  if (rawPref === "lesbian") return "lesbian";
  if (rawPref === "straight") return "straight";
  return "straight";
}

export function saveOnboardingDraft(draft) {
  if (typeof window === "undefined") return;
  window.sessionStorage.setItem(ONBOARDING_DRAFT_KEY, JSON.stringify(draft));
}

export function loadOnboardingDraft() {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(ONBOARDING_DRAFT_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function clearOnboardingDraft() {
  if (typeof window === "undefined") return;
  window.sessionStorage.removeItem(ONBOARDING_DRAFT_KEY);
}
