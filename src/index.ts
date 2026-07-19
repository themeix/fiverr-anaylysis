import { BrowserManager } from './browser/browser.js';
import { BuyerScraper } from './buyer/buyer.js';
import { SellerScraper } from './seller/seller.js';
import { ProgressManager } from './utils/progress.js';
import { ExcelExporter } from './exporters/excel.js';
import { JsonExporter } from './exporters/json.js';
import { Logger } from './utils/logger.js';
import * as path from 'path';

async function main() {
  const args = process.argv.slice(2);
  const mode = args[0];

  if (mode !== 'buyer' && mode !== 'seller') {
    console.error('Usage: npm run buyer | npm run seller');
    process.exit(1);
  }

  const profilePath = path.join(process.cwd(), 'profiles', 'chrome');
  const progressManager = new ProgressManager();
  progressManager.setMode(mode as 'buyer' | 'seller');

  const browserManager = new BrowserManager({ profilePath });
  const page = await browserManager.launch();

  Logger.info('Fiverr Review Collector started');
  Logger.info(`Mode: ${mode}`);
  Logger.info('Please log in to Fiverr if not already logged in');

  await new Promise(resolve => setTimeout(resolve, 5000));

  const profiles = args.slice(1);

  if (profiles.length === 0) {
    Logger.warning('No profiles provided. Usage:');
    Logger.info('  npm run buyer username1 username2 ...');
    Logger.info('  npm run seller username1 username2 ...');
    await browserManager.close();
    process.exit(0);
  }

  const filteredProfiles = profiles.filter(p => !progressManager.isProcessed(p));

  if (filteredProfiles.length === 0) {
    Logger.info('All profiles already processed');
    await browserManager.close();
    process.exit(0);
  }

  Logger.info(`Processing ${filteredProfiles.length} profiles`);

  let reviews: any[] = [];

  if (mode === 'buyer') {
    const scraper = new BuyerScraper(page);
    reviews = await scraper.scrapeProfiles(filteredProfiles);
  } else {
    const scraper = new SellerScraper(page);
    reviews = await scraper.scrapeProfiles(filteredProfiles);
  }

  filteredProfiles.forEach(profile => progressManager.markProcessed(profile));

  const excelExporter = new ExcelExporter('output/reviews.xlsx');
  const jsonExporter = new JsonExporter('output/reviews.json');

  if (mode === 'buyer') {
    await excelExporter.exportBuyerReviews(reviews);
  } else {
    await excelExporter.exportSellerReviews(reviews);
  }

  await jsonExporter.export(reviews);

  Logger.success(`Collected ${reviews.length} total reviews`);
  Logger.success(`Exported to output/reviews.xlsx and output/reviews.json`);

  await browserManager.close();
}

main().catch(error => {
  Logger.error('Application error', error);
  process.exit(1);
});