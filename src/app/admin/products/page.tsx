import React from 'react';
import { getAllAdminProducts, getCategories } from '@/lib/dataService';
import { ProductListClient } from './ProductListClient';

export default async function AdminProductsPage() {
  const [products, categories] = await Promise.all([
    getAllAdminProducts(),
    getCategories(),
  ]);

  return <ProductListClient initialProducts={products} categories={categories} />;
}

