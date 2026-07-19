import { chromium, Browser, BrowserContext, Page } from 'playwright';
import { BrowserConfig } from '../types/index.js';
import * as path from 'path';
import * as fs from 'fs';

export class BrowserManager {
  private browser: Browser | null = null;
  private context: BrowserContext | null = null;
  private config: BrowserConfig;

  constructor(config: BrowserConfig) {
    this.config = config;
    this.ensureProfileDirectory();
  }

  private ensureProfileDirectory(): void {
    if (!fs.existsSync(this.config.profilePath)) {
      fs.mkdirSync(this.config.profilePath, { recursive: true });
    }
  }

  async launch(): Promise<Page> {
    if (this.browser && this.context) {
      const pages = this.context.pages();
      if (pages.length > 0) {
        return pages[0];
      }
    }

    this.browser = await chromium.launch({
      headless: this.config.headless ?? false,
      channel: 'chrome'
    });

    this.context = await this.browser.newContext({
      viewport: { width: 1920, height: 1080 },
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      locale: 'en-US',
      timezoneId: 'America/New_York',
      permissions: ['geolocation'],
      geolocation: { latitude: 40.7128, longitude: -74.0060 }
    });

    const page = await this.context.newPage();
    return page;
  }

  getContext(): BrowserContext | null {
    return this.context;
  }

  async close(): Promise<void> {
    if (this.context) {
      await this.context.close();
      this.context = null;
    }
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }
  }

  async newPage(): Promise<Page> {
    if (!this.context) {
      throw new Error('Browser context not initialized. Call launch() first.');
    }
    return await this.context.newPage();
  }
}