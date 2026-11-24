'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  Search,
  Sparkles,
  Download,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ShieldAlert,
  Info,
} from 'lucide-react';
import { Category, AmazonSearchResultItem } from '@/lib/types';
import { CreatorsApiConfig } from '@/lib/amazonCreatorsApi';
import { Button } from '@/components/ui/Button';

interface AmazonToolClientProps {
  categories: Category[];
  isConfigured: boolean;
  config: CreatorsApiConfig;
}

export function AmazonToolClient({
  categories,
  isConfigured,
  config,
}: AmazonToolClientProps) {
  const [query, setQuery] = useState('kitchen organizer');
  const [results, setResults] = useState<AmazonSearchResultItem[]>([]);
  const [sourceMode, setSourceMode] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [importedAsins, setImportedAsins] = useState<Record<string, boolean>>({});
  const [selectedCat, setSelectedCat] = useState<string>(categories[0]?.id || 'cat-1');
  const [statusMessage, setStatusMessage] = useState<string>('');

  const quickKeywords = [
    'kitchen organizer',
    'ceramic vase',
    'wall lamp',
    'storage baskets',
    'spice turntable',
    'pegboard',
  ];

  const handleSearch = async (searchWord?: string) => {
    const q = searchWord || query;
    if (!q.trim()) return;

    setLoading(true);
    setStatusMessage('');

    try {
      const res = await fetch(`/api/amazon/search?q=${encodeURIComponent(q.trim())}`);
      const data = await res.json();
      if (res.ok && data.success) {
        setResults(data.items || []);
        setSourceMode(data.source);
        setStatusMessage(data.message || '');
      } else {
        setStatusMessage(data.error || 'Failed to search items.');
      }
    } catch {
      setStatusMessage('Network error while searching Amazon items.');
    } finally {
      setLoading(false);
    }
  };

  const handleImport = async (item: AmazonSearchResultItem) => {
    try {
      const payload = {
        name: item.title,
        description:
          item.features && item.features.length > 0
            ? item.features.join('. ')
            : 'Thoughtful home discovery selected for contemporary living spaces.',
        category_id: selectedCat,
        asin: item.asin,
        amazon_affiliate_url: item.affiliateUrl,
        image_url: item.imageUrl,
        image_alt: item.title,
        editorial_note: 'Curated for clean aesthetic lines and genuine utility in Indian households.',
        best_for: 'Everyday apartment living and home organization.',
        price_amount: item.price?.amount || null,
        featured: false,
        is_published: true,
        source_type: 'amazon_creators_api',
        editorial_label: item.price ? `Under ₹${item.price.amount + 1}` : 'New Find',
      };

      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setImportedAsins((prev) => ({ ...prev, [item.asin]: true }));
      } else {
        alert('Could not import item to catalogue.');
      }
    } catch {
      alert('Network error while importing.');
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="pb-6 border-b border-softborder">
        <span className="text-xs uppercase tracking-widest text-terracotta font-semibold block mb-1">
          Official Integration
        </span>
        <h1 className="font-editorial text-3xl font-medium text-charcoal">
          Amazon Creators API Discovery & Import Tool
        </h1>
        <p className="text-xs sm:text-sm text-charcoal/70 mt-1 max-w-2xl leading-relaxed">
          Search Amazon India products, inspect verified ASINs, and import curated finds directly into the HOMELY catalogue with authorized associate tracking tags.
        </p>
      </div>

      {/* Mode Status Pill */}
      <div
        className={`p-5 rounded-sm border ${
          isConfigured
            ? 'bg-sage-50 border-sage-300 text-sage-900'
            : 'bg-ivory-100 border-softborder text-charcoal'
        } space-y-2`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-terracotta" />
            <h2 className="font-semibold text-sm">
              {isConfigured
                ? 'Mode 2: Live Amazon Creators API Active'
                : 'Mode 1: Manual Mode (Zero Credentials Required)'}
            </h2>
          </div>
          <span className="text-xs font-mono bg-purewhite px-2.5 py-1 rounded border border-softborder">
            Tag: {config.partnerTag || 'homelyindia-21'}
          </span>
        </div>
        <p className="text-xs leading-relaxed opacity-90">
          {isConfigured
            ? `Connected to official OAuth 2.0 endpoints for ${config.marketplace}. Server-side token auto-refreshed.`
            : `Operating in Mode 1. You can search verified catalog previews and import them immediately, or add custom products manually. Add AMAZON_CREATOR_CLIENT_ID and AMAZON_CREATOR_CLIENT_SECRET to .env.local to activate live OAuth API calls.`}
        </p>
      </div>

      {/* Search Bar */}
      <div className="bg-purewhite p-6 rounded-sm border border-softborder shadow-subtle space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-warmgrey absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Search Amazon India (e.g. ceramic vase, spice organizer, wall hooks)..."
              className="w-full bg-ivory-50 border border-softborder focus:border-charcoal focus:outline-none text-charcoal text-sm pl-10 pr-4 py-2.5 rounded-sm"
            />
          </div>

          <Button
            type="button"
            variant="primary"
            onClick={() => handleSearch()}
            disabled={loading}
            className="px-6 py-2.5"
          >
            <span>{loading ? 'Searching...' : 'Search Amazon'}</span>
          </Button>
        </div>

        {/* Quick Keyword Chips */}
        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-warmgrey">
          <span>Quick queries:</span>
          {quickKeywords.map((kw) => (
            <button
              key={kw}
              onClick={() => {
                setQuery(kw);
                handleSearch(kw);
              }}
              className="px-2.5 py-1 rounded bg-ivory-100 text-charcoal hover:bg-ivory-200 border border-softborder transition-colors capitalize text-[11px]"
            >
              {kw}
            </button>
          ))}
        </div>
      </div>

      {/* Import Configuration Selector */}
      <div className="flex items-center justify-between text-xs text-charcoal bg-purewhite p-4 rounded-sm border border-softborder">
        <span className="font-medium">Assign imported products to category:</span>
        <select
          value={selectedCat}
          onChange={(e) => setSelectedCat(e.target.value)}
          className="bg-ivory-50 border border-softborder text-xs px-3 py-1.5 rounded-sm focus:outline-none"
        >
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {statusMessage && (
        <p className="text-xs text-warmgrey italic">{statusMessage}</p>
      )}

      {/* Results Grid */}
      {results.length > 0 && (
        <div className="space-y-4">
          <h2 className="font-editorial text-xl text-charcoal font-medium">
            Available Amazon Finds ({results.length})
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.map((item) => {
              const isImported = importedAsins[item.asin];
              return (
                <div
                  key={item.asin}
                  className="bg-purewhite rounded-sm border border-softborder p-5 flex flex-col justify-between shadow-subtle space-y-4"
                >
                  <div className="space-y-3">
                    <div className="relative aspect-video rounded overflow-hidden bg-ivory-50">
                      <Image
                        src={item.imageUrl}
                        alt={item.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover"
                      />
                      <span className="absolute top-2 left-2 bg-charcoal text-purewhite text-[10px] font-mono px-2 py-0.5 rounded">
                        {item.asin}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="text-terracotta">
                        {item.price ? item.price.displayAmount : 'Price on request'}
                      </span>
                      <a
                        href={item.detailPageUrl}
                        target="_blank"
                        rel="noopener noreferrer nofollow"
                        className="text-warmgrey hover:text-charcoal inline-flex items-center gap-1 text-[11px]"
                      >
                        <span>Amazon.in</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>

                    <h3 className="font-editorial text-sm font-medium text-charcoal line-clamp-2 leading-snug">
                      {item.title}
                    </h3>

                    {item.features && item.features.length > 0 && (
                      <ul className="text-[11px] text-charcoal/70 list-disc pl-4 space-y-1 line-clamp-3">
                        {item.features.slice(0, 2).map((feat, i) => (
                          <li key={i}>{feat}</li>
                        ))}
                      </ul>
                    )}
                  </div>

                  <div className="pt-3 border-t border-softborder">
                    <Button
                      variant={isImported ? 'outline' : 'primary'}
                      size="sm"
                      disabled={isImported}
                      onClick={() => handleImport(item)}
                      className="w-full text-xs"
                    >
                      {isImported ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-sage mr-1" />
                          <span>Imported to HOMELY</span>
                        </>
                      ) : (
                        <>
                          <Download className="w-3.5 h-3.5 mr-1" />
                          <span>Import into Catalogue</span>
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

