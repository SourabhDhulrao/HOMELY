import React from 'react';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-charcoal text-ivory-100 pt-16 pb-12 border-t border-charcoal-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 pb-12 border-b border-charcoal-400/40">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="inline-block">
              <span className="font-editorial text-3xl font-semibold tracking-wider text-purewhite">
                HOMELY
              </span>
              <span className="block text-[10px] tracking-[0.25em] text-sage-200 uppercase -mt-0.5 font-sans">
                Everyday Living
              </span>
            </Link>
            <p className="text-sm text-ivory-200/80 leading-relaxed max-w-sm">
              Thoughtful Finds for Beautiful Everyday Living. An editorial discovery platform curated for Indian homes, bringing together practical organization and affordable luxury.
            </p>
            <div className="pt-2 flex items-center space-x-4">
              <a
                href="https://pinterest.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow HOMELY on Pinterest"
                className="w-9 h-9 rounded-full bg-charcoal-400/30 flex items-center justify-center text-ivory hover:text-terracotta-200 hover:bg-charcoal-400/60 transition-colors"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345-.09.375-.291 1.199-.334 1.365-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.538.535 6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z" />
                </svg>
              </a>
              <span className="text-xs text-ivory-300">Discover styling boards on Pinterest</span>
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-purewhite mb-4">
              Explore Collections
            </h4>
            <ul className="space-y-2.5 text-sm text-ivory-200/80">
              <li>
                <Link href="/shop" className="hover:text-purewhite transition-colors">
                  Shop All Finds
                </Link>
              </li>
              <li>
                <Link href="/category/home-decor" className="hover:text-purewhite transition-colors">
                  Home Decor
                </Link>
              </li>
              <li>
                <Link href="/category/kitchen-essentials" className="hover:text-purewhite transition-colors">
                  Kitchen Essentials
                </Link>
              </li>
              <li>
                <Link href="/category/home-organization" className="hover:text-purewhite transition-colors">
                  Home Organization
                </Link>
              </li>
              <li>
                <Link href="/category/small-space-solutions" className="hover:text-purewhite transition-colors">
                  Small Space Solutions
                </Link>
              </li>
              <li>
                <Link href="/budget-finds" className="hover:text-purewhite transition-colors">
                  Budget Finds
                </Link>
              </li>
              <li>
                <Link href="/editors-picks" className="hover:text-purewhite transition-colors">
                  Editor&apos;s Picks
                </Link>
              </li>
            </ul>
          </div>

          {/* Editorial Links */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-purewhite mb-4">
              Editorial & Story
            </h4>
            <ul className="space-y-2.5 text-sm text-ivory-200/80">
              <li>
                <Link href="/journal" className="hover:text-purewhite transition-colors">
                  The HOMELY Journal
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-purewhite transition-colors">
                  About HOMELY
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-purewhite transition-colors">
                  Contact Editorial
                </Link>
              </li>
              <li>
                <Link href="/wishlist" className="hover:text-purewhite transition-colors">
                  Saved Wishlist
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-purewhite transition-colors">
                  Admin Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Compliance & Legal */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-purewhite mb-4">
              Transparency
            </h4>
            <ul className="space-y-2.5 text-sm text-ivory-200/80">
              <li>
                <Link href="/affiliate-disclosure" className="hover:text-purewhite transition-colors">
                  Affiliate Disclosure
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="hover:text-purewhite transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms-and-conditions" className="hover:text-purewhite transition-colors">
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Affiliate Disclosure Statement */}
        <div className="py-6 border-b border-charcoal-400/20 text-xs text-ivory-300/80 leading-relaxed">
          <p className="font-semibold text-ivory-100 mb-1">Amazon Associates Program Notice:</p>
          <p>
            &ldquo;As an Amazon Associate I earn from qualifying purchases.&rdquo; HOMELY is an independent editorial recommendation service and is not owned, operated, or endorsed by Amazon.com, Inc. or Amazon Seller Services Private Limited. Product prices and availability are accurate as of the date/time indicated and are subject to change. Any price and availability information displayed on Amazon India at the time of purchase will apply to the purchase of this product.
          </p>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-ivory-300/60 gap-4">
          <p>© {new Date().getFullYear()} HOMELY. All rights reserved. Little finds. Beautiful living.</p>
          <p className="text-[11px]">Crafted with care for Indian homes.</p>
        </div>
      </div>
    </footer>
  );
}

