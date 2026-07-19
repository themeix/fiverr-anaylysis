import { Page } from 'playwright';
import { SellerReview } from '../types/index.js';
import { clickDelay, showMoreDelay } from '../utils/delay.js';
import { retry } from '../utils/retry.js';
import { Logger } from '../utils/logger.js';

export class SellerExtractor {
  private page: Page;
  private collectedReviewIds: Set<string> = new Set();

  constructor(page: Page) {
    this.page = page;
  }

  async extractReviews(sellerUsername: string): Promise<SellerReview[]> {
    const reviews: SellerReview[] = [];
    this.collectedReviewIds.clear();

    await this.openSellerProfile(sellerUsername);

    let hasMore = true;
    let pageCount = 0;

    while (hasMore) {
      pageCount++;
      Logger.info(`Loading page ${pageCount}...`);

      const newReviews = await this.extractVisibleReviews(sellerUsername);
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

  private async openSellerProfile(sellerUsername: string): Promise<void> {
    const url = `https://www.fiverr.com/${sellerUsername}`;
    Logger.info(`Opening seller profile: ${url}`);

    await this.page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
    await new Promise(resolve => setTimeout(resolve, 3000));

    await this.clickReviewsTab();
    await this.waitForReviewsToLoad();
  }

  private async clickReviewsTab(): Promise<void> {
    await retry(async () => {
      const reviewsTab = this.page.locator('[data-qa="reviews-tab"], a:has-text("Reviews"), .reviews-tab, [role="tab"]:has-text("Reviews")').first();
      await reviewsTab.waitFor({ state: 'visible', timeout: 10000 });
      await reviewsTab.click();
      await clickDelay();
    });
  }

  private async waitForReviewsToLoad(): Promise<void> {
    await this.page.waitForSelector('[data-qa="review"], .review-item, .gig-review', {
      state: 'visible',
      timeout: 15000
    });
    await new Promise(resolve => setTimeout(resolve, 2000));
  }

  private async extractVisibleReviews(sellerUsername: string): Promise<SellerReview[]> {
    const reviews: SellerReview[] = [];

    const reviewElements = await this.page.locator('[data-qa="review"], .review-item, .gig-review').all();

    for (const element of reviewElements) {
      try {
        const review = await this.extractReviewFromElement(element, sellerUsername);
        if (review) {
          reviews.push(review);
        }
      } catch (error) {
        Logger.warning(`Failed to extract review: ${error}`);
      }
    }

    return reviews;
  }

  private async extractReviewFromElement(element: any, sellerUsername: string): Promise<SellerReview | null> {
    try {
      const buyerUsername = await element.locator('[data-qa="buyer-name"], .buyer-name, .reviewer-name').textContent({ timeout: 2000 }) || '';
      const ratingText = await element.locator('[data-qa="rating"], .rating, .stars').getAttribute('data-rating') || '0';
      const rating = parseInt(ratingText, 10) || 0;
      const price = await element.locator('[data-qa="price"], .price, .order-price').textContent({ timeout: 2000 }) || '';
      const duration = await element.locator('[data-qa="duration"], .duration, .delivery-time').textContent({ timeout: 2000 }) || '';
      const gigName = await element.locator('[data-qa="gig-name"], .gig-name, .gig-title').textContent({ timeout: 2000 }) || '';
      const reviewDate = await element.locator('[data-qa="review-date"], .review-date, .time').textContent({ timeout: 2000 }) || '';
      const reviewText = await element.locator('[data-qa="review-text"], .review-text, .review-content').textContent({ timeout: 2000 }) || '';
      const sellerResponse = await element.locator('[data-qa="seller-response"], .seller-response, .response-text').textContent({ timeout: 2000 }) || '';

      if (!buyerUsername && !reviewText) {
        return null;
      }

      return {
        sellerUsername,
        buyerUsername: buyerUsername.trim(),
        rating,
        price: price.trim(),
        duration: duration.trim(),
        gigName: gigName.trim(),
        reviewDate: reviewDate.trim(),
        reviewText: reviewText.trim(),
        sellerResponse: sellerResponse ? sellerResponse.trim() : undefined
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