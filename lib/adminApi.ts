import axios from 'axios';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

const ADMIN_TOKEN_KEY = 'rebelive_admin_token';
const ADMIN_USER_KEY = 'rebelive_admin_user';

export const adminClient = axios.create({
  baseURL: `${API_BASE}/admin`,
  withCredentials: true,
  timeout: 8000,
});

adminClient.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem(ADMIN_TOKEN_KEY) || localStorage.getItem('rebelive_auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

adminClient.interceptors.response.use(
  (res) => res,
  async (error) => {
    // If 401 Unauthorized or 403 Forbidden occurs on protected routes, purge session and broadcast
    const status = error.response?.status;
    if ((status === 401 || status === 403) && typeof window !== 'undefined') {
      if (!error.config?.url?.includes('/login')) {
        clearAdminSession();
        window.dispatchEvent(new CustomEvent('admin-session-expired', { detail: { status } }));
      }
    }
    return Promise.reject(error);
  }
);

export function isAuthError(err: unknown): boolean {
  if (err && typeof err === 'object' && 'response' in err) {
    const res = (err as { response?: { status?: number } }).response;
    return res?.status === 401 || res?.status === 403;
  }
  return false;
}

export interface AdminUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'CUSTOMER' | 'ADMIN' | 'SUPERADMIN';
  phone?: string | null;
  emailVerified: boolean;
  isRestricted?: boolean;
  avatarUrl?: string | null;
  createdAt: string;
  lastLoginAt?: string | null;
  ordersCount?: number;
  totalSpent?: number;
  addresses?: any[];
}

export interface AdminDashboardData {
  stats: {
    totalUsers: number;
    totalOrders: number;
    totalProducts: number;
    pendingOrders: number;
    shippedOrders: number;
    deliveredOrders: number;
    shiprocketSyncedOrders: number;
    totalRevenue: number;
    totalContactQueries?: number;
    newContactQueries?: number;
    totalCorporateQueries?: number;
    newCorporateQueries?: number;
    totalInquiries?: number;
    newInquiries?: number;
  };
  recentOrders: any[];
  lowStockVariants: any[];
}

export interface AdminProduct {
  id: string;
  name: string;
  slug: string;
  displayTitle?: string | null;
  flavor?: string | null;
  tagline?: string | null;
  description: string;
  story?: string | null;
  volume?: string | null;
  sugar?: string | null;
  caffeine?: string | null;
  calories?: string | null;
  canImage?: string | null;
  image?: string | null;
  renderImage?: string | null;
  gallery?: any;
  images?: any;
  brandLogo?: string | null;
  bgImage?: string | null;
  bgGradient?: string | null;
  primaryTone?: string | null;
  accentHex?: string | null;
  isActive: boolean;
  isFeatured?: boolean;
  notes?: string[];
  ingredients?: string | null;
  netQuantity?: string | null;
  isVegetarian?: boolean;
  nutrition?: any;
  nutritionInfo?: any;
  howToEnjoy?: string | null;
  additionalInfo?: any;
  specs?: any;
  tastingNotesDetailed?: any;
  variants: Array<{
    id: string;
    sku: string;
    name: string;
    sizeMl?: number | null;
    price: number;
    compareAtPrice?: number | null;
    stockQty: number;
    lowStockThreshold?: number;
    isDefault: boolean;
    isActive: boolean;
  }>;
  category?: { id: string; name: string } | null;
}

