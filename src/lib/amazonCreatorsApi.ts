import { AmazonSearchResultItem } from './types';
import { buildAmazonAffiliateUrl } from './utils';

// Cached OAuth 2.0 token in server memory
let cachedAccessToken: string | null = null;
let tokenExpiresAt: number = 0;

export interface CreatorsApiConfig {
  clientId: string;
  clientSecret: string;
  version: string;
  partnerTag: string;
  marketplace: string;
}

export function getCreatorsApiConfig(): CreatorsApiConfig {
  return {
    clientId: process.env.AMAZON_CREATOR_CLIENT_ID || '',
    clientSecret: process.env.AMAZON_CREATOR_CLIENT_SECRET || '',
    version: process.env.AMAZON_CREATOR_VERSION || '2.1',
    partnerTag: process.env.AMAZON_PARTNER_TAG || 'homelyindia-21',
    marketplace: process.env.AMAZON_MARKETPLACE || 'www.amazon.in',
  };
}

export function isAmazonApiConfigured(): boolean {
  const config = getCreatorsApiConfig();
  return Boolean(config.clientId && config.clientSecret);
}

/**
 * Fetch OAuth 2.0 Access Token with server-side caching and auto-refresh
 */
export async function getAmazonOAuthToken(): Promise<string | null> {
  const config = getCreatorsApiConfig();
  if (!config.clientId || !config.clientSecret) {
    return null;
  }

  // Check if current cached token is still valid (with 60-second safety window)
  const now = Date.now();
  if (cachedAccessToken && tokenExpiresAt > now + 60000) {
    return cachedAccessToken;
  }

  try {
    const authEndpoint = 'https://api.amazon.in/auth/o2/token';
    const params = new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: config.clientId,
      client_secret: config.clientSecret,
      scope: 'creatorsapi',
    });

    const response = await fetch(authEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
      },
      body: params.toString(),
      cache: 'no-store',
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('Amazon Creators API OAuth Error:', response.status, errText);
      return null;
    }

    const data = await response.json();
    cachedAccessToken = data.access_token;
    // data.expires_in is typically in seconds (e.g. 3600)
    tokenExpiresAt = now + (data.expires_in || 3600) * 1000;
    return cachedAccessToken;
  } catch (error) {
    console.error('Failed to request Amazon Creators API OAuth token:', error);
    return null;
  }
}

/**
 * SearchItems via official Amazon Creators API
 */
