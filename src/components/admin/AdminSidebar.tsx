'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  Sparkles,
  FileText,
  ExternalLink,
  LogOut,
  Layers,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await fetch('/api/admin/login', { method: 'DELETE' });
    router.push('/admin/login');
  };

  const menu = [
    { label: 'Overview', href: '/admin', icon: LayoutDashboard },
    { label: 'Products Catalogue', href: '/admin/products', icon: Package },
    { label: 'Amazon Creators API', href: '/admin/amazon', icon: Sparkles },
    { label: 'Journal Articles', href: '/admin/articles', icon: FileText },
  ];

  return (
    <aside className="w-64 bg-charcoal text-ivory-100 min-h-screen p-5 flex flex-col justify-between border-r border-charcoal-600">
      <div className="space-y-6">
        {/* Brand */}
        <div className="pb-4 border-b border-charcoal-400/30">
          <Link href="/admin" className="block">
            <span className="font-editorial text-2xl font-semibold tracking-wider text-purewhite">
              HOMELY
            </span>
            <span className="block text-[10px] tracking-widest text-sage-200 uppercase font-sans">
              Editorial Studio Admin
            </span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="space-y-1.5">
          {menu.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== '/admin' && pathname.startsWith(item.href));
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-3.5 py-2.5 rounded-sm text-xs uppercase tracking-wider font-medium transition-colors',
                  isActive
                    ? 'bg-terracotta text-purewhite font-semibold'
                    : 'text-ivory-200/80 hover:bg-charcoal-500/50 hover:text-purewhite'
                )}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Actions */}
      <div className="pt-6 border-t border-charcoal-400/30 space-y-2">
        <Link
          href="/"
          target="_blank"
          className="flex items-center justify-between px-3.5 py-2 text-xs text-ivory-300 hover:text-purewhite transition-colors"
        >
          <span className="flex items-center gap-2">
            <Layers className="w-3.5 h-3.5" />
            <span>Live Website</span>
          </span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-3.5 py-2 text-xs text-terracotta-200 hover:text-purewhite hover:bg-charcoal-500/50 rounded-sm transition-colors text-left"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Exit Studio</span>
        </button>
      </div>
    </aside>
  );
}

