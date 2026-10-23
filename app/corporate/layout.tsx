import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    absolute: 'Corporate & Bulk Orders | REBELIVE',
  },
  description:
    'Explore bulk purchases, corporate gifting, team orders, and business partnerships with Rebelive. Contact us to discuss your requirements.',
  alternates: {
    canonical: '/corporate',
  },
  openGraph: {
    title: 'Corporate & Bulk Orders | REBELIVE',
    description:
      'Explore bulk purchases, corporate gifting, team orders, and business partnerships with Rebelive. Contact us to discuss your requirements.',
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
    title: 'Corporate & Bulk Orders | REBELIVE',
    description:
      'Explore bulk purchases, corporate gifting, team orders, and business partnerships with Rebelive. Contact us to discuss your requirements.',
    images: ['/brand/rebelive-og.png'],
  },
};

export default function CorporateLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
