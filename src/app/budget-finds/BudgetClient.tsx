'use client';

import React, { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Product } from '@/lib/types';
import { ProductCard } from '@/components/ui/ProductCard';
import { AffiliateNotice } from '@/components/ui/AffiliateNotice';
import { Tag, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BudgetClientProps {
  products: Product[];
}

export function BudgetClient({ products }: BudgetClientProps) {
  const searchParams = useSearchParams();
  const initialTier = searchParams.get('tier') || 'all';
  const [activeTier, setActiveTier] = useState<string>(initialTier);

  // Strict check: Only products with verified current prices
  const verifiedProducts = products.filter(
    (p) => p.price_amount !== null && p.price_amount !== undefined
  );

  const filteredProducts = verifiedProducts.filter((p) => {
    if (activeTier === 'all') return true;
    const price = p.price_amount as number;
    switch (activeTier) {
      case 'under-299':
        return price <= 299;
      case 'under-499':
        return price <= 499;
      case 'under-999':
        return price <= 999;
      case 'under-1499':
        return price <= 1499;
      default:
        return true;
    }
  });

  const tiers = [
    { id: 'all', label: 'All Budget Finds', count: verifiedProducts.length },
    {
      id: 'under-299',
      label: 'Under ₹299',
      count: verifiedProducts.filter((p) => (p.price_amount as number) <= 299).length,
    },
    {
      id: 'under-499',
      label: 'Under ₹499',
      count: verifiedProducts.filter((p) => (p.price_amount as number) <= 499).length,
    },
    {
      id: 'under-999',
      label: 'Under ₹999',
      count: verifiedProducts.filter((p) => (p.price_amount as number) <= 999).length,
    },
    {
      id: 'under-1499',
      label: 'Under ₹1,499',
      count: verifiedProducts.filter((p) => (p.price_amount as number) <= 1499).length,
    },
  ];

  return (
    <div className="py-10 sm:py-16 bg-ivory">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-terracotta-50 text-terracotta rounded-full text-xs font-semibold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Value Meets Good Taste</span>
          </div>
          <h1 className="font-editorial text-3xl sm:text-4xl lg:text-5xl text-charcoal font-medium mb-3">
            Budget Finds for Indian Homes
          </h1>
          <p className="text-sm sm:text-base text-charcoal/75 leading-relaxed">
            Beautiful everyday living should not require a luxury budget. Every piece in this directory has a verified price under ₹1,499 on Amazon India, chosen strictly for durability and design elegance.
          </p>
        </div>

        {/* Tier Buttons */}
        <div className="flex flex-wrap gap-2.5 sm:gap-3 mb-10 pb-4 border-b border-softborder">
          {tiers.map((tier) => (
            <button
              key={tier.id}
              onClick={() => setActiveTier(tier.id)}
              className={cn(
                'px-4 py-2.5 rounded-sm text-xs sm:text-sm font-medium transition-all duration-200 border flex items-center gap-2',
                activeTier === tier.id
                  ? 'bg-terracotta text-purewhite border-terracotta shadow-sm'
                  : 'bg-purewhite border-softborder text-charcoal/80 hover:bg-ivory hover:border-warmgrey'
              )}
            >
              <span>{tier.label}</span>
              <span
                className={cn(
                  'text-[11px] px-1.5 py-0.2 rounded-full',
                  activeTier === tier.id ? 'bg-purewhite/20 text-purewhite' : 'bg-ivory-200 text-charcoal/60'
                )}
              >
                {tier.count}
              </span>
            </button>
          ))}
        </div>

        {/* Product Grid */}
        <div className="space-y-6">
          <div className="flex items-center justify-between text-xs text-warmgrey">
            <span>
              Showing <strong className="text-charcoal">{filteredProducts.length}</strong> verified budget pieces
            </span>
          </div>

          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="bg-purewhite p-12 text-center rounded border border-softborder">
              <p className="text-sm text-warmgrey">No products found in this price category.</p>
            </div>
          )}
        </div>

        <div className="mt-16 pt-8 border-t border-softborder">
          <AffiliateNotice />
        </div>
      </div>
    </div>
  );
}

