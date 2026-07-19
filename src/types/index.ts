export interface BuyerReview {
  buyerUsername: string;
  sellerUsername: string;
  country: string;
  rating: number;
  reviewTime: string;
  reviewText: string;
}

export interface SellerReview {
  sellerUsername: string;
  buyerUsername: string;
  rating: number;
  price: string;
  duration: string;
  gigName: string;
  reviewDate: string;
  reviewText: string;
  sellerResponse?: string;
}

export type Review = BuyerReview | SellerReview;

export interface Progress {
  processedProfiles: string[];
  lastProcessed: string;
  mode: 'buyer' | 'seller';
}

export interface BrowserConfig {
  profilePath: string;
  headless?: boolean;
}