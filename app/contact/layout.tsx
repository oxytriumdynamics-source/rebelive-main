import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    absolute: 'Contact REBELIVE | Customer Support & Business Enquiries',
  },
  description:
    'Contact REBELIVE for customer support, order assistance, distribution partnerships, retail stockist enquiries, and institutional orders across India.',
  keywords: [
    'contact REBELIVE',
    'REBELIVE business enquiries',
    'REBELIVE distribution partnership',
    'REBELIVE retail partnership',
    'REBELIVE become a distributor',
    'REBELIVE institutional orders',
    'functional beverage distributors India',
    'beverage distributors for new brands',
    'beverage dealership opportunities',
    'beverage sampling partnerships',
    'functional drink wholesale suppliers',
    'REBELIVE customer support',
    'REBELIVE contact details',
    'REBELIVE drinks head office',
  ],
  alternates: {
    canonical: '/contact',
  },
  openGraph: {
    title: 'Contact REBELIVE | Customer Support & Business Enquiries',
    description:
      'Contact REBELIVE for customer support, order assistance, distribution partnerships, retail stockist enquiries, and institutional orders across India.',
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
    title: 'Contact REBELIVE | Customer Support & Business Enquiries',
    description:
      'Contact REBELIVE for customer support, order assistance, distribution partnerships, retail stockist enquiries, and institutional orders across India.',
    images: ['/brand/rebelive-og.png'],
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
