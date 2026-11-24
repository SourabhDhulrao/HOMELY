import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Terms and Conditions | HOMELY',
  description: 'Terms of service and conditions for using the HOMELY website.',
};

export default function TermsPage() {
  return (
    <div className="py-12 sm:py-20 bg-ivory">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-purewhite p-8 sm:p-14 rounded-sm border border-softborder shadow-subtle space-y-8">
          <div className="border-b border-softborder pb-8 space-y-2">
            <span className="text-xs uppercase tracking-widest text-terracotta font-semibold block">
              Legal
            </span>
            <h1 className="font-editorial text-3xl sm:text-4xl text-charcoal font-medium">
              Terms & Conditions
            </h1>
            <p className="text-xs text-warmgrey">Last updated: May 2025</p>
          </div>

          <div className="prose prose-stone text-xs sm:text-sm text-charcoal/85 leading-relaxed space-y-6 max-w-none">
            <p>
              Welcome to HOMELY. By accessing or using our website at homelyliving.in, you agree to be bound by the following Terms & Conditions. If you do not agree, please do not use the site.
            </p>

            <h2 className="font-editorial text-xl font-medium text-charcoal">
              1. Informational & Editorial Discovery Service
            </h2>
            <p>
              HOMELY provides lifestyle recommendations, interior decorating inspiration, and curated links to third-party merchant products on Amazon India. Content is provided solely for personal, non-commercial discovery.
            </p>

            <h2 className="font-editorial text-xl font-medium text-charcoal">
              2. Third-Party Transactions & Merchant Relationship
            </h2>
            <p>
              All purchases made through affiliate links on HOMELY occur exclusively on third-party platforms (predominantly Amazon.in). HOMELY does not accept responsibility for:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Order fulfillment, courier delays, or package loss.</li>
              <li>Returns, replacements, or customer service inquiries.</li>
              <li>Merchant pricing adjustments or inventory shortages.</li>
              <li>Product defects or discrepancies between manufacturer claims and delivered items.</li>
            </ul>

            <h2 className="font-editorial text-xl font-medium text-charcoal">
              3. Intellectual Property
            </h2>
            <p>
              The HOMELY brand identity, layout design, written articles, editorial notes, and software code are the intellectual property of HOMELY. You may not reproduce or republish our editorial essays or proprietary content without prior written permission.
            </p>

            <h2 className="font-editorial text-xl font-medium text-charcoal">
              4. Governing Law
            </h2>
            <p>
              These Terms shall be governed by and construed in accordance with the laws of India, without regard to conflict of law principles.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

