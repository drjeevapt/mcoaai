import React from 'react';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { BookOpen, Calendar, Clock, ArrowRight, User, Sparkles } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Healthcare Coding Blog & Regulatory Insights | MCOA',
  description: 'Authoritative analysis on 2026 ICD-10-CM guideline changes, AAPC CPC preparation strategies, and healthcare revenue cycle trends by Dr. Jeevanantham Mariappan.'
};

export default async function BlogIndexPage() {
  const posts = await prisma.blogPost.findMany({
    where: { isPublished: true },
    orderBy: { publishedAt: 'desc' }
  });

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-50 border border-purple-200 text-[#50458F] text-xs font-montserrat font-bold">
            <Sparkles className="w-4 h-4 text-[#D8AC55]" />
            <span>MCOA Clinical Research & Education Cell</span>
          </div>
          <h1 className="font-cinzel text-3xl sm:text-4xl lg:text-5xl font-bold text-[#211747]">
            Coding Guidelines & Industry Insights
          </h1>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Essential regulatory updates, AAPC exam clearance tactics, and hospital revenue cycle leadership notes curated by Dr. Jeevanantham Mariappan.
          </p>
        </div>

        {/* Featured Post Banner */}
        {posts.length > 0 && (
          <div className="bg-gradient-to-r from-[#211747] via-[#33256A] to-[#50458F] rounded-3xl p-8 sm:p-12 text-white shadow-xl relative overflow-hidden">
            <div className="max-w-2xl space-y-4 relative z-10">
              <span className="bg-[#D8AC55] text-[#211747] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                Featured Editorial
              </span>
              <h2 className="font-cinzel text-2xl sm:text-3xl font-bold text-white leading-tight">
                {posts[0].title}
              </h2>
              <p className="text-purple-100 text-sm line-clamp-3 leading-relaxed">
                {posts[0].excerpt}
              </p>
              <div className="flex items-center gap-4 text-xs text-purple-200 pt-2">
                <span className="flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-[#D8AC55]" /> {posts[0].authorName}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-[#D8AC55]" /> {posts[0].readTime}
                </span>
              </div>
              <div className="pt-2">
                <Link
                  href={`/blog/${posts[0].slug}`}
                  className="inline-flex items-center gap-2 bg-[#D8AC55] text-[#211747] hover:bg-amber-400 font-bold px-5 py-2.5 rounded-xl text-xs shadow-lg transition-all"
                >
                  Read Full Editorial <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <article
              key={post.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div className="p-6 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="bg-purple-50 text-[#50458F] font-bold px-2.5 py-0.5 rounded-full border border-purple-200">
                    {post.category}
                  </span>
                  <span className="text-slate-400 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> {post.readTime}
                  </span>
                </div>

                <h3 className="font-montserrat font-bold text-lg text-slate-900 leading-snug hover:text-[#50458F] transition-colors">
                  <Link href={`/blog/${post.slug}`}>
                    {post.title}
                  </Link>
                </h3>

                <p className="text-slate-600 text-xs sm:text-sm line-clamp-3 leading-relaxed">
                  {post.excerpt}
                </p>
              </div>

              <div className="p-6 pt-0 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 mt-4">
                <span className="truncate max-w-[160px] font-medium">{post.authorName}</span>
                <Link
                  href={`/blog/${post.slug}`}
                  className="font-bold text-[#50458F] hover:text-[#211747] flex items-center gap-1"
                >
                  Read Article <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
