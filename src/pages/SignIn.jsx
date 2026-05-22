import { ArrowLeft } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTier } from "@/hooks/useTier";
import { getMembershipTheme } from "@/brand/membershipTheme";
import DevPill from "@/components/dev/DevPill";
import { shouldEnableDevTools } from "@/components/dev/devToolsVisibility";
import { toast } from "sonner";
import { useEffect } from "react";
import { getAppRoute } from "@/lib/matchFlowRoutes";

function getIntroColors(tier) {
  if (tier === "premium") {
    return {
      background: "#5b655d",
      primaryText: "#f8f3f1",
      secondaryText: "rgba(248,243,241,0.78)",
      divider: "rgba(248,243,241,0.18)",
      inputBg: "rgba(55, 66, 58, 0.42)",
      inputBorder: "rgba(248, 243, 241, 0.16)",
      inputText: "#f8f3f1",
      placeholder: "rgba(248, 243, 241, 0.68)",
      focusBorder: "rgba(248, 243, 241, 0.54)",
      focusRing: "rgba(248, 243, 241, 0.12)",
      buttonBackground: "#37423a",
      buttonText: "#f8f3f1",
      buttonBorder: "rgba(248, 243, 241, 0.10)",
      forgotText: "rgba(248, 243, 241, 0.74)",
    };
  }
  if (tier === "concierge") {
    return {
      background: "#0a0d0a",
      primaryText: "#d8c6ae",
      secondaryText: "rgba(216,198,174,0.74)",
      divider: "rgba(216,198,174,0.22)",
      inputBg: "#232623",
      inputBorder: "rgba(216, 198, 174, 0.20)",
      inputText: "#d8c6ae",
      placeholder: "rgba(216, 198, 174, 0.56)",
      focusBorder: "rgba(216, 198, 174, 0.52)",
      focusRing: "rgba(216, 198, 174, 0.12)",
      buttonBackground: "#d8c6ae",
      buttonText: "#0a0d0a",
      buttonBorder: "rgba(216, 198, 174, 0.20)",
      forgotText: "rgba(216, 198, 174, 0.74)",
    };
  }
  return {
    background: "#f8f3f1",
    primaryText: "#37423a",
    secondaryText: "rgba(55,66,58,0.72)",
    divider: "rgba(55,66,58,0.16)",
    inputBg: "#d4d2cd",
    inputBorder: "rgba(55, 66, 58, 0.18)",
    inputText: "#37423a",
    placeholder: "rgba(55, 66, 58, 0.58)",
    focusBorder: "rgba(55, 66, 58, 0.48)",
    focusRing: "rgba(55, 66, 58, 0.12)",
    buttonBackground: "#37423a",
    buttonText: "#f8f3f1",
    buttonBorder: "rgba(55, 66, 58, 0.08)",
    forgotText: "rgba(55, 66, 58, 0.68)",
  };
}

export default function SignIn() {
  const navigate = useNavigate();
  const location = useLocation();
  const { tier, setTier } = useTier();
  useEffect(() => {
    if (location.pathname === "/sign-in-premium") setTier("premium");
    if (location.pathname === "/sign-in-concierge") setTier("concierge");
    if (location.pathname === "/sign-in-standard") setTier("standard");
  }, [location.pathname, setTier]);
  const membershipTheme = getMembershipTheme(tier);
  const colors = getIntroColors(tier);
  const showDevButton = shouldEnableDevTools(location.pathname);
  const getLandingRouteForMembership = () => {
    if (location.pathname === "/sign-in-premium" || tier === "premium") return "/landing-premium";
    if (location.pathname === "/sign-in-concierge" || tier === "concierge") return "/landing-concierge";
    return "/landing-standard";
  };

  return (
    <div
      className="signin-screen"
      style={{
        background: colors.background,
        color: colors.primaryText,
        ["--theme-primary"]: colors.primaryText,
        ["--theme-secondary"]: colors.secondaryText,
        ["--theme-divider"]: colors.divider,
        ["--theme-button"]: colors.buttonBackground,
        ["--theme-buttonText"]: colors.buttonText,
        ["--signin-input-bg"]: colors.inputBg,
        ["--signin-input-border"]: colors.inputBorder,
        ["--signin-input-text"]: colors.inputText,
        ["--signin-placeholder"]: colors.placeholder,
        ["--signin-input-focus-border"]: colors.focusBorder,
        ["--signin-input-focus-ring"]: colors.focusRing,
        ["--signin-button-bg"]: colors.buttonBackground,
        ["--signin-button-text"]: colors.buttonText,
        ["--signin-button-border"]: colors.buttonBorder,
        ["--signin-forgot-text"]: colors.forgotText,
      }}
    >
      <div className="signin-top-row">
        <button type="button" className="signin-back-button flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors" onClick={() => navigate(getLandingRouteForMembership())}>
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <div />
        <div className="signin-dev-slot">
          {showDevButton ? <DevPill tier={tier} onClick={() => window.dispatchEvent(new Event("tether-dev-toggle"))} /> : null}
        </div>
      </div>

      <div className="signin-content">
        <div
          className="signin-stack intro-stack"
          style={{
            ["--space-icon-wordmark"]: "clamp(28px, 3.7vh, 44px)",
            ["--space-wordmark-hero"]: "clamp(28px, 4vh, 46px)",
            ["--gap-hero-divider"]: "clamp(28px, 3.8vh, 42px)",
            ["--gap-divider-body"]: "var(--gap-hero-divider)",
          }}
        >
          <div className="signin-brand-block intro-brand-zone">
            <img src={membershipTheme.logo} alt={`${tier} Tether logo`} className="logo-icon signin-logo" />
            <img src={membershipTheme.wordmark} alt={`${tier} Tether`} className="tether-wordmark signin-wordmark" />
            <h1 className="hero-copy signin-hero">
              Stop drifting.
              <br />
              Start something real.
            </h1>
            <div className="intro-divider signin-divider" />
          </div>

          <div className="signin-form w-full flex flex-col items-center">
          <input className="signin-input" placeholder="Username" aria-label="Username" />
          <input type="password" className="signin-input signin-password-field" placeholder="Password" aria-label="Password" />
          <button
            type="button"
            className="signin-submit-button"
            onClick={() => navigate(getAppRoute("", localStorage.getItem("tether_orientation") || "gay"))}
          >
            Sign In
          </button>
          <button type="button" className="forgot-password-link" onClick={() => toast("Password recovery is not available in this demo.")}>Forgot Password</button>
          </div>
        </div>
      </div>
    </div>
  );
}
