import { chromium } from "playwright";

const baseUrl = "http://localhost:5173";
const variants = ["", "-straight", "-gay", "-lesbian", "-bisexual", "-trans-nonbinary"];
const tiers = ["standard", "premium", "concierge"];

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function setContext(page, tier, variant) {
  const profileByVariant = {
    "": { pref: "straight", gender: "male" },
    "-straight": { pref: "straight", gender: "male" },
    "-gay": { pref: "gay", gender: "male" },
    "-lesbian": { pref: "lesbian", gender: "female" },
    "-bisexual": { pref: "bisexual", gender: "male" },
    "-trans-nonbinary": { pref: "trans_nonbinary", gender: "non_binary" },
  };
  const profile = profileByVariant[variant] || profileByVariant[""];
  await page.goto(`${baseUrl}/discover`, { waitUntil: "domcontentloaded" });
  await page.evaluate(({ nextTier, nextPref, nextGender }) => {
    const existing = JSON.parse(localStorage.getItem("tetherDemoUserContext") || "{}");
    localStorage.setItem("tether_tier", nextTier);
    localStorage.setItem("tetherDemoUserContext", JSON.stringify({
      ...existing,
      membershipTier: nextTier,
      sexualPreference: nextPref,
      genderIdentity: nextGender,
    }));
    if (nextTier === "standard") {
      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith("tetherStandardInterestedPackV5:")) localStorage.removeItem(key);
      });
    }
  }, { nextTier: tier, nextPref: profile.pref, nextGender: profile.gender });
}

async function openModalOnRoute(page, tier, variant) {
  const route = `${baseUrl}/interested-in-you${variant}`;
  await setContext(page, tier, variant);
  await page.goto(route, { waitUntil: "networkidle" });

  if (tier === "standard") {
    const unlockMore = page.locator("[data-testid=unlock-more-interested-profiles]");
    if (await unlockMore.count()) {
      await unlockMore.first().click();
    }
    const unlockPack = page.locator("[data-testid=unlock-pack-3]");
    if (await unlockPack.count() && await unlockPack.first().isEnabled()) {
      await unlockPack.first().click();
      await page.locator("[data-testid=confirm-unlock]").first().click();
      await page.waitForSelector("[data-testid=interested-profile-card]");
    }
  }

  const cards = page.locator("[data-testid=interested-profile-card]");
  const count = await cards.count();
  assert(count > 0, `no visible interested cards for ${tier} ${variant || "default"}`);
  await cards.first().click();

  await page.waitForSelector("[data-testid=interested-date-modal]");
  assert(await page.locator("[data-testid=interested-date-modal-user-photo]").isVisible(), "user photo missing");
  assert(await page.locator("[data-testid=interested-date-modal-match-photo]").isVisible(), "match photo missing");
  const title = await page.locator("[data-testid=interested-date-modal-title]").innerText();
  assert(/are going on a date/i.test(title), "modal title text missing");
  assert(await page.locator("[data-testid=interested-date-modal-summary]").isVisible(), "compat summary missing");
  assert(await page.locator("[data-testid=interested-date-modal-click-to-book]").isVisible(), "book button missing");

  await page.locator("[data-testid=interested-date-modal-not-now]").click();
  await page.waitForTimeout(100);
  assert((await page.locator("[data-testid=interested-date-modal]").count()) === 0, "modal should close on Not now");

  await cards.first().click();
  await page.locator("[data-testid=interested-date-modal-click-to-book]").click();
  await page.waitForURL("**/book-date/**");
  assert(await page.locator("[data-testid=date-booking-page]").isVisible(), "booking page missing");
  assert(await page.locator("[data-testid=date-booking-selected-match]").isVisible(), "selected match block missing");
  assert(await page.locator("[data-testid=date-booking-time-options]").isVisible(), "time options missing");
  assert(await page.locator("[data-testid=date-booking-location-options]").isVisible(), "location options missing");

  const pageText = await page.locator("body").innerText();
  assert(!/\bundefined\b|\bnull\b|\bNaN\b/.test(pageText), "unexpected undefined/null/NaN visible");
}

async function run() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 393, height: 852 } });
  page.on("console", (msg) => {
    if (msg.type() === "error") {
      throw new Error(`console error: ${msg.text()}`);
    }
  });

  for (const tier of tiers) {
    for (const variant of variants) {
      await openModalOnRoute(page, tier, variant);
    }
  }

  await browser.close();
  console.log("qa-interested-date-modal-browser: pass");
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
