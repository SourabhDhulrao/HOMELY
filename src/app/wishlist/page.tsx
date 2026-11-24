'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, Trash2, ExternalLink, ArrowRight, ArrowLeft } from 'lucide-react';
import { useWishlist } from '@/context/WishlistContext';
import { formatINR } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { AffiliateNotice } from '@/components/ui/AffiliateNotice';

export default function WishlistPage() {
  const { wishlist, removeFromWishlist, clearWishlist } = useWishlist();

  return (
    <div className="py-10 sm:py-16 bg-ivory">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 pb-6 border-b border-softborder">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-terracotta font-semibold mb-2">
              <Heart className="w-3.5 h-3.5 fill-current" />
              <span>Personal Collection</span>
            </div>
            <h1 className="font-editorial text-3xl sm:text-4xl text-charcoal font-medium">
              Saved Finds ({wishlist.length})
            </h1>
          </div>
          {wishlist.length > 0 && (
            <button
              onClick={clearWishlist}
              className="text-xs text-warmgrey hover:text-terracotta underline mt-4 sm:mt-0 transition-colors"
            >
              Clear entire collection
            </button>
          )}
        </div>

        {wishlist.length === 0 ? (
          <div className="bg-purewhite rounded-sm border border-softborder p-12 sm:p-20 text-center max-w-xl mx-auto space-y-4 shadow-subtle">
            <div className="w-16 h-16 mx-auto rounded-full bg-ivory-200 flex items-center justify-center text-warmgrey">
              <Heart className="w-7 h-7" />
            </div>
            <h2 className="font-editorial text-2xl text-charcoal font-medium">
              You haven&apos;t saved any finds yet
            </h2>
            <p className="text-xs sm:text-sm text-charcoal/70 leading-relaxed max-w-sm mx-auto">
              When browsing through our catalogue, tap the heart icon on any piece you love. Your selections will be saved here on your device without needing an account.
            </p>
            <div className="pt-2">
              <Button href="/shop" variant="primary">
                <span>Start Discovering Finds</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              {wishlist.map((product) => (
                <div
                  key={product.id}
                  className="group bg-purewhite rounded-sm border border-softborder flex flex-col justify-between shadow-subtle hover:shadow-card transition-all relative overflow-hidden"
                >
                  {/* Remove button */}
                  <button
                    onClick={() => removeFromWishlist(product.id)}
                    aria-label="Remove from saved finds"
                    className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-purewhite/90 text-charcoal/70 hover:text-terracotta hover:bg-purewhite flex items-center justify-center shadow-subtle transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>

                  <div>
                    <Link
                      href={`/product/${product.slug}`}
                      className="block relative aspect-square bg-ivory-50 overflow-hidden"
                    >
                      <Image
                        src={product.image_url}
                        alt={product.image_alt || product.name}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                      />
                    </Link>

                    <div className="p-4 sm:p-5">
                      <div className="flex items-center justify-between text-xs text-warmgrey mb-1">
                        <span>{product.category_name}</span>
                        {product.price_amount ? (
                          <span className="font-semibold text-charcoal">
                            {formatINR(product.price_amount)}
                          </span>
                        ) : (
                          <span className="text-[11px] text-sage">Check Price</span>
                        )}
                      </div>

                      <h3 className="font-editorial text-base font-medium text-charcoal leading-snug line-clamp-2 hover:text-terracotta transition-colors mb-2">
                        <Link href={`/product/${product.slug}`}>
                          {product.name}
                        </Link>
                      </h3>

                      <p className="text-xs text-charcoal/70 line-clamp-2 leading-relaxed">
                        {product.description}
                      </p>
                    </div>
                  </div>

                  <div className="p-4 sm:p-5 pt-0 space-y-2">
                    <Button
                      href={product.amazon_affiliate_url}
                      external
                      variant="primary"
                      size="sm"
                      className="w-full text-xs font-semibold py-2.5"
                    >
                      <span>View on Amazon</span>
                      <ExternalLink className="w-3 h-3 ml-1" />
                    </Button>

                    <Link
                      href={`/product/${product.slug}`}
                      className="block text-center text-xs font-medium text-charcoal/70 hover:text-charcoal py-1"
                    >
                      Read Editorial Notes
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-8 border-t border-softborder flex justify-between items-center">
              <Link
                href="/shop"
                className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider font-semibold text-charcoal hover:text-terracotta transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Continue Exploring Catalogue</span>
              </Link>
            </div>
          </div>
        )}

        <div className="mt-16 pt-8 border-t border-softborder">
          <AffiliateNotice />
        </div>
      </div>
    </div>
  );
}

