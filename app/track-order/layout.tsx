import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    absolute: 'Track Your Order | REBELIVE',
  },
  description:
    "Check your Rebelive order's shipping progress and delivery status using your available order-tracking details.",
  alternates: {
    canonical: '/track-order',
  },
  openGraph: {
    title: 'Track Your Order | REBELIVE',
    description:
      "Check your Rebelive order's shipping progress and delivery status using your available order-tracking details.",
    url: 'https://www.rebelive.com/track-order',
    siteName: 'REBELIVE',
    images: [
      {
        url: '/brand/rebelive-og.png',
        width: 1200,
        height: 630,
        alt: 'Track Your Order | REBELIVE',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Track Your Order | REBELIVE',
    description:
      "Check your Rebelive order's shipping progress and delivery status using your available order-tracking details.",
    images: ['/brand/rebelive-og.png'],
  },
};

export default function TrackOrderLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
