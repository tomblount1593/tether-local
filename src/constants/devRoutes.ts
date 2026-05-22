export type DevRouteGroupKey =
  | "CORE"
  | "ONBOARDING"
  | "GAY"
  | "STRAIGHT"
  | "BISEXUAL"
  | "LESBIAN"
  | "TRANS/NONBINARY"
  | "DATING FLOW"
  | "DATE JOURNEY VARIANTS"
  | "MEMBERSHIP"
  | "DISCOVERED";

export type DevRouteDef = {
  group: DevRouteGroupKey;
  path: string;
  dynamic?: boolean;
  paramName?: "matchId" | "bookingId";
  defaultValue?: string;
};

export const DEV_ROUTE_GROUP_ORDER: DevRouteGroupKey[] = [
  "CORE",
  "ONBOARDING",
  "GAY",
  "STRAIGHT",
  "BISEXUAL",
  "LESBIAN",
  "TRANS/NONBINARY",
  "DATING FLOW",
  "DATE JOURNEY VARIANTS",
  "MEMBERSHIP",
  "DISCOVERED",
];

export const DEV_ROUTES_MANUAL: DevRouteDef[] = [
  { group: "CORE", path: "/" },
  { group: "CORE", path: "/app" },
  { group: "CORE", path: "/discover" },
  { group: "CORE", path: "/matches" },
  { group: "CORE", path: "/conversations" },
  { group: "CORE", path: "/map" },
  { group: "CORE", path: "/expert" },
  { group: "CORE", path: "/insights" },
  { group: "CORE", path: "/profile" },
  { group: "CORE", path: "/sign-in" },
  { group: "CORE", path: "/sign-in-standard" },
  { group: "CORE", path: "/sign-in-premium" },
  { group: "CORE", path: "/sign-in-concierge" },
  { group: "CORE", path: "/landing-standard" },
  { group: "CORE", path: "/landing-premium" },
  { group: "CORE", path: "/landing-concierge" },

  { group: "ONBOARDING", path: "/onboarding" },
  { group: "ONBOARDING", path: "/onboarding-gay" },
  { group: "ONBOARDING", path: "/onboarding-section01" },
  { group: "ONBOARDING", path: "/onboarding-section02" },
  { group: "ONBOARDING", path: "/onboarding-section03" },
  { group: "ONBOARDING", path: "/onboarding-section04" },
  { group: "ONBOARDING", path: "/onboarding-section05" },
  { group: "ONBOARDING", path: "/onboarding-howitworks" },
  { group: "ONBOARDING", path: "/onboarding-gay-section01" },
  { group: "ONBOARDING", path: "/onboarding-gay-section02" },
  { group: "ONBOARDING", path: "/onboarding-gay-section03" },
  { group: "ONBOARDING", path: "/onboarding-gay-section04" },
  { group: "ONBOARDING", path: "/onboarding-gay-section05" },
  { group: "ONBOARDING", path: "/onboarding-gay-howitworks" },
  { group: "ONBOARDING", path: "/onboarding-straight" },
  { group: "ONBOARDING", path: "/onboarding-straight-section01" },
  { group: "ONBOARDING", path: "/onboarding-straight-section02" },
  { group: "ONBOARDING", path: "/onboarding-straight-section03" },
  { group: "ONBOARDING", path: "/onboarding-straight-section04" },
  { group: "ONBOARDING", path: "/onboarding-straight-section05" },
  { group: "ONBOARDING", path: "/onboarding-straight-howitworks" },
  { group: "ONBOARDING", path: "/onboarding-bisexual" },
  { group: "ONBOARDING", path: "/onboarding-bisexual-section01" },
  { group: "ONBOARDING", path: "/onboarding-bisexual-section02" },
  { group: "ONBOARDING", path: "/onboarding-bisexual-section03" },
  { group: "ONBOARDING", path: "/onboarding-bisexual-section04" },
  { group: "ONBOARDING", path: "/onboarding-bisexual-section05" },
  { group: "ONBOARDING", path: "/onboarding-bisexual-howitworks" },
  { group: "ONBOARDING", path: "/onboarding-lesbian" },
  { group: "ONBOARDING", path: "/onboarding-lesbian-section01" },
  { group: "ONBOARDING", path: "/onboarding-lesbian-section02" },
  { group: "ONBOARDING", path: "/onboarding-lesbian-section03" },
  { group: "ONBOARDING", path: "/onboarding-lesbian-section04" },
  { group: "ONBOARDING", path: "/onboarding-lesbian-section05" },
  { group: "ONBOARDING", path: "/onboarding-lesbian-howitworks" },
  { group: "ONBOARDING", path: "/onboarding-trans-nonbinary" },
  { group: "ONBOARDING", path: "/onboarding-trans-nonbinary-section01" },
  { group: "ONBOARDING", path: "/onboarding-trans-nonbinary-section02" },
  { group: "ONBOARDING", path: "/onboarding-trans-nonbinary-section03" },
  { group: "ONBOARDING", path: "/onboarding-trans-nonbinary-section04" },
  { group: "ONBOARDING", path: "/onboarding-trans-nonbinary-section05" },
  { group: "ONBOARDING", path: "/onboarding-trans-nonbinary-howitworks" },

  { group: "GAY", path: "/app-gay" },
  { group: "GAY", path: "/discover-gay" },
  { group: "GAY", path: "/matches-gay" },
  { group: "GAY", path: "/conversations-gay" },
  { group: "GAY", path: "/map-gay" },
  { group: "GAY", path: "/expert-gay" },
  { group: "GAY", path: "/insights-gay" },
  { group: "GAY", path: "/profile-gay" },

  { group: "STRAIGHT", path: "/app-straight" },
  { group: "STRAIGHT", path: "/discover-straight" },
  { group: "STRAIGHT", path: "/matches-straight" },
  { group: "STRAIGHT", path: "/conversations-straight" },
  { group: "STRAIGHT", path: "/map-straight" },
  { group: "STRAIGHT", path: "/expert-straight" },
  { group: "STRAIGHT", path: "/insights-straight" },
  { group: "STRAIGHT", path: "/profile-straight" },

  { group: "BISEXUAL", path: "/app-bisexual" },
  { group: "BISEXUAL", path: "/discover-bisexual" },
  { group: "BISEXUAL", path: "/matches-bisexual" },
  { group: "BISEXUAL", path: "/conversations-bisexual" },
  { group: "BISEXUAL", path: "/map-bisexual" },
  { group: "BISEXUAL", path: "/expert-bisexual" },
  { group: "BISEXUAL", path: "/insights-bisexual" },
  { group: "BISEXUAL", path: "/profile-bisexual" },

  { group: "LESBIAN", path: "/app-lesbian" },
  { group: "LESBIAN", path: "/discover-lesbian" },
  { group: "LESBIAN", path: "/matches-lesbian" },
  { group: "LESBIAN", path: "/conversations-lesbian" },
  { group: "LESBIAN", path: "/map-lesbian" },
  { group: "LESBIAN", path: "/expert-lesbian" },
  { group: "LESBIAN", path: "/insights-lesbian" },
  { group: "LESBIAN", path: "/profile-lesbian" },

  { group: "TRANS/NONBINARY", path: "/app-trans-nonbinary" },
  { group: "TRANS/NONBINARY", path: "/discover-trans-nonbinary" },
  { group: "TRANS/NONBINARY", path: "/matches-trans-nonbinary" },
  { group: "TRANS/NONBINARY", path: "/conversations-trans-nonbinary" },
  { group: "TRANS/NONBINARY", path: "/map-trans-nonbinary" },
  { group: "TRANS/NONBINARY", path: "/expert-trans-nonbinary" },
  { group: "TRANS/NONBINARY", path: "/insights-trans-nonbinary" },
  { group: "TRANS/NONBINARY", path: "/profile-trans-nonbinary" },

  { group: "DATING FLOW", path: "/chat/:matchId", dynamic: true, paramName: "matchId", defaultValue: "match_001" },
  { group: "DATING FLOW", path: "/match/:matchId", dynamic: true, paramName: "matchId", defaultValue: "match_001" },
  { group: "DATING FLOW", path: "/book-date/:matchId", dynamic: true, paramName: "matchId", defaultValue: "match_001" },
  { group: "DATING FLOW", path: "/post-date-feedback/:bookingId", dynamic: true, paramName: "bookingId", defaultValue: "booking_001" },
  { group: "DATING FLOW", path: "/private-chat" },
  { group: "DATING FLOW", path: "/date-journey" },
  { group: "DATING FLOW", path: "/interested-in-you" },

  { group: "DATE JOURNEY VARIANTS", path: "/date-journey-gay" },
  { group: "DATE JOURNEY VARIANTS", path: "/interested-in-you-gay" },
  { group: "DATE JOURNEY VARIANTS", path: "/date-journey-straight" },
  { group: "DATE JOURNEY VARIANTS", path: "/interested-in-you-straight" },
  { group: "DATE JOURNEY VARIANTS", path: "/date-journey-bisexual" },
  { group: "DATE JOURNEY VARIANTS", path: "/interested-in-you-bisexual" },
  { group: "DATE JOURNEY VARIANTS", path: "/date-journey-lesbian" },
  { group: "DATE JOURNEY VARIANTS", path: "/interested-in-you-lesbian" },
  { group: "DATE JOURNEY VARIANTS", path: "/date-journey-trans-nonbinary" },
  { group: "DATE JOURNEY VARIANTS", path: "/interested-in-you-trans-nonbinary" },

  { group: "MEMBERSHIP", path: "/membership" },
];

