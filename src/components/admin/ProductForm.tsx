'use client';

import React, { useState, useRef, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Product, Category } from '@/lib/types';
import { buildAmazonAffiliateUrl, isValidAmazonIndiaUrl, formatINR } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import {
  Save,
  ArrowLeft,
  AlertCircle,
  UploadCloud,
  X,
  Star,
  Loader2,
  ExternalLink,
  Plus,
  CheckCircle2,
  AlertTriangle,
  Eye,
  RefreshCw,
  ImageOff,
} from 'lucide-react';

interface ProductFormProps {
  initialProduct?: Product;
  categories: Category[];
  isEdit?: boolean;
}

export function ProductForm({ initialProduct, categories, isEdit = false }: ProductFormProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const replaceInputRef = useRef<HTMLInputElement>(null);

  const initialImages: string[] = initialProduct?.images && initialProduct.images.length > 0
    ? initialProduct.images
    : initialProduct?.image_url
    ? [initialProduct.image_url]
    : [];

  const [formData, setFormData] = useState({
    id: initialProduct?.id || '',
    name: initialProduct?.name || '',
    slug: initialProduct?.slug || '',
    category_id: initialProduct?.category_id || categories[0]?.id || 'cat-1',
    asin: initialProduct?.asin || '',
    amazon_affiliate_url: initialProduct?.amazon_affiliate_url || '',
    image_url: initialProduct?.image_url || initialImages[0] || '',
    images: initialImages,
    image_alt: initialProduct?.image_alt || '',
    description: initialProduct?.description || '',
    editorial_note: initialProduct?.editorial_note || '',
    best_for: initialProduct?.best_for || '',
    editorial_label: initialProduct?.editorial_label || '',
    price_amount: initialProduct?.price_amount !== null && initialProduct?.price_amount !== undefined ? initialProduct.price_amount : '',
    featured: initialProduct?.featured ?? false,
    is_published: initialProduct?.is_published ?? true,
    source_type: initialProduct?.source_type || 'manual',
  });

  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string>('');
  const [isDragging, setIsDragging] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [storageType, setStorageType] = useState<'supabase' | 'local' | null>(null);

  // Validate Amazon Affiliate URL
  const amazonValidation = useMemo(() => {
    const url = formData.amazon_affiliate_url.trim();
    if (!url) {
      return { valid: false, message: 'Amazon affiliate URL is required to publish.' };
    }
    if (!isValidAmazonIndiaUrl(url)) {
      return {
        valid: false,
        message: 'Must be an official Amazon India URL (amazon.in or amzn.to shortlink).',
      };
    }
    return { valid: true, message: 'Valid Amazon India URL ready for exact redirection.' };
  }, [formData.amazon_affiliate_url]);

  const selectedCategoryName = useMemo(() => {
    const found = categories.find((c) => c.id === formData.category_id);
    return found ? found.name : 'Home Decor';
  }, [categories, formData.category_id]);

  // Handle Amazon URL formatting on blur (attaching partner tag if standard amazon.in)
  const handleUrlBlur = () => {
    if (formData.amazon_affiliate_url) {
      const formatted = buildAmazonAffiliateUrl(formData.amazon_affiliate_url, formData.asin);
      setFormData((prev) => ({ ...prev, amazon_affiliate_url: formatted }));
    }
  };

  // Upload validation and processing
  const processFiles = async (files: FileList | File[], replaceIndex?: number) => {
    const fileArray = Array.from(files).filter((f) => f.type.startsWith('image/'));
    if (fileArray.length === 0) {
      setErrorMsg('Please select valid image files (JPG, PNG, WEBP, AVIF).');
      return;
    }

    // Check size limit: 5MB
    for (const f of fileArray) {
      if (f.size > 5 * 1024 * 1024) {
        setErrorMsg(`"${f.name}" is larger than 5MB. Please choose an optimized image.`);
        return;
      }
    }

    setUploading(true);
    setUploadProgress(`Uploading ${fileArray.length} image${fileArray.length > 1 ? 's' : ''}...`);
    setErrorMsg('');

    try {
      const uploadData = new FormData();
      fileArray.forEach((file) => uploadData.append('files', file));

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: uploadData,
      });

      const data = await res.json();

      if (res.ok && data.urls && data.urls.length > 0) {
        setStorageType(data.storage || 'local');
        setFormData((prev) => {
          if (replaceIndex !== undefined && replaceIndex >= 0) {
            const updated = [...prev.images];
            updated[replaceIndex] = data.urls[0];
            return {
              ...prev,
              images: updated,
              image_url: replaceIndex === 0 ? data.urls[0] : prev.image_url,
            };
          }
          const combined = [...prev.images, ...data.urls];
          return {
            ...prev,
            images: combined,
            image_url: prev.image_url || data.urls[0],
          };
        });
        setUploadProgress('');
      } else {
        setErrorMsg(data.error || 'Failed to upload image. Please try again.');
      }
    } catch {
      setErrorMsg('Network error while uploading image.');
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
    }
  };

  const handleReplaceFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files, 0); // Replace primary image
    }
  };

  const handleSetPrimary = (url: string) => {
    setFormData((prev) => {
      const remaining = prev.images.filter((img) => img !== url);
      return {
        ...prev,
        image_url: url,
        images: [url, ...remaining],
      };
    });
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setFormData((prev) => {
      const updated = prev.images.filter((_, idx) => idx !== indexToRemove);
      const newPrimary = updated.includes(prev.image_url)
        ? prev.image_url
        : updated[0] || '';
      return {
        ...prev,
        images: updated,
        image_url: newPrimary,
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    // Pre-publish validation
    if (formData.is_published) {
      if (formData.images.length === 0 && !formData.image_url) {
        setErrorMsg('Image required: You must upload an actual product image before publishing.');
        return;
      }
      if (!amazonValidation.valid) {
        setErrorMsg(`Amazon URL error: ${amazonValidation.message}`);
        return;
      }
    }

    setSaving(true);

    try {
      const primaryImage = formData.image_url || formData.images[0] || '';
      const payload = {
        ...formData,
        image_url: primaryImage,
        images: formData.images.length > 0 ? formData.images : (primaryImage ? [primaryImage] : []),
        price_amount: formData.price_amount !== '' ? parseFloat(formData.price_amount.toString()) : null,
      };

      const url = isEdit ? `/api/products/${formData.id}` : '/api/products';
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        router.push('/admin/products');
        router.refresh();
      } else {
        setErrorMsg(data.error || 'Failed to save product find.');
      }
    } catch {
      setErrorMsg('Network error while saving product find.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-softborder">
        <div>
          <Link
            href="/admin/products"
            className="inline-flex items-center gap-1 text-xs text-warmgrey hover:text-charcoal mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Products Directory</span>
          </Link>
          <h1 className="font-editorial text-3xl font-medium text-charcoal">
            {isEdit ? 'Edit Exact Product Find' : 'Add Manual Product Find'}
          </h1>
          <p className="text-xs text-warmgrey mt-1">
            Ensure the uploaded product image and the pasted Amazon link represent the exact same product.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setShowPreviewModal(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-ivory-100 hover:bg-ivory-200 border border-softborder text-charcoal rounded-sm text-xs font-semibold transition-colors"
          >
            <Eye className="w-4 h-4 text-terracotta" />
            <span>Preview & Verify</span>
          </button>

          <Button
            type="submit"
            variant="primary"
            disabled={saving || uploading}
            className="px-6 py-2.5"
          >
            <Save className="w-4 h-4 mr-1.5" />
            <span>{saving ? 'Saving...' : 'Save Product'}</span>
          </Button>
        </div>
      </div>

      {errorMsg && (
        <div className="p-4 bg-terracotta-50 border border-terracotta-200 text-terracotta rounded-sm text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Main Form Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Core Details & Editorial */}
        <div className="lg:col-span-7 space-y-6 bg-purewhite p-6 sm:p-8 rounded-sm border border-softborder shadow-subtle">
          <h2 className="font-editorial text-xl font-medium text-charcoal pb-2 border-b border-softborder">
            1. Exact Product Details
          </h2>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal mb-1.5">
              Product Title *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Borosil Classic Pure Borosilicate Glass Jars (Set of 6)"
              className="w-full bg-ivory-50 border border-softborder focus:border-charcoal focus:outline-none text-charcoal text-sm p-3 rounded-sm"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal mb-1.5">
                Category *
              </label>
              <select
                value={formData.category_id}
                onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                className="w-full bg-ivory-50 border border-softborder focus:border-charcoal focus:outline-none text-charcoal text-sm p-3 rounded-sm"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal mb-1.5">
                Editorial Badge / Label
              </label>
              <input
                type="text"
                value={formData.editorial_label}
                onChange={(e) => setFormData({ ...formData, editorial_label: e.target.value })}
                placeholder="e.g. Editor's Pick, Space Saver, Under ₹499"
                className="w-full bg-ivory-50 border border-softborder focus:border-charcoal focus:outline-none text-charcoal text-sm p-3 rounded-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal mb-1.5">
              Product Description *
            </label>
            <textarea
              required
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Accurate description of product features, dimensions, material, and packaging..."
              className="w-full bg-ivory-50 border border-softborder focus:border-charcoal focus:outline-none text-charcoal text-sm p-3 rounded-sm"
            />
          </div>

          <h2 className="font-editorial text-xl font-medium text-charcoal pt-4 pb-2 border-b border-softborder">
            2. Editorial Recommendation
          </h2>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal mb-1.5">
              Why We Selected It (Editorial Note) *
            </label>
            <textarea
              required
              rows={3}
              value={formData.editorial_note}
              onChange={(e) => setFormData({ ...formData, editorial_note: e.target.value })}
              placeholder="Why this product stands out for Indian homes: craftsmanship, utility, durability, aesthetics..."
              className="w-full bg-ivory-50 border border-softborder focus:border-charcoal focus:outline-none text-charcoal text-sm p-3 rounded-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal mb-1.5">
              Best Use Case *
            </label>
            <input
              type="text"
              required
              value={formData.best_for}
              onChange={(e) => setFormData({ ...formData, best_for: e.target.value })}
              placeholder="e.g. Modular spice drawer organization, narrow kitchen counters"
              className="w-full bg-ivory-50 border border-softborder focus:border-charcoal focus:outline-none text-charcoal text-sm p-3 rounded-sm"
            />
          </div>
        </div>

        {/* Right Column: Exact Image Upload, Exact Affiliate Link & Preview */}
        <div className="lg:col-span-5 space-y-6">
          {/* Actual Product Image Upload Card */}
          <div className="bg-purewhite p-6 rounded-sm border border-softborder shadow-subtle space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-softborder">
              <div>
                <h3 className="font-editorial text-lg font-medium text-charcoal">
                  Actual Product Photo *
                </h3>
                <p className="text-[11px] text-warmgrey">
                  Upload the exact product image matching Amazon.
                </p>
              </div>
              {storageType && (
                <span className="text-[10px] text-sage-800 bg-sage-50 border border-sage-200 px-2 py-0.5 rounded-sm">
                  {storageType === 'supabase' ? 'Supabase Storage' : 'Local Storage'}
                </span>
              )}
            </div>

            {/* Hidden file inputs */}
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/jpeg,image/png,image/webp,image/avif"
              onChange={handleFileChange}
              className="hidden"
            />
            <input
              ref={replaceInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/avif"
              onChange={handleReplaceFileChange}
              className="hidden"
            />

            {/* Drag & Drop Upload Zone */}
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setIsDragging(false);
                if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                  processFiles(e.dataTransfer.files);
                }
              }}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-sm p-5 text-center cursor-pointer transition-colors ${
                isDragging
                  ? 'border-terracotta bg-terracotta-50/50'
                  : 'border-softborder hover:border-charcoal bg-ivory-50/60'
              }`}
            >
              {uploading ? (
                <div className="py-3 flex flex-col items-center justify-center gap-2 text-terracotta">
                  <Loader2 className="w-6 h-6 animate-spin" />
                  <p className="text-xs font-medium">{uploadProgress || 'Uploading image...'}</p>
                </div>
              ) : (
                <div className="py-2 flex flex-col items-center justify-center gap-2">
                  <div className="w-9 h-9 rounded-full bg-ivory flex items-center justify-center text-charcoal border border-softborder">
                    <UploadCloud className="w-5 h-5 text-terracotta" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-charcoal">
                      Click to choose or drag & drop product photos
                    </p>
                    <p className="text-[11px] text-warmgrey mt-0.5">
                      JPG, PNG, WEBP, AVIF (Max 5MB)
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Primary & Uploaded Images Manager */}
            {formData.images.length > 0 ? (
              <div className="space-y-2.5 pt-1">
                <div className="flex items-center justify-between text-xs text-warmgrey">
                  <span>Uploaded ({formData.images.length} photos)</span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => replaceInputRef.current?.click()}
                      className="inline-flex items-center gap-1 text-charcoal hover:text-terracotta text-[11px] font-medium"
                    >
                      <RefreshCw className="w-3 h-3" />
                      <span>Replace</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="inline-flex items-center gap-1 text-terracotta hover:underline text-[11px] font-medium"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Add More</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {formData.images.map((imgUrl, idx) => {
                    const isCover = imgUrl === formData.image_url || (!formData.image_url && idx === 0);
                    return (
                      <div
                        key={`${imgUrl}-${idx}`}
                        className={`relative aspect-square rounded-sm overflow-hidden border bg-ivory-100 group ${
                          isCover ? 'border-terracotta ring-1 ring-terracotta' : 'border-softborder'
                        }`}
                      >
                        <Image
                          src={imgUrl}
                          alt={`Product photo ${idx + 1}`}
                          fill
                          sizes="120px"
                          className="object-cover"
                        />

                        {isCover && (
                          <div className="absolute top-1 left-1 bg-terracotta text-purewhite text-[8px] font-bold px-1.5 py-0.5 rounded-sm uppercase tracking-wider">
                            Cover
                          </div>
                        )}

                        <div className="absolute inset-0 bg-charcoal/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5">
                          {!isCover && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSetPrimary(imgUrl);
                              }}
                              title="Set as Cover Photo"
                              className="p-1 bg-purewhite text-charcoal hover:text-terracotta rounded-sm"
                            >
                              <Star className="w-3.5 h-3.5" />
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveImage(idx);
                            }}
                            title="Remove Photo"
                            className="p-1 bg-purewhite text-terracotta hover:bg-terracotta-50 rounded-sm"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-sm text-xs text-amber-800 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
                <span>No product image uploaded. A neutral placeholder will be shown until you upload an exact photo.</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal mb-1.5">
                Image Alt Description
              </label>
              <input
                type="text"
                value={formData.image_alt}
                onChange={(e) => setFormData({ ...formData, image_alt: e.target.value })}
                placeholder="Accurate description of the item in the image"
                className="w-full bg-ivory-50 border border-softborder focus:border-charcoal focus:outline-none text-charcoal text-xs p-2.5 rounded-sm"
              />
            </div>
          </div>

          {/* Exact Amazon Affiliate Link Card */}
          <div className="bg-purewhite p-6 rounded-sm border border-softborder shadow-subtle space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-softborder">
              <h3 className="font-editorial text-lg font-medium text-charcoal">
                Exact Amazon India Link *
              </h3>
              {formData.amazon_affiliate_url && (
                <a
                  href={formData.amazon_affiliate_url}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-terracotta hover:underline"
                >
                  <span>Test Destination</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal mb-1.5">
                Amazon Affiliate URL *
              </label>
              <input
                type="url"
                required
                value={formData.amazon_affiliate_url}
                onChange={(e) => setFormData({ ...formData, amazon_affiliate_url: e.target.value })}
                onBlur={handleUrlBlur}
                placeholder="https://www.amazon.in/dp/... or https://amzn.to/..."
                className={`w-full bg-ivory-50 border text-charcoal text-xs p-2.5 rounded-sm focus:outline-none ${
                  amazonValidation.valid
                    ? 'border-softborder focus:border-charcoal'
                    : 'border-terracotta/70 bg-terracotta-50/20'
                }`}
              />

              {/* Real-time URL validation indicator */}
              <div className="mt-1.5 flex items-start gap-1.5 text-[11px]">
                {amazonValidation.valid ? (
                  <span className="text-sage-700 flex items-center gap-1 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5 text-sage" />
                    <span>{amazonValidation.message}</span>
                  </span>
                ) : (
                  <span className="text-terracotta flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                    <span>{amazonValidation.message}</span>
                  </span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal mb-1.5">
                  Amazon ASIN (Optional)
                </label>
                <input
                  type="text"
                  value={formData.asin}
                  onChange={(e) => setFormData({ ...formData, asin: e.target.value })}
                  placeholder="e.g. B016BLSUQW"
                  className="w-full bg-ivory-50 border border-softborder focus:border-charcoal focus:outline-none text-charcoal text-xs p-2.5 rounded-sm uppercase font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal mb-1.5">
                  Verified Price (INR ₹)
                </label>
                <input
                  type="number"
                  step="1"
                  value={formData.price_amount}
                  onChange={(e) => setFormData({ ...formData, price_amount: e.target.value })}
                  placeholder="Leave empty if unverified"
                  className="w-full bg-ivory-50 border border-softborder focus:border-charcoal focus:outline-none text-charcoal text-xs p-2.5 rounded-sm"
                />
              </div>
            </div>
          </div>

          {/* Visibility Controls */}
          <div className="bg-purewhite p-6 rounded-sm border border-softborder shadow-subtle space-y-3">
            <h3 className="font-editorial text-lg font-medium text-charcoal pb-2 border-b border-softborder">
              Publish Status
            </h3>

            <label className="flex items-center gap-2.5 cursor-pointer text-xs font-medium text-charcoal">
              <input
                type="checkbox"
                checked={formData.is_published}
                onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
                className="w-4 h-4 rounded text-terracotta focus:ring-terracotta border-softborder"
              />
              <span>Publish live on HOMELY website</span>
            </label>

            <label className="flex items-center gap-2.5 cursor-pointer text-xs font-medium text-charcoal">
              <input
                type="checkbox"
                checked={formData.featured}
                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                className="w-4 h-4 rounded text-terracotta focus:ring-terracotta border-softborder"
              />
              <span>Mark as Featured Homepage Find</span>
            </label>
          </div>
        </div>
      </div>

      {/* Pre-Publish Preview & Destination Verification Modal */}
      {showPreviewModal && (
        <div className="fixed inset-0 z-50 bg-charcoal/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-purewhite rounded-sm border border-softborder shadow-elevated max-w-2xl w-full p-6 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-softborder">
              <div className="flex items-center gap-2">
                <Eye className="w-5 h-5 text-terracotta" />
                <h3 className="font-editorial text-xl font-medium text-charcoal">
                  Pre-Publish Product Preview & Verification
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowPreviewModal(false)}
                className="text-warmgrey hover:text-charcoal p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-start">
              {/* Image Preview with Aspect Ratio */}
              <div className="space-y-2">
                <p className="text-xs uppercase font-semibold text-warmgrey tracking-wider">
                  Product Image Preview
                </p>
                <div className="relative aspect-square rounded-sm overflow-hidden border border-softborder bg-ivory-50 flex items-center justify-center">
                  {formData.image_url ? (
                    <Image
                      src={formData.image_url}
                      alt={formData.image_alt || formData.name || 'Product'}
                      fill
                      sizes="300px"
                      className="object-cover"
                    />
                  ) : (
                    <div className="text-center p-4 text-warmgrey flex flex-col items-center">
                      <ImageOff className="w-10 h-10 mb-2 opacity-50" />
                      <span className="text-xs font-medium">No image uploaded</span>
                    </div>
                  )}

                  {formData.editorial_label && (
                    <div className="absolute top-2 left-2 bg-sage text-purewhite text-[10px] font-semibold px-2 py-0.5 rounded-sm uppercase">
                      {formData.editorial_label}
                    </div>
                  )}
                </div>
              </div>

              {/* Data & Link Verification */}
              <div className="space-y-4 text-xs">
                <div>
                  <span className="text-[10px] uppercase font-bold text-terracotta tracking-wider">
                    {selectedCategoryName}
                  </span>
                  <h4 className="font-editorial text-lg text-charcoal font-medium mt-0.5">
                    {formData.name || 'Untitled Product'}
                  </h4>
                  {formData.price_amount ? (
                    <p className="font-semibold text-charcoal mt-1">
                      {formatINR(parseFloat(formData.price_amount.toString()))}
                    </p>
                  ) : (
                    <p className="text-warmgrey mt-1">Price verified dynamically on Amazon</p>
                  )}
                </div>

                <div>
                  <strong className="text-charcoal block mb-0.5">Description:</strong>
                  <p className="text-charcoal/80 line-clamp-3">
                    {formData.description || 'No description provided.'}
                  </p>
                </div>

                <div>
                  <strong className="text-charcoal block mb-0.5">Editorial Note:</strong>
                  <p className="text-charcoal/80 italic">
                    &ldquo;{formData.editorial_note || 'No editorial note provided.'}&rdquo;
                  </p>
                </div>

                {/* Exact Amazon Destination Verification */}
                <div className="p-3 bg-ivory-50 border border-softborder rounded-sm space-y-2">
                  <div className="flex items-center justify-between">
                    <strong className="text-charcoal">Amazon Destination Link:</strong>
                    {amazonValidation.valid ? (
                      <span className="text-sage-700 text-[10px] font-bold">✓ VERIFIED DOMAIN</span>
                    ) : (
                      <span className="text-terracotta text-[10px] font-bold">⚠ INVALID</span>
                    )}
                  </div>
                  <p className="font-mono text-[10px] text-charcoal/70 break-all bg-purewhite p-2 border border-softborder rounded">
                    {formData.amazon_affiliate_url || 'None entered'}
                  </p>

                  {formData.amazon_affiliate_url && (
                    <a
                      href={formData.amazon_affiliate_url}
                      target="_blank"
                      rel="noopener noreferrer nofollow"
                      className="w-full flex items-center justify-center gap-1.5 py-2 px-3 bg-terracotta text-purewhite rounded-sm text-xs font-semibold hover:bg-terracotta-600 transition-colors shadow-sm"
                    >
                      <span>Click to Test Live Amazon Page (New Tab)</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-softborder flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowPreviewModal(false)}
                className="px-4 py-2 border border-softborder text-charcoal rounded-sm text-xs font-semibold hover:bg-ivory-100"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </form>
  );
}
