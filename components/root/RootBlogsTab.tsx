'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  BookOpen,
  Plus,
  Search,
  Edit2,
  Trash2,
  Eye,
  Sparkles,
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  X,
  ExternalLink,
  Loader2,
  Calendar,
  User as UserIcon,
  Tag as TagIcon,
  Clock,
  FileText,
  Heading1,
  Heading2,
  Heading3,
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Code as CodeIcon,
  Quote,
  List,
  ListOrdered,
  Image as ImageIcon,
  Link as LinkIcon,
  Check,
  Globe,
  Star,
  RefreshCw,
  FolderOpen,
  Layers,
  EyeOff,
  SlidersHorizontal,
} from 'lucide-react';
import {
  fetchAdminBlogs,
  createAdminBlog,
  updateAdminBlog,
  deleteAdminBlog,
  uploadBlogImage,
  getStoredAdminUser,
  AdminBlog,
  AdminBlogCounts,
  AdminUser,
} from '@/lib/adminApi';
import { compressImage, formatFileSize } from '@/lib/imageCompression';
import { showAdminToast } from './AdminToaster';

const MONO = "'JetBrains Mono', monospace";
const SANS = "'Poppins', sans-serif";

const CATEGORY_PRESETS = [
  'Bio-Energy & Science',
  'Hydration & Performance',
  'Optimization & Sleep',
  'Brand Story & Culture',
  'Nutrition & Ingredients',
  'Rebel Mindset',
];

