'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { ImageOff } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProductGalleryProps {
  images?: string[];
  fallbackImage: string;
  alt: string;
  editorialLabel?: string;
}

export function ProductGallery({
  images,
  fallbackImage,
  alt,
  editorialLabel,
}: ProductGalleryProps) {
  const validImages = (images && images.length > 0 ? images : [fallbackImage]).filter(
    (img) => img && img.trim().length > 0
  );

  const [selectedIndex, setSelectedIndex] = useState(0);
  const hasImages = validImages.length > 0;
  const currentImage = validImages[selectedIndex] || validImages[0] || '';

  return (
    <div className="space-y-3">
      {/* Main Image Display */}
      <div className="relative aspect-square rounded-sm overflow-hidden border border-softborder bg-purewhite shadow-subtle group flex items-center justify-center">
        {hasImages ? (
          <Image
            src={currentImage}
            alt={alt}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover transition-opacity duration-300"
          />
        ) : (
          <div className="flex flex-col items-center justify-center p-8 text-center text-warmgrey">
            <ImageOff className="w-12 h-12 mb-3 text-warmgrey/60" />
            <p className="text-sm font-medium text-charcoal/70">Image unavailable</p>
            <p className="text-xs text-warmgrey mt-1">An exact product photo has not been uploaded yet.</p>
          </div>
        )}

        {editorialLabel && hasImages && (
          <div className="absolute top-4 left-4 bg-sage text-purewhite text-xs font-semibold px-3 py-1 rounded-sm uppercase tracking-wider shadow-sm pointer-events-none">
            {editorialLabel}
          </div>
        )}

        {/* Image Counter if multiple */}
        {validImages.length > 1 && (
          <div className="absolute bottom-3 right-3 bg-charcoal/70 backdrop-blur-sm text-purewhite text-[11px] font-medium px-2.5 py-1 rounded-sm">
            {selectedIndex + 1} / {validImages.length}
          </div>
        )}
      </div>

      {/* Multiple Images Thumbnail Strip */}
      {validImages.length > 1 && (
        <div className="flex items-center gap-2.5 overflow-x-auto pb-1 pt-0.5 scrollbar-thin">
          {validImages.map((imgUrl, idx) => {
            const isActive = idx === selectedIndex;
            return (
              <button
                key={`${imgUrl}-${idx}`}
                type="button"
                onClick={() => setSelectedIndex(idx)}
                aria-label={`View product image ${idx + 1}`}
                className={cn(
                  'relative w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0 rounded-sm overflow-hidden border-2 transition-all duration-200 bg-purewhite',
                  isActive
                    ? 'border-terracotta ring-1 ring-terracotta shadow-sm scale-[1.02]'
                    : 'border-softborder hover:border-warmgrey opacity-75 hover:opacity-100'
                )}
              >
                <Image
                  src={imgUrl}
                  alt={`${alt} thumbnail ${idx + 1}`}
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
