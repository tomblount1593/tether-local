import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const onboardingPath = path.join(ROOT, "src/pages/Onboarding.jsx");
const variantPath = path.join(ROOT, "src/pages/OnboardingVariant.jsx");

const mustHaveSections = [
  "Your Type",
  "Romantic Pattern",
  "Intent & Values",
  "Lifestyle & Social Fit",
  "First Impression & Vibe",
];

const allowedTypes = new Set(["single_select", "multi_select", "slider", "slider_set"]);

function fail(message) {
  console.error(message);
  process.exit(1);
}

function parseQuestionTypes(source) {
  const questionBlocks = [...source.matchAll(/\{[^{}]*id:\s*"[^"]+"[^{}]*type:\s*"([^"]+)"[^{}]*(prompt:|q:)[^{}]*\}/g)];
  const matches = questionBlocks.map((m) => m[1]);
  const unique = new Set(matches);
  for (const type of unique) {
    if (!allowedTypes.has(type)) {
      fail(`Unsupported question type found: ${type}`);
    }
  }
}

function assertSectionTitles(source, label) {
  for (const section of mustHaveSections) {
    if (!source.includes(`title: "${section}"`)) {
      fail(`${label}: missing section title "${section}"`);
    }
  }
}

function countQuestionIdsNearSections(source, label) {
  const sectionBlocks = source.split(/title:\s*"(Your Type|Romantic Pattern|Intent & Values|Lifestyle & Social Fit|First Impression & Vibe)"/g);
  if (sectionBlocks.length < 11) {
    fail(`${label}: unable to parse section blocks`);
  }
}

function assertNoPhotoAnswerCards(source, label) {
  const forbidden = [
    "imageUrl",
    "photoUrl",
    "portrait",
    "stock_photo",
    "face_thumbnail",
  ];
  for (const token of forbidden) {
    if (source.includes(token)) {
      fail(`${label}: forbidden photo/person answer token found: ${token}`);
    }
  }
}

const onboarding = fs.readFileSync(onboardingPath, "utf8");
const variant = fs.readFileSync(variantPath, "utf8");

assertSectionTitles(onboarding, "Onboarding gay");
assertSectionTitles(variant, "Onboarding variant");
countQuestionIdsNearSections(onboarding, "Onboarding gay");
countQuestionIdsNearSections(variant, "Onboarding variant");
parseQuestionTypes(onboarding);
parseQuestionTypes(variant);
assertNoPhotoAnswerCards(onboarding, "Onboarding gay");
assertNoPhotoAnswerCards(variant, "Onboarding variant");

if (!onboarding.includes("Takes about 5–7 minutes")) fail("Onboarding gay: missing 5–7 minutes timing copy");
if (!variant.includes("Takes about 5–7 minutes")) fail("Onboarding variant: missing 5–7 minutes timing copy");

console.log("qa-assessment-schema: pass");
