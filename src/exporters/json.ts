import * as fs from 'fs';
import * as path from 'path';
import { BuyerReview, SellerReview, Review } from '../types/index.js';

export class JsonExporter {
  private outputPath: string;

  constructor(outputPath: string = 'output/reviews.json') {
    this.outputPath = outputPath;
    this.ensureOutputDirectory();
  }

  private ensureOutputDirectory(): void {
    const dir = path.dirname(this.outputPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }

  async export(reviews: Review[]): Promise<void> {
    const jsonData = JSON.stringify(reviews, null, 2);
    fs.writeFileSync(this.outputPath, jsonData);
  }
}