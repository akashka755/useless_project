export interface Product {
  id: string;
  title: string;
  subtitle: string;
  price: number;
  originalPrice: number; // For satire: original price was lower, now marked up!
  discountText: string;
  rating: number;
  ratingCount: number;
  image: string;
  badge?: string;
  specs: Record<string, string>;
  highlights: string[];
  description: string;
  warranty: string;
  reviews: Review[];
  faqs: FAQ[];
  inStock: boolean;
  stockMessage: string;
  isLocked?: boolean;
  lockedReason?: string;
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  date: string;
  title: string;
  comment: string;
  verified: boolean;
  helpfulCount: number;
}

export interface FAQ {
  question: string;
  answer: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedVariant?: string;
}

export interface CaptchaItem {
  id: number;
  title: string;
  description: string;
  icon: string;
  isDread: boolean;
}

export interface UserProfile {
  name: string;
  email: string;
  tier: string;
  bermudaCoordinates: string;
  hieroglyph: string;
  secretLength: number;
}
