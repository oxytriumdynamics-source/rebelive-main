import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    absolute: 'Corporate & Bulk Orders | REBELIVE Wholesale & Distribution Partnerships',
  },
  description:
    'Partner with REBELIVE for corporate wellness orders, office pantries, wholesale beverages, retail partnerships, and institutional distribution across India.',
  keywords: [
    'REBELIVE corporate orders',
    'REBELIVE bulk orders',
    'REBELIVE wholesale beverages',
    'REBELIVE corporate beverage supplier',
    'REBELIVE office beverages',
    'REBELIVE corporate wellness drinks',
    'REBELIVE business enquiries',
    'REBELIVE distribution partnership',
    'REBELIVE retail partnership',
    'REBELIVE become a distributor',
    'REBELIVE institutional orders',
    'functional beverage distributors India',
    'beverage distributors for new brands',
    'functional drink wholesale suppliers',
    'premium beverage distribution opportunities',
    'beverage brand retail partnerships',
    'functional beverages for corporate offices',
    'bulk canned beverage suppliers India',
    'functional beverage stockists',
    'beverage dealership opportunities',
    'functional drinks for college events',
    'beverage sampling partnerships',
    'functional beverage private label manufacturing',
    'drinks for office',
    'workday wellness drinks',
    'drinks for long working hours',
    'functional drinks for professionals',
    'canned beverage brands India',
  ],
  alternates: {
    canonical: '/corporate',
  },
  openGraph: {
    title: 'Corporate & Bulk Orders | REBELIVE Wholesale & Distribution Partnerships',
    description:
      'Partner with REBELIVE for corporate wellness orders, office pantries, wholesale beverages, retail partnerships, and institutional distribution across India.',
    url: 'https://www.rebelive.com/corporate',
    siteName: 'REBELIVE',
    images: [
      {
        url: '/brand/rebelive-og.png',
        width: 1200,
        height: 630,
        alt: 'Corporate & Bulk Orders | REBELIVE',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Corporate & Bulk Orders | REBELIVE Wholesale & Distribution Partnerships',
    description:
      'Partner with REBELIVE for corporate wellness orders, office pantries, wholesale beverages, retail partnerships, and institutional distribution across India.',
    images: ['/brand/rebelive-og.png'],
  },
};

export default function CorporateLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
