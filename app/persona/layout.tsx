import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    absolute: 'Discover Your Rebel Persona | REBELIVE Quiz',
  },
  description:
    'Answer five questions to discover your REBEL persona, and claim your digital Rebel ID.',
  alternates: {
    canonical: '/persona',
  },
  openGraph: {
    title: 'Discover Your Rebel Persona | REBELIVE Quiz',
    description:
      'Answer five questions to discover your REBEL persona, and claim your digital Rebel ID.',
    url: 'https://www.rebelive.com/persona',
    siteName: 'REBELIVE',
    images: [
      {
        url: '/brand/rebelive-og.png',
        width: 1200,
        height: 630,
        alt: 'Discover Your Rebel Persona | REBELIVE Quiz',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Discover Your Rebel Persona | REBELIVE Quiz',
    description:
      'Answer five questions to discover your REBEL persona, and claim your digital Rebel ID.',
    images: ['/brand/rebelive-og.png'],
  },
};

export default function PersonaLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
