import axios from 'axios';
import { AdminBlog } from './adminApi';
import { FALLBACK_BLOGS, isCategoryMatch } from './blogsData';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

export const contentClient = axios.create({
  baseURL: `${API_BASE}/content`,
  timeout: 3000,
});

const BLOGS_CACHE_KEY = 'rebelive_public_blogs_cache';
const ARTICLE_CACHE_PREFIX = 'rebelive_blog_article_';

/**
 * Check if the browser currently has network connectivity.
 */
export function isNetworkOnline(): boolean {
  if (typeof navigator !== 'undefined' && typeof navigator.onLine === 'boolean') {
    return navigator.onLine;
  }
  return true;
}

/**
 * Retrieve cached blogs list from localStorage.
 */
export function getStoredBlogs(): AdminBlog[] | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(BLOGS_CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : null;
  } catch {
    return null;
  }
}

/**
 * Save fresh blogs list to localStorage cache for offline availability.
 */
export function saveStoredBlogs(blogs: AdminBlog[]): void {
  if (typeof window === 'undefined' || !Array.isArray(blogs)) return;
  try {
    localStorage.setItem(BLOGS_CACHE_KEY, JSON.stringify(blogs));
  } catch {
    // Quota exceeded or private browsing restrictions
  }
}

/**
 * Retrieve a cached single article from localStorage.
 */
export function getStoredArticle(slug: string): { blog: AdminBlog; related: AdminBlog[] } | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(`${ARTICLE_CACHE_PREFIX}${slug.toLowerCase()}`);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

/**
 * Save an individual article to localStorage cache.
 */
export function saveStoredArticle(slug: string, data: { blog: AdminBlog; related: AdminBlog[] }): void {
  if (typeof window === 'undefined' || !data?.blog) return;
  try {
    localStorage.setItem(`${ARTICLE_CACHE_PREFIX}${slug.toLowerCase()}`, JSON.stringify(data));
  } catch {
    // Storage quota
  }
}

/**
 * Fetch public blogs with graceful offline & error resilience:
 * 1. If offline, immediately serves local cache or curated fallback.
 * 2. If online, attempts API fetch with a responsive 3s timeout.
 * 3. On network error / server offline, safely falls back without noisy console traces.
 */
export async function fetchPublicBlogs(params?: {
  category?: string;
  search?: string;
  tag?: string;
  featured?: boolean;
}): Promise<{
  blogs: AdminBlog[];
  categories: { name: string; count: number }[];
  total: number;
  isOffline?: boolean;
}> {
  let isOffline = !isNetworkOnline();

  if (!isOffline) {
    try {
      const res = await contentClient.get('/blogs', { params });
      const serverBlogs: AdminBlog[] = res.data?.data || [];
      if (Array.isArray(serverBlogs) && serverBlogs.length > 0) {
        saveStoredBlogs(serverBlogs);
        return {
          blogs: serverBlogs,
          categories: res.data?.categories || [],
          total: res.data?.total || serverBlogs.length,
          isOffline: false,
        };
      }
    } catch {
      // Network failed, backend down, or timed out - seamlessly activate offline fallback
      isOffline = true;
    }
  }

  // Retrieve cached blogs or fallback dispatches
  const localList = getStoredBlogs();
  let baseList: AdminBlog[] = localList && localList.length > 0 ? localList : [...FALLBACK_BLOGS];

  // Apply filters in memory
  if (params?.category && params.category !== 'ALL') {
    baseList = baseList.filter((b) => isCategoryMatch(b.category, b.tags, params.category));
  }
  if (params?.search) {
    const q = params.search.toLowerCase().trim();
    baseList = baseList.filter(
      (b) =>
        b.title?.toLowerCase().includes(q) ||
        (b.excerpt && b.excerpt.toLowerCase().includes(q)) ||
        (b.author && b.author.toLowerCase().includes(q)) ||
        (b.category && b.category.toLowerCase().includes(q)) ||
        (b.tags && b.tags.some((t) => t.toLowerCase().includes(q)))
    );
  }

  return {
    blogs: baseList,
    categories: [],
    total: baseList.length,
    isOffline: true,
  };
}

/**
 * Fetch a single blog post by slug with offline cache fallback.
 */
export async function fetchPublicBlogBySlug(
  slug: string
): Promise<{ blog: AdminBlog; related: AdminBlog[]; isOffline?: boolean } | null> {
  const cleanSlug = slug.toLowerCase().trim();
  const online = isNetworkOnline();

  if (online) {
    try {
      const res = await contentClient.get(`/blogs/${encodeURIComponent(cleanSlug)}`);
      if (res.data?.data?.blog || res.data?.data?.title) {
        const payload = res.data.data.blog ? res.data.data : { blog: res.data.data, related: [] };
        saveStoredArticle(cleanSlug, payload);
        return { ...payload, isOffline: false };
      }
    } catch {
      // Backend offline or unreachable - proceed to cache check
    }
  }

  // 1. Check article cache
  const cachedArticle = getStoredArticle(cleanSlug);
  if (cachedArticle) {
    return { ...cachedArticle, isOffline: true };
  }

  // 2. Check cached blogs list
  const storedList = getStoredBlogs();
  if (storedList) {
    const foundInStored = storedList.find(
      (b) => b.slug.toLowerCase() === cleanSlug || b.id.toLowerCase() === cleanSlug
    );
    if (foundInStored) {
      const related = storedList.filter((b) => b.slug.toLowerCase() !== cleanSlug).slice(0, 3);
      return { blog: foundInStored, related, isOffline: true };
    }
  }

  // 3. Fall back to curated fallback dispatches
  const foundInFallback = FALLBACK_BLOGS.find(
    (b) => b.slug.toLowerCase() === cleanSlug || b.id.toLowerCase() === cleanSlug
  );
  if (foundInFallback) {
    const related = FALLBACK_BLOGS.filter((b) => b.slug.toLowerCase() !== cleanSlug).slice(0, 3);
    return { blog: foundInFallback, related, isOffline: true };
  }

  return null;
}
