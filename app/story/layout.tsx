import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'The Story of REBELIVE',
  description:
    'Read how a question about human potential and relentless momentum sparked the creation of REBELIVE. The journey of formulating zero-compromise Energy Drinks.',
  alternates: {
    canonical: '/story',
  },
  openGraph: {
    title: 'The Story of REBELIVE | The Origin Story',
    description: 'Why did the apple fall? Discover the realization that launched REBELIVE.',
    url: 'https://rebelive.com/story',
    siteName: 'REBELIVE',
    images: [
      {
        url: '/brand/APEX.webp',
        width: 1200,
        height: 630,
        alt: 'The Story of REBELIVE',
      },
    ],
    locale: 'en_US',
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'The Story of REBELIVE | The Origin Story',
    description: 'The journey of formulating zero-compromise Energy Drinks.',
    images: ['/brand/APEX.webp'],
  },
};

export default function StoryLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
