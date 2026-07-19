# Fiverr Review Collector

A Node.js/TypeScript tool for collecting reviews from Fiverr in buyer and seller modes.

## Features

- **Buyer Mode**: Collect reviews from freelancers about buyers
- **Seller Mode**: Collect reviews from buyers about sellers
- Persistent Chrome profile (log in once, reuse session)
- Random delays for human-like behavior
- Automatic retry logic
- Resume support via progress tracking
- Export to Excel and JSON

## Installation

```bash
npm install
```

## Usage

### Buyer Reviews

Collect reviews from freelancers about a buyer:

```bash
npm run buyer username1 username2 username3
```

Example:
```bash
npm run buyer wilsonlovato55
```

### Seller Reviews

Collect reviews from buyers about a seller:

```bash
npm run seller username1 username2 username3
```

Example:
```bash
npm run seller betopia
```

## Project Structure

```
src/
├── browser/        # Browser management
├── buyer/          # Buyer scraping logic
├── seller/         # Seller scraping logic
├── extractors/     # Review extraction
├── exporters/      # Excel and JSON export
├── utils/          # Utilities (delay, retry, logger, progress)
└── types/          # TypeScript types
```

## Output Files

- `output/reviews.xlsx` - Excel export
- `output/reviews.json` - JSON export
- `progress.json` - Progress tracking

## Development Guidelines

- Uses Playwright Locators for robust element selection
- Implements random delays to mimic human behavior
- Supports resuming from last processed profile
- No automatic login - user logs in manually once

## Requirements

- Node.js 18+
- TypeScript 5+
- Google Chrome

## Notes

- First run: You'll need to log in to Fiverr manually in the browser
- The browser will open in headed mode
- Progress is saved automatically and can be resumed
- Duplicate reviews are filtered out automatically