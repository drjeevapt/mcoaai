import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_ACADEMY_URL || 'https://medicalcodingofficersacademy.com';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/student/', '/trainer/', '/api/']
      }
    ],
    sitemap: `${baseUrl}/sitemap.xml`
  };
}
