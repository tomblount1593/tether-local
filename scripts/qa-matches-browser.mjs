import { chromium } from "playwright";

const baseUrl = "http://localhost:5173";
const routes = ["/matches", "/matches-straight", "/matches-gay", "/matches-lesbian", "/matches-bisexual", "/matches-trans-nonbinary"];
const tiers = ["standard", "premium", "concierge"];

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
  const out = [];

  for (const tier of tiers) {
    for (const route of routes) {
      await setTier(page, tier);
      await page.goto(`${baseUrl}${route}`, { waitUntil: "networkidle" });

      const snapshot = {
        tier,
        route,
        hasNaN: await page.locator("text=NaN").count(),
        hasUndefined: await page.locator("text=undefined").count(),
        hasNull: await page.locator("text=null").count(),
      };

      await page.locator("[data-testid=matches-tab-new]").click();
      snapshot.newCards = await page.locator("[data-testid=match-card]").count();
      snapshot.newNames = await page.locator("[data-testid=match-name]").count();
      snapshot.newPhotos = await page.locator("[data-testid=match-photo]").count();

      await page.locator("[data-testid=matches-tab-first-date]").click();
      snapshot.firstCards = await page.locator("[data-testid=match-card]").count();

      await page.locator("[data-testid=matches-tab-next-dates]").click();
      snapshot.nextCards = await page.locator("[data-testid=next-date-card]").count();
      snapshot.nextScores = await page.locator("[data-testid=match-score]").count();

      await page.locator("[data-testid=matches-tab-past-feedback]").click();
      snapshot.pastCards = await page.locator("[data-testid=past-date-card]").count();
      snapshot.feedbackStatuses = await page.locator("[data-testid=feedback-status]").count();

      snapshot.pass =
        snapshot.hasNaN === 0 &&
        snapshot.hasUndefined === 0 &&
        snapshot.hasNull === 0 &&
        snapshot.newNames === snapshot.newCards &&
        snapshot.newPhotos === snapshot.newCards &&
        snapshot.nextScores === snapshot.nextCards &&
        snapshot.feedbackStatuses === snapshot.pastCards;

      out.push(snapshot);
    }
  }

  const failing = out.filter((item) => !item.pass);
  console.log(JSON.stringify({ total: out.length, failing: failing.length, results: out }, null, 2));
  await browser.close();
  if (failing.length) process.exit(1);
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});

