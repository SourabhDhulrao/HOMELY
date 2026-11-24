import { INITIAL_CATEGORIES, INITIAL_PRODUCTS, INITIAL_ARTICLES } from './sampleData';
import { Product, Category, Article, FilterOptions } from './types';
import { supabase, supabaseAdmin, isSupabaseConfigured } from './supabase';

// In-memory runtime store used when Supabase is not configured or for quick local edits
let memoryProducts: Product[] = [...INITIAL_PRODUCTS];
let memoryCategories: Category[] = [...INITIAL_CATEGORIES];
let memoryArticles: Article[] = [...INITIAL_ARTICLES];
const memorySubscribers: string[] = [];

// Helper to keep memory store refreshed with latest initial items
function getMemoryProductsList(): Product[] {
  // If memoryProducts was emptied or modified, return it, but ensure initial items match INITIAL_PRODUCTS
  const custom = memoryProducts.filter(p => !INITIAL_PRODUCTS.some(init => init.id === p.id));
  return [...INITIAL_PRODUCTS, ...custom];
}

/* =========================================================================
   PRODUCTS
========================================================================= */

export async function getProducts(options?: FilterOptions): Promise<{ products: Product[]; total: number }> {
  let list: Product[] = [];

  if (isSupabaseConfigured && supabase) {
    try {
      let query = supabase.from('products').select('*', { count: 'exact' });

      if (options?.category && options.category !== 'all') {
        // category could be slug or id
        const cat = memoryCategories.find(c => c.slug === options.category || c.id === options.category);
        if (cat) {
          query = query.eq('category_id', cat.id);
        }
      }

      if (options?.onlyFeatured) {
        query = query.eq('featured', true);
      }

      query = query.eq('is_published', true);

      const { data, count, error } = await query;
      if (!error && data) {
        list = data.map((item: any) => ({
          ...item,
          category_name: memoryCategories.find(c => c.id === item.category_id)?.name,
          category_slug: memoryCategories.find(c => c.id === item.category_id)?.slug,
        }));
      } else {
        list = getMemoryProductsList();
      }
    } catch {
      list = getMemoryProductsList();
    }
  } else {
    list = getMemoryProductsList();
  }

  // Filter in memory for search, verified price ranges, and sorting
  let filtered = list.filter(p => p.is_published);

  if (options?.category && options.category !== 'all') {
    filtered = filtered.filter(
      p => p.category_slug === options.category || p.category_id === options.category
    );
  }

  if (options?.onlyFeatured) {
    filtered = filtered.filter(p => p.featured);
  }

  // Price range filters strictly apply ONLY when price_amount is verified and non-null
  if (options?.priceRange && options.priceRange !== 'all') {
    filtered = filtered.filter(p => {
      if (p.price_amount === null || p.price_amount === undefined) return false;
      switch (options.priceRange) {
        case 'under-299':
          return p.price_amount <= 299;
        case 'under-499':
          return p.price_amount <= 499;
        case 'under-999':
          return p.price_amount <= 999;
        case 'under-1499':
          return p.price_amount <= 1499;
        default:
          return true;
      }
    });
  }

  // Search query in title, description, editorial notes, tags
  if (options?.searchQuery && options.searchQuery.trim().length > 0) {
    const q = options.searchQuery.toLowerCase().trim();
    filtered = filtered.filter(p => 
      p.name.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.editorial_note.toLowerCase().includes(q) ||
      p.best_for.toLowerCase().includes(q) ||
      (p.category_name && p.category_name.toLowerCase().includes(q))
    );
  }

  // Sorting
  if (options?.sortBy) {
    switch (options.sortBy) {
      case 'price-asc':
        filtered.sort((a, b) => {
          if (a.price_amount === null) return 1;
          if (b.price_amount === null) return -1;
          return a.price_amount - b.price_amount;
        });
        break;
      case 'price-desc':
        filtered.sort((a, b) => {
          if (a.price_amount === null) return 1;
          if (b.price_amount === null) return -1;
          return b.price_amount - a.price_amount;
        });
        break;
      case 'newest':
        filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
      case 'featured':
      default:
        filtered.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
        break;
    }
  }

  return { products: filtered, total: filtered.length };
}

