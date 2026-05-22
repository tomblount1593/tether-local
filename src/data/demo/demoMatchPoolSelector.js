import { photoManifest } from "@/data/demo/photoManifest";
import { applyDemoVariantFromPathname, inferDemoVariantSlugFromPathname } from "@/data/demo/demoVariantRoutes";
import { getRouteOrientationFromContext, normalizeGenderIdentity, normalizeSexualPreference } from "@/lib/compatibilityVariantRouting";

const STORAGE_KEY = "tetherDemoUserContext";

export const DEFAULT_DEMO_CONTEXT = {
  membershipTier: "standard",
  genderIdentity: "male",
  sexualPreference: "straight",
  lookingFor: "women",
  routeOrientation: "straight",
  bisexualFilter: "show_mix",
  transNonBinaryFilter: "show_mix",
  birthDate: "1993-05-01",
};

export function getTierMatchConfig(membershipTier) {
  if (membershipTier === "concierge") return { count: 5, minScore: 85, maxScore: 98, label: "concierge" };
  if (membershipTier === "premium") return { count: 15, minScore: 85, maxScore: 95, label: "premium" };
  return { count: 20, minScore: 60, maxScore: 79, label: "standard" };
}

export function hashSeed(seed) {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i += 1) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function seededRandom(seed) {
  let state = hashSeed(seed);
  return () => {
    state = (Math.imul(1664525, state) + 1013904223) >>> 0;
    return state / 4294967296;
  };
}

export function seededShuffle(items, seed) {
  const rng = seededRandom(seed);
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rng() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function getDeterministicSubset(items, count, seed) {
  return seededShuffle(items, seed).slice(0, count);
}

function inferOrientationFromPathname(pathname) {
  const variantSlug = inferDemoVariantSlugFromPathname(pathname || "");
  if (variantSlug === "trans" || variantSlug === "non-binary" || variantSlug === "trans-nonbinary") return "trans_nonbinary";
  if (variantSlug === "queer" || variantSlug === "pansexual" || variantSlug === "fluid" || variantSlug === "open-preference") return "trans_nonbinary";
  if (variantSlug) return variantSlug.replace(/-/g, "_");
  if (pathname.includes("trans-nonbinary")) return "trans_nonbinary";
  if (pathname.includes("lesbian")) return "lesbian";
  if (pathname.includes("open-preference")) return "bisexual";
  if (pathname.includes("pansexual")) return "bisexual";
  if (pathname.includes("queer")) return "bisexual";
  if (pathname.includes("fluid")) return "bisexual";
  if (pathname.includes("bisexual")) return "bisexual";
  if (pathname.includes("straight")) return "straight";
  if (pathname.includes("gay")) return "gay";
  return null;
}

export function deriveContextFromRoute(pathname, existingContext = /** @type {Record<string, any>} */ ({})) {
  const seeded = applyDemoVariantFromPathname(pathname, existingContext);
  if (seeded.routeVariantSlug) return /** @type {Record<string, any>} */ (seeded);
  const ctx = /** @type {any} */ (existingContext);
  const inferred = inferOrientationFromPathname(pathname || "");
  if (!inferred) return existingContext;
  const next = { ...ctx, routeOrientation: inferred.replace(/-/g, "_") };
  if (!ctx.genderIdentity) {
    if (inferred === "gay") next.genderIdentity = "male";
    else if (inferred === "lesbian") next.genderIdentity = "female";
    else if (inferred === "trans_nonbinary") next.genderIdentity = "non_binary";
    else next.genderIdentity = "male";
  }
  if (!ctx.sexualPreference) {
    next.sexualPreference = inferred === "trans_nonbinary" ? "queer" : inferred;
  }
  return /** @type {Record<string, any>} */ (next);
}

/** @returns {Record<string, any>} */
export function getStoredDemoContext(pathname) {
  const orientation = typeof window !== "undefined" ? (window.localStorage.getItem("tether_orientation") || "straight") : "straight";
  const gender = typeof window !== "undefined" ? (window.localStorage.getItem("tether_user_gender") || "male") : "male";
  const tier = typeof window !== "undefined" ? (window.localStorage.getItem("tether_tier") || "standard") : "standard";
  const inferred = pathname ? inferOrientationFromPathname(pathname) : null;
  const base = {
    ...DEFAULT_DEMO_CONTEXT,
    membershipTier: tier,
    genderIdentity: normalizeGender(gender),
    sexualPreference: normalizeSexualPreference(typeof window !== "undefined" ? (window.localStorage.getItem("tether_user_sexual_preference") || "") : "") || "straight",
    lookingFor: typeof window !== "undefined" ? (window.localStorage.getItem("tether_user_looking_for") || DEFAULT_DEMO_CONTEXT.lookingFor) : DEFAULT_DEMO_CONTEXT.lookingFor,
    routeOrientation: (inferred || orientation || "straight").replace(/-/g, "_"),
  };
  if (typeof window === "undefined") return /** @type {Record<string, any>} */ (deriveContextFromRoute(pathname, base));
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return deriveContextFromRoute(pathname, base);
    const parsed = JSON.parse(raw);
    return deriveContextFromRoute(pathname, { ...base, ...parsed });
  } catch {
    return deriveContextFromRoute(pathname, base);
  }
}

