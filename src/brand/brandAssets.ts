import standardLogo from "@/assets/brand/logos/standard-logo.png";
import standardName from "@/assets/brand/logos/standard-name.png";
import premiumLogo from "@/assets/brand/logos/premium-logo.png";
import premiumName from "@/assets/brand/logos/premium-name.png";
import conciergeLogo from "@/assets/brand/logos/concierge-logo.png";
import conciergeName from "@/assets/brand/logos/concierge-name.png";
import paletteReference from "@/assets/brand/reference/Overall-Colour-Palette-and-Style.jpg";

export const brandAssets = {
  standard: {
    logo: standardLogo,
    wordmark: standardName,
  },
  premium: {
    logo: premiumLogo,
    wordmark: premiumName,
  },
  concierge: {
    logo: conciergeLogo,
    wordmark: conciergeName,
  },
  references: {
    palette: paletteReference,
  },
} as const;