export async function getAllAdminProducts(): Promise<Product[]> {
  if (isSupabaseConfigured && supabaseAdmin) {
    try {
      const { data, error } = await supabaseAdmin.from('products').select('*').order('created_at', { ascending: false });
      if (!error && data) {
        return data.map((item: any) => ({
          ...item,
          category_name: memoryCategories.find(c => c.id === item.category_id)?.name,
          category_slug: memoryCategories.find(c => c.id === item.category_id)?.slug,
        }));
      }
    } catch {
      // Fallback
    }
  }
  return getMemoryProductsList();
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase.from('products').select('*').eq('slug', slug).single();
      if (!error && data) {
        return {
          ...data,
          category_name: memoryCategories.find(c => c.id === data.category_id)?.name,
          category_slug: memoryCategories.find(c => c.id === data.category_id)?.slug,
        };
      }
    } catch {
      // Fallback
    }
  }
  const found = getMemoryProductsList().find(p => p.slug === slug);
  return found || null;
}

export async function getProductById(id: string): Promise<Product | null> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase.from('products').select('*').eq('id', id).single();
      if (!error && data) {
        return {
          ...data,
          category_name: memoryCategories.find(c => c.id === data.category_id)?.name,
          category_slug: memoryCategories.find(c => c.id === data.category_id)?.slug,
        };
      }
    } catch {
      // Fallback
    }
  }
  const found = getMemoryProductsList().find(p => p.id === id);
  return found || null;
}

export async function saveProduct(product: Partial<Product> & { name: string; amazon_affiliate_url: string }): Promise<Product> {
  const now = new Date().toISOString();
  const id = product.id || `prod-${Date.now()}`;
  const slug = product.slug || product.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  
  const category = memoryCategories.find(c => c.id === product.category_id);

  const fullProduct: Product = {
    id,
    name: product.name,
    slug,
    description: product.description || '',
    category_id: product.category_id || 'cat-1',
    category_name: category?.name || 'Home Decor',
    category_slug: category?.slug || 'home-decor',
    asin: product.asin || '',
    amazon_affiliate_url: product.amazon_affiliate_url,
    image_url: product.image_url || (product.images && product.images[0]) || 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?q=80&w=1000&auto=format&fit=crop',
    images: product.images && product.images.length > 0 
      ? product.images 
      : [product.image_url || 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?q=80&w=1000&auto=format&fit=crop'],
    image_alt: product.image_alt || product.name,
    editorial_note: product.editorial_note || 'A thoughtful selection for beautiful everyday living.',
    best_for: product.best_for || 'Everyday home styling.',
    featured: product.featured ?? false,
    is_published: product.is_published ?? true,
    source_type: product.source_type || 'manual',
    price_amount: product.price_amount ?? null,
    currency: product.currency || 'INR',
    price_last_updated: product.price_amount ? (product.price_last_updated || now) : null,
    editorial_label: product.editorial_label,
    specs: product.specs,
    created_at: product.created_at || now,
    updated_at: now,
  };

  if (isSupabaseConfigured && supabaseAdmin) {
    try {
      await supabaseAdmin.from('products').upsert(fullProduct);
    } catch (e) {
      console.warn('Supabase upsert warning:', e);
    }
  }

  // Update memory store
  const existingIdx = memoryProducts.findIndex(p => p.id === id);
  if (existingIdx >= 0) {
    memoryProducts[existingIdx] = fullProduct;
  } else {
    memoryProducts.unshift(fullProduct);
  }

  return fullProduct;
}

export async function deleteProduct(id: string): Promise<boolean> {
  if (isSupabaseConfigured && supabaseAdmin) {
    try {
      await supabaseAdmin.from('products').delete().eq('id', id);
    } catch {
      // Fallback
    }
  }
  memoryProducts = memoryProducts.filter(p => p.id !== id);
  return true;
}

/* =========================================================================
   CATEGORIES
========================================================================= */

export async function getCategories(): Promise<Category[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase.from('categories').select('*').eq('is_active', true);
      if (!error && data && data.length > 0) {
        return data;
      }
    } catch {
      // Fallback
    }
  }
  return [...memoryCategories];
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const cats = await getCategories();
  return cats.find(c => c.slug === slug) || null;
}

