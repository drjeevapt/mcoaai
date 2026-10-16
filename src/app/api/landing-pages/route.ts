import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get('slug');
    const status = searchParams.get('status');

    if (slug) {
      const page = await prisma.landingPage.findUnique({
        where: { slug }
      });
      if (!page) {
        return NextResponse.json({ error: 'Landing page not found' }, { status: 404 });
      }
      return NextResponse.json({ success: true, page });
    }

    const where: any = {};
    if (status && status !== 'all') where.status = status;

    const pages = await prisma.landingPage.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ success: true, count: pages.length, pages });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to fetch landing pages', details: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      slug,
      title,
      metaDescription,
      templateType = 'cpc_bootcamp',
      status = 'Published',
      heroBadge,
      heroHeadline,
      heroSubheadline,
      ctaText = 'Claim Free Seat & Syllabus',
      sectionsJson,
      targetBranch
    } = body;

    if (!slug || !title || !heroHeadline) {
      return NextResponse.json({ error: 'Slug, title, and heroHeadline are required' }, { status: 400 });
    }

    const page = await prisma.landingPage.upsert({
      where: { slug },
      update: {
        title,
        metaDescription: metaDescription || title,
        templateType,
        status,
        heroBadge: heroBadge || 'Official Admissions 2026',
        heroHeadline,
        heroSubheadline: heroSubheadline || '',
        ctaText,
        sectionsJson: typeof sectionsJson === 'string' ? sectionsJson : JSON.stringify(sectionsJson || {}),
        targetBranch
      },
      create: {
        slug,
        title,
        metaDescription: metaDescription || title,
        templateType,
        status,
        heroBadge: heroBadge || 'Official Admissions 2026',
        heroHeadline,
        heroSubheadline: heroSubheadline || '',
        ctaText,
        sectionsJson: typeof sectionsJson === 'string' ? sectionsJson : JSON.stringify(sectionsJson || {}),
        targetBranch
      }
    });

    return NextResponse.json({ success: true, page });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to save landing page', details: error.message }, { status: 500 });
  }
}
