'use client';

import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search, SlidersHorizontal, X, ArrowUpDown } from 'lucide-react';
import { Product, Category } from '@/lib/types';
import { ProductCard } from '@/components/ui/ProductCard';
import { cn } from '@/lib/utils';
import { AffiliateNotice } from '@/components/ui/AffiliateNotice';

interface ShopClientProps {
  initialProducts: Product[];
  categories: Category[];
}

export function ShopClient({ initialProducts, categories }: ShopClientProps) {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || 'all';
  const initialSearch = searchParams.get('search') || '';
  const initialTier = searchParams.get('tier') || 'all';

  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [priceTier, setPriceTier] = useState<string>(initialTier);
  const [sortBy, setSortBy] = useState<'featured' | 'newest' | 'price-asc' | 'price-desc'>('featured');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Filter & sort logic
  const filteredProducts = useMemo(() => {
    let result = [...initialProducts];

    // Category filter
    if (selectedCategory !== 'all') {
      result = result.filter(
        (p) => p.category_slug === selectedCategory || p.category_id === selectedCategory
      );
    }

    // Price tier filter - verified prices only!
    if (priceTier !== 'all') {
      result = result.filter((p) => {
        if (p.price_amount === null || p.price_amount === undefined) return false;
        switch (priceTier) {
          case 'under-299':
            return p.price_amount <= 299;
          case 'under-499':
            return p.price_amount <= 499;
          case 'under-999':
            return p.price_amount <= 999;
          case 'under-1499':
            return p.price_amount <= 1499;
          default:
            return true;
        }
      });
    }

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.editorial_note.toLowerCase().includes(q) ||
          p.best_for.toLowerCase().includes(q) ||
          (p.category_name && p.category_name.toLowerCase().includes(q))
      );
    }

    // Sorting
    switch (sortBy) {
      case 'price-asc':
        result.sort((a, b) => {
          if (a.price_amount === null) return 1;
          if (b.price_amount === null) return -1;
          return a.price_amount - b.price_amount;
        });
        break;
      case 'price-desc':
        result.sort((a, b) => {
          if (a.price_amount === null) return 1;
          if (b.price_amount === null) return -1;
          return b.price_amount - a.price_amount;
        });
        break;
      case 'newest':
        result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
      case 'featured':
      default:
        result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
        break;
    }

    return result;
  }, [initialProducts, selectedCategory, priceTier, searchQuery, sortBy]);

  const resetFilters = () => {
    setSelectedCategory('all');
    setPriceTier('all');
    setSearchQuery('');
    setSortBy('featured');
  };

  const hasActiveFilters = selectedCategory !== 'all' || priceTier !== 'all' || searchQuery.trim() !== '';

  return (
    <div className="py-10 sm:py-16 bg-ivory">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10 text-center sm:text-left">
          <span className="text-xs uppercase tracking-widest text-terracotta font-semibold mb-2 block">
            Catalogue
          </span>
          <h1 className="font-editorial text-3xl sm:text-4xl lg:text-5xl text-charcoal font-medium mb-3">
            Shop All Curated Finds
          </h1>
          <p className="text-sm text-charcoal/70 max-w-2xl leading-relaxed">
            Every piece is chosen with an editorial eye for everyday living in Indian apartments. Explore by room category or verified budget tiers.
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-purewhite p-4 rounded-sm border border-softborder mb-8 shadow-subtle flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Search box */}
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-warmgrey absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by product, material, or keyword..."
              className="w-full bg-ivory-50 border border-softborder focus:border-charcoal focus:outline-none text-charcoal text-xs sm:text-sm pl-10 pr-8 py-2 rounded-sm transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-warmgrey hover:text-charcoal"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Controls */}
          <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
            {/* Mobile filter toggle */}
            <button
              onClick={() => setMobileFilterOpen(true)}
              className="lg:hidden inline-flex items-center gap-1.5 px-3 py-2 bg-ivory border border-softborder rounded-sm text-xs font-medium text-charcoal"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Filters {hasActiveFilters && '(Active)'}</span>
            </button>

            {/* Sort selector */}
            <div className="flex items-center gap-2">
              <ArrowUpDown className="w-3.5 h-3.5 text-warmgrey hidden sm:block" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-ivory-50 border border-softborder text-charcoal text-xs sm:text-sm px-3 py-2 rounded-sm focus:outline-none focus:border-charcoal"
              >
                <option value="featured">Featured First</option>
                <option value="newest">Recently Added</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Layout: Sidebar + Product Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          {/* Desktop Filter Sidebar */}
          <aside className="hidden lg:block bg-purewhite p-6 rounded-sm border border-softborder shadow-subtle space-y-6 sticky top-28">
            <div className="flex items-center justify-between pb-4 border-b border-softborder">
              <h3 className="font-editorial text-lg text-charcoal font-medium">Refine Finds</h3>
              {hasActiveFilters && (
                <button
                  onClick={resetFilters}
                  className="text-xs text-terracotta hover:underline font-medium"
                >
                  Clear all
                </button>
              )}
            </div>

            {/* Category Filter */}
            <div>
              <h4 className="text-xs uppercase font-semibold text-charcoal tracking-wider mb-3">
                Category
              </h4>
              <ul className="space-y-1.5 text-xs sm:text-sm">
                <li>
                  <button
                    onClick={() => setSelectedCategory('all')}
                    className={cn(
                      'w-full text-left py-1.5 px-2 rounded-sm transition-colors flex items-center justify-between',
                      selectedCategory === 'all'
                        ? 'bg-sage-100 text-sage-800 font-semibold'
                        : 'text-charcoal/80 hover:bg-ivory'
                    )}
                  >
                    <span>All Categories</span>
                    <span className="text-[11px] text-warmgrey">{initialProducts.length}</span>
                  </button>
                </li>
                {categories.map((cat) => {
                  const count = initialProducts.filter(
                    (p) => p.category_slug === cat.slug || p.category_id === cat.id
                  ).length;
                  return (
                    <li key={cat.id}>
                      <button
                        onClick={() => setSelectedCategory(cat.slug)}
                        className={cn(
                          'w-full text-left py-1.5 px-2 rounded-sm transition-colors flex items-center justify-between',
                          selectedCategory === cat.slug
                            ? 'bg-sage-100 text-sage-800 font-semibold'
                            : 'text-charcoal/80 hover:bg-ivory'
                        )}
                      >
                        <span className="truncate pr-2">{cat.name}</span>
                        <span className="text-[11px] text-warmgrey">{count}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Price Filter (Verified only) */}
            <div className="pt-4 border-t border-softborder">
              <h4 className="text-xs uppercase font-semibold text-charcoal tracking-wider mb-3">
                Verified Price Tiers
              </h4>
              <ul className="space-y-1.5 text-xs sm:text-sm">
                {[
                  { id: 'all', label: 'All Prices' },
                  { id: 'under-299', label: 'Under ₹299' },
                  { id: 'under-499', label: 'Under ₹499' },
                  { id: 'under-999', label: 'Under ₹999' },
                  { id: 'under-1499', label: 'Under ₹1,499' },
                ].map((tier) => (
                  <li key={tier.id}>
                    <button
                      onClick={() => setPriceTier(tier.id)}
                      className={cn(
                        'w-full text-left py-1.5 px-2 rounded-sm transition-colors',
                        priceTier === tier.id
                          ? 'bg-terracotta-50 text-terracotta font-semibold'
                          : 'text-charcoal/80 hover:bg-ivory'
                      )}
                    >
                      {tier.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Compliance mini-notice */}
            <div className="pt-4 border-t border-softborder">
              <AffiliateNotice compact />
            </div>
          </aside>

          {/* Product Grid Area */}
          <main className="lg:col-span-3 space-y-6">
            <div className="flex items-center justify-between text-xs text-warmgrey">
              <span>
                Showing <strong className="text-charcoal">{filteredProducts.length}</strong> thoughtful finds
              </span>
              {hasActiveFilters && (
                <button onClick={resetFilters} className="text-terracotta hover:underline">
                  Reset filters
                </button>
              )}
            </div>

            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="bg-purewhite rounded-sm border border-softborder p-12 text-center space-y-4">
                <div className="w-12 h-12 mx-auto rounded-full bg-ivory-200 flex items-center justify-center text-warmgrey">
                  <Search className="w-5 h-5" />
                </div>
                <h3 className="font-editorial text-xl text-charcoal font-medium">
                  No matching finds discovered
                </h3>
                <p className="text-xs sm:text-sm text-charcoal/70 max-w-sm mx-auto leading-relaxed">
                  We could not find any products matching your active filters. Try searching for broader terms or clearing your filters.
                </p>
                <button
                  onClick={resetFilters}
                  className="px-5 py-2.5 bg-terracotta text-purewhite rounded-sm text-xs font-medium uppercase tracking-wider hover:bg-terracotta-600 transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Mobile Filters Slide-out Modal */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden overflow-hidden">
          <div
            className="fixed inset-0 bg-charcoal/40 backdrop-blur-sm"
            onClick={() => setMobileFilterOpen(false)}
          />
          <div className="fixed inset-y-0 right-0 max-w-xs w-full bg-ivory border-l border-softborder shadow-2xl flex flex-col p-6 z-10">
            <div className="flex items-center justify-between pb-4 border-b border-softborder">
              <h3 className="font-editorial text-lg text-charcoal font-medium">Filter Finds</h3>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="p-1 text-charcoal/70 hover:text-charcoal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-6 space-y-6">
              <div>
                <h4 className="text-xs uppercase font-semibold text-charcoal tracking-wider mb-2">
                  Category
                </h4>
                <div className="space-y-1">
                  <button
                    onClick={() => {
                      setSelectedCategory('all');
                      setMobileFilterOpen(false);
                    }}
                    className={cn(
                      'block w-full text-left py-2 px-2 text-xs rounded',
                      selectedCategory === 'all' ? 'bg-sage text-purewhite font-medium' : 'text-charcoal'
                    )}
                  >
                    All Categories
                  </button>
                  {categories.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => {
                        setSelectedCategory(c.slug);
                        setMobileFilterOpen(false);
                      }}
                      className={cn(
                        'block w-full text-left py-2 px-2 text-xs rounded',
                        selectedCategory === c.slug ? 'bg-sage text-purewhite font-medium' : 'text-charcoal'
                      )}
                    >
                      {c.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-softborder">
                <h4 className="text-xs uppercase font-semibold text-charcoal tracking-wider mb-2">
                  Price Tier
                </h4>
                <div className="space-y-1">
                  {['all', 'under-299', 'under-499', 'under-999', 'under-1499'].map((t) => (
                    <button
                      key={t}
                      onClick={() => {
                        setPriceTier(t);
                        setMobileFilterOpen(false);
                      }}
                      className={cn(
                        'block w-full text-left py-2 px-2 text-xs rounded capitalize',
                        priceTier === t ? 'bg-terracotta text-purewhite font-medium' : 'text-charcoal'
                      )}
                    >
                      {t === 'all' ? 'All Prices' : t.replace('-', ' ₹')}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-softborder">
              <button
                onClick={() => {
                  resetFilters();
                  setMobileFilterOpen(false);
                }}
                className="w-full py-2.5 bg-ivory-200 text-charcoal text-xs uppercase font-medium rounded text-center mb-2"
              >
                Reset All
              </button>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="w-full py-2.5 bg-terracotta text-purewhite text-xs uppercase font-medium rounded text-center"
              >
                Show Results ({filteredProducts.length})
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

