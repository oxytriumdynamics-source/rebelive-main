import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Shop | APEX, CAPELLA, AVIVA',
  description:
    'Order authentic REBELIVE crates online. Zero sugar, clean caffeine, functional nootropics. Choose 3, 6, 9, or 12 packs.',
  alternates: {
    canonical: '/shop',
  },
  openGraph: {
    title: 'Shop REBELIVE ',
    description:
      'Zero sugar, clean functional nootropics, and unrelenting focus. Order 3, 6, 9, or 12-pack crates online.',
    url: 'https://rebelive.com/shop',
    siteName: 'REBELIVE',
    images: [
      {
        url: '/brand/APEX.webp',
        width: 1200,
        height: 630,
        alt: 'Shop REBELIVE Energy Drinks',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Shop REBELIVE Energy Drinks Crates',
    description: 'Zero Sugar. Pure Performance. Fast cold dispatch.',
    images: ['/brand/APEX.webp'],
  },
};

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
