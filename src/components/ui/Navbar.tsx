'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, Heart, Menu, X, ArrowRight } from 'lucide-react';
import { useWishlist } from '@/context/WishlistContext';
import { AnnouncementBar } from './AnnouncementBar';
import { cn } from '@/lib/utils';

export function Navbar() {
  const pathname = usePathname();
  const { wishlistCount, openDrawer } = useWishlist();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Shop', href: '/shop' },
    { label: 'Home Decor', href: '/category/home-decor' },
    { label: 'Kitchen', href: '/category/kitchen-essentials' },
    { label: 'Organization', href: '/category/home-organization' },
    { label: 'Budget Finds', href: '/budget-finds' },
    { label: "Editor's Picks", href: '/editors-picks' },
    { label: 'Journal', href: '/journal' },
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/shop?search=${encodeURIComponent(searchQuery.trim())}`;
      setSearchOpen(false);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-ivory/95 backdrop-blur-md border-b border-softborder">
        <AnnouncementBar />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Mobile menu trigger */}
            <div className="flex items-center lg:hidden">
              <button
                onClick={() => setMobileMenuOpen(true)}
                aria-label="Open navigation menu"
                className="p-2 text-charcoal hover:text-terracotta transition-colors"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>

            {/* Brand Logo Wordmark */}
            <div className="flex-1 lg:flex-none text-center lg:text-left">
              <Link href="/" className="inline-block group">
                <span className="font-editorial text-2xl sm:text-3xl font-semibold tracking-wider text-charcoal group-hover:text-terracotta transition-colors">
                  HOMELY
                </span>
                <span className="block text-[10px] tracking-[0.25em] text-warmgrey uppercase -mt-1 font-sans">
                  Everyday Living
                </span>
              </Link>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center space-x-7">
              {navLinks.map((link) => {
                const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      'text-xs tracking-wider uppercase font-medium transition-colors hover:text-terracotta relative py-1',
                      isActive ? 'text-terracotta font-semibold' : 'text-charcoal/80'
                    )}
                  >
                    {link.label}
                    {isActive && (
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-terracotta rounded-full" />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Right Action Icons: Search & Wishlist */}
            <div className="flex items-center space-x-3 sm:space-x-4">
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                aria-label="Search products"
                className="p-2 text-charcoal hover:text-terracotta transition-colors"
              >
                <Search className="w-5 h-5" />
              </button>

              <button
                onClick={openDrawer}
                aria-label="View saved items"
                className="p-2 text-charcoal hover:text-terracotta transition-colors relative"
              >
                <Heart className="w-5 h-5" />
                {wishlistCount > 0 && (
                  <span className="absolute top-1 right-1 bg-terracotta text-purewhite text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Search Bar Dropdown Overlay */}
        {searchOpen && (
          <div className="border-t border-softborder bg-purewhite py-4 px-4 sm:px-6 shadow-sm">
            <div className="max-w-3xl mx-auto">
              <form onSubmit={handleSearchSubmit} className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-warmgrey absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search ceramic vases, spice organizers, lamps, budget finds..."
                    autoFocus
                    className="w-full bg-ivory-50 border border-softborder focus:border-charcoal focus:outline-none text-charcoal text-sm pl-10 pr-4 py-2.5 rounded-sm"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-terracotta text-purewhite px-4 py-2.5 rounded-sm text-xs uppercase font-medium hover:bg-terracotta-600 transition-colors"
                >
                  Search
                </button>
                <button
                  type="button"
                  onClick={() => setSearchOpen(false)}
                  className="p-2.5 text-charcoal/60 hover:text-charcoal"
                >
                  <X className="w-5 h-5" />
                </button>
              </form>
            </div>
          </div>
        )}
      </header>

      {/* Mobile Slide-Out Drawer Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden overflow-hidden">
          <div
            className="fixed inset-0 bg-charcoal/40 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 max-w-xs w-full bg-ivory border-r border-softborder shadow-2xl flex flex-col p-6 z-10">
            <div className="flex items-center justify-between pb-6 border-b border-softborder">
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className="font-editorial text-2xl font-semibold text-charcoal"
              >
                HOMELY
              </Link>
              <button
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close menu"
                className="p-1 text-charcoal/70 hover:text-charcoal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="flex-1 py-6 space-y-4 overflow-y-auto">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    'block text-sm uppercase tracking-wider py-2 font-medium transition-colors hover:text-terracotta',
                    pathname === link.href ? 'text-terracotta font-semibold' : 'text-charcoal'
                  )}
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-4 border-t border-softborder">
                <Link
                  href="/wishlist"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between text-sm py-2 font-medium text-charcoal hover:text-terracotta"
                >
                  <span className="flex items-center gap-2">
                    <Heart className="w-4 h-4 text-terracotta" />
                    Saved Finds
                  </span>
                  <span className="bg-ivory-200 px-2 py-0.5 rounded-full text-xs">
                    {wishlistCount}
                  </span>
                </Link>
                <Link
                  href="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-xs text-warmgrey py-2 hover:text-charcoal mt-2"
                >
                  Admin Portal
                </Link>
              </div>
            </nav>

            <div className="pt-6 border-t border-softborder text-xs text-warmgrey">
              <p className="font-editorial italic text-charcoal/80 mb-2">
                &ldquo;Thoughtful finds for a more beautiful everyday.&rdquo;
              </p>
              <p className="text-[11px]">As an Amazon Associate I earn from qualifying purchases.</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

