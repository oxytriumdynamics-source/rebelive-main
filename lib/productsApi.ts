import axios from 'axios';
import { Product, ALL_PRODUCTS, PRODUCTS, VARIETY_BUNDLE } from '@/data/products';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

let cachedProducts: Product[] | null = null;
const productCacheBySlug: Record<string, Product> = {};

export function clearProductsCache() {
  cachedProducts = null;
  Object.keys(productCacheBySlug).forEach((k) => delete productCacheBySlug[k]);
  if (typeof window !== 'undefined') {
    try {
      localStorage.removeItem('rebelive_products_cache');
    } catch {}
  }
}

/**
 * Fetch all products from backend MongoDB API
 * Automatically falls back to ALL_PRODUCTS if backend is offline or during SSR
 */
export async function fetchProducts(forceRefresh = false): Promise<Product[]> {
  // If memory cache exists, return it unless forceRefresh requested
  if (!forceRefresh && cachedProducts && cachedProducts.length > 0) {
    return cachedProducts;
  }

  try {
    const res = await axios.get(`${API_BASE}/products`, {
      timeout: 3500,
    });

    if (res.data?.status === 'success' && Array.isArray(res.data?.data) && res.data.data.length > 0) {
      const serverProducts: Product[] = res.data.data.map((item: any) => formatServerProduct(item));
      cachedProducts = serverProducts;

      // Update local storage cache
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem('rebelive_products_cache', JSON.stringify(serverProducts));
        } catch {}
      }

      return serverProducts;
    }
  } catch (err) {
    console.warn('Backend /products unreachable, using local products dataset:', err);
  }

  // Check localStorage cache before static fallback
  if (typeof window !== 'undefined') {
    const raw = localStorage.getItem('rebelive_products_cache');
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          cachedProducts = parsed;
          return parsed;
        }
      } catch {}
    }
  }

  cachedProducts = ALL_PRODUCTS;
  return ALL_PRODUCTS;
}

/**
 * Fetch a single product by slug or ID from backend MongoDB API
 */
export async function fetchProductBySlug(slug: string, forceRefresh = false): Promise<Product | null> {
  const cleanSlug = slug.toLowerCase();

  if (!forceRefresh && productCacheBySlug[cleanSlug]) {
    return productCacheBySlug[cleanSlug];
  }

  try {
    const res = await axios.get(`${API_BASE}/products/${cleanSlug}`, {
      timeout: 3500,
    });

    if (res.data?.status === 'success' && res.data?.data) {
      const formatted = formatServerProduct(res.data.data);
      productCacheBySlug[cleanSlug] = formatted;
      return formatted;
    }
  } catch (err) {
    console.warn(`Backend /products/${cleanSlug} unreachable, using local fallback:`, err);
  }

  // Fallback to static product dataset
  const fallback = ALL_PRODUCTS.find(
    (p) => p.id.toLowerCase() === cleanSlug || p.name.toLowerCase() === cleanSlug
  );
  if (fallback) {
    productCacheBySlug[cleanSlug] = fallback;
    return fallback;
  }

  return null;
}

/**
 * Normalizes backend Prisma product to the frontend Product contract
 */
function formatServerProduct(raw: any): Product {
  const fallback = ALL_PRODUCTS.find(
    (p) => p.id.toLowerCase() === (raw.slug || raw.id || '').toLowerCase()
  ) || ALL_PRODUCTS[0];

  return {
    id: raw.slug || raw.id || fallback.id,
    name: raw.name || fallback.name,
    displayTitle: raw.displayTitle || raw.name || fallback.displayTitle,
    flavor: raw.flavor || fallback.flavor,
    tagline: raw.tagline || fallback.tagline,
    description: raw.description || fallback.description,
    story: raw.story || fallback.story,
    volume: raw.volume || fallback.volume,
    sugar: raw.sugar || fallback.sugar,
    caffeine: raw.caffeine || fallback.caffeine,
    calories: raw.calories || fallback.calories,
    notes: Array.isArray(raw.notes) && raw.notes.length > 0 ? raw.notes : fallback.notes,
    tastingNotesDetailed:
      Array.isArray(raw.tastingNotesDetailed) && raw.tastingNotesDetailed.length > 0
        ? raw.tastingNotesDetailed
        : fallback.tastingNotesDetailed,
    model: raw.model || fallback.model,
    canImage: raw.canImage || fallback.canImage,
    image: raw.image || fallback.image,
    renderImage: raw.renderImage || raw.image || fallback.renderImage,
    brandLogo: raw.brandLogo || fallback.brandLogo,
    bgImage: raw.bgImage || fallback.bgImage,
    bgGradient: raw.bgGradient || fallback.bgGradient,
    primaryTone: raw.primaryTone || fallback.primaryTone,
    accentHex: raw.accentHex || fallback.accentHex,
    rating: raw.rating || fallback.rating,
    benefits: Array.isArray(raw.benefits) && raw.benefits.length > 0 ? raw.benefits : fallback.benefits,
    nutrition: Array.isArray(raw.nutrition) && raw.nutrition.length > 0 ? raw.nutrition : fallback.nutrition,
    gallery: Array.isArray(raw.gallery) && raw.gallery.length > 0 ? raw.gallery : fallback.gallery,
    specs: raw.specs || fallback.specs,
    netQuantity: raw.netQuantity || fallback.netQuantity || '250 ml',
    isVegetarian: raw.isVegetarian !== undefined ? raw.isVegetarian : (fallback.isVegetarian ?? true),
    ingredients: raw.ingredients || fallback.ingredients,
    nutritionInfo: raw.nutritionInfo || fallback.nutritionInfo,
    additionalInfo: raw.additionalInfo || fallback.additionalInfo,
  };
}
