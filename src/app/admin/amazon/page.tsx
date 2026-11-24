import React from 'react';
import { getCategories } from '@/lib/dataService';
import { isAmazonApiConfigured, getCreatorsApiConfig } from '@/lib/amazonCreatorsApi';
import { AmazonToolClient } from './AmazonToolClient';

export default async function AdminAmazonToolPage() {
  const categories = await getCategories();
  const isConfigured = isAmazonApiConfigured();
  const config = getCreatorsApiConfig();

  return (
    <AmazonToolClient
      categories={categories}
      isConfigured={isConfigured}
      config={config}
    />
  );
}

