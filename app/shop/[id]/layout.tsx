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
      title: 'Product Crate | REBELIVE Functional Beverages',
      description: 'Authentic REBELIVE functional beverage formulas engineered without compromise.',
      alternates: { canonical: `/shop/${id}` },
    };
  }

  const slug = (product.id || id).toLowerCase();
  const commonProductKeywords = [
    'REBELIVE ingredients',
    'REBELIVE nutrition facts',
    'REBELIVE formula',
    'REBELIVE ingredients list',
    'REBELIVE nutrition label',
    'REBELIVE calories per can',
    'REBELIVE sugar content',
    'REBELIVE drink benefits',
    'REBELIVE beverage flavours',
    'REBELIVE product reviews',
    'REBELIVE product comparison',
    'REBELIVE zero added sugar drinks',
    'carbonated drinks in aluminium cans',
    'zero added sugar carbonated drinks',
    'low calorie fizzy drinks',
    'healthier alternatives to cola',
    'healthy alternatives to soft drinks',
    'reduced sugar packaged beverages',
    'non sugary flavoured drinks',
    'functional drinks for health conscious consumers',
    'beverages for sugar conscious consumers',
    'low calorie canned beverages India',
    'modern alternatives to sugary soft drinks',
    'canned drinks online',
    'premium canned drinks online India',
    'functional beverages India',
  ];

  let specificKeywords: string[] = [];
  if (slug.includes('apex')) {
    specificKeywords = [
      'REBELIVE Apex',
      'Apex by REBELIVE',
      'REBELIVE caffeine',
      'REBELIVE L-theanine',
      'REBELIVE natural caffeine',
      'REBELIVE caffeine content',
      'REBELIVE caffeine per can',
      'focus drinks',
      'drinks for focus',
      'caffeine and L-theanine drink',
      'caffeine drinks for focus',
      'caffeine L-theanine beverages',
      'drinks for mental focus',
      'beverages for concentration',
      'drinks for productivity',
      'drinks for mental performance',
      'caffeine and theanine combination drinks',
      'drinks for study sessions',
      'beverages for work productivity',
      'drinks for afternoon energy',
      'alternatives to coffee for focus',
      'coffee alternatives for students',
      'low sugar caffeine drinks',
      'carbonated caffeine beverages',
      'functional drinks for professionals',
      'L-theanine drinks',
      'natural caffeine beverages',
      'drinks to stay awake',
      'drinks for morning energy',
      'Red Bull alternatives',
      'Monster energy alternatives',
      'Sting alternatives',
      'sugar free energy drink alternatives',
      'healthy alternatives to energy drinks',
      'alternatives to sugary energy drinks',
      'alternatives to multiple cups of coffee',
      'drinks for people who dislike coffee',
      'yuzu passionfruit beverages',
      'matcha flavoured drinks India',
    ];
  } else if (slug.includes('aviva')) {
    specificKeywords = [
      'REBELIVE Aviva',
      'Aviva by REBELIVE',
      'gut health drinks',
      'prebiotic drinks',
      'probiotic drinks',
      'REBELIVE prebiotics',
      'REBELIVE probiotics',
      'prebiotic and probiotic beverages',
      'beverages with gut health ingredients',
      'probiotic carbonated beverages',
      'drinks without refined sugar',
      'monk fruit sweetened drinks',
      'beverages without added sugar',
      'immunity drinks',
      'immunity beverages',
      'nutritional wellness drinks',
      'vitamin enriched drinks',
      'botanical beverages',
      'everyday wellness beverages',
      'lychee rose drinks',
      'fruit flavoured functional drinks',
      'exotic flavoured beverages India',
      'premium flavoured sparkling drinks',
      'healthy cold drinks',
      'healthy alternatives to cold drinks',
      'low calorie beverages',
    ];
  } else if (slug.includes('capella')) {
    specificKeywords = [
      'REBELIVE Capella',
      'Capella by REBELIVE',
      'REBELIVE ashwagandha',
      'stress relief beverages',
      'stress support drinks',
      'relaxation beverages',
      'mood support drinks',
      'daily stress wellness drinks',
      'workday wellness drinks',
      'lifestyle wellness beverages',
      'carbonated wellness beverages',
      'adaptogenic drinks',
      'adaptogen beverages',
      'ashwagandha beverage',
      'botanical beverages',
      'botanical energy beverages',
      'adaptogen infused beverages',
      'functional botanical drinks',
      'ashwagandha drinks India',
      'magnesium fortified drinks',
      'potassium enriched beverages',
      'electrolyte functional drinks',
    ];
  } else {
    specificKeywords = [
      'REBELIVE Apex',
      'REBELIVE Aviva',
      'REBELIVE Capella',
      'functional drinks multipack',
      'functional drinks gift pack',
      'REBELIVE exclusive product bundles',
      'variety pack functional drinks',
    ];
  }

  const title = `${product.displayTitle || product.name} (${product.flavor || 'Functional'}) | REBELIVE`;
  const description = `${product.description} Zero Sugar, clean caffeine, functional nootropics, adaptogens & prebiotics. Engineered without compromise in India.`;
  const imgUrl = product.renderImage || product.image || product.canImage || '/brand/APEX.webp';

  return {
    title,
    description,
    keywords: [...specificKeywords, ...commonProductKeywords],
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
          alt: `${product.name} Functional Beverage Can`,
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