export function saveDemoContext(context) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(context));
}

export function normalizeGender(value) {
  return normalizeGenderIdentity(value);
}

function buildMix(keys, perPool, seed) {
  const lists = keys.map((key, i) => getDeterministicSubset(photoManifest[key] || [], perPool[i], `${seed}:${key}`));
  return lists.flat().map((photoPath) => ({ sourceFolderKey: keys.find((k) => (photoManifest[k] || []).includes(photoPath)), photoPath }));
}

export function getMatchPhotoPoolsForDemoUser(context) {
  const c = { ...DEFAULT_DEMO_CONTEXT, ...context };
  const normalizedPreference = getRouteOrientationFromContext(c);
  const cfg = getTierMatchConfig(c.membershipTier);
  const seed = `${c.membershipTier}:${c.genderIdentity}:${normalizedPreference}:${c.bisexualFilter || "show_mix"}:${c.transNonBinaryFilter || "show_mix"}:${c.lookingFor || "open_to_all"}`;

  if (normalizedPreference === "gay") return getDeterministicSubset((photoManifest.gays || []).map((photoPath) => ({ sourceFolderKey: "gays", photoPath })), cfg.count, seed);
  if (normalizedPreference === "lesbian") return getDeterministicSubset((photoManifest.lesbians || []).map((photoPath) => ({ sourceFolderKey: "lesbians", photoPath })), cfg.count, seed);

  if (normalizedPreference === "bisexual") {
    const f = c.bisexualFilter || "show_mix";
    if (f === "prefer_guys") return getDeterministicSubset((photoManifest.bisexualMale || []).map((photoPath) => ({ sourceFolderKey: "bisexualMale", photoPath })), cfg.count, seed);
    if (f === "prefer_girls") return getDeterministicSubset((photoManifest.bisexualFemale || []).map((photoPath) => ({ sourceFolderKey: "bisexualFemale", photoPath })), cfg.count, seed);
    const split = cfg.count === 20 ? [10, 10] : cfg.count === 15 ? [8, 7] : [3, 2];
    return buildMix(["bisexualMale", "bisexualFemale"], split, seed);
  }

  if (normalizedPreference === "trans_nonbinary") {
    const f = c.transNonBinaryFilter || "show_mix";
    const map = {
      prefer_cis_men: "straightMale",
      prefer_cis_women: "straightFemale",
      prefer_trans_men: "transMen",
      prefer_trans_women: "transWoman",
      prefer_non_binary: "nonBinary",
    };
    if (map[f]) return getDeterministicSubset((photoManifest[map[f]] || []).map((photoPath) => ({ sourceFolderKey: map[f], photoPath })), cfg.count, seed);
    const perPool = cfg.count === 20 ? [4, 4, 4, 4, 4] : cfg.count === 15 ? [3, 3, 3, 3, 3] : [1, 1, 1, 1, 1];
    return buildMix(["straightMale", "straightFemale", "transMen", "transWoman", "nonBinary"], perPool, seed);
  }

  if (normalizedPreference === "straight") {
    if (["female", "trans_female"].includes(c.genderIdentity)) return getDeterministicSubset((photoManifest.straightMale || []).map((photoPath) => ({ sourceFolderKey: "straightMale", photoPath })), cfg.count, seed);
    if (["non_binary"].includes(c.genderIdentity)) {
      const split = cfg.count === 5 ? [3, 2] : cfg.count === 15 ? [8, 7] : [10, 10];
      return buildMix(["straightMale", "straightFemale"], split, seed);
    }
    return getDeterministicSubset((photoManifest.straightFemale || []).map((photoPath) => ({ sourceFolderKey: "straightFemale", photoPath })), cfg.count, seed);
  }

  return getDeterministicSubset((photoManifest.straightFemale || []).map((photoPath) => ({ sourceFolderKey: "straightFemale", photoPath })), cfg.count, seed);
}
