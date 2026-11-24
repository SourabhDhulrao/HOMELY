import React from 'react';
import Link from 'next/link';
import { getAllAdminProducts, getAllAdminArticles } from '@/lib/dataService';
import { isAmazonApiConfigured, getCreatorsApiConfig } from '@/lib/amazonCreatorsApi';
import { isSupabaseConfigured } from '@/lib/supabase';
import {
  Package,
  FileText,
  Sparkles,
  Database,
  Plus,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

export default async function AdminOverviewPage() {
  const [products, articles] = await Promise.all([
    getAllAdminProducts(),
    getAllAdminArticles(),
  ]);

  const totalProducts = products.length;
  const publishedProducts = products.filter((p) => p.is_published).length;
  const featuredProducts = products.filter((p) => p.featured).length;
  const totalArticles = articles.length;

  const amazonConfigured = isAmazonApiConfigured();
  const amazonConfig = getCreatorsApiConfig();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-softborder">
        <div>
          <span className="text-xs uppercase tracking-widest text-terracotta font-semibold block">
            Dashboard
          </span>
          <h1 className="font-editorial text-3xl font-medium text-charcoal">
            Editorial Studio Overview
          </h1>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/admin/products/new"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-terracotta text-purewhite rounded-sm text-xs uppercase font-medium hover:bg-terracotta-600 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Add Product</span>
          </Link>
          <Link
            href="/admin/amazon"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-sage text-purewhite rounded-sm text-xs uppercase font-medium hover:bg-sage-600 transition-colors shadow-sm"
          >
            <Sparkles className="w-4 h-4" />
            <span>Amazon API Tool</span>
          </Link>
        </div>
      </div>

      {/* Integration Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Amazon Creators API Mode Card */}
        <div className="bg-purewhite p-6 rounded-sm border border-softborder shadow-subtle space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-terracotta" />
              <h2 className="font-editorial text-lg text-charcoal font-medium">
                Amazon Creators API (India)
              </h2>
            </div>
            {amazonConfigured ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-sage-100 text-sage-800 text-[11px] font-semibold rounded-full uppercase tracking-wider">
                <CheckCircle2 className="w-3 h-3 text-sage-600" />
                Mode 2: Active
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-ivory-200 text-charcoal/80 text-[11px] font-semibold rounded-full uppercase tracking-wider">
                Mode 1: Manual Mode
              </span>
            )}
          </div>

          <p className="text-xs text-charcoal/75 leading-relaxed">
            {amazonConfigured
              ? `Connected to ${amazonConfig.marketplace} with partner tag '${amazonConfig.partnerTag}'. Direct SearchItems and automated catalog importing enabled.`
              : `Operating in manual product mode. Manual creation, affiliate link validation, and catalog curation work independently. Live OAuth credentials can be connected anytime via .env.local.`}
          </p>

          <div className="pt-2 flex items-center justify-between text-xs border-t border-softborder/60">
            <span className="text-warmgrey">Associate Tag: {amazonConfig.partnerTag || 'homelyindia-21'}</span>
            <Link href="/admin/amazon" className="text-terracotta font-medium hover:underline inline-flex items-center gap-1">
              <span>Open Tool</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Database Status Card */}
        <div className="bg-purewhite p-6 rounded-sm border border-softborder shadow-subtle space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Database className="w-5 h-5 text-sage" />
              <h2 className="font-editorial text-lg text-charcoal font-medium">
                Data Storage Engine
              </h2>
            </div>
            {isSupabaseConfigured ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-sage-100 text-sage-800 text-[11px] font-semibold rounded-full uppercase tracking-wider">
                <CheckCircle2 className="w-3 h-3 text-sage-600" />
                Supabase Connected
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-ivory-200 text-charcoal/80 text-[11px] font-semibold rounded-full uppercase tracking-wider">
                Memory / In-Runtime
              </span>
            )}
          </div>

          <p className="text-xs text-charcoal/75 leading-relaxed">
            {isSupabaseConfigured
              ? 'Supabase PostgreSQL connected. Catalogue items, articles, and newsletter subscribers persist directly to your cloud database.'
              : 'App running with high-performance runtime storage. SQL migration schema is available at /supabase/schema.sql ready for instant Supabase connection.'}
          </p>

          <div className="pt-2 flex items-center justify-between text-xs border-t border-softborder/60">
            <span className="text-warmgrey">Status: Operational</span>
            <span className="text-charcoal/70">Zero Downtime Fallback Active</span>
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-purewhite p-5 rounded-sm border border-softborder shadow-subtle">
          <span className="text-xs text-warmgrey uppercase tracking-wider font-medium">Total Products</span>
          <p className="font-editorial text-3xl font-semibold text-charcoal mt-1">{totalProducts}</p>
          <span className="text-[11px] text-sage font-medium mt-1 block">In catalogue</span>
        </div>

        <div className="bg-purewhite p-5 rounded-sm border border-softborder shadow-subtle">
          <span className="text-xs text-warmgrey uppercase tracking-wider font-medium">Published Live</span>
          <p className="font-editorial text-3xl font-semibold text-charcoal mt-1">{publishedProducts}</p>
          <span className="text-[11px] text-sage font-medium mt-1 block">Visible to shoppers</span>
        </div>

        <div className="bg-purewhite p-5 rounded-sm border border-softborder shadow-subtle">
          <span className="text-xs text-warmgrey uppercase tracking-wider font-medium">Featured Picks</span>
          <p className="font-editorial text-3xl font-semibold text-charcoal mt-1">{featuredProducts}</p>
          <span className="text-[11px] text-terracotta font-medium mt-1 block">Homepage highlighted</span>
        </div>

        <div className="bg-purewhite p-5 rounded-sm border border-softborder shadow-subtle">
          <span className="text-xs text-warmgrey uppercase tracking-wider font-medium">Journal Articles</span>
          <p className="font-editorial text-3xl font-semibold text-charcoal mt-1">{totalArticles}</p>
          <span className="text-[11px] text-sage font-medium mt-1 block">Editorial essays</span>
        </div>
      </div>

      {/* Recent Products Snapshot */}
      <div className="bg-purewhite rounded-sm border border-softborder shadow-subtle overflow-hidden">
        <div className="p-6 border-b border-softborder flex items-center justify-between">
          <h2 className="font-editorial text-xl text-charcoal font-medium">
            Recent Catalogue Selections
          </h2>
          <Link
            href="/admin/products"
            className="text-xs font-semibold uppercase tracking-wider text-terracotta hover:underline inline-flex items-center gap-1"
          >
            <span>Manage All Products</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-ivory-50 border-b border-softborder text-warmgrey uppercase tracking-wider">
              <tr>
                <th className="py-3 px-6">Product</th>
                <th className="py-3 px-6">Category</th>
                <th className="py-3 px-6">Price</th>
                <th className="py-3 px-6">Status</th>
                <th className="py-3 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-softborder/60">
              {products.slice(0, 5).map((prod) => (
                <tr key={prod.id} className="hover:bg-ivory-50/50">
                  <td className="py-3.5 px-6 font-medium text-charcoal max-w-xs truncate">
                    {prod.name}
                  </td>
                  <td className="py-3.5 px-6 text-charcoal/80">
                    {prod.category_name}
                  </td>
                  <td className="py-3.5 px-6 text-charcoal font-semibold">
                    {prod.price_amount ? `₹${prod.price_amount}` : 'Unverified'}
                  </td>
                  <td className="py-3.5 px-6">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider ${
                        prod.is_published
                          ? 'bg-sage-100 text-sage-800'
                          : 'bg-ivory-200 text-charcoal/70'
                      }`}
                    >
                      {prod.is_published ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className="py-3.5 px-6 text-right space-x-2">
                    <Link
                      href={`/admin/products/${prod.id}`}
                      className="text-charcoal hover:text-terracotta font-medium underline"
                    >
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

