'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Search,
  BookOpen,
  Clock,
  ArrowRight,
  Sparkles,
  Calendar,
  User,
  Star,
  Tag,
  Loader2,
  ChevronRight,
  TrendingUp,
  Mail,
  CheckCircle2,
  X,
  WifiOff,
  RefreshCw,
} from 'lucide-react';
import SubpageShell from '@/components/layout/SubpageShell';
import { fetchPublicBlogs, isNetworkOnline } from '@/lib/blogsApi';
import { AdminBlog } from '@/lib/adminApi';
import { BLOG_CATEGORIES, isCategoryMatch, FALLBACK_BLOGS } from '@/lib/blogsData';

const SANS = "'Poppins', sans-serif";
const MONO = "'Poppins', sans-serif";

export default function BlogsPage() {
  const [blogs, setBlogs] = useState<AdminBlog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRetrying, setIsRetrying] = useState(false);
  const [isOffline, setIsOffline] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);
  const [newsletterOfflineNotice, setNewsletterOfflineNotice] = useState(false);

  const loadBlogs = useCallback(async (isManualRetry = false) => {
    if (isManualRetry) {
      setIsRetrying(true);
    } else {
      setIsLoading(true);
    }

    try {
      const res = await fetchPublicBlogs();
      setBlogs(res.blogs && res.blogs.length > 0 ? res.blogs : FALLBACK_BLOGS);
      setIsOffline(Boolean(res.isOffline));
    } catch {
      // Quiet recovery: fall back to client data without uncaught exceptions
      setBlogs(FALLBACK_BLOGS);
      setIsOffline(true);
    } finally {
      setIsLoading(false);
      setIsRetrying(false);
    }
  }, []);

  useEffect(() => {
    loadBlogs();

    // Auto-sync when internet connectivity is re-established
    const handleOnline = () => {
      setIsOffline(false);
      loadBlogs();
    };

    const handleOffline = () => {
      setIsOffline(true);
    };

    if (typeof window !== 'undefined') {
      setIsOffline(!isNetworkOnline());
      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
      }
    };
  }, [loadBlogs]);

  // Filtered blogs based on Category and Search Query
  const filteredBlogs = useMemo(() => {
    return blogs.filter((blog) => {
      const matchesCategory = isCategoryMatch(blog.category, blog.tags, selectedCategory);

      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        blog.title?.toLowerCase().includes(q) ||
        (blog.excerpt && blog.excerpt.toLowerCase().includes(q)) ||
        (blog.author && blog.author.toLowerCase().includes(q)) ||
        (blog.category && blog.category.toLowerCase().includes(q)) ||
        (blog.content && blog.content.toLowerCase().includes(q)) ||
        (blog.tags && blog.tags.some((t) => t.toLowerCase().includes(q)));

      return matchesCategory && matchesSearch;
    });
  }, [blogs, selectedCategory, searchQuery]);

  // Featured Blog (highest priority: blog with featured === true, else first item)
  const featuredBlog = useMemo(() => {
    if (!filteredBlogs.length) return null;
    return filteredBlogs.find((b) => b.featured) || filteredBlogs[0];
  }, [filteredBlogs]);

  // Grid blogs (excluding the featured one if showing featured banner and no active search)
  const gridBlogs = useMemo(() => {
    if (!searchQuery && selectedCategory === 'ALL' && featuredBlog) {
      return filteredBlogs.filter((b) => b.id !== featuredBlog.id);
    }
    return filteredBlogs;
  }, [filteredBlogs, featuredBlog, searchQuery, selectedCategory]);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = newsletterEmail.trim();
    if (!cleanEmail) return;

    if (isOffline || !isNetworkOnline()) {
      try {
        const queueKey = 'rebelive_offline_newsletter_queue';
        const existing = JSON.parse(localStorage.getItem(queueKey) || '[]');
        if (!existing.includes(cleanEmail)) {
          existing.push(cleanEmail);
          localStorage.setItem(queueKey, JSON.stringify(existing));
        }
      } catch {
        // Local storage restrictions
      }
      setNewsletterOfflineNotice(true);
    }

    setNewsletterSubscribed(true);
  };

  return (
    <SubpageShell className="min-h-screen text-white">
      {/* ─── Page Hero Banner ─── */}
      <div className="relative pt-6 sm:pt-10 pb-12 sm:pb-16 border-b border-white/10 text-center space-y-4">
        {/* Category Pill Tag */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/20 bg-white/[0.04] backdrop-blur-sm text-xs font-mono tracking-widest uppercase text-white/80">
          <Sparkles className="w-3.5 h-3.5 text-white/90" />
          <span>REBELIVE JOURNAL</span>
        </div>

        {/* Big Impactful Title */}
        <h1
          style={{ fontFamily: SANS }}
          className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-white uppercase max-w-4xl mx-auto leading-[1.1]"
        >
          Blogs
        </h1>

        {/* Offline / Cache Status Banner */}
        {isOffline && (
          <div className="pt-2">
            <div className="inline-flex items-center justify-between gap-3 px-4 py-2 rounded-full bg-white/[0.04] border border-white/10 text-neutral-300 text-xs font-mono max-w-md mx-auto">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse shrink-0" />
                <span className="text-[11px] sm:text-xs">Offline mode • Showing cached dispatches</span>
              </div>
              <button
                type="button"
                onClick={() => loadBlogs(true)}
                disabled={isRetrying}
                className="px-2.5 py-0.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-[10px] font-mono tracking-wider uppercase transition-colors flex items-center gap-1 cursor-pointer disabled:opacity-50"
              >
                <RefreshCw className={`w-3 h-3 ${isRetrying ? 'animate-spin' : ''}`} />
                <span>{isRetrying ? 'Retrying...' : 'Retry'}</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ─── Search & Category Filter Navigation ─── */}
      <div className="py-8 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 border-b border-white/5">
        {/* Category Pills: Keep All Articles first, followed by the requested categories */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 [scrollbar-width:none] [-ms-overflow-style:none]">
          <button
            onClick={() => setSelectedCategory('ALL')}
            className={`px-4 py-2 rounded-xl text-xs font-mono uppercase tracking-wider shrink-0 transition-all ${selectedCategory === 'ALL'
                ? 'bg-white text-black font-bold shadow-[0_0_15px_rgba(255,255,255,0.3)]'
                : 'bg-white/5 text-neutral-400 hover:text-white hover:bg-white/10 border border-white/10'
              }`}
          >
            All Articles
          </button>

          {BLOG_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-mono uppercase tracking-wider shrink-0 transition-all ${selectedCategory === cat
                  ? 'bg-white text-black font-bold shadow-[0_0_15px_rgba(255,255,255,0.3)]'
                  : 'bg-white/5 text-neutral-400 hover:text-white hover:bg-white/10 border border-white/10'
                }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Input: Followed by the search bar */}
        <div className="relative w-full lg:w-72 shrink-0">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search journal..."
            className="w-full bg-black/60 border border-white/15 rounded-xl pl-10 pr-9 py-2 text-xs font-mono text-white placeholder-neutral-500 focus:outline-none focus:border-white/50 transition-colors"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white transition-colors"
              aria-label="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* ─── Loading Skeleton ─── */}
      {isLoading ? (
        <div className="py-24 flex flex-col items-center justify-center text-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin text-white/80" />
          <span className="text-xs font-mono text-neutral-400 tracking-wider">
            LOADING REBELIVE ARCHIVES...
          </span>
        </div>
      ) : filteredBlogs.length === 0 ? (
        /* Empty State */
        <div className="py-20 text-center max-w-md mx-auto space-y-4">
          <BookOpen className="w-12 h-12 mx-auto text-neutral-600" />
          <h3 className="text-lg font-bold text-white">No Articles Found</h3>
          <p className="text-xs text-neutral-400 leading-relaxed">
            {searchQuery
              ? `No dispatches match your search query "${searchQuery}". Try another term or reset your filters.`
              : `No dispatches currently found under "${selectedCategory}". Check back soon or reset filters.`}
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('ALL');
            }}
            className="px-4 py-2 bg-white text-black text-xs font-bold font-mono rounded-xl hover:bg-neutral-200 transition-colors cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="space-y-12 sm:space-y-16 pt-8">
          {/* ─── Featured Article Hero Showcase (When on All and no search) ─── */}
          {!searchQuery && selectedCategory === 'ALL' && featuredBlog && (
            <Link
              href={`/blogs/${featuredBlog.slug}`}
              className="group block relative rounded-3xl overflow-hidden border border-white/15 bg-gradient-to-b from-white/[0.05] to-black hover:border-white/35 transition-all duration-300 shadow-[0_10px_40px_rgba(0,0,0,0.6)]"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 p-6 sm:p-10 items-center">
                {/* Image on Left */}
                <div className="lg:col-span-7 relative aspect-[16/10] rounded-2xl overflow-hidden border border-white/10 bg-black">
                  {featuredBlog.coverImage ? (
                    <Image
                      src={featuredBlog.coverImage}
                      alt={featuredBlog.title}
                      fill
                      sizes="(max-width: 1024px) 100vw, 60vw"
                      unoptimized={Boolean(featuredBlog.coverImage?.startsWith('http'))}
                      className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white/20">
                      <BookOpen className="w-12 h-12" />
                    </div>
                  )}
                  {/* Pinned Tag */}
                  <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/20 text-[10px] font-mono font-bold uppercase tracking-wider text-white flex items-center gap-1.5 shadow-lg">
                    <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                    <span>FEATURED DISPATCH</span>
                  </div>
                </div>

                {/* Details on Right */}
                <div className="lg:col-span-5 space-y-4">
                  {/* Category & Read Time */}
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="text-[11px] font-mono uppercase px-3 py-1 rounded-full bg-white/10 border border-white/15 text-white/90 font-semibold tracking-wider">
                      {featuredBlog.category}
                    </span>
                    <span className="text-xs font-mono text-neutral-400 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {featuredBlog.readTime || '4 min read'}
                    </span>
                  </div>

                  {/* Title */}
                  <h2 className="text-2xl sm:text-3xl font-black text-white group-hover:text-white/90 transition-colors leading-tight">
                    {featuredBlog.title}
                  </h2>

                  {/* Excerpt */}
                  {featuredBlog.excerpt && (
                    <p className="text-sm text-neutral-400 line-clamp-3 leading-relaxed">
                      {featuredBlog.excerpt}
                    </p>
                  )}

                  {/* Author Line */}
                  <div className="pt-2 flex items-center justify-between border-t border-white/10">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-white/10 border border-white/20 flex items-center justify-center">
                        <User className="w-3.5 h-3.5 text-white/70" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white">{featuredBlog.author}</div>
                        <div className="text-[10px] font-mono text-neutral-500">
                          {featuredBlog.authorRole || 'Editorial'}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-white group-hover:translate-x-1 transition-transform">
                      <span>READ FULL</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          )}

          {/* ─── Grid of Blog Cards ─── */}
          {(gridBlogs.length > 0 || selectedCategory !== 'ALL' || searchQuery) && (
            <div>
              <div className="flex items-center justify-between mb-8 pb-3 border-b border-white/10">
                <h3 className="text-xs font-mono uppercase tracking-[0.2em] text-neutral-400">
                  {searchQuery
                    ? `Search Results (${filteredBlogs.length})`
                    : selectedCategory === 'ALL'
                      ? `All Dispatches (${filteredBlogs.length})`
                      : `${selectedCategory} (${gridBlogs.length})`}
                </h3>
                <span className="text-xs font-mono text-neutral-500">
                  Sorted by most recent publication
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {gridBlogs.map((blog) => (
                  <Link
                    key={blog.id}
                    href={`/blogs/${blog.slug}`}
                    className="group flex flex-col rounded-2xl overflow-hidden border border-white/10 bg-[#0d0d0d] hover:border-white/30 hover:bg-[#121212] transition-all duration-300 shadow-[0_4px_25px_rgba(0,0,0,0.5)]"
                  >
                    {/* Thumbnail */}
                    <div className="relative aspect-[16/9] w-full overflow-hidden border-b border-white/10 bg-black">
                      {blog.coverImage ? (
                        <Image
                          src={blog.coverImage}
                          alt={blog.title}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          unoptimized={Boolean(blog.coverImage?.startsWith('http'))}
                          className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-white/20">
                          <BookOpen className="w-8 h-8" />
                        </div>
                      )}

                      {/* Category Overlay Tag */}
                      <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-black/75 backdrop-blur-md border border-white/15 text-[10px] font-mono font-semibold uppercase tracking-wider text-white">
                        {blog.category}
                      </div>
                    </div>

                    {/* Content Container */}
                    <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
                      <div className="space-y-2.5">
                        {/* Meta line: read time + date */}
                        <div className="flex items-center gap-3 text-[11px] font-mono text-neutral-500">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            {blog.readTime || '4 min read'}
                          </span>
                          <span>•</span>
                          <span>
                            {new Date(blog.createdAt).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </span>
                        </div>

                        {/* Title */}
                        <h4 className="text-lg font-bold text-white group-hover:text-white/90 line-clamp-2 leading-snug">
                          {blog.title}
                        </h4>

                        {/* Excerpt */}
                        {blog.excerpt && (
                          <p className="text-xs text-neutral-400 line-clamp-2 leading-relaxed">
                            {blog.excerpt}
                          </p>
                        )}
                      </div>

                      {/* Footer Row */}
                      <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs font-mono">
                        <span className="text-neutral-500 text-[11px] truncate max-w-[150px]">
                          By {blog.author}
                        </span>
                        <span className="text-white font-bold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                          Read
                          <ArrowRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ─── Newsletter Dispatch Box ─── */}
      <div className="mt-16 sm:mt-24 rounded-3xl border border-white/15 bg-gradient-to-r from-neutral-900 to-black p-8 sm:p-12 relative overflow-hidden">
        <div className="max-w-2xl mx-auto text-center space-y-4 sm:space-y-5 relative z-10">
          <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center mx-auto text-white mb-1">
            <Mail className="w-5 h-5" />
          </div>

          <h3
            style={{ wordSpacing: '0.18em' }}
            className="text-2xl sm:text-3xl font-black text-white uppercase tracking-wider leading-snug my-2"
          >
            JOIN THE REBEL SYNDICATE
          </h3>

          <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed font-sans max-w-xl mx-auto pt-1">
            Get first access to new drops, brand stories, and ideas shaping the future of everyday performance. No noise. Just signal.
          </p>

          {newsletterSubscribed ? (
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono flex items-center justify-center gap-2 max-w-md mx-auto">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>
                {newsletterOfflineNotice
                  ? "You're subscribed! (Saved offline - will sync when reconnected)."
                  : "You're subscribed to the syndicate. Welcome to REBELIVE."}
              </span>
            </div>
          ) : (
            <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row items-center gap-2.5 max-w-md mx-auto pt-2">
              <input
                type="email"
                required
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder="Enter your email address..."
                className="w-full sm:flex-1 bg-black/60 border border-white/15 rounded-xl px-4 py-3 text-xs font-mono text-white placeholder-neutral-500 focus:outline-none focus:border-white/50 transition-colors"
              />
              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white text-black font-bold text-xs uppercase tracking-wider hover:bg-neutral-200 transition-colors shadow-lg cursor-pointer shrink-0"
              >
                Subscribe
              </button>
            </form>
          )}
        </div>
      </div>
    </SubpageShell>
  );
}
