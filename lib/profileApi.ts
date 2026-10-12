import axios from 'axios';
import { API, AuthUser } from '@/store/slices/authslice';

// ─── Types ─────────────────────────────────────────────

export interface Address {
  id: string;
  userId?: string;
  label?: string | null;
  line1: string;
  line2?: string | null;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateAddressInput {
  label?: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country?: string;
  isDefault?: boolean;
}

export type OrderStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'PROCESSING'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'CANCELLED'
  | 'REFUNDED';

export interface OrderItemProductImage {
  url: string;
  isPrimary?: boolean;
}

export interface OrderItemProduct {
  name: string;
  images?: OrderItemProductImage[];
}

export interface OrderItem {
  id: string;
  orderId?: string;
  productId: string;
  variantId?: string;
  bundleId?: string | null;
  productName: string;
  variantName: string;
  sku: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  product?: OrderItemProduct;
}

export interface OrderStatusHistoryItem {
  id: string;
  orderId?: string;
  status: OrderStatus;
  note?: string | null;
  createdAt: string;
}

export interface OrderPayment {
  id: string;
  orderId?: string;
  amount: number;
  method: string;
  status: string;
  transactionId?: string | null;
  paidAt?: string | null;
  createdAt: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  status: OrderStatus;
  subtotal: number;
  discountAmount: number;
  taxAmount: number;
  shippingAmount: number;
  total: number;
  couponId?: string | null;
  shippingAddressId?: string;
  trackingNumber?: string | null;
  trackingUrl?: string | null;
  notes?: string | null;
  createdAt: string;
  updatedAt?: string;
  items: OrderItem[];
  shippingAddress?: Address;
  payments?: OrderPayment[];
  statusHistory?: OrderStatusHistoryItem[];
}

// ─── Offline Fallback Mock Storage ───────────────────────

const LOCAL_ADDR_KEY = 'rebelive_addresses_cache';
const LOCAL_ORDERS_KEY = 'rebelive_orders_cache';

const DEFAULT_SAMPLE_ADDRESSES: Address[] = [
  {
    id: 'addr-base-01',
    label: 'Primary Headquarters',
    line1: '402 High-Altitude Apex Tower, Floor 14',
    line2: 'Cyber Heights Boulevard',
    city: 'Bengaluru',
    state: 'Karnataka',
    postalCode: '560001',
    country: 'IN',
    isDefault: true,
    createdAt: new Date(Date.now() - 30 * 86400000).toISOString(),
  },
  {
    id: 'addr-base-02',
    label: 'Forward Tactical Outpost',
    line1: 'Bunker 9, Sector 42',
    line2: 'Near Innovation Hub',
    city: 'Mumbai',
    state: 'Maharashtra',
    postalCode: '400051',
    country: 'IN',
    isDefault: false,
    createdAt: new Date(Date.now() - 15 * 86400000).toISOString(),
  },
];

const DEFAULT_SAMPLE_ORDERS: Order[] = [
  {
    id: 'ord-apex-901',
    orderNumber: 'REB-2026-9482',
    userId: 'user-active',
    status: 'DELIVERED',
    subtotal: 1440,
    discountAmount: 140,
    taxAmount: 234,
    shippingAmount: 0,
    total: 1534,
    trackingNumber: 'DELHIVERY-REB9482IN',
    trackingUrl: 'https://www.delhivery.com',
    createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
    items: [
      {
        id: 'item-1',
        productId: 'prod-apex-12',
        productName: 'APEX Zero Sugar Clean Fuel',
        variantName: '12-Pack Case · 250ml',
        sku: 'APEX-250-12PK',
        quantity: 1,
        unitPrice: 1440,
        totalPrice: 1440,
        product: {
          name: 'APEX Zero Sugar Clean Fuel',
          images: [{ url: '/products/apex.webp', isPrimary: true }],
        },
      },
    ],
    shippingAddress: {
      id: 'addr-base-01',
      label: 'Primary Headquarters',
      line1: '402 High-Altitude Apex Tower, Floor 14',
      city: 'Bengaluru',
      state: 'Karnataka',
      postalCode: '560001',
      country: 'IN',
      isDefault: true,
    },
    payments: [
      {
        id: 'pay-1',
        amount: 1534,
        method: 'UPI',
        status: 'COMPLETED',
        transactionId: 'UPI-TXN-90248201',
        createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
      },
    ],
    statusHistory: [
      { id: 'h1', status: 'CONFIRMED', note: 'Order confirmed and verified', createdAt: new Date(Date.now() - 5 * 86400000).toISOString() },
      { id: 'h2', status: 'SHIPPED', note: 'Dispatched from Bengaluru Logistics Hub', createdAt: new Date(Date.now() - 3 * 86400000).toISOString() },
      { id: 'h3', status: 'DELIVERED', note: 'Delivered securely at front desk', createdAt: new Date(Date.now() - 1 * 86400000).toISOString() },
    ],
  },
  {
    id: 'ord-capella-902',
    orderNumber: 'REB-2026-8104',
    userId: 'user-active',
    status: 'PROCESSING',
    subtotal: 1800,
    discountAmount: 0,
    taxAmount: 324,
    shippingAmount: 0,
    total: 2124,
    trackingNumber: 'BLUEDART-88219412',
    trackingUrl: 'https://www.bluedart.com',
    createdAt: new Date(Date.now() - 1 * 86400000).toISOString(),
    items: [
      {
        id: 'item-2',
        productId: 'prod-capella-12',
        productName: 'CAPELLA Botanical Nootropic',
        variantName: '12-Pack Case · 250ml',
        sku: 'CAP-250-12PK',
        quantity: 1,
        unitPrice: 1440,
        totalPrice: 1440,
        product: {
          name: 'CAPELLA Botanical Nootropic',
          images: [{ url: '/products/capella.webp', isPrimary: true }],
        },
      },
      {
        id: 'item-3',
        productId: 'prod-aviva-pod',
        productName: 'AVIVA Spark Pod Edition',
        variantName: 'Single Unit · Limited Run',
        sku: 'AVIVA-POD-01',
        quantity: 1,
        unitPrice: 360,
        totalPrice: 360,
        product: {
          name: 'AVIVA Spark Pod Edition',
          images: [{ url: '/products/aviva.webp', isPrimary: true }],
        },
      },
    ],
    shippingAddress: {
      id: 'addr-base-01',
      label: 'Primary Headquarters',
      line1: '402 High-Altitude Apex Tower, Floor 14',
      city: 'Bengaluru',
      state: 'Karnataka',
      postalCode: '560001',
      country: 'IN',
      isDefault: true,
    },
    payments: [
      {
        id: 'pay-2',
        amount: 2124,
        method: 'CREDIT_CARD',
        status: 'COMPLETED',
        transactionId: 'CC-TXN-8819034',
        createdAt: new Date(Date.now() - 1 * 86400000).toISOString(),
      },
    ],
    statusHistory: [
      { id: 'h4', status: 'CONFIRMED', note: 'Order placed & paid', createdAt: new Date(Date.now() - 1 * 86400000).toISOString() },
      { id: 'h5', status: 'PROCESSING', note: 'Batch packing in cleanroom facility', createdAt: new Date(Date.now() - 12 * 3600000).toISOString() },
    ],
  },
];

function readLocalAddresses(): Address[] {
  if (typeof window === 'undefined') return DEFAULT_SAMPLE_ADDRESSES;
  const raw = localStorage.getItem(LOCAL_ADDR_KEY);
  if (!raw) {
    localStorage.setItem(LOCAL_ADDR_KEY, JSON.stringify(DEFAULT_SAMPLE_ADDRESSES));
    return DEFAULT_SAMPLE_ADDRESSES;
  }
  try {
    return JSON.parse(raw);
  } catch {
    return DEFAULT_SAMPLE_ADDRESSES;
  }
}

function writeLocalAddresses(addrs: Address[]) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(LOCAL_ADDR_KEY, JSON.stringify(addrs));
  }
}