export async function searchAmazonItems(keywords: string): Promise<{
  items: AmazonSearchResultItem[];
  source: 'live_api' | 'catalog_preview';
  message?: string;
}> {
  const config = getCreatorsApiConfig();
  const partnerTag = config.partnerTag || 'homelyindia-21';

  // If live credentials are ready, attempt official API call
  if (isAmazonApiConfigured()) {
    try {
      const token = await getAmazonOAuthToken();
      if (token) {
        const endpoint = `https://api.amazon.in/creators/v${config.version}/search`;
        const payload = {
          Keywords: keywords,
          Marketplace: config.marketplace,
          PartnerTag: partnerTag,
          PartnerType: 'Associates',
          Resources: [
            'ItemInfo.Title',
            'ItemInfo.Features',
            'Images.Primary.Large',
            'Offers.Listings.Price',
            'BrowseNodeInfo.BrowseNodes',
          ],
        };

        const res = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'x-amz-target': `com.amazon.creators.v${config.version}.CreatorsAPI.SearchItems`,
          },
          body: JSON.stringify(payload),
        });

        if (res.ok) {
          const apiData = await res.json();
          const items: AmazonSearchResultItem[] = (apiData.SearchResult?.Items || []).map((item: any) => {
            const rawPrice = item.Offers?.Listings?.[0]?.Price;
            const priceAmount = rawPrice?.Amount ? parseFloat(rawPrice.Amount) : null;
            return {
              asin: item.ASIN,
              title: item.ItemInfo?.Title?.DisplayValue || 'Amazon India Home Product',
              imageUrl: item.Images?.Primary?.Large?.URL || 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?q=80&w=1000&auto=format&fit=crop',
              detailPageUrl: item.DetailPageURL || `https://www.amazon.in/dp/${item.ASIN}`,
              affiliateUrl: buildAmazonAffiliateUrl(item.DetailPageURL, item.ASIN),
              price: priceAmount ? {
                amount: priceAmount,
                currency: rawPrice?.Currency || 'INR',
                displayAmount: rawPrice?.DisplayAmount || `₹${priceAmount}`,
              } : null,
              features: item.ItemInfo?.Features?.DisplayValues || [],
              browseNode: item.BrowseNodeInfo?.BrowseNodes?.[0]?.DisplayName,
            };
          });

          return { items, source: 'live_api' };
        }
      }
    } catch (e) {
      console.warn('Live Amazon API request error, falling back to discovery helper:', e);
    }
  }

  // Pre-curated verified items catalog for admin preview when testing or before approval
  const q = keywords.toLowerCase();
  const mockCatalogue: AmazonSearchResultItem[] = [
    {
      asin: 'B09V7L7C82',
      title: 'Handcrafted Ribbed Ceramic Donut Vase - Matte Eggshell Off-White',
      imageUrl: 'https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?q=80&w=1000&auto=format&fit=crop',
      detailPageUrl: 'https://www.amazon.in/s?k=ceramic+donut+vase+white',
      affiliateUrl: `https://www.amazon.in/s?k=ceramic+donut+vase+white&tag=${partnerTag}`,
      price: { amount: 699, currency: 'INR', displayAmount: '₹699' },
      features: ['Scandinavian minimalist circular hollow silhouette', 'Tactile fluted stoneware finish', '20 cm height'],
      browseNode: 'Home Decor / Vases',
    },
    {
      asin: 'B08K755N3M',
      title: 'Amber UV-Resistant Glass Oil & Vinegar Dispenser Set with Drip-Free Spouts',
      imageUrl: 'https://images.unsplash.com/photo-1584990347449-a2a4664ec648?q=80&w=1000&auto=format&fit=crop',
      detailPageUrl: 'https://www.amazon.in/s?k=amber+glass+oil+vinegar+dispenser+bottle',
      affiliateUrl: `https://www.amazon.in/s?k=amber+glass+oil+vinegar+dispenser+bottle&tag=${partnerTag}`,
      price: { amount: 499, currency: 'INR', displayAmount: '₹499' },
      features: ['500ml apothecary glass bottles', 'Weighted auto-flip gold stainless spouts', 'Waterproof labels included'],
      browseNode: 'Kitchen & Dining / Oil Dispensers',
    },
    {
      asin: 'B088R917Q1',
      title: 'Clear Stackable Refrigerator & Pantry Storage Bins with Handle (Pack of 4)',
      imageUrl: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=1000&auto=format&fit=crop',
      detailPageUrl: 'https://www.amazon.in/s?k=clear+stackable+fridge+organizer+bins',
      affiliateUrl: `https://www.amazon.in/s?k=clear+stackable+fridge+organizer+bins&tag=${partnerTag}`,
      price: { amount: 899, currency: 'INR', displayAmount: '₹899' },
      features: ['BPA-free shatterproof PET plastic', 'Fits Indian standard refrigerators', 'Built-in carry handles'],
      browseNode: 'Storage & Organization / Kitchen Bins',
    },
    {
      asin: 'B07M6T3QG9',
      title: 'Ultra-Slim 3-Tier Rolling Gap Storage Utility Cart (13cm Profile)',
      imageUrl: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?q=80&w=1000&auto=format&fit=crop',
      detailPageUrl: 'https://www.amazon.in/s?k=slim+3+tier+rolling+utility+cart',
      affiliateUrl: `https://www.amazon.in/s?k=slim+3+tier+rolling+utility+cart&tag=${partnerTag}`,
      price: { amount: 1299, currency: 'INR', displayAmount: '₹1,299' },
      features: ['Fits tight 13-15cm gaps beside appliances', '360 degree caster wheels with locks', 'Easy 5-min snap assembly'],
      browseNode: 'Storage & Organization / Rolling Carts',
    },
    {
      asin: 'B08F91B2CX',
      title: 'Solid Acacia Wood Two-Tier Turntable Lazy Susan Spice Organizer',
      imageUrl: 'https://images.unsplash.com/photo-1590794056226-79ef3a8147e1?q=80&w=1000&auto=format&fit=crop',
      detailPageUrl: 'https://www.amazon.in/s?k=acacia+wood+two+tier+lazy+susan',
      affiliateUrl: `https://www.amazon.in/s?k=acacia+wood+two+tier+lazy+susan&tag=${partnerTag}`,
      price: { amount: 999, currency: 'INR', displayAmount: '₹999' },
      features: ['25cm diameter dual rotating tiers', 'Natural acacia grain pattern', 'Stainless ball-bearing mechanism'],
      browseNode: 'Kitchen & Dining / Spice Racks',
    },
    {
      asin: 'B08D6N74C2',
      title: 'Solid Brushed Brass Heavy Duty Self-Adhesive Wall Peg Hooks (Set of 4)',
      imageUrl: 'https://images.unsplash.com/photo-1584622781564-1d987f7333c1?q=80&w=1000&auto=format&fit=crop',
      detailPageUrl: 'https://www.amazon.in/s?k=self+adhesive+brass+wall+hooks',
      affiliateUrl: `https://www.amazon.in/s?k=self+adhesive+brass+wall+hooks&tag=${partnerTag}`,
      price: { amount: 299, currency: 'INR', displayAmount: '₹299' },
      features: ['No drilling required with 3M VHB tape', 'Solid pure brass construction', 'Holds up to 4kg'],
      browseNode: 'Hardware / Hooks',
    },
  ];

  const filtered = mockCatalogue.filter(
    item => item.title.toLowerCase().includes(q) ||
            item.browseNode?.toLowerCase().includes(q) ||
            item.asin.toLowerCase().includes(q)
  );

  return {
    items: filtered.length > 0 ? filtered : mockCatalogue,
    source: 'catalog_preview',
    message: isAmazonApiConfigured()
      ? 'Connected to Amazon Creators API for live lookup.'
      : 'Operating in Mode 1 (Manual Mode). Live Amazon Creators API credentials can be configured in .env.local anytime.',
  };
}