/* =========================================================================
   ARTICLES (JOURNAL)
========================================================================= */

export async function getArticles(): Promise<Article[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase.from('articles').select('*').eq('published', true).order('published_at', { ascending: false });
      if (!error && data && data.length > 0) {
        return data;
      }
    } catch {
      // Fallback
    }
  }
  return [...memoryArticles];
}

export async function getAllAdminArticles(): Promise<Article[]> {
  if (isSupabaseConfigured && supabaseAdmin) {
    try {
      const { data, error } = await supabaseAdmin.from('articles').select('*').order('created_at', { ascending: false });
      if (!error && data) {
        return data;
      }
    } catch {
      // Fallback
    }
  }
  return [...memoryArticles];
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase.from('articles').select('*').eq('slug', slug).single();
      if (!error && data) {
        return data;
      }
    } catch {
      // Fallback
    }
  }
  return memoryArticles.find(a => a.slug === slug) || null;
}

export async function saveArticle(article: Partial<Article> & { title: string; content: string }): Promise<Article> {
  const now = new Date().toISOString();
  const id = article.id || `art-${Date.now()}`;
  const slug = article.slug || article.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  const fullArticle: Article = {
    id,
    title: article.title,
    slug,
    excerpt: article.excerpt || article.content.slice(0, 160) + '...',
    content: article.content,
    cover_image: article.cover_image || 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?q=80&w=1200&auto=format&fit=crop',
    author: article.author || 'HOMELY Editorial Team',
    published: article.published ?? true,
    published_at: article.published_at || now,
    created_at: article.created_at || now,
    updated_at: now,
    read_time: article.read_time || '4 min read',
    tags: article.tags || ['Home Living'],
    featured_product_ids: article.featured_product_ids || [],
  };

  if (isSupabaseConfigured && supabaseAdmin) {
    try {
      await supabaseAdmin.from('articles').upsert(fullArticle);
    } catch (e) {
      console.warn('Supabase article upsert warning:', e);
    }
  }

  const existingIdx = memoryArticles.findIndex(a => a.id === id);
  if (existingIdx >= 0) {
    memoryArticles[existingIdx] = fullArticle;
  } else {
    memoryArticles.unshift(fullArticle);
  }

  return fullArticle;
}

export async function deleteArticle(id: string): Promise<boolean> {
  if (isSupabaseConfigured && supabaseAdmin) {
    try {
      await supabaseAdmin.from('articles').delete().eq('id', id);
    } catch {
      // Fallback
    }
  }
  memoryArticles = memoryArticles.filter(a => a.id !== id);
  return true;
}

/* =========================================================================
   NEWSLETTER
========================================================================= */

export async function addNewsletterSubscriber(email: string): Promise<{ success: boolean; message: string }> {
  const normalized = email.toLowerCase().trim();
  if (!normalized || !normalized.includes('@')) {
    return { success: false, message: 'Please provide a valid email address.' };
  }

  if (isSupabaseConfigured && supabaseAdmin) {
    try {
      const { error } = await supabaseAdmin.from('newsletters').insert({ email: normalized, status: 'active' });
      if (error && error.code !== '23505') { // 23505 is unique violation
        return { success: false, message: 'Could not record subscription. Please try again.' };
      }
    } catch {
      // Fallback
    }
  }

  if (!memorySubscribers.includes(normalized)) {
    memorySubscribers.push(normalized);
  }

  return { success: true, message: 'Thank you for joining our circle. Thoughtful finds will arrive occasionally.' };
}

