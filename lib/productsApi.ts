import axios from 'axios';
import { Product } from '@/data/products';

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
 * Fetch all products from backend MongoDB API.
 * Does NOT fall back to dummy mock data if backend fails or returns no products.
 */
export async function fetchProducts(forceRefresh = false): Promise<Product[]> {
  // If memory cache exists and has items, return it unless forceRefresh requested
  if (!forceRefresh && cachedProducts && cachedProducts.length > 0) {
    return cachedProducts;
  }

  try {
    const res = await axios.get(`${API_BASE}/products`, {
      timeout: 4500,
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

    throw new Error('Backend returned empty or invalid products list');
  } catch (err) {
    console.error('Failed to retrieve products from backend:', err);
    cachedProducts = null;
    throw err;
  }
}

/**
 * Fetch a single product by slug or ID from backend MongoDB API.
 * Returns null if not found or if the backend request fails (never falls back to dummy data).
 */
export async function fetchProductBySlug(slug: string, forceRefresh = false): Promise<Product | null> {
  const cleanSlug = slug.toLowerCase();

  if (!forceRefresh && productCacheBySlug[cleanSlug]) {
    return productCacheBySlug[cleanSlug];
  }

  try {
    const res = await axios.get(`${API_BASE}/products/${cleanSlug}`, {
      timeout: 4500,
    });

    if (res.data?.status === 'success' && res.data?.data) {
      const formatted = formatServerProduct(res.data.data);
      productCacheBySlug[cleanSlug] = formatted;
      return formatted;
    }

    return null;
  } catch (err) {
    console.error(`Backend /products/${cleanSlug} unreachable or returned error:`, err);
    return null;
  }
}

/**
 * Normalizes backend Prisma/MongoDB product to the frontend Product interface
 * without relying on any static dummy products.
 */
function formatServerProduct(raw: any): Product {
  const defaultSlug = raw.slug || raw.id || 'product';
  const defaultTitle = raw.displayTitle || raw.name || 'Functional Formula';

  return {
    id: defaultSlug,
    name: raw.name || defaultTitle,
    displayTitle: defaultTitle,
    flavor: raw.flavor || '',
    tagline: raw.tagline || '',
    description: raw.description || '',
    story: raw.story || '',
    volume: raw.volume || '250 ml',
    sugar: raw.sugar || '0g',
    caffeine: raw.caffeine || '160mg',
    calories: raw.calories || '5 kcal',
    notes: Array.isArray(raw.notes) ? raw.notes : [],
    tastingNotesDetailed: Array.isArray(raw.tastingNotesDetailed) ? raw.tastingNotesDetailed : [],
    model: raw.model || '/models/soda-can1.glb',
    canImage: raw.canImage || raw.image || '',
    image: raw.image || raw.canImage || '',
    renderImage: raw.renderImage || raw.image || raw.canImage || '',
    brandLogo: raw.brandLogo || '',
    bgImage: raw.bgImage || '',
    bgGradient:
      raw.bgGradient ||
      'radial-gradient(ellipse at 50% 45%, rgba(75,75,75,0.55) 0%, rgba(22,22,22,0.9) 65%, #080808 100%)',
    primaryTone: raw.primaryTone || '#FFFFFF',
    accentHex: raw.accentHex || '#FFFFFF',
    rating: raw.rating || { score: 5.0, count: 0 },
    benefits: Array.isArray(raw.benefits) ? raw.benefits : [],
    nutrition: Array.isArray(raw.nutrition) ? raw.nutrition : [],
    gallery: Array.isArray(raw.gallery) ? raw.gallery : [],
    specs: raw.specs || {},
    netQuantity: raw.netQuantity || '250 ml',
    isVegetarian: raw.isVegetarian !== undefined ? raw.isVegetarian : true,
    ingredients: raw.ingredients || '',
    nutritionInfo: raw.nutritionInfo || null,
    additionalInfo: raw.additionalInfo || null,
  };
}
