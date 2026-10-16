import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get('slug');
    const category = searchParams.get('category');
    const tag = searchParams.get('tag');

    if (slug) {
      const post = await prisma.blogPost.findUnique({
        where: { slug }
      });
      if (!post) {
        return NextResponse.json({ error: 'Blog post not found' }, { status: 404 });
      }
      return NextResponse.json({ success: true, post });
    }

    const where: any = { isPublished: true };
    if (category && category !== 'All') where.category = category;
    if (tag) where.tags = { contains: tag };

    const posts = await prisma.blogPost.findMany({
      where,
      orderBy: { publishedAt: 'desc' }
    });

    return NextResponse.json({ success: true, count: posts.length, posts });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to fetch blog posts', details: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      slug,
      title,
      excerpt,
      content,
      authorName = 'Dr. Jeevanantham Mariappan',
      authorRole = 'Founder & CEO, MCOA',
      category = 'Medical Coding',
      readTime = '5 min read',
      tags = 'Medical Coding, CPC',
      coverImage
    } = body;

    if (!slug || !title || !content) {
      return NextResponse.json({ error: 'Slug, title, and content are required' }, { status: 400 });
    }

    const post = await prisma.blogPost.create({
      data: {
        slug,
        title,
        excerpt: excerpt || title,
        content,
        authorName,
        authorRole,
        category,
        readTime,
        tags,
        coverImage: coverImage || 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&auto=format&fit=crop&q=60'
      }
    });

    return NextResponse.json({ success: true, post });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to create blog post', details: error.message }, { status: 500 });
  }
}
