# Fiverr Review Collector PRD

## Overview

Build a review collection tool using **Node.js**, **TypeScript**, and **Playwright**.

The tool should collect reviews from Fiverr in two different modes:

1. **Buyer Reviews** (Inbox Profile)
2. **Seller Reviews** (Public Profile)

The application should use a **persistent Chrome profile** so the user only needs to log in once. All future runs should reuse the existing login session.

---

# Technology Stack

- Node.js
- TypeScript
- Playwright
- Google Chrome (Persistent Profile)
- ExcelJS (Excel Export)

---

# Browser Requirements

- Use Google Chrome
- Run in headed mode (`headless: false`)
- Reuse an existing Chrome profile
- Never perform automatic login
- Wait for pages to fully load before interacting
- Use Playwright Locators instead of fragile selectors whenever possible

---

# Scraping Modes

## Mode 1 — Buyer Reviews

### Input

```
https://www.fiverr.com/inbox/{buyer_username}
```

Example:

```
https://www.fiverr.com/inbox/wilsonlovato55
```

### Workflow

1. Open the Inbox URL.
2. Wait until the page is fully loaded.
3. Click the buyer name.
4. Wait for the right-side profile panel to open.
5. Locate the **Reviews from freelancers** section.
6. Extract the first visible reviews (normally 5).
7. If **Show More Reviews** exists:
   - Click it.
   - Wait a random delay.
   - Extract only newly loaded reviews.
8. Repeat until the button disappears.
9. Save all collected reviews.

### Fields to Collect

| Field | Description |
|--------|-------------|
| Buyer Username | Current buyer |
| Seller Username | Reviewer |
| Country | Seller country |
| Rating | Star rating |
| Review Time | e.g. "3 weeks ago" |
| Review Text | Review content |

---

# Mode 2 — Seller Reviews

### Input

```
https://www.fiverr.com/{seller_username}
```

Example:

```
https://www.fiverr.com/betopia
```

### Workflow

1. Open seller profile.
2. Wait until profile is fully loaded.
3. Click the **Reviews** tab.
4. Wait until reviews become visible.
5. Extract the first visible reviews (normally 5).
6. If **Show More Reviews** exists:
   - Click it.
   - Wait a random delay.
   - Extract only newly loaded reviews.
7. Repeat until no more reviews remain.
8. Save all collected reviews.

### Fields to Collect

| Field | Description |
|--------|-------------|
| Seller Username | Current seller |
| Buyer Username | Reviewer |
| Rating | Star rating |
| Price | Project price |
| Duration | Delivery duration |
| Gig Name | Purchased gig |
| Review Date | Review timestamp |
| Review Text | Review content |
| Seller Response | Optional |

---

# Show More Reviews Logic

```
Extract visible reviews

while (Show More Reviews button exists)

    Click button

    Wait random delay

    Wait for new reviews

    Extract only newly loaded reviews

end
```

Duplicate reviews should never be saved.

---

# Random Delays

Use human-like random delays throughout the automation.

Recommended ranges:

| Action | Delay |
|--------|------|
| Open page | 2–5 seconds |
| Click | 1–3 seconds |
| Show More Reviews | 2–6 seconds |
| Between profiles | 3–8 seconds |
| Every 20 clicks | 20–60 second break |
| Every 30–50 profiles | 2–5 minute break |

---

# Retry Logic

Automatically retry the following failures:

- Click failed
- Timeout
- Element not found
- Temporary loading issues

Maximum retries:

```
3
```

---

# Resume Support

If the script stops unexpectedly, it should continue from the last processed profile.

Store progress in:

```
progress.json
```

---

# Output Files

Generate:

```
output/
    reviews.xlsx
    reviews.json
```

---

# Excel Format

## Buyer Mode

| Buyer | Seller | Country | Rating | Time | Review |

---

## Seller Mode

| Seller | Buyer | Rating | Price | Duration | Gig | Time | Review | Seller Response |

---

# Browser Session

Use a persistent Chrome profile.

Requirements:

- User logs in manually only once.
- Cookies are preserved.
- Session is reused automatically.
- No repeated login.
- No automatic credential handling.

---

# Project Structure

```
src/
│
├── browser/
│   └── browser.ts
│
├── buyer/
│   └── buyer.ts
│
├── seller/
│   └── seller.ts
│
├── extractors/
│   ├── buyerExtractor.ts
│   └── sellerExtractor.ts
│
├── exporters/
│   ├── excel.ts
│   └── json.ts
│
├── utils/
│   ├── delay.ts
│   ├── retry.ts
│   └── logger.ts
│
├── types/
│
└── index.ts

profiles/
    chrome/

output/

progress.json
```

---

# Commands

Buyer Reviews

```bash
npm run buyer
```

Seller Reviews

```bash
npm run seller
```

---

# Development Guidelines

- Write clean, modular TypeScript.
- Keep buyer and seller logic completely separate.
- Avoid duplicate code by sharing common browser utilities.
- Use Playwright Locators instead of brittle CSS selectors.
- Add clear comments for maintainability.
- Make the code easy to extend with future scraping modes.