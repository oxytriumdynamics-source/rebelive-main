import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us',
  description:
    'Discover the origin of REBELIVE by Oxytrium Dynamics. Engineered for relentless operators, athletes, and builders seeking clean, uncompromised performance energy.',
  alternates: {
    canonical: '/about',
  },
  openGraph: {
    title: 'About Us',
    description:
      'Engineered energy drink by Oxytrium Dynamics. Built for focus, grit, and visionary creators.',
    url: 'https://rebelive.com/about',
    siteName: 'REBELIVE',
    images: [
      {
        url: '/brand/APEX.webp',
        width: 1200,
        height: 630,
        alt: 'About REBELIVE Energy Drink',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About REBELIVE | Our Founders & Philosophy',
    description: 'Engineered energy drink. Built for visionary operators.',
    images: ['/brand/APEX.webp'],
  },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
