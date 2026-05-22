import { useState } from "react";
import { useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import CompatibilityBreakdown from "@/components/CompatibilityBreakdown";
import { useCurrentMatch } from "@/hooks/useCurrentMatch";
import { getBookDateRoute, getMatchesRouteWithTab } from "@/lib/matchFlowRoutes";

export default function MatchDetail() {
  const { matchId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { match } = useCurrentMatch(matchId, "match-detail");
  const [showBreakdown, setShowBreakdown] = useState(false);
  const fromMatchesTab = location.state?.fromMatchesTab;
  const fromMatchesIndex = Number(location.state?.fromMatchesIndex);
  const shouldShowMatchesReturnBanner = ["new", "pending", "next"].includes(fromMatchesTab) && Number.isFinite(fromMatchesIndex) && fromMatchesIndex > 0;
  if (!match) {
    return (
      <div className="max-w-lg mx-auto min-h-screen bg-background px-4 py-6">
        <button onClick={() => navigate(-1)} className="text-muted-foreground mb-4 inline-flex items-center gap-2">
          <ArrowLeft className="w-5 h-5" /> Back
        </button>
        <p className="font-body text-sm text-muted-foreground">This potential profile is unavailable right now.</p>
      </div>
    );
  }
  const isPotentialFromMap = searchParams.get("source") === "map" || searchParams.get("mode") === "potential";

  if (isPotentialFromMap) {
    return (
      <CompatibilityBreakdown
        matchId={match.id}
        matchData={match}
        onBack={() => navigate(-1)}
        showCompatibility={false}
        headerTitle="Profile"
        secondaryActionLabel="Pass"
        onSecondaryAction={() => navigate(-1)}
        primaryActionLabel="Interested"
        onPrimaryAction={() => navigate(-1)}
      />
    );
  }

  return (
    <>
      <CompatibilityBreakdown
        matchId={match.id}
        matchData={match}
        onBack={() => {
          if (["new", "pending", "next"].includes(fromMatchesTab)) {
            navigate(getMatchesRouteWithTab(location.pathname, fromMatchesTab === "new" ? "" : fromMatchesTab), {
              state: {
                scrollToMatchId: match.id,
                showViewAllMatchesBanner: shouldShowMatchesReturnBanner,
                fromMatchesIndex,
                fromMatchesTab,
              },
            });
            return;
          }
          navigate(-1);
        }}
        showCompatibility={false}
        showProfileMatchNotice={false}
        headerTitle="Match Profile"
        secondaryActionLabel="View Compatibility Breakdown"
        onSecondaryAction={() => setShowBreakdown(true)}
        primaryActionLabel="Book a Date"
        onPrimaryAction={() => navigate(getBookDateRoute(location.pathname, match.id))}
      />

      {showBreakdown ? (
        <CompatibilityBreakdown
          matchId={match.id}
          matchData={match}
          onBack={() => setShowBreakdown(false)}
          onBookDate={() => navigate(getBookDateRoute(location.pathname, match.id))}
          onViewProfile={() => setShowBreakdown(false)}
          />
      ) : null}
    </>
  );
}
