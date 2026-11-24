import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacy Policy | HOMELY',
  description: 'HOMELY Privacy Policy detailing data protection, cookie usage, and user privacy.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="py-12 sm:py-20 bg-ivory">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-purewhite p-8 sm:p-14 rounded-sm border border-softborder shadow-subtle space-y-8">
          <div className="border-b border-softborder pb-8 space-y-2">
            <span className="text-xs uppercase tracking-widest text-terracotta font-semibold block">
              Legal
            </span>
            <h1 className="font-editorial text-3xl sm:text-4xl text-charcoal font-medium">
              Privacy Policy
            </h1>
            <p className="text-xs text-warmgrey">Effective Date: May 2025</p>
          </div>

          <div className="prose prose-stone text-xs sm:text-sm text-charcoal/85 leading-relaxed space-y-6 max-w-none">
            <p>
              HOMELY (&ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;) is committed to protecting your personal privacy. This Privacy Policy outlines what information we collect, how it is used, and your rights when browsing our website.
            </p>

            <h2 className="font-editorial text-xl font-medium text-charcoal">
              1. Information We Collect
            </h2>
            <p>
              We prioritize minimal data collection. Because HOMELY is an affiliate discovery catalog rather than a direct checkout merchant, we do not collect or store credit card numbers, billing addresses, or bank account information.
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                <strong>Newsletter Subscription:</strong> If you voluntarily subscribe to our newsletter, we collect your email address.
              </li>
              <li>
                <strong>Saved Finds (Wishlist):</strong> Saved items are stored locally in your web browser&apos;s <code>localStorage</code>. This data never leaves your device unless you clear your browser cache.
              </li>
              <li>
                <strong>Standard Web Analytics:</strong> Like most websites, we may collect anonymous browser logs, IP addresses, device types, and page views to analyze site speed and improve mobile user experience.
              </li>
            </ul>

            <h2 className="font-editorial text-xl font-medium text-charcoal">
              2. Amazon Affiliate Cookies & External Links
            </h2>
            <p>
              When you click on an Amazon India affiliate link on HOMELY, Amazon sets tracking cookies on your device in accordance with Amazon India&apos;s privacy policies to verify eligible affiliate purchases. For more information regarding Amazon&apos;s cookie practices, please review the Amazon India Privacy Notice.
            </p>

            <h2 className="font-editorial text-xl font-medium text-charcoal">
              3. Data Protection & Sharing
            </h2>
            <p>
              We do not sell, rent, or trade your personal information to third parties or marketing brokers. Newsletter emails are stored securely and used solely for delivering our editorial dispatches. You may unsubscribe at any time via the link in any newsletter.
            </p>

            <h2 className="font-editorial text-xl font-medium text-charcoal">
              4. Contact Us
            </h2>
            <p>
              If you have any questions or data deletion requests, please contact us at privacy@homelyliving.in or visit our{' '}
              <Link href="/contact" className="underline text-terracotta">
                Contact Page
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

