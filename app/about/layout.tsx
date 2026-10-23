import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    absolute: 'About REBELIVE | The Modern Indian Functional Beverage Brand',
  },
  description:
    'Meet REBELIVE, an Indian functional beverage startup pioneering Nutrition as a Lifestyle. Clean label, zero added sugar drinks engineered for focus, gut health, and modern vitality.',
  keywords: [
    'About REBELIVE',
    'REBELIVE wellness brand',
    'REBELIVE beverage startup',
    'REBELIVE Indian beverage brand',
    'REBELIVE premium beverage brand',
    'REBELIVE modern beverage brand',
    'REBELIVE lifestyle brand',
    'REBELIVE brand identity',
    'REBELIVE brand mission',
    'REBELIVE brand philosophy',
    'Nutrition as a Lifestyle',
    'clean label beverages',
    'better for you beverage brands',
    'science backed functional drinks',
    'next generation beverages',
    'drinks for an active lifestyle',
    'daily wellness drink routine',
    'workday wellness drinks',
    'healthy drinks for young professionals',
    'beverage brands in India',
    'innovative beverage brands India',
    'modern wellness beverages',
    'functional beverage brand',
  ],
  alternates: {
    canonical: '/about',
  },
  openGraph: {
    title: 'About REBELIVE | The Modern Indian Functional Beverage Brand',
    description:
      'Meet REBELIVE, an Indian functional beverage startup pioneering Nutrition as a Lifestyle. Clean label, zero added sugar drinks engineered for focus, gut health, and modern vitality.',
    url: 'https://www.rebelive.com/about',
    siteName: 'REBELIVE',
    images: [
      {
        url: '/brand/rebelive-og.png',
        width: 1200,
        height: 630,
        alt: 'About REBELIVE | The Thinking Behind the Brand',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About REBELIVE | The Modern Indian Functional Beverage Brand',
    description:
      'Meet REBELIVE, an Indian functional beverage startup pioneering Nutrition as a Lifestyle. Clean label, zero added sugar drinks engineered for focus, gut health, and modern vitality.',
    images: ['/brand/rebelive-og.png'],
  },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
