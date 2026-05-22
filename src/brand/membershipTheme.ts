import { brandAssets } from "@/brand/brandAssets";

export type MembershipType = "standard" | "premium" | "concierge";

export type MembershipTheme = {
  background: string;
  surface: string;
  primaryText: string;
  secondaryText: string;
  accent: string;
  buttonBackground: string;
  buttonText: string;
  logo: string;
  wordmark: string;
};

const THEMES: Record<MembershipType, MembershipTheme> = {
  standard: {
    background: "#f8f3f1",
    surface: "#f8f3f1",
    primaryText: "#37423a",
    secondaryText: "#6c756d",
    accent: "#d4d2cd",
    buttonBackground: "#37423a",
    buttonText: "#f8f3f1",
    logo: brandAssets.standard.logo,
    wordmark: brandAssets.standard.wordmark,
  },
  premium: {
    background: "#5b655d",
    surface: "#37423a",
    primaryText: "#f8f3f1",
    secondaryText: "#d4d2cd",
    accent: "#d8c6ae",
    buttonBackground: "#37423a",
    buttonText: "#f8f3f1",
    logo: brandAssets.premium.logo,
    wordmark: brandAssets.premium.wordmark,
  },
  concierge: {
    background: "#242623",
    surface: "#242623",
    primaryText: "#d2c6b2",
    secondaryText: "rgba(210,198,178,0.78)",
    accent: "#d2c6b2",
    buttonBackground: "#d2c6b2",
    buttonText: "#242623",
    logo: brandAssets.concierge.logo,
    wordmark: brandAssets.concierge.wordmark,
  },
};

export function getMembershipTheme(type: MembershipType = "standard"): MembershipTheme {
  return THEMES[type] || THEMES.standard;
}
