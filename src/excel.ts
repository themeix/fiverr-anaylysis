import { Review } from "./extractor";

export async function generateExcel(reviews: Review[]): Promise<Uint8Array> {
  const headers = ["Name", "Country", "Rating", "Date", "Price", "Duration", "Gig", "Review"];

  const rows = reviews.map(r => [
    r.name,
    r.country,
    r.rating.toString(),
    r.date,
    r.price,
    r.duration,
    r.gig,
    r.review
  ]);

  let csv = headers.join(",") + "\n";

  for (const row of rows) {
    const escaped = row.map(cell => {
      const str = cell.toString();
      if (str.includes(",") || str.includes("\n") || str.includes('"')) {
        return '"' + str.replace(/"/g, '""') + '"';
      }
      return str;
    });
    csv += escaped.join(",") + "\n";
  }

  return new TextEncoder().encode(csv);
}