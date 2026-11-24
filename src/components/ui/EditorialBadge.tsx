import React from 'react';
import { cn } from '@/lib/utils';

interface EditorialBadgeProps {
  label: string;
  variant?: 'sage' | 'terracotta' | 'ivory' | 'charcoal';
  className?: string;
}

export function EditorialBadge({ label, variant = 'sage', className }: EditorialBadgeProps) {
  const variantStyles = {
    sage: 'bg-sage-100 text-sage-700 border-sage-200',
    terracotta: 'bg-terracotta-50 text-terracotta-600 border-terracotta-200',
    ivory: 'bg-ivory-200 text-charcoal border-softborder',
    charcoal: 'bg-charcoal text-purewhite border-charcoal',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium tracking-wide uppercase border',
        variantStyles[variant],
        className
      )}
    >
      {label}
    </span>
  );
}

