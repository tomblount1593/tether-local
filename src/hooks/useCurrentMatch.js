import { useMemo } from "react";
import { useCurrentDemoMatches } from "@/hooks/useCurrentDemoMatches";

export function useCurrentMatch(matchId, audienceKey = "match-detail") {
  const { context, matches } = useCurrentDemoMatches(audienceKey);
  const resolved = useMemo(() => {
    if (!matches?.length) return { match: null, index: -1, isFallback: false };
    const idx = matches.findIndex((m) => String(m.id) === String(matchId));
    if (idx >= 0) return { match: matches[idx], index: idx, isFallback: false };
    return { match: matches[0], index: 0, isFallback: Boolean(matchId) };
  }, [matches, matchId]);

  return {
    context,
    matches: matches || [],
    match: resolved.match,
    activeMatchIndex: resolved.index,
    isFallback: resolved.isFallback,
  };
}

