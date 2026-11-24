import React from 'react';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { getArticles } from '@/lib/dataService';
import { ArrowRight, Clock, BookOpen } from 'lucide-react';

export const metadata: Metadata = {
  title: 'The HOMELY Journal — Thoughtful Living & Organizing Ideas',
  description:
    'Editorial essays, rental apartment styling tips, small kitchen hacks, and curated guides for modern Indian homes.',
};

export default async function JournalPage() {
  const articles = await getArticles();
  const featured = articles[0];
  const rest = articles.slice(1);

  return (
    <div className="py-10 sm:py-16 bg-ivory">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-sage-100 text-sage-800 rounded-full text-xs font-semibold uppercase tracking-wider mb-3">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Editorial Essays & Guides</span>
          </div>
          <h1 className="font-editorial text-3xl sm:text-4xl lg:text-5xl text-charcoal font-medium mb-3">
            The HOMELY Journal
          </h1>
          <p className="text-sm sm:text-base text-charcoal/75 leading-relaxed">
            Thoughtful perspectives on making room for slow, organized, and beautiful living in contemporary Indian homes.
          </p>
        </div>

        {/* Featured Top Article */}
        {featured && (
          <div className="bg-purewhite rounded-sm border border-softborder overflow-hidden shadow-subtle hover:shadow-card transition-shadow mb-16">
            <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
              <div className="lg:col-span-7 relative aspect-[16/10] bg-ivory-100">
                <Image
                  src={featured.cover_image}
                  alt={featured.title}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  className="object-cover"
                />
              </div>
              <div className="lg:col-span-5 p-6 sm:p-10 space-y-4">
                <div className="flex items-center gap-2 text-xs text-warmgrey uppercase tracking-wider font-medium">
                  <span>Featured Dispatch</span>
                  <span>•</span>
                  <span>{featured.read_time || '5 min read'}</span>
                </div>
                <h2 className="font-editorial text-2xl sm:text-3xl text-charcoal font-medium leading-snug hover:text-terracotta transition-colors">
                  <Link href={`/journal/${featured.slug}`}>
                    {featured.title}
                  </Link>
                </h2>
                <p className="text-xs sm:text-sm text-charcoal/80 leading-relaxed line-clamp-3">
                  {featured.excerpt}
                </p>
                <div className="pt-2">
                  <Link
                    href={`/journal/${featured.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-terracotta hover:text-terracotta-700 transition-colors"
                  >
                    <span>Read Full Essay</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {rest.map((article) => (
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
                      {article.read_time || '4 min read'}
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
                  <span>Read Essay</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}