export function RootBlogsTab() {
  const [blogs, setBlogs] = useState<AdminBlog[]>([]);
  const [counts, setCounts] = useState<AdminBlogCounts>({ total: 0, published: 0, drafts: 0 });
  const [currentAdmin, setCurrentAdmin] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PUBLISHED' | 'DRAFT'>('ALL');
  const [categoryFilter, setCategoryFilter] = useState('ALL');

  // Modal & Editor state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState<AdminBlog | null>(null);
  const [activeModalTab, setActiveModalTab] = useState<'editor' | 'preview' | 'seo'>('editor');
  const [editorMode, setEditorMode] = useState<'visual' | 'code'>('visual');

  // Form Fields
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [isSlugManual, setIsSlugManual] = useState(false);
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [author, setAuthor] = useState('Rebelive Editorial');
  const [authorRole, setAuthorRole] = useState('Editorial Team');
  const [category, setCategory] = useState(CATEGORY_PRESETS[0]);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [readTime, setReadTime] = useState('4 min read');
  const [isPublished, setIsPublished] = useState(true);
  const [featured, setFeatured] = useState(false);
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDesc, setMetaDesc] = useState('');

  // Upload state
  const coverFileInputRef = useRef<HTMLInputElement | null>(null);
  const inlineImageInputRef = useRef<HTMLInputElement | null>(null);
  const visualEditorRef = useRef<HTMLDivElement | null>(null);
  const [isCoverUploading, setIsCoverUploading] = useState(false);
  const [isInlineUploading, setIsInlineUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Link Dialog
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [linkText, setLinkText] = useState('');

  // Image URL Dialog
  const [showImageUrlModal, setShowImageUrlModal] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [imageAlt, setImageAlt] = useState('');
  const [imageCaption, setImageCaption] = useState('');

  useEffect(() => {
    setCurrentAdmin(getStoredAdminUser());
    loadBlogs();
  }, [statusFilter, categoryFilter]);

  const loadBlogs = async () => {
    setIsLoading(true);
    try {
      const res = await fetchAdminBlogs({
        search: searchQuery.trim() || undefined,
        status: statusFilter,
        category: categoryFilter !== 'ALL' ? categoryFilter : undefined,
      });
      setBlogs(res.blogs);
      setCounts(res.counts);
    } catch (err: any) {
      console.error('Failed to load blogs:', err);
      showAdminToast(err.message || 'Failed to load blogs', 'error', 'Error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadBlogs();
  };

  // Auto-generate slug from title if not manually modified
  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!isSlugManual && (!editingBlog || slug === generateSlug(editingBlog.title))) {
      setSlug(generateSlug(val));
    }
    // Auto-fill meta title if empty
    if (!metaTitle || metaTitle === title) {
      setMetaTitle(val ? `${val} | REBELIVE` : '');
    }
  };

  const generateSlug = (str: string): string => {
    return str
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-')
      .slice(0, 100);
  };

  // Auto-calculate read time based on word count
  const calculateReadTime = (text: string) => {
    const cleanText = text.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
    const words = cleanText ? cleanText.split(' ').length : 0;
    const minutes = Math.max(1, Math.ceil(words / 200));
    return `${minutes} min read`;
  };

  const handleOpenNewModal = () => {
    setEditingBlog(null);
    setTitle('');
    setSlug('');
    setIsSlugManual(false);
    setExcerpt('');
    setContent(`
<h2>The New Frontier of Bio-Performance</h2>
<p>In high-intensity environments, mental clarity is the ultimate competitive advantage. Write your introduction here to captivate readers...</p>

<div class="my-6 rounded-xl border border-white/20 bg-white/[0.04] p-5">
  <p class="text-white/90 italic font-mono text-sm leading-relaxed">
    "Focus is not something you hope for; it is something you formulate."
  </p>
</div>

<h3>Key Insights & Biological Co-Factors</h3>
<p>Break down the formulation or scientific mechanism in detail. Use bullet points and headers to organize your thoughts.</p>
<ul>
  <li><strong>Cognitive Velocity:</strong> How clean methylxanthines interact with adenosine receptors.</li>
  <li><strong>Zero Sugar Precision:</strong> Eliminating systemic insulin spikes.</li>
  <li><strong>Ionic Hydration:</strong> Osmotic balance at cellular membranes.</li>
</ul>
    `.trim());
    setCoverImage('/brand/APEX.webp');
    setAuthor(currentAdmin ? `${currentAdmin.firstName || 'Rebelive'} ${currentAdmin.lastName || 'Editorial'}`.trim() : 'Rebelive Editorial');
    setAuthorRole('Editorial Team');
    setCategory(CATEGORY_PRESETS[0]);
    setTags(['Bio-Energy', 'Performance']);
    setTagInput('');
    setReadTime('4 min read');
    setIsPublished(true);
    setFeatured(false);
    setMetaTitle('');
    setMetaDesc('');
    setActiveModalTab('editor');
    setEditorMode('visual');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (blog: AdminBlog) => {
    setEditingBlog(blog);
    setTitle(blog.title);
    setSlug(blog.slug);
    setIsSlugManual(true);
    setExcerpt(blog.excerpt || '');
    setContent(blog.content || '');
    setCoverImage(blog.coverImage || '');
    setAuthor(blog.author || 'Rebelive Editorial');
    setAuthorRole(blog.authorRole || 'Editorial Team');
    setCategory(blog.category || CATEGORY_PRESETS[0]);
    setTags(Array.isArray(blog.tags) ? blog.tags : []);
    setTagInput('');
    setReadTime(blog.readTime || '4 min read');
    setIsPublished(blog.isPublished);
    setFeatured(blog.featured || false);
    setMetaTitle(blog.metaTitle || '');
    setMetaDesc(blog.metaDesc || '');
    setActiveModalTab('editor');
    setEditorMode('visual');
    setIsModalOpen(true);
  };

  // Cover image upload
  const handleCoverUpload = async (file: File) => {
    setIsCoverUploading(true);
    try {
      const compressed = await compressImage(file, { maxWidth: 1800, quality: 0.88 });
      const res = await uploadBlogImage(compressed.file);
      setCoverImage(res.url);
      showAdminToast('Cover image uploaded successfully to Cloudinary.', 'success', 'Image Uploaded');
    } catch (err: any) {
      console.error('Failed to upload cover image:', err);
      showAdminToast(err.message || 'Image upload failed', 'error', 'Upload Error');
    } finally {
      setIsCoverUploading(false);
    }
  };

  // Inline rich text image upload & insertion
  const handleInlineImageUpload = async (file: File) => {
    setIsInlineUploading(true);
    try {
      const compressed = await compressImage(file, { maxWidth: 1600, quality: 0.85 });
      const res = await uploadBlogImage(compressed.file);
      const imgHtml = `\n<figure class="my-6">\n  <img src="${res.url}" alt="${file.name.replace(/\.[^.]+$/, '')}" class="w-full rounded-2xl border border-white/10 shadow-2xl" />\n  <figcaption class="text-xs font-mono text-center text-white/50 mt-2">REBELIVE Scientific & Brand Archives</figcaption>\n</figure>\n`;
      insertTextAtCursor(imgHtml);
      showAdminToast('Image uploaded and inserted into article!', 'success', 'Image Inserted');
    } catch (err: any) {
      console.error('Failed to upload inline image:', err);
      showAdminToast(err.message || 'Failed to upload image', 'error', 'Upload Error');
    } finally {
      setIsInlineUploading(false);
    }
  };

  // Insert HTML into content
  const insertTextAtCursor = (htmlToInsert: string) => {
    if (editorMode === 'visual' && visualEditorRef.current) {
      visualEditorRef.current.focus();
      document.execCommand('insertHTML', false, htmlToInsert);
      setContent(visualEditorRef.current.innerHTML);
    } else {
      setContent((prev) => prev + '\n' + htmlToInsert);
    }
    setReadTime(calculateReadTime(content + htmlToInsert));
  };

  // Rich Text Action Handlers
  const executeVisualCommand = (command: string, value: string | undefined = undefined) => {
    if (editorMode !== 'visual') return;
    if (visualEditorRef.current) {
      visualEditorRef.current.focus();
    }
    document.execCommand(command, false, value);
    if (visualEditorRef.current) {
      setContent(visualEditorRef.current.innerHTML);
      setReadTime(calculateReadTime(visualEditorRef.current.innerHTML));
    }
  };

  const handleHeadingSelect = (tag: 'h1' | 'h2' | 'h3' | 'p') => {
    if (editorMode === 'visual') {
      executeVisualCommand('formatBlock', `<${tag}>`);
    } else {
      insertTextAtCursor(`\n<${tag}>Your Heading Here</${tag}>\n`);
    }
  };

  const handleInsertCallout = () => {
    const calloutHtml = `
<div class="my-6 rounded-xl border border-white/20 bg-white/[0.04] p-5">
  <p class="text-white/90 italic font-mono text-sm leading-relaxed">
    "Key formulation takeaway or quote goes here..."
  </p>
  <span class="block text-xs font-mono text-white/50 mt-2">— REBELIVE Journal</span>
</div>
    `.trim();
    insertTextAtCursor(`\n${calloutHtml}\n`);
  };

  const handleInsertLink = () => {
    if (!linkUrl) return;
    const url = linkUrl.startsWith('http') || linkUrl.startsWith('/') ? linkUrl : `https://${linkUrl}`;
    const text = linkText || url;
    const linkHtml = `<a href="${url}" target="_blank" rel="noopener noreferrer" class="text-white font-medium underline underline-offset-4 hover:text-white/80 transition-colors">${text}</a>`;
    insertTextAtCursor(linkHtml);
    setLinkUrl('');
    setLinkText('');
    setShowLinkModal(false);
  };

  const handleInsertImageUrl = () => {
    if (!imageUrl) return;
    const alt = imageAlt || 'Rebelive Article Image';
    const caption = imageCaption
      ? `<figcaption class="text-xs font-mono text-center text-white/50 mt-2">${imageCaption}</figcaption>`
      : '';
    const imgHtml = `
<figure class="my-6">
  <img src="${imageUrl}" alt="${alt}" class="w-full rounded-2xl border border-white/10 shadow-2xl" />
  ${caption}
</figure>
    `.trim();
    insertTextAtCursor(`\n${imgHtml}\n`);
    setImageUrl('');
    setImageAlt('');
    setImageCaption('');
    setShowImageUrlModal(false);
  };

  // Tag management
  const handleAddTag = () => {
    const clean = tagInput.trim().replace(/^#/, '');
    if (clean && !tags.includes(clean)) {
      setTags([...tags, clean]);
    }
    setTagInput('');
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  // Submit Handler
  const handleSaveBlog = async (overridePublish?: boolean) => {
    if (!title.trim()) {
      showAdminToast('Please enter a blog title', 'error', 'Validation Error');
      return;
    }
    if (!content.trim()) {
      showAdminToast('Please write some content for the blog', 'error', 'Validation Error');
      return;
    }

    const publishState = overridePublish !== undefined ? overridePublish : isPublished;

    setIsSaving(true);
    try {
      const payload: Partial<AdminBlog> = {
        title: title.trim(),
        slug: slug.trim() || generateSlug(title),
        excerpt: excerpt.trim() || undefined,
        content: content,
        coverImage: coverImage.trim() || undefined,
        author: author.trim() || 'Rebelive Editorial',
        authorRole: authorRole.trim() || 'Editorial Team',
        category: category.trim() || 'Bio-Energy & Science',
        tags: tags,
        readTime: readTime.trim() || calculateReadTime(content),
        isPublished: publishState,
        featured: featured,
        metaTitle: metaTitle.trim() || `${title.trim()} | REBELIVE`,
        metaDesc: metaDesc.trim() || (excerpt.trim() ? excerpt.trim().slice(0, 160) : undefined),
      };

      if (editingBlog) {
        const updated = await updateAdminBlog(editingBlog.id, payload);
        setBlogs(blogs.map((b) => (b.id === updated.id ? updated : b)));
        showAdminToast(`Blog "${updated.title}" updated successfully!`, 'success', 'Article Updated');
      } else {
        const created = await createAdminBlog(payload);
        setBlogs([created, ...blogs]);
        setCounts((prev) => ({
          ...prev,
          total: prev.total + 1,
          published: created.isPublished ? prev.published + 1 : prev.published,
          drafts: !created.isPublished ? prev.drafts + 1 : prev.drafts,
        }));
        showAdminToast(`New blog post created!`, 'success', 'Article Published');
      }

      setIsModalOpen(false);
      loadBlogs();
    } catch (err: any) {
      console.error('Failed to save blog:', err);
      showAdminToast(err.response?.data?.message || err.message || 'Failed to save blog post', 'error', 'Save Failed');
    } finally {
      setIsSaving(false);
    }
  };

  // Quick Toggle Publish
  const handleQuickTogglePublish = async (blog: AdminBlog) => {
    try {
      const updated = await updateAdminBlog(blog.id, { isPublished: !blog.isPublished });
      setBlogs(blogs.map((b) => (b.id === updated.id ? updated : b)));
      showAdminToast(
        `Article ${updated.isPublished ? 'published' : 'moved to drafts'}.`,
        'info',
        'Status Changed'
      );
      loadBlogs();
    } catch (err: any) {
      showAdminToast(err.message || 'Failed to toggle status', 'error', 'Error');
    }
  };

  // Delete Blog
  const handleDeleteBlog = async (id: string) => {
    try {
      await deleteAdminBlog(id);
      setBlogs(blogs.filter((b) => b.id !== id));
      setCounts((prev) => ({
        ...prev,
        total: Math.max(0, prev.total - 1),
      }));
      setDeleteConfirmId(null);
      showAdminToast('Blog post deleted successfully.', 'info', 'Article Deleted');
      loadBlogs();
    } catch (err: any) {
      console.error('Failed to delete blog:', err);
      showAdminToast(err.message || 'Failed to delete blog', 'error', 'Delete Failed');
    }
  };

  return (
    <div style={{ fontFamily: SANS }} className="space-y-6">
      {/* ─── Top Stats Bar ─── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Blogs */}
        <div className="bg-[#0e0e0e] border border-white/10 rounded-2xl p-5 flex items-center justify-between">
          <div>
            <span className="text-xs font-mono uppercase text-white/50 tracking-wider">Total Articles</span>
            <div className="text-2xl sm:text-3xl font-bold font-mono text-white mt-1">{counts.total}</div>
          </div>
          <div className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/80">
            <BookOpen className="w-5 h-5" />
          </div>
        </div>

        {/* Published */}
        <div className="bg-[#0e0e0e] border border-white/10 rounded-2xl p-5 flex items-center justify-between">
          <div>
            <span className="text-xs font-mono uppercase text-emerald-400 tracking-wider">Live & Published</span>
            <div className="text-2xl sm:text-3xl font-bold font-mono text-emerald-400 mt-1">{counts.published}</div>
          </div>
          <div className="w-11 h-11 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        {/* Drafts */}
        <div className="bg-[#0e0e0e] border border-white/10 rounded-2xl p-5 flex items-center justify-between">
          <div>
            <span className="text-xs font-mono uppercase text-amber-400 tracking-wider">Drafts</span>
            <div className="text-2xl sm:text-3xl font-bold font-mono text-amber-400 mt-1">{counts.drafts}</div>
          </div>
          <div className="w-11 h-11 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <FileText className="w-5 h-5" />
          </div>
        </div>

        {/* Reader Views */}
        <div className="bg-[#0e0e0e] border border-white/10 rounded-2xl p-5 flex items-center justify-between">
          <div>
            <span className="text-xs font-mono uppercase text-white/50 tracking-wider">Total Reader Views</span>
            <div className="text-2xl sm:text-3xl font-bold font-mono text-white mt-1">
              {blogs.reduce((acc, b) => acc + (b.views || 0), 0).toLocaleString()}
            </div>
          </div>
          <div className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/80">
            <Eye className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* ─── Action & Filter Controls Bar ─── */}
      <div className="bg-[#0e0e0e] border border-white/10 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Left: Search & Filter Tabs */}
        <div className="flex flex-wrap items-center gap-3 flex-1">
          {/* Search Form */}
          <form onSubmit={handleSearchSubmit} className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, author, category..."
              className="w-full bg-black/60 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm text-white placeholder-white/30 focus:outline-none focus:border-white/40 transition-colors"
            />
          </form>

          {/* Status Tabs */}
          <div className="flex items-center bg-black/60 border border-white/10 rounded-xl p-1 text-xs font-mono">
            {(['ALL', 'PUBLISHED', 'DRAFT'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  statusFilter === st
                    ? 'bg-white text-black font-semibold'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                {st === 'ALL' ? 'All' : st === 'PUBLISHED' ? 'Published' : 'Drafts'}
              </button>
            ))}
          </div>

          {/* Category Dropdown */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-xs font-mono text-white/80 focus:outline-none focus:border-white/40 transition-colors"
          >
            <option value="ALL">All Categories</option>
            {CATEGORY_PRESETS.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Right: Refresh & Create Button */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={loadBlogs}
            disabled={isLoading}
            title="Refresh List"
            className="p-2.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white/80 hover:text-white transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={handleOpenNewModal}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-black font-bold text-xs uppercase tracking-wider hover:bg-white/90 transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_25px_rgba(255,255,255,0.35)]"
          >
            <Plus className="w-4 h-4" />
            <span>Create Blog Post</span>
          </button>
        </div>
      </div>

      {/* ─── Blogs Table / Cards List ─── */}
      <div className="bg-[#0e0e0e] border border-white/10 rounded-2xl overflow-hidden">
        {isLoading ? (
          <div className="py-20 flex flex-col items-center justify-center text-white/50 text-xs font-mono gap-3">
            <Loader2 className="w-6 h-6 animate-spin text-white" />
            <span>LOADING REBELIVE ARTICLES...</span>
          </div>
        ) : blogs.length === 0 ? (
          <div className="py-20 flex flex-col items-center justify-center text-center px-4">
            <BookOpen className="w-12 h-12 text-white/20 mb-3" />
            <h3 className="text-base font-bold text-white mb-1">No Blog Posts Found</h3>
            <p className="text-xs text-white/50 max-w-sm mb-5">
              {searchQuery
                ? 'No blog articles match your current search criteria. Try a different keyword.'
                : 'Start publishing bio-energy science, workout nutrition, and brand stories.'}
            </p>
            <button
              onClick={handleOpenNewModal}
              className="px-4 py-2 bg-white text-black rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-white/90 transition-colors"
            >
              Write First Blog Post
            </button>
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {blogs.map((blog) => (
              <div
                key={blog.id}
                className="p-5 hover:bg-white/[0.02] transition-colors flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
              >
                {/* Left: Thumbnail + Title + Meta */}
                <div className="flex items-start gap-4 flex-1 min-w-0">
                  {/* Thumbnail */}
                  <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden border border-white/10 bg-black shrink-0">
                    {blog.coverImage ? (
                      <Image
                        src={blog.coverImage}
                        alt={blog.title}
                        fill
                        sizes="96px"
                        unoptimized={Boolean(blog.coverImage?.startsWith('http'))}
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white/30">
                        <BookOpen className="w-6 h-6" />
                      </div>
                    )}
                    {blog.featured && (
                      <div className="absolute top-1 left-1 px-1.5 py-0.5 rounded bg-amber-400 text-black text-[9px] font-mono font-bold flex items-center gap-0.5 shadow-md">
                        <Star className="w-2.5 h-2.5 fill-black" />
                        <span>PIN</span>
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0 space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      {/* Status Pill */}
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold tracking-wider ${
                          blog.isPublished
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            blog.isPublished ? 'bg-emerald-400' : 'bg-amber-400'
                          }`}
                        />
                        {blog.isPublished ? 'PUBLISHED' : 'DRAFT'}
                      </span>

                      {/* Category */}
                      <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-white/5 border border-white/10 text-white/70">
                        {blog.category || 'General'}
                      </span>

                      {/* Read time */}
                      {blog.readTime && (
                        <span className="text-[10px] font-mono text-white/40 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {blog.readTime}
                        </span>
                      )}

                      {/* Views */}
                      <span className="text-[10px] font-mono text-white/40 flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        {blog.views || 0} views
                      </span>
                    </div>

                    {/* Title */}
                    <h4 className="text-base font-bold text-white hover:text-white/90 line-clamp-1">
                      {blog.title}
                    </h4>

                    {/* Excerpt */}
                    {blog.excerpt && (
                      <p className="text-xs text-white/50 line-clamp-2 max-w-2xl">{blog.excerpt}</p>
                    )}

                    {/* Slug & Author info */}
                    <div className="flex flex-wrap items-center gap-3 text-[11px] font-mono text-white/40 pt-0.5">
                      <span className="text-white/60">/blogs/{blog.slug}</span>
                      <span>•</span>
                      <span>By {blog.author}</span>
                      <span>•</span>
                      <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                  {/* View live post button */}
                  {blog.isPublished && (
                    <Link
                      href={`/blogs/${blog.slug}`}
                      target="_blank"
                      title="View Live Article"
                      className="p-2.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-all flex items-center gap-1.5 text-xs font-mono"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">View</span>
                    </Link>
                  )}

                  {/* Quick Toggle Publish */}
                  <button
                    onClick={() => handleQuickTogglePublish(blog)}
                    title={blog.isPublished ? 'Unpublish to Draft' : 'Publish to Live'}
                    className={`p-2.5 rounded-xl border transition-all text-xs font-mono flex items-center gap-1.5 ${
                      blog.isPublished
                        ? 'border-white/10 bg-white/5 text-white/70 hover:text-amber-400 hover:border-amber-500/30'
                        : 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20'
                    }`}
                  >
                    {blog.isPublished ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    <span className="hidden sm:inline">{blog.isPublished ? 'Unpublish' : 'Publish'}</span>
                  </button>

                  {/* Edit Button */}
                  <button
                    onClick={() => handleOpenEditModal(blog)}
                    title="Edit Blog"
                    className="p-2.5 rounded-xl border border-white/15 bg-white text-black hover:bg-white/90 transition-all font-semibold flex items-center gap-1.5 text-xs"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>

                  {/* Delete Button */}
                  {deleteConfirmId === blog.id ? (
                    <div className="flex items-center gap-1 bg-red-500/10 border border-red-500/30 rounded-xl p-1">
                      <button
                        onClick={() => handleDeleteBlog(blog.id)}
                        className="px-2 py-1 bg-red-600 hover:bg-red-500 text-white text-[10px] font-mono font-bold rounded-lg transition-colors"
                      >
                        Confirm
                      </button>
                      <button
                        onClick={() => setDeleteConfirmId(null)}
                        className="p-1 text-white/60 hover:text-white"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setDeleteConfirmId(blog.id)}
                      title="Delete Blog"
                      className="p-2.5 rounded-xl border border-white/10 bg-white/5 hover:bg-red-500/20 hover:border-red-500/40 text-white/50 hover:text-red-400 transition-all"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ─── Full Rich Text Blog Editor Modal ─── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
          <div className="w-full max-w-5xl bg-[#0a0a0a] border border-white/15 rounded-3xl overflow-hidden shadow-[0_0_80px_rgba(0,0,0,0.9)] flex flex-col my-auto max-h-[94vh]">
            {/* Modal Header */}
            <div className="p-4 sm:p-6 border-b border-white/10 flex items-center justify-between bg-black/40 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center text-white">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                    {editingBlog ? 'Edit Blog Article' : 'Write New Blog Article'}
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/10 text-white/70">
                      REBELIVE JOURNAL
                    </span>
                  </h3>
                  <p className="text-xs text-white/40">
                    Draft, write rich text with headings & images, configure SEO, and publish.
                  </p>
                </div>
              </div>

              {/* Modal Tabs & Close */}
              <div className="flex items-center gap-2">
                <div className="flex items-center bg-black/60 border border-white/10 rounded-xl p-1 text-xs font-mono">
                  <button
                    onClick={() => setActiveModalTab('editor')}
                    className={`px-3 py-1.5 rounded-lg transition-all ${
                      activeModalTab === 'editor'
                        ? 'bg-white text-black font-semibold'
                        : 'text-white/60 hover:text-white'
                    }`}
                  >
                    Editor
                  </button>
                  <button
                    onClick={() => setActiveModalTab('preview')}
                    className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1 ${
                      activeModalTab === 'preview'
                        ? 'bg-white text-black font-semibold'
                        : 'text-white/60 hover:text-white'
                    }`}
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Live Preview</span>
                  </button>
                  <button
                    onClick={() => setActiveModalTab('seo')}
                    className={`px-3 py-1.5 rounded-lg transition-all ${
                      activeModalTab === 'seo'
                        ? 'bg-white text-black font-semibold'
                        : 'text-white/60 hover:text-white'
                    }`}
                  >
                    Settings & SEO
                  </button>
                </div>

                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 rounded-xl text-white/50 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body - Scrollable */}
            <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6 [scrollbar-width:thin] [scrollbar-color:rgba(255,255,255,0.2)_transparent]">
              {/* TAB 1: EDITOR */}
              {activeModalTab === 'editor' && (
                <div className="space-y-5">
                  {/* Article Title */}
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-white/60 mb-2">
                      Article Title *
                    </label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => handleTitleChange(e.target.value)}
                      placeholder="e.g. The Science of Bio-Energy: Redefining Cellular Stamina"
                      className="w-full bg-[#121212] border border-white/15 rounded-xl px-4 py-3 text-base sm:text-lg font-bold text-white placeholder-white/30 focus:outline-none focus:border-white/50 transition-colors"
                    />
                  </div>

                  {/* Slug & Category Row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Slug */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-xs font-mono uppercase tracking-wider text-white/60">
                          URL Slug
                        </label>
                        <span className="text-[10px] font-mono text-white/40">/blogs/{slug || '...'}</span>
                      </div>
                      <input
                        type="text"
                        value={slug}
                        onChange={(e) => {
                          setSlug(e.target.value);
                          setIsSlugManual(true);
                        }}
                        placeholder="article-url-slug"
                        className="w-full bg-[#121212] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs font-mono text-white/90 placeholder-white/30 focus:outline-none focus:border-white/40 transition-colors"
                      />
                    </div>

                    {/* Category */}
                    <div>
                      <label className="block text-xs font-mono uppercase tracking-wider text-white/60 mb-1.5">
                        Category
                      </label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full bg-[#121212] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs font-mono text-white/90 focus:outline-none focus:border-white/40 transition-colors"
                      >
                        {CATEGORY_PRESETS.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Cover Image Uploader */}
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-white/60 mb-2">
                      Cover Banner Image
                    </label>
                    <div className="flex flex-col sm:flex-row items-center gap-4 p-4 rounded-2xl border border-white/15 bg-[#121212]">
                      {/* Image Preview Box */}
                      <div className="relative w-full sm:w-44 h-32 rounded-xl overflow-hidden border border-white/10 bg-black shrink-0">
                        {coverImage ? (
                          <Image
                            src={coverImage}
                            alt="Cover Preview"
                            fill
                            sizes="176px"
                            unoptimized={Boolean(coverImage.startsWith('http'))}
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center text-white/30 text-xs font-mono">
                            <ImageIcon className="w-6 h-6 mb-1" />
                            <span>No Cover</span>
                          </div>
                        )}
                        {isCoverUploading && (
                          <div className="absolute inset-0 bg-black/80 flex items-center justify-center text-xs font-mono text-white gap-2">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Uploading...</span>
                          </div>
                        )}
                      </div>

                      {/* Controls */}
                      <div className="flex-1 space-y-2.5 w-full">
                        <div className="flex flex-wrap items-center gap-2">
                          <input
                            ref={coverFileInputRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleCoverUpload(file);
                            }}
                          />
                          <button
                            type="button"
                            onClick={() => coverFileInputRef.current?.click()}
                            disabled={isCoverUploading}
                            className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-white text-xs font-mono flex items-center gap-2 transition-colors disabled:opacity-50"
                          >
                            <UploadCloud className="w-4 h-4" />
                            <span>Upload to Cloudinary</span>
                          </button>

                          {coverImage && (
                            <button
                              type="button"
                              onClick={() => setCoverImage('')}
                              className="px-3 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 text-xs font-mono transition-colors"
                            >
                              Remove
                            </button>
                          )}
                        </div>

                        {/* Or URL input */}
                        <div>
                          <input
                            type="text"
                            value={coverImage}
                            onChange={(e) => setCoverImage(e.target.value)}
                            placeholder="Or enter direct image URL (e.g. /brand/APEX.webp or https://...)"
                            className="w-full bg-black/50 border border-white/10 rounded-xl px-3 py-2 text-xs font-mono text-white/80 placeholder-white/30 focus:outline-none focus:border-white/30 transition-colors"
                          />
                        </div>
                        <p className="text-[11px] font-mono text-white/40">
                          Recommended ratio: 16:9 or 21:9. Automatically compressed before Cloudinary upload.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Excerpt */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-mono uppercase tracking-wider text-white/60">
                        Article Excerpt (Hook / Summary)
                      </label>
                      <span className="text-[10px] font-mono text-white/40">{excerpt.length}/220 chars</span>
                    </div>
                    <textarea
                      rows={2}
                      value={excerpt}
                      onChange={(e) => setExcerpt(e.target.value)}
                      placeholder="Brief teaser summarizing the key insights. Appears on blog cards and search engine snippets..."
                      className="w-full bg-[#121212] border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white placeholder-white/30 focus:outline-none focus:border-white/50 transition-colors"
                    />
                  </div>

                  {/* ── RICH TEXT TOOLBAR & CANVAS ── */}
                  <div className="border border-white/15 rounded-2xl overflow-hidden bg-[#101010]">
                    {/* Toolbar Header */}
                    <div className="p-3 bg-black/60 border-b border-white/10 flex flex-wrap items-center justify-between gap-2">
                      {/* Left: Formatting buttons */}
                      <div className="flex flex-wrap items-center gap-1 sm:gap-1.5">
                        {/* Headings */}
                        <button
                          type="button"
                          onClick={() => handleHeadingSelect('h2')}
                          title="Section Heading 2"
                          className="px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/15 border border-white/10 text-white/80 hover:text-white text-xs font-bold font-mono transition-colors"
                        >
                          H2
                        </button>
                        <button
                          type="button"
                          onClick={() => handleHeadingSelect('h3')}
                          title="Subheading 3"
                          className="px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/15 border border-white/10 text-white/80 hover:text-white text-xs font-bold font-mono transition-colors"
                        >
                          H3
                        </button>
                        <button
                          type="button"
                          onClick={() => handleHeadingSelect('p')}
                          title="Paragraph Text"
                          className="px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/15 border border-white/10 text-white/80 hover:text-white text-xs font-mono transition-colors"
                        >
                          ¶ Text
                        </button>

                        <div className="w-[1px] h-5 bg-white/10 mx-1" />

                        {/* Inline styles */}
                        <button
                          type="button"
                          onClick={() => executeVisualCommand('bold')}
                          title="Bold (Ctrl+B)"
                          className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 border border-white/10 text-white/80 hover:text-white transition-colors"
                        >
                          <Bold className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => executeVisualCommand('italic')}
                          title="Italic (Ctrl+I)"
                          className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 border border-white/10 text-white/80 hover:text-white transition-colors"
                        >
                          <Italic className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => executeVisualCommand('underline')}
                          title="Underline (Ctrl+U)"
                          className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 border border-white/10 text-white/80 hover:text-white transition-colors"
                        >
                          <UnderlineIcon className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => executeVisualCommand('strikeThrough')}
                          title="Strikethrough"
                          className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 border border-white/10 text-white/80 hover:text-white transition-colors"
                        >
                          <Strikethrough className="w-3.5 h-3.5" />
                        </button>

                        <div className="w-[1px] h-5 bg-white/10 mx-1" />

                        {/* Lists & Quotes */}
                        <button
                          type="button"
                          onClick={() => executeVisualCommand('insertUnorderedList')}
                          title="Bullet List"
                          className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 border border-white/10 text-white/80 hover:text-white transition-colors"
                        >
                          <List className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => executeVisualCommand('insertOrderedList')}
                          title="Numbered List"
                          className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 border border-white/10 text-white/80 hover:text-white transition-colors"
                        >
                          <ListOrdered className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={handleInsertCallout}
                          title="Rebelive Quote / Callout Box"
                          className="px-2 py-1.5 rounded-lg bg-white/5 hover:bg-white/15 border border-white/10 text-white/80 hover:text-white text-xs font-mono flex items-center gap-1 transition-colors"
                        >
                          <Quote className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Callout</span>
                        </button>

                        <div className="w-[1px] h-5 bg-white/10 mx-1" />

                        {/* Link Button */}
                        <button
                          type="button"
                          onClick={() => setShowLinkModal(true)}
                          title="Insert Hyperlink"
                          className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 border border-white/10 text-white/80 hover:text-white transition-colors"
                        >
                          <LinkIcon className="w-3.5 h-3.5" />
                        </button>

                        {/* Image Upload Button */}
                        <input
                          ref={inlineImageInputRef}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleInlineImageUpload(file);
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => inlineImageInputRef.current?.click()}
                          disabled={isInlineUploading}
                          title="Upload image to Cloudinary and insert"
                          className="px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-mono font-medium flex items-center gap-1.5 transition-colors disabled:opacity-50"
                        >
                          {isInlineUploading ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <ImageIcon className="w-3.5 h-3.5 text-emerald-400" />
                          )}
                          <span>Upload Image</span>
                        </button>

                        {/* Image by URL */}
                        <button
                          type="button"
                          onClick={() => setShowImageUrlModal(true)}
                          title="Insert image by URL"
                          className="px-2 py-1.5 rounded-lg bg-white/5 hover:bg-white/15 border border-white/10 text-white/70 hover:text-white text-xs font-mono transition-colors"
                        >
                          + Image URL
                        </button>
                      </div>

                      {/* Right: Visual vs HTML toggle */}
                      <div className="flex items-center gap-1 bg-black/80 border border-white/10 rounded-lg p-0.5 text-[11px] font-mono">
                        <button
                          type="button"
                          onClick={() => setEditorMode('visual')}
                          className={`px-2 py-1 rounded transition-colors ${
                            editorMode === 'visual' ? 'bg-white text-black font-bold' : 'text-white/60 hover:text-white'
                          }`}
                        >
                          Visual
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditorMode('code')}
                          className={`px-2 py-1 rounded transition-colors ${
                            editorMode === 'code' ? 'bg-white text-black font-bold' : 'text-white/60 hover:text-white'
                          }`}
                        >
                          HTML
                        </button>
                      </div>
                    </div>

                    {/* Canvas Area */}
                    {editorMode === 'visual' ? (
                      <div
                        ref={visualEditorRef}
                        contentEditable
                        suppressContentEditableWarning
                        onInput={(e) => {
                          const html = e.currentTarget.innerHTML;
                          setContent(html);
                          setReadTime(calculateReadTime(html));
                        }}
                        dangerouslySetInnerHTML={{ __html: content }}
                        className="p-5 min-h-[360px] max-h-[550px] overflow-y-auto text-white focus:outline-none article-prose"
                        style={{ fontFamily: SANS }}
                      />
                    ) : (
                      <textarea
                        rows={16}
                        value={content}
                        onChange={(e) => {
                          setContent(e.target.value);
                          setReadTime(calculateReadTime(e.target.value));
                        }}
                        placeholder="Write raw HTML or paste article code here..."
                        className="w-full p-5 bg-black text-white/90 font-mono text-xs focus:outline-none resize-y min-h-[360px]"
                      />
                    )}
                  </div>
                </div>
              )}

              {/* TAB 2: LIVE PREVIEW */}
              {activeModalTab === 'preview' && (
                <div className="bg-[#090909] border border-white/10 rounded-2xl p-6 sm:p-10 max-w-4xl mx-auto space-y-8">
                  {/* Category & Read Time */}
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="px-3 py-1 rounded-full text-xs font-mono uppercase bg-white/10 border border-white/15 text-white font-semibold">
                      {category}
                    </span>
                    <span className="text-xs font-mono text-white/50 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      {readTime}
                    </span>
                    <span className="text-xs font-mono text-white/50">
                      {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>

                  {/* Title */}
                  <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-white leading-tight">
                    {title || 'Untitled Article'}
                  </h1>

                  {/* Author Card */}
                  <div className="flex items-center gap-3 pt-2 border-b border-white/10 pb-6">
                    <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center overflow-hidden">
                      <UserIcon className="w-5 h-5 text-white/70" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white">{author}</div>
                      <div className="text-xs font-mono text-white/40">{authorRole}</div>
                    </div>
                  </div>

                  {/* Cover Image Banner */}
                  {coverImage && (
                    <div className="relative w-full aspect-[21/9] rounded-2xl overflow-hidden border border-white/10">
                      <Image
                        src={coverImage}
                        alt={title}
                        fill
                        sizes="100vw"
                        unoptimized={Boolean(coverImage.startsWith('http'))}
                        className="object-cover"
                      />
                    </div>
                  )}

                  {/* Excerpt Lead */}
                  {excerpt && (
                    <p className="text-base sm:text-lg text-white/80 font-medium leading-relaxed border-l-2 border-white pl-4 italic">
                      {excerpt}
                    </p>
                  )}

                  {/* Article Content Render */}
                  <div
                    className="article-prose text-white/90 space-y-4"
                    dangerouslySetInnerHTML={{ __html: content }}
                  />

                  {/* Tags */}
                  {tags.length > 0 && (
                    <div className="pt-6 border-t border-white/10 flex flex-wrap items-center gap-2">
                      <span className="text-xs font-mono text-white/40">TAGS:</span>
                      {tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-xs font-mono text-white/80"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: SETTINGS & SEO */}
              {activeModalTab === 'seo' && (
                <div className="space-y-6 max-w-2xl">
                  {/* Author Details */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono uppercase tracking-wider text-white/60 mb-1.5">
                        Author Name
                      </label>
                      <input
                        type="text"
                        value={author}
                        onChange={(e) => setAuthor(e.target.value)}
                        placeholder="Rebelive Editorial"
                        className="w-full bg-[#121212] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-white/30 focus:outline-none focus:border-white/40"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono uppercase tracking-wider text-white/60 mb-1.5">
                        Author Role / Bio
                      </label>
                      <input
                        type="text"
                        value={authorRole}
                        onChange={(e) => setAuthorRole(e.target.value)}
                        placeholder="Head of Performance Science"
                        className="w-full bg-[#121212] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-white/30 focus:outline-none focus:border-white/40"
                      />
                    </div>
                  </div>

                  {/* Read Time & Featured */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono uppercase tracking-wider text-white/60 mb-1.5">
                        Estimated Read Time
                      </label>
                      <input
                        type="text"
                        value={readTime}
                        onChange={(e) => setReadTime(e.target.value)}
                        placeholder="4 min read"
                        className="w-full bg-[#121212] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs font-mono text-white placeholder-white/30 focus:outline-none focus:border-white/40"
                      />
                    </div>

                    {/* Featured Star Toggle */}
                    <div className="flex items-center justify-between p-3.5 bg-[#121212] border border-white/15 rounded-xl">
                      <div>
                        <div className="text-xs font-bold text-white">Featured Post</div>
                        <div className="text-[10px] font-mono text-white/40">Pin to hero on /blogs</div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setFeatured(!featured)}
                        className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${
                          featured ? 'bg-amber-400 text-black' : 'bg-white/10 text-white/40'
                        }`}
                      >
                        <Star className={`w-4 h-4 ${featured ? 'fill-black' : ''}`} />
                      </button>
                    </div>
                  </div>

                  {/* Tags input */}
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-white/60 mb-1.5">
                      Tags (Press Enter to add)
                    </label>
                    <div className="flex items-center gap-2 mb-2">
                      <input
                        type="text"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddTag();
                          }
                        }}
                        placeholder="e.g. Bio-Energy, Nootropics, Endurance"
                        className="flex-1 bg-[#121212] border border-white/15 rounded-xl px-3.5 py-2 text-xs text-white placeholder-white/30 focus:outline-none focus:border-white/40"
                      />
                      <button
                        type="button"
                        onClick={handleAddTag}
                        className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/15 text-white text-xs font-mono rounded-xl transition-colors"
                      >
                        Add Tag
                      </button>
                    </div>
                    {/* Tags List */}
                    <div className="flex flex-wrap gap-1.5">
                      {tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/15 text-xs font-mono text-white/80 flex items-center gap-1.5"
                        >
                          #{tag}
                          <button
                            type="button"
                            onClick={() => handleRemoveTag(tag)}
                            className="text-white/40 hover:text-white"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* SEO Fields */}
                  <div className="space-y-4 pt-4 border-t border-white/10">
                    <h4 className="text-xs font-mono uppercase tracking-wider text-white/80 flex items-center gap-1.5">
                      <Globe className="w-3.5 h-3.5 text-emerald-400" />
                      Search Engine Optimization (Meta)
                    </h4>

                    <div>
                      <label className="block text-xs font-mono text-white/60 mb-1">
                        Meta Title (Google Browser Tab)
                      </label>
                      <input
                        type="text"
                        value={metaTitle}
                        onChange={(e) => setMetaTitle(e.target.value)}
                        placeholder="Title | REBELIVE"
                        className="w-full bg-[#121212] border border-white/15 rounded-xl px-3.5 py-2 text-xs text-white placeholder-white/30 focus:outline-none focus:border-white/40"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-white/60 mb-1">
                        Meta Description
                      </label>
                      <textarea
                        rows={2}
                        value={metaDesc}
                        onChange={(e) => setMetaDesc(e.target.value)}
                        placeholder="Search snippet summary (140-160 characters)"
                        className="w-full bg-[#121212] border border-white/15 rounded-xl px-3.5 py-2 text-xs text-white placeholder-white/30 focus:outline-none focus:border-white/40"
                      />
                    </div>
                  </div>

                  {/* Publication Switch */}
                  <div className="p-4 bg-white/[0.03] border border-white/10 rounded-2xl flex items-center justify-between">
                    <div>
                      <div className="text-sm font-bold text-white">Publish to Live Website</div>
                      <div className="text-xs font-mono text-white/40">
                        {isPublished ? 'Article will be immediately visible on /blogs' : 'Article saved as draft only'}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsPublished(!isPublished)}
                      className={`relative w-12 h-6 rounded-full transition-colors ${
                        isPublished ? 'bg-emerald-500' : 'bg-white/20'
                      }`}
                    >
                      <span
                        className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${
                          isPublished ? 'translate-x-6' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer Controls */}
            <div className="p-4 sm:p-5 border-t border-white/10 bg-black/50 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
              <div className="text-xs font-mono text-white/40 flex items-center gap-2">
                <span>Status:</span>
                <span className={isPublished ? 'text-emerald-400 font-bold' : 'text-amber-400 font-bold'}>
                  {isPublished ? '● PUBLISHED' : '○ DRAFT'}
                </span>
                <span>•</span>
                <span>{readTime}</span>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl border border-white/10 hover:bg-white/10 text-white/70 hover:text-white text-xs font-mono transition-colors"
                >
                  Cancel
                </button>

                {/* Save Draft */}
                <button
                  type="button"
                  onClick={() => handleSaveBlog(false)}
                  disabled={isSaving}
                  className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-mono font-bold transition-colors disabled:opacity-50"
                >
                  Save as Draft
                </button>

                {/* Main Publish Button */}
                <button
                  type="button"
                  onClick={() => handleSaveBlog(true)}
                  disabled={isSaving}
                  className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl bg-white text-black text-xs font-bold uppercase tracking-wider hover:bg-white/90 transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)] disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>{editingBlog ? 'Update Article' : 'Publish Article'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Link Insertion Modal ── */}
      {showLinkModal && (
        <div className="fixed inset-0 z-60 bg-black/80 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#121212] border border-white/20 rounded-2xl p-5 space-y-4">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <LinkIcon className="w-4 h-4 text-emerald-400" />
              Insert Hyperlink
            </h4>
            <div>
              <label className="block text-xs font-mono text-white/60 mb-1">Target URL *</label>
              <input
                type="text"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                placeholder="https://example.com or /shop/apex"
                className="w-full bg-black border border-white/15 rounded-xl px-3 py-2 text-xs text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-white/60 mb-1">Link Display Text</label>
              <input
                type="text"
                value={linkText}
                onChange={(e) => setLinkText(e.target.value)}
                placeholder="e.g. Read Scientific Whitepaper"
                className="w-full bg-black border border-white/15 rounded-xl px-3 py-2 text-xs text-white"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowLinkModal(false)}
                className="px-3 py-1.5 text-xs text-white/60 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleInsertLink}
                className="px-4 py-1.5 bg-white text-black font-bold text-xs rounded-xl hover:bg-white/90"
              >
                Insert Link
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Image URL Insertion Modal ── */}
      {showImageUrlModal && (
        <div className="fixed inset-0 z-60 bg-black/80 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#121212] border border-white/20 rounded-2xl p-5 space-y-4">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-emerald-400" />
              Insert Image via URL
            </h4>
            <div>
              <label className="block text-xs font-mono text-white/60 mb-1">Image URL *</label>
              <input
                type="text"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://... or /brand/Aviva.webp"
                className="w-full bg-black border border-white/15 rounded-xl px-3 py-2 text-xs text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-white/60 mb-1">Alt Description</label>
              <input
                type="text"
                value={imageAlt}
                onChange={(e) => setImageAlt(e.target.value)}
                placeholder="Descriptive text for accessibility"
                className="w-full bg-black border border-white/15 rounded-xl px-3 py-2 text-xs text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-white/60 mb-1">Caption (Optional)</label>
              <input
                type="text"
                value={imageCaption}
                onChange={(e) => setImageCaption(e.target.value)}
                placeholder="Photo credit or caption"
                className="w-full bg-black border border-white/15 rounded-xl px-3 py-2 text-xs text-white"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowImageUrlModal(false)}
                className="px-3 py-1.5 text-xs text-white/60 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleInsertImageUrl}
                className="px-4 py-1.5 bg-white text-black font-bold text-xs rounded-xl hover:bg-white/90"
              >
                Insert Image
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Global CSS for article visual preview / typography */}
      <style jsx global>{`
        .article-prose h1 {
          font-size: 2rem;
          font-weight: 800;
          color: #ffffff;
          margin-top: 1.5rem;
          margin-bottom: 0.75rem;
          line-height: 1.2;
        }
        .article-prose h2 {
          font-size: 1.5rem;
          font-weight: 700;
          color: #ffffff;
          margin-top: 1.5rem;
          margin-bottom: 0.65rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          padding-bottom: 0.35rem;
        }
        .article-prose h3 {
          font-size: 1.2rem;
          font-weight: 600;
          color: #ffffff;
          margin-top: 1.25rem;
          margin-bottom: 0.5rem;
        }
        .article-prose p {
          color: rgba(255, 255, 255, 0.85);
          font-size: 0.95rem;
          line-height: 1.7;
          margin-bottom: 1rem;
        }
        .article-prose strong {
          color: #ffffff;
          font-weight: 600;
        }
        .article-prose em {
          color: rgba(255, 255, 255, 0.9);
          font-style: italic;
        }
        .article-prose ul {
          list-style-type: disc;
          padding-left: 1.5rem;
          margin-bottom: 1rem;
          color: rgba(255, 255, 255, 0.85);
        }
        .article-prose ol {
          list-style-type: decimal;
          padding-left: 1.5rem;
          margin-bottom: 1rem;
          color: rgba(255, 255, 255, 0.85);
        }
        .article-prose li {
          margin-bottom: 0.35rem;
          line-height: 1.6;
        }
        .article-prose blockquote {
          border-left: 3px solid #ffffff;
          padding-left: 1rem;
          margin: 1.5rem 0;
          font-style: italic;
          color: rgba(255, 255, 255, 0.9);
        }
        .article-prose a {
          color: #ffffff;
          text-decoration: underline;
          text-underline-offset: 4px;
        }
        .article-prose a:hover {
          color: rgba(255, 255, 255, 0.8);
        }
        .article-prose img {
          max-width: 100%;
          height: auto;
          border-radius: 1rem;
          margin: 1.5rem auto;
          display: block;
        }
      `}</style>
    </div>
  );
}

export default RootBlogsTab;
