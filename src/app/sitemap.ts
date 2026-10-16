import { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_ACADEMY_URL || 'https://medicalcodingofficersacademy.com';

  // Base static public pages
  const staticRoutes = [
    '',
    '/courses',
    '/courses/advanced-medical-coding',
    '/courses/cpc-preparation',
    '/courses/ccs-hospital-coding',
    '/practice',
    '/mock-exams',
    '/webinars',
    '/why-mcoa',
    '/about',
    '/contact',
    '/apply',
    '/blog'
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1.0 : 0.8
  }));

  // Dynamic Landing Pages
  let landingRoutes: MetadataRoute.Sitemap = [];
  try {
    const landingPages = await prisma.landingPage.findMany({
      where: { status: 'Published' },
      select: { slug: true, updatedAt: true }
    });
    landingRoutes = landingPages.map((lp) => ({
      url: `${baseUrl}/lp/${lp.slug}`,
      lastModified: lp.updatedAt,
      changeFrequency: 'daily' as const,
      priority: 0.9
    }));
  } catch (e) {
    // fallback
  }

  // Dynamic Blog Posts
  let blogRoutes: MetadataRoute.Sitemap = [];
  try {
    const blogPosts = await prisma.blogPost.findMany({
      where: { isPublished: true },
      select: { slug: true, publishedAt: true }
    });
    blogRoutes = blogPosts.map((post) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: post.publishedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.7
    }));
  } catch (e) {
    // fallback
  }

  return [...staticRoutes, ...landingRoutes, ...blogRoutes];
}
