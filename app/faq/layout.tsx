import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    absolute: 'FAQs | REBELIVE Ingredients, Products & Orders',
  },
  description:
    'Get answers to frequently asked questions about Rebelive.',
  alternates: {
    canonical: '/faq',
  },
  openGraph: {
    title: 'FAQs | REBELIVE Ingredients, Products & Orders',
    description:
      'Get answers to frequently asked questions about Rebelive.',
    url: 'https://www.rebelive.com/faq',
    siteName: 'REBELIVE',
    images: [
      {
        url: '/brand/rebelive-og.png',
        width: 1200,
        height: 630,
        alt: 'FAQs | REBELIVE Ingredients, Products & Orders',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FAQs | REBELIVE Ingredients, Products & Orders',
    description:
      'Get answers to frequently asked questions about Rebelive.',
    images: ['/brand/rebelive-og.png'],
  },
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is REBELIVE?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'REBELIVE is a next-generation Energy Drinks drink engineered with functional nootropics, natural caffeine, and zero sugar for sustainable, clean mental and physical performance without the crash.',
      },
    },
    {
      '@type': 'Question',
      name: 'Does REBELIVE contain sugar?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No. All REBELIVE formulations contain zero sugar and zero empty calories, delivering crisp taste without sugar spikes or insulin crashes.',
      },
    },
    {
      '@type': 'Question',
      name: 'How much caffeine is in a can of REBELIVE?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Each standard 250ml can delivers an optimized 105mg - 160mg dosage of clean, high-grade caffeine balanced with functional amino acids for smooth, jitter-free focus.',
      },
    },
    {
      '@type': 'Question',
      name: 'Where is REBELIVE delivered in India?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'We ship across India via dedicated express courier and cold-chain logistics, covering 26,000+ pin codes with live package tracking.',
      },
    },
  ],
};

export default function FaqLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema).replace(/</g, '\\u003c') }}
      />
      {children}
    </>
  );
}
