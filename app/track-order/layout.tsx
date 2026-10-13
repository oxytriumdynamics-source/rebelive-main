import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Track Your Order | Real-Time Crate Dispatch Status',
  description:
    'Track your REBELIVE crate in real-time. Enter your order ID or tracking AWB number for live cold-chain transit updates from warehouse to doorstep.',
  alternates: {
    canonical: '/track-order',
  },
  openGraph: {
    title: 'Track Your REBELIVE Order',
    description: 'Real-time package dispatch tracking and delivery status.',
    url: 'https://rebelive.com/track-order',
    siteName: 'REBELIVE',
    images: [
      {
        url: '/brand/APEX.webp',
        width: 1200,
        height: 630,
        alt: 'Track Order',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
};

export default function TrackOrderLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
