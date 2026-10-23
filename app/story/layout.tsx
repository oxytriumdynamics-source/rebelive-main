import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    absolute: 'Our Story | The Origin, Mission & Philosophy of REBELIVE',
  },
  description:
    'The origin story of REBELIVE: founded by two people navigating demanding modern workstyles, engineering next-generation functional beverages to fuel rebels with clean energy and wellness.',
  keywords: [
    'REBELIVE brand story',
    'REBELIVE our story',
    'REBELIVE brand mission',
    'REBELIVE brand philosophy',
    'REBELIVE brand identity',
    'REBELIVE Wake Fuel Rebel',
    'REBELIVE Rebel Syndicate',
    'REBELIVE brand community',
    'REBELIVE beverage startup',
    'REBELIVE Indian beverage brand',
    'REBELIVE premium beverage brand',
    'REBELIVE modern beverage brand',
    'REBELIVE lifestyle brand',
    'Nutrition as a Lifestyle',
    'next generation beverages',
    'drinks for an active lifestyle',
    'lifestyle wellness beverages',
    'daily wellness drink routine',
    'drinks for demanding workdays',
    'healthy drinks for young professionals',
    'beverages for a busy lifestyle',
    'drinks for people who work late',
    'alternatives to multiple cups of coffee',
    'beverages for lifestyle wellness',
    'functional drinks for everyday routines',
    'drinks for people who dislike coffee',
    'convenient wellness drinks on the go',
    'science backed functional drinks',
    'innovative beverage brands India',
  ],
  alternates: {
    canonical: '/story',
  },
  openGraph: {
    title: 'Our Story | The Origin, Mission & Philosophy of REBELIVE',
    description:
      'The origin story of REBELIVE: founded by two people navigating demanding modern workstyles, engineering next-generation functional beverages to fuel rebels with clean energy and wellness.',
    url: 'https://www.rebelive.com/story',
    siteName: 'REBELIVE',
    images: [
      {
        url: '/brand/rebelive-og.png',
        width: 1200,
        height: 630,
        alt: 'Our Story | The Origin of REBELIVE',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Our Story | The Origin, Mission & Philosophy of REBELIVE',
    description:
      'The origin story of REBELIVE: founded by two people navigating demanding modern workstyles, engineering next-generation functional beverages to fuel rebels with clean energy and wellness.',
    images: ['/brand/rebelive-og.png'],
  },
};

export default function StoryLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
