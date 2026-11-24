'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Star,
  Eye,
  Share2,
  Copy,
  Check,
  ExternalLink,
  X,
  AlertTriangle,
  CheckCircle2,
  ImageOff,
  Upload,
} from 'lucide-react';
import { Product, Category } from '@/lib/types';
import { formatINR, buildPinterestPinUrl, isValidAmazonIndiaUrl } from '@/lib/utils';

interface ProductListClientProps {
  initialProducts: Product[];
  categories: Category[];
}

export function ProductListClient({ initialProducts, categories }: ProductListClientProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'needs-image' | 'needs-link'>('all');
  const [affiliateModalProduct, setAffiliateModalProduct] = useState<Product | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCaption, setCopiedCaption] = useState(false);

  const filtered = products.filter((p) => {
    const matchesCat = catFilter === 'all' || p.category_id === catFilter || p.category_slug === catFilter;
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase()) ||
      p.asin?.toLowerCase().includes(search.toLowerCase());

    let matchesStatus = true;
    if (statusFilter === 'needs-image') {
      matchesStatus = !p.image_url || p.image_url.includes('unsplash');
    } else if (statusFilter === 'needs-link') {
      matchesStatus = !p.amazon_affiliate_url || !isValidAmazonIndiaUrl(p.amazon_affiliate_url);
    }

    return matchesCat && matchesSearch && matchesStatus;
  });

  const handleTogglePublish = async (id: string, current: boolean) => {
    const updated = products.map((p) => (p.id === id ? { ...p, is_published: !current } : p));
    setProducts(updated);

    await fetch(`/api/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_published: !current }),
    });
  };

  const handleToggleFeatured = async (id: string, current: boolean) => {
    const updated = products.map((p) => (p.id === id ? { ...p, featured: !current } : p));
    setProducts(updated);

    await fetch(`/api/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ featured: !current }),
    });
  };

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete "${name}" from the catalogue?`)) {
      setProducts(products.filter((p) => p.id !== id));
      await fetch(`/api/products/${id}`, { method: 'DELETE' });
    }
  };

  const handleCopyLink = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleCopyCaption = (p: Product) => {
    const caption = `${p.name} — ${p.editorial_note}\n\nShop on Amazon India: ${p.amazon_affiliate_url}\n\n#homedecor #amazonfinds #indianhome #amazonindia #homeaesthetic #interiordecor #homely`;
    navigator.clipboard.writeText(caption);
    setCopiedCaption(true);
    setTimeout(() => setCopiedCaption(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-softborder">
        <div>
          <span className="text-xs uppercase tracking-widest text-terracotta font-semibold block">
            Manual Catalogue Control
          </span>
          <h1 className="font-editorial text-3xl font-medium text-charcoal">
            Products Directory ({products.length})
          </h1>
          <p className="text-xs text-warmgrey mt-1">
            Ensure every product find has an exact uploaded image and an authorized Amazon India destination link.
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-terracotta text-purewhite rounded-sm text-xs uppercase font-medium hover:bg-terracotta-600 transition-colors shadow-sm self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </Link>
      </div>

      {/* Controls Bar */}
      <div className="bg-purewhite p-4 rounded-sm border border-softborder flex flex-col md:flex-row gap-3 items-center justify-between shadow-subtle">
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-warmgrey absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, ASIN, or keyword..."
            className="w-full bg-ivory-50 border border-softborder focus:border-charcoal focus:outline-none text-charcoal text-xs pl-9 pr-4 py-2 rounded-sm"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="bg-ivory-50 border border-softborder text-charcoal text-xs px-3 py-2 rounded-sm focus:outline-none focus:border-charcoal flex-1 sm:flex-initial"
          >
            <option value="all">All Statuses</option>
            <option value="needs-image">Needs Exact Image Upload</option>
            <option value="needs-link">Needs Link Verification</option>
          </select>

          {/* Category Filter */}
          <select
            value={catFilter}
            onChange={(e) => setCatFilter(e.target.value)}
            className="bg-ivory-50 border border-softborder text-charcoal text-xs px-3 py-2 rounded-sm focus:outline-none focus:border-charcoal flex-1 sm:flex-initial"
          >
            <option value="all">All Categories ({products.length})</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-purewhite rounded-sm border border-softborder shadow-subtle overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-ivory-50 border-b border-softborder text-warmgrey uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Product Image</th>
                <th className="py-3 px-4">Title & Match Status</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Amazon Link Status</th>
                <th className="py-3 px-4 text-center">Featured</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-softborder/60">
              {filtered.map((product) => {
                const isUploaded =
                  product.image_url?.startsWith('/uploads') ||
                  product.image_url?.includes('supabase');
                const hasValidLink =
                  product.amazon_affiliate_url &&
                  isValidAmazonIndiaUrl(product.amazon_affiliate_url);

                return (
                  <tr key={product.id} className="hover:bg-ivory-50/50">
                    <td className="py-3 px-4">
                      <div className="relative w-12 h-12 rounded overflow-hidden bg-ivory-100 flex-shrink-0 border border-softborder">
                        {product.image_url ? (
                          <Image
                            src={product.image_url}
                            alt={product.name}
                            fill
                            sizes="48px"
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-warmgrey">
                            <ImageOff className="w-4 h-4" />
                          </div>
                        )}
                      </div>
                    </td>

                    <td className="py-3 px-4 max-w-xs">
                      <p className="font-semibold text-charcoal truncate">{product.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] text-warmgrey font-mono">
                          ASIN: {product.asin || 'None'}
                        </span>
                        {isUploaded ? (
                          <span className="text-[9px] font-bold text-sage-800 bg-sage-100 px-1.5 py-0.5 rounded uppercase">
                            Uploaded
                          </span>
                        ) : (
                          <span className="text-[9px] font-bold text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded uppercase">
                            Stock Photo
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-3 px-4 text-charcoal/80">
                      {product.category_name}
                    </td>

                    <td className="py-3 px-4">
                      {hasValidLink ? (
                        <div className="space-y-1">
                          <span className="text-sage-700 flex items-center gap-1 font-semibold text-[11px]">
                            <CheckCircle2 className="w-3.5 h-3.5 text-sage" />
                            <span>Verified Amazon Link</span>
                          </span>
                          <a
                            href={product.amazon_affiliate_url}
                            target="_blank"
                            rel="noopener noreferrer nofollow"
                            className="text-[10px] text-terracotta hover:underline inline-flex items-center gap-0.5 font-medium"
                          >
                            <span>Test Live Link</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                        </div>
                      ) : (
                        <span className="text-terracotta flex items-center gap-1 font-semibold text-[11px]">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          <span>Link Needs Setup</span>
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => handleToggleFeatured(product.id, product.featured)}
                        aria-label="Toggle featured"
                        className={`p-1.5 rounded transition-colors ${
                          product.featured
                            ? 'text-terracotta bg-terracotta-50 hover:bg-terracotta-100'
                            : 'text-warmgrey hover:text-charcoal'
                        }`}
                      >
                        <Star className={`w-4 h-4 ${product.featured ? 'fill-current' : ''}`} />
                      </button>
                    </td>

                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => handleTogglePublish(product.id, product.is_published)}
                        className={`px-2.5 py-1 rounded text-[10px] font-semibold uppercase tracking-wider transition-colors ${
                          product.is_published
                            ? 'bg-sage-100 text-sage-800 hover:bg-sage-200'
                            : 'bg-ivory-200 text-charcoal/60 hover:bg-ivory-300'
                        }`}
                      >
                        {product.is_published ? 'Published' : 'Draft'}
                      </button>
                    </td>

                    <td className="py-3 px-4 text-right space-x-2 whitespace-nowrap">
                      {/* Pinterest Tools */}
                      <button
                        onClick={() => setAffiliateModalProduct(product)}
                        title="Pinterest & Affiliate Creator Tools"
                        aria-label="Pinterest Tools"
                        className="inline-block p-1.5 text-terracotta hover:bg-terracotta-50 rounded transition-colors"
                      >
                        <Share2 className="w-4 h-4" />
                      </button>

                      {/* View Live Customer Page */}
                      <Link
                        href={`/product/${product.slug}`}
                        target="_blank"
                        title="View live customer page"
                        aria-label="View live"
                        className="inline-block p-1.5 text-warmgrey hover:text-charcoal transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>

                      {/* Edit Product & Replace Image */}
                      <Link
                        href={`/admin/products/${product.id}`}
                        title="Edit product find & upload photo"
                        aria-label="Edit product"
                        className="inline-block p-1.5 text-charcoal bg-ivory-100 hover:bg-ivory-200 border border-softborder rounded transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Link>

                      <button
                        onClick={() => handleDelete(product.id, product.name)}
                        title="Delete product"
                        aria-label="Delete product"
                        className="inline-block p-1.5 text-warmgrey hover:text-terracotta transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pinterest & Affiliate Creator Modal */}
      {affiliateModalProduct && (
        <div className="fixed inset-0 z-50 bg-charcoal/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-purewhite rounded-sm border border-softborder shadow-elevated max-w-md w-full p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between pb-3 border-b border-softborder">
              <div className="flex items-center gap-2">
                <Share2 className="w-4 h-4 text-terracotta" />
                <h3 className="font-editorial text-lg font-medium text-charcoal">
                  Pinterest & Affiliate Creator Tools
                </h3>
              </div>
              <button
                onClick={() => setAffiliateModalProduct(null)}
                aria-label="Close modal"
                className="text-warmgrey hover:text-charcoal p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center gap-3 p-3 bg-ivory-50 rounded-sm border border-softborder">
              <div className="relative w-12 h-12 rounded overflow-hidden flex-shrink-0 border border-softborder bg-purewhite">
                {affiliateModalProduct.image_url ? (
                  <Image
                    src={affiliateModalProduct.image_url}
                    alt={affiliateModalProduct.name}
                    fill
                    sizes="48px"
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-warmgrey">
                    <ImageOff className="w-4 h-4" />
                  </div>
                )}
              </div>
              <div className="overflow-hidden">
                <p className="font-semibold text-xs text-charcoal truncate">
                  {affiliateModalProduct.name}
                </p>
                <p className="text-[10px] text-warmgrey font-mono">
                  ASIN: {affiliateModalProduct.asin || 'None'}
                </p>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              {/* Direct Pin Button */}
              <a
                href={buildPinterestPinUrl({
                  url: typeof window !== 'undefined'
                    ? `${window.location.origin}/product/${affiliateModalProduct.slug}`
                    : `https://homelyliving.in/product/${affiliateModalProduct.slug}`,
                  media: affiliateModalProduct.image_url,
                  description: `${affiliateModalProduct.name} — ${affiliateModalProduct.editorial_note}`,
                })}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-[#E60023] text-purewhite rounded-sm font-semibold hover:bg-[#c9001f] transition-colors"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345-.09.375-.291 1.199-.334 1.365-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.538.535 6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z" />
                </svg>
                <span>Pin Directly to Pinterest</span>
              </a>

              {/* Copy Amazon Affiliate Link */}
              <button
                type="button"
                onClick={() => handleCopyLink(affiliateModalProduct.amazon_affiliate_url)}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-ivory border border-softborder text-charcoal rounded-sm font-medium hover:bg-ivory-200 transition-colors"
              >
                {copiedLink ? <Check className="w-4 h-4 text-sage" /> : <Copy className="w-4 h-4" />}
                <span>{copiedLink ? 'Affiliate Link Copied!' : 'Copy Exact Amazon Link'}</span>
              </button>

              {/* Copy Pinterest SEO Caption */}
              <button
                type="button"
                onClick={() => handleCopyCaption(affiliateModalProduct)}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-ivory border border-softborder text-charcoal rounded-sm font-medium hover:bg-ivory-200 transition-colors"
              >
                {copiedCaption ? <Check className="w-4 h-4 text-sage" /> : <Copy className="w-4 h-4" />}
                <span>{copiedCaption ? 'Caption & Tags Copied!' : 'Copy Pin Caption & Tags'}</span>
              </button>

              {/* Direct Test Link */}
              <a
                href={affiliateModalProduct.amazon_affiliate_url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-2 px-4 text-warmgrey hover:text-charcoal text-[11px] transition-colors"
              >
                <span>Test Amazon India Destination</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
