import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { ShieldCheck, Info } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Affiliate Disclosure & Transparency Statement | HOMELY',
  description:
    'Detailed affiliate disclosure explaining our participation in the Amazon India Associates Program and our editorial standards.',
};

export default function AffiliateDisclosurePage() {
  return (
    <div className="py-12 sm:py-20 bg-ivory">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-purewhite p-8 sm:p-14 rounded-sm border border-softborder shadow-subtle space-y-8">
          {/* Header */}
          <div className="border-b border-softborder pb-8 space-y-3">
            <span className="text-xs uppercase tracking-widest text-terracotta font-semibold block">
              Legal & Compliance
            </span>
            <h1 className="font-editorial text-3xl sm:text-4xl text-charcoal font-medium">
              Affiliate Disclosure
            </h1>
            <p className="text-xs text-warmgrey">
              Last updated: May 2025 • In compliance with Amazon Associates Operating Agreement
            </p>
          </div>

          {/* Primary Statement */}
          <div className="p-6 bg-sage-50 border-l-4 border-sage-500 rounded-r space-y-2">
            <div className="flex items-center gap-2 text-sage-800 font-semibold text-sm">
              <ShieldCheck className="w-5 h-5 text-sage-600" />
              <span>Mandatory Associate Disclosure</span>
            </div>
            <p className="font-editorial text-lg text-charcoal italic">
              &ldquo;As an Amazon Associate I earn from qualifying purchases.&rdquo;
            </p>
          </div>

          {/* Body Content */}
          <div className="prose prose-stone text-xs sm:text-sm text-charcoal/85 leading-relaxed space-y-6 max-w-none">
            <section className="space-y-2">
              <h2 className="font-editorial text-xl font-medium text-charcoal">
                1. What is HOMELY?
              </h2>
              <p>
                HOMELY (accessible at <Link href="/" className="underline text-charcoal">homelyliving.in</Link>) is an independent product discovery, curation, and lifestyle editorial publication focused on Indian home aesthetics, organizing essentials, and small-space solutions.
              </p>
              <p>
                HOMELY is <strong>not</strong> an e-commerce merchant, seller, or marketplace. We do not stock physical inventory, process transactions, collect customer payment credentials, or handle shipping logistics.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="font-editorial text-xl font-medium text-charcoal">
                2. Amazon India Associates Program
              </h2>
              <p>
                HOMELY participates in the Amazon Associates Program (Amazon India Affiliate Program), an affiliate advertising program designed to provide a means for sites to earn advertising fees and commissions by advertising and linking to Amazon India (<code>amazon.in</code>).
              </p>
              <p>
                When you click on a product recommendation link or button labeled &ldquo;Check Latest Price on Amazon&rdquo;, &ldquo;View on Amazon&rdquo;, or &ldquo;Shop This Find&rdquo;, you are redirected to the corresponding product listing on Amazon India using an authorized affiliate link containing our associate tracking tag.
              </p>
              <p>
                If you choose to complete an eligible purchase on Amazon India following that click, Amazon may pay HOMELY a small commission at <strong>no extra cost to you</strong>. The price you pay on Amazon India remains identical whether you use our link or navigate directly.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="font-editorial text-xl font-medium text-charcoal">
                3. Editorial Independence & Integrity
              </h2>
              <p>
                Our editorial recommendations are driven by aesthetics, design quality, and genuine utility for Indian households. Products are chosen independently by our curation team.
              </p>
              <ul className="list-disc pl-5 space-y-1.5">
                <li>We do not accept paid placements to endorse inferior products.</li>
                <li>We do not fabricate fake customer reviews, ratings, star counts, or discount percentages.</li>
                <li>We do not claim products have been tested unless they have undergone genuine editorial evaluation.</li>
                <li>We maintain strict visual standards aligned with minimalist and Scandinavian-inspired Indian living.</li>
              </ul>
            </section>

            <section className="space-y-2">
              <h2 className="font-editorial text-xl font-medium text-charcoal">
                4. Pricing & Availability Disclaimer
              </h2>
              <p>
                Product prices and availability on Amazon India change frequently due to lightning deals, merchant stock levels, and festival offers.
              </p>
              <p>
                While we strive to display verified, accurate price indications, any price and availability displayed on Amazon India at the exact moment of your purchase will govern the transaction. If a verified current price is not confirmed in our system, we intentionally display &ldquo;Check Latest Price on Amazon&rdquo; rather than displaying an outdated or estimated figure.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="font-editorial text-xl font-medium text-charcoal">
                5. Trademark & Attribution Notice
              </h2>
              <p>
                Amazon and the Amazon logo are trademarks of Amazon.com, Inc. or its affiliates. HOMELY is completely independent and is not owned, operated, or sponsored by Amazon.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="font-editorial text-xl font-medium text-charcoal">
                6. Contacting Us
              </h2>
              <p>
                If you have questions regarding our affiliate transparency practices or need clarification regarding any recommended find, please reach out via our{' '}
                <Link href="/contact" className="underline text-terracotta">
                  Contact Page
                </Link>
                .
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