const PAGE_TO_ROUTE: Record<string, string> = {
  Discover: "/discover",
  Matches: "/matches",
  Conversations: "/conversations",
  Chat: "/chat/:matchId",
  Profile: "/profile",
  DateBooking: "/book-date/:matchId",
  PostDateFeedback: "/post-date-feedback/:bookingId",
  MatchDetail: "/match/:matchId",
  Membership: "/membership",
  ExpertChat: "/expert",
  PrivateChat: "/private-chat",
  MapDiscovery: "/map",
  DateJourney: "/date-journey",
  Insights: "/insights",
  InterestedInYou: "/interested-in-you",
  Onboarding: "/onboarding",
  OnboardingEntry: "/onboarding",
  OnboardingStraight: "/onboarding-straight",
  OnboardingBisexual: "/onboarding-bisexual",
  OnboardingLesbian: "/onboarding-lesbian",
  OnboardingTransNonbinary: "/onboarding-trans-nonbinary",
};

const discoverRoutesFromPages = (): DevRouteDef[] => {
  const files = import.meta.glob("/src/pages/*.jsx");
  const discovered = Object.keys(files)
    .map((path) => path.split("/").pop()?.replace(".jsx", "") || "")
    .map((pageName) => PAGE_TO_ROUTE[pageName])
    .filter(Boolean);

  return [...new Set(discovered)]
    .filter((path) => !DEV_ROUTES_MANUAL.some((route) => route.path === path))
    .map((path) => ({
      group: "DISCOVERED" as const,
      path,
      dynamic: path.includes("/:"),
      paramName: path.includes(":bookingId") ? "bookingId" : path.includes(":matchId") ? "matchId" : undefined,
      defaultValue: path.includes(":bookingId") ? "booking_001" : path.includes(":matchId") ? "match_001" : undefined,
    }));
};

export const DEV_ROUTES: DevRouteDef[] = [...DEV_ROUTES_MANUAL, ...discoverRoutesFromPages()];