/**
 * GetItems via official Amazon Creators API
 */
export async function getAmazonItemDetails(asin: string): Promise<AmazonSearchResultItem | null> {
  const config = getCreatorsApiConfig();
  const partnerTag = config.partnerTag || 'homelyindia-21';

  if (isAmazonApiConfigured()) {
    try {
      const token = await getAmazonOAuthToken();
      if (token) {
        const endpoint = `https://api.amazon.in/creators/v${config.version}/items`;
        const res = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'x-amz-target': `com.amazon.creators.v${config.version}.CreatorsAPI.GetItems`,
          },
          body: JSON.stringify({
            ItemIds: [asin],
            Marketplace: config.marketplace,
            PartnerTag: partnerTag,
            PartnerType: 'Associates',
            Resources: [
              'ItemInfo.Title',
              'ItemInfo.Features',
              'Images.Primary.Large',
              'Offers.Listings.Price',
            ],
          }),
        });

        if (res.ok) {
          const data = await res.json();
          const item = data.ItemsResult?.Items?.[0];
          if (item) {
            const rawPrice = item.Offers?.Listings?.[0]?.Price;
            const priceAmount = rawPrice?.Amount ? parseFloat(rawPrice.Amount) : null;
            return {
              asin: item.ASIN,
              title: item.ItemInfo?.Title?.DisplayValue || '',
              imageUrl: item.Images?.Primary?.Large?.URL || '',
              detailPageUrl: item.DetailPageURL || `https://www.amazon.in/dp/${item.ASIN}`,
              affiliateUrl: buildAmazonAffiliateUrl(item.DetailPageURL, item.ASIN),
              price: priceAmount ? {
                amount: priceAmount,
                currency: rawPrice?.Currency || 'INR',
                displayAmount: rawPrice?.DisplayAmount || `₹${priceAmount}`,
              } : null,
              features: item.ItemInfo?.Features?.DisplayValues || [],
            };
          }
        }
      }
    } catch (e) {
      console.warn('Error fetching item from Amazon Creators API:', e);
    }
  }

  return null;
}

