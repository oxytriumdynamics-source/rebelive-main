import axios from 'axios';
import { AdminBlog } from './adminApi';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

export const contentClient = axios.create({
  baseURL: `${API_BASE}/content`,
  timeout: 8000,
});

export async function fetchPublicBlogs(params?: {
  category?: string;
  search?: string;
  tag?: string;
  featured?: boolean;
}): Promise<{ blogs: AdminBlog[]; categories: { name: string; count: number }[]; total: number }> {
  try {
    const res = await contentClient.get('/blogs', { params });
    return {
      blogs: res.data.data || [],
      categories: res.data.categories || [],
      total: res.data.total || (res.data.data ? res.data.data.length : 0),
    };
  } catch (err) {
    console.warn('Failed to fetch public blogs from backend:', err);
    return { blogs: [], categories: [], total: 0 };
  }
}

export async function fetchPublicBlogBySlug(
  slug: string
): Promise<{ blog: AdminBlog; related: AdminBlog[] } | null> {
  try {
    const res = await contentClient.get(`/blogs/${encodeURIComponent(slug)}`);
    return res.data.data;
  } catch (err) {
    console.warn(`Failed to fetch public blog (${slug}) from backend:`, err);
    return null;
  }
}
