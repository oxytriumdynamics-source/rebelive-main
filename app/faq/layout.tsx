import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    absolute: 'FAQs | REBELIVE Functional Beverages, Ingredients, Caffeine & Orders',
  },
  description:
    'Frequently asked questions about REBELIVE: what are functional beverages, caffeine vs L-theanine, prebiotics and probiotics, zero sugar, and delivery in India.',
  keywords: [
    'what are functional beverages',
    'functional drinks vs energy drinks',
    'functional beverages vs soft drinks',
    'how much caffeine is in a functional drink',
    'what is L-theanine in beverages',
    'what are prebiotics and probiotics in drinks',
    'how to choose a functional beverage',
    'what to look for on a beverage nutrition label',
    'natural caffeine vs synthetic caffeine',
    'how to compare sugar content in drinks',
    'functional beverage ingredients explained',
    'different types of functional beverages',
    'how functional drinks fit into daily routines',
    'understanding caffeine content per serving',
    'REBELIVE ingredients',
    'REBELIVE nutrition facts',
    'REBELIVE functional drink ingredients',
    'REBELIVE zero added sugar drinks',
    'REBELIVE caffeine per can',
    'REBELIVE product comparison',
    'REBELIVE drink benefits',
    'healthy alternatives to soda',
    'sugar free energy drink alternatives',
    'Red Bull alternatives',
    'Monster energy alternatives',
  ],
  alternates: {
    canonical: '/faq',
  },
  openGraph: {
    title: 'FAQs | REBELIVE Functional Beverages, Ingredients, Caffeine & Orders',
    description:
      'Frequently asked questions about REBELIVE: what are functional beverages, caffeine vs L-theanine, prebiotics and probiotics, zero sugar, and delivery in India.',
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
    title: 'FAQs | REBELIVE Functional Beverages, Ingredients, Caffeine & Orders',
    description:
      'Frequently asked questions about REBELIVE: what are functional beverages, caffeine vs L-theanine, prebiotics and probiotics, zero sugar, and delivery in India.',
    images: ['/brand/rebelive-og.png'],
  },
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What are functional beverages and what is REBELIVE?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Functional beverages are drinks enhanced with science-backed nutraceutical ingredients—such as natural caffeine, nootropics, adaptogens, prebiotics, and probiotics—that provide tangible health or cognitive benefits. REBELIVE is India’s next-generation functional beverage engineered with clean ingredients and zero sugar for focus, gut health, and daily vitality.',
      },
    },
    {
      '@type': 'Question',
      name: 'How do functional drinks compare to traditional energy drinks or soft drinks?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Traditional energy drinks and sodas rely on excessive refined sugars, artificial taurine, and synthetic caffeine spikes that lead to intense energy crashes. REBELIVE functional beverages use clean, natural caffeine paired with L-theanine to deliver sustained calm focus without jitters, spikes, or crashes.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is L-theanine and why is it combined with caffeine in REBELIVE?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'L-theanine is a natural amino acid found in green tea and matcha that promotes alert relaxation. When paired with natural caffeine, L-theanine smooths out the stimulant curve, preventing jitters and blood pressure spikes while sharpening attention and cognitive performance.',
      },
    },
    {
      '@type': 'Question',
      name: 'What are prebiotics and probiotics in beverages?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Prebiotics are specialized plant fibers that nourish beneficial gut bacteria, while probiotics are live beneficial microorganisms. In beverages like REBELIVE Aviva, they support optimal digestion, gut microbiome balance, and nutrient absorption.',
      },
    },
    {
      '@type': 'Question',
      name: 'How much caffeine and sugar is in a can of REBELIVE?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'All REBELIVE formulations contain zero added sugar and zero empty calories. Caffeine content is strictly optimized per formula (e.g., Apex delivers ~105-160mg of clean caffeine paired with L-theanine, while Aviva and Capella focus on caffeine-free gut health and adaptogen relaxation).',
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
