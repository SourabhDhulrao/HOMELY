'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Plus, Edit2, Trash2, Eye, Clock } from 'lucide-react';
import { Article } from '@/lib/types';

export function ArticleListClient({ initialArticles }: { initialArticles: Article[] }) {
  const [articles, setArticles] = useState<Article[]>(initialArticles);

  const handleTogglePublish = async (id: string, current: boolean) => {
    const updated = articles.map((a) => (a.id === id ? { ...a, published: !current } : a));
    setArticles(updated);

    await fetch(`/api/articles/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ published: !current }),
    });
  };

  const handleDelete = async (id: string, title: string) => {
    if (confirm(`Are you sure you want to delete article "${title}"?`)) {
      setArticles(articles.filter((a) => a.id !== id));
      await fetch(`/api/articles/${id}`, { method: 'DELETE' });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-softborder">
        <div>
          <span className="text-xs uppercase tracking-widest text-terracotta font-semibold block">
            Content Studio
          </span>
          <h1 className="font-editorial text-3xl font-medium text-charcoal">
            Journal Articles ({articles.length})
          </h1>
        </div>
        <Link
          href="/admin/articles/new"
          className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-terracotta text-purewhite rounded-sm text-xs uppercase font-medium hover:bg-terracotta-600 transition-colors shadow-sm self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Write New Article</span>
        </Link>
      </div>

      <div className="bg-purewhite rounded-sm border border-softborder shadow-subtle overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-ivory-50 border-b border-softborder text-warmgrey uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Cover</th>
                <th className="py-3 px-4">Title & Excerpt</th>
                <th className="py-3 px-4">Author</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-softborder/60">
              {articles.map((art) => (
                <tr key={art.id} className="hover:bg-ivory-50/50">
                  <td className="py-3.5 px-4">
                    <div className="relative w-16 h-10 rounded overflow-hidden bg-ivory-100 border border-softborder">
                      <Image src={art.cover_image} alt={art.title} fill sizes="64px" className="object-cover" />
                    </div>
                  </td>

                  <td className="py-3.5 px-4 max-w-sm">
                    <p className="font-semibold text-charcoal truncate">{art.title}</p>
                    <p className="text-[11px] text-warmgrey truncate mt-0.5">{art.excerpt}</p>
                  </td>

                  <td className="py-3.5 px-4 text-charcoal/80">
                    {art.author}
                  </td>

                  <td className="py-3.5 px-4 text-center">
                    <button
                      onClick={() => handleTogglePublish(art.id, art.published)}
                      className={`px-2.5 py-1 rounded text-[10px] font-semibold uppercase tracking-wider transition-colors ${
                        art.published
                          ? 'bg-sage-100 text-sage-800 hover:bg-sage-200'
                          : 'bg-ivory-200 text-charcoal/60 hover:bg-ivory-300'
                      }`}
                    >
                      {art.published ? 'Published' : 'Draft'}
                    </button>
                  </td>

                  <td className="py-3.5 px-4 text-right space-x-2">
                    <Link
                      href={`/journal/${art.slug}`}
                      target="_blank"
                      aria-label="View live article"
                      className="inline-block p-1 text-warmgrey hover:text-charcoal"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                    <Link
                      href={`/admin/articles/${art.id}`}
                      aria-label="Edit article"
                      className="inline-block p-1 text-warmgrey hover:text-charcoal"
                    >
                      <Edit2 className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => handleDelete(art.id, art.title)}
                      aria-label="Delete article"
                      className="p-1 text-warmgrey hover:text-terracotta"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

