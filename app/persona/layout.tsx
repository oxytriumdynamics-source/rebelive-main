import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    absolute: 'Discover Your Rebel Persona | REBELIVE Quiz & Rebel ID',
  },
  description:
    'Take the 5-question REBELIVE Persona Quiz to uncover your archetype, claim your digital Rebel ID, and find the functional beverage tailored to your focus and lifestyle.',
  keywords: [
    'REBELIVE Rebel persona',
    'REBELIVE persona quiz',
    'REBELIVE Rebel ID',
    'REBELIVE personality types',
    'REBELIVE personality test',
    'REBELIVE digital identity',
    'REBELIVE brand community',
    'REBELIVE Rebel Syndicate',
    'functional drinks for young adults',
    'drinks for busy lifestyle',
    'drinks for college students',
    'drinks for studying',
    'wellness beverages for college students',
    'drinks for focus during work',
    'drinks for exam preparation',
    'drinks for long study hours',
    'beverages for work productivity',
    'drinks for mental performance',
    'drinks for mental focus',
    'beverages for concentration',
    'drinks for productivity',
    'drinks for tiredness',
    'drinks to stay awake',
    'drinks for morning energy',
    'drinks for an active lifestyle',
    'drinks for people who work late',
  ],
  alternates: {
    canonical: '/persona',
  },
  openGraph: {
    title: 'Discover Your Rebel Persona | REBELIVE Quiz & Rebel ID',
    description:
      'Take the 5-question REBELIVE Persona Quiz to uncover your archetype, claim your digital Rebel ID, and find the functional beverage tailored to your focus and lifestyle.',
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
    title: 'Discover Your Rebel Persona | REBELIVE Quiz & Rebel ID',
    description:
      'Take the 5-question REBELIVE Persona Quiz to uncover your archetype, claim your digital Rebel ID, and find the functional beverage tailored to your focus and lifestyle.',
    images: ['/brand/rebelive-og.png'],
  },
};

export default function PersonaLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
