import {
  determineCompatibilityVariant,
  normalizeGenderIdentity,
  normalizeLookingFor,
  normalizeSexualPreference,
} from "@/lib/compatibilityVariantRouting";

export const DEMO_VARIANT_ROUTE_CONFIGS = [
  {
    slug: "gay",
    orientation: "gay",
    demoInput: { genderIdentity: "male", sexualPreference: "gay", lookingFor: "men" },
  },
  {
    slug: "lesbian",
    orientation: "lesbian",
    demoInput: { genderIdentity: "female", sexualPreference: "lesbian", lookingFor: "women" },
  },
  {
    slug: "straight",
    orientation: "straight",
    demoInput: { genderIdentity: "male", sexualPreference: "straight", lookingFor: "women" },
  },
  {
    slug: "bisexual",
    orientation: "bisexual",
    demoInput: { genderIdentity: "female", sexualPreference: "bisexual", lookingFor: "men_women" },
  },
  {
    slug: "queer",
    orientation: "trans_nonbinary",
    demoInput: { genderIdentity: "non_binary", sexualPreference: "queer", lookingFor: "open_to_all" },
  },
  {
    slug: "pansexual",
    orientation: "trans_nonbinary",
    demoInput: { genderIdentity: "non_binary", sexualPreference: "pansexual", lookingFor: "open_to_all" },
  },
  {
    slug: "trans",
    orientation: "trans_nonbinary",
    demoInput: { genderIdentity: "trans_female", sexualPreference: "queer", lookingFor: "open_to_all" },
  },
  {
    slug: "non-binary",
    orientation: "trans_nonbinary",
    demoInput: { genderIdentity: "non_binary", sexualPreference: "queer", lookingFor: "open_to_all" },
  },
  {
    slug: "trans-nonbinary",
    orientation: "trans_nonbinary",
    demoInput: { genderIdentity: "non_binary", sexualPreference: "queer", lookingFor: "open_to_all" },
  },
  {
    slug: "fluid",
    orientation: "trans_nonbinary",
    demoInput: { genderIdentity: "non_binary", sexualPreference: "queer", lookingFor: "open_to_all" },
  },
  {
    slug: "open-preference",
    orientation: "trans_nonbinary",
    demoInput: { genderIdentity: "non_binary", sexualPreference: "queer", lookingFor: "open_to_all" },
  },
];

const SORTED_VARIANT_SLUGS = DEMO_VARIANT_ROUTE_CONFIGS
  .map((config) => config.slug)
  .sort((left, right) => right.length - left.length);

export const DEMO_VARIANT_ROUTE_SLUGS = [...SORTED_VARIANT_SLUGS];

export function getDemoVariantRouteConfig(slug = "") {
  return DEMO_VARIANT_ROUTE_CONFIGS.find((config) => config.slug === slug) || null;
}

export function inferDemoVariantSlugFromPathname(pathname = "") {
  const normalizedPath = String(pathname || "").toLowerCase();
  return SORTED_VARIANT_SLUGS.find((slug) => normalizedPath.includes(`-${slug}`)) || null;
}

export function buildDemoContextForVariantSlug(slug = "", baseContext = {}) {
  const config = getDemoVariantRouteConfig(slug);
  if (!config) return { ...baseContext };

  const input = {
    genderIdentity: normalizeGenderIdentity(config.demoInput.genderIdentity),
    sexualPreference: normalizeSexualPreference(config.demoInput.sexualPreference),
    lookingFor: normalizeLookingFor(config.demoInput.lookingFor),
  };
  const resolved = determineCompatibilityVariant(input);

  return {
    ...baseContext,
    ...resolved,
    ...input,
    routeOrientation: config.orientation,
    routeVariantSlug: config.slug,
    bisexualFilter: resolved.bisexualFilter || baseContext.bisexualFilter || "show_mix",
    transNonBinaryFilter: resolved.transNonBinaryFilter || baseContext.transNonBinaryFilter || "show_mix",
  };
}

export function applyDemoVariantFromPathname(pathname = "", baseContext = {}) {
  const slug = inferDemoVariantSlugFromPathname(pathname);
  if (!slug) return { ...baseContext };
  return buildDemoContextForVariantSlug(slug, baseContext);
}
