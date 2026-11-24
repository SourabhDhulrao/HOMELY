import React from 'react';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getCategoryBySlug, getCategories, getProducts } from '@/lib/dataService';
import { ProductCard } from '@/components/ui/ProductCard';
import { PinterestButton } from '@/components/ui/PinterestButton';
import { AffiliateNotice } from '@/components/ui/AffiliateNotice';
import { ArrowLeft, ChevronRight } from 'lucide-react';

interface CategoryPageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const category = await getCategoryBySlug(params.slug);
  if (!category) return { title: 'Category Not Found | HOMELY' };

  return {
    title: `${category.name} — Curated Finds | HOMELY`,
    description: category.description,
    openGraph: {
      title: `${category.name} | HOMELY`,
      description: category.description,
      images: [{ url: category.image_url }],
    },
  };
}

export async function generateStaticParams() {
  const categories = await getCategories();
  return categories.map((c) => ({ slug: c.slug }));
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const [category, productsRes] = await Promise.all([
    getCategoryBySlug(params.slug),
    getProducts({ category: params.slug }),
  ]);

  if (!category) {
    notFound();
  }

  const products = productsRes.products;

  return (
    <div className="py-8 sm:py-12 bg-ivory">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-warmgrey mb-6">
          <Link href="/" className="hover:text-charcoal transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href="/shop" className="hover:text-charcoal transition-colors">
            Shop
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-charcoal font-medium">{category.name}</span>
        </nav>

        {/* Editorial Category Hero Banner */}
        <div className="relative rounded-sm overflow-hidden border border-softborder bg-purewhite shadow-card mb-12 sm:mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
            <div className="lg:col-span-7 p-6 sm:p-10 lg:p-12 space-y-4">
              <span className="text-xs uppercase tracking-widest text-terracotta font-semibold block">
                Living Collection
              </span>
              <h1 className="font-editorial text-3xl sm:text-4xl lg:text-5xl text-charcoal font-medium">
                {category.name}
              </h1>
              <p className="text-sm sm:text-base text-charcoal/75 max-w-xl leading-relaxed">
                {category.description}
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-4">
                <PinterestButton
                  url={`https://homelyliving.in/category/${category.slug}`}
                  media={category.image_url}
                  description={`Curated ${category.name} collection for modern Indian homes.`}
                />
                <span className="text-xs text-warmgrey">
                  {products.length} {products.length === 1 ? 'Find' : 'Finds'} Curated
                </span>
              </div>
            </div>

            <div className="lg:col-span-5 relative aspect-[16/9] lg:aspect-[4/3] bg-ivory-200">
              <Image
                src={category.image_url}
                alt={category.name}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {products.length > 0 ? (
          <div className="space-y-8">
            <div className="flex items-center justify-between text-xs text-warmgrey">
              <span>Showing {products.length} curated pieces</span>
              <Link href="/shop" className="inline-flex items-center gap-1 hover:text-charcoal text-terracotta">
                <ArrowLeft className="w-3 h-3" />
                <span>Explore all categories</span>
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-purewhite rounded-sm border border-softborder p-12 text-center space-y-4">
            <h3 className="font-editorial text-xl text-charcoal font-medium">
              New curation coming soon
            </h3>
            <p className="text-xs sm:text-sm text-charcoal/70 max-w-md mx-auto leading-relaxed">
              Our editorial team is currently evaluating new pieces for this collection. Check back shortly or browse our other categories.
            </p>
            <Link
              href="/shop"
              className="inline-block px-5 py-2.5 bg-terracotta text-purewhite rounded-sm text-xs uppercase font-medium hover:bg-terracotta-600 transition-colors"
            >
              Browse All Finds
            </Link>
          </div>
        )}

        {/* Compliance */}
        <div className="mt-16 pt-8 border-t border-softborder">
          <AffiliateNotice />
        </div>
      </div>
    </div>
  );
}

