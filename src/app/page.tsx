import React from 'react';
import { getProducts, getCategories, getArticles } from '@/lib/dataService';
import { HeroSection } from '@/components/home/HeroSection';
import { CategoryCards } from '@/components/home/CategoryCards';
import { TrendingFinds } from '@/components/home/TrendingFinds';
import { BudgetSection } from '@/components/home/BudgetSection';
import { EditorsPicksSection } from '@/components/home/EditorsPicksSection';
import { OrganizationGrid } from '@/components/home/OrganizationGrid';
import { JournalPreview } from '@/components/home/JournalPreview';
import { NewsletterSignup } from '@/components/ui/NewsletterSignup';

export const revalidate = 3600; // Revalidate at most every hour

export default async function HomePage() {
  const [productsRes, categories, articles] = await Promise.all([
    getProducts({ onlyFeatured: false }),
    getCategories(),
    getArticles(),
  ]);

  const products = productsRes.products;

  return (
    <>
      <HeroSection />
      <CategoryCards categories={categories} />
      <TrendingFinds products={products} />
      <BudgetSection products={products} />
      <EditorsPicksSection products={products} />
      <OrganizationGrid />
      <JournalPreview articles={articles} />
      <NewsletterSignup />
    </>
  );
}

