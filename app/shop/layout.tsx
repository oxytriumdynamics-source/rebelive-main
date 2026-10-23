import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    absolute: 'Shop REBELIVE | Explore the Range',
  },
  description:
    "Explore Rebelive's functional beverage range, discover your preferred taste, and choose a pack size that fits your will to rebel.",
  alternates: {
    canonical: '/shop',
  },
  openGraph: {
    title: 'Shop REBELIVE | Explore the Range',
    description:
      "Explore Rebelive's functional beverage range, discover your preferred taste, and choose a pack size that fits your will to rebel.",
    url: 'https://www.rebelive.com/shop',
    siteName: 'REBELIVE',
    images: [
      {
        url: '/brand/rebelive-og.png',
        width: 1200,
        height: 630,
        alt: 'Shop REBELIVE | Explore the Range',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Shop REBELIVE | Explore the Range',
    description:
      "Explore Rebelive's functional beverage range, discover your preferred taste, and choose a pack size that fits your will to rebel.",
    images: ['/brand/rebelive-og.png'],
  },
};

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
