'use client';

import React from 'react';
import Link from 'next/link';

export function AnnouncementBar() {
  return (
    <div className="bg-sage text-purewhite text-xs py-2 px-4 text-center tracking-wider font-medium flex items-center justify-center gap-2">
      <span>Thoughtful finds for a more beautiful everyday.</span>
      <span className="hidden sm:inline text-sage-200">|</span>
      <Link href="/budget-finds" className="hidden sm:inline underline underline-offset-2 hover:text-ivory transition-colors">
        Explore Budget Finds Under ₹499
      </Link>
    </div>
  );
}

