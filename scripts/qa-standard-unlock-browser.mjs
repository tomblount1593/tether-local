import { chromium } from "playwright";

const baseUrl = "http://localhost:5173";

async function setTier(page, tier) {
  await page.goto(`${baseUrl}/discover`, { waitUntil: "networkidle" });
  await page.evaluate((nextTier) => {
    localStorage.setItem("tether_tier", nextTier);
    localStorage.setItem("tether_orientation", "straight");
    localStorage.setItem("tether_user_gender", "male");
    const existing = JSON.parse(localStorage.getItem("tetherDemoUserContext") || "{}");
    localStorage.setItem(
      "tetherDemoUserContext",
      JSON.stringify({
        ...existing,
        membershipTier: nextTier,
        genderIdentity: "male",
        sexualPreference: "straight",
      }),
    );
  }, tier);
}

async function run() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 430, height: 932 } });

  await page.goto(`${baseUrl}/discover`, { waitUntil: "networkidle" });
  await page.evaluate(() => localStorage.clear());
  await setTier(page, "standard");

  await page.goto(`${baseUrl}/discover`, { waitUntil: "networkidle" });
  const ctaText = await page.locator("button").filter({ hasText: /Unlock/i }).first().innerText();
  await page.locator("button").filter({ hasText: /Unlock/i }).first().click();
  await page.waitForURL("**/interested-in-you**");

  const initialVisible = await page.locator("[data-testid=interested-profile-card]").count();
  const hasSummary = await page.locator("[data-testid=interested-unlock-summary]").count();
  const hasPanel = await page.locator("[data-testid=standard-interested-unlock-options]").count();
  const hasPremiumBanner = await page.locator("[data-testid=premium-upgrade-banner]").count();
  const visibleScores = await page.locator("[data-testid=standard-interested-score]").allTextContents();
  const parsedScores = visibleScores.map((txt) => Number(String(txt).replace(/[^0-9]/g, ""))).filter((n) => Number.isFinite(n));
  const maxStandardScore = parsedScores.length ? Math.max(...parsedScores) : null;
  const minStandardScore = parsedScores.length ? Math.min(...parsedScores) : null;

  await page.locator("[data-testid=unlock-pack-3]").click();
  const visibleBeforeConfirm3 = await page.locator("[data-testid=interested-profile-card]").count();
  await page.locator("[data-testid=confirm-unlock]").click();
  const afterUnlock3Visible = await page.locator("[data-testid=interested-profile-card]").count();

  await page.locator("[data-testid=unlock-more-interested-profiles-banner] button").click();
  await page.locator("[data-testid=unlock-pack-12]").click();
  const visibleBeforeConfirm12 = await page.locator("[data-testid=interested-profile-card]").count();
  await page.locator("[data-testid=confirm-unlock]").click();
  const afterUnlock12Visible = await page.locator("[data-testid=interested-profile-card]").count();

  await page.reload({ waitUntil: "networkidle" });
  const afterRefreshVisible = await page.locator("[data-testid=interested-profile-card]").count();

  await setTier(page, "premium");
  await page.goto(`${baseUrl}/interested-in-you`, { waitUntil: "networkidle" });
  const premiumHasStandard = await page.locator("[data-testid=standard-interested-page]").count();
  const premiumScores = await page
    .locator(".compatibility-score-number")
    .allTextContents()
    .then((rows) => rows.map((txt) => Number(String(txt).replace(/[^0-9]/g, ""))).filter((n) => Number.isFinite(n)));
  const premiumMin = premiumScores.length ? Math.min(...premiumScores) : null;
  const premiumMax = premiumScores.length ? Math.max(...premiumScores) : null;
  const premiumHasUnder90 = premiumScores.some((score) => score >= 85 && score < 90);
  const premiumHasAtLeast90 = premiumScores.some((score) => score >= 90);

  await setTier(page, "concierge");
  await page.goto(`${baseUrl}/interested-in-you`, { waitUntil: "networkidle" });
  const conciergeHasStandard = await page.locator("[data-testid=standard-interested-page]").count();

  const result = {
    ctaText,
    initialVisible,
    hasSummary,
    hasPanel,
    hasPremiumBanner,
    visibleBeforeConfirm3,
    maxStandardScore,
    minStandardScore,
    afterUnlock3Visible,
    visibleBeforeConfirm12,
    afterUnlock12Visible,
    afterRefreshVisible,
    premiumHasStandard,
    premiumMin,
    premiumMax,
    premiumHasUnder90,
    premiumHasAtLeast90,
    conciergeHasStandard,
  };
  console.log(JSON.stringify(result, null, 2));
  await browser.close();

  const pass =
    initialVisible === 0 &&
    /Unlock Who's\s+Interested In You/i.test(ctaText) &&
    hasSummary === 1 &&
    hasPanel === 1 &&
    hasPremiumBanner === 1 &&
    visibleBeforeConfirm3 === 0 &&
    afterUnlock3Visible === 3 &&
    visibleBeforeConfirm12 === 0 &&
    afterUnlock12Visible >= 3 &&
    afterRefreshVisible === 0 &&
    premiumHasStandard === 0 &&
    premiumMin !== null &&
    premiumMax !== null &&
    premiumMin >= 85 &&
    premiumHasUnder90 &&
    premiumHasAtLeast90 &&
    conciergeHasStandard === 0;

  if (!pass) process.exit(1);
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
