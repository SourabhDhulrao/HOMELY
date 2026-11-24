import React from 'react';
import { notFound } from 'next/navigation';
import { getAllAdminArticles, getProducts } from '@/lib/dataService';
import { ArticleForm } from '@/components/admin/ArticleForm';

interface EditArticlePageProps {
  params: { id: string };
}

export default async function EditArticlePage({ params }: EditArticlePageProps) {
  const [articles, { products }] = await Promise.all([
    getAllAdminArticles(),
    getProducts(),
  ]);

  const article = articles.find((a) => a.id === params.id);
  if (!article) {
    notFound();
  }

  return <ArticleForm initialArticle={article} availableProducts={products} isEdit={true} />;
}

