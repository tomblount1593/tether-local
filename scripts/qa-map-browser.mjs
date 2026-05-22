import { chromium } from "playwright";

const baseUrl = "http://localhost:5173";
const tiers = ["standard", "premium", "concierge"];
const routes = ["/map", "/map-straight", "/map-gay", "/map-lesbian", "/map-bisexual", "/map-trans-nonbinary"];

const expectedMapIdByTier = {
  premium: "8771c4fce6cb428a47b92ac1",
  concierge: "8771c4fce6cb428adfd5efa8",
};

function toTestToken(value) {
  const num = Number(value);
  if (num === 2.5) return "25";
  if (num === 7.5) return "75";
  return String(num);
}

function isAllowedConsoleError(message) {
  const text = String(message || "").toLowerCase();
  return (
    text.includes("maps.googleapis.com") ||
    text.includes("google maps") ||
    text.includes("js?key=") ||
    text.includes("attempted to load a vector map, but failed. falling back to raster")
  );
}

async function setTier(page, tier) {
  await page.goto(`${baseUrl}/discover`, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(500);
  await page.evaluate((nextTier) => {
    localStorage.setItem("tether_tier", nextTier);
    const existing = JSON.parse(localStorage.getItem("tetherDemoUserContext") || "{}");
    localStorage.setItem("tetherDemoUserContext", JSON.stringify({ ...existing, membershipTier: nextTier }));
  }, tier);
}

async function hardReload(page, route) {
  await page.goto(`${baseUrl}${route}`, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(1400);
  await page.reload({ waitUntil: "domcontentloaded" });
  await page.waitForTimeout(1400);
}

async function readMapDiagnostics(page) {
  return page.evaluate(() => {
    const card = document.querySelector("[data-testid='tether-map-card']");
    const mapHost = document.querySelector("[data-testid='tether-google-map']");
    const shell = mapHost?.closest(".tether-google-map-shell");
    const mapVisible = !!document.querySelector(".gm-style");
    const fallbackVisible = !!document.querySelector("[data-testid='map-fallback']");
    return {
      title: document.querySelector("[data-testid='map-title']")?.textContent?.trim() || "",
      countText: document.querySelector("[data-testid='map-count']")?.textContent?.trim() || "",
      cardMapId: card?.getAttribute("data-map-id") || "",
      cardTier: card?.getAttribute("data-map-tier") || "",
      cardRadius: card?.getAttribute("data-active-radius") || "",
      cardVisibleCount: card?.getAttribute("data-visible-match-count") || "",
      cardOutCount: card?.getAttribute("data-out-radius-count") || "",
      lastFitRadius: card?.getAttribute("data-last-fit-radius") || "",
      lastFitTimestamp: card?.getAttribute("data-last-fit-timestamp") || "",
      googleMapTier: mapHost?.getAttribute("data-map-tier") || "",
      googleMapId: mapHost?.getAttribute("data-map-id") || "",
      googleMapRadius: shell?.getAttribute("data-active-radius") || "",
      googleMapVisibleCount: shell?.getAttribute("data-visible-match-count") || "",
      googleMapOutCount: shell?.getAttribute("data-out-radius-count") || "",
      shellFitRadius: shell?.getAttribute("data-last-fit-radius") || "",
      shellFitTimestamp: shell?.getAttribute("data-last-fit-timestamp") || "",
      mapVisible,
      fallbackVisible,
      hasCircle: !!document.querySelector("[data-testid='map-radius-circle']"),
    };
  });
}

async function ensureOpenRadiusPanel(page) {
  const dropdown = page.getByTestId("map-radius-dropdown");
  await dropdown.click();
  await page.waitForTimeout(120);
}

async function setSliderTo(page, nextValue) {
  await page.getByTestId("map-radius-slider").evaluate((el, val) => {
    const input = el;
    input.value = String(val);
    input.dispatchEvent(new Event("input", { bubbles: true }));
    input.dispatchEvent(new Event("change", { bubbles: true }));
  }, nextValue);
  await page.waitForTimeout(280);
}

async function run() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 393, height: 852 } });
  const results = [];

  for (const tier of tiers) {
    await setTier(page, tier);

    for (const route of routes) {
      const consoleErrors = [];
      const onConsole = (msg) => {
        if (msg.type() === "error") {
          consoleErrors.push(msg.text());
        }
      };
      page.on("console", onConsole);

      try {
        await hardReload(page, route);
        const base = await readMapDiagnostics(page);

        const hasHeader = /Nearby Potential Matches/i.test(base.title);
        const hasCountCopy = /nearby potential match/i.test(base.countText);
        const mapTierMatches = base.fallbackVisible
          ? base.cardTier === tier
          : (base.cardTier === tier && base.googleMapTier === tier);
        const mapIdMatches = tier in expectedMapIdByTier
          ? base.cardMapId === expectedMapIdByTier[tier] && base.googleMapId === expectedMapIdByTier[tier]
          : true;
        const mapIdNotSwapped = tier === "premium"
          ? base.cardMapId !== expectedMapIdByTier.concierge
          : tier === "concierge"
            ? base.cardMapId !== expectedMapIdByTier.premium
            : true;

        const radiusSequence = [];
        if (tier !== "standard") {
          await ensureOpenRadiusPanel(page);
          await setSliderTo(page, 5);
          const radius5 = await readMapDiagnostics(page);
          radiusSequence.push({
            step: "slider-5",
            radius: radius5.cardRadius,
            shellRadius: radius5.googleMapRadius,
            fitRadius: radius5.lastFitRadius || radius5.shellFitRadius,
            fitStamp: radius5.lastFitTimestamp || radius5.shellFitTimestamp,
          });

          await setSliderTo(page, 10);
          const radius10 = await readMapDiagnostics(page);
          radiusSequence.push({
            step: "slider-10",
            radius: radius10.cardRadius,
            shellRadius: radius10.googleMapRadius,
            fitRadius: radius10.lastFitRadius || radius10.shellFitRadius,
            fitStamp: radius10.lastFitTimestamp || radius10.shellFitTimestamp,
          });

          await page.getByTestId(`map-radius-control-${toTestToken(2.5)}`).click();
          await page.waitForTimeout(250);
          const radius25 = await readMapDiagnostics(page);
          radiusSequence.push({
            step: "quick-2.5",
            radius: radius25.cardRadius,
            shellRadius: radius25.googleMapRadius,
            fitRadius: radius25.lastFitRadius || radius25.shellFitRadius,
            fitStamp: radius25.lastFitTimestamp || radius25.shellFitTimestamp,
          });
        }

        const disallowedErrors = consoleErrors.filter((err) => !isAllowedConsoleError(err));
        const hasNoBadText = !/undefined|null|nan/i.test(`${base.title} ${base.countText}`);

        const radiusPass = tier === "standard" || (
          radiusSequence.length === 3 &&
          radiusSequence[0].radius === "5" &&
          radiusSequence[0].shellRadius === "5" &&
          radiusSequence[1].radius === "10" &&
          radiusSequence[1].shellRadius === "10" &&
          radiusSequence[2].radius === "2.5" &&
          radiusSequence[2].shellRadius === "2.5" &&
          radiusSequence.every((row) => Number(row.fitRadius) > 0) &&
          radiusSequence.every((row) => Number(row.fitStamp) > 0)
        );

        const pass = Boolean(
          hasHeader &&
          hasCountCopy &&
          mapTierMatches &&
          mapIdMatches &&
          mapIdNotSwapped &&
          (base.mapVisible || base.fallbackVisible) &&
          (base.hasCircle || base.fallbackVisible) &&
          hasNoBadText &&
          disallowedErrors.length === 0 &&
          radiusPass
        );

        results.push({
          tier,
          route,
          pass,
          mapId: base.cardMapId,
          mapIdMap: base.googleMapId,
          mapVisible: base.mapVisible,
          fallbackVisible: base.fallbackVisible,
          radiusSequence,
          disallowedErrors,
        });
      } catch (error) {
        results.push({ tier, route, pass: false, error: String(error) });
      } finally {
        page.off("console", onConsole);
      }
    }
  }

  const failing = results.filter((row) => !row.pass);
  console.log(JSON.stringify({ total: results.length, failing: failing.length, results }, null, 2));
  await browser.close();
  if (failing.length) process.exit(1);
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
