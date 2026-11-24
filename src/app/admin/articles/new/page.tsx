import React from 'react';
import { getProducts } from '@/lib/dataService';
import { ArticleForm } from '@/components/admin/ArticleForm';

export default async function NewArticlePage() {
  const { products } = await getProducts();
  return <ArticleForm availableProducts={products} isEdit={false} />;
}

