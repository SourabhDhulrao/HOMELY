'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { X, Trash2, ExternalLink, Heart } from 'lucide-react';
import { useWishlist } from '@/context/WishlistContext';
import { formatINR } from '@/lib/utils';
import { Button } from './Button';

export function WishlistDrawer() {
  const { wishlist, isDrawerOpen, closeDrawer, removeFromWishlist, clearWishlist } = useWishlist();

  if (!isDrawerOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-charcoal/40 backdrop-blur-sm transition-opacity"
        onClick={closeDrawer}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-ivory border-l border-softborder shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-6 border-b border-softborder flex items-center justify-between bg-purewhite">
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-terracotta fill-terracotta" />
              <h2 className="font-editorial text-xl font-medium text-charcoal">
                Saved Finds ({wishlist.length})
              </h2>
            </div>
            <button
              onClick={closeDrawer}
              aria-label="Close saved finds drawer"
              className="p-1 text-charcoal/60 hover:text-charcoal rounded hover:bg-ivory transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Items list */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {wishlist.length === 0 ? (
              <div className="text-center py-16 px-4">
                <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-ivory-200 flex items-center justify-center text-warmgrey">
                  <Heart className="w-6 h-6" />
                </div>
                <h3 className="font-editorial text-lg text-charcoal mb-2">Your collection is empty</h3>
                <p className="text-xs text-warmgrey mb-6 leading-relaxed max-w-xs mx-auto">
                  Click the heart icon on any piece you love to save it for your home styling journey.
                </p>
                <Button variant="primary" size="sm" href="/shop" onClick={closeDrawer}>
                  Explore Finds
                </Button>
              </div>
            ) : (
              wishlist.map((item) => (
                <div
                  key={item.id}
                  className="bg-purewhite p-3.5 rounded border border-softborder flex gap-3.5 items-center relative group"
                >
                  <div className="relative w-18 h-18 w-[72px] h-[72px] flex-shrink-0 bg-ivory-50 rounded overflow-hidden">
                    <Image
                      src={item.image_url}
                      alt={item.image_alt || item.name}
                      fill
                      sizes="72px"
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0 pr-6">
                    <h4 className="text-xs font-medium text-charcoal truncate hover:text-terracotta">
                      <Link href={`/product/${item.slug}`} onClick={closeDrawer}>
                        {item.name}
                      </Link>
                    </h4>
                    <p className="text-[11px] text-warmgrey mt-0.5">
                      {item.price_amount ? formatINR(item.price_amount) : 'Check Amazon for price'}
                    </p>
                    <div className="flex items-center gap-3 mt-2">
                      <a
                        href={item.amazon_affiliate_url}
                        target="_blank"
                        rel="noopener noreferrer nofollow"
                        className="text-[11px] font-medium text-terracotta inline-flex items-center gap-1 hover:underline"
                      >
                        <span>View on Amazon</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                  <button
                    onClick={() => removeFromWishlist(item.id)}
                    aria-label="Remove item"
                    className="absolute top-3 right-3 text-warmgrey hover:text-terracotta p-1 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {wishlist.length > 0 && (
            <div className="p-6 border-t border-softborder bg-purewhite flex items-center justify-between">
              <button
                onClick={clearWishlist}
                className="text-xs text-warmgrey hover:text-charcoal underline"
              >
                Clear all
              </button>
              <Button variant="secondary" size="sm" href="/wishlist" onClick={closeDrawer}>
                View Full Wishlist
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

