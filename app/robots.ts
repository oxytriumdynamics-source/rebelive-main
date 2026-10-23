import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.rebelive.com';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/root', '/root/*', '/profile', '/api/*'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