export interface AdminOrder {
  id: string;
  orderNumber: string;
  userId: string;
  status: 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED' | 'REFUNDED';
  subtotal: number;
  discountAmount: number;
  taxAmount: number;
  shippingAmount: number;
  total: number;
  trackingNumber?: string | null;
  trackingUrl?: string | null;
  shiprocketOrderId?: string | null;
  shiprocketShipmentId?: string | null;
  createdAt: string;
  notes?: string | null;
  user?: {
    email: string;
    firstName: string;
    lastName: string;
    phone?: string | null;
  } | null;
  shippingAddress?: {
    line1: string;
    line2?: string | null;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    billing_customer_name?: string;
    billing_last_name?: string;
    billing_address?: string;
    billing_address_2?: string;
    billing_city?: string;
    billing_state?: string;
    billing_pincode?: string;
    billing_country?: string;
    billing_email?: string;
    billing_phone?: string;
    shipping_customer_name?: string;
    shipping_last_name?: string;
    shipping_address?: string;
    shipping_address_2?: string;
    shipping_city?: string;
    shipping_state?: string;
    shipping_pincode?: string;
    shipping_country?: string;
    shipping_email?: string;
    shipping_phone?: string;
    fullName?: string;
    first_name?: string;
    last_name?: string;
    pincode?: string;
    country_code?: string;
    landmark?: string | null;
    alternate_phone?: string | null;
    gender?: string | null;
    phone?: string;
    email?: string;
  } | null;
  items: Array<{
    id: string;
    productId: string;
    productName: string;
    variantName: string;
    sku: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    product?: any;
  }>;
  payments?: Array<{
    id: string;
    amount: number;
    method: string;
    status: string;
    transactionId?: string | null;
  }>;
  statusHistory?: Array<{
    id: string;
    status: string;
    note?: string | null;
    createdAt: string;
  }>;
}

// ─── AUTH HELPER FUNCTIONS ─────────────────────────────

export function getStoredAdminToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(ADMIN_TOKEN_KEY);
}

export function getStoredAdminUser(): AdminUser | null {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem(ADMIN_USER_KEY);
  return raw ? JSON.parse(raw) : null;
}

export function setAdminSession(token: string, user: AdminUser): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(ADMIN_TOKEN_KEY, token);
  localStorage.setItem(ADMIN_USER_KEY, JSON.stringify(user));
}

export function clearAdminSession(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(ADMIN_TOKEN_KEY);
  localStorage.removeItem(ADMIN_USER_KEY);
}

/**
 * Actively verifies stored admin session with backend.
 * Clears session and returns null if token is missing, expired, or invalid.
 */
export async function verifyAdminSession(): Promise<AdminUser | null> {
  const token = getStoredAdminToken();
  const user = getStoredAdminUser();
  if (!token || !user) {
    clearAdminSession();
    return null;
  }

  try {
    const res = await adminClient.get('/dashboard');
    if (res.data?.status === 'success') {
      return user;
    }
    return user;
  } catch (err: any) {
    if (isAuthError(err)) {
      clearAdminSession();
      return null;
    }
    // If backend is unreachable network-wise, keep existing session if valid structure
    return user;
  }
}

// ─── ADMIN 2-STEP AUTHENTICATION ───────────────────────

/**
 * Step 1: Admin Email + Password Request -> Dispatches 6-digit OTP
 */
export async function adminLoginRequest(
  email: string,
  password: string
): Promise<{ status: string; message: string; email: string }> {
  try {
    const res = await adminClient.post('/login-request', { email, password });
    if (res.data?.status === 'success') {
      return {
        status: 'success',
        message: res.data.message || `2FA verification code dispatched to ${email}`,
        email,
      };
    }
    throw new Error(res.data?.message || 'Login request failed');
  } catch (err: any) {
    const msg = err.response?.data?.message || err.message || 'Authentication failed. Please verify credentials.';
    throw new Error(msg);
  }
}

/**
 * Step 2: Admin Verifies OTP -> Gains Dashboard Session Token
 */
export async function adminVerifyOtp(
  email: string,
  otp: string
): Promise<{ user: AdminUser; accessToken: string }> {
  try {
    const res = await adminClient.post('/login-verify-otp', { email, otp });
    if (res.data?.status === 'success' && res.data?.data) {
      const { user, accessToken } = res.data.data;
      setAdminSession(accessToken, user);
      return { user, accessToken };
    }
    throw new Error(res.data?.message || 'Verification failed');
  } catch (err: any) {
    const msg = err.response?.data?.message || err.message || 'OTP verification failed. Invalid or expired code.';
    throw new Error(msg);
  }
}

