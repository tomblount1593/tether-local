import { chromium } from "playwright";

const baseUrl = "http://localhost:5173";
const tiers = ["standard", "premium", "concierge"];
const routes = [
  "/discover",
  "/matches",
  "/conversations",
  "/chat",
  "/map",
  "/expert",
  "/insights",
  "/profile",
  "/interested-in-you",
  "/membership",
  "/sign-in",
  "/discover-straight",
  "/discover-gay",
  "/discover-lesbian",
  "/discover-bisexual",
  "/discover-trans-nonbinary",
  "/matches-straight",
  "/matches-gay",
  "/matches-lesbian",
  "/matches-bisexual",
  "/matches-trans-nonbinary",
];

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
      }),
    );
  }, tier);
}

async function run() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 430, height: 932 } });
  const results = [];

  for (const tier of tiers) {
    await setTier(page, tier);
    for (const route of routes) {
      const consoleErrors = [];
      const handler = (msg) => {
        if (msg.type() === "error") consoleErrors.push(msg.text());
      };
      page.on("console", handler);
      try {
        await page.goto(`${baseUrl}${route}`, { waitUntil: "domcontentloaded" });
        await page.waitForTimeout(500);
        const bodyText = await page.locator("body").innerText();
        const brokenImages = await page.locator("img").evaluateAll((imgs) => {
          const visible = imgs.filter((img) => {
            const rect = img.getBoundingClientRect();
            const hasArea = rect.width > 0 && rect.height > 0;
            const src = img.getAttribute("src") || "";
            return hasArea && src.trim().length > 0;
          });
          return visible.filter((img) => !(img.complete && img.naturalWidth > 0)).length;
        });
        const titleCount = await page.locator("h1, h2").count();
        results.push({
          tier,
          route,
          hasNaN: /\bNaN\b/.test(bodyText),
          hasUndefined: /\bundefined\b/.test(bodyText),
          hasNull: /\bnull\b/.test(bodyText),
          brokenImages,
          titleCount,
          consoleErrorCount: consoleErrors.length,
          consoleErrors,
          pass: !/\bNaN\b/.test(bodyText) && !/\bundefined\b/.test(bodyText) && !/\bnull\b/.test(bodyText) && brokenImages === 0 && titleCount > 0,
        });
      } catch (error) {
        results.push({ tier, route, pass: false, error: String(error) });
      } finally {
        page.off("console", handler);
      }
    }
  }

  const failing = results.filter((r) => !r.pass);
  console.log(JSON.stringify({ total: results.length, failing: failing.length, results }, null, 2));
  await browser.close();
  if (failing.length) process.exit(1);
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
