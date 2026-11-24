'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, ExternalLink, ArrowUpRight, ImageOff } from 'lucide-react';
import { Product } from '@/lib/types';
import { formatINR, cn, isValidAmazonIndiaUrl } from '@/lib/utils';
import { useWishlist } from '@/context/WishlistContext';
import { EditorialBadge } from './EditorialBadge';

interface ProductCardProps {
  product: Product;
  priority?: boolean;
}

export function ProductCard({ product, priority = false }: ProductCardProps) {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const wishlisted = isInWishlist(product.id);

  const hasImage = Boolean(product.image_url && product.image_url.trim().length > 0);
  const hasValidAmazonUrl = Boolean(
    product.amazon_affiliate_url && isValidAmazonIndiaUrl(product.amazon_affiliate_url)
  );

  return (
    <div className="group bg-purewhite rounded-sm border border-softborder hover:border-warmgrey/50 transition-all duration-300 hover:shadow-card flex flex-col h-full relative overflow-hidden">
      {/* Wishlist toggle button */}
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          toggleWishlist(product);
        }}
        aria-label={wishlisted ? 'Remove from saved finds' : 'Save to wishlist'}
        className={cn(
          'absolute top-3 right-3 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 backdrop-blur-md',
          wishlisted
            ? 'bg-terracotta text-purewhite shadow-sm'
            : 'bg-purewhite/85 text-charcoal/70 hover:text-terracotta hover:bg-purewhite shadow-subtle'
        )}
      >
        <Heart className={cn('w-4 h-4', wishlisted && 'fill-current')} />
      </button>

      {/* Product Image Link */}
      <Link href={`/product/${product.slug}`} className="block relative aspect-[4/4] overflow-hidden bg-ivory-50">
        {hasImage ? (
          <Image
            src={product.image_url}
            alt={product.image_alt || product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            priority={priority}
            className="object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-ivory-100 text-warmgrey p-4 text-center">
            <ImageOff className="w-8 h-8 mb-2 opacity-50 text-warmgrey" />
            <span className="text-xs font-medium text-charcoal/60">Image unavailable</span>
          </div>
        )}

        {/* Optional Editorial Label Badge */}
        {product.editorial_label && (
          <div className="absolute bottom-3 left-3">
            <EditorialBadge
              label={product.editorial_label}
              variant={product.editorial_label.includes('Pick') ? 'terracotta' : 'sage'}
            />
          </div>
        )}
      </Link>

      {/* Card Content */}
      <div className="p-4 sm:p-5 flex flex-col flex-grow justify-between">
        <div>
          {/* Category Tag */}
          <div className="flex items-center justify-between text-xs text-warmgrey mb-1.5 font-medium">
            <span>{product.category_name || 'Home & Living'}</span>
            {product.price_amount !== null ? (
              <span className="text-charcoal font-semibold text-sm">
                {formatINR(product.price_amount)}
              </span>
            ) : (
              <span className="text-xs text-sage font-medium">Check Price</span>
            )}
          </div>

          {/* Title */}
          <h3 className="font-editorial text-base sm:text-lg font-medium text-charcoal leading-snug line-clamp-2 group-hover:text-terracotta transition-colors mb-2">
            <Link href={`/product/${product.slug}`}>
              {product.name}
            </Link>
          </h3>

          {/* Short editorial description */}
          <p className="text-xs sm:text-sm text-charcoal/75 line-clamp-2 leading-relaxed mb-4">
            {product.description}
          </p>
        </div>

        {/* Action Row */}
        <div className="pt-3 border-t border-softborder/60 flex items-center justify-between gap-2 mt-auto">
          <Link
            href={`/product/${product.slug}`}
            className="text-xs font-semibold text-charcoal hover:text-terracotta inline-flex items-center gap-1 transition-colors uppercase tracking-wider"
          >
            <span>View Product</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>

          {hasValidAmazonUrl ? (
            <a
              href={product.amazon_affiliate_url}
              target="_blank"
              rel="noopener noreferrer nofollow"
              aria-label={`View ${product.name} on Amazon India`}
              className="text-[11px] font-medium text-terracotta hover:text-terracotta-700 inline-flex items-center gap-1 bg-terracotta-50 hover:bg-terracotta-100 px-2 py-1 rounded transition-colors"
            >
              <span>Amazon</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          ) : (
            <span
              title="Amazon link is not configured for this product"
              className="text-[11px] font-medium text-warmgrey bg-ivory-100 px-2 py-1 rounded cursor-not-allowed inline-flex items-center gap-1 opacity-75"
            >
              <span>Unavailable</span>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
