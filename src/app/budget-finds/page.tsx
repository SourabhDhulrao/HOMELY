import React, { Suspense } from 'react';
import { Metadata } from 'next';
import { getProducts } from '@/lib/dataService';
import { BudgetClient } from './BudgetClient';

export const metadata: Metadata = {
  title: 'Budget Finds Under ₹299, ₹499, ₹999 & ₹1,499 | HOMELY',
  description:
    'Affordable luxury and practical everyday essentials for Indian homes. All prices verified on Amazon India.',
};

export default async function BudgetFindsPage() {
  const { products } = await getProducts();

  return (
    <Suspense fallback={<div className="py-24 text-center text-warmgrey">Loading budget finds...</div>}>
      <BudgetClient products={products} />
    </Suspense>
  );
}

