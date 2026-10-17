import axios from 'axios';
import { Product } from '@/data/products';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes fresh TTL
const STORAGE_KEY_PRODUCTS = 'rebelive_products_cache_v2';
const STORAGE_KEY_SLUG_PREFIX = 'rebelive_prod_slug_';

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

// In-memory caches
let memoryProductsList: CacheEntry<Product[]> | null = null;
const memoryProductBySlug = new Map<string, CacheEntry<Product>>();

// In-flight request deduplication promises
let inFlightProductsPromise: Promise<Product[]> | null = null;
const inFlightSlugPromises = new Map<string, Promise<Product | null>>();

function isClient(): boolean {
  return typeof window !== 'undefined';
}

function isFresh(entry: CacheEntry<any>, ttl = CACHE_TTL_MS): boolean {
  return Date.now() - entry.timestamp < ttl;
}

/**
 * Persist product in memory and localStorage across its slug, id, and name
 */
function indexProduct(product: Product): void {
  const timestamp = Date.now();
  const keysToSet = new Set<string>();

  if (product.id) keysToSet.add(String(product.id).toLowerCase().trim());
  if (product.name) keysToSet.add(product.name.toLowerCase().trim());
  if (product.displayTitle) keysToSet.add(product.displayTitle.toLowerCase().trim());

  keysToSet.forEach((k) => {
    memoryProductBySlug.set(k, { data: product, timestamp });
    if (isClient()) {
      try {
        localStorage.setItem(`${STORAGE_KEY_SLUG_PREFIX}${k}`, JSON.stringify({ data: product, timestamp }));
      } catch {}
    }
  });
}

/**
 * Retrieve cached single product from localStorage
 */
function getStoredProduct(slugOrId: string, allowStale = false): Product | null {
  if (!isClient()) return null;
  try {
    const raw = localStorage.getItem(`${STORAGE_KEY_SLUG_PREFIX}${slugOrId.toLowerCase().trim()}`);
    if (!raw) return null;
    const entry: CacheEntry<Product> = JSON.parse(raw);
    if (allowStale || isFresh(entry)) {
      // Re-hydrate memory cache
      memoryProductBySlug.set(slugOrId.toLowerCase().trim(), entry);
      return entry.data;
    }
  } catch {}
  return null;
}

/**
 * Retrieve cached products list from localStorage
 */
function getStoredList(allowStale = false): Product[] | null {
  if (!isClient()) return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PRODUCTS);
    if (!raw) return null;
    const entry: CacheEntry<Product[]> = JSON.parse(raw);
    if (Array.isArray(entry.data) && entry.data.length > 0 && (allowStale || isFresh(entry))) {
      // Re-hydrate memory cache
      memoryProductsList = entry;
      // Pre-index items
      entry.data.forEach(indexProduct);
      return entry.data;
    }
  } catch {}
  return null;
}

/**
 * Save products list into localStorage
 */
function saveStoredList(products: Product[]): void {
  if (!isClient()) return;
  try {
    const entry: CacheEntry<Product[]> = { data: products, timestamp: Date.now() };
    localStorage.setItem(STORAGE_KEY_PRODUCTS, JSON.stringify(entry));
  } catch {}
}

export function clearProductsCache(): void {
  memoryProductsList = null;
  memoryProductBySlug.clear();
  inFlightProductsPromise = null;
  inFlightSlugPromises.clear();

  if (isClient()) {
    try {
      localStorage.removeItem(STORAGE_KEY_PRODUCTS);
      // Remove all slug entries
      const keysToRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && k.startsWith(STORAGE_KEY_SLUG_PREFIX)) {
          keysToRemove.push(k);
        }
      }
      keysToRemove.forEach((k) => localStorage.removeItem(k));
    } catch {}
  }
}

/**
 * Fetch all products from backend MongoDB API with multi-tier caching and deduplication.
 * Does NOT fall back to dummy mock data if backend fails or returns no products.
 */
