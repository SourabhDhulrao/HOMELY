import React from 'react';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getArticleBySlug, getArticles, getProducts } from '@/lib/dataService';
import { ProductCard } from '@/components/ui/ProductCard';
import { PinterestButton } from '@/components/ui/PinterestButton';
import { AffiliateNotice } from '@/components/ui/AffiliateNotice';
import { Clock, ChevronRight, ArrowLeft } from 'lucide-react';

interface ArticlePageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const article = await getArticleBySlug(params.slug);
  if (!article) return { title: 'Article Not Found | HOMELY' };

  return {
    title: `${article.title} | HOMELY Journal`,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      type: 'article',
      images: [{ url: article.cover_image }],
    },
  };
}

export async function generateStaticParams() {
  const articles = await getArticles();
  return articles.map((a) => ({ slug: a.slug }));
}

export default async function ArticleDetailPage({ params }: ArticlePageProps) {
  const article = await getArticleBySlug(params.slug);
  if (!article) {
    notFound();
  }

  // Fetch featured products mentioned in this article
  const { products: allProducts } = await getProducts();
  const featuredProducts = allProducts.filter((p) =>
    article.featured_product_ids?.includes(p.id)
  );

  return (
    <article className="py-8 sm:py-16 bg-ivory">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-warmgrey mb-8">
          <Link href="/" className="hover:text-charcoal transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href="/journal" className="hover:text-charcoal transition-colors">
            The Journal
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-charcoal font-medium truncate max-w-xs">{article.title}</span>
        </nav>

        {/* Article Header */}
        <header className="mb-10 text-center sm:text-left space-y-4">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-xs text-warmgrey uppercase tracking-wider font-medium">
            <span>By {article.author}</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {article.read_time || '5 min read'}
            </span>
          </div>

          <h1 className="font-editorial text-3xl sm:text-4xl lg:text-5xl text-charcoal font-medium leading-[1.18]">
            {article.title}
          </h1>

          <p className="text-base sm:text-lg text-charcoal/80 leading-relaxed font-sans max-w-2xl">
            {article.excerpt}
          </p>

          <div className="pt-2 flex items-center justify-center sm:justify-start gap-3">
            <PinterestButton
              url={`https://homelyliving.in/journal/${article.slug}`}
              media={article.cover_image}
              description={`${article.title} — HOMELY Journal`}
              size="sm"
            />
          </div>
        </header>

        {/* Hero Cover Image */}
        <div className="relative aspect-[16/9] rounded-sm overflow-hidden border border-softborder bg-ivory-200 mb-12 shadow-card">
          <Image
            src={article.cover_image}
            alt={article.title}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 896px"
            className="object-cover"
          />
        </div>

        {/* Article Body Content */}
        <div className="bg-purewhite p-6 sm:p-10 rounded-sm border border-softborder shadow-subtle mb-12 prose prose-stone max-w-none">
          <div className="space-y-6 text-charcoal/85 leading-relaxed text-sm sm:text-base font-sans">
            {article.content.split('\n\n').map((paragraph, idx) => {
              const trimmed = paragraph.trim();
              if (trimmed.startsWith('## ')) {
                return (
                  <h2 key={idx} className="font-editorial text-2xl sm:text-3xl font-medium text-charcoal mt-8 mb-4">
                    {trimmed.replace('## ', '')}
                  </h2>
                );
              }
              if (trimmed.startsWith('### ')) {
                return (
                  <h3 key={idx} className="font-editorial text-xl font-medium text-charcoal mt-6 mb-3">
                    {trimmed.replace('### ', '')}
                  </h3>
                );
              }
              if (trimmed.startsWith('> ')) {
                return (
                  <blockquote
                    key={idx}
                    className="p-4 sm:p-6 my-6 border-l-4 border-terracotta bg-ivory-50 rounded-r text-base sm:text-lg font-accent italic text-charcoal"
                  >
                    {trimmed.replace('> ', '').replace(/^"|"$/g, '')}
                  </blockquote>
                );
              }
              return (
                <p key={idx} className="leading-relaxed">
                  {trimmed}
                </p>
              );
            })}
          </div>
        </div>

        {/* Featured Products in this Article */}
        {featuredProducts.length > 0 && (
          <section className="mb-12">
            <div className="mb-6">
              <span className="text-xs uppercase tracking-widest text-terracotta font-semibold block mb-1">
                Shop The Story
              </span>
              <h3 className="font-editorial text-2xl text-charcoal font-medium">
                Objects Recommended in this Guide
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProducts.map((prod) => (
                <ProductCard key={prod.id} product={prod} />
              ))}
            </div>
          </section>
        )}

        {/* Bottom Navigation & Affiliate Disclosure */}
        <div className="space-y-6 pt-6 border-t border-softborder">
          <Link
            href="/journal"
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-charcoal hover:text-terracotta transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to The HOMELY Journal</span>
          </Link>

          <AffiliateNotice />
        </div>
      </div>
    </article>
  );
}

