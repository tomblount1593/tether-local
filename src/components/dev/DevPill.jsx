export default function DevPill({ tier = "standard", className = "", style, onClick }) {
  const theme =
    tier === "concierge"
      ? {
          bg: "rgba(216, 198, 174, 0.12)",
          bgHover: "rgba(216, 198, 174, 0.20)",
          text: "#d8c6ae",
          border: "rgba(216, 198, 174, 0.30)",
        }
      : tier === "premium"
        ? {
            bg: "rgba(248, 243, 241, 0.14)",
            bgHover: "rgba(248, 243, 241, 0.22)",
            text: "#f8f3f1",
            border: "rgba(248, 243, 241, 0.28)",
          }
        : {
            bg: "rgba(55, 66, 58, 0.12)",
            bgHover: "rgba(55, 66, 58, 0.18)",
            text: "#37423a",
            border: "rgba(55, 66, 58, 0.22)",
          };

  return (
    <button
      type="button"
      onClick={onClick}
      className={`dev-pages-pill ${className}`.trim()}
      style={{
        ["--dev-pill-bg"]: theme.bg,
        ["--dev-pill-bg-hover"]: theme.bgHover,
        ["--dev-pill-text"]: theme.text,
        ["--dev-pill-border"]: theme.border,
        ...style,
      }}
      aria-label="Open Developer Pages"
    >
      DEV
    </button>
  );
}
