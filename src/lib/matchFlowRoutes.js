const ORIENTATION_SLUGS = ["trans-nonbinary", "straight", "bisexual", "lesbian", "gay", "queer", "pansexual", "fluid", "open-preference"];

export function normalizeOrientation(value = "") {
  const normalized = String(value || "").trim().toLowerCase().replace(/_/g, "-");
  if (["queer", "pansexual", "fluid", "open-preference"].includes(normalized)) return "bisexual";
  return ORIENTATION_SLUGS.includes(normalized) ? normalized : "";
}

export function getOrientationSuffix(pathname = "", orientation = "") {
  const currentPath = String(pathname || "");
  const pathMatch = ORIENTATION_SLUGS.find((slug) => currentPath.includes(`-${slug}`));
  if (pathMatch) return `-${pathMatch}`;

  const normalizedOrientation = normalizeOrientation(orientation);
  return normalizedOrientation ? `-${normalizedOrientation}` : "";
}

export function withOrientation(pathname = "", basePath = "", orientation = "") {
  return `${basePath}${getOrientationSuffix(pathname, orientation)}`;
}

export function getAppRoute(pathname = "", orientation = "") {
  return withOrientation(pathname, "/app", orientation);
}

export function getDiscoverRoute(pathname = "", orientation = "") {
  return withOrientation(pathname, "/discover", orientation);
}

export function getMatchesRoute(pathname = "") {
  return withOrientation(pathname, "/matches");
}

export function getMatchesRouteWithTab(pathname = "", tab = "") {
  const base = getMatchesRoute(pathname);
  return tab ? `${base}?tab=${encodeURIComponent(tab)}` : base;
}

export function getBookDateRoute(pathname = "", matchId = "") {
  return `${withOrientation(pathname, "/book-date")}/${matchId}`;
}

export function getChatRoute(pathname = "", matchId = "") {
  return `${withOrientation(pathname, "/chat")}/${matchId}`;
}

export function getVideoCallRoute(pathname = "", matchId = "") {
  return `${withOrientation(pathname, "/video-call")}/${matchId}`;
}

export function getMatchDetailRoute(pathname = "", matchId = "") {
  return `${withOrientation(pathname, "/match")}/${matchId}`;
}

export function getQuickReflectionRoute(pathname = "", matchId = "") {
  return `${withOrientation(pathname, "/quick-reflection")}/${matchId}`;
}

export function getWaitingResponseRoute(pathname = "", matchId = "") {
  return `${withOrientation(pathname, "/waiting-response")}/${matchId}`;
}

export function getBookNextDateRoute(pathname = "", matchId = "") {
  return `${withOrientation(pathname, "/book-next-date")}/${matchId}`;
}

export function getViewFeedbackRoute(pathname = "", matchId = "") {
  return `${withOrientation(pathname, "/view-feedback")}/${matchId}`;
}

export function getConversationsRoute(pathname = "", orientation = "") {
  return withOrientation(pathname, "/conversations", orientation);
}

export function getMembershipRoute(pathname = "", orientation = "") {
  return withOrientation(pathname, "/membership", orientation);
}

export function getDateJourneyRoute(pathname = "", orientation = "") {
  return withOrientation(pathname, "/date-journey", orientation);
}

export function getInterestedInYouRoute(pathname = "", orientation = "") {
  return withOrientation(pathname, "/interested-in-you", orientation);
}

export function getOnboardingRoute(pathname = "", orientation = "") {
  return withOrientation(pathname, "/onboarding", orientation);
}
