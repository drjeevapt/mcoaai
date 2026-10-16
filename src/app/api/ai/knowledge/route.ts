import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const query = searchParams.get('query');

    const where: any = {};
    if (category && category !== 'all') where.category = category;
    if (query) {
      where.OR = [
        { title: { contains: query } },
        { keywords: { contains: query } },
        { content: { contains: query } }
      ];
    }

    const items = await prisma.aiKnowledgeItem.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ success: true, count: items.length, items });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to fetch knowledge base', details: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, category, keywords, content, source, isVerified = true } = body;

    if (!title || !content || !source) {
      return NextResponse.json({ error: 'Title, content, and source are required' }, { status: 400 });
    }

    const item = await prisma.aiKnowledgeItem.create({
      data: {
        title,
        category: category || 'courses',
        keywords: keywords || title.toLowerCase(),
        content,
        source,
        isVerified
      }
    });

    return NextResponse.json({ success: true, item });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to create knowledge item', details: error.message }, { status: 500 });
  }
}
