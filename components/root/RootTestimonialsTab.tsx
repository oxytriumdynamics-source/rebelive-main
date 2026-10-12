'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import {
  Quote,
  Plus,
  Search,
  Star,
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  Trash2,
  Edit2,
  X,
  ExternalLink,
  Loader2,
  Sparkles,
  Eye,
  RefreshCw,
  Layers,
  Check,
} from 'lucide-react';
import {
  fetchAdminTestimonials,
  createAdminTestimonial,
  updateAdminTestimonial,
  deleteAdminTestimonial,
  uploadTestimonialImage,
  AdminTestimonial,
} from '@/lib/adminApi';
import { compressImage, formatFileSize } from '@/lib/imageCompression';
import { showAdminToast } from './AdminToaster';

const MONO = "'JetBrains Mono', monospace";

function getInitials(name: string): string {
  if (!name) return 'R';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function RootTestimonialsTab() {
  const [testimonials, setTestimonials] = useState<AdminTestimonial[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<AdminTestimonial | null>(null);

  // Form Fields
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [quote, setQuote] = useState('');
  const [rating, setRating] = useState(5);
  const [image, setImage] = useState('');
  const [imagePosition, setImagePosition] = useState('center 15%');
  const [isFeatured, setIsFeatured] = useState(true);
  const [sortOrder, setSortOrder] = useState(1);

  // Cloudinary Upload & Compression State
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [compressionStats, setCompressionStats] = useState<{
    originalSize: string;
    compressedSize: string;
    savedPercent: number;
  } | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadTestimonials();
  }, []);

  const loadTestimonials = async () => {
    setIsLoading(true);
    try {
      const data = await fetchAdminTestimonials();
      setTestimonials(data);
    } catch (err: any) {
      console.error('Failed to load testimonials:', err);
      setFeedback({ type: 'error', message: err.message || 'Could not load testimonials' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenNewModal = () => {
    setEditingItem(null);
    setName('');
    setRole('');
    setQuote('');
    setRating(5);
    setImage('');
    setImagePosition('center 15%');
    setIsFeatured(true);
    setSortOrder(testimonials.length + 1);
    setCompressionStats(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item: AdminTestimonial) => {
    setEditingItem(item);
    setName(item.name);
    setRole(item.role || '');
    setQuote(item.quote);
    setRating(item.rating || 5);
    setImage(item.image || '');
    setImagePosition(item.imagePosition || 'center 15%');
    setIsFeatured(item.isFeatured !== false);
    setSortOrder(item.sortOrder || 1);
    setCompressionStats(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
    setCompressionStats(null);
  };

  const handleClearImage = () => {
    setImage('');
    setCompressionStats(null);
  };

  // Image Upload with Client Compression and Cloudinary
  const handleImageFile = async (file: File) => {
    setIsUploading(true);
    setCompressionStats(null);
    try {
      // 1. Client-side Canvas downscaling & compression to WebP
      const compressed = await compressImage(file, {
        maxWidth: 800,
        maxHeight: 800,
        quality: 0.85,
        format: 'image/webp',
      });

      if (compressed.savedPercent > 0) {
        setCompressionStats({
          originalSize: formatFileSize(compressed.originalSize),
          compressedSize: formatFileSize(compressed.compressedSize),
          savedPercent: compressed.savedPercent,
        });
      }

      // 2. Upload to Cloudinary CDN
      const res = await uploadTestimonialImage(compressed.file);
      const secureUrl = res.secure_url || res.url;
      setImage(secureUrl);

      showAdminToast(
        `Image compressed & uploaded to Cloudinary CDN! (${formatFileSize(compressed.compressedSize)})`,
        'success'
      );
    } catch (err: any) {
      console.error('Image upload failed:', err);
      showAdminToast(err.message || 'Image upload failed', 'error');
    } finally {
      setIsUploading(false);
    }
  };

  // Submit Add or Edit
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      showAdminToast('Rebel name is required', 'warning');
      return;
    }
    if (!quote.trim()) {
      showAdminToast('Testimonial quote is required', 'warning');
      return;
    }

    setIsSaving(true);
    try {
      const payload: Partial<AdminTestimonial> = {
        name: name.trim().toUpperCase(),
        role: role.trim() || null,
        quote: quote.trim(),
        rating,
        image: image.trim(),
        imagePosition: imagePosition.trim() || 'center 15%',
        isFeatured,
        sortOrder: Number(sortOrder) || 1,
      };

      if (editingItem) {
        await updateAdminTestimonial(editingItem.id, payload);
        showAdminToast(`Testimonial for ${name} updated successfully!`, 'success');
      } else {
        await createAdminTestimonial(payload);
        showAdminToast(`New testimonial for ${name} created!`, 'success');
      }

      handleCloseModal();
      await loadTestimonials();
    } catch (err: any) {
      console.error('Save failed:', err);
      showAdminToast(err.message || 'Failed to save testimonial', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  // Delete
  const handleDelete = async (id: string, rebelName: string) => {
    if (!confirm(`Are you sure you want to remove the testimonial by ${rebelName}?`)) {
      return;
    }

    try {
      await deleteAdminTestimonial(id);
      showAdminToast(`Testimonial by ${rebelName} removed.`, 'info');
      await loadTestimonials();
    } catch (err: any) {
      showAdminToast(err.message || 'Failed to delete', 'error');
    }
  };

  // Filtered List
  const filtered = testimonials.filter((t) => {
    const q = searchQuery.toLowerCase();
    return (
      t.name.toLowerCase().includes(q) ||
      (t.role && t.role.toLowerCase().includes(q)) ||
      t.quote.toLowerCase().includes(q)
    );
  });

  const isCloudinaryUrl = (url: string) => url.includes('cloudinary.com');

  return (
    <div className="space-y-6">
      {/* ─── Top Header & Controls ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-white/5">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-white/10 text-white">
              <Quote className="w-4 h-4" />
            </span>
            <h2 className="text-xl sm:text-2xl font-black uppercase text-white tracking-tight">
              Testimonials & Rebel Voices
            </h2>
          </div>
          <p className="text-xs text-white/50 font-mono mt-1">
            Manage customer endorsements, quote reviews, and Cloudinary-optimized rebel portraits.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadTestimonials}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors cursor-pointer border border-white/10"
            title="Refresh Testimonials"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={handleOpenNewModal}
            className="px-4 py-2.5 rounded-xl bg-white text-black hover:bg-neutral-200 font-mono text-xs uppercase font-bold flex items-center gap-2 cursor-pointer shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Plus className="w-4 h-4" />
            <span>Add Testimonial</span>
          </button>
        </div>
      </div>

      {/* ─── Feedback Alert Toast ─── */}
      {feedback && (
        <div
          className={`p-3.5 rounded-xl text-xs font-mono flex items-center gap-2.5 transition-all ${
            feedback.type === 'success'
              ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300'
              : 'bg-rose-500/10 border border-rose-500/30 text-rose-300'
          }`}
        >
          {feedback.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0" />
          )}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* ─── Stats Bar ─── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
        <div className="p-3.5 rounded-2xl bg-[#0e0e0e] border border-white/10">
          <p className="text-[10px] text-white/40 uppercase tracking-wider">Total Testimonials</p>
          <p className="text-lg font-bold text-white mt-0.5">{testimonials.length}</p>
        </div>

        <div className="p-3.5 rounded-2xl bg-[#0e0e0e] border border-white/10">
          <p className="text-[10px] text-white/40 uppercase tracking-wider">Featured on Home</p>
          <p className="text-lg font-bold text-emerald-400 mt-0.5">
            {testimonials.filter((t) => t.isFeatured).length}
          </p>
        </div>

        <div className="p-3.5 rounded-2xl bg-[#0e0e0e] border border-white/10">
          <p className="text-[10px] text-white/40 uppercase tracking-wider">Cloudinary CDN</p>
          <p className="text-lg font-bold text-cyan-400 mt-0.5">
            {testimonials.filter((t) => isCloudinaryUrl(t.image)).length}
          </p>
        </div>

        <div className="p-3.5 rounded-2xl bg-[#0e0e0e] border border-white/10">
          <p className="text-[10px] text-white/40 uppercase tracking-wider">Avg Star Rating</p>
          <p className="text-lg font-bold text-amber-400 mt-0.5 flex items-center gap-1">
            <span>5.0</span>
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 inline" />
          </p>
        </div>
      </div>

      {/* ─── Search & Filter Bar ─── */}
      <div className="relative max-w-md">
        <Search className="w-3.5 h-3.5 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Filter by rebel name, occupation, or quote text..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-[#111111] border border-white/10 rounded-xl pl-8 pr-3 py-2 text-xs text-white placeholder-white/30 font-mono focus:outline-none focus:border-white/30 transition-colors"
        />
      </div>

      {/* ─── Testimonials Grid ─── */}
      {isLoading ? (
        <div className="py-20 flex flex-col items-center justify-center text-white/40 font-mono text-xs gap-3">
          <RefreshCw className="w-6 h-6 animate-spin text-white" />
          <span>LOADING TESTIMONIALS FROM DATABASE...</span>
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-16 text-center rounded-2xl bg-[#0e0e0e] border border-white/10 p-8 space-y-3">
          <Quote className="w-8 h-8 text-white/20 mx-auto" />
          <p className="text-sm font-semibold text-white">No testimonials found</p>
          <p className="text-xs text-white/40 max-w-sm mx-auto font-mono">
            {searchQuery
              ? 'No testimonials matched your search query. Clear search or create a new one.'
              : 'Get started by adding your first customer endorsement with a portrait image.'}
          </p>
          <button
            onClick={handleOpenNewModal}
            className="px-4 py-2 rounded-xl bg-white text-black text-xs font-mono uppercase font-bold cursor-pointer"
          >
            Add First Testimonial
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((item) => {
            const hasCloudinary = isCloudinaryUrl(item.image);
            return (
              <div
                key={item.id}
                className="rounded-2xl bg-[#0b0b0b] border border-white/10 p-5 flex flex-col justify-between hover:border-white/20 transition-all group relative overflow-hidden shadow-lg"
              >
                {/* Top Row: Avatar + Info */}
                <div>
                  <div className="flex items-start gap-3.5 mb-3.5">
                    {/* Portrait Thumbnail / Initials */}
                    <div className="relative w-14 h-14 rounded-2xl overflow-hidden bg-neutral-900 border border-white/10 shrink-0 flex items-center justify-center">
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          sizes="64px"
                          style={{ objectFit: 'cover', objectPosition: item.imagePosition || 'center 15%' }}
                          className="transition-transform duration-300 group-hover:scale-105"
                          unoptimized={item.image.startsWith('http')}
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-neutral-800 to-black flex items-center justify-center font-bold text-white text-xs tracking-wider">
                          {getInitials(item.name)}
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <h4 className="font-bold text-sm text-white truncate tracking-tight uppercase">
                          {item.name}
                        </h4>
                        <span className="text-[10px] font-mono text-white/30 shrink-0">
                          #{item.sortOrder || 1}
                        </span>
                      </div>

                      {item.role && (
                        <p className="text-xs text-white/50 truncate font-mono mt-0.5">{item.role}</p>
                      )}

                      {/* Stars */}
                      <div className="flex items-center gap-0.5 mt-1">
                        {Array.from({ length: item.rating || 5 }).map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Quote Body */}
                  <div className="relative pl-3 border-l-2 border-white/20 my-2">
                    <p className="text-xs text-white/80 leading-relaxed font-light line-clamp-4 italic">
                      "{item.quote}"
                    </p>
                  </div>
                </div>

                {/* Bottom Row: Metadata & Actions */}
                <div className="pt-3.5 mt-3.5 border-t border-white/5 flex items-center justify-between text-xs font-mono">
                  {/* Badges */}
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {hasCloudinary ? (
                      <span className="px-2 py-0.5 rounded-md bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-[10px]">
                        Cloudinary CDN
                      </span>
                    ) : item.image ? (
                      <span className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-white/40 text-[10px]">
                        Custom Image
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[10px]">
                        Initials Avatar
                      </span>
                    )}

                    {item.isFeatured ? (
                      <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-[10px]">
                        Featured
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-md bg-white/5 text-white/40 text-[10px]">
                        Hidden
                      </span>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleOpenEditModal(item)}
                      className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors cursor-pointer"
                      title="Edit Testimonial"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id, item.name)}
                      className="p-1.5 rounded-lg bg-white/5 hover:bg-rose-500/20 text-white/40 hover:text-rose-300 transition-colors cursor-pointer"
                      title="Delete Testimonial"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ─── ADD / EDIT MODAL ─── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
          <div className="relative w-full max-w-2xl bg-[#0d0d0d] border border-white/20 rounded-2xl p-4 sm:p-5 shadow-2xl space-y-3.5 max-h-[96vh] overflow-y-auto [scrollbar-width:thin]">
            {/* Header */}
            <div className="flex items-center justify-between pb-2.5 border-b border-white/10">
              <div>
                <span className="font-mono text-[9px] uppercase tracking-widest text-white/50 block">
                  {editingItem ? 'EDIT TESTIMONIAL' : 'NEW REBEL ENDORSEMENT'}
                </span>
                <h3 className="text-base sm:text-lg font-black uppercase text-white leading-tight">
                  {editingItem ? `Edit ${editingItem.name}` : 'Add Testimonial'}
                </h3>
              </div>
              <button
                type="button"
                onClick={handleCloseModal}
                className="p-1 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSave} className="space-y-3 text-xs font-mono">
              {/* Row 1: Name & Role */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div className="space-y-1">
                  <label className="text-[9.5px] text-white/50 uppercase block font-semibold">Rebel Full Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. NISHANT MISHRA"
                    className="w-full bg-[#141414] border border-white/10 rounded-lg px-3 py-1.5 text-white placeholder-white/30 focus:outline-none focus:border-white/40 uppercase text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[9.5px] text-white/50 uppercase block font-semibold">Occupation / Persona</label>
                  <input
                    type="text"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    placeholder="e.g. Software Architect & Biohacker"
                    className="w-full bg-[#141414] border border-white/10 rounded-lg px-3 py-1.5 text-white placeholder-white/30 focus:outline-none focus:border-white/40 text-xs"
                  />
                </div>
              </div>

              {/* Row 2: Quote */}
              <div className="space-y-1">
                <label className="text-[9.5px] text-white/50 uppercase block font-semibold">Endorsement Quote *</label>
                <textarea
                  rows={2}
                  required
                  value={quote}
                  onChange={(e) => setQuote(e.target.value)}
                  placeholder="Clean sustained mental clarity through long coding sessions without any crash or anxiety. Rebelive is literally in a class of its own."
                  className="w-full bg-[#141414] border border-white/10 rounded-lg p-2.5 text-white placeholder-white/30 focus:outline-none focus:border-white/40 leading-relaxed text-xs resize-none"
                />
              </div>

              {/* Row 3: Rating, Sort Order, Storefront Display */}
              <div className="grid grid-cols-3 gap-2.5 items-end">
                <div className="space-y-1">
                  <label className="text-[9.5px] text-white/50 uppercase block font-semibold">Star Rating</label>
                  <div className="flex items-center gap-0.5 bg-[#141414] border border-white/10 rounded-lg px-2 py-1 h-[34px]">
                    {[1, 2, 3, 4, 5].map((starVal) => (
                      <button
                        key={starVal}
                        type="button"
                        onClick={() => setRating(starVal)}
                        className="cursor-pointer p-0.5"
                      >
                        <Star
                          className={`w-3.5 h-3.5 transition-colors ${
                            starVal <= rating
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-white/20'
                          }`}
                        />
                      </button>
                    ))}
                    <span className="text-[9px] text-white/50 ml-0.5">({rating}★)</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[9.5px] text-white/50 uppercase block font-semibold">Sort Order</label>
                  <input
                    type="number"
                    value={sortOrder}
                    onChange={(e) => setSortOrder(Number(e.target.value))}
                    min={1}
                    className="w-full bg-[#141414] border border-white/10 rounded-lg px-2.5 py-1 text-white h-[34px] text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[9.5px] text-white/50 uppercase block font-semibold">Storefront Display</label>
                  <label className="flex items-center gap-2 cursor-pointer bg-white/5 border border-white/10 rounded-lg px-2.5 py-1 h-[34px]">
                    <input
                      type="checkbox"
                      checked={isFeatured}
                      onChange={(e) => setIsFeatured(e.target.checked)}
                      className="w-3.5 h-3.5 rounded text-white focus:ring-0 cursor-pointer"
                    />
                    <span className="text-[11px] text-white whitespace-nowrap">Show on Home</span>
                  </label>
                </div>
              </div>

              {/* Row 4: Image Management & Live Preview Side-by-Side */}
              <div className="pt-2 border-t border-white/10 space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-[9.5px] text-white/70 uppercase block font-bold tracking-wider">
                    Portrait Photo (Cloudinary CDN WebP)
                  </label>
                  <span className="text-[9px] text-emerald-400 flex items-center gap-1 font-mono">
                    <Sparkles className="w-2.5 h-2.5" />
                    Auto-Compressed
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 items-stretch">
                  {/* Left Column: Dropzone & Inputs */}
                  <div className="space-y-1.5 flex flex-col justify-between">
                    {/* Compact Dropzone */}
                    <div
                      onDragOver={(e) => {
                        e.preventDefault();
                        setIsDragging(true);
                      }}
                      onDragLeave={() => setIsDragging(false)}
                      onDrop={(e) => {
                        e.preventDefault();
                        setIsDragging(false);
                        const file = e.dataTransfer.files?.[0];
                        if (file) handleImageFile(file);
                      }}
                      onClick={() => fileInputRef.current?.click()}
                      className={`p-2 rounded-xl border border-dashed transition-all flex items-center justify-center gap-2 text-center cursor-pointer min-h-[50px] ${
                        isDragging
                          ? 'border-white bg-white/10'
                          : isUploading
                          ? 'border-white/30 bg-white/[0.04]'
                          : 'border-white/20 bg-black/40 hover:border-white/40 hover:bg-white/[0.03]'
                      }`}
                    >
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/png,image/jpeg,image/webp"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleImageFile(file);
                          e.target.value = '';
                        }}
                      />

                      {isUploading ? (
                        <div className="flex items-center gap-2">
                          <Loader2 className="w-4 h-4 animate-spin text-white" />
                          <span className="text-[10px] font-bold text-white">Compressing & Uploading...</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-left">
                          <div className="w-6 h-6 rounded-lg bg-white/10 flex items-center justify-center text-white shrink-0">
                            <UploadCloud className="w-3.5 h-3.5" />
                          </div>
                          <div>
                            <p className="font-bold text-white text-[10.5px] leading-tight">
                              Upload photo or <span className="underline">browse</span>
                            </p>
                            <p className="text-[8.5px] text-white/40">Auto-compressed WebP</p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* URL & Crop Select */}
                    <div className="grid grid-cols-2 gap-1.5">
                      <div>
                        <input
                          type="text"
                          value={image}
                          onChange={(e) => setImage(e.target.value)}
                          placeholder="Image URL..."
                          className="w-full bg-[#141414] border border-white/10 rounded-lg px-2 py-1 text-white text-[10px]"
                        />
                      </div>
                      <div>
                        <select
                          value={imagePosition}
                          onChange={(e) => setImagePosition(e.target.value)}
                          className="w-full bg-[#141414] border border-white/10 rounded-lg px-1.5 py-1 text-white text-[10px]"
                        >
                          <option value="center 15%">Face / Headshot (15%)</option>
                          <option value="center 20%">Standard (20%)</option>
                          <option value="center 10%">High Crop (10%)</option>
                          <option value="center center">Neutral (Center)</option>
                          <option value="top center">Top Anchored</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Compact Live Card Preview */}
                  <div className="p-2 rounded-xl bg-black/60 border border-white/10 flex flex-col justify-center">
                    <div className="flex items-center gap-2.5 bg-[#141416] p-2 rounded-lg border border-white/10">
                      <div className="relative w-11 h-11 rounded-xl overflow-hidden bg-neutral-900 border border-white/10 shrink-0 flex items-center justify-center">
                        {image ? (
                          <Image
                            src={image}
                            alt={name || 'Preview'}
                            fill
                            sizes="44px"
                            style={{ objectFit: 'cover', objectPosition: imagePosition || 'center 15%' }}
                            unoptimized={image.startsWith('http')}
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-neutral-800 to-black flex items-center justify-center font-bold text-white text-xs tracking-wider">
                            {getInitials(name)}
                          </div>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-1">
                          <p className="font-bold text-[11px] uppercase text-white truncate">
                            {name || 'REBEL NAME'}
                          </p>
                          {image && (
                            <button
                              type="button"
                              onClick={handleClearImage}
                              className="text-[9px] text-red-400 hover:text-red-300 font-mono px-1.5 py-0.5 rounded bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 cursor-pointer"
                            >
                              Remove
                            </button>
                          )}
                        </div>
                        <p className="text-[9px] text-white/40 truncate">{role || 'Persona'}</p>
                        <div className="flex items-center gap-0.5 mt-0.5">
                          {Array.from({ length: rating }).map((_, i) => (
                            <Star key={i} className="w-2 h-2 fill-amber-400 text-amber-400" />
                          ))}
                        </div>
                        <p className="text-[9px] text-white/60 italic truncate mt-0.5">
                          "{quote || 'Quote preview...'}"
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 border-t border-white/10 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-3 py-1.5 rounded-lg text-white/60 hover:text-white transition-colors cursor-pointer text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-4 py-1.5 rounded-lg bg-white text-black hover:bg-neutral-200 font-bold uppercase cursor-pointer disabled:opacity-50 transition-all shadow-md flex items-center gap-1.5 text-xs"
                >
                  {isSaving && <Loader2 className="w-3 h-3 animate-spin text-black" />}
                  <span>{editingItem ? 'Save Changes' : 'Publish Testimonial'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default RootTestimonialsTab;
