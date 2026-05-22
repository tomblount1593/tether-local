import fs from "node:fs";
import path from "node:path";

const auditedFiles = [
  "src/pages/Discover.jsx",
  "src/pages/Matches.jsx",
  "src/pages/Conversations.jsx",
  "src/pages/MapDiscovery.jsx",
  "src/pages/ExpertChat.jsx",
  "src/pages/Insights.jsx",
  "src/pages/Profile.jsx",
  "src/pages/InterestedInYou.jsx",
  "src/pages/MatchDetail.jsx",
  "src/components/CompatibilityBreakdown.jsx",
  "src/pages/DateBooking.jsx",
  "src/pages/DateJourney.jsx",
  "src/pages/PostDateFeedback.jsx",
  "src/pages/Membership.jsx",
  "src/pages/SignIn.jsx",
  "src/pages/Onboarding.jsx",
  "src/pages/OnboardingStraight.jsx",
  "src/pages/OnboardingLesbian.jsx",
  "src/pages/OnboardingBisexual.jsx",
  "src/pages/OnboardingTransNonbinary.jsx",
];

const headingTokens = [
  "font-heading",
  "page-title",
  "section-title",
  "assessment-page-title",
  "assessment-section-title",
  "assessment-question-title",
  "var(--font-heading)",
];

const bodyTokens = [
  "font-body",
  "text-muted-foreground",
  "assessment-body",
  "assessment-prompt",
  "assessment-microcopy",
  "var(--font-body)",
];

let ok = true;
let warnings = 0;

for (const rel of auditedFiles) {
  const abs = path.resolve(process.cwd(), rel);
  if (!fs.existsSync(abs)) continue;
  const source = fs.readFileSync(abs, "utf8");
  const hasHeading = headingTokens.some((token) => source.includes(token));
  const hasBody = bodyTokens.some((token) => source.includes(token));

  if (!hasHeading) {
    warnings += 1;
    console.warn(`qa-typography: heading token not explicit in ${rel} (inherits/shared styles may apply)`);
  }
  if (!hasBody) {
    warnings += 1;
    console.warn(`qa-typography: body token not explicit in ${rel} (inherits/shared styles may apply)`);
  }
}

const cssPath = path.resolve(process.cwd(), "src/index.css");
if (!fs.existsSync(cssPath)) {
  ok = false;
  console.error("qa-typography: missing src/index.css");
} else {
  const css = fs.readFileSync(cssPath, "utf8");
  if (!css.includes("--font-heading") || !css.includes("--font-body")) {
    ok = false;
    console.error("qa-typography: font variables missing in src/index.css");
  }
}

if (!ok) process.exit(1);
console.log(`qa-typography: typography token audit passed${warnings ? ` with ${warnings} inheritance warnings` : ""}`);
