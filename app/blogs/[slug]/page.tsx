'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Clock,
  Calendar,
  User,
  Share2,
  Copy,
  Check,
  Eye,
  BookOpen,
  ArrowRight,
  Sparkles,
  Tag,
  Loader2,
  ExternalLink,
} from 'lucide-react';
import SubpageShell from '@/components/layout/SubpageShell';
import { fetchPublicBlogBySlug } from '@/lib/blogsApi';
import { AdminBlog } from '@/lib/adminApi';

const SANS = "'Poppins', sans-serif";
const MONO = "'Poppins', sans-serif";

export default function BlogPostReaderPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;

  const [blog, setBlog] = useState<AdminBlog | null>(null);
  const [related, setRelated] = useState<AdminBlog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    if (slug) {
      loadArticle(slug);
    }
  }, [slug]);

  const loadArticle = async (slugVal: string) => {
    setIsLoading(true);
    try {
      const res = await fetchPublicBlogBySlug(slugVal);
      if (res && res.blog) {
        setBlog(res.blog);
        setRelated(res.related || []);
      } else {
        setBlog(null);
      }
    } catch {
      setBlog(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const handleShareTwitter = () => {
    if (typeof window !== 'undefined' && blog) {
      const text = encodeURIComponent(`"${blog.title}" via @rebelive`);
      const url = encodeURIComponent(window.location.href);
      window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank');
    }
  };

  const handleShareLinkedIn = () => {
    if (typeof window !== 'undefined') {
      const url = encodeURIComponent(window.location.href);
      window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank');
    }
  };

  const handleShareWhatsApp = () => {
    if (typeof window !== 'undefined' && blog) {
      const text = encodeURIComponent(`${blog.title} - ${window.location.href}`);
      window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
    }
  };

  if (isLoading) {
    return (
      <SubpageShell className="min-h-screen text-white flex flex-col items-center justify-center py-32">
        <Loader2 className="w-8 h-8 animate-spin text-white mb-4" />
        <span className="text-xs font-mono text-neutral-400">LOADING DISPATCH...</span>
      </SubpageShell>
    );
  }

  if (!blog) {
    return (
      <SubpageShell className="min-h-screen text-white py-24 text-center max-w-md mx-auto space-y-5">
        <BookOpen className="w-12 h-12 mx-auto text-neutral-600" />
        <h2 className="text-2xl font-black text-white uppercase">Article Not Found</h2>
        <p className="text-xs text-neutral-400">
          The dispatch you are looking for may have been retired or moved.
        </p>
        <Link
          href="/blogs"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-black font-bold text-xs font-mono rounded-xl hover:bg-neutral-200 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Journal</span>
        </Link>
      </SubpageShell>
    );
  }

  return (
    <SubpageShell className="min-h-screen text-white">
      {/* ─── Breadcrumb & Navigation Top Bar ─── */}
      <div className="pt-4 pb-6 border-b border-white/10 flex flex-wrap items-center justify-between gap-4">
        <Link
          href="/blogs"
          className="inline-flex items-center gap-2 text-xs font-mono text-neutral-400 hover:text-white transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>BACK TO ALL DISPATCHES</span>
        </Link>

        {/* Category breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-mono text-neutral-500">
          <span>Journal</span>
          <span>/</span>
          <span className="text-white font-semibold">{blog.category}</span>
        </div>
      </div>

      {/* ─── Main Article Container ─── */}
      <article className="max-w-4xl mx-auto pt-8 sm:pt-12 space-y-8">
        {/* Header Block */}
        <div className="space-y-4">
          {/* Metadata badges row */}
          <div className="flex flex-wrap items-center gap-3">
            <span className="px-3 py-1 rounded-full text-xs font-mono uppercase bg-white/10 border border-white/15 text-white font-semibold tracking-wider">
              {blog.category}
            </span>
            <span className="text-xs font-mono text-neutral-400 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              {blog.readTime || '4 min read'}
            </span>
            <span className="text-xs font-mono text-neutral-400 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              {new Date(blog.createdAt).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}
            </span>
            {blog.views > 0 && (
              <span className="text-xs font-mono text-neutral-400 flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5" />
                {blog.views} views
              </span>
            )}
          </div>

          {/* Article Title */}
          <h1
            style={{ fontFamily: SANS }}
            className="text-3xl sm:text-4xl md:text-5xl font-black text-white leading-[1.15] tracking-tight"
          >
            {blog.title}
          </h1>

          {/* Excerpt Lead */}
          {blog.excerpt && (
            <p className="text-base sm:text-lg text-neutral-300 font-sans leading-relaxed border-l-2 border-white pl-4 italic">
              {blog.excerpt}
            </p>
          )}

          {/* Author & Share Bar */}
          <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            {/* Author */}
            <div className="flex items-center gap-3">
              <div className="relative w-11 h-11 rounded-xl bg-neutral-900 border border-white/20 overflow-hidden flex items-center justify-center shrink-0">
                {blog.authorAvatar ? (
                  <Image
                    src={blog.authorAvatar}
                    alt={blog.author}
                    fill
                    sizes="44px"
                    unoptimized={Boolean(blog.authorAvatar.startsWith('http'))}
                    className="object-cover"
                  />
                ) : (
                  <User className="w-5 h-5 text-white/70" />
                )}
              </div>
              <div>
                <div className="text-sm font-bold text-white">{blog.author}</div>
                <div className="text-xs font-mono text-neutral-400">
                  {blog.authorRole || 'REBELIVE Editorial Team'}
                </div>
              </div>
            </div>

            {/* Social Share Buttons */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-neutral-500 mr-1 hidden sm:inline">
                SHARE:
              </span>
              <button
                onClick={handleCopyLink}
                title="Copy Link"
                className="p-2 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 text-neutral-300 hover:text-white transition-colors flex items-center gap-1.5 text-xs font-mono"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span className="text-[11px]">{copiedLink ? 'Copied' : 'Link'}</span>
              </button>

              <button
                onClick={handleShareTwitter}
                title="Share on X / Twitter"
                className="p-2 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 text-neutral-300 hover:text-white transition-colors text-xs font-mono font-bold"
              >
                𝕏
              </button>

              <button
                onClick={handleShareLinkedIn}
                title="Share on LinkedIn"
                className="p-2 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 text-neutral-300 hover:text-white transition-colors text-xs font-mono font-bold"
              >
                in
              </button>

              <button
                onClick={handleShareWhatsApp}
                title="Share on WhatsApp"
                className="p-2 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 text-neutral-300 hover:text-white transition-colors text-xs font-mono font-bold"
              >
                WA
              </button>
            </div>
          </div>
        </div>

        {/* Hero Cover Image */}
        {blog.coverImage && (
          <div className="relative w-full aspect-[21/10] sm:aspect-[21/9] rounded-3xl overflow-hidden border border-white/15 shadow-[0_10px_50px_rgba(0,0,0,0.8)] bg-black">
            <Image
              src={blog.coverImage}
              alt={blog.title}
              fill
              priority
              sizes="100vw"
              unoptimized={Boolean(blog.coverImage.startsWith('http'))}
              className="object-cover"
            />
          </div>
        )}

        {/* Article Body Content */}
        <div
          className="article-prose pt-4 font-sans text-neutral-200"
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />

        {/* Tags */}
        {blog.tags && blog.tags.length > 0 && (
          <div className="pt-8 border-t border-white/10 flex flex-wrap items-center gap-2">
            <span className="text-xs font-mono text-neutral-500 uppercase tracking-wider flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5" />
              Tags:
            </span>
            {blog.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-xs font-mono text-neutral-300 hover:text-white transition-colors"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* ─── Call to Action Banner ─── */}
        <div className="my-12 rounded-3xl border border-white/20 bg-gradient-to-r from-neutral-900 via-neutral-950 to-black p-8 sm:p-10 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xl">
          <div className="space-y-3.5 sm:space-y-4 text-center sm:text-left">
            <span className="text-[10px] sm:text-xs font-mono uppercase tracking-[0.2em] text-emerald-400 font-bold block">
              ● EXPLORE REBELIVE
            </span>
            <h3
              style={{ wordSpacing: '0.18em' }}
              className="text-xl sm:text-2xl font-black text-white uppercase tracking-wider leading-snug"
            >
              YOUR NEXT MOVE STARTS HERE.
            </h3>
            <p className="text-xs sm:text-sm text-neutral-400 max-w-lg font-sans leading-relaxed">
              Explore the Rebelive range. Make it yours.
            </p>
          </div>
          <Link
            href="/shop"
            className="px-6 py-3 rounded-xl bg-white text-black font-bold text-xs uppercase tracking-wider hover:bg-neutral-200 transition-all shadow-[0_0_20px_rgba(255,255,255,0.25)] shrink-0 flex items-center gap-2"
          >
            <span>SHOP NOW</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* ─── Related Articles Section ─── */}
        {related && related.length > 0 && (
          <div className="pt-12 border-t border-white/10 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-mono uppercase tracking-[0.2em] text-neutral-400">
                RELATED DISPATCHES
              </h3>
              <Link
                href="/blogs"
                className="text-xs font-mono text-neutral-400 hover:text-white flex items-center gap-1 transition-colors"
              >
                <span>View All</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
              {related.map((rel) => (
                <Link
                  key={rel.id}
                  href={`/blogs/${rel.slug}`}
                  className="group flex flex-col rounded-2xl overflow-hidden border border-white/10 bg-[#0d0d0d] hover:border-white/30 transition-all p-4 space-y-3"
                >
                  <div className="relative aspect-[16/9] w-full rounded-xl overflow-hidden bg-black">
                    {rel.coverImage ? (
                      <Image
                        src={rel.coverImage}
                        alt={rel.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        unoptimized={Boolean(rel.coverImage.startsWith('http'))}
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white/20">
                        <BookOpen className="w-6 h-6" />
                      </div>
                    )}
                  </div>
                  <div className="space-y-1.5 flex-1 flex flex-col justify-between">
                    <div>
                      <span className="text-[9px] font-mono uppercase text-neutral-500 block">
                        {rel.category}
                      </span>
                      <h5 className="text-sm font-bold text-white group-hover:text-white/90 line-clamp-2">
                        {rel.title}
                      </h5>
                    </div>
                    <span className="text-[10px] font-mono text-neutral-400 pt-2 block">
                      {rel.readTime || '4 min read'}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </article>

      {/* Global typography styling for article prose */}
      <style jsx global>{`
        .article-prose {
          font-family: 'Poppins', sans-serif;
          text-transform: none;
        }
        .article-prose * {
          text-transform: none;
        }
        .article-prose h1 {
          font-size: 2.25rem;
          font-weight: 900;
          color: #ffffff;
          margin-top: 2rem;
          margin-bottom: 1rem;
          line-height: 1.2;
          text-transform: none;
          letter-spacing: -0.02em;
        }
        .article-prose h2 {
          font-size: 1.75rem;
          font-weight: 800;
          color: #ffffff;
          margin-top: 2.5rem;
          margin-bottom: 1rem;
          line-height: 1.25;
          border-bottom: 1px solid rgba(255, 255, 255, 0.12);
          padding-bottom: 0.5rem;
          text-transform: none;
          letter-spacing: -0.01em;
        }
        .article-prose h3 {
          font-size: 1.35rem;
          font-weight: 700;
          color: #ffffff;
          margin-top: 2rem;
          margin-bottom: 0.75rem;
          line-height: 1.3;
          text-transform: none;
        }
        .article-prose p {
          color: rgba(255, 255, 255, 0.85);
          font-size: 1.05rem;
          line-height: 1.85;
          margin-bottom: 1.25rem;
          text-transform: none;
        }
        .article-prose strong {
          color: #ffffff;
          font-weight: 700;
        }
        .article-prose em {
          color: rgba(255, 255, 255, 0.95);
          font-style: italic;
        }
        .article-prose ul {
          list-style-type: disc;
          padding-left: 1.75rem;
          margin-bottom: 1.5rem;
          color: rgba(255, 255, 255, 0.85);
        }
        .article-prose ol {
          list-style-type: decimal;
          padding-left: 1.75rem;
          margin-bottom: 1.5rem;
          color: rgba(255, 255, 255, 0.85);
        }
        .article-prose li {
          margin-bottom: 0.5rem;
          line-height: 1.75;
          font-size: 1.02rem;
        }
        .article-prose blockquote {
          border-left: 3px solid #ffffff;
          padding: 1rem 1.25rem;
          margin: 2rem 0;
          background: rgba(255, 255, 255, 0.03);
          border-radius: 0 1rem 1rem 0;
          font-style: italic;
          color: #ffffff;
          font-size: 1.15rem;
          line-height: 1.75;
        }
        .article-prose a {
          color: #ffffff;
          text-decoration: underline;
          text-underline-offset: 4px;
          font-weight: 600;
        }
        .article-prose a:hover {
          color: rgba(255, 255, 255, 0.8);
        }
        .article-prose img {
          max-width: 100%;
          height: auto;
          border-radius: 1.25rem;
          margin: 2rem auto;
          display: block;
          border: 1px solid rgba(255, 255, 255, 0.12);
          box-shadow: 0 15px 40px rgba(0, 0, 0, 0.6);
        }
        .article-prose figure {
          margin: 2rem 0;
        }
        .article-prose figcaption {
          font-family: 'Poppins', sans-serif;
          font-size: 0.75rem;
          text-align: center;
          color: rgba(255, 255, 255, 0.5);
          margin-top: 0.5rem;
        }
      `}</style>
    </SubpageShell>
  );
}
