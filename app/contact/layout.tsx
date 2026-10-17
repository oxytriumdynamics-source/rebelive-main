import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us | Inquiries & Support',
  description:
    'Reach out to REBELIVE headquarters. Inquiries for distribution, wholesale orders, retail stocking, athlete sponsorships, or customer support.',
  alternates: {
    canonical: '/contact',
  },
  openGraph: {
    title: 'Contact REBELIVE Headquarters',
    description: 'Direct inquiries for distribution, wholesale, retail partnerships, and support.',
    url: 'https://rebelive.com/contact',
    siteName: 'REBELIVE',
    images: [
      {
        url: '/brand/APEX.webp',
        width: 1200,
        height: 630,
        alt: 'Contact REBELIVE',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact REBELIVE Headquarters',
    description: 'Get in touch with the REBELIVE command team.',
    images: ['/brand/APEX.webp'],
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
