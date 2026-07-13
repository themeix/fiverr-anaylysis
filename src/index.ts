import puppeteer from "@cloudflare/puppeteer";
import { scraper } from "./scraper";
import { extractor } from "./extractor";
import { saveFiles } from "./utils";
import { generateExcel } from "./excel";

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext) {
    const url = new URL(request.url);

    const profileUrl = url.searchParams.get("url") || "https://www.fiverr.com/dev_pioneer";

    try {
      const browser = await puppeteer.launch(env.MYBROWSER);
      const page = await browser.newPage();

      const result = await scraper(page, profileUrl);

      await browser.close();

      const reviews = extractor(result.html);

      const excelData = await generateExcel(reviews);

      const savedFiles = await saveFiles(env, {
        screenshot: result.screenshot,
        html: result.html,
        json: JSON.stringify(reviews, null, 2),
        excel: excelData
      });

      return Response.json({
        success: true,
        reviews: reviews.length,
        files: savedFiles,
        data: reviews
      });

    } catch (error: any) {
      return Response.json({
        success: false,
        error: error.message
      }, { status: 500 });
    }
  }
};