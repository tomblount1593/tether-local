import { getMembershipTheme } from "@/brand/membershipTheme";

function getIntroColors(tier) {
  if (tier === "premium") {
    return {
      background: "#5b655d",
      primaryText: "#f8f3f1",
      secondaryText: "rgba(248,243,241,0.82)",
      divider: "rgba(248,243,241,0.18)",
      buttonBackground: "#37423a",
      buttonText: "#f8f3f1",
    };
  }
  if (tier === "concierge") {
    return {
      background: "#0a0d0a",
      primaryText: "#d8c6ae",
      secondaryText: "rgba(216,198,174,0.82)",
      divider: "rgba(216,198,174,0.22)",
      buttonBackground: "#232623",
      buttonText: "#d8c6ae",
    };
  }
  return {
    background: "#f8f3f1",
    primaryText: "#37423a",
    secondaryText: "rgba(55,66,58,0.72)",
    divider: "rgba(55,66,58,0.16)",
    buttonBackground: "#37423a",
    buttonText: "#f8f3f1",
  };
}

export default function TetherIntroLayout({ tier = "standard", onStart, onSignIn, startLabel = "Start with Tether" }) {
  const membershipTheme = getMembershipTheme(tier);
  const colors = getIntroColors(tier);

  return (
    <div
      className="intro-screen"
      style={{
        background: colors.background,
        color: colors.primaryText,
        ["--theme-primary"]: colors.primaryText,
        ["--theme-secondary"]: colors.secondaryText,
        ["--theme-divider"]: colors.divider,
        ["--theme-button"]: colors.buttonBackground,
        ["--theme-buttonText"]: colors.buttonText,
      }}
    >
      <div
        className="intro-stack"
        style={{
          ["--space-icon-wordmark"]: "clamp(30px, 3.9vh, 42px)",
          ["--space-wordmark-hero"]: "clamp(34px, 4.3vh, 50px)",
          ["--gap-hero-divider"]: "clamp(34px, 4.6vh, 50px)",
          ["--gap-divider-body"]: "clamp(32px, 4.1vh, 42px)",
          ["--gap-body-emphasis"]: "clamp(26px, 3.6vh, 34px)",
          ["--gap-emphasis-cta"]: "clamp(28px, 4vh, 38px)",
          ["--gap-cta-signin"]: "clamp(24px, 3vh, 30px)",
        }}
      >
        <section className="intro-brand-zone">
          <img
            src={membershipTheme.logo}
            alt={`${tier} Tether logo`}
            className="logo-icon"
          />
          <img
            src={membershipTheme.wordmark}
            alt={`${tier} Tether`}
            className="tether-wordmark"
          />

          <h1 className="hero-copy">
            Stop drifting.
            <br />
            Start something real.
          </h1>
        </section>

        <section className="intro-explanation-zone">
          <div className="intro-divider" />
          <div className="body-copy">
            <p>We don't just match you.</p>
            <p className="body-copy-follow">
              We learn what works —
              <br />
              and introduce you to people
              <br />
              you'll actually want to meet.
            </p>
          </div>

          <p className="emphasis-line">
            Every date makes your matches better.
          </p>
        </section>

        <section className="intro-action-zone">
          <button
            type="button"
            onClick={onStart}
            className="primary-cta"
          >
            {startLabel}
          </button>

            <button
            type="button"
            onClick={onSignIn}
            className="sign-in-link"
          >
            Sign In
          </button>
        </section>
      </div>
    </div>
  );
}
