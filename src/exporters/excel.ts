import ExcelJS from 'exceljs';
import { BuyerReview, SellerReview } from '../types/index.js';
import * as path from 'path';
import * as fs from 'fs';

export class ExcelExporter {
  private outputPath: string;

  constructor(outputPath: string = 'output/reviews.xlsx') {
    this.outputPath = outputPath;
    this.ensureOutputDirectory();
  }

  private ensureOutputDirectory(): void {
    const dir = path.dirname(this.outputPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }

  async exportBuyerReviews(reviews: BuyerReview[]): Promise<void> {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Buyer Reviews');

    worksheet.columns = [
      { header: 'Buyer', key: 'buyerUsername', width: 20 },
      { header: 'Seller', key: 'sellerUsername', width: 20 },
      { header: 'Country', key: 'country', width: 15 },
      { header: 'Rating', key: 'rating', width: 10 },
      { header: 'Time', key: 'reviewTime', width: 15 },
      { header: 'Review', key: 'reviewText', width: 50 }
    ];

    reviews.forEach(review => {
      worksheet.addRow(review);
    });

    await workbook.xlsx.writeFile(this.outputPath);
  }

  async exportSellerReviews(reviews: SellerReview[]): Promise<void> {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Seller Reviews');

    worksheet.columns = [
      { header: 'Seller', key: 'sellerUsername', width: 20 },
      { header: 'Buyer', key: 'buyerUsername', width: 20 },
      { header: 'Rating', key: 'rating', width: 10 },
      { header: 'Price', key: 'price', width: 12 },
      { header: 'Duration', key: 'duration', width: 12 },
      { header: 'Gig', key: 'gigName', width: 30 },
      { header: 'Time', key: 'reviewDate', width: 15 },
      { header: 'Review', key: 'reviewText', width: 50 },
      { header: 'Seller Response', key: 'sellerResponse', width: 50 }
    ];

    reviews.forEach(review => {
      worksheet.addRow(review);
    });

    await workbook.xlsx.writeFile(this.outputPath);
  }
}