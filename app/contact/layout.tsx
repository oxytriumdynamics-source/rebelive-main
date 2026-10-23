import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    absolute: 'Contact REBELIVE | Customer Support',
  },
  description:
    'Contact the Rebelive team for product enquiries, order queries, and feedback.',
  alternates: {
    canonical: '/contact',
  },
  openGraph: {
    title: 'Contact REBELIVE | Customer Support',
    description:
      'Contact the Rebelive team for product enquiries, order queries, and feedback.',
    url: 'https://www.rebelive.com/contact',
    siteName: 'REBELIVE',
    images: [
      {
        url: '/brand/rebelive-og.png',
        width: 1200,
        height: 630,
        alt: 'Contact REBELIVE | Customer Support',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact REBELIVE | Customer Support',
    description:
      'Contact the Rebelive team for product enquiries, order queries, and feedback.',
    images: ['/brand/rebelive-og.png'],
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
