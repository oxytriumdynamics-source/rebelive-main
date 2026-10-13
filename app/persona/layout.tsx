import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Rebel Archetype Quiz | Claim Your Rebel ID',
  description:
    'Calibrate your inner operator archetype: APEX, CAPELLA, or AVIVA. Complete the quiz to unlock your customized Holographic Rebel Pass and unique Rebel ID.',
  alternates: {
    canonical: '/persona',
  },
  openGraph: {
    title: 'Claim Your Rebel ID | Operator Calibration Quiz',
    description: 'Find your archetype and claim your verifiable Rebel ID pass.',
    url: 'https://rebelive.com/persona',
    siteName: 'REBELIVE',
    images: [
      {
        url: '/brand/APEX.webp',
        width: 1200,
        height: 630,
        alt: 'Rebel Archetype Calibration Quiz',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Claim Your Rebel ID | Operator Calibration Quiz',
    description: 'Calibrate your inner operator archetype.',
    images: ['/brand/APEX.webp'],
  },
};

export default function PersonaLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
