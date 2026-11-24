import React from 'react';
import { getCategories } from '@/lib/dataService';
import { ProductForm } from '@/components/admin/ProductForm';

export default async function NewProductPage() {
  const categories = await getCategories();
  return <ProductForm categories={categories} isEdit={false} />;
}

