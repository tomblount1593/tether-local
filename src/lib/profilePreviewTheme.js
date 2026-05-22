export function getProfilePreviewTheme(tier) {
  if (tier === "concierge") {
    return {
      headerBg: "#d0c7b4",
      headerText: "#0b0c0a",
      summaryBg: "#0b0c0a",
      summaryText: "#d0c7b4",
      sectionHeaderBg: "#d0c7b4",
      sectionHeaderText: "#0b0c0a",
      sectionBodyBg: "#0b0c0a",
      sectionBodyText: "#d0c7b4",
      symbol: "#d0c7b4",
    };
  }

  if (tier === "premium") {
    return {
      headerBg: "#37423a",
      headerText: "#f8f3f1",
      summaryBg: "#5b655d",
      summaryText: "rgba(248, 243, 241, 0.84)",
      sectionHeaderBg: "#737973",
      sectionHeaderText: "#f8f3f1",
      sectionBodyBg: "#5b655d",
      sectionBodyText: "rgba(248, 243, 241, 0.84)",
      symbol: "#f8f3f1",
    };
  }

  return {
    headerBg: "#37423a",
    headerText: "#f8f3f1",
    summaryBg: "#f8f3f1",
    summaryText: "#37423a",
    sectionHeaderBg: "#37423a",
    sectionHeaderText: "#f8f3f1",
    sectionBodyBg: "#f8f3f1",
    sectionBodyText: "#37423a",
    symbol: "#37423a",
  };
}