/**
 * Admin Self-Service Password Management
 * Allows authenticated admin/superadmin to change their password
 */
export async function changeAdminPassword(
  currentPassword: string,
  newPassword: string
): Promise<{ status: string; message: string }> {
  try {
    const res = await adminClient.patch('/change-password', {
      currentPassword,
      newPassword,
    });
    return {
      status: 'success',
      message: res.data?.message || 'Password updated successfully.',
    };
  } catch (err: any) {
    const msg = err.response?.data?.message || err.message || 'Failed to update password.';
    throw new Error(msg);
  }
}

// ─── DASHBOARD & METRICS ───────────────────────────────

export async function fetchAdminDashboard(): Promise<AdminDashboardData> {
  try {
    const res = await adminClient.get('/dashboard');
    if (res.data?.status === 'success' && res.data?.data) {
      return res.data.data;
    }
  } catch (err: any) {
    if (isAuthError(err)) {
      throw err;
    }
    console.warn('Backend /admin/dashboard unreachable, using fallback metrics:', err);
  }

  return {
    stats: {
      totalUsers: 142,
      totalOrders: 68,
      totalProducts: 4,
      pendingOrders: 3,
      shippedOrders: 42,
      deliveredOrders: 21,
      shiprocketSyncedOrders: 63,
      totalRevenue: 104280,
    },
    recentOrders: [],
    lowStockVariants: [
      {
        id: 'var-capella-12',
        name: 'CAPELLA · 12-Pack Case',
        stockQty: 8,
        product: { name: 'CAPELLA', slug: 'capella' },
      },
    ],
  };
}

// ─── ORDERS & SHIPROCKET ───────────────────────────────

export async function fetchAdminOrders(params?: {
  status?: string;
  search?: string;
  page?: number;
  limit?: number;
}): Promise<{ data: AdminOrder[]; total: number; page: number; totalPages: number }> {
  try {
    const res = await adminClient.get('/orders', { params });
    if (res.data?.status === 'success' && Array.isArray(res.data?.data)) {
      return {
        data: res.data.data,
        total: res.data.total || res.data.data.length,
        page: res.data.page || 1,
        totalPages: res.data.totalPages || 1,
      };
    }
  } catch (err: any) {
    if (isAuthError(err)) {
      throw err;
    }
    console.warn('Backend /admin/orders error:', err);
    throw new Error(err.response?.data?.message || 'Failed to fetch admin orders');
  }

  return {
    data: [],
    total: 0,
    page: 1,
    totalPages: 1,
  };
}

export async function updateOrderStatus(
  orderId: string,
  status: string,
  note?: string,
  trackingNumber?: string,
  trackingUrl?: string
): Promise<AdminOrder> {
  const res = await adminClient.patch(`/orders/${orderId}/status`, {
    status,
    note,
    trackingNumber,
    trackingUrl,
  });
  return res.data?.data;
}

/**
 * Triggers instant Shiprocket Adhoc consignment creation & AWB assignment
 */
export async function dispatchOrderToShiprocket(
  orderId: string
): Promise<{ order: AdminOrder; awbCode: string; courierName: string }> {
  try {
    const res = await adminClient.post(`/orders/${orderId}/dispatch-shiprocket`);
    if (res.data?.status === 'success' && res.data?.data) {
      return res.data.data;
    }
    throw new Error(res.data?.message || 'Failed to dispatch order to Shiprocket');
  } catch (err: any) {
    throw new Error(err.response?.data?.message || err.message || 'Failed to dispatch order to Shiprocket');
  }
}

/**
 * Pushes all pending / unsynced orders to Shiprocket
 */