export async function fetchProducts(forceRefresh = false): Promise<Product[]> {
  // 1. If not forcing refresh, check in-memory cache first (0ms)
  if (!forceRefresh && memoryProductsList && isFresh(memoryProductsList) && memoryProductsList.data.length > 0) {
    return memoryProductsList.data;
  }

  // 2. If memory cache missed, check persistent localStorage cache (0ms)
  if (!forceRefresh) {
    const stored = getStoredList(false);
    if (stored && stored.length > 0) {
      return stored;
    }
  }

  // 3. Deduplicate concurrent requests: reuse existing in-flight request
  if (inFlightProductsPromise) {
    return inFlightProductsPromise;
  }

  // 4. Dispatch single request with timeout
  inFlightProductsPromise = (async () => {
    try {
      const res = await axios.get(`${API_BASE}/products`, {
        timeout: 6000,
        headers: forceRefresh ? { 'Cache-Control': 'no-cache' } : undefined,
      });

      const rawList = res.data?.data || res.data?.products;
      if (res.data?.status === 'success' && Array.isArray(rawList) && rawList.length > 0) {
        const serverProducts: Product[] = rawList.map((item: any) => formatServerProduct(item));
        
        // Update memory and persistent caches
        memoryProductsList = { data: serverProducts, timestamp: Date.now() };
        saveStoredList(serverProducts);

        // Pre-populate individual product caches for instant product detail page transitions
        serverProducts.forEach(indexProduct);

        return serverProducts;
      }

      throw new Error('Backend returned empty or invalid products list');
    } catch (err) {
      // If network fails but we have stale stored cache, serve stale cache to avoid crashing UI
      const staleStored = getStoredList(true);
      if (staleStored && staleStored.length > 0) {
        console.warn('Network failed or timed out; serving cached products list', err);
        return staleStored;
      }

      console.error('Failed to retrieve products from backend:', err);
      throw err;
    } finally {
      inFlightProductsPromise = null;
    }
  })();

  return inFlightProductsPromise;
}

/**
 * Fetch a single product by slug or ID from backend MongoDB API.
 * Uses in-memory cache, persistent storage, and dedupes requests.
 */
export async function fetchProductBySlug(slug: string, forceRefresh = false): Promise<Product | null> {
  const cleanSlug = slug.toLowerCase().trim();

  // 1. Check in-memory single product cache
  if (!forceRefresh) {
    const memEntry = memoryProductBySlug.get(cleanSlug);
    if (memEntry && isFresh(memEntry)) {
      return memEntry.data;
    }

    // 2. Check localStorage single product cache
    const storedProd = getStoredProduct(cleanSlug, false);
    if (storedProd) {
      return storedProd;
    }

    // 3. Check memory products list for matching product
    if (memoryProductsList && memoryProductsList.data.length > 0) {
      const foundInList = memoryProductsList.data.find(
        (p) =>
          String(p.id).toLowerCase() === cleanSlug ||
          p.name.toLowerCase() === cleanSlug ||
          p.displayTitle.toLowerCase() === cleanSlug
      );
      if (foundInList) {
        indexProduct(foundInList);
        return foundInList;
      }
    }

    // 4. Check stored list in localStorage
    const storedList = getStoredList(false);
    if (storedList && storedList.length > 0) {
      const foundInStoredList = storedList.find(
        (p) =>
          String(p.id).toLowerCase() === cleanSlug ||
          p.name.toLowerCase() === cleanSlug ||
          p.displayTitle.toLowerCase() === cleanSlug
      );
      if (foundInStoredList) {
        indexProduct(foundInStoredList);
        return foundInStoredList;
      }
    }
  }

  // 5. In-flight request deduplication
  if (inFlightSlugPromises.has(cleanSlug)) {
    return inFlightSlugPromises.get(cleanSlug)!;
  }

  const slugPromise = (async () => {
    try {
      const res = await axios.get(`${API_BASE}/products/${cleanSlug}`, {
        timeout: 6000,
        headers: forceRefresh ? { 'Cache-Control': 'no-cache' } : undefined,
      });

      const rawData = res.data?.data || res.data?.product;
      if (res.data?.status === 'success' && rawData) {
        const formatted = formatServerProduct(rawData);
        indexProduct(formatted);
        return formatted;
      }

      return null;
    } catch (err) {
      // Fallback to stale storage if available
      const staleProd = getStoredProduct(cleanSlug, true);
      if (staleProd) {
        console.warn(`Backend /products/${cleanSlug} unreachable; serving stale cache fallback`);
        return staleProd;
      }

      console.error(`Backend /products/${cleanSlug} unreachable or returned error:`, err);
      return null;
    } finally {
      inFlightSlugPromises.delete(cleanSlug);
    }
  })();

  inFlightSlugPromises.set(cleanSlug, slugPromise);
  return slugPromise;
}

