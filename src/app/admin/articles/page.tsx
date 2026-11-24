import React from 'react';
import { getAllAdminArticles } from '@/lib/dataService';
import { ArticleListClient } from './ArticleListClient';

export default async function AdminArticlesPage() {
  const articles = await getAllAdminArticles();
  return <ArticleListClient initialArticles={articles} />;
}

