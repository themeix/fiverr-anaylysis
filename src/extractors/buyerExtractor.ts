import { Page } from 'playwright';
import { BuyerReview } from '../types/index.js';
import { clickDelay, showMoreDelay } from '../utils/delay.js';
import { retry } from '../utils/retry.js';
import { Logger } from '../utils/logger.js';

export class BuyerExtractor {
  private page: Page;
  private collectedReviewIds: Set<string> = new Set();

  constructor(page: Page) {
    this.page = page;
  }

  async extractReviews(buyerUsername: string): Promise<BuyerReview[]> {
    const reviews: BuyerReview[] = [];
    this.collectedReviewIds.clear();

    await this.openBuyerProfile(buyerUsername);

    let hasMore = true;
    let pageCount = 0;

    while (hasMore) {
      pageCount++;
      Logger.info(`Loading page ${pageCount}...`);

      const newReviews = await this.extractVisibleReviews(buyerUsername);
      const uniqueNewReviews = newReviews.filter(r => !this.collectedReviewIds.has(r.reviewText));

      uniqueNewReviews.forEach(r => {
        this.collectedReviewIds.add(r.reviewText);
        reviews.push(r);
      });

      Logger.success(`Collected ${uniqueNewReviews.length} new reviews (Total: ${reviews.length})`);

      const showMoreButton = await this.findShowMoreButton();
      if (showMoreButton) {
        await retry(async () => {
          await showMoreButton.click();
          await clickDelay();
        });
        await showMoreDelay();
        await this.waitForNewReviews();
      } else {
        hasMore = false;
      }

      if (pageCount % 20 === 0) {
        Logger.warning('Taking a 20-60 second break...');
        await new Promise(resolve => setTimeout(resolve, Math.random() * 40000 + 20000));
      }
    }

    return reviews;
  }

  private async openBuyerProfile(buyerUsername: string): Promise<void> {
    const url = `https://www.fiverr.com/inbox/${buyerUsername}`;
    Logger.info(`Opening buyer inbox: ${url}`);

    await this.page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
    await new Promise(resolve => setTimeout(resolve, 3000));

    await this.clickBuyerName();
    await this.waitForProfilePanel();
  }

  private async clickBuyerName(): Promise<void> {
    await retry(async () => {
      const buyerNameLocator = this.page.locator('[data-qa="buyer-name"], .user-name, .username').first();
      await buyerNameLocator.waitFor({ state: 'visible', timeout: 10000 });
      await buyerNameLocator.click();
      await clickDelay();
    });
  }

  private async waitForProfilePanel(): Promise<void> {
    await this.page.waitForSelector('[data-qa="profile-panel"], .profile-panel, .sidebar-panel', {
      state: 'visible',
      timeout: 10000
    });
    await new Promise(resolve => setTimeout(resolve, 2000));
  }

  private async extractVisibleReviews(buyerUsername: string): Promise<BuyerReview[]> {
    const reviews: BuyerReview[] = [];

    const reviewElements = await this.page.locator('[data-qa="review"], .review-item, .user-review').all();

    for (const element of reviewElements) {
      try {
        const review = await this.extractReviewFromElement(element, buyerUsername);
        if (review) {
          reviews.push(review);
        }
      } catch (error) {
        Logger.warning(`Failed to extract review: ${error}`);
      }
    }

    return reviews;
  }

  private async extractReviewFromElement(element: any, buyerUsername: string): Promise<BuyerReview | null> {
    try {
      const sellerUsername = await element.locator('[data-qa="seller-name"], .seller-name, .reviewer-name').textContent({ timeout: 2000 }) || '';
      const country = await element.locator('[data-qa="country"], .country, .location').textContent({ timeout: 2000 }) || '';
      const ratingText = await element.locator('[data-qa="rating"], .rating, .stars').getAttribute('data-rating') || '0';
      const rating = parseInt(ratingText, 10) || 0;
      const reviewTime = await element.locator('[data-qa="review-time"], .review-time, .time').textContent({ timeout: 2000 }) || '';
      const reviewText = await element.locator('[data-qa="review-text"], .review-text, .review-content').textContent({ timeout: 2000 }) || '';

      if (!sellerUsername && !reviewText) {
        return null;
      }

      return {
        buyerUsername,
        sellerUsername: sellerUsername.trim(),
        country: country.trim(),
        rating,
        reviewTime: reviewTime.trim(),
        reviewText: reviewText.trim()
      };
    } catch (error) {
      return null;
    }
  }

  private async findShowMoreButton(): Promise<any> {
    const button = this.page.locator('button:has-text("Show More"), button:has-text("Show more"), [data-qa="show-more-reviews"], .show-more-button').first();
    const isVisible = await button.isVisible({ timeout: 3000 }).catch(() => false);
    return isVisible ? button : null;
  }

  private async waitForNewReviews(): Promise<void> {
    await this.page.waitForTimeout(2000);
  }
}