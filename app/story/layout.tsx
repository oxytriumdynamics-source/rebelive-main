import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    absolute: 'Our Story | The Origin of REBELIVE',
  },
  description:
    'Discover the idea that sparked Rebelive, and the thinking behind the brand.',
  alternates: {
    canonical: '/story',
  },
  openGraph: {
    title: 'Our Story | The Origin of REBELIVE',
    description:
      'Discover the idea that sparked Rebelive, and the thinking behind the brand.',
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
    title: 'Our Story | The Origin of REBELIVE',
    description:
      'Discover the idea that sparked Rebelive, and the thinking behind the brand.',
    images: ['/brand/rebelive-og.png'],
  },
};

export default function StoryLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
