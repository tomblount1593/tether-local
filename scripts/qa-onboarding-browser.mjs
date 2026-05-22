import { chromium } from "playwright";

const baseUrl = process.env.QA_BASE_URL || "http://localhost:5173";
const routes = [
  "/onboarding",
  "/onboarding-straight",
  "/onboarding-gay",
  "/onboarding-lesbian",
  "/onboarding-bisexual",
  "/onboarding-trans-nonbinary",
];

const tierContext = [
  { tier: "standard", bg: "rgb(248, 243, 241)" },
  { tier: "premium", bg: "rgb(91, 101, 93)" },
  { tier: "concierge", bg: "rgb(10, 13, 10)" },
];

function fail(message) {
  console.error(message);
  process.exit(1);
}

function includesSerif(font) {
  const f = String(font || "").toLowerCase();
  return f.includes("tethersavoybold") || f.includes("georgia") || f.includes("times new roman");
}

function includesBody(font) {
  const f = String(font || "").toLowerCase();
  return f.includes("montserrat") || f.includes("arial") || f.includes("sans-serif") || f.includes("system-ui");
}

function parseRgb(text) {
  const m = String(text).match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/i);
  if (!m) return null;
  return [Number(m[1]), Number(m[2]), Number(m[3])];
}

function colorsClose(actual, expected, tolerance = 3) {
  const a = parseRgb(actual);
  const e = parseRgb(expected);
  if (!a || !e) return false;
  return Math.abs(a[0] - e[0]) <= tolerance
    && Math.abs(a[1] - e[1]) <= tolerance
    && Math.abs(a[2] - e[2]) <= tolerance;
}

function extractQuestionNumber(text) {
  const match = String(text || "").match(/Question\s+(\d+)\s+of\s+\d+/i);
  return match ? Number(match[1]) : null;
}

async function goToCompatIntro(page) {
  const start = page.getByRole("button", { name: /start with tether/i });
  if (await start.count()) await start.click();

  await page.getByPlaceholder(/your first name/i).fill("Tom");
  await page.getByPlaceholder("DD").fill("12");
  await page.getByPlaceholder("MM").fill("08");
  await page.getByPlaceholder("YYYY").fill("1992");
  await page.getByRole("button", { name: "Male" }).first().click();
  await page.getByRole("button", { name: /choose city|london/i }).first().click();
  const londonButton = page.locator("#city-availability-panel button").first();
  if (!(await londonButton.count())) {
    throw new Error("London selection button not found in city panel");
  }
  await londonButton.click();
  await page.getByRole("button", { name: /continue/i }).first().click();

  for (let i = 0; i < 4; i += 1) {
    await page.getByRole("button", { name: /^continue/i }).first().click();
  }

  await page.getByTestId("assessment-intro-screen").waitFor({ timeout: 30000 });
}

const browser = await chromium.launch({ headless: true });
let checked = 0;

