import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface CartItem {
  id: string;
  name: string;
  flavor: string;
  image: string;
  packSize: number;
  quantity: number;
  pricePerUnit: number;
}

export interface CartState {
  items: CartItem[];
  isOpen: boolean;
  lastAddedId: string | null;
}

const CART_STORAGE_KEY = 'rebelive_cart_v1';

function loadSavedCart(): CartItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {
    // Ignore storage errors
  }
  return [];
}

function persistCart(items: CartItem[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  } catch (e) {
    // Ignore storage errors
  }
}

const initialState: CartState = {
  items: [],
  isOpen: false,
  lastAddedId: null,
};

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    hydrateCart: (state) => {
      state.items = loadSavedCart();
    },
    openCart: (state) => {
      state.isOpen = true;
    },
    closeCart: (state) => {
      state.isOpen = false;
    },
    toggleCart: (state) => {
      state.isOpen = !state.isOpen;
    },
    addToCart: (
      state,
      action: PayloadAction<{
        id: string;
        name: string;
        flavor: string;
        image: string;
        packSize: number;
        quantity: number;
        pricePerUnit: number;
      }>
    ) => {
      const { id, packSize, quantity } = action.payload;
      const existing = state.items.find(
        (item) => item.id === id && item.packSize === packSize
      );

      if (existing) {
        existing.quantity += quantity;
      } else {
        state.items.push(action.payload);
      }

      state.lastAddedId = id;
      state.isOpen = true;
      persistCart(state.items);
    },
    removeFromCart: (
      state,
      action: PayloadAction<{ id: string; packSize: number }>
    ) => {
      state.items = state.items.filter(
        (item) =>
          !(item.id === action.payload.id && item.packSize === action.payload.packSize)
      );
      persistCart(state.items);
    },
    updateQuantity: (
      state,
      action: PayloadAction<{ id: string; packSize: number; quantity: number }>
    ) => {
      const item = state.items.find(
        (i) => i.id === action.payload.id && i.packSize === action.payload.packSize
      );
      if (item) {
        if (action.payload.quantity <= 0) {
          state.items = state.items.filter(
            (i) =>
              !(i.id === action.payload.id && i.packSize === action.payload.packSize)
          );
        } else {
          item.quantity = action.payload.quantity;
        }
      }
      persistCart(state.items);
    },
    clearCart: (state) => {
      state.items = [];
      persistCart([]);
    },
  },
});

export const {
  hydrateCart,
  openCart,
  closeCart,
  toggleCart,
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;
