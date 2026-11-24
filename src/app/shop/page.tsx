import React, { Suspense } from 'react';
import { Metadata } from 'next';
import { getProducts, getCategories } from '@/lib/dataService';
import { ShopClient } from '@/components/shop/ShopClient';

export const metadata: Metadata = {
  title: 'Shop All Curated Finds | HOMELY',
  description:
    'Browse our complete catalogue of thoughtful home decor, kitchen essentials, and apartment organizers for Indian living.',
};

export default async function ShopPage() {
  const [productsRes, categories] = await Promise.all([
    getProducts({ onlyFeatured: false }),
    getCategories(),
  ]);

  return (
    <Suspense fallback={<div className="py-24 text-center text-warmgrey">Loading catalogue...</div>}>
      <ShopClient initialProducts={productsRes.products} categories={categories} />
    </Suspense>
  );
}

