'use client';

import React from 'react';
import { ExternalLink, Heart, AlertTriangle } from 'lucide-react';
import { Product } from '@/lib/types';
import { useWishlist } from '@/context/WishlistContext';
import { Button } from '@/components/ui/Button';
import { cn, isValidAmazonIndiaUrl } from '@/lib/utils';

export function ProductDetailClient({ product }: { product: Product }) {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const wishlisted = isInWishlist(product.id);

  const hasValidAmazonUrl = Boolean(
    product.amazon_affiliate_url && isValidAmazonIndiaUrl(product.amazon_affiliate_url)
  );

  return (
    <div className="space-y-4 pt-1">
      {/* Primary Customer Amazon CTA + Wishlist */}
      <div className="flex flex-col sm:flex-row gap-3">
        {hasValidAmazonUrl ? (
          <Button
            href={product.amazon_affiliate_url}
            external
            variant="primary"
            size="lg"
            className="flex-1 text-sm sm:text-base font-semibold shadow-md py-4 justify-center"
          >
            <span>Check Latest Price on Amazon</span>
            <ExternalLink className="w-4 h-4 ml-1.5" />
          </Button>
        ) : (
          <button
            disabled
            className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-4 rounded-sm bg-ivory-200 text-charcoal/50 border border-softborder text-sm sm:text-base font-semibold cursor-not-allowed opacity-80"
          >
            <span>Amazon Link Unavailable</span>
          </button>
        )}

        <button
          onClick={() => toggleWishlist(product)}
          aria-label={wishlisted ? 'Remove from Wishlist' : 'Save to Wishlist'}
          className={cn(
            'inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-sm border text-sm font-medium transition-all duration-200',
            wishlisted
              ? 'bg-terracotta text-purewhite border-terracotta shadow-sm'
              : 'bg-purewhite border-softborder text-charcoal hover:bg-ivory hover:border-warmgrey'
          )}
        >
          <Heart className={cn('w-4 h-4 transition-transform duration-200', wishlisted ? 'fill-current scale-110' : '')} />
          <span>{wishlisted ? 'Saved' : 'Save for Later'}</span>
        </button>
      </div>

      {/* Admin Notice if Amazon link is missing */}
      {!hasValidAmazonUrl && (
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-sm text-xs text-amber-800 flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 flex-shrink-0 text-amber-600 mt-0.5" />
          <div>
            <p className="font-semibold">Amazon Affiliate Link Missing</p>
            <p className="text-[11px] text-amber-700 mt-0.5">
              This product does not have a verified Amazon India affiliate link configured. The purchase button is disabled until an exact URL is added in the Admin dashboard.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
