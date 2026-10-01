import type { MetadataRoute } from 'next';
import { siteUrl } from '@/data/site';

const routes = [
  '',
  '/products',
  '/products/deepshield',
  '/products/wepsych',
  '/products/arabia-hills',
  '/products/alfa-club',
  '/products/other',
  '/journey',
  '/journey/axelliant',
  '/process',
  '/explorer',
  '/contact',
];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((route) => ({
    url: `${siteUrl}${route}`,
    changeFrequency: 'monthly',
    priority: route === '' ? 1 : route.startsWith('/products/') ? 0.8 : 0.6,
  }));
}
