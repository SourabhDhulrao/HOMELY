import React from 'react';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getProductBySlug, getProducts } from '@/lib/dataService';
import { formatINR } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { AffiliateNotice } from '@/components/ui/AffiliateNotice';
import { PinterestButton } from '@/components/ui/PinterestButton';
import { ProductCard } from '@/components/ui/ProductCard';
import { ProductDetailClient } from './ProductDetailClient';
import { ProductGallery } from '@/components/product/ProductGallery';
import {
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Truck,
  RotateCcw,
  Sparkles,
  Info,
} from 'lucide-react';

interface ProductPageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const product = await getProductBySlug(params.slug);
  if (!product) return { title: 'Product Not Found | HOMELY' };

  return {
    title: `${product.name} | HOMELY`,
    description: product.description.slice(0, 160),
    openGraph: {
      title: product.name,
      description: product.description.slice(0, 160),
      images: [{ url: product.image_url }],
    },
  };
}

export async function generateStaticParams() {
  const { products } = await getProducts();
  return products.map((p) => ({ slug: p.slug }));
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const product = await getProductBySlug(params.slug);
  if (!product) {
    notFound();
  }

  // Related products from the same category
  const { products: allProducts } = await getProducts();
  const related = allProducts
    .filter((p) => p.category_id === product.category_id && p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="py-8 sm:py-12 bg-ivory">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-warmgrey mb-8 overflow-x-auto whitespace-nowrap">
          <Link href="/" className="hover:text-charcoal transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href="/shop" className="hover:text-charcoal transition-colors">
            Shop
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link
            href={`/category/${product.category_slug || 'home-decor'}`}
            className="hover:text-charcoal transition-colors"
          >
            {product.category_name || 'Category'}
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-charcoal font-medium truncate max-w-xs">{product.name}</span>
        </nav>

        {/* Product Hero Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 mb-16 items-start">
          {/* Left Column: Image Gallery & Pinterest */}
          <div className="lg:col-span-6 space-y-4">
            <ProductGallery
              images={product.images}
              fallbackImage={product.image_url}
              alt={product.image_alt || product.name}
              editorialLabel={product.editorial_label}
            />

            {/* Social Share & Pin Row */}
            <div className="flex items-center justify-between p-3.5 bg-purewhite rounded-sm border border-softborder text-xs">
              <span className="text-charcoal/80 font-medium">Love this aesthetic find?</span>
              <PinterestButton
                url={`https://homelyliving.in/product/${product.slug}`}
                media={product.image_url}
                description={`${product.name} — Recommended on HOMELY`}
                size="sm"
              />
            </div>
          </div>

          {/* Right Column: Editorial Details & CTA */}
          <div className="lg:col-span-6 space-y-6">
            <div>
              <span className="text-xs uppercase tracking-widest text-terracotta font-semibold block mb-2">
                {product.category_name}
              </span>
              <h1 className="font-editorial text-2xl sm:text-3xl lg:text-4xl text-charcoal font-medium leading-snug mb-3">
                {product.name}
              </h1>

              {/* Verified Pricing Block */}
              <div className="flex items-baseline gap-3 mb-4">
                {product.price_amount !== null ? (
                  <>
                    <span className="font-editorial text-3xl font-semibold text-charcoal">
                      {formatINR(product.price_amount)}
                    </span>
                    <span className="text-xs text-warmgrey">
                      Verified Amazon India Price
                    </span>
                  </>
                ) : (
                  <span className="text-sm font-medium text-sage-600">
                    Verified price updates dynamically on Amazon India
                  </span>
                )}
              </div>

              <p className="text-sm sm:text-base text-charcoal/80 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Interactive Wishlist & CTA Section */}
            <ProductDetailClient product={product} />

            {/* Why We Selected It Editorial Card */}
            <div className="bg-purewhite p-5 rounded-sm border border-softborder shadow-subtle space-y-2">
              <div className="flex items-center gap-1.5 text-xs uppercase font-semibold text-terracotta tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Our Editorial Take</span>
              </div>
              <p className="text-xs sm:text-sm text-charcoal/85 leading-relaxed italic">
                &ldquo;{product.editorial_note}&rdquo;
              </p>
              <div className="pt-2 text-xs text-charcoal/80 border-t border-softborder/60">
                <strong className="text-charcoal font-semibold">Best Suited For: </strong>
                <span>{product.best_for}</span>
              </div>
            </div>

            {/* Specifications if available */}
            {product.specs && Object.keys(product.specs).length > 0 && (
              <div className="bg-purewhite p-5 rounded-sm border border-softborder">
                <h3 className="text-xs uppercase tracking-wider font-semibold text-charcoal mb-3">
                  Key Specifications
                </h3>
                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {Object.entries(product.specs).map(([label, val]) => (
                    <div key={label} className="border-b border-softborder/50 pb-2">
                      <dt className="text-warmgrey font-medium">{label}</dt>
                      <dd className="text-charcoal font-semibold mt-0.5">{val}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}

            {/* Fulfillment & Trust Highlights */}
            <div className="grid grid-cols-3 gap-3 p-4 bg-ivory-100 rounded-sm border border-softborder text-center text-xs text-charcoal/80">
              <div className="space-y-1">
                <Truck className="w-4 h-4 mx-auto text-sage" />
                <p className="font-semibold text-charcoal">Amazon Delivery</p>
                <p className="text-[10px] text-warmgrey">Pan-India doorstep dispatch</p>
              </div>
              <div className="space-y-1">
                <RotateCcw className="w-4 h-4 mx-auto text-sage" />
                <p className="font-semibold text-charcoal">Standard Returns</p>
                <p className="text-[10px] text-warmgrey">Amazon buyer guarantee</p>
              </div>
              <div className="space-y-1">
                <ShieldCheck className="w-4 h-4 mx-auto text-sage" />
                <p className="font-semibold text-charcoal">Authentic Seller</p>
                <p className="text-[10px] text-warmgrey">Original brand listing</p>
              </div>
            </div>

            {/* Required Affiliate Disclosure near CTA */}
            <AffiliateNotice compact />
          </div>
        </div>

        {/* Related Products Section */}
        {related.length > 0 && (
          <section className="pt-12 border-t border-softborder">
            <div className="flex items-center justify-between mb-8">
              <div>
                <span className="text-xs uppercase tracking-widest text-terracotta font-semibold block mb-1">
                  Complete the Look
                </span>
                <h2 className="font-editorial text-2xl sm:text-3xl text-charcoal font-medium">
                  Related Everyday Finds
                </h2>
              </div>
              <Link
                href={`/category/${product.category_slug}`}
                className="text-xs font-semibold uppercase tracking-wider text-charcoal hover:text-terracotta transition-colors"
              >
                View Category
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              {related.map((rel) => (
                <ProductCard key={rel.id} product={rel} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

