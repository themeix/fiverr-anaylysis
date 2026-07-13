export interface Review {
  name: string;
  country: string;
  rating: number;
  date: string;
  price: string;
  duration: string;
  gig: string;
  review: string;
}

export function extractor(html: string): Review[] {
  const reviews: Review[] = [];

  const reviewItemRegex = /<div[^>]*(?:data-testid="review-item"|class="[^"]*review[^"]*")[^>]*>[\s\S]*?(?=<\/div>\s*<\/div>\s*<\/div|<div[^>]*(?:data-testid="review-item"|class="[^"]*review[^"]*)|$)/gi;
  const reviewItems = html.match(reviewItemRegex) || [];

  for (const item of reviewItems) {
    const nameMatch = item.match(/(?:data-testid="reviewer-name"|class="[^"]*username[^"]*")[^>]*>([^<]+)</i);
    const countryMatch = item.match(/(?:data-testid="country"|class="[^"]*country[^"]*")[^>]*>([^<]+)</i);
    const ratingMatch = item.match(/(?:aria-label="(\d+\.?\d*) stars"|class="[^"]*star[^"]*"[^>]*>(?:<[^>]+>)*?(\d+)\/\d+)/i);
    const dateMatch = item.match(/(?:data-testid="review-date"|class="[^"]*date[^"]*")[^>]*>([^<]+)</i);
    const priceMatch = item.match(/(?:data-testid="price"|class="[^"]*price[^"]*")[^>]*>([^<]+)</i);
    const durationMatch = item.match(/(?:data-testid="duration"|class="[^"]*duration[^"]*")[^>]*>([^<]+)</i);
    const gigMatch = item.match(/(?:data-testid="gig-name"|class="[^"]*gig[^"]*")[^>]*>([^<]+)</i);
    const reviewTextMatch = item.match(/<p[^>]*(?:data-testid="review-content"|class="[^"]*review[^"]*text[^"]*")[^>]*>([\s\S]*?)<\/p>/i);

    const review: Review = {
      name: nameMatch?.[1]?.trim() || "Unknown",
      country: countryMatch?.[1]?.trim() || "Unknown",
      rating: ratingMatch ? parseFloat(ratingMatch[1] || ratingMatch[2]) : 0,
      date: dateMatch?.[1]?.trim() || "Unknown",
      price: priceMatch?.[1]?.trim() || "Unknown",
      duration: durationMatch?.[1]?.trim() || "Unknown",
      gig: gigMatch?.[1]?.trim() || "Unknown",
      review: reviewTextMatch?.[1]?.trim()?.replace(/<[^>]+>/g, "") || ""
    };

    if (review.name !== "Unknown" && review.review.length > 10) {
      reviews.push(review);
    }
  }

  return reviews;
}