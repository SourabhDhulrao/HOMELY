'use client';

import React from 'react';
import Image from 'next/image';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-ivory pt-6 pb-16 sm:pb-24 lg:pt-10 lg:pb-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Text Content */}
          <div className="lg:col-span-6 space-y-6 sm:space-y-8 text-center lg:text-left z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-sage-100 text-sage-700 rounded-full text-xs font-medium tracking-wide uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Curated for Indian Homes</span>
            </div>

            <h1 className="font-editorial text-4xl sm:text-5xl lg:text-6xl text-charcoal font-medium tracking-tight leading-[1.12]">
              Make Room for <br className="hidden sm:inline" />
              <span className="italic font-normal font-accent text-terracotta">Beautiful</span> Living.
            </h1>

            <p className="text-base sm:text-lg text-charcoal/80 max-w-xl mx-auto lg:mx-0 leading-relaxed font-sans">
              Discover thoughtful home finds, everyday essentials, and little details that make a house feel like home. Curated with editorial care and verified on Amazon India.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4 pt-2">
              <Button href="/shop" variant="primary" size="lg" className="w-full sm:w-auto">
                <span>Explore the Collection</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
              <Button href="/budget-finds" variant="outline" size="lg" className="w-full sm:w-auto">
                <span>Discover Budget Finds</span>
              </Button>
            </div>

            {/* Editorial highlights bar */}
            <div className="pt-6 sm:pt-8 grid grid-cols-3 border-t border-softborder text-left gap-4">
              <div>
                <p className="text-xs uppercase text-warmgrey tracking-wider font-medium">Curated</p>
                <p className="text-sm font-semibold text-charcoal mt-0.5">Editorial Taste</p>
              </div>
              <div>
                <p className="text-xs uppercase text-warmgrey tracking-wider font-medium">Pricing</p>
                <p className="text-sm font-semibold text-charcoal mt-0.5">Under ₹1,499</p>
              </div>
              <div>
                <p className="text-xs uppercase text-warmgrey tracking-wider font-medium">Fulfillment</p>
                <p className="text-sm font-semibold text-charcoal mt-0.5">Amazon India</p>
              </div>
            </div>
          </div>

          {/* Large Lifestyle Photograph / Split layout */}
          <div className="lg:col-span-6 relative">
            <div className="relative mx-auto max-w-lg lg:max-w-none">
              {/* Main Image */}
              <div className="relative aspect-[4/5] rounded-sm overflow-hidden shadow-card border border-softborder bg-ivory-200">
                <Image
                  src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=1200&auto=format&fit=crop"
                  alt="Sunlit minimalist living room with earthy ceramic decor and warm linen textures"
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover object-center"
                />
              </div>

              {/* Floating Editorial Quote / Badge */}
              <div className="absolute -bottom-6 -left-4 sm:-bottom-8 sm:-left-8 bg-purewhite p-4 sm:p-5 rounded-sm border border-softborder shadow-hover max-w-xs hidden sm:block">
                <p className="font-accent italic text-lg text-charcoal leading-snug">
                  &ldquo;Simplicity, warmth, and good taste in everyday essentials.&rdquo;
                </p>
                <span className="block text-[11px] text-terracotta uppercase tracking-wider font-semibold mt-2 font-sans">
                  The HOMELY Philosophy
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

