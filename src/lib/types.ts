export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string;
  image_url: string;
  is_active: boolean;
  item_count?: number;
};

export type Product = {
  id: string;
  name: string;
  slug: string;
  description: string;
  category_id: string;
  category_name?: string;
  category_slug?: string;
  asin?: string;
  amazon_affiliate_url: string;
  image_url: string;
  images?: string[]; // Multiple product photos
  image_alt: string;
  editorial_note: string;
  best_for: string;
  featured: boolean;
  is_published: boolean;
  source_type: 'manual' | 'amazon_creators_api';
  price_amount: number | null; // Verified current price only, null if unverified
  currency: string;
  price_last_updated?: string | null;
  amazon_data_last_updated?: string | null;
  created_at: string;
  updated_at: string;
  editorial_label?: string; // e.g. "Editor's Pick", "Space Saver", "Under ₹499"
  specs?: Record<string, string>;
};

export type Article = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string; // Markdown or HTML rich content
  cover_image: string;
  author: string;
  published: boolean;
  published_at: string;
  created_at: string;
  updated_at: string;
  read_time?: string;
  tags?: string[];
  featured_product_ids?: string[];
};

export type FilterOptions = {
  category?: string;
  priceRange?: 'under-299' | 'under-499' | 'under-999' | 'under-1499' | 'all';
  sortBy?: 'featured' | 'newest' | 'price-asc' | 'price-desc';
  searchQuery?: string;
  onlyFeatured?: boolean;
};

export type AmazonCreatorsApiCredentials = {
  clientId: string;
  clientSecret: string;
  version: string;
  partnerTag: string;
  marketplace: string;
};

export type AmazonSearchResultItem = {
  asin: string;
  title: string;
  imageUrl: string;
  detailPageUrl: string;
  affiliateUrl: string;
  price?: {
    amount: number;
    currency: string;
    displayAmount: string;
  } | null;
  features?: string[];
  browseNode?: string;
};