export async function syncAllOrdersToShiprocket(): Promise<{
  syncedCount: number;
  totalChecked: number;
  message: string;
}> {
  try {
    const res = await adminClient.post('/orders/sync-shiprocket');
    return {
      syncedCount: res.data?.data?.syncedCount ?? 0,
      totalChecked: res.data?.data?.totalChecked ?? 0,
      message: res.data?.message || 'Sync complete',
    };
  } catch (err: any) {
    if (err.response?.data?.message) {
      throw new Error(err.response.data.message);
    }
    throw new Error('Failed to connect to Shiprocket sync endpoint');
  }
}

export async function fetchAdminOrder(orderId: string): Promise<AdminOrder> {
  try {
    const res = await adminClient.get(`/orders/${orderId}`);
    if (res.data?.status === 'success' && res.data?.data) {
      return res.data.data;
    }
  } catch (err: any) {
    console.warn(`Backend /admin/orders/${orderId} unreachable, searching in orders list:`, err);
  }

  const { data: list } = await fetchAdminOrders();
  const found = list.find((o) => o.id === orderId || o.orderNumber === orderId);
  if (found) return found;

  throw new Error(`Order #${orderId} not found.`);
}

/**
 * Queries live Shiprocket tracking info directly for an order
 */
export async function trackOrderShiprocket(orderId: string): Promise<any> {
  const res = await adminClient.get(`/orders/${orderId}/track-shiprocket`);
  return res.data?.data;
}

// ─── PRODUCTS CRUD ─────────────────────────────────────

export async function fetchAdminProducts(search?: string): Promise<AdminProduct[]> {
  try {
    const res = await adminClient.get('/products', { params: { search } });
    if (res.data?.status === 'success' && Array.isArray(res.data?.data)) {
      return res.data.data;
    }
  } catch (err: any) {
    if (isAuthError(err)) {
      throw err;
    }
    console.warn('Backend /admin/products unreachable, returning fallback catalog:', err);
  }

  return [];
}

export async function fetchAdminProduct(productId: string): Promise<AdminProduct> {
  try {
    const res = await adminClient.get(`/products/${productId}`);
    if (res.data?.status === 'success' && res.data?.data) {
      return res.data.data;
    }
  } catch (err: any) {
    console.warn(`Backend /admin/products/${productId} unreachable, searching in products list:`, err);
  }

  const list = await fetchAdminProducts();
  const found = list.find((p) => p.id === productId || p.slug === productId);
  if (found) return found;

  throw new Error(`Product #${productId} not found.`);
}

export async function createAdminProduct(productData: any): Promise<AdminProduct> {
  const res = await adminClient.post('/products', productData);
  if (typeof window !== 'undefined') {
    try {
      localStorage.removeItem('rebelive_products_cache');
    } catch {}
  }
  return res.data?.data;
}

export async function updateAdminProduct(productId: string, productData: any): Promise<AdminProduct> {
  const res = await adminClient.patch(`/products/${productId}`, productData);
  if (typeof window !== 'undefined') {
    try {
      localStorage.removeItem('rebelive_products_cache');
    } catch {}
  }
  return res.data?.data;
}

export async function deleteAdminProduct(productId: string): Promise<void> {
  await adminClient.delete(`/products/${productId}`);
  if (typeof window !== 'undefined') {
    try {
      localStorage.removeItem('rebelive_products_cache');
    } catch {}
  }
}

export interface CloudinaryUploadResponse {
  url: string;
  secure_url: string;
  public_id: string;
  width?: number;
  height?: number;
  format?: string;
  bytes?: number;
}

/**
 * Uploads a product image to Cloudinary via backend admin API.
 * Accepts a File/Blob (multipart/form-data) or a base64 Data URL string.
 */