/**
 * Normalizes backend Prisma/MongoDB product to the frontend Product interface
 * without relying on any static dummy products.
 */
function formatServerProduct(raw: any): Product {
  const defaultSlug = raw.slug || raw.id || 'product';
  const defaultTitle = raw.displayTitle || raw.name || 'Functional Formula';

  const firstImageUrl =
    raw.canImage ||
    raw.image ||
    (Array.isArray(raw.images) && raw.images.length > 0
      ? (raw.images.find((img: any) => img.isPrimary)?.url || raw.images[0]?.url)
      : '');

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
    canImage: raw.canImage || firstImageUrl || '',
    image: raw.image || firstImageUrl || '',
    renderImage: raw.renderImage || raw.image || firstImageUrl || '',
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
    gallery:
      Array.isArray(raw.gallery) && raw.gallery.length > 0
        ? raw.gallery.map((g: any, idx: number) => ({
            id: String(g.id || `gallery-${idx}`),
            label: g.label || `Angle ${idx + 1}`,
            src: typeof g === 'string' ? g : (g.src || g.url || ''),
            type: (g.type || 'render') as ('render' | 'wrap' | 'logo' | 'mood'),
          }))
        : Array.isArray(raw.images) && raw.images.length > 0
        ? raw.images.map((img: any, idx: number) => ({
            id: String(img.id || idx),
            label: img.label || `Angle ${idx + 1}`,
            src: img.url || img.src || img,
            type: 'render' as ('render' | 'wrap' | 'logo' | 'mood'),
          }))
        : [
            raw.canImage ? { id: 'hero', label: 'Can Hero', src: raw.canImage, type: 'render' as const } : null,
            raw.image ? { id: 'secondary', label: 'Secondary View', src: raw.image, type: 'render' as const } : null,
            raw.renderImage ? { id: 'wrap', label: '360° Wrap', src: raw.renderImage, type: 'wrap' as const } : null,
          ].filter(Boolean),
    specs: raw.specs || {},
    netQuantity: raw.netQuantity || '250 ml',
    isVegetarian: raw.isVegetarian !== undefined ? raw.isVegetarian : true,
    ingredients: raw.ingredients || '',
    nutritionInfo: raw.nutritionInfo || null,
    additionalInfo: raw.additionalInfo || null,
    variants: Array.isArray(raw.variants)
      ? raw.variants.map((v: any) => ({
          id: String(v.id),
          productId: String(v.productId || ''),
          sku: v.sku || '',
          name: v.name || '',
          sizeMl: typeof v.sizeMl === 'number' ? v.sizeMl : null,
          price: Number(v.price) || 0,
          compareAtPrice: v.compareAtPrice ? Number(v.compareAtPrice) : null,
          stockQty: typeof v.stockQty === 'number' ? v.stockQty : 0,
          isDefault: Boolean(v.isDefault),
          isActive: v.isActive !== undefined ? Boolean(v.isActive) : true,
        }))
      : [],
    startingPrice:
      Array.isArray(raw.variants) && raw.variants.length > 0
        ? Math.min(...raw.variants.map((v: any) => Number(v.price) || 9999))
        : (Number(raw.price) || 0),
    compareAtPrice:
      Array.isArray(raw.variants) && raw.variants.length > 0
        ? (() => {
            const sorted = [...raw.variants].sort(
              (a: any, b: any) => (Number(a.price) || 0) - (Number(b.price) || 0)
            );
            return sorted[0]?.compareAtPrice ? Number(sorted[0].compareAtPrice) : null;
          })()
        : (raw.compareAtPrice ? Number(raw.compareAtPrice) : null),
  };
}
