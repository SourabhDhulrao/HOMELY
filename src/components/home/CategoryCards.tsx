import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { Category } from '@/lib/types';

interface CategoryCardsProps {
  categories: Category[];
}

export function CategoryCards({ categories }: CategoryCardsProps) {
  // Focus on the top 4 core categories requested in Section 5.D
  const coreCategories = categories
    .filter((c) =>
      ['home-decor', 'kitchen-essentials', 'home-organization', 'small-space-solutions'].includes(c.slug)
    )
    .slice(0, 4);

  return (
    <section className="py-16 sm:py-24 bg-purewhite border-b border-softborder">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16">
          <div>
            <span className="text-xs uppercase tracking-widest text-terracotta font-semibold mb-2 block">
              Curated Collections
            </span>
            <h2 className="font-editorial text-3xl sm:text-4xl text-charcoal font-medium">
              Shop by Living Category
            </h2>
          </div>
          <p className="text-sm text-charcoal/70 max-w-md mt-3 md:mt-0 leading-relaxed">
            Thoughtfully designed objects that seamlessly integrate with your daily routines and Indian living spaces.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {coreCategories.map((category) => (
            <Link
              key={category.id}
              href={`/category/${category.slug}`}
              className="group flex flex-col bg-ivory-50 rounded-sm overflow-hidden border border-softborder hover:border-warmgrey/60 transition-all duration-300 hover:shadow-card"
            >
              {/* Image Container */}
              <div className="relative aspect-[3/4] overflow-hidden bg-ivory-200">
                <Image
                  src={category.image_url}
                  alt={category.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/60 via-charcoal/10 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
                
                <div className="absolute bottom-4 left-4 right-4 text-purewhite">
                  <span className="text-[11px] uppercase tracking-wider text-sage-100 font-medium block mb-1">
                    Collection
                  </span>
                  <h3 className="font-editorial text-xl font-medium leading-snug">
                    {category.name}
                  </h3>
                </div>
              </div>

              {/* Text & Explore Link */}
              <div className="p-4 sm:p-5 flex flex-col flex-grow justify-between bg-purewhite">
                <p className="text-xs text-charcoal/75 leading-relaxed line-clamp-2 mb-4">
                  {category.description}
                </p>
                <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-terracotta uppercase tracking-wider group-hover:text-terracotta-700 transition-colors">
                  <span>Explore Collection</span>
                  <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

