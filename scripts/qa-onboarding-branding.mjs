import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const files = [
  "src/pages/Onboarding.jsx",
  "src/pages/OnboardingVariant.jsx",
  "src/index.css",
];

function fail(message) {
  console.error(message);
  process.exit(1);
}

const contents = Object.fromEntries(
  files.map((file) => [file, fs.readFileSync(path.join(ROOT, file), "utf8")]),
);

for (const [file, text] of Object.entries(contents)) {
  if (/\bApto\b|\bapto\b|\bAptoLogo\b|\boldLogo\b|\blegacyLogo\b/.test(text)) {
    fail(`${file}: forbidden legacy branding reference found`);
  }
}

const css = contents["src/index.css"];
const jsx = `${contents["src/pages/Onboarding.jsx"]}\n${contents["src/pages/OnboardingVariant.jsx"]}`;

const requiredCssClasses = [
  ".onboarding-page-title",
  ".onboarding-subtitle",
  ".assessment-page-title",
  ".assessment-section-title",
  ".assessment-question-title",
  ".assessment-question-prompt-heading",
  ".assessment-option-card",
  ".assessment-option-list--dense",
  ".assessment-validation-message",
];
for (const klass of requiredCssClasses) {
  if (!css.includes(klass)) fail(`Missing class definition: ${klass}`);
}

const requiredCssTokens = [
  "--font-heading",
  "--font-body",
  "--assessment-page-title-size",
  "--assessment-question-prompt-heading-size",
  "--assessment-option-title-size",
  "--assessment-bg: #0a0d0a",
  "--assessment-bg: #5b655d",
  "--assessment-bg: #f8f3f1",
];
for (const token of requiredCssTokens) {
  if (!css.includes(token)) fail(`Missing required token/value: ${token}`);
}

const requiredJsxUsage = [
  "onboarding-page-title",
  "assessment-page-title",
  "assessment-section-title",
  "assessment-question-title",
  "assessment-question-prompt-heading",
  "assessment-option-card",
  "assessment-validation-message",
  "data-testid=\"assessment-logo\"",
  "data-testid=\"assessment-question-title\"",
  "data-testid=\"assessment-question-prompt\"",
  "data-testid=\"assessment-option-card\"",
];
for (const ref of requiredJsxUsage) {
  if (!jsx.includes(ref)) fail(`Missing JSX usage: ${ref}`);
}

if (/style=\{\{[^}]*fontFamily/i.test(jsx)) fail("Inline fontFamily found in onboarding/assessment JSX");
if (/style=\{\{[^}]*fontSize/i.test(jsx)) fail("Inline fontSize found in onboarding/assessment JSX");

if (!jsx.includes("membershipTheme.logo")) fail("Missing Tether logo usage");

console.log("qa-onboarding-branding: pass");
