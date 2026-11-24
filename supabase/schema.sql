-- HOMELY Supabase PostgreSQL Database Schema
-- Run this in your Supabase SQL Editor to set up tables and security policies

-- 1. Categories Table
CREATE TABLE IF NOT EXISTS categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  image_url TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Products Table
CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT NOT NULL,
  category_id TEXT REFERENCES categories(id) ON DELETE SET NULL,
  asin TEXT,
  amazon_affiliate_url TEXT NOT NULL,
  image_url TEXT NOT NULL,
  image_alt TEXT NOT NULL,
  editorial_note TEXT NOT NULL,
  best_for TEXT NOT NULL,
  featured BOOLEAN DEFAULT FALSE,
  is_published BOOLEAN DEFAULT TRUE,
  source_type TEXT DEFAULT 'manual' CHECK (source_type IN ('manual', 'amazon_creators_api')),
  price_amount NUMERIC(10, 2), -- Nullable when verified price is unavailable
  currency TEXT DEFAULT 'INR',
  price_last_updated TIMESTAMPTZ,
  amazon_data_last_updated TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Articles (Journal/Blog) Table
CREATE TABLE IF NOT EXISTS articles (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  cover_image TEXT NOT NULL,
  author TEXT DEFAULT 'HOMELY Editorial Team',
  published BOOLEAN DEFAULT TRUE,
  published_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Newsletter Subscribers Table
CREATE TABLE IF NOT EXISTS newsletters (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  email TEXT UNIQUE NOT NULL,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'unsubscribed')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Indexes for fast filtering & search
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_published ON products(is_published);
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(featured);
CREATE INDEX IF NOT EXISTS idx_products_price ON products(price_amount);
CREATE INDEX IF NOT EXISTS idx_articles_published ON articles(published);

-- 6. Row Level Security (RLS)
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletters ENABLE ROW LEVEL SECURITY;

-- Public read policies
CREATE POLICY "Allow public read published products" ON products
  FOR SELECT USING (is_published = true);

CREATE POLICY "Allow public read categories" ON categories
  FOR SELECT USING (is_active = true);

CREATE POLICY "Allow public read published articles" ON articles
  FOR SELECT USING (published = true);

-- Service role policies allow full CRUD operations from server-side
CREATE POLICY "Allow service_role full access to products" ON products
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Allow service_role full access to categories" ON categories
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Allow service_role full access to articles" ON articles
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Allow public to insert newsletter" ON newsletters
  FOR INSERT WITH CHECK (true);

