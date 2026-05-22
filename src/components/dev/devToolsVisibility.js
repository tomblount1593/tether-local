const DEMO_ROUTE_PREFIXES = [
  "landing",
  "sign-in",
  "onboarding",
  "app",
  "discover",
  "matches",
  "conversations",
  "map",
  "expert",
  "insights",
  "profile",
  "chat",
  "video-call",
  "book-date",
  "post-date-feedback",
  "quick-reflection",
  "waiting-response",
  "book-next-date",
  "view-feedback",
  "match",
  "membership",
  "private-chat",
  "date-journey",
  "interested-in-you",
];

const INLINE_DEV_PILL_ROUTE_PREFIXES = [
  "sign-in",
  "onboarding",
  "app",
  "discover",
  "matches",
  "conversations",
  "map",
  "expert",
  "insights",
  "profile",
];

function matchesRoutePrefix(pathname, prefix) {
  return (
    pathname === `/${prefix}` ||
    pathname.startsWith(`/${prefix}/`) ||
    pathname.startsWith(`/${prefix}-`)
  );
}

export function isDemoMode(pathname = "") {
  return pathname === "/" || DEMO_ROUTE_PREFIXES.some((prefix) => matchesRoutePrefix(pathname, prefix));
}

export function isDevEnvironment() {
  return Boolean(import.meta.env.DEV);
}

export function shouldEnableDevTools(pathname = "") {
  const showDevButton = isDemoMode(pathname) || isDevEnvironment();
  return showDevButton;
}

export function shouldUseInlineDevPill(pathname = "") {
  return INLINE_DEV_PILL_ROUTE_PREFIXES.some((prefix) => matchesRoutePrefix(pathname, prefix));
}