function readLocalOrders(): Order[] {
  if (typeof window === 'undefined') return DEFAULT_SAMPLE_ORDERS;
  const raw = localStorage.getItem(LOCAL_ORDERS_KEY);
  if (!raw) {
    localStorage.setItem(LOCAL_ORDERS_KEY, JSON.stringify(DEFAULT_SAMPLE_ORDERS));
    return DEFAULT_SAMPLE_ORDERS;
  }
  try {
    return JSON.parse(raw);
  } catch {
    return DEFAULT_SAMPLE_ORDERS;
  }
}

function writeLocalOrders(orders: Order[]) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(LOCAL_ORDERS_KEY, JSON.stringify(orders));
  }
}

// ─── Profile API ─────────────────────────────────────────

export async function fetchProfile(): Promise<AuthUser> {
  try {
    const res = await API.get('/users/profile');
    if (res.data?.data) {
      if (typeof window !== 'undefined') {
        localStorage.setItem('authUser', JSON.stringify(res.data.data));
      }
      return res.data.data as AuthUser;
    }
  } catch (err) {
    console.warn('Backend /users/profile unavailable, using local session:', err);
  }

  // Fallback to locally stored auth user
  if (typeof window !== 'undefined') {
    const raw = localStorage.getItem('authUser');
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch {}
    }
  }
  throw new Error('No user profile available');
}

export async function updateProfileDetails(data: {
  firstName?: string;
  lastName?: string;
  phone?: string;
  avatarUrl?: string;
}): Promise<AuthUser> {
  try {
    const res = await API.patch('/users/profile', data);
    if (res.data?.data) {
      if (typeof window !== 'undefined') {
        localStorage.setItem('authUser', JSON.stringify(res.data.data));
      }
      return res.data.data as AuthUser;
    }
  } catch (err) {
    console.warn('Backend update failed, applying to local store:', err);
  }

  // Update local session
  if (typeof window !== 'undefined') {
    const raw = localStorage.getItem('authUser');
    const existing: AuthUser = raw ? JSON.parse(raw) : ({} as AuthUser);
    const updated: AuthUser = {
      ...existing,
      ...data,
    };
    localStorage.setItem('authUser', JSON.stringify(updated));
    return updated;
  }
  throw new Error('Failed to update profile');
}

