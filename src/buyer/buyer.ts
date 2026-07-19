import { Page } from 'playwright';
import { BuyerExtractor } from '../extractors/buyerExtractor.js';
import { BuyerReview } from '../types/index.js';
import { openPageDelay, profileDelay, profileBreakDelay } from '../utils/delay.js';
import { Logger } from '../utils/logger.js';

export class BuyerScraper {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async scrapeProfiles(profiles: string[]): Promise<BuyerReview[]> {
    const allReviews: BuyerReview[] = [];

    for (let i = 0; i < profiles.length; i++) {
      const profile = profiles[i];
      Logger.info(`Processing profile ${i + 1}/${profiles.length}: ${profile}`);

      try {
        const extractor = new BuyerExtractor(this.page);
        const reviews = await extractor.extractReviews(profile);
        allReviews.push(...reviews);
        Logger.success(`Collected ${reviews.length} reviews from ${profile}`);

        await profileDelay();

        if ((i + 1) % 30 === 0 && i + 1 < profiles.length) {
          Logger.warning('Taking a 2-5 minute break...');
          await profileBreakDelay();
        }

        await openPageDelay();
      } catch (error) {
        Logger.error(`Failed to process profile ${profile}`, error);
      }
    }

    return allReviews;
  }
}