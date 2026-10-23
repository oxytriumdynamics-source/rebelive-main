import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    absolute: 'Insights & Guides | REBELIVE Functional Beverages Blog',
  },
  description:
    'Explore science-backed guides on functional beverages, clean caffeine, L-theanine, ashwagandha, gut health, and daily productivity routines from REBELIVE.',
  keywords: [
    'REBELIVE blog',
    'functional wellness drinks',
    'science backed functional drinks',
    'what are functional beverages',
    'functional drinks vs energy drinks',
    'functional beverages vs soft drinks',
    'natural caffeine vs synthetic caffeine',
    'L-theanine drinks',
    'ashwagandha drinks India',
    'prebiotic and probiotic beverages',
    'drinks for mental focus',
    'beverages for concentration',
    'drinks for productivity',
    'alternatives to coffee for focus',
    'coffee alternatives for students',
    'healthy alternatives to energy drinks',
    'functional beverage trends India',
    'clean label beverages',
    'nootropics and adaptogens guide',
    'healthy drinks for young professionals',
    'drinks for long study hours',
    'workday wellness drinks',
  ],
  alternates: {
    canonical: '/blogs',
  },
  openGraph: {
    title: 'Insights & Guides | REBELIVE Functional Beverages Blog',
    description:
      'Explore science-backed guides on functional beverages, clean caffeine, L-theanine, ashwagandha, gut health, and daily productivity routines from REBELIVE.',
    url: 'https://www.rebelive.com/blogs',
    siteName: 'REBELIVE',
    images: [
      {
        url: '/brand/rebelive-og.png',
        width: 1200,
        height: 630,
        alt: 'Insights & Guides | REBELIVE Blog',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Insights & Guides | REBELIVE Functional Beverages Blog',
    description:
      'Explore science-backed guides on functional beverages, clean caffeine, L-theanine, ashwagandha, gut health, and daily productivity routines from REBELIVE.',
    images: ['/brand/rebelive-og.png'],
  },
};

export default function BlogsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
