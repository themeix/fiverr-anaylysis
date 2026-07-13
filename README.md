# Fiverr Profile Review Extractor using Cloudflare Browser Rendering

A Cloudflare Worker that uses **Cloudflare Browser Rendering** (headless Chromium) to automatically load every review from a Fiverr seller profile, capture a full-page screenshot, save the rendered HTML, and optionally export all reviews as structured JSON or Excel.

---

## Features

- 🚀 Uses Cloudflare Browser Rendering (no external browser required)
- 📜 Automatically loads **all reviews**
- 🔄 Clicks **"Show More Reviews"** until no more reviews are available
- 📸 Captures a full-page screenshot
- 📄 Saves the fully rendered HTML
- 📦 Extracts all review data into JSON
- 📊 Optional Excel (.xlsx) export
- ☁️ Can upload screenshots, HTML, and JSON directly to Cloudflare R2

---

## How it Works

1. Launch a headless Chromium browser.
2. Open the Fiverr seller profile.
3. Navigate to the Reviews section.
4. Continuously:
   - Scroll to the bottom.
   - Detect the **Show More Reviews** button.
   - Click the button.
   - Wait until network activity is idle.
   - Repeat until no additional reviews exist.
5. Wait for all lazy-loaded content to finish rendering.
6. Capture a full-page screenshot.
7. Save the rendered HTML.
8. Extract all reviews.
9. Return or upload the generated files.

---

## Project Structure

```
.
├── src/
│   ├── index.ts
│   ├── browser.ts
│   ├── scraper.ts
│   ├── extractor.ts
│   ├── excel.ts
│   └── utils.ts
│
├── wrangler.jsonc
├── package.json
├── tsconfig.json
└── README.md
```

---

## Requirements

- Cloudflare Account
- Workers Paid Plan (Browser Rendering enabled)
- Wrangler CLI
- Node.js 20+

---

## Installation

Clone the repository.

```bash
git clone https://github.com/yourname/fiverr-review-extractor.git

cd fiverr-review-extractor
```

Install dependencies.

```bash
npm install
```

---

## Configure Browser Rendering

Add a Browser Rendering binding.

### wrangler.jsonc

```json
{
  "browser": {
    "binding": "MYBROWSER"
  }
}
```

If using R2:

```json
{
  "r2_buckets": [
    {
      "binding": "FILES",
      "bucket_name": "screenshots"
    }
  ]
}
```

---

## Run Locally

```bash
wrangler dev
```

---

## Deploy

```bash
wrangler deploy
```

---

# Usage

Example request:

```
GET /?url=https://www.fiverr.com/username
```

Response:

```json
{
    "success": true,
    "reviews": 387,
    "screenshot": "...",
    "html": "...",
    "json": "..."
}
```

---

## Scraping Algorithm

```
Open Profile
        │
        ▼
Scroll to Reviews
        │
        ▼
Find "Show More Reviews"
        │
        ├── Found
        │      │
        │      ▼
        │   Click Button
        │      │
        │      ▼
        │ Wait for Network Idle
        │      │
        │      ▼
        │ Repeat
        │
        └── Not Found
               │
               ▼
Capture Screenshot
               │
               ▼
Save HTML
               │
               ▼
Extract Reviews
               │
               ▼
Generate Excel
```

---

## Output Files

After completion the worker can generate:

```
output/

reviews.png

reviews.html

reviews.json

reviews.xlsx
```

---

## Review Data Structure

```json
{
    "name": "John Doe",
    "country": "United States",
    "rating": 5,
    "date": "2 weeks ago",
    "price": "$200-$400",
    "duration": "7 days",
    "gig": "Shopify",
    "review": "Amazing experience..."
}
```

---

## Export Formats

- JSON
- HTML
- PNG Screenshot
- XLSX

---

## Recommended Improvements

- Automatic retry on failed clicks
- Infinite scrolling detection
- CAPTCHA detection
- Cookie persistence
- Browser session reuse
- Parallel profile processing
- Queue support
- Scheduled scraping
- R2 storage
- D1 database integration
- CSV export
- Google Sheets export

---

## Disclaimer

This project is intended for educational purposes and for scraping publicly available information. Always review Fiverr's Terms of Service and robots.txt before automating access to their website. Use responsibly and respect rate limits.

---

## License

MIT
