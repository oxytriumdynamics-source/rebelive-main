import type { Metadata } from 'next';
import { PRODUCTS, PRICES } from '@/data/products';

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
  const product = PRODUCTS.find(
    (p) => p.id.toLowerCase() === id.toLowerCase() || p.flavor.toLowerCase().includes(id.toLowerCase())
  );

  if (!product) {
    return {
      title: 'Product Crate | REBELIVE',
      description: 'Authentic REBELIVE bio-energy formulas engineered without compromise.',
      alternates: { canonical: `/shop/${id}` },
    };
  }

  const title = `${product.displayTitle} (${product.flavor}) | Bio-Energy Drink`;
  const description = `${product.description} Zero Sugar, ${product.caffeine} clean caffeine, functional nootropics. Engineered without compromise.`;
  const imgUrl = product.renderImage || product.image || '/brand/APEX.webp';

  return {
    title,
    description,
    alternates: {
      canonical: `/shop/${product.id}`,
    },
    openGraph: {
      title: `${product.displayTitle} - ${product.tagline} | REBELIVE`,
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
      title: `${product.displayTitle} - ${product.tagline} | REBELIVE`,
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
  const product = PRODUCTS.find(
    (p) => p.id.toLowerCase() === id.toLowerCase() || p.flavor.toLowerCase().includes(id.toLowerCase())
  );

  const jsonLd = product
    ? {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: product.name,
        image: `https://rebelive.com${product.renderImage || product.image || '/brand/APEX.webp'}`,
        description: product.description,
        brand: {
          '@type': 'Brand',
          name: 'REBELIVE',
        },
        offers: {
          '@type': 'Offer',
          url: `https://rebelive.com/shop/${product.id}`,
          priceCurrency: 'INR',
          price: PRICES[12].price,
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
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      {children}
    </>
  );
}
