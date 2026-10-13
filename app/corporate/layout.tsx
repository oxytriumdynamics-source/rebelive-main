import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Corporate Gifting & Bulk Dispatch | Fuel High-Performance Teams',
  description:
    'Fuel your engineering teams, corporate summits, startup incubators, and executive retreats with REBELIVE bio-energy crates. Custom branded corporate packages and priority cold dispatch.',
  alternates: {
    canonical: '/corporate',
  },
  openGraph: {
    title: 'Corporate Fueling & Bulk Orders | REBELIVE',
    description:
      'High-performance clean energy for modern teams. Bulk dispatch and corporate gifting.',
    url: 'https://rebelive.com/corporate',
    siteName: 'REBELIVE',
    images: [
      {
        url: '/brand/APEX.webp',
        width: 1200,
        height: 630,
        alt: 'REBELIVE Corporate Gifting',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Corporate Fueling & Bulk Orders | REBELIVE',
    description: 'Fuel high-performance teams with clean functional bio-energy.',
    images: ['/brand/APEX.webp'],
  },
};

export default function CorporateLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
