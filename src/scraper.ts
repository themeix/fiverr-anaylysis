import { Page } from "puppeteer-core";

export interface ScrapingResult {
  html: string;
  screenshot: Uint8Array;
}

export async function scraper(page: Page, profileUrl: string): Promise<ScrapingResult> {
  await page.goto(profileUrl, { waitUntil: "networkidle2" });

  await page.setViewport({ width: 1920, height: 1080 });

  const maxAttempts = 50;
  let attempts = 0;

  while (attempts < maxAttempts) {
    attempts++;

    const showMoreButton = await page.$('button:has-text("Show More"), button:has-text("show more"), .load-more, [data-testid*="load-more"], [aria-label*="more"]');

    if (!showMoreButton) {
      break;
    }

    const isVisible = await page.evaluate((btn: any) => {
      if (!btn) return false;
      const rect = btn.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return false;
      const style = window.getComputedStyle(btn);
      return style.display !== "none" && style.visibility !== "hidden" && style.opacity !== "0";
    }, showMoreButton);

    if (!isVisible) {
      break;
    }

    await page.evaluate((btn: any) => {
      btn.scrollIntoView({ behavior: "smooth", block: "center" });
    }, showMoreButton);

    await new Promise(resolve => setTimeout(resolve, 500));

    await showMoreButton.click();

    await page.waitForTimeout(2000);

    await page.evaluate(() => {
      return new Promise((resolve) => {
        let lastHeight = 0;
        const checkHeight = () => {
          const height = document.body.scrollHeight;
          if (height === lastHeight) {
            resolve(height);
          } else {
            lastHeight = height;
            setTimeout(checkHeight, 500);
          }
        };
        checkHeight();
      });
    });

    await page.waitForTimeout(1000);
  }

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