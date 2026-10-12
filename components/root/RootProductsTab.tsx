'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Plus,
  Edit2,
  Trash2,
  RefreshCw,
  Search,
  Package,
  CheckCircle2,
  AlertTriangle,
  X,
  Layers,
  Sparkles,
  DollarSign,
  Tag,
  Boxes,
  UploadCloud,
  ImageIcon,
  Loader2,
  Check,
  ExternalLink,
  Link2,
} from 'lucide-react';
import {
  fetchAdminProducts,
  createAdminProduct,
  updateAdminProduct,
  deleteAdminProduct,
  uploadProductImage,
  AdminProduct,
} from '@/lib/adminApi';

const MONO = "'JetBrains Mono', monospace";

export function RootProductsTab() {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [feedbackMsg, setFeedbackMsg] = useState('');

  // Add / Edit Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<AdminProduct | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Cloudinary Upload States
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccessMessage, setUploadSuccessMessage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [manualUrlMode, setManualUrlMode] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form Fields
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [flavor, setFlavor] = useState('');
  const [tagline, setTagline] = useState('');
  const [volume, setVolume] = useState('250ml');
  const [sugar, setSugar] = useState('0g');
  const [caffeine, setCaffeine] = useState('120mg');
  const [calories, setCalories] = useState('10 kcal');
  const [description, setDescription] = useState('');
  const [story, setStory] = useState('');
  const [canImage, setCanImage] = useState('/products/apex.webp');
  const [primaryTone, setPrimaryTone] = useState('#d8ac52');

  // Description & Additional Information States
  const [netQuantity, setNetQuantity] = useState('250 ml');
  const [isVegetarian, setIsVegetarian] = useState(true);
  const [ingredients, setIngredients] = useState('');
  const [recommendedUsage, setRecommendedUsage] = useState('Consume not more than 500 ml per day.');
  const [directionsForUse, setDirectionsForUse] = useState('Best served chilled.');
  const [storage, setStorage] = useState('Store in a cool and dry place. Avoid direct sunlight.');
  const [disclaimer, setDisclaimer] = useState('Contains caffeine. Not recommended for children, pregnant or lactating women, or persons sensitive to caffeine. Not suitable for persons below 18 years of age. No medicinal or disease claims.');
  const [bestBefore, setBestBefore] = useState('12 months from the date of manufacture');
  const [countryOfOrigin, setCountryOfOrigin] = useState('INDIA');
  const [mfgName, setMfgName] = useState('Patel Beverages Pvt. Ltd.');
  const [mfgAddress, setMfgAddress] = useState('505/2-3-4, G.I.D.C Estate, Makarpura, Vadodara, Gujarat - 3900010');
  const [mfgFssai, setMfgFssai] = useState('10013021000941');
  const [mktName, setMktName] = useState('OXYTRIUM DYNAMICS PRIVATE LIMITED');
  const [mktAddress, setMktAddress] = useState('2nd Floor, House No. 81, Ward No. 12, Manikpur, Keshopur, Rajpur, Buxar, Bihar, India, 802113');
  const [mktFssai, setMktFssai] = useState('10013021000941');

  // Pack Variant Pricing & Stock
  const [p3Price, setP3Price] = useState(449);
  const [p3Stock, setP3Stock] = useState(250);
  const [p6Price, setP6Price] = useState(799);
  const [p6Stock, setP6Stock] = useState(250);
  const [p9Price, setP9Price] = useState(1149);
  const [p9Stock, setP9Stock] = useState(250);
  const [p12Price, setP12Price] = useState(1440);
  const [p12Stock, setP12Stock] = useState(250);

  const handleImageFileUpload = async (file: File) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setUploadError('Please select a valid image file (PNG, JPG, WEBP, SVG)');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setUploadError('Image size exceeds 10MB limit');
      return;
    }

    setIsUploadingImage(true);
    setUploadError(null);
    setUploadSuccessMessage(null);

    try {
      const res = await uploadProductImage(file, 'rebelive/products');
      if (res && (res.secure_url || res.url)) {
        const finalUrl = res.secure_url || res.url;
        setCanImage(finalUrl);
        setUploadSuccessMessage('Uploaded to Cloudinary CDN successfully!');
        setTimeout(() => setUploadSuccessMessage(null), 4000);
      } else {
        throw new Error('Upload returned empty image URL');
      }
    } catch (err: any) {
      console.error('Image upload failed:', err);
      setUploadError(err.response?.data?.message || err.message || 'Failed to upload to Cloudinary');
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageFileUpload(e.dataTransfer.files[0]);
    }
  };

  const loadProducts = async () => {
    setIsLoading(true);
    try {
      const data = await fetchAdminProducts(search || undefined);
      setProducts(data);
    } catch (err) {
      console.error('Error fetching admin products:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const openAddModal = () => {
    setEditingProduct(null);
    setName('');
    setSlug('');
    setFlavor('');
    setTagline('FUNCTIONAL CLEAN ENERGY');
    setVolume('250ml');
    setSugar('0g');
    setCaffeine('120mg');
    setCalories('10 kcal');
    setDescription('');
    setStory('');
    setCanImage('');
    setPrimaryTone('#d8ac52');
    setNetQuantity('250 ml');
    setIsVegetarian(true);
    setIngredients('Carbonated Water, Fructo-oligosaccharides (FOS), Acidity Regulator (INS 345), Acidity Regulator (INS 332(ii)), Acidity Regulator (INS 330), Nature Identical Flavouring Substances, Ashwagandha (KSM-66®), Bacillus clausii, Monk Fruit Extract, L-Theanine, Natural Caffeine Extract, Preservative (INS 211), Vitamin Premix (B6, B9, B12).');
    setRecommendedUsage('Consume not more than 500 ml per day.');
    setDirectionsForUse('Best served chilled.');
    setStorage('Store in a cool and dry place. Avoid direct sunlight.');
    setDisclaimer('Contains caffeine. Not recommended for children, pregnant or lactating women, or persons sensitive to caffeine. Not suitable for persons below 18 years of age. No medicinal or disease claims.');
    setBestBefore('12 months from the date of manufacture');
    setCountryOfOrigin('INDIA');
    setMfgName('Patel Beverages Pvt. Ltd.');
    setMfgAddress('505/2-3-4, G.I.D.C Estate, Makarpura, Vadodara, Gujarat - 3900010');
    setMfgFssai('10013021000941');
    setMktName('OXYTRIUM DYNAMICS PRIVATE LIMITED');
    setMktAddress('2nd Floor, House No. 81, Ward No. 12, Manikpur, Keshopur, Rajpur, Buxar, Bihar, India, 802113');
    setMktFssai('10013021000941');
    setP3Price(449);
    setP3Stock(200);
    setP6Price(799);
    setP6Stock(200);
    setP9Price(1149);
    setP9Stock(200);
    setP12Price(1440);
    setP12Stock(200);
    setUploadError(null);
    setUploadSuccessMessage(null);
    setManualUrlMode(false);
    setIsModalOpen(true);
  };

  const openEditModal = (prod: AdminProduct) => {
    setEditingProduct(prod);
    setName(prod.name);
    setSlug(prod.slug);
    setFlavor(prod.flavor || '');
    setTagline(prod.tagline || '');
    setVolume(prod.volume || '250ml');
    setSugar(prod.sugar || '0g');
    setCaffeine(prod.caffeine || '120mg');
    setCalories(prod.calories || '10 kcal');
    setDescription(prod.description);
    setStory(prod.story || '');
    setCanImage(prod.canImage || prod.image || '');
    setPrimaryTone(prod.primaryTone || '#d8ac52');
    setNetQuantity(prod.netQuantity || '250 ml');
    setIsVegetarian(prod.isVegetarian !== false);
    setIngredients(prod.ingredients || '');

    const addInfo = prod.additionalInfo || {};
    setRecommendedUsage(addInfo.recommendedUsage || 'Consume not more than 500 ml per day.');
    setDirectionsForUse(addInfo.directionsForUse || 'Best served chilled.');
    setStorage(addInfo.storage || 'Store in a cool and dry place. Avoid direct sunlight.');
    setDisclaimer(addInfo.disclaimer || 'Contains caffeine. Not recommended for children, pregnant or lactating women, or persons sensitive to caffeine. Not suitable for persons below 18 years of age. No medicinal or disease claims.');
    setBestBefore(addInfo.bestBefore || '12 months from the date of manufacture');
    setCountryOfOrigin(addInfo.countryOfOrigin || 'INDIA');
    setMfgName(addInfo.manufacturedBy?.name || 'Patel Beverages Pvt. Ltd.');
    setMfgAddress(addInfo.manufacturedBy?.address || '505/2-3-4, G.I.D.C Estate, Makarpura, Vadodara, Gujarat - 3900010');
    setMfgFssai(addInfo.manufacturedBy?.fssaiLicNo || '10013021000941');
    setMktName(addInfo.marketedBy?.name || 'OXYTRIUM DYNAMICS PRIVATE LIMITED');
    setMktAddress(addInfo.marketedBy?.address || '2nd Floor, House No. 81, Ward No. 12, Manikpur, Keshopur, Rajpur, Buxar, Bihar, India, 802113');
    setMktFssai(addInfo.marketedBy?.fssaiLicNo || '10013021000941');

    setUploadError(null);
    setUploadSuccessMessage(null);
    setManualUrlMode(false);

    // Load pack variants if exist
    const v3 = prod.variants.find((v) => v.name.includes('3'));
    const v6 = prod.variants.find((v) => v.name.includes('6'));
    const v9 = prod.variants.find((v) => v.name.includes('9'));
    const v12 = prod.variants.find((v) => v.name.includes('12'));

    if (v3) {
      setP3Price(v3.price);
      setP3Stock(v3.stockQty);
    }
    if (v6) {
      setP6Price(v6.price);
      setP6Stock(v6.stockQty);
    }
    if (v9) {
      setP9Price(v9.price);
      setP9Stock(v9.stockQty);
    }
    if (v12) {
      setP12Price(v12.price);
      setP12Stock(v12.stockQty);
    }

    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSubmitting(true);
    try {
      const variantsPayload = [
        { packSize: 3, name: `${name} · 3-Pack`, price: p3Price, stockQty: p3Stock, isDefault: false },
        { packSize: 6, name: `${name} · 6-Pack`, price: p6Price, stockQty: p6Stock, isDefault: false },
        { packSize: 9, name: `${name} · 9-Pack`, price: p9Price, stockQty: p9Stock, isDefault: false },
        { packSize: 12, name: `${name} · 12-Pack`, price: p12Price, stockQty: p12Stock, isDefault: true },
      ];

      const additionalInfoPayload = {
        recommendedUsage: recommendedUsage.trim(),
        directionsForUse: directionsForUse.trim(),
        storage: storage.trim(),
        disclaimer: disclaimer.trim(),
        bestBefore: bestBefore.trim(),
        countryOfOrigin: countryOfOrigin.trim(),
        manufacturedBy: {
          name: mfgName.trim(),
          address: mfgAddress.trim(),
          fssaiLicNo: mfgFssai.trim(),
        },
        marketedBy: {
          name: mktName.trim(),
          address: mktAddress.trim(),
          fssaiLicNo: mktFssai.trim(),
        },
      };

      const payload = {
        name: name.trim(),
        slug: slug.trim() || name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        displayTitle: name.trim(),
        flavor: flavor.trim() || name.trim(),
        tagline: tagline.trim(),
        volume: volume.trim(),
        sugar: sugar.trim(),
        caffeine: caffeine.trim(),
        calories: calories.trim(),
        description: description.trim() || `${name} Functional Clean Beverage with plant nootropics.`,
        story: story.trim(),
        canImage,
        image: canImage,
        primaryTone,
        accentHex: primaryTone,
        netQuantity: netQuantity.trim(),
        isVegetarian,
        ingredients: ingredients.trim(),
        additionalInfo: additionalInfoPayload,
        nutritionInfo: editingProduct?.nutritionInfo || undefined,
        variants: variantsPayload,
      };

      if (editingProduct) {
        await updateAdminProduct(editingProduct.id, payload);
        setFeedbackMsg(`Product "${name}" updated successfully`);
      } else {
        await createAdminProduct(payload);
        setFeedbackMsg(`New product "${name}" created with 4 pack variants`);
      }

      setIsModalOpen(false);
      loadProducts();
      setTimeout(() => setFeedbackMsg(''), 4000);
    } catch (err: any) {
      alert(err.message || 'Error saving product');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteProduct = async (prodId: string, prodName: string) => {
    if (!confirm(`Are you sure you want to deactivate product "${prodName}"?`)) return;
    try {
      await deleteAdminProduct(prodId);
      setFeedbackMsg(`Product "${prodName}" deactivated`);
      loadProducts();
      setTimeout(() => setFeedbackMsg(''), 4000);
    } catch (err: any) {
      alert(err.message || 'Error deleting product');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Header & Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold uppercase tracking-wider text-white">
            PRODUCT CATALOG & INVENTORY CRUD
          </h2>
          <p className="text-xs text-white/50 font-mono">
            Manage formulations, pack sizes, retail pricing, and warehouse stock
          </p>
        </div>

        <Link
          href="/root/products/new"
          className="px-4 py-2.5 rounded-xl bg-white text-black hover:bg-neutral-200 font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_20px_rgba(255,255,255,0.25)] shrink-0"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Add New Product</span>
        </Link>
      </div>

      {/* Feedback Banner */}
      {feedbackMsg && (
        <div className="p-3.5 rounded-xl bg-white/10 border border-white/20 text-white text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-white" />
          <span>{feedbackMsg}</span>
        </div>
      )}

      {/* Products Grid / Table */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {isLoading ? (
          <div className="col-span-full py-16 text-center text-white/40 font-mono space-y-2">
            <RefreshCw className="w-6 h-6 animate-spin mx-auto text-white/30" />
            <p>Loading catalog items...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="col-span-full py-16 text-center text-white/40 font-mono">
            <Package className="w-8 h-8 mx-auto mb-2 opacity-30" />
            <p>No products found in catalog.</p>
          </div>
        ) : (
          products.map((prod) => {
            const totalStock = prod.variants.reduce((acc, v) => acc + (v.stockQty || 0), 0);
            return (
              <div
                key={prod.id}
                className="p-5 rounded-2xl bg-[#0f0f0f] border border-white/10 hover:border-white/20 transition-all space-y-4 shadow-[0_0_30px_rgba(0,0,0,0.6)]"
              >
                {/* Product Header */}
                <div className="flex items-start gap-4">
                  <div className="w-16 h-20 relative shrink-0 bg-white/[0.02] border border-white/10 rounded-xl flex items-center justify-center p-1 overflow-hidden">
                    {(() => {
                      const displayImg = prod.canImage || prod.image;
                      if (displayImg) {
                        return (
                          <Image
                            src={displayImg}
                            alt={prod.name}
                            fill
                            className="object-contain p-1"
                            unoptimized={displayImg.startsWith('http')}
                          />
                        );
                      }
                      return (
                        <div className="flex flex-col items-center justify-center text-center">
                          <span className="font-bold text-[8px] font-mono text-white/50">{prod.name.slice(0, 4)}</span>
                          <span className="text-[6.5px] font-mono text-white/30 uppercase mt-0.5">No Img</span>
                        </div>
                      );
                    })()}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/root/products/${prod.id}`}
                        className="font-extrabold text-base uppercase text-white hover:underline truncate"
                      >
                        {prod.name}
                      </Link>
                      <span
                        className={`px-2 py-0.2 rounded-full font-mono text-[9px] font-bold uppercase ${
                          prod.isActive
                            ? 'bg-white text-black border border-white'
                            : 'bg-white/10 text-white/50 border border-white/20'
                        }`}
                      >
                        {prod.isActive ? 'Active' : 'Archived'}
                      </span>
                    </div>

                    <p className="text-xs text-white/60 font-mono mt-0.5 truncate">
                      {prod.flavor || 'Signature Clean Fuel'} · {prod.volume || '250ml'}
                    </p>
                    <p className="text-[11px] text-white/40 mt-1 line-clamp-2">
                      {prod.description}
                    </p>
                  </div>
                </div>

                {/* Variants & Stock Matrix */}
                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 space-y-2 text-xs">
                  <div className="flex items-center justify-between text-[10px] font-mono text-white/40 uppercase">
                    <span>Pack Configurations</span>
                    <span>Total Stock: <strong className="text-white">{totalStock} Cans</strong></span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center font-mono text-xs">
                    {prod.variants.map((v) => (
                      <div key={v.id} className="p-2 rounded-lg bg-black/40 border border-white/10">
                        <span className="text-[10px] text-white/50 block truncate">
                          {v.name.split('·')[1]?.trim() || v.name}
                        </span>
                        <span className="font-bold text-white block mt-0.5">₹{v.price}</span>
                        <span className="text-[9px] text-white/60 block">{v.stockQty} in stock</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-2 flex items-center justify-end gap-2 border-t border-white/10">
                  <Link
                    href={`/root/products/${prod.id}`}
                    className="px-3.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-white text-xs font-mono uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Edit2 className="w-3 h-3 text-white" />
                    <span>Edit</span>
                  </Link>

                  <button
                    onClick={() => handleDeleteProduct(prod.id, prod.name)}
                    className="px-3.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white text-xs font-mono uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Deactivate</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* ── Modal: Add / Edit Product ── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-2xl bg-[#0e0e0e] border border-white/15 rounded-3xl p-6 sm:p-7 text-white max-h-[90vh] overflow-y-auto space-y-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div>
                <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest block">
                  {editingProduct ? 'EDIT PRODUCT SPECIFICATION' : 'NEW PRODUCT FORMULATION'}
                </span>
                <h3 className="text-lg font-bold font-mono uppercase text-white">
                  {editingProduct ? editingProduct.name : 'Create Catalog Product'}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
              {/* Product Basic */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-white/50 uppercase">Product Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. APEX Zero Sugar"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-white/[0.04] border border-white/15 rounded-xl px-3 py-2 text-white placeholder-white/30 focus:outline-none focus:border-white/40"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-white/50 uppercase">Slug Identifier</label>
                  <input
                    type="text"
                    placeholder="e.g. apex"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    className="w-full bg-white/[0.04] border border-white/15 rounded-xl px-3 py-2 text-white placeholder-white/30 focus:outline-none focus:border-white/40 font-mono"
                  />
                </div>
              </div>

              {/* Flavor & Tagline */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-white/50 uppercase">Flavor Profile</label>
                  <input
                    type="text"
                    placeholder="e.g. Crisp Yuzu Citrus"
                    value={flavor}
                    onChange={(e) => setFlavor(e.target.value)}
                    className="w-full bg-white/[0.04] border border-white/15 rounded-xl px-3 py-2 text-white placeholder-white/30 focus:outline-none focus:border-white/40"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-white/50 uppercase">Tagline</label>
                  <input
                    type="text"
                    placeholder="e.g. FUNCTIONAL CLEAN ENERGY"
                    value={tagline}
                    onChange={(e) => setTagline(e.target.value)}
                    className="w-full bg-white/[0.04] border border-white/15 rounded-xl px-3 py-2 text-white placeholder-white/30 focus:outline-none focus:border-white/40"
                  />
                </div>
              </div>

              {/* Product Visual & Cloudinary Image Upload Section */}
              <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <UploadCloud className="w-4 h-4 text-white" />
                    <span className="text-[10px] font-mono text-white/80 uppercase tracking-wider font-bold">
                      PRODUCT IMAGE UPLOAD (CLOUDINARY CDN)
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setManualUrlMode(!manualUrlMode)}
                    className="text-[10px] font-mono text-white/40 hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <Link2 className="w-3 h-3" />
                    <span>{manualUrlMode ? 'Hide URL input' : 'Edit URL directly'}</span>
                  </button>
                </div>

                {/* Upload Zone & Preview Split */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-stretch">
                  {/* Drag and Drop Uploader */}
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`sm:col-span-2 p-4 rounded-xl border-2 border-dashed transition-all flex flex-col items-center justify-center text-center cursor-pointer min-h-[120px] ${
                      isDragging
                        ? 'border-white bg-white/10'
                        : isUploadingImage
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
                        if (file) handleImageFileUpload(file);
                        e.target.value = '';
                      }}
                    />

                    {isUploadingImage ? (
                      <div className="space-y-2 flex flex-col items-center">
                        <Loader2 className="w-6 h-6 animate-spin text-white" />
                        <span className="font-mono text-xs text-white/80 font-bold">
                          Uploading to Cloudinary...
                        </span>
                        <span className="font-mono text-[10px] text-white/40">
                          Auto-optimizing resolution & converting format
                        </span>
                      </div>
                    ) : (
                      <div className="space-y-1.5 flex flex-col items-center">
                        <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/60">
                          <UploadCloud className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-xs text-white font-medium">
                            Drag & drop can render, or <span className="text-white underline font-bold">browse</span>
                          </p>
                          <p className="text-[10px] font-mono text-white/40 mt-0.5">
                            PNG, JPG, WEBP, SVG · Up to 10MB
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Thumbnail Preview Box */}
                  <div className="p-3 rounded-xl bg-black/60 border border-white/10 flex flex-col items-center justify-center relative group min-h-[120px]">
                    {canImage ? (
                      <>
                        <div className="w-16 h-20 relative flex items-center justify-center">
                          <Image
                            src={canImage}
                            alt="Can Preview"
                            fill
                            className="object-contain"
                            unoptimized={canImage.startsWith('http')}
                          />
                        </div>
                        <div className="mt-2 text-center w-full flex items-center justify-center gap-1.5 flex-wrap">
                          <span className="inline-block px-1.5 py-0.5 rounded text-[8px] font-mono uppercase font-bold tracking-wider bg-white/10 text-white/70 border border-white/20">
                            {canImage.includes('cloudinary.com') ? 'Cloudinary CDN' : 'Custom Asset'}
                          </span>
                          <button
                            type="button"
                            onClick={() => setCanImage('')}
                            className="px-1.5 py-0.5 rounded text-[8px] font-mono uppercase font-bold text-red-400 bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 cursor-pointer"
                          >
                            Remove
                          </button>
                        </div>
                        {canImage.startsWith('http') && (
                          <a
                            href={canImage}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="absolute top-2 right-2 p-1 rounded bg-black/70 text-white/50 hover:text-white border border-white/10"
                            title="Open full resolution in new tab"
                          >
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </>
                    ) : (
                      <div className="text-center text-white/30 space-y-1">
                        <ImageIcon className="w-6 h-6 mx-auto opacity-30" />
                        <span className="text-[10px] font-mono block">No image</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Upload Status / Error Feedback */}
                {uploadSuccessMessage && (
                  <div className="p-2 rounded-lg bg-white/10 border border-white/20 text-white text-[11px] font-mono flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-white shrink-0" />
                    <span>{uploadSuccessMessage}</span>
                  </div>
                )}
                {uploadError && (
                  <div className="p-2 rounded-lg bg-white/10 border border-white/20 text-white text-[11px] font-mono flex items-center gap-2">
                    <AlertTriangle className="w-3.5 h-3.5 text-white/70 shrink-0" />
                    <span>{uploadError}</span>
                  </div>
                )}

                {/* Manual URL input fallback */}
                {manualUrlMode && (
                  <div className="space-y-1 pt-1 border-t border-white/5">
                    <label className="text-[10px] font-mono text-white/40 uppercase">Direct Image URL / Path</label>
                    <input
                      type="text"
                      value={canImage}
                      onChange={(e) => setCanImage(e.target.value)}
                      placeholder="https://res.cloudinary.com/... or /products/apex.webp"
                      className="w-full bg-black/60 border border-white/15 rounded-lg px-3 py-1.5 text-white placeholder-white/30 font-mono text-xs focus:outline-none focus:border-white/40"
                    />
                  </div>
                )}
              </div>

              {/* Description */}
              <div className="space-y-1">
                <label className="text-[10px] font-mono text-white/50 uppercase">Description</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Functional beverage description..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-white/[0.04] border border-white/15 rounded-xl px-3 py-2 text-white placeholder-white/30 focus:outline-none focus:border-white/40"
                />
              </div>

              {/* Pack Variant Pricing & Warehouse Stocks */}
              <div className="space-y-2 pt-2 border-t border-white/10">
                <span className="text-[10px] font-mono text-white/50 uppercase tracking-widest block">
                  PACK CONFIGURATION PRICING & STOCK ALLOCATION
                </span>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {/* 3-Pack */}
                  <div className="p-3 rounded-xl bg-white/[0.02] border border-white/10 space-y-1.5">
                    <span className="font-bold font-mono text-[11px] text-white block">3-PACK</span>
                    <input
                      type="number"
                      placeholder="Price ₹"
                      value={p3Price}
                      onChange={(e) => setP3Price(Number(e.target.value))}
                      className="w-full bg-black/50 border border-white/10 rounded-lg px-2.5 py-1 text-white font-mono text-xs"
                    />
                    <input
                      type="number"
                      placeholder="Stock"
                      value={p3Stock}
                      onChange={(e) => setP3Stock(Number(e.target.value))}
                      className="w-full bg-black/50 border border-white/10 rounded-lg px-2.5 py-1 text-white font-mono text-xs"
                    />
                  </div>

                  {/* 6-Pack */}
                  <div className="p-3 rounded-xl bg-white/[0.02] border border-white/10 space-y-1.5">
                    <span className="font-bold font-mono text-[11px] text-white block">6-PACK</span>
                    <input
                      type="number"
                      placeholder="Price ₹"
                      value={p6Price}
                      onChange={(e) => setP6Price(Number(e.target.value))}
                      className="w-full bg-black/50 border border-white/10 rounded-lg px-2.5 py-1 text-white font-mono text-xs"
                    />
                    <input
                      type="number"
                      placeholder="Stock"
                      value={p6Stock}
                      onChange={(e) => setP6Stock(Number(e.target.value))}
                      className="w-full bg-black/50 border border-white/10 rounded-lg px-2.5 py-1 text-white font-mono text-xs"
                    />
                  </div>

                  {/* 9-Pack */}
                  <div className="p-3 rounded-xl bg-white/[0.02] border border-white/10 space-y-1.5">
                    <span className="font-bold font-mono text-[11px] text-white block">9-PACK</span>
                    <input
                      type="number"
                      placeholder="Price ₹"
                      value={p9Price}
                      onChange={(e) => setP9Price(Number(e.target.value))}
                      className="w-full bg-black/50 border border-white/10 rounded-lg px-2.5 py-1 text-white font-mono text-xs"
                    />
                    <input
                      type="number"
                      placeholder="Stock"
                      value={p9Stock}
                      onChange={(e) => setP9Stock(Number(e.target.value))}
                      className="w-full bg-black/50 border border-white/10 rounded-lg px-2.5 py-1 text-white font-mono text-xs"
                    />
                  </div>

                  {/* 12-Pack */}
                  <div className="p-3 rounded-xl bg-white/[0.02] border border-white/10 space-y-1.5">
                    <span className="font-bold font-mono text-[11px] text-white block">12-PACK (STD)</span>
                    <input
                      type="number"
                      placeholder="Price ₹"
                      value={p12Price}
                      onChange={(e) => setP12Price(Number(e.target.value))}
                      className="w-full bg-black/50 border border-white/10 rounded-lg px-2.5 py-1 text-white font-mono text-xs"
                    />
                    <input
                      type="number"
                      placeholder="Stock"
                      value={p12Stock}
                      onChange={(e) => setP12Stock(Number(e.target.value))}
                      className="w-full bg-black/50 border border-white/10 rounded-lg px-2.5 py-1 text-white font-mono text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* ── Formula, Net Quantity & Ingredients ── */}
              <div className="space-y-3 pt-3 border-t border-white/10">
                <span className="text-[10px] font-mono text-white/50 uppercase tracking-widest block">
                  FORMULA, NET QUANTITY & INGREDIENTS
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-white/50 uppercase">Net Quantity</label>
                    <input
                      type="text"
                      placeholder="e.g. 250 ml"
                      value={netQuantity}
                      onChange={(e) => setNetQuantity(e.target.value)}
                      className="w-full bg-white/[0.04] border border-white/15 rounded-xl px-3 py-2 text-white font-mono text-xs focus:outline-none focus:border-white/40"
                    />
                  </div>

                  <div className="flex items-center gap-3 pt-4 sm:pt-6">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={isVegetarian}
                        onChange={(e) => setIsVegetarian(e.target.checked)}
                        className="w-4 h-4 rounded border-white/20 bg-white/10 text-white focus:ring-white cursor-pointer"
                      />
                      <span className="text-xs font-mono text-white/80">100% Vegetarian Formula</span>
                    </label>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-white/50 uppercase">Ingredients List</label>
                  <textarea
                    rows={2}
                    placeholder="Full ingredient breakdown..."
                    value={ingredients}
                    onChange={(e) => setIngredients(e.target.value)}
                    className="w-full bg-white/[0.04] border border-white/15 rounded-xl px-3 py-2 text-white placeholder-white/30 text-xs focus:outline-none focus:border-white/40 font-mono"
                  />
                </div>
              </div>

              {/* ── Additional Information (Regulatory, Usage, Manufacturers) ── */}
              <div className="space-y-3 pt-3 border-t border-white/10">
                <span className="text-[10px] font-mono text-white/50 uppercase tracking-widest block">
                  USAGE, REGULATORY & ADDITIONAL INFORMATION
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-white/50 uppercase">Recommended Usage</label>
                    <input
                      type="text"
                      placeholder="e.g. Consume not more than 500 ml per day."
                      value={recommendedUsage}
                      onChange={(e) => setRecommendedUsage(e.target.value)}
                      className="w-full bg-white/[0.04] border border-white/15 rounded-xl px-3 py-1.5 text-white font-mono text-xs focus:outline-none focus:border-white/40"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-white/50 uppercase">Directions For Use</label>
                    <input
                      type="text"
                      placeholder="e.g. Best served chilled."
                      value={directionsForUse}
                      onChange={(e) => setDirectionsForUse(e.target.value)}
                      className="w-full bg-white/[0.04] border border-white/15 rounded-xl px-3 py-1.5 text-white font-mono text-xs focus:outline-none focus:border-white/40"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-white/50 uppercase">Storage Instructions</label>
                    <input
                      type="text"
                      placeholder="e.g. Store in a cool and dry place."
                      value={storage}
                      onChange={(e) => setStorage(e.target.value)}
                      className="w-full bg-white/[0.04] border border-white/15 rounded-xl px-3 py-1.5 text-white font-mono text-xs focus:outline-none focus:border-white/40"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-white/50 uppercase">Best Before</label>
                    <input
                      type="text"
                      placeholder="e.g. 12 months from date of manufacture"
                      value={bestBefore}
                      onChange={(e) => setBestBefore(e.target.value)}
                      className="w-full bg-white/[0.04] border border-white/15 rounded-xl px-3 py-1.5 text-white font-mono text-xs focus:outline-none focus:border-white/40"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-white/50 uppercase">Safety Disclaimer</label>
                  <textarea
                    rows={2}
                    placeholder="e.g. Contains caffeine. Not recommended for children..."
                    value={disclaimer}
                    onChange={(e) => setDisclaimer(e.target.value)}
                    className="w-full bg-white/[0.04] border border-white/15 rounded-xl px-3 py-1.5 text-white font-mono text-xs focus:outline-none focus:border-white/40"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-white/50 uppercase">Country of Origin</label>
                  <input
                    type="text"
                    placeholder="e.g. INDIA"
                    value={countryOfOrigin}
                    onChange={(e) => setCountryOfOrigin(e.target.value)}
                    className="w-full bg-white/[0.04] border border-white/15 rounded-xl px-3 py-1.5 text-white font-mono text-xs focus:outline-none focus:border-white/40"
                  />
                </div>

                {/* Manufactured By */}
                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/10 space-y-2">
                  <span className="text-[9.5px] font-mono text-white/60 uppercase font-bold block">
                    MANUFACTURED BY DETAILS
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Manufacturer Name"
                      value={mfgName}
                      onChange={(e) => setMfgName(e.target.value)}
                      className="w-full bg-black/50 border border-white/10 rounded-lg px-2.5 py-1 text-white font-mono text-xs"
                    />
                    <input
                      type="text"
                      placeholder="Manufacturer FSSAI Lic. No."
                      value={mfgFssai}
                      onChange={(e) => setMfgFssai(e.target.value)}
                      className="w-full bg-black/50 border border-white/10 rounded-lg px-2.5 py-1 text-white font-mono text-xs"
                    />
                  </div>
                  <input
                    type="text"
                    placeholder="Manufacturer Factory Address"
                    value={mfgAddress}
                    onChange={(e) => setMfgAddress(e.target.value)}
                    className="w-full bg-black/50 border border-white/10 rounded-lg px-2.5 py-1 text-white font-mono text-xs"
                  />
                </div>

                {/* Marketed By */}
                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/10 space-y-2">
                  <span className="text-[9.5px] font-mono text-white/60 uppercase font-bold block">
                    MARKETED BY DETAILS
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Marketer Name"
                      value={mktName}
                      onChange={(e) => setMktName(e.target.value)}
                      className="w-full bg-black/50 border border-white/10 rounded-lg px-2.5 py-1 text-white font-mono text-xs"
                    />
                    <input
                      type="text"
                      placeholder="Marketer FSSAI Lic. No."
                      value={mktFssai}
                      onChange={(e) => setMktFssai(e.target.value)}
                      className="w-full bg-black/50 border border-white/10 rounded-lg px-2.5 py-1 text-white font-mono text-xs"
                    />
                  </div>
                  <input
                    type="text"
                    placeholder="Marketer Office Address"
                    value={mktAddress}
                    onChange={(e) => setMktAddress(e.target.value)}
                    className="w-full bg-black/50 border border-white/10 rounded-lg px-2.5 py-1 text-white font-mono text-xs"
                  />
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-3 flex items-center justify-end gap-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white font-mono uppercase text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-xl bg-white text-black hover:bg-neutral-200 font-bold font-mono uppercase text-xs cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? 'Saving Specification...' : editingProduct ? 'Update Product' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
