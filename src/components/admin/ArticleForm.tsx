'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Article, Product } from '@/lib/types';
import { Button } from '@/components/ui/Button';
import { Save, ArrowLeft, AlertCircle } from 'lucide-react';

interface ArticleFormProps {
  initialArticle?: Article;
  availableProducts: Product[];
  isEdit?: boolean;
}

export function ArticleForm({
  initialArticle,
  availableProducts,
  isEdit = false,
}: ArticleFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    id: initialArticle?.id || '',
    title: initialArticle?.title || '',
    slug: initialArticle?.slug || '',
    excerpt: initialArticle?.excerpt || '',
    content: initialArticle?.content || '',
    cover_image: initialArticle?.cover_image || '',
    author: initialArticle?.author || 'HOMELY Editorial Team',
    read_time: initialArticle?.read_time || '5 min read',
    published: initialArticle?.published ?? true,
    featured_product_ids: initialArticle?.featured_product_ids || [],
  });

  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const toggleProduct = (productId: string) => {
    setFormData((prev) => {
      const exists = prev.featured_product_ids.includes(productId);
      return {
        ...prev,
        featured_product_ids: exists
          ? prev.featured_product_ids.filter((id) => id !== productId)
          : [...prev.featured_product_ids, productId],
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErrorMsg('');

    try {
      const url = isEdit ? `/api/articles/${formData.id}` : '/api/articles';
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        router.push('/admin/articles');
        router.refresh();
      } else {
        setErrorMsg(data.error || 'Failed to save article.');
      }
    } catch {
      setErrorMsg('Network error while saving article.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl">
      <div className="flex items-center justify-between pb-6 border-b border-softborder">
        <div>
          <Link
            href="/admin/articles"
            className="inline-flex items-center gap-1 text-xs text-warmgrey hover:text-charcoal mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Articles</span>
          </Link>
          <h1 className="font-editorial text-3xl font-medium text-charcoal">
            {isEdit ? 'Edit Journal Essay' : 'Write New Journal Essay'}
          </h1>
        </div>

        <Button type="submit" variant="primary" disabled={saving} className="px-6 py-2.5">
          <Save className="w-4 h-4 mr-1.5" />
          <span>{saving ? 'Saving...' : 'Save Article'}</span>
        </Button>
      </div>

      {errorMsg && (
        <div className="p-4 bg-terracotta-50 border border-terracotta-200 text-terracotta rounded-sm text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6 bg-purewhite p-6 sm:p-8 rounded-sm border border-softborder shadow-subtle">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal mb-1.5">
              Article Title *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Small Kitchen Organization Ideas for Indian Apartments"
              className="w-full bg-ivory-50 border border-softborder focus:border-charcoal focus:outline-none text-charcoal text-sm p-3 rounded-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal mb-1.5">
              Excerpt / Summary *
            </label>
            <textarea
              required
              rows={3}
              value={formData.excerpt}
              onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
              placeholder="Brief overview displayed on journal cards and search snippets..."
              className="w-full bg-ivory-50 border border-softborder focus:border-charcoal focus:outline-none text-charcoal text-sm p-3 rounded-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal mb-1.5">
              Article Content (Markdown supported) *
            </label>
            <textarea
              required
              rows={14}
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              placeholder="Write your editorial essay here. Use ## for headings, > for quotes..."
              className="w-full bg-ivory-50 border border-softborder focus:border-charcoal focus:outline-none text-charcoal text-sm p-3 rounded-sm font-mono text-xs leading-relaxed"
            />
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-purewhite p-6 rounded-sm border border-softborder shadow-subtle space-y-4">
            <h3 className="font-editorial text-lg font-medium text-charcoal pb-2 border-b border-softborder">
              Cover & Publishing
            </h3>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal mb-1.5">
                Cover Image URL *
              </label>
              <input
                type="url"
                required
                value={formData.cover_image}
                onChange={(e) => setFormData({ ...formData, cover_image: e.target.value })}
                placeholder="https://images.unsplash.com/..."
                className="w-full bg-ivory-50 border border-softborder focus:border-charcoal focus:outline-none text-charcoal text-xs p-2.5 rounded-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal mb-1.5">
                Author Name
              </label>
              <input
                type="text"
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                className="w-full bg-ivory-50 border border-softborder focus:border-charcoal focus:outline-none text-charcoal text-xs p-2.5 rounded-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal mb-1.5">
                Read Time
              </label>
              <input
                type="text"
                value={formData.read_time}
                onChange={(e) => setFormData({ ...formData, read_time: e.target.value })}
                placeholder="e.g. 5 min read"
                className="w-full bg-ivory-50 border border-softborder focus:border-charcoal focus:outline-none text-charcoal text-xs p-2.5 rounded-sm"
              />
            </div>

            <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-charcoal pt-2">
              <input
                type="checkbox"
                checked={formData.published}
                onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                className="rounded text-terracotta focus:ring-terracotta"
              />
              <span>Publish Live in Journal</span>
            </label>
          </div>

          <div className="bg-purewhite p-6 rounded-sm border border-softborder shadow-subtle space-y-4">
            <h3 className="font-editorial text-lg font-medium text-charcoal pb-2 border-b border-softborder">
              Embedded Products
            </h3>
            <p className="text-[11px] text-warmgrey">
              Select products to showcase inside this article with instant Amazon affiliate links:
            </p>
            <div className="max-h-60 overflow-y-auto space-y-2 text-xs">
              {availableProducts.map((p) => {
                const isSelected = formData.featured_product_ids.includes(p.id);
                return (
                  <label
                    key={p.id}
                    className="flex items-center gap-2 p-2 rounded bg-ivory-50 hover:bg-ivory cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleProduct(p.id)}
                      className="rounded text-terracotta"
                    />
                    <span className="truncate text-charcoal">{p.name}</span>
                  </label>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}

