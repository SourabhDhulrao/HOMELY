import React from 'react';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Heart, Sparkles, Compass, Shield } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About HOMELY — Thoughtful Finds for Beautiful Everyday Living',
  description:
    'Learn about HOMELY, an independent home discovery platform curated for Indian urban apartments and aesthetic living.',
};

export default function AboutPage() {
  return (
    <div className="py-12 sm:py-20 bg-ivory">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Hero */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs uppercase tracking-widest text-terracotta font-semibold block">
            Our Purpose
          </span>
          <h1 className="font-editorial text-4xl sm:text-5xl text-charcoal font-medium leading-tight">
            Thoughtful Finds for <br />
            <span className="italic font-accent text-terracotta">Beautiful</span> Everyday Living.
          </h1>
          <p className="text-base sm:text-lg text-charcoal/80 leading-relaxed font-sans">
            HOMELY was born from a simple observation: modern Indian apartments need practical, space-smart storage and tactile, earthy decor that doesn&apos;t cost a fortune.
          </p>
        </div>

        {/* Story Image */}
        <div className="relative aspect-[16/9] rounded-sm overflow-hidden border border-softborder shadow-card bg-ivory-200">
          <Image
            src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=1200&auto=format&fit=crop"
            alt="Warm and thoughtfully styled living interior"
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 960px"
            className="object-cover"
          />
        </div>

        {/* Editorial Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-purewhite p-8 rounded-sm border border-softborder space-y-3 shadow-subtle">
            <div className="w-10 h-10 rounded-full bg-sage-100 flex items-center justify-center text-sage-700">
              <Compass className="w-5 h-5" />
            </div>
            <h3 className="font-editorial text-xl font-medium text-charcoal">
              Editorial Curation
            </h3>
            <p className="text-xs sm:text-sm text-charcoal/75 leading-relaxed">
              We cut through the noise of millions of generic online listings to highlight pieces that offer timeless aesthetics, tactile warmth, and durable materials.
            </p>
          </div>

          <div className="bg-purewhite p-8 rounded-sm border border-softborder space-y-3 shadow-subtle">
            <div className="w-10 h-10 rounded-full bg-terracotta-100 flex items-center justify-center text-terracotta">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="font-editorial text-xl font-medium text-charcoal">
              Urban Indian Living
            </h3>
            <p className="text-xs sm:text-sm text-charcoal/75 leading-relaxed">
              Our selections respect Indian modular kitchen sizes, humid weather, rental flat drilling restrictions, and the daily rhythms of Indian households.
            </p>
          </div>

          <div className="bg-purewhite p-8 rounded-sm border border-softborder space-y-3 shadow-subtle">
            <div className="w-10 h-10 rounded-full bg-ivory-300 flex items-center justify-center text-charcoal">
              <Shield className="w-5 h-5" />
            </div>
            <h3 className="font-editorial text-xl font-medium text-charcoal">
              Zero Fabricated Data
            </h3>
            <p className="text-xs sm:text-sm text-charcoal/75 leading-relaxed">
              We never fabricate discounts, artificial review counts, or fake urgency timers. What you see is genuine editorial opinion and verified Amazon India pricing.
            </p>
          </div>
        </div>

        {/* Business Model Explanation */}
        <div className="bg-purewhite p-8 sm:p-12 rounded-sm border border-softborder space-y-6">
          <h2 className="font-editorial text-2xl sm:text-3xl text-charcoal font-medium">
            How HOMELY Works
          </h2>
          <div className="prose prose-stone text-xs sm:text-sm text-charcoal/80 leading-relaxed space-y-4">
            <p>
              HOMELY is an editorial discovery platform, not a direct retailer. We do not maintain warehouses, process credit cards, or ship packages directly.
            </p>
            <p>
              Instead, every product featured on HOMELY contains a clear button redirecting you to Amazon India. When you complete a purchase, we may earn an affiliate commission through the official Amazon Associates Program at no additional cost to you.
            </p>
            <p>
              This allows us to remain independent, obsess over curation, and keep our guides completely free for all readers.
            </p>
          </div>

          <div className="pt-4 flex flex-wrap gap-4">
            <Button href="/shop" variant="primary">
              Explore Our Finds
            </Button>
            <Button href="/affiliate-disclosure" variant="outline">
              Read Affiliate Disclosure
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

