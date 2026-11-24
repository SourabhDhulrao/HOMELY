import type { Metadata } from 'next';
import './globals.css';
import { Providers } from '@/components/Providers';
import { Navbar } from '@/components/ui/Navbar';
import { Footer } from '@/components/ui/Footer';
import { WishlistDrawer } from '@/components/ui/WishlistDrawer';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://homelyliving.in'),
  title: {
    default: 'HOMELY — Thoughtful Finds for Beautiful Everyday Living',
    template: '%s | HOMELY',
  },
  description:
    'Discover curated home decor, kitchen essentials, and small-space organization tailored for Indian living. Aesthetic, affordable Amazon India finds.',
  keywords: [
    'home decor india',
    'kitchen organization india',
    'small apartment storage',
    'amazon india home finds',
    'budget home decor under 499',
    'aesthetic room decor',
    'homely living',
  ],
  authors: [{ name: 'HOMELY Editorial Team' }],
  creator: 'HOMELY',
  publisher: 'HOMELY',
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://homelyliving.in',
    siteName: 'HOMELY',
    title: 'HOMELY — Thoughtful Finds for Beautiful Everyday Living',
    description:
      'Curated lifestyle finds, small space storage solutions, and budget-friendly home decor for Indian urban living.',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=1200&auto=format&fit=crop',
        width: 1200,
        height: 630,
        alt: 'HOMELY — Thoughtful Finds for Beautiful Everyday Living',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'HOMELY — Thoughtful Finds for Beautiful Everyday Living',
    description: 'Curated home decor, kitchen essentials, and practical organization for Indian homes.',
    images: ['https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=1200&auto=format&fit=crop'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-ivory text-charcoal min-h-screen flex flex-col font-sans">
        <Providers>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <WishlistDrawer />
        </Providers>
      </body>
    </html>
  );
}