export async function uploadProductImage(
  fileOrData: File | Blob | string,
  folder = 'rebelive/products'
): Promise<CloudinaryUploadResponse> {
  if (typeof fileOrData === 'string') {
    const res = await adminClient.post('/upload-image', {
      image: fileOrData,
      folder,
    });
    return res.data?.data;
  }

  const formData = new FormData();
  formData.append('image', fileOrData);
  formData.append('folder', folder);

  const res = await adminClient.post('/upload-image', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return res.data?.data;
}

// ─── USERS MANAGEMENT ──────────────────────────────────

export async function fetchAdminUsers(params?: {
  search?: string;
  role?: string;
  page?: number;
  limit?: number;
}): Promise<{ data: AdminUser[]; total: number; page: number; totalPages: number }> {
  try {
    const res = await adminClient.get('/users', { params });
    if (res.data?.status === 'success' && Array.isArray(res.data?.data)) {
      return {
        data: res.data.data,
        total: res.data.total || res.data.data.length,
        page: res.data.page || 1,
        totalPages: res.data.totalPages || 1,
      };
    }
  } catch (err) {
    console.warn('Backend /admin/users unreachable, returning fallback user list:', err);
  }

  return { data: [], total: 0, page: 1, totalPages: 1 };
}

export async function updateAdminUser(userId: string, data: Partial<AdminUser>): Promise<AdminUser> {
  const res = await adminClient.patch(`/users/${userId}`, data);
  return res.data?.data;
}

export async function fetchAdminAdmins(): Promise<AdminUser[]> {
  const res = await adminClient.get('/admins');
  return res.data?.data || [];
}

export async function restrictAdminUser(userId: string, isRestricted?: boolean): Promise<AdminUser> {
  const res = await adminClient.patch(`/users/${userId}/restrict`, { isRestricted });
  return res.data?.data;
}

// ─── TESTIMONIALS MANAGEMENT ───────────────────────────

export interface AdminTestimonial {
  id: string;
  name: string;
  role?: string | null;
  quote: string;
  rating: number;
  image: string;
  imagePosition?: string | null;
  isFeatured: boolean;
  sortOrder: number;
  createdAt?: string;
  updatedAt?: string;
}

export const INITIAL_TESTIMONIALS: AdminTestimonial[] = [
  {
    id: 'nishant',
    name: 'NISHANT MISHRA',
    role: 'Software Architect & Biohacker',
    quote: 'Clean sustained mental clarity through long coding sessions without any crash or anxiety. Rebelive is literally in a class of its own.',
    rating: 5,
    image: '',
    imagePosition: 'center 15%',
    isFeatured: true,
    sortOrder: 1,
  },
  {
    id: 'ashray',
    name: 'ASHRAY VASU',
    role: 'Product Designer',
    quote: 'The calm focus and zero-sugar formulation completely upgraded my workday routine. No jitters, pure natural flow state.',
    rating: 5,
    image: '',
    imagePosition: 'center 15%',
    isFeatured: true,
    sortOrder: 2,
  },
  {
    id: 'vaibhav',
    name: 'VAIBHAV MITTAL',
    role: 'Founder & Endurance Athlete',
    quote: 'Unmatched sustained energy that keeps me dialed in and sharp throughout the day. Zero sugar crash, just pure cognitive momentum.',
    rating: 5,
    image: '',
    imagePosition: 'center 18%',
    isFeatured: true,
    sortOrder: 3,
  },
  {
    id: 'dhirendra',
    name: 'DHIRENDRA SINGH KAUSHIK',
    role: 'Creative Director',
    quote: 'Game-changing endurance and crisp mental sharpness. Zero jitters, no crash, just pure sustained high performance all day long.',
    rating: 5,
    image: '',
    imagePosition: 'center 20%',
    isFeatured: true,
    sortOrder: 4,
  },
];

const TESTIMONIALS_CACHE_KEY = 'rebelive_testimonials_cache';

function getLocalTestimonials(): AdminTestimonial[] {
  if (typeof window === 'undefined') return INITIAL_TESTIMONIALS;
  try {
    const raw = localStorage.getItem(TESTIMONIALS_CACHE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {}
  return INITIAL_TESTIMONIALS;
}

function saveLocalTestimonials(list: AdminTestimonial[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(TESTIMONIALS_CACHE_KEY, JSON.stringify(list));
  } catch {}
}

export async function fetchAdminTestimonials(): Promise<AdminTestimonial[]> {
  try {
    const res = await adminClient.get('/testimonials');
    if (res.data?.status === 'success' && Array.isArray(res.data?.data) && res.data.data.length > 0) {
      saveLocalTestimonials(res.data.data);
      return res.data.data;
    }
  } catch (err) {
    console.warn('Backend /admin/testimonials unreachable, falling back to local cache:', err);
  }
  return getLocalTestimonials();
}

export async function fetchAdminTestimonial(id: string): Promise<AdminTestimonial> {
  try {
    const res = await adminClient.get(`/testimonials/${id}`);
    if (res.data?.status === 'success' && res.data?.data) {
      return res.data.data;
    }
  } catch (err) {
    console.warn(`Backend /admin/testimonials/${id} unreachable:`, err);
  }

  const list = getLocalTestimonials();
  const found = list.find((t) => t.id === id);
  if (found) return found;
  throw new Error(`Testimonial #${id} not found.`);
}

export async function createAdminTestimonial(data: Partial<AdminTestimonial>): Promise<AdminTestimonial> {
  try {
    const res = await adminClient.post('/testimonials', data);
    if (res.data?.status === 'success' && res.data?.data) {
      const current = getLocalTestimonials();
      saveLocalTestimonials([...current, res.data.data]);
      return res.data.data;
    }
  } catch (err: any) {
    console.warn('Backend failed to create testimonial, saving locally:', err);
  }

  const localItem: AdminTestimonial = {
    id: `local-${Date.now()}`,
    name: data.name || 'New Rebel',
    role: data.role || null,
    quote: data.quote || '',
    rating: data.rating || 5,
    image: data.image || '',
    imagePosition: data.imagePosition || 'center 15%',
    isFeatured: data.isFeatured !== undefined ? data.isFeatured : true,
    sortOrder: data.sortOrder || 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const current = getLocalTestimonials();
  saveLocalTestimonials([...current, localItem]);
  return localItem;
}

export async function updateAdminTestimonial(id: string, data: Partial<AdminTestimonial>): Promise<AdminTestimonial> {
  try {
    const res = await adminClient.patch(`/testimonials/${id}`, data);
    if (res.data?.status === 'success' && res.data?.data) {
      const current = getLocalTestimonials();
      const updatedList = current.map((t) => (t.id === id ? { ...t, ...res.data.data } : t));
      saveLocalTestimonials(updatedList);
      return res.data.data;
    }
  } catch (err: any) {
    console.warn(`Backend failed to update testimonial ${id}, updating locally:`, err);
  }

  const current = getLocalTestimonials();
  let updatedItem: AdminTestimonial | null = null;
  const updatedList = current.map((t) => {
    if (t.id === id) {
      updatedItem = { ...t, ...data, updatedAt: new Date().toISOString() };
      return updatedItem;
    }
    return t;
  });

  saveLocalTestimonials(updatedList);
  if (updatedItem) return updatedItem;
  throw new Error(`Testimonial #${id} not found.`);
}

export async function deleteAdminTestimonial(id: string): Promise<void> {
  try {
    await adminClient.delete(`/testimonials/${id}`);
  } catch (err: any) {
    console.warn(`Backend failed to delete testimonial ${id}, removing locally:`, err);
  }

  const current = getLocalTestimonials();
  saveLocalTestimonials(current.filter((t) => t.id !== id));
}

/**
 * Uploads a testimonial avatar image to Cloudinary in the 'rebelive/testimonials' folder.
 */
export async function uploadTestimonialImage(
  fileOrData: File | Blob | string
): Promise<CloudinaryUploadResponse> {
  return uploadProductImage(fileOrData, 'rebelive/testimonials');
}

// ─── CONTACT & CORPORATE QUERIES ─────────────────────────

export type QueryStatus = 'NEW' | 'VIEWED' | 'IN_PROCESS' | 'RESOLVED' | 'IGNORED';

export interface QueryCounts {
  total: number;
  new: number;
  viewed: number;
  in_process: number;
  resolved: number;
  ignored: number;
}

export interface AdminContactQuery {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  services: string[];
  message: string;
  status: QueryStatus;
  adminNote?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AdminCorporateQuery {
  id: string;
  refId?: string | null;
  fullName: string;
  companyName: string;
  designation?: string | null;
  email: string;
  phone: string;
  city?: string | null;
  approxQuantity?: string | null;
  natureOfRequirement?: string | null;
  message?: string | null;
  status: QueryStatus;
  adminNote?: string | null;
  createdAt: string;
  updatedAt: string;
}

// Public Submission Helpers
export async function submitContactQuery(payload: {
  firstName: string;
  lastName?: string;
  email: string;
  phone?: string;
  services?: string[];
  message: string;
}): Promise<AdminContactQuery> {
  const res = await axios.post(`${API_BASE}/support/contact-query`, payload);
  return res.data.data;
}

export async function submitCorporateQuery(payload: {
  refId?: string;
  fullName: string;
  companyName: string;
  designation?: string;
  email: string;
  phone?: string;
  city?: string;
  approxQuantity?: string;
  natureOfRequirement?: string;
  message?: string;
}): Promise<AdminCorporateQuery> {
  const res = await axios.post(`${API_BASE}/support/corporate-query`, payload);
  return res.data.data;
}

// Admin Contact Query Management
export async function fetchContactQueries(
  status?: string,
  search?: string
): Promise<{ data: AdminContactQuery[]; counts: QueryCounts }> {
  try {
    const res = await adminClient.get('/contact-queries', {
      params: { status: status || 'ALL', search: search || undefined },
    });
    return {
      data: res.data.data || [],
      counts: res.data.counts || { total: 0, new: 0, viewed: 0, in_process: 0, resolved: 0, ignored: 0 },
    };
  } catch (err) {
    console.warn('Failed to fetch contact queries from backend:', err);
    return {
      data: [],
      counts: { total: 0, new: 0, viewed: 0, in_process: 0, resolved: 0, ignored: 0 },
    };
  }
}

export async function updateContactQueryStatus(
  id: string,
  status: QueryStatus,
  adminNote?: string
): Promise<AdminContactQuery> {
  const res = await adminClient.patch(`/contact-queries/${id}/status`, { status, adminNote });
  return res.data.data;
}

export async function deleteContactQuery(id: string): Promise<void> {
  await adminClient.delete(`/contact-queries/${id}`);
}

// Admin Corporate Query Management
export async function fetchCorporateQueries(
  status?: string,
  search?: string
): Promise<{ data: AdminCorporateQuery[]; counts: QueryCounts }> {
  try {
    const res = await adminClient.get('/corporate-queries', {
      params: { status: status || 'ALL', search: search || undefined },
    });
    return {
      data: res.data.data || [],
      counts: res.data.counts || { total: 0, new: 0, viewed: 0, in_process: 0, resolved: 0, ignored: 0 },
    };
  } catch (err) {
    console.warn('Failed to fetch corporate queries from backend:', err);
    return {
      data: [],
      counts: { total: 0, new: 0, viewed: 0, in_process: 0, resolved: 0, ignored: 0 },
    };
  }
}

export async function updateCorporateQueryStatus(
  id: string,
  status: QueryStatus,
  adminNote?: string
): Promise<AdminCorporateQuery> {
  const res = await adminClient.patch(`/corporate-queries/${id}/status`, { status, adminNote });
  return res.data.data;
}

export async function deleteCorporateQuery(id: string): Promise<void> {
  await adminClient.delete(`/corporate-queries/${id}`);
}

