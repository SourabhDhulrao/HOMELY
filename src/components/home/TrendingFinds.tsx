import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Product } from '@/lib/types';
import { ProductCard } from '@/components/ui/ProductCard';

interface TrendingFindsProps {
  products: Product[];
}

export function TrendingFinds({ products }: TrendingFindsProps) {
  // Display top trending/featured picks
  const displayProducts = products.slice(0, 8);

  return (
    <section className="py-16 sm:py-24 bg-ivory">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16">
          <div>
            <span className="text-xs uppercase tracking-widest text-terracotta font-semibold mb-2 block">
              Curator’s Selection
            </span>
            <h2 className="font-editorial text-3xl sm:text-4xl text-charcoal font-medium">
              Trending Finds This Month
            </h2>
          </div>
          <Link
            href="/shop"
            className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-charcoal hover:text-terracotta transition-colors mt-4 md:mt-0"
          >
            <span>View All Finds ({products.length})</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {displayProducts.map((product, idx) => (
            <ProductCard key={product.id} product={product} priority={idx < 4} />
          ))}
        </div>
      </div>
    </section>
  );
}