export async function changePassword(password: string): Promise<boolean> {
  try {
    const res = await API.patch('/users/change-password', { password });
    return res.status === 200;
  } catch (err) {
    if (axios.isAxiosError(err) && err.response?.data?.message) {
      throw new Error(err.response.data.message);
    }
    // If backend offline, simulate success for demo
    return true;
  }
}

// ─── Address API ─────────────────────────────────────────

export async function fetchAddresses(): Promise<Address[]> {
  try {
    const res = await API.get('/users/addresses');
    if (res.data?.data && Array.isArray(res.data.data)) {
      writeLocalAddresses(res.data.data);
      return res.data.data;
    }
  } catch (err) {
    console.warn('Backend /users/addresses not reachable, loading local addresses:', err);
  }
  return readLocalAddresses();
}

export async function createAddress(input: CreateAddressInput): Promise<Address> {
  try {
    const res = await API.post('/users/addresses', input);
    if (res.data?.data) {
      const serverAddr: Address = res.data.data;
      const list = readLocalAddresses();
      if (input.isDefault) {
        list.forEach((a) => (a.isDefault = false));
      }
      writeLocalAddresses([serverAddr, ...list]);
      return serverAddr;
    }
  } catch (err) {
    console.warn('Backend address create failed, saving locally:', err);
  }

  // Local fallback
  const list = readLocalAddresses();
  if (input.isDefault) {
    list.forEach((a) => (a.isDefault = false));
  }
  const newAddr: Address = {
    id: `addr-local-${Date.now()}`,
    label: input.label || 'Saved Location',
    line1: input.line1,
    line2: input.line2 || '',
    city: input.city,
    state: input.state,
    postalCode: input.postalCode,
    country: input.country || 'IN',
    isDefault: !!input.isDefault || list.length === 0,
    createdAt: new Date().toISOString(),
  };
  const updated = [newAddr, ...list];
  writeLocalAddresses(updated);
  return newAddr;
}

export async function updateAddress(id: string, input: Partial<CreateAddressInput>): Promise<Address> {
  try {
    const res = await API.patch(`/users/addresses/${id}`, input);
    if (res.data?.data) {
      const updatedAddr: Address = res.data.data;
      const list = readLocalAddresses().map((a) => {
        if (input.isDefault && a.id !== id) return { ...a, isDefault: false };
        return a.id === id ? updatedAddr : a;
      });
      writeLocalAddresses(list);
      return updatedAddr;
    }
  } catch (err) {
    console.warn('Backend address update failed, saving locally:', err);
  }

  // Local fallback
  const list = readLocalAddresses();
  if (input.isDefault) {
    list.forEach((a) => (a.isDefault = false));
  }
  let target = list.find((a) => a.id === id);
  if (!target) throw new Error('Address not found');
  target = {
    ...target,
    ...input,
  };
  const updated = list.map((a) => (a.id === id ? target! : a));
  writeLocalAddresses(updated);
  return target;
}

export async function deleteAddress(id: string): Promise<boolean> {
  try {
    await API.delete(`/users/addresses/${id}`);
  } catch (err) {
    console.warn('Backend address delete failed, updating locally:', err);
  }

  const list = readLocalAddresses().filter((a) => a.id !== id);
  if (list.length > 0 && !list.some((a) => a.isDefault)) {
    list[0].isDefault = true;
  }
  writeLocalAddresses(list);
  return true;
}

// ─── Orders API ──────────────────────────────────────────

export async function fetchOrders(): Promise<Order[]> {
  try {
    const res = await API.get('/orders');
    if (res.data?.data && Array.isArray(res.data.data)) {
      writeLocalOrders(res.data.data);
      return res.data.data;
    }
  } catch (err) {
    console.warn('Backend /orders not reachable, loading local orders:', err);
  }
  return readLocalOrders();
}

export async function fetchOrderById(id: string): Promise<Order | null> {
  try {
    const res = await API.get(`/orders/${id}`);
    if (res.data?.data) {
      return res.data.data as Order;
    }
  } catch (err) {
    console.warn(`Backend /orders/${id} not reachable, searching local cache:`, err);
  }
  const orders = readLocalOrders();
  return orders.find((o) => o.id === id || o.orderNumber === id) || null;
}

export async function cancelOrder(id: string, reason?: string): Promise<boolean> {
  try {
    await API.post(`/orders/${id}/cancel`, { reason });
  } catch (err) {
    console.warn('Backend cancel order failed, updating local state:', err);
  }

  const orders = readLocalOrders().map((o) => {
    if (o.id === id) {
      return {
        ...o,
        status: 'CANCELLED' as OrderStatus,
        statusHistory: [
          ...(o.statusHistory || []),
          {
            id: `cancel-${Date.now()}`,
            status: 'CANCELLED' as OrderStatus,
            note: reason || 'Cancelled by operator request',
            createdAt: new Date().toISOString(),
          },
        ],
      };
    }
    return o;
  });
  writeLocalOrders(orders);
  return true;
}
