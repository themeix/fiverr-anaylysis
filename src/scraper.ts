import { Page } from "puppeteer-core";

export interface ScrapingResult {
  html: string;
  screenshot: Uint8Array;
}

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function scraper(page: Page, profileUrl: string): Promise<ScrapingResult> {
  await page.goto(profileUrl, { waitUntil: "networkidle2", timeout: 60000 });

  await page.setViewport({ width: 1920, height: 1080 });

  await page.evaluate(() => {
    window.scrollTo(0, document.body.scrollHeight);
  });

  await sleep(3000);

  const maxAttempts = 50;
  let attempts = 0;

  while (attempts < maxAttempts) {
    attempts++;

    const buttons = await page.$$('button, [role="button"], .gig-card-actions button');
    let showMoreButton = null;

    for (const button of buttons) {
      try {
        const text = await button.evaluate((btn: any) => btn.textContent?.toLowerCase() || "");
        const className = await button.evaluate((btn: any) => btn.className?.toLowerCase() || "");
        const ariaLabel = await button.evaluate((btn: any) => btn.getAttribute("aria-label")?.toLowerCase() || "");
        
        if (text.includes("show more") || text.includes("show all") || text.includes("load more") || 
            className.includes("show-more") || className.includes("load-more") ||
            ariaLabel.includes("show more") || ariaLabel.includes("load more")) {
          showMoreButton = button;
          break;
        }
      } catch (e) {
        continue;
      }
    }

    if (!showMoreButton) {
      break;
    }

    const isVisible = await page.evaluate((btn: any) => {
      if (!btn) return false;
      const rect = btn.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return false;
      const style = window.getComputedStyle(btn);
      return style.display !== "none" && style.visibility !== "hidden" && style.opacity !== "0" && rect.top >= 0;
    }, showMoreButton);

    if (!isVisible) {
      break;
    }

    await page.evaluate((btn: any) => {
      btn.scrollIntoView({ behavior: "smooth", block: "center" });
    }, showMoreButton);

    await sleep(500);

    await showMoreButton.click().catch(() => {});

    await sleep(2000);

    await page.evaluate(() => {
      return new Promise((resolve) => {
        let lastHeight = 0;
        let stableCount = 0;
        const checkHeight = () => {
          const height = document.body.scrollHeight;
          if (height === lastHeight) {
            stableCount++;
            if (stableCount >= 2) {
              resolve(height);
            } else {
              setTimeout(checkHeight, 500);
            }
          } else {
            lastHeight = height;
            stableCount = 0;
            setTimeout(checkHeight, 500);
          }
        };
        checkHeight();
      });
    });

    await sleep(1000);
  }

  await page.evaluate(() => {
    window.scrollTo(0, 0);
  });

  await sleep(1000);

  const html = await page.content();

  const screenshot = await page.screenshot({
    fullPage: true,
    type: "png"
  }) as Uint8Array;

  return {
    html,
    screenshot
  };
}