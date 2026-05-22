import { useMemo } from "react";
import { useDemoUserContext } from "@/hooks/useDemoUserContext";
import { getCurrentDemoMatches } from "@/data/demo/demoMatchProfiles";

export function useCurrentDemoMatches(audienceKey = "discover") {
  const { context, setContext } = useDemoUserContext();
  const matches = useMemo(() => getCurrentDemoMatches(context, audienceKey), [context, audienceKey]);
  return {
    context: /** @type {any} */ (context),
    setContext,
    matches,
  };
}
