import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Clock } from 'lucide-react';
import { Article } from '@/lib/types';

interface JournalPreviewProps {
  articles: Article[];
}

export function JournalPreview({ articles }: JournalPreviewProps) {
  const displayArticles = articles.slice(0, 3);

  return (
    <section className="py-16 sm:py-24 bg-ivory">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16">
          <div>
            <span className="text-xs uppercase tracking-widest text-terracotta font-semibold mb-2 block">
              Editorial Dispatches
            </span>
            <h2 className="font-editorial text-3xl sm:text-4xl text-charcoal font-medium">
              From The HOMELY Journal
            </h2>
          </div>
          <Link
            href="/journal"
            className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-charcoal hover:text-terracotta transition-colors mt-4 md:mt-0"
          >
            <span>Read All Articles</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {displayArticles.map((article) => (
            <article
              key={article.id}
              className="group flex flex-col bg-purewhite rounded-sm border border-softborder overflow-hidden hover:shadow-card transition-all"
            >
              <Link href={`/journal/${article.slug}`} className="block relative aspect-[16/10] overflow-hidden bg-ivory-100">
                <Image
                  src={article.cover_image}
                  alt={article.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                />
              </Link>

              <div className="p-6 flex flex-col flex-grow justify-between">
                <div>
                  <div className="flex items-center gap-3 text-[11px] text-warmgrey uppercase tracking-wider mb-2.5 font-medium">
                    <span>{article.author}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {article.read_time || '5 min read'}
                    </span>
                  </div>

                  <h3 className="font-editorial text-xl font-medium text-charcoal group-hover:text-terracotta transition-colors mb-3 leading-snug">
                    <Link href={`/journal/${article.slug}`}>
                      {article.title}
                    </Link>
                  </h3>

                  <p className="text-xs sm:text-sm text-charcoal/70 line-clamp-3 leading-relaxed mb-6">
                    {article.excerpt}
                  </p>
                </div>

                <Link
                  href={`/journal/${article.slug}`}
                  className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-terracotta hover:text-terracotta-700 transition-colors pt-3 border-t border-softborder/60"
                >
                  <span>Read Article</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

