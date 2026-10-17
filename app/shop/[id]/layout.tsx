import type { Metadata } from 'next';
import { fetchProductBySlug } from '@/lib/productsApi';

interface Props {
  params: Promise<{ id: string }>;
  children: React.ReactNode;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const product = await fetchProductBySlug(id);

  if (!product) {
    return {
      title: 'Product Crate | REBELIVE',
      description: 'Authentic REBELIVE bio-energy formulas engineered without compromise.',
      alternates: { canonical: `/shop/${id}` },
    };
  }

  const title = `${product.displayTitle || product.name} (${product.flavor || 'Functional'})`;
  const description = `${product.description} Zero Sugar, ${product.caffeine} clean caffeine, functional nootropics. Engineered without compromise.`;
  const imgUrl = product.renderImage || product.image || product.canImage || '/brand/APEX.webp';

  return {
    title,
    description,
    alternates: {
      canonical: `/shop/${product.id}`,
    },
    openGraph: {
      title: `${product.displayTitle || product.name} - ${product.tagline || 'Functional Beverage'} | REBELIVE`,
      description,
      url: `https://rebelive.com/shop/${product.id}`,
      siteName: 'REBELIVE',
      images: [
        {
          url: imgUrl,
          width: 1200,
          height: 630,
          alt: `${product.name} Bio-Energy Can`,
        },
      ],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${product.displayTitle || product.name} - ${product.tagline || 'Functional Beverage'} | REBELIVE`,
      description,
      images: [imgUrl],
    },
  };
}

export default async function ProductLayout({
  children,
  params,
}: Props) {
  const { id } = await params;
  const product = await fetchProductBySlug(id);

  const jsonLd = product
    ? {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: product.name,
        image: `https://rebelive.com${product.renderImage || product.image || product.canImage || '/brand/APEX.webp'}`,
        description: product.description,
        brand: {
          '@type': 'Brand',
          name: 'REBELIVE',
        },
        offers: {
          '@type': 'Offer',
          url: `https://rebelive.com/shop/${product.id}`,
          priceCurrency: 'INR',
          price: product.startingPrice || 449,
          availability: 'https://schema.org/InStock',
          seller: {
            '@type': 'Organization',
            name: 'REBELIVE',
          },
        },
      }
    : null;

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
        />
      )}
      {children}
    </>
  );
}
