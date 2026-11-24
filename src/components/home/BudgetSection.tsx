'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Tag } from 'lucide-react';
import { Product } from '@/lib/types';
import { ProductCard } from '@/components/ui/ProductCard';
import { cn } from '@/lib/utils';

interface BudgetSectionProps {
  products: Product[];
}

type BudgetTier = 'under-299' | 'under-499' | 'under-999' | 'under-1499';

export function BudgetSection({ products }: BudgetSectionProps) {
  const [activeTier, setActiveTier] = useState<BudgetTier>('under-499');

  // Filter ONLY products with verified current prices
  const verifiedProducts = products.filter(
    (p) => p.price_amount !== null && p.price_amount !== undefined
  );

  const getFilteredProducts = (tier: BudgetTier) => {
    switch (tier) {
      case 'under-299':
        return verifiedProducts.filter((p) => (p.price_amount as number) <= 299);
      case 'under-499':
        return verifiedProducts.filter((p) => (p.price_amount as number) <= 499);
      case 'under-999':
        return verifiedProducts.filter((p) => (p.price_amount as number) <= 999);
      case 'under-1499':
        return verifiedProducts.filter((p) => (p.price_amount as number) <= 1499);
      default:
        return verifiedProducts;
    }
  };

  const currentProducts = getFilteredProducts(activeTier).slice(0, 4);

  const tiers: { id: BudgetTier; label: string; desc: string }[] = [
    { id: 'under-299', label: 'Under ₹299', desc: 'Hooks, organizers, and little details' },
    { id: 'under-499', label: 'Under ₹499', desc: 'Apothecary glass, desk pads, and diffusers' },
    { id: 'under-999', label: 'Under ₹999', desc: 'Sculptural vases, turntable racks, linen bins' },
    { id: 'under-1499', label: 'Under ₹1,499', desc: 'Paper lanterns, rolling carts, arched mirrors' },
  ];

  return (
    <section className="py-16 sm:py-24 bg-purewhite border-y border-softborder">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-12">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-terracotta font-semibold mb-2">
              <Tag className="w-3.5 h-3.5" />
              <span>Affordable Everyday Luxury</span>
            </div>
            <h2 className="font-editorial text-3xl sm:text-4xl text-charcoal font-medium">
              Shop by Verified Budget
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-charcoal/70 max-w-md mt-3 md:mt-0 leading-relaxed">
            Good design does not need to cost thousands. All prices shown in these tiers are verified and current on Amazon India.
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex flex-wrap gap-2.5 sm:gap-3 mb-10 pb-2 border-b border-softborder">
          {tiers.map((tier) => {
            const isActive = activeTier === tier.id;
            return (
              <button
                key={tier.id}
                onClick={() => setActiveTier(tier.id)}
                className={cn(
                  'px-4 py-2.5 rounded-sm text-xs sm:text-sm font-medium transition-all duration-200 border',
                  isActive
                    ? 'bg-terracotta text-purewhite border-terracotta shadow-sm'
                    : 'bg-ivory border-softborder text-charcoal/80 hover:bg-purewhite hover:border-warmgrey'
                )}
              >
                {tier.label}
              </button>
            );
          })}
        </div>

        {/* Product Grid */}
        {currentProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {currentProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-ivory-50 rounded border border-softborder">
            <p className="text-sm text-warmgrey">
              No products found in this verified price tier.
            </p>
          </div>
        )}

        <div className="mt-12 text-center">
          <Link
            href={`/budget-finds?tier=${activeTier}`}
            className="inline-flex items-center gap-2 text-xs uppercase tracking-wider font-semibold text-terracotta hover:text-terracotta-700 transition-colors"
          >
            <span>Explore all {tiers.find((t) => t.id === activeTier)?.label} products</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

