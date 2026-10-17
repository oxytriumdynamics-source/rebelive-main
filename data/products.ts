export interface ProductBenefit {
  title: string;
  desc: string;
}

export interface NutritionFact {
  label: string;
  amount: string;
  dailyValue?: string;
}

export interface TastingNoteItem {
  name: string;
  note: string;
}

export interface GalleryItem {
  id: string;
  label: string;
  src: string;
  type: 'render' | 'wrap' | 'logo' | 'mood';
}

export interface NutritionFactRow {
  nutrient: string;
  per100ml: string;
  perServe: string;
  rda: string;
}

export interface ProductNutritionInfo {
  productName?: string;
  servingSize?: string;
  servingsPerContainer?: string;
  nutrients: NutritionFactRow[];
  notes?: string[];
}

export interface ProductAdditionalInfo {
  recommendedUsage?: string;
  directionsForUse?: string;
  storage?: string;
  disclaimer?: string;
  bestBefore?: string;
  countryOfOrigin?: string;
  manufacturedBy?: {
    name: string;
    address: string;
    fssaiLicNo?: string;
  };
  marketedBy?: {
    name: string;
    address: string;
    fssaiLicNo?: string;
  };
}

export interface ProductVariantData {
  id: number | string;
  productId?: number | string;
  sku: string;
  name: string;
  sizeMl?: number | null;
  price: number;
  compareAtPrice?: number | null;
  stockQty?: number;
  isDefault?: boolean;
  isActive?: boolean;
}

export interface Product {
  id: string;
  name: string;
  displayTitle: string;
  flavor: string;
  tagline: string;
  description: string;
  story?: string;
  volume: string;
  sugar: string;
  caffeine: string;
  calories: string;
  notes: string[];
  tastingNotesDetailed?: TastingNoteItem[];
  model: string;
  /** Path to the authentic flat can wrap design image */
  canImage: string;
  /** Authentic 3D can render image */
  image: string;
  renderImage?: string;
  /** Brand identity logo & motif artwork */
  brandLogo: string;
  /** Full-page flavor themed background image */
  bgImage: string;
  bgGradient: string;
  primaryTone: string;
  /** Accent color used for atmospheric glow & UI highlights */
  accentHex: string;
  rating?: {
    score: number;
    count: number;
  };
  benefits?: ProductBenefit[];
  nutrition?: NutritionFact[];
  gallery?: GalleryItem[];
  specs: {
    ph: string;
    taurine: string;
    carbonation: string;
    batch: string;
    dimensions?: string;
  };
  netQuantity?: string;
  isVegetarian?: boolean;
  ingredients?: string;
  nutritionInfo?: ProductNutritionInfo;
  additionalInfo?: ProductAdditionalInfo;
  variants?: ProductVariantData[];
  startingPrice?: number;
  compareAtPrice?: number | null;
}

export type PackSize = 3 | 6 | 9 | 12;

export const PRICES: Record<PackSize, { price: number; mrp: number; perCan: number; discount: string }> = {
  3: { price: 449, mrp: 499, perCan: 150, discount: '10% OFF' },
  6: { price: 799, mrp: 950, perCan: 133, discount: '16% OFF' },
  9: { price: 1149, mrp: 1399, perCan: 128, discount: '18% OFF' },
  12: { price: 1499, mrp: 1800, perCan: 125, discount: '17% OFF' },
};

// All live products are fetched dynamically from the MongoDB API via fetchProducts() and fetchProductBySlug()
export const PRODUCTS: Product[] = [];
export const ALL_PRODUCTS: Product[] = [];

export function getProductById(id: string): Product | undefined {
  return undefined;
}

