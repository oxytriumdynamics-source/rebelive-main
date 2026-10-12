'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Boxes,
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Plus,
  Trash2,
  Save,
  Link2,
  Loader2,
  ExternalLink,
  Eye,
  Zap,
  Info,
  Sparkles,
  Check,
} from 'lucide-react';
import { AdminLayoutShell } from '@/components/root/AdminLayoutShell';
import {
  fetchAdminProduct,
  updateAdminProduct,
  createAdminProduct,
  uploadProductImage,
  AdminProduct,
} from '@/lib/adminApi';
import { compressImage, formatFileSize } from '@/lib/imageCompression';

interface PackVariant {
  id?: string;
  sku: string;
  name: string;
  sizeMl: number;
  price: number;
  compareAtPrice?: number | null;
  stockQty: number;
  isDefault: boolean;
  isActive: boolean;
}

interface NutritionItem {
  key: string;
  amount: string;
  unit: string;
  dv?: string;
}

export default function ProductEditPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params?.id as string;
  const isNew = productId === 'new';

  const [isLoading, setIsLoading] = useState(!isNew);
  const [isSaving, setIsSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // ─── 1. Identity & Info ───
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [displayTitle, setDisplayTitle] = useState('');
  const [flavor, setFlavor] = useState('');
  const [tagline, setTagline] = useState('');
  const [description, setDescription] = useState('');
  const [story, setStory] = useState('');
  const [howToEnjoy, setHowToEnjoy] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [isFeatured, setIsFeatured] = useState(false);

  // ─── 2. Physical & Specs ───
  const [volume, setVolume] = useState('250ml');
  const [netQuantity, setNetQuantity] = useState('250 ml');
  const [isVegetarian, setIsVegetarian] = useState(true);
  const [sugar, setSugar] = useState('0g');
  const [caffeine, setCaffeine] = useState('120mg');
  const [calories, setCalories] = useState('10 kcal');
  const [ingredients, setIngredients] = useState('');

  // ─── 3. Formula Notes (Tags) ───
  const [notes, setNotes] = useState<string[]>(['Natural Caffeine', 'Zero Sugar', 'Electrolytes']);
  const [newNoteInput, setNewNoteInput] = useState('');

  // ─── 4. Nutrition Facts & Info ───
  const [servingSize, setServingSize] = useState('250ml (1 Can)');
  const [nutritionItems, setNutritionItems] = useState<NutritionItem[]>([
    { key: 'Energy', amount: '10', unit: 'kcal' },
    { key: 'Total Carbohydrate', amount: '2.5', unit: 'g' },
    { key: 'Total Sugars', amount: '0', unit: 'g' },
    { key: 'Added Sugars', amount: '0', unit: 'g' },
    { key: 'Protein', amount: '0', unit: 'g' },
    { key: 'Total Fat', amount: '0', unit: 'g' },
    { key: 'Sodium', amount: '45', unit: 'mg' },
    { key: 'Natural Caffeine', amount: '120', unit: 'mg' },
    { key: 'Taurine', amount: '1000', unit: 'mg' },
    { key: 'Vitamin B6', amount: '2.0', unit: 'mg', dv: '100%' },
    { key: 'Vitamin B12', amount: '2.4', unit: 'mcg', dv: '100%' },
  ]);

  // ─── 5. Visual Media & Assets ───
  const [canImage, setCanImage] = useState('/products/apex.webp');
  const [image, setImage] = useState('');
  const [renderImage, setRenderImage] = useState('');
  const [brandLogo, setBrandLogo] = useState('');
  const [bgGradient, setBgGradient] = useState('from-neutral-900 to-black');
  const [primaryTone, setPrimaryTone] = useState('#ffffff');
  const [accentHex, setAccentHex] = useState('#ffffff');

  // Cloudinary uploader state
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadTarget, setUploadTarget] = useState<'canImage' | 'image'>('canImage');
  const [compressionStats, setCompressionStats] = useState<{
    originalSize: string;
    compressedSize: string;
    savedPercent: number;
  } | null>(null);

  // ─── 6. Pack Configurations (Variants) ───
  const [packs, setPacks] = useState<PackVariant[]>([
    { sku: 'RBL-NEW-3PK', name: '3-Pack Trial', sizeMl: 250, price: 449, compareAtPrice: 499, stockQty: 100, isDefault: false, isActive: true },
    { sku: 'RBL-NEW-6PK', name: '6-Pack Half-Case', sizeMl: 250, price: 799, compareAtPrice: 899, stockQty: 150, isDefault: false, isActive: true },
    { sku: 'RBL-NEW-9PK', name: '9-Pack Reserve', sizeMl: 250, price: 1149, compareAtPrice: 1349, stockQty: 120, isDefault: false, isActive: true },
    { sku: 'RBL-NEW-12PK', name: '12-Pack Full Case', sizeMl: 250, price: 1440, compareAtPrice: 1800, stockQty: 250, isDefault: true, isActive: true },
  ]);

  // Load existing product if editing
  useEffect(() => {
    if (!isNew && productId) {
      loadProduct();
    }
  }, [productId, isNew]);

  const loadProduct = async () => {
    setIsLoading(true);
    try {
      const prod = await fetchAdminProduct(productId);
      setName(prod.name || '');
      setSlug(prod.slug || '');
      setDisplayTitle(prod.displayTitle || prod.name || '');
      setFlavor(prod.flavor || '');
      setTagline(prod.tagline || '');
      setDescription(prod.description || '');
      setStory(prod.story || '');
      setHowToEnjoy(prod.howToEnjoy || '');
      setIsActive(prod.isActive !== false);
      setIsFeatured(Boolean(prod.isFeatured));

      setVolume(prod.volume || '250ml');
      setNetQuantity(prod.netQuantity || '250 ml');
      setIsVegetarian(prod.isVegetarian !== false);
      setSugar(prod.sugar || '0g');
      setCaffeine(prod.caffeine || '120mg');
      setCalories(prod.calories || '10 kcal');
      setIngredients(prod.ingredients || '');

      if (Array.isArray(prod.notes) && prod.notes.length > 0) {
        setNotes(prod.notes);
      }

      // Nutrition info
      if (prod.nutritionInfo?.items && Array.isArray(prod.nutritionInfo.items)) {
        setNutritionItems(prod.nutritionInfo.items);
        if (prod.nutritionInfo.servingSize) setServingSize(prod.nutritionInfo.servingSize);
      } else if (prod.nutrition?.items && Array.isArray(prod.nutrition.items)) {
        setNutritionItems(prod.nutrition.items);
      }

      setCanImage(prod.canImage || prod.image || '/products/apex.webp');
      setImage(prod.image || '');
      setRenderImage(prod.renderImage || '');
      setBrandLogo(prod.brandLogo || '');
      setBgGradient(prod.bgGradient || 'from-neutral-900 to-black');
      setPrimaryTone(prod.primaryTone || '#ffffff');
      setAccentHex(prod.accentHex || '#ffffff');

      // Variants / packs
      if (Array.isArray(prod.variants) && prod.variants.length > 0) {
        setPacks(
          prod.variants.map((v) => ({
            id: v.id,
            sku: v.sku,
            name: v.name,
            sizeMl: v.sizeMl || 250,
            price: v.price,
            compareAtPrice: v.compareAtPrice,
            stockQty: v.stockQty,
            isDefault: v.isDefault,
            isActive: v.isActive,
          }))
        );
      }
    } catch (err: any) {
      console.error('Failed to load product:', err);
      setFeedback({ type: 'error', message: err.message || 'Failed to load product' });
    } finally {
      setIsLoading(false);
    }
  };

  // Add / Remove Notes
  const handleAddNote = () => {
    if (!newNoteInput.trim()) return;
    if (!notes.includes(newNoteInput.trim())) {
      setNotes([...notes, newNoteInput.trim()]);
    }
    setNewNoteInput('');
  };

  const handleRemoveNote = (idx: number) => {
    setNotes(notes.filter((_, i) => i !== idx));
  };

  // Nutrition Row handlers
  const handleAddNutritionRow = () => {
    setNutritionItems([...nutritionItems, { key: 'Nutrient', amount: '0', unit: 'g' }]);
  };

  const handleUpdateNutritionRow = (idx: number, field: keyof NutritionItem, val: string) => {
    setNutritionItems(
      nutritionItems.map((item, i) => (i === idx ? { ...item, [field]: val } : item))
    );
  };

  const handleRemoveNutritionRow = (idx: number) => {
    setNutritionItems(nutritionItems.filter((_, i) => i !== idx));
  };

  // ─── Pack Configurations Handlers (create new pack) ───
  const handleAddNewPack = () => {
    const nextCount = packs.length + 1;
    const cleanPrefix = (slug || name || 'VAR').toUpperCase().replace(/[^A-Z0-9]/g, '');
    const newPack: PackVariant = {
      id: `new-${Date.now()}`,
      sku: `RBL-${cleanPrefix || 'PROD'}-${nextCount * 3}PK`,
      name: `${name || 'Product'} · ${nextCount * 3}-Pack`,
      sizeMl: 250,
      price: 999,
      compareAtPrice: 1199,
      stockQty: 100,
      isDefault: false,
      isActive: true,
    };
    setPacks([...packs, newPack]);
  };

  const handleUpdatePack = (index: number, field: keyof PackVariant, value: any) => {
    setPacks(
      packs.map((p, i) => {
        if (i === index) {
          return { ...p, [field]: value };
        }
        if (field === 'isDefault' && value === true) {
          // Only one default pack
          return { ...p, isDefault: false };
        }
        return p;
      })
    );
  };

  const handleRemovePack = (index: number) => {
    if (packs.length === 1) {
      alert('A product must have at least one pack configuration.');
      return;
    }
    setPacks(packs.filter((_, i) => i !== index));
  };

  // Image Upload Handlers with Automatic Compression
  const handleImageUpload = async (file: File, target: 'canImage' | 'image' = uploadTarget) => {
    setIsUploading(true);
    setFeedback(null);
    setCompressionStats(null);
    try {
      // 1. Client-side canvas compression & downscaling to WebP (max 1600x1600, quality 0.85)
      const compressed = await compressImage(file, {
        maxWidth: 1600,
        maxHeight: 1600,
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

      // 2. Upload compressed asset to Cloudinary CDN
      const res = await uploadProductImage(compressed.file, 'rebelive/products');
      const secureUrl = res.secure_url || res.url;

      if (target === 'canImage') {
        setCanImage(secureUrl);
        if (!image) setImage(secureUrl);
      } else {
        setImage(secureUrl);
      }

      const sizeMsg = compressed.savedPercent > 0
        ? ` (${formatFileSize(compressed.originalSize)} → ${formatFileSize(compressed.compressedSize)}, saved ${compressed.savedPercent}%)`
        : '';
      setFeedback({
        type: 'success',
        message: `Product image compressed & uploaded to Cloudinary CDN successfully!${sizeMsg}`,
      });
      setTimeout(() => setFeedback(null), 4000);
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Image upload failed' });
    } finally {
      setIsUploading(false);
    }
  };

  // Form Submit: Save / Create Product
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('Product name is required');
      return;
    }

    setIsSaving(true);
    setFeedback(null);

    const nutritionPayload = {
      servingSize,
      items: nutritionItems,
    };

    const payload: any = {
      name: name.trim(),
      slug: (slug.trim() || name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-')).toLowerCase(),
      displayTitle: displayTitle.trim() || name.trim(),
      flavor: flavor.trim() || name.trim(),
      tagline: tagline.trim(),
      description: description.trim(),
      story: story.trim() || null,
      howToEnjoy: howToEnjoy.trim() || null,
      volume,
      netQuantity,
      isVegetarian,
      sugar,
      caffeine,
      calories,
      ingredients: ingredients.trim() || null,
      notes,
      nutritionInfo: nutritionPayload,
      nutrition: nutritionPayload,
      canImage: canImage.trim(),
      image: image.trim() || canImage.trim(),
      renderImage: renderImage.trim() || canImage.trim(),
      brandLogo: brandLogo.trim() || null,
      bgGradient,
      primaryTone,
      accentHex,
      isActive,
      isFeatured,
      variants: packs.map((p) => ({
        id: p.id,
        sku: p.sku.trim(),
        name: p.name.trim(),
        sizeMl: Number(p.sizeMl) || 250,
        price: Number(p.price) || 0,
        compareAtPrice: p.compareAtPrice ? Number(p.compareAtPrice) : null,
        stockQty: Number(p.stockQty) || 0,
        isDefault: Boolean(p.isDefault),
        isActive: Boolean(p.isActive),
      })),
    };

    try {
      if (isNew) {
        const created = await createAdminProduct(payload);
        setFeedback({ type: 'success', message: `Product "${created.name}" created successfully!` });
        setTimeout(() => {
          router.push(`/root/products/${created.id}`);
        }, 1200);
      } else {
        const updated = await updateAdminProduct(productId, payload);
        setFeedback({ type: 'success', message: `Product "${updated.name}" updated in database!` });
        setTimeout(() => setFeedback(null), 4000);
      }
    } catch (err: any) {
      console.error('Failed to save product:', err);
      setFeedback({ type: 'error', message: err.message || 'Failed to save product' });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AdminLayoutShell activeTab="products" searchPlaceholder="Search this product..">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* ─── Back Bar & Save Button Header ─── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <Link
            href="/root?tab=products"
            className="inline-flex items-center gap-2 text-xs font-mono text-white/60 hover:text-white transition-colors cursor-pointer w-fit"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Catalog List</span>
          </Link>

          <div className="flex items-center gap-3">
            {!isNew && (
              <Link
                href={`/shop`}
                target="_blank"
                className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/80 hover:text-white text-xs font-mono border border-white/10 transition-colors flex items-center gap-1.5"
                title="View in Storefront"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Storefront</span>
              </Link>
            )}

            <button
              type="submit"
              disabled={isSaving}
              className="px-5 py-2 rounded-xl bg-white text-black hover:bg-neutral-200 font-mono text-xs uppercase font-extrabold flex items-center gap-2 cursor-pointer transition-all shadow-md disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Saving to DB...</span>
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5 text-black" />
                  <span>{isNew ? 'Create Product' : 'Save Changes'}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* ─── Live Feedback Banner ─── */}
        {feedback && (
          <div
            className={`p-3.5 rounded-xl border text-xs flex items-center gap-2 animate-in fade-in ${
              feedback.type === 'success'
                ? 'bg-white/10 border-white/20 text-white'
                : 'bg-white/10 border-white/20 text-white'
            }`}
          >
            {feedback.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 shrink-0 text-white" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0 text-white/70" />
            )}
            <span>{feedback.message}</span>
          </div>
        )}

        {/* ─── Loading State ─── */}
        {isLoading ? (
          <div className="p-16 rounded-2xl bg-[#0d0d0d] border border-white/10 text-center text-white/50 font-mono text-xs space-y-2">
            <RefreshCw className="w-6 h-6 animate-spin mx-auto text-white/40" />
            <p>Loading Product Configuration #{productId}...</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* ─── Section 1: Product Header Card ─── */}
            <div className="p-5 sm:p-7 rounded-2xl bg-[#0d0d0d] border border-white/10 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-5">
              <div className="space-y-1 flex-1">
                <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest block">
                  {isNew ? 'CATALOG NEW PRODUCT CREATION' : 'DATABASE PRODUCT RECORD'}
                </span>
                <h2 className="text-xl sm:text-2xl font-black font-mono text-white tracking-tight">
                  {name || 'Untitled Functional Beverage'}
                </h2>
                <p className="text-xs text-white/50 font-mono">
                  {flavor || 'Flavor formulation'} · {volume}
                </p>
              </div>

              {/* Status Toggles */}
              <div className="flex items-center gap-4 text-xs font-mono">
                <label className="flex items-center gap-2 cursor-pointer bg-white/5 px-3 py-2 rounded-xl border border-white/10">
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="w-4 h-4 rounded border-white/20 bg-white/10 text-white focus:ring-0 cursor-pointer"
                  />
                  <span className="font-bold text-white">Active Catalog</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer bg-white/5 px-3 py-2 rounded-xl border border-white/10">
                  <input
                    type="checkbox"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                    className="w-4 h-4 rounded border-white/20 bg-white/10 text-white focus:ring-0 cursor-pointer"
                  />
                  <span className="font-bold text-white">Featured Hero</span>
                </label>
              </div>
            </div>

            {/* ─── Section 2: Identity & Marketing ─── */}
            <div className="p-5 sm:p-6 rounded-2xl bg-[#0d0d0d] border border-white/10 shadow-lg space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
                <Boxes className="w-4 h-4 text-white" />
                <span>1. Core Identity & Nomenclature</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs font-mono">
                <div className="space-y-1.5">
                  <label className="text-[10px] text-white/50 uppercase block">Product Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. APEX Zero Sugar"
                    className="w-full bg-[#141414] border border-white/10 rounded-xl px-3.5 py-2.5 text-white placeholder-white/30 focus:outline-none focus:border-white/40"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] text-white/50 uppercase block">URL Slug</label>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="e.g. apex"
                    className="w-full bg-[#141414] border border-white/10 rounded-xl px-3.5 py-2.5 text-white placeholder-white/30 focus:outline-none focus:border-white/40"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] text-white/50 uppercase block">Display Title</label>
                  <input
                    type="text"
                    value={displayTitle}
                    onChange={(e) => setDisplayTitle(e.target.value)}
                    placeholder="e.g. APEX // HYPERDRIVE"
                    className="w-full bg-[#141414] border border-white/10 rounded-xl px-3.5 py-2.5 text-white placeholder-white/30 focus:outline-none focus:border-white/40"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] text-white/50 uppercase block">Flavor Signature</label>
                  <input
                    type="text"
                    value={flavor}
                    onChange={(e) => setFlavor(e.target.value)}
                    placeholder="e.g. Ultra Citrus Fuel"
                    className="w-full bg-[#141414] border border-white/10 rounded-xl px-3.5 py-2.5 text-white placeholder-white/30 focus:outline-none focus:border-white/40"
                  />
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-[10px] text-white/50 uppercase block">Marketing Tagline</label>
                  <input
                    type="text"
                    value={tagline}
                    onChange={(e) => setTagline(e.target.value)}
                    placeholder="e.g. Pure Bio-Energy. Zero Crash. Engineered Without Compromise."
                    className="w-full bg-[#141414] border border-white/10 rounded-xl px-3.5 py-2.5 text-white placeholder-white/30 focus:outline-none focus:border-white/40"
                  />
                </div>
              </div>
            </div>

            {/* ─── Section 3: Descriptions, Lore & Usage ─── */}
            <div className="p-5 sm:p-6 rounded-2xl bg-[#0d0d0d] border border-white/10 shadow-lg space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                2. Descriptions, Lore & Consumption Notes
              </h3>

              <div className="space-y-4 text-xs font-mono">
                <div className="space-y-1.5">
                  <label className="text-[10px] text-white/50 uppercase block">Primary Product Description *</label>
                  <textarea
                    rows={4}
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Comprehensive description of the product benefits, flavor profile, and formulation..."
                    className="w-full bg-[#141414] border border-white/10 rounded-xl p-3.5 text-white placeholder-white/30 focus:outline-none focus:border-white/40 leading-relaxed"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-white/50 uppercase block">Brand Story & Heritage</label>
                    <textarea
                      rows={3}
                      value={story}
                      onChange={(e) => setStory(e.target.value)}
                      placeholder="Origin story, bio-hacking lore, engineering ethos..."
                      className="w-full bg-[#141414] border border-white/10 rounded-xl p-3.5 text-white placeholder-white/30 focus:outline-none focus:border-white/40 leading-relaxed"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] text-white/50 uppercase block">How To Enjoy (Serving Recommendation)</label>
                    <textarea
                      rows={3}
                      value={howToEnjoy}
                      onChange={(e) => setHowToEnjoy(e.target.value)}
                      placeholder="Best served ice cold (2-4°C). Consume 20 mins before training, deep work, or sustained focus..."
                      className="w-full bg-[#141414] border border-white/10 rounded-xl p-3.5 text-white placeholder-white/30 focus:outline-none focus:border-white/40 leading-relaxed"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* ─── Section 4: Physical Specs & Formula Highlights ─── */}
            <div className="p-5 sm:p-6 rounded-2xl bg-[#0d0d0d] border border-white/10 shadow-lg space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                3. Physical Specs & Formula Highlights
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs font-mono">
                <div className="space-y-1.5">
                  <label className="text-[10px] text-white/50 uppercase block">Can Volume</label>
                  <input
                    type="text"
                    value={volume}
                    onChange={(e) => setVolume(e.target.value)}
                    placeholder="250ml"
                    className="w-full bg-[#141414] border border-white/10 rounded-xl px-3 py-2 text-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] text-white/50 uppercase block">Net Quantity</label>
                  <input
                    type="text"
                    value={netQuantity}
                    onChange={(e) => setNetQuantity(e.target.value)}
                    placeholder="250 ml"
                    className="w-full bg-[#141414] border border-white/10 rounded-xl px-3 py-2 text-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] text-white/50 uppercase block">Sugar</label>
                  <input
                    type="text"
                    value={sugar}
                    onChange={(e) => setSugar(e.target.value)}
                    placeholder="0g"
                    className="w-full bg-[#141414] border border-white/10 rounded-xl px-3 py-2 text-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] text-white/50 uppercase block">Caffeine</label>
                  <input
                    type="text"
                    value={caffeine}
                    onChange={(e) => setCaffeine(e.target.value)}
                    placeholder="120mg"
                    className="w-full bg-[#141414] border border-white/10 rounded-xl px-3 py-2 text-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] text-white/50 uppercase block">Calories</label>
                  <input
                    type="text"
                    value={calories}
                    onChange={(e) => setCalories(e.target.value)}
                    placeholder="10 kcal"
                    className="w-full bg-[#141414] border border-white/10 rounded-xl px-3 py-2 text-white"
                  />
                </div>

                <div className="space-y-1.5 flex flex-col justify-end">
                  <label className="flex items-center gap-2 cursor-pointer bg-white/5 px-2.5 py-2 rounded-xl border border-white/10 h-[38px]">
                    <input
                      type="checkbox"
                      checked={isVegetarian}
                      onChange={(e) => setIsVegetarian(e.target.checked)}
                      className="w-3.5 h-3.5 rounded border-white/20 bg-white/10 text-white cursor-pointer"
                    />
                    <span className="text-[11px] font-bold text-white">100% Veg</span>
                  </label>
                </div>
              </div>

              {/* Formula Notes (Tags) */}
              <div className="space-y-2 pt-2 border-t border-white/10">
                <label className="text-[10px] font-mono text-white/50 uppercase block">
                  Formula Highlight Badges & Key Notes
                </label>
                <div className="flex flex-wrap gap-2 items-center">
                  {notes.map((note, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white font-mono text-xs"
                    >
                      <span>{note}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveNote(idx)}
                        className="text-white/40 hover:text-white cursor-pointer"
                      >
                        ×
                      </button>
                    </span>
                  ))}

                  <div className="inline-flex items-center gap-1">
                    <input
                      type="text"
                      value={newNoteInput}
                      onChange={(e) => setNewNoteInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddNote();
                        }
                      }}
                      placeholder="Add highlight tag..."
                      className="bg-[#141414] border border-white/15 rounded-xl px-3 py-1 text-xs text-white placeholder-white/30 font-mono focus:outline-none focus:border-white/40 w-44"
                    />
                    <button
                      type="button"
                      onClick={handleAddNote}
                      className="px-2.5 py-1 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-mono cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* Ingredients List */}
              <div className="space-y-1.5 pt-2 border-t border-white/10">
                <label className="text-[10px] font-mono text-white/50 uppercase block">
                  Comprehensive Ingredients & Formulation
                </label>
                <textarea
                  rows={2}
                  value={ingredients}
                  onChange={(e) => setIngredients(e.target.value)}
                  placeholder="Carbonated Reverse-Osmosis Purified Water, Natural Caffeine (from Green Coffee Bean), Taurine, L-Theanine, B-Complex Vitamins (B3, B6, B12), Citric Acid, Electrolyte Matrix (Sodium Citrate, Potassium Phosphate), Natural Flavors, Stevia Leaf Extract."
                  className="w-full bg-[#141414] border border-white/10 rounded-xl p-3 text-xs text-white placeholder-white/30 font-mono focus:outline-none focus:border-white/40 leading-relaxed"
                />
              </div>
            </div>

            {/* ─── Section 5: Nutrition Facts & Nutrition Info (User Requested) ─── */}
            <div className="p-5 sm:p-6 rounded-2xl bg-[#0d0d0d] border border-white/10 shadow-lg space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                    4. Nutritional Parameters & Facts Table
                  </h3>
                  <p className="text-[10px] text-white/40 font-mono mt-0.5">
                    Standardized nutrient metrics rendered on public product pages and specifications modal
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-2 text-xs font-mono">
                    <span className="text-white/40 text-[10px]">Serving Size:</span>
                    <input
                      type="text"
                      value={servingSize}
                      onChange={(e) => setServingSize(e.target.value)}
                      className="bg-[#141414] border border-white/10 rounded-lg px-2.5 py-1 text-white text-xs w-36 font-mono"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleAddNutritionRow}
                    className="px-3 py-1 rounded-xl bg-white/10 hover:bg-white/20 text-white font-mono text-xs flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Nutrient</span>
                  </button>
                </div>
              </div>

              {/* Nutrition Table Editor */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead>
                    <tr className="border-b border-white/10 text-white/40 text-[10px] uppercase">
                      <th className="pb-2.5">Nutritional Element</th>
                      <th className="pb-2.5 w-32">Amount</th>
                      <th className="pb-2.5 w-24">Unit</th>
                      <th className="pb-2.5 w-24">% Daily Value</th>
                      <th className="pb-2.5 text-right w-16">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {nutritionItems.map((item, idx) => (
                      <tr key={idx} className="hover:bg-white/[0.02]">
                        <td className="py-2 pr-3">
                          <input
                            type="text"
                            value={item.key}
                            onChange={(e) => handleUpdateNutritionRow(idx, 'key', e.target.value)}
                            placeholder="Nutrient Name"
                            className="w-full bg-[#141414] border border-white/10 rounded-lg px-2.5 py-1 text-white"
                          />
                        </td>
                        <td className="py-2 pr-3">
                          <input
                            type="text"
                            value={item.amount}
                            onChange={(e) => handleUpdateNutritionRow(idx, 'amount', e.target.value)}
                            placeholder="Amount"
                            className="w-full bg-[#141414] border border-white/10 rounded-lg px-2.5 py-1 text-white"
                          />
                        </td>
                        <td className="py-2 pr-3">
                          <input
                            type="text"
                            value={item.unit}
                            onChange={(e) => handleUpdateNutritionRow(idx, 'unit', e.target.value)}
                            placeholder="Unit (g, mg, kcal)"
                            className="w-full bg-[#141414] border border-white/10 rounded-lg px-2.5 py-1 text-white"
                          />
                        </td>
                        <td className="py-2 pr-3">
                          <input
                            type="text"
                            value={item.dv || ''}
                            onChange={(e) => handleUpdateNutritionRow(idx, 'dv', e.target.value)}
                            placeholder="% DV"
                            className="w-full bg-[#141414] border border-white/10 rounded-lg px-2.5 py-1 text-white/70"
                          />
                        </td>
                        <td className="py-2 text-right">
                          <button
                            type="button"
                            onClick={() => handleRemoveNutritionRow(idx)}
                            className="p-1 rounded text-white/40 hover:text-white hover:bg-white/10 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* ─── Section 6: Pack Configurations & Variants (User Requested: "create new pack") ─── */}
            <div className="p-5 sm:p-6 rounded-2xl bg-[#0d0d0d] border border-white/10 shadow-lg space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                    5. Pack Configurations & Packaging Profiles ({packs.length})
                  </h3>
                  <p className="text-[10px] text-white/40 font-mono mt-0.5">
                    Define pack bundles, SKUs, inventory counts, and price points. Customers select these packs during checkout.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleAddNewPack}
                  className="px-4 py-2 rounded-xl bg-white text-black hover:bg-neutral-200 font-mono text-xs uppercase font-bold flex items-center gap-1.5 cursor-pointer shadow-sm self-start sm:self-auto"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Create New Pack</span>
                </button>
              </div>

              {/* Packs Grid / Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead>
                    <tr className="border-b border-white/10 text-white/40 text-[10px] uppercase">
                      <th className="pb-3">Pack Description / Title</th>
                      <th className="pb-3 w-40">SKU Code</th>
                      <th className="pb-3 w-28">Price (₹)</th>
                      <th className="pb-3 w-28">Compare MRP</th>
                      <th className="pb-3 w-28">Stock (Cans)</th>
                      <th className="pb-3 w-24 text-center">Default</th>
                      <th className="pb-3 w-24 text-center">Active</th>
                      <th className="pb-3 text-right w-16">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {packs.map((pack, idx) => (
                      <tr key={idx} className="hover:bg-white/[0.02]">
                        <td className="py-3 pr-3">
                          <input
                            type="text"
                            required
                            value={pack.name}
                            onChange={(e) => handleUpdatePack(idx, 'name', e.target.value)}
                            placeholder="e.g. 12-Pack Case"
                            className="w-full bg-[#141414] border border-white/10 rounded-lg px-2.5 py-1.5 text-white font-medium"
                          />
                        </td>

                        <td className="py-3 pr-3">
                          <input
                            type="text"
                            required
                            value={pack.sku}
                            onChange={(e) => handleUpdatePack(idx, 'sku', e.target.value)}
                            placeholder="SKU-CODE"
                            className="w-full bg-[#141414] border border-white/10 rounded-lg px-2.5 py-1.5 text-white uppercase"
                          />
                        </td>

                        <td className="py-3 pr-3">
                          <input
                            type="number"
                            required
                            value={pack.price}
                            onChange={(e) => handleUpdatePack(idx, 'price', Number(e.target.value))}
                            placeholder="₹"
                            className="w-full bg-[#141414] border border-white/10 rounded-lg px-2.5 py-1.5 text-white font-bold"
                          />
                        </td>

                        <td className="py-3 pr-3">
                          <input
                            type="number"
                            value={pack.compareAtPrice || ''}
                            onChange={(e) =>
                              handleUpdatePack(idx, 'compareAtPrice', e.target.value ? Number(e.target.value) : null)
                            }
                            placeholder="MRP"
                            className="w-full bg-[#141414] border border-white/10 rounded-lg px-2.5 py-1.5 text-white/60"
                          />
                        </td>

                        <td className="py-3 pr-3">
                          <input
                            type="number"
                            required
                            value={pack.stockQty}
                            onChange={(e) => handleUpdatePack(idx, 'stockQty', Number(e.target.value))}
                            placeholder="Qty"
                            className="w-full bg-[#141414] border border-white/10 rounded-lg px-2.5 py-1.5 text-white"
                          />
                        </td>

                        <td className="py-3 text-center">
                          <input
                            type="radio"
                            name="defaultPackRadio"
                            checked={pack.isDefault}
                            onChange={() => handleUpdatePack(idx, 'isDefault', true)}
                            className="w-4 h-4 text-white focus:ring-0 cursor-pointer"
                            title="Set as Default Pack"
                          />
                        </td>

                        <td className="py-3 text-center">
                          <input
                            type="checkbox"
                            checked={pack.isActive}
                            onChange={(e) => handleUpdatePack(idx, 'isActive', e.target.checked)}
                            className="w-4 h-4 rounded border-white/20 bg-white/10 text-white cursor-pointer"
                            title="Pack Active Status"
                          />
                        </td>

                        <td className="py-3 text-right">
                          <button
                            type="button"
                            onClick={() => handleRemovePack(idx)}
                            className="p-1 rounded text-white/40 hover:text-white hover:bg-white/10 cursor-pointer"
                            title="Remove Pack"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* ─── Section 7: Visual Assets, Media & CDN Upload ─── */}
            <div className="p-5 sm:p-6 rounded-2xl bg-[#0d0d0d] border border-white/10 shadow-lg space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                    6. Product Imagery & Cloudinary CDN Upload
                  </h3>
                  <p className="text-[10px] text-white/40 font-mono mt-0.5">
                    Images are automatically downscaled & compressed to WebP before CDN distribution
                  </p>
                </div>

                {/* Target Slot Selector */}
                <div className="flex items-center gap-1.5 bg-black/60 p-1 rounded-xl border border-white/10 self-start sm:self-auto">
                  <button
                    type="button"
                    onClick={() => setUploadTarget('canImage')}
                    className={`px-3 py-1 rounded-lg text-[10px] font-mono uppercase transition-colors cursor-pointer ${
                      uploadTarget === 'canImage'
                        ? 'bg-white text-black font-bold'
                        : 'text-white/50 hover:text-white'
                    }`}
                  >
                    Can Hero
                  </button>
                  <button
                    type="button"
                    onClick={() => setUploadTarget('image')}
                    className={`px-3 py-1 rounded-lg text-[10px] font-mono uppercase transition-colors cursor-pointer ${
                      uploadTarget === 'image'
                        ? 'bg-white text-black font-bold'
                        : 'text-white/50 hover:text-white'
                    }`}
                  >
                    Secondary
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-start text-xs font-mono">
                {/* Cloudinary Drag & Drop Uploader */}
                <div className="md:col-span-2 space-y-3">
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
                      if (file) handleImageUpload(file, uploadTarget);
                    }}
                    onClick={() => fileInputRef.current?.click()}
                    className={`p-6 rounded-2xl border-2 border-dashed transition-all flex flex-col items-center justify-center text-center cursor-pointer min-h-[160px] ${
                      isDragging
                        ? 'border-white bg-white/10'
                        : isUploading
                        ? 'border-white/30 bg-white/[0.04]'
                        : 'border-white/15 bg-black/40 hover:border-white/30 hover:bg-white/[0.02]'
                    }`}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/png,image/jpeg,image/webp,image/svg+xml"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleImageUpload(file, uploadTarget);
                        e.target.value = '';
                      }}
                    />

                    {isUploading ? (
                      <div className="space-y-2 flex flex-col items-center">
                        <Loader2 className="w-6 h-6 animate-spin text-white" />
                        <span className="text-xs font-bold text-white">Compressing & Uploading to Cloudinary CDN...</span>
                        <span className="text-[10px] text-white/40">Auto-optimizing WebP delivery</span>
                      </div>
                    ) : (
                      <div className="space-y-2 flex flex-col items-center">
                        <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white">
                          <UploadCloud className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-bold text-white">
                            Upload for <span className="text-emerald-400 underline">{uploadTarget === 'canImage' ? 'Can Hero Image' : 'Secondary Image'}</span>
                          </p>
                          <p className="text-[10px] text-white/40 mt-0.5">
                            PNG, JPG, WEBP · Auto-compressed before Cloudinary CDN storage
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Compression Stats Badge */}
                  {compressionStats && (
                    <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-[11px] flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5" />
                        Compressed: {compressionStats.originalSize} → {compressionStats.compressedSize}
                      </span>
                      <span className="font-bold">Saved {compressionStats.savedPercent}%</span>
                    </div>
                  )}

                  {/* Manual URL Inputs */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <label className="text-[10px] text-white/50 uppercase">Can Hero Image URL</label>
                        {canImage.includes('cloudinary.com') && (
                          <span className="text-[9px] text-cyan-400">CDN</span>
                        )}
                      </div>
                      <input
                        type="text"
                        value={canImage}
                        onChange={(e) => setCanImage(e.target.value)}
                        placeholder="https://res.cloudinary.com/..."
                        className="w-full bg-[#141414] border border-white/10 rounded-xl px-3 py-2 text-white text-[11px]"
                      />
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <label className="text-[10px] text-white/50 uppercase">Secondary Image URL</label>
                        {image.includes('cloudinary.com') && (
                          <span className="text-[9px] text-cyan-400">CDN</span>
                        )}
                      </div>
                      <input
                        type="text"
                        value={image}
                        onChange={(e) => setImage(e.target.value)}
                        placeholder="/products/apex.webp"
                        className="w-full bg-[#141414] border border-white/10 rounded-xl px-3 py-2 text-white text-[11px]"
                      />
                    </div>
                  </div>
                </div>

                {/* Thumbnail Preview Box */}
                <div className="p-4 rounded-2xl bg-black/60 border border-white/10 flex flex-col items-center justify-center text-center space-y-3 min-h-[200px]">
                  <span className="text-[10px] text-white/40 uppercase block">Visual Asset Preview</span>
                  <div className="w-24 h-32 relative flex items-center justify-center bg-white/[0.02] border border-white/10 rounded-xl p-2">
                    {canImage ? (
                      <Image
                        src={canImage}
                        alt="Product preview"
                        fill
                        className="object-contain p-1"
                        unoptimized={canImage.startsWith('http')}
                      />
                    ) : (
                      <span className="text-white/20 text-xs">No Asset</span>
                    )}
                  </div>

                  <span className="text-[10px] text-white/50 truncate max-w-full">
                    {canImage.includes('cloudinary.com') ? 'Cloudinary CDN Asset' : 'Local Static Asset'}
                  </span>
                </div>
              </div>
            </div>

            {/* ─── Bottom Sticky Save Actions ─── */}
            <div className="p-4 rounded-2xl bg-[#0d0d0d] border border-white/10 flex items-center justify-between">
              <Link
                href="/root?tab=products"
                className="text-xs font-mono text-white/50 hover:text-white transition-colors"
              >
                Cancel and Return
              </Link>

              <button
                type="submit"
                disabled={isSaving}
                className="px-6 py-2.5 rounded-xl bg-white text-black hover:bg-neutral-200 font-mono text-xs uppercase font-extrabold flex items-center gap-2 cursor-pointer transition-all shadow-md disabled:opacity-50"
              >
                {isSaving ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Saving Product...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-3.5 h-3.5 text-black" />
                    <span>{isNew ? 'Create New Product' : 'Save Changes'}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </form>
    </AdminLayoutShell>
  );
}
