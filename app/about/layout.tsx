import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    absolute: 'About REBELIVE | The Thinking Behind the Brand',
  },
  description:
    'Meet Rebelive, a nutraceutical brand built around supporting grueling modern workstyles, and a premium upgrade to your daily momentum.',
  alternates: {
    canonical: '/about',
  },
  openGraph: {
    title: 'About REBELIVE | The Thinking Behind the Brand',
    description:
      'Meet Rebelive, a nutraceutical brand built around supporting grueling modern workstyles, and a premium upgrade to your daily momentum.',
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
    title: 'About REBELIVE | The Thinking Behind the Brand',
    description:
      'Meet Rebelive, a nutraceutical brand built around supporting grueling modern workstyles, and a premium upgrade to your daily momentum.',
    images: ['/brand/rebelive-og.png'],
  },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
