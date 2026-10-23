import type { Metadata } from 'next';
import { FALLBACK_BLOGS } from '@/lib/blogsData';

interface Props {
  params: Promise<{ slug: string }>;
  children: React.ReactNode;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const cleanSlug = String(slug || '').toLowerCase();
  const fallback = FALLBACK_BLOGS.find((b) => b.slug.toLowerCase() === cleanSlug);

  const title = fallback?.title ? `${fallback.title} | REBELIVE Blog` : 'Article | REBELIVE Functional Beverages Blog';
  const description = fallback?.excerpt || 'Science-backed insights on functional beverages, focus, clean energy, and modern nutrition.';
  const imgUrl = fallback?.coverImage || '/brand/rebelive-og.png';

  return {
    title,
    description,
    keywords: [
      'what are functional beverages',
      'functional drinks vs energy drinks',
      'functional beverages vs soft drinks',
      'natural caffeine vs synthetic caffeine',
      'L-theanine drinks',
      'ashwagandha drinks India',
      'prebiotic and probiotic beverages',
      'drinks for mental focus',
      'beverages for concentration',
      'drinks for productivity',
      'alternatives to coffee for focus',
      'healthy alternatives to energy drinks',
      'functional beverage trends India',
      'REBELIVE blog',
    ],
    alternates: {
      canonical: `/blogs/${cleanSlug}`,
    },
    openGraph: {
      title,
      description,
      url: `https://www.rebelive.com/blogs/${cleanSlug}`,
      siteName: 'REBELIVE',
      images: [
        {
          url: imgUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: 'en_US',
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imgUrl],
    },
  };
}

export default function BlogArticleLayout({ children }: Props) {
  return <>{children}</>;
}
