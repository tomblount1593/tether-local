import { useNavigate } from "react-router-dom";
import { useTier } from "@/hooks/useTier";
import TetherIntroLayout from "@/components/TetherIntroLayout";
import { useEffect } from "react";

const getSignInRouteForTier = (tier) => {
  if (tier === "premium") return "/sign-in-premium";
  if (tier === "concierge") return "/sign-in-concierge";
  return "/sign-in-standard";
};

export default function LandingPage({ forcedTier }) {
  const navigate = useNavigate();
  const { tier, setTier } = useTier();
  const activeTier = forcedTier || tier;

  useEffect(() => {
    if (forcedTier) setTier(forcedTier);
  }, [forcedTier, setTier]);

  return (
    <TetherIntroLayout
      tier={activeTier}
      onStart={() => navigate("/onboarding")}
      onSignIn={() => navigate(getSignInRouteForTier(activeTier))}
      startLabel="Start with Tether"
    />
  );
}
