import React from 'react';
import Link from 'next/link';
import { Info } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AffiliateNoticeProps {
  className?: string;
  compact?: boolean;
}

export function AffiliateNotice({ className, compact = false }: AffiliateNoticeProps) {
  if (compact) {
    return (
      <div className={cn('text-[11px] text-warmgrey flex items-center gap-1.5', className)}>
        <Info className="w-3.5 h-3.5 text-sage flex-shrink-0" />
        <span>
          As an Amazon Associate I earn from qualifying purchases.{' '}
          <Link href="/affiliate-disclosure" className="underline hover:text-charcoal transition-colors">
            Learn more
          </Link>
        </span>
      </div>
    );
  }

  return (
    <div className={cn('p-3.5 bg-ivory-50 border border-softborder rounded-sm text-xs text-charcoal/80 flex items-start gap-2.5', className)}>
      <Info className="w-4 h-4 text-terracotta flex-shrink-0 mt-0.5" />
      <div>
        <p className="font-medium text-charcoal mb-0.5">Affiliate Transparency</p>
        <p className="leading-relaxed">
          HOMELY participates in the Amazon Associates Program. When you click our affiliate links and purchase on Amazon India, we may earn an affiliate commission at no extra cost to you. We only recommend thoughtful products that fit our aesthetic standards.
        </p>
      </div>
    </div>
  );
}

