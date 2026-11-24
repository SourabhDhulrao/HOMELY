import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

export function OrganizationGrid() {
  const zones = [
    {
      title: 'Kitchen & Spice Organization',
      description: 'Apothecary dispensers, turntable carousels, and airtight borosilicate jars that calm cooking counters.',
      image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=1000&auto=format&fit=crop',
      href: '/category/kitchen-essentials',
      span: 'lg:col-span-7',
    },
    {
      title: 'Wardrobe & Saree Care',
      description: 'Honeycomb dividers, fabric linen cubes, and space-saving hangers.',
      image: 'https://images.unsplash.com/photo-1558997519-83ea9252def8?q=80&w=1000&auto=format&fit=crop',
      href: '/category/wardrobe-organization',
      span: 'lg:col-span-5',
    },
    {
      title: 'Desk & Work From Home',
      description: 'Vegan leather blotters, cable conduits, and ergonomic wooden stands.',
      image: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=1000&auto=format&fit=crop',
      href: '/category/desk-organization',
      span: 'lg:col-span-4',
    },
    {
      title: 'Bathroom & Vanity Storage',
      description: 'Heavy solid brass no-drill hooks, under-sink tiered racks, and amber pumps.',
      image: 'https://images.unsplash.com/photo-1584622781564-1d987f7333c1?q=80&w=1000&auto=format&fit=crop',
      href: '/category/home-organization',
      span: 'lg:col-span-4',
    },
    {
      title: 'Small Apartment Solutions',
      description: '13cm gap rolling utility carts, wall pegboards, and arch mirrors that multiply natural light.',
      image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=1000&auto=format&fit=crop',
      href: '/category/small-space-solutions',
      span: 'lg:col-span-4',
    },
  ];

  return (
    <section className="py-16 sm:py-24 bg-purewhite border-b border-softborder">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16">
          <div>
            <span className="text-xs uppercase tracking-widest text-terracotta font-semibold mb-2 block">
              Spaces in Focus
            </span>
            <h2 className="font-editorial text-3xl sm:text-4xl text-charcoal font-medium">
              Everyday Organization Guides
            </h2>
          </div>
          <p className="text-sm text-charcoal/70 max-w-md mt-3 md:mt-0 leading-relaxed">
            Practical storage concepts designed around how Indian families live, cook, and store daily essentials.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-6">
          {zones.map((zone, idx) => (
            <Link
              key={idx}
              href={zone.href}
              className={`group relative overflow-hidden rounded-sm border border-softborder bg-ivory-100 ${zone.span} min-h-[260px] sm:min-h-[300px] flex flex-col justify-end p-6 sm:p-8 hover:shadow-card transition-all duration-300`}
            >
              <div className="absolute inset-0">
                <Image
                  src={zone.image}
                  alt={zone.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-charcoal/30 to-transparent group-hover:from-charcoal/90 transition-all" />
              </div>

              <div className="relative z-10 text-purewhite">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-editorial text-xl sm:text-2xl font-medium">
                    {zone.title}
                  </h3>
                  <div className="w-8 h-8 rounded-full bg-purewhite/20 backdrop-blur-sm flex items-center justify-center group-hover:bg-terracotta group-hover:text-purewhite transition-colors">
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                </div>
                <p className="text-xs sm:text-sm text-ivory-100/90 max-w-md leading-relaxed line-clamp-2">
                  {zone.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

