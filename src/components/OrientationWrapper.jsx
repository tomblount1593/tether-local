import { useEffect } from "react";
import { buildDemoContextForVariantSlug } from "@/data/demo/demoVariantRoutes";

/**
 * Seed direct demo-route state so variant URLs render the intended scenario
 * immediately without touching the real onboarding assignment flow.
 */
export default function OrientationWrapper({ orientation, variant, children }) {
  useEffect(() => {
    const storedTier = localStorage.getItem("tether_tier") || "standard";
    localStorage.setItem("tether_orientation", variant || orientation);

    if (!variant) return;

    const nextContext = buildDemoContextForVariantSlug(variant, {
      membershipTier: storedTier,
    });

    localStorage.setItem("tether_user_gender", nextContext.genderIdentity || "male");
    localStorage.setItem("tether_user_sexual_preference", nextContext.sexualPreference || orientation || "straight");
    localStorage.setItem("tether_user_looking_for", nextContext.lookingFor || "open_to_all");
    localStorage.setItem("tetherDemoUserContext", JSON.stringify(nextContext));
  }, [orientation, variant]);

  return children;
}
