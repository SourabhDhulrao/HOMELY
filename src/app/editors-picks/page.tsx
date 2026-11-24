import React from 'react';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { getProducts } from '@/lib/dataService';
import { formatINR } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { AffiliateNotice } from '@/components/ui/AffiliateNotice';
import { PinterestButton } from '@/components/ui/PinterestButton';
import { ExternalLink, Sparkles, CheckCircle2 } from 'lucide-react';

export const metadata: Metadata = {
  title: "Editor's Verified Recommendations | HOMELY",
  description:
    'Independent editorial selections for modern Indian homes. Tested for practicality, durability, and quiet luxury aesthetics.',
};

export default async function EditorsPicksPage() {
  const { products } = await getProducts();
  const picks = products.filter((p) => p.featured || p.editorial_label?.includes('Pick'));

  return (
    <div className="py-10 sm:py-16 bg-ivory">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mb-14 text-center sm:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-sage-100 text-sage-800 rounded-full text-xs font-semibold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Honest Curation</span>
          </div>
          <h1 className="font-editorial text-3xl sm:text-4xl lg:text-5xl text-charcoal font-medium mb-4">
            Editor&apos;s Picks
          </h1>
          <p className="text-sm sm:text-base text-charcoal/75 leading-relaxed">
            The items in this catalog are our absolute favorites. We select items based on three strict criteria: aesthetic harmony, high build quality suitable for Indian conditions, and genuine day-to-day utility.
          </p>
        </div>

        {/* Detailed Editorial Cards */}
        <div className="space-y-12">
          {picks.map((product, idx) => (
            <div
              key={product.id}
              className="bg-purewhite rounded-sm border border-softborder overflow-hidden shadow-subtle hover:shadow-card transition-shadow"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
                {/* Left: Product Image */}
                <div className="lg:col-span-5 relative aspect-square bg-ivory-50">
                  <Image
                    src={product.image_url}
                    alt={product.image_alt || product.name}
                    fill
                    sizes="(max-width: 1024px) 100vw, 40vw"
                    className="object-cover"
                  />
                  <div className="absolute top-4 left-4 bg-charcoal text-purewhite text-xs font-medium uppercase px-3 py-1 rounded-sm tracking-wider">
                    Editorial Pick #{idx + 1}
                  </div>
                </div>

                {/* Right: Editorial Analysis */}
                <div className="lg:col-span-7 p-6 sm:p-10 space-y-6">
                  <div>
                    <div className="flex items-center justify-between text-xs text-warmgrey mb-2 font-medium">
                      <span>{product.category_name}</span>
                      {product.price_amount ? (
                        <span className="text-base font-semibold text-charcoal">
                          {formatINR(product.price_amount)}
                        </span>
                      ) : (
                        <span className="text-xs text-sage">Check Price on Amazon</span>
                      )}
                    </div>

                    <h2 className="font-editorial text-2xl sm:text-3xl text-charcoal font-medium leading-snug">
                      <Link href={`/product/${product.slug}`} className="hover:text-terracotta transition-colors">
                        {product.name}
                      </Link>
                    </h2>
                  </div>

                  {/* Why We Selected It */}
                  <div className="bg-ivory-50 p-5 rounded border border-softborder space-y-1.5">
                    <p className="text-xs uppercase font-semibold text-terracotta tracking-wider">
                      Why Our Editors Chose This:
                    </p>
                    <p className="text-sm text-charcoal/85 leading-relaxed italic">
                      &ldquo;{product.editorial_note}&rdquo;
                    </p>
                  </div>

                  {/* Best for & Features */}
                  <div className="space-y-2 text-xs sm:text-sm text-charcoal/80">
                    <p>
                      <strong className="text-charcoal font-semibold">Ideal Use Case: </strong>
                      {product.best_for}
                    </p>
                    {product.specs && (
                      <div className="flex flex-wrap gap-2 pt-2">
                        {Object.entries(product.specs).map(([key, val]) => (
                          <span
                            key={key}
                            className="inline-flex items-center gap-1 bg-ivory px-2.5 py-1 rounded text-xs text-charcoal/70 border border-softborder"
                          >
                            <CheckCircle2 className="w-3 h-3 text-sage" />
                            <span>{key}: {val}</span>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* CTAs */}
                  <div className="pt-4 border-t border-softborder flex flex-wrap items-center gap-4">
                    <Button
                      href={product.amazon_affiliate_url}
                      external
                      variant="primary"
                      size="md"
                    >
                      <span>Check Latest Price on Amazon</span>
                      <ExternalLink className="w-4 h-4" />
                    </Button>

                    <Button
                      href={`/product/${product.slug}`}
                      variant="outline"
                      size="md"
                    >
                      View Details & Specs
                    </Button>

                    <PinterestButton
                      url={`https://homelyliving.in/product/${product.slug}`}
                      media={product.image_url}
                      description={`${product.name} — Recommended by HOMELY`}
                      size="sm"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 pt-8 border-t border-softborder">
          <AffiliateNotice />
        </div>
      </div>
    </div>
  );
}

