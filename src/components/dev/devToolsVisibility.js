const ONBOARDING_ROUTE_PATTERN = /\/onboarding(?:[-/]|$)/i;

export function shouldEnableDevTools(pathname = "") {
  return Boolean(import.meta.env.DEV || ONBOARDING_ROUTE_PATTERN.test(pathname));
}
