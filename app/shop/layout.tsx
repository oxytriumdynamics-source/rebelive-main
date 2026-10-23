import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    absolute: 'Buy REBELIVE Online | Functional Beverages, Packs & Pricing India',
  },
  description:
    'Buy REBELIVE functional beverages online in India. Explore Apex, Aviva, Capella, variety multipacks, and exclusive product bundles with fast doorstep delivery, zero added sugar, and clean ingredients.',
  keywords: [
    'buy REBELIVE online',
    'REBELIVE price',
    'where to buy REBELIVE drinks online India',
    'REBELIVE drinks online India',
    'REBELIVE exclusive product bundles',
    'REBELIVE product range',
    'buy functional drinks online India',
    'order functional beverages online',
    'functional drinks price in India',
    'premium canned drinks online India',
    'functional beverage subscription',
    'functional drinks multipack',
    'functional drinks gift pack',
    'functional beverage brands to try',
    'new functional drinks to try India',
    'functional drinks available online',
    'buy wellness beverages online',
    'functional drinks for daily use price',
    'functional beverages delivered to your door',
    'functional drinks offers online',
    'buy drinks online',
    'buy beverages online',
    'cold drinks online',
    'canned drinks online',
    'packaged beverages online',
    'beverage brands in India',
    'best cold drinks',
    'best canned drinks',
    'drinks price',
    'beverages price in India',
    'drinks delivery online',
    'functional drinks delivery',
    'healthy beverages delivery',
    'beverages on quick commerce',
    'energy drinks online delivery',
    'premium drinks online',
    'beverage brands online India',
    'ready to drink beverages online',
    'carbonated drinks in aluminium cans',
    'buy healthy drinks online',
    'REBELIVE Apex',
    'REBELIVE Aviva',
    'REBELIVE Capella',
  ],
  alternates: {
    canonical: '/shop',
  },
  openGraph: {
    title: 'Buy REBELIVE Online | Functional Beverages, Packs & Pricing India',
    description:
      'Buy REBELIVE functional beverages online in India. Explore Apex, Aviva, Capella, variety multipacks, and exclusive product bundles with fast doorstep delivery.',
    url: 'https://www.rebelive.com/shop',
    siteName: 'REBELIVE',
    images: [
      {
        url: '/brand/rebelive-og.png',
        width: 1200,
        height: 630,
        alt: 'Shop REBELIVE | Functional Beverage Store India',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Buy REBELIVE Online | Functional Beverages, Packs & Pricing India',
    description:
      'Buy REBELIVE functional beverages online in India. Explore Apex, Aviva, Capella, variety multipacks, and exclusive product bundles with fast doorstep delivery.',
    images: ['/brand/rebelive-og.png'],
  },
};

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
