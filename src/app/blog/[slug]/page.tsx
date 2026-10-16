import React from 'react';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { ArrowLeft, Clock, Calendar, User, Tag, Share2, BookOpen, Sparkles, CheckCircle2 } from 'lucide-react';
import type { Metadata } from 'next';

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await prisma.blogPost.findUnique({
    where: { slug: params.slug }
  });

  if (!post) {
    return { title: 'Healthcare Article | MCOA' };
  }

  return {
    title: `${post.title} | Medical Coding Officers Academy`,
    description: post.excerpt,
    authors: [{ name: post.authorName }],
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.publishedAt.toISOString(),
      siteName: 'Medical Coding Officers Academy'
    }
  };
}

export default async function BlogPostPage({ params }: Props) {
  const post = await prisma.blogPost.findUnique({
    where: { slug: params.slug }
  });

  if (!post || !post.isPublished) {
    notFound();
  }

  const tags = post.tags.split(',').map(t => t.trim()).filter(Boolean);

  return (
    <article className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Back Link */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-xs font-bold text-[#50458F] hover:text-[#211747] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to All Articles
        </Link>

        {/* Article Header Card */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-sm border border-slate-200 space-y-6">
          <div className="flex flex-wrap items-center gap-2">
            <span className="bg-purple-50 text-[#50458F] text-xs font-bold px-3 py-1 rounded-full border border-purple-200">
              {post.category}
            </span>
            <span className="text-slate-400 text-xs flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> {post.readTime}
            </span>
            <span className="text-slate-400 text-xs flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" /> {new Date(post.publishedAt).toLocaleDateString()}
            </span>
          </div>

          <h1 className="font-cinzel text-2xl sm:text-4xl font-bold text-[#211747] leading-tight">
            {post.title}
          </h1>

          <p className="text-base sm:text-lg text-slate-600 font-inter leading-relaxed italic border-l-4 border-[#D8AC55] pl-4 py-1">
            {post.excerpt}
          </p>

          {/* Author Badge */}
          <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-[#211747] text-[#D8AC55] flex items-center justify-center font-cinzel font-bold text-lg">
                JM
              </div>
              <div>
                <div className="font-montserrat font-bold text-sm text-[#211747]">{post.authorName}</div>
                <div className="text-xs text-[#50458F] font-medium">{post.authorRole}</div>
              </div>
            </div>
            <div className="text-right">
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                <CheckCircle2 className="w-3.5 h-3.5" /> Verified Faculty
              </span>
            </div>
          </div>
        </div>

        {/* Article Body Content */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-sm border border-slate-200 prose prose-purple max-w-none prose-headings:font-cinzel prose-headings:text-[#211747] prose-p:text-slate-700 prose-p:leading-relaxed prose-li:text-slate-700">
          <div className="whitespace-pre-line text-sm sm:text-base leading-relaxed text-slate-800 space-y-4">
            {post.content}
          </div>

          {/* Tags */}
          {tags.length > 0 && (
            <div className="mt-8 pt-6 border-t border-slate-100 flex flex-wrap gap-2 items-center">
              <Tag className="w-4 h-4 text-slate-400" />
              <span className="text-xs font-semibold text-slate-500">Topics:</span>
              {tags.map((t, i) => (
                <span key={i} className="text-xs bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg">
                  {t}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* CTA Box */}
        <div className="bg-gradient-to-r from-[#211747] to-[#50458F] rounded-3xl p-8 text-white text-center space-y-4 shadow-xl">
          <h3 className="font-cinzel text-xl sm:text-2xl font-bold text-white">
            Ready to Master Medical Coding with Dr. Jeevanantham?
          </h3>
          <p className="text-xs sm:text-sm text-purple-200 max-w-xl mx-auto">
            Enroll in our 4-Month AAPC CPC Preparation Program with 3 flexible installments and guaranteed corporate placement assistance.
          </p>
          <div className="pt-2">
            <Link
              href="/apply"
              className="inline-flex items-center gap-2 bg-[#D8AC55] text-[#211747] hover:bg-amber-400 px-6 py-3 rounded-xl font-bold text-xs shadow-lg transition-all"
            >
              Apply for Next Batch <Sparkles className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
