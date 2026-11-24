import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Compass, ArrowRight } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="py-20 sm:py-32 bg-ivory text-center px-4">
      <div className="max-w-md mx-auto space-y-6">
        <div className="w-16 h-16 mx-auto rounded-full bg-ivory-200 border border-softborder flex items-center justify-center text-terracotta">
          <Compass className="w-8 h-8" />
        </div>

        <span className="text-xs uppercase tracking-widest text-warmgrey font-semibold block">
          Error 404
        </span>

        <h1 className="font-editorial text-3xl sm:text-4xl text-charcoal font-medium">
          A Peaceful Dead End
        </h1>

        <p className="text-sm text-charcoal/75 leading-relaxed">
          The page or product collection you are looking for has been moved, renamed, or is currently taking a rest.
        </p>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button href="/" variant="primary" size="md">
            <span>Return to Homepage</span>
          </Button>
          <Button href="/shop" variant="outline" size="md">
            <span>Browse All Finds</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </div>
    </div>
  );
}

