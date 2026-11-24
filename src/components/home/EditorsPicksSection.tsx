import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ExternalLink, Star, ArrowRight } from 'lucide-react';
import { Product } from '@/lib/types';
import { formatINR } from '@/lib/utils';
import { Button } from '@/components/ui/Button';

interface EditorsPicksSectionProps {
  products: Product[];
}

export function EditorsPicksSection({ products }: EditorsPicksSectionProps) {
  // Select products marked as featured / with editorial notes
  const picks = products
    .filter((p) => p.featured || p.editorial_label?.includes('Pick'))
    .slice(0, 3);

  return (
    <section className="py-16 sm:py-24 bg-ivory">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14 sm:mb-16">
          <span className="text-xs uppercase tracking-widest text-terracotta font-semibold mb-2 block">
            Independent Curation
          </span>
          <h2 className="font-editorial text-3xl sm:text-4xl text-charcoal font-medium mb-3">
            Editor&apos;s Verified Picks
          </h2>
          <p className="text-sm text-charcoal/75 leading-relaxed">
            Every piece highlighted here has been scrutinized for craftsmanship, aesthetic longevity, and genuine utility in Indian households.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {picks.map((item, idx) => (
            <div
              key={item.id}
              className="bg-purewhite rounded-sm border border-softborder p-6 flex flex-col justify-between shadow-subtle hover:shadow-card transition-shadow"
            >
              <div>
                {/* Image */}
                <div className="relative aspect-[4/3] rounded overflow-hidden bg-ivory-50 mb-6">
                  <Image
                    src={item.image_url}
                    alt={item.image_alt || item.name}
                    fill
                    sizes="(max-width: 1024px) 100vw, 33vw"
                    className="object-cover"
                  />
                  <div className="absolute top-3 left-3 bg-charcoal text-purewhite text-[11px] font-medium uppercase px-2.5 py-1 rounded-sm tracking-wider">
                    Pick 0{idx + 1}
                  </div>
                </div>

                {/* Category & Verified Price */}
                <div className="flex items-center justify-between text-xs text-warmgrey mb-2 font-medium">
                  <span>{item.category_name}</span>
                  {item.price_amount ? (
                    <span className="font-semibold text-charcoal text-sm">
                      {formatINR(item.price_amount)}
                    </span>
                  ) : (
                    <span className="text-sage">Price on Amazon</span>
                  )}
                </div>

                {/* Title */}
                <h3 className="font-editorial text-xl font-medium text-charcoal mb-4 hover:text-terracotta transition-colors">
                  <Link href={`/product/${item.slug}`}>
                    {item.name}
                  </Link>
                </h3>

                {/* Why We Selected It */}
                <div className="bg-ivory-50 p-4 rounded border border-softborder mb-4">
                  <p className="text-[11px] uppercase tracking-wider font-semibold text-terracotta mb-1">
                    Why We Selected It:
                  </p>
                  <p className="text-xs text-charcoal/85 leading-relaxed italic">
                    &ldquo;{item.editorial_note}&rdquo;
                  </p>
                </div>

                {/* Best Use Case */}
                <div className="text-xs text-charcoal/80 mb-6">
                  <span className="font-semibold text-charcoal">Best use case: </span>
                  <span>{item.best_for}</span>
                </div>
              </div>

              {/* CTAs */}
              <div className="pt-4 border-t border-softborder flex items-center justify-between gap-3">
                <Link
                  href={`/product/${item.slug}`}
                  className="text-xs font-semibold uppercase text-charcoal hover:text-terracotta transition-colors"
                >
                  Full Story
                </Link>

                <Button
                  href={item.amazon_affiliate_url}
                  external
                  variant="primary"
                  size="sm"
                  className="px-4"
                >
                  <span>View on Amazon</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/editors-picks"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-wider font-semibold text-charcoal hover:text-terracotta transition-colors"
          >
            <span>Explore All Editorial Recommendations</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