try {
  for (const route of routes) {
    for (const ctx of tierContext) {
      const page = await browser.newPage({ viewport: { width: 430, height: 932 } });
      await page.goto(`${baseUrl}/discover`, { waitUntil: "domcontentloaded" });
      await page.evaluate(({ tier }) => {
        localStorage.setItem("tether_tier", tier);
        const current = JSON.parse(localStorage.getItem("tetherDemoUserContext") || "{}");
        localStorage.setItem("tetherDemoUserContext", JSON.stringify({ ...current, membershipTier: tier }));
      }, ctx);

      await page.goto(`${baseUrl}${route}`, { waitUntil: "networkidle" });
      const body = (await page.textContent("body")) || "";
      if (!body.trim()) fail(`Blank body on ${route} (${ctx.tier})`);
      if (/\bNaN\b|\bundefined\b|\bnull\b/.test(body)) fail(`Invalid text on ${route} (${ctx.tier})`);
      if (/\bApto\b/i.test(body)) fail(`Apto text visible on ${route} (${ctx.tier})`);

      await goToCompatIntro(page);

      const pageTitle = page.locator("[data-testid='assessment-page-title']:visible").first();
      const introLogo = page.getByTestId("assessment-logo").first();
      if (!(await introLogo.count())) fail(`Missing intro logo on ${route} (${ctx.tier})`);
      const pageFont = await pageTitle.evaluate((el) => getComputedStyle(el).fontFamily);
      if (!includesSerif(pageFont)) fail(`Page title font wrong on ${route} (${ctx.tier}): ${pageFont}`);

      await page.getByRole("button", { name: /^continue/i }).first().click();
      await page.getByTestId("assessment-section-intro-screen").waitFor({ timeout: 30000 });

      const rootBg = await page.locator(".min-h-screen").first().evaluate((el) => getComputedStyle(el).backgroundColor);
      if (!colorsClose(rootBg, ctx.bg)) fail(`Wrong background for ${route} (${ctx.tier}): ${rootBg} != ${ctx.bg}`);
      const sectionTitle = page.locator("[data-testid='assessment-section-title']:visible").first();
      const sectionFont = await sectionTitle.evaluate((el) => getComputedStyle(el).fontFamily);
      if (!includesSerif(sectionFont)) fail(`Section title font wrong on ${route} (${ctx.tier}): ${sectionFont}`);

      await page.getByRole("button", { name: /^begin/i }).first().click();
      let questionReady = false;
      try {
        await page.getByTestId("assessment-question-panel").first().waitFor({ timeout: 12000 });
        questionReady = true;
      } catch {
        try {
          await page.getByTestId("assessment-question-screen").first().waitFor({ timeout: 12000 });
          questionReady = true;
        } catch {
          const bodySnapshot = ((await page.textContent("body")) || "").slice(0, 320).replace(/\s+/g, " ");
          fail(`Could not enter question screen on ${route} (${ctx.tier}). Snapshot: ${bodySnapshot}`);
        }
      }
      if (!questionReady) fail(`Could not enter question screen on ${route} (${ctx.tier})`);

      if (!(await page.getByTestId("assessment-slider-left-label").count())) fail(`Missing slider left label on ${route} (${ctx.tier})`);
      if (!(await page.getByTestId("assessment-slider-right-label").count())) fail(`Missing slider right label on ${route} (${ctx.tier})`);

      let optionCount = 0;
      const selectableOptions = page.locator("button[data-testid='assessment-option-card']");
      const allOptionCards = page.getByTestId("assessment-option-card");
      for (let step = 0; step < 6; step += 1) {
        optionCount = await allOptionCards.count();
        if (optionCount > 0) break;
        const sliderThumbs = page.locator("[role='slider']");
        const sliderCount = await sliderThumbs.count();
        if (sliderCount > 0) {
          for (let i = 0; i < sliderCount; i += 1) {
            const thumb = sliderThumbs.nth(i);
            await thumb.focus();
            await thumb.press("ArrowRight");
          }
        }
        await page.getByTestId("assessment-continue").click();
        await page.waitForTimeout(260);
      }
      if (optionCount === 0) fail(`Could not reach option-card question on ${route} (${ctx.tier})`);

      const questionTitle = page.locator("[data-testid='assessment-question-title']:visible").first();
      const questionPrompt = page.locator("[data-testid='assessment-question-prompt']:visible").first();
      const optionCard = allOptionCards.first();
      const qTitleFont = await questionTitle.evaluate((el) => getComputedStyle(el).fontFamily);
      const qPromptFont = await questionPrompt.evaluate((el) => getComputedStyle(el).fontFamily);
      const optionFont = await optionCard.evaluate((el) => getComputedStyle(el).fontFamily);

      if (!includesSerif(qTitleFont)) fail(`Question title font wrong on ${route} (${ctx.tier}): ${qTitleFont}`);
      if (!includesSerif(qPromptFont)) fail(`Question prompt font wrong on ${route} (${ctx.tier}): ${qPromptFont}`);
      if (!includesBody(optionFont)) fail(`Option font wrong on ${route} (${ctx.tier}): ${optionFont}`);

      const qTitleSize = await questionTitle.evaluate((el) => Number.parseFloat(getComputedStyle(el).fontSize));
      const qPromptSize = await questionPrompt.evaluate((el) => Number.parseFloat(getComputedStyle(el).fontSize));
      const optionSize = await optionCard.evaluate((el) => Number.parseFloat(getComputedStyle(el).fontSize));
      const optionHeight = await optionCard.evaluate((el) => Number.parseFloat(getComputedStyle(el).height));
      if (!(qTitleSize > optionSize)) fail(`Question title size not larger than option on ${route} (${ctx.tier})`);
      if (!(qPromptSize > optionSize)) fail(`Question prompt size not larger than option on ${route} (${ctx.tier})`);
      if (optionHeight > 72) fail(`Option card too tall on ${route} (${ctx.tier}): ${optionHeight}px`);

      const questionScreenBefore = (await page.locator("[data-testid='assessment-question-panel']:visible").first().textContent()) || "";
      const promptBefore = ((await page.locator("[data-testid='assessment-question-prompt']:visible").first().textContent()) || "").trim();
      const questionNumberBefore = extractQuestionNumber(questionScreenBefore);
      await page.getByTestId("assessment-continue").click();
      await page.waitForTimeout(120);
      const validationShown = await page.getByTestId("assessment-validation-message").count();

      if (await selectableOptions.count()) {
        await selectableOptions.first().click();
      } else if (await page.getByTestId("assessment-slider").count()) {
        const sliderThumbs = page.locator("[role='slider']");
        const sliderCount = await sliderThumbs.count();
        for (let i = 0; i < sliderCount; i += 1) {
          const thumb = sliderThumbs.nth(i);
          await thumb.focus();
          await thumb.press("ArrowRight");
        }
      } else {
        fail(`No interactive control found on question screen for ${route} (${ctx.tier})`);
      }
      await page.getByTestId("assessment-continue").click();
      await page.waitForTimeout(260);
      const questionScreenAfter = (await page.locator("[data-testid='assessment-question-panel']:visible").first().textContent()) || "";
      const promptAfter = ((await page.locator("[data-testid='assessment-question-prompt']:visible").first().textContent()) || "").trim();
      const questionNumberAfter = extractQuestionNumber(questionScreenAfter);
      const didAdvance = promptAfter !== promptBefore || (
        questionNumberBefore !== null
        && questionNumberAfter !== null
        && questionNumberAfter > questionNumberBefore
      );
      if (!didAdvance) fail(`Continue navigation failed on ${route} (${ctx.tier})`);

      await page.getByTestId("assessment-back").last().click();
      await page.waitForTimeout(260);
      const questionScreenBack = (await page.locator("[data-testid='assessment-question-panel']:visible").first().textContent()) || "";
      const promptBack = ((await page.locator("[data-testid='assessment-question-prompt']:visible").first().textContent()) || "").trim();
      const questionNumberBack = extractQuestionNumber(questionScreenBack);
      const didReturn = promptBack === promptBefore || (
        questionNumberBack !== null
        && questionNumberAfter !== null
        && questionNumberBack < questionNumberAfter
      );
      if (!didReturn) fail(`Back navigation failed on ${route} (${ctx.tier})`);

      if (!validationShown) {
        console.warn(`Validation message not triggered on first check for ${route} (${ctx.tier})`);
      }

      checked += 1;
      await page.close();
    }
  }
} finally {
  await browser.close();
}

console.log(`qa-onboarding-browser: pass (${checked} route/tier checks)`);
