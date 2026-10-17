import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Product } from '@/data/products';
import { fetchProducts as apiFetchProducts, fetchProductBySlug as apiFetchProductBySlug } from '@/lib/productsApi';
import type { RootState } from '../store';

export interface ProductState {
  products: Product[];
  currentProduct: Product | null;
  loading: boolean;
  error: string | null;
  lastFetched: number | null;
}

const initialState: ProductState = {
  products: [],
  currentProduct: null,
  loading: false,
  error: null,
  lastFetched: null,
};

/**
 * Async thunk to fetch all products from backend MongoDB API
 */
export const fetchProducts = createAsyncThunk<
  Product[],
  boolean | undefined,
  { rejectValue: string }
>('products/fetchAll', async (forceRefresh = false, { rejectWithValue }) => {
  try {
    const data = await apiFetchProducts(forceRefresh);
    if (!data || data.length === 0) {
      return rejectWithValue('No products found in backend database');
    }
    return data;
  } catch (err: any) {
    return rejectWithValue(err.message || 'Failed to fetch products');
  }
});

/**
 * Async thunk to fetch a single product by slug or id from backend MongoDB API
 */
export const fetchProductBySlug = createAsyncThunk<
  Product,
  string,
  { rejectValue: string }
>('products/fetchBySlug', async (slugOrId, { rejectWithValue }) => {
  try {
    const data = await apiFetchProductBySlug(slugOrId);
    if (!data) {
      return rejectWithValue(`Product "${slugOrId}" not found`);
    }
    return data;
  } catch (err: any) {
    return rejectWithValue(err.message || `Failed to fetch product "${slugOrId}"`);
  }
});

export const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setCurrentProduct: (state, action: PayloadAction<Product | null>) => {
      state.currentProduct = action.payload;
    },
    clearProductError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // ── fetchProducts ──────────────────────────────────────────
    builder.addCase(fetchProducts.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchProducts.fulfilled, (state, action) => {
      state.loading = false;
      state.products = action.payload;
      state.lastFetched = Date.now();
      state.error = null;
    });
    builder.addCase(fetchProducts.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || 'Failed to load products';
    });

    // ── fetchProductBySlug ─────────────────────────────────────
    builder.addCase(fetchProductBySlug.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchProductBySlug.fulfilled, (state, action) => {
      state.loading = false;
      state.currentProduct = action.payload;
      state.error = null;
      // Also update or insert into the products list if not present
      const idx = state.products.findIndex((p) => p.id === action.payload.id);
      if (idx >= 0) {
        state.products[idx] = action.payload;
      } else {
        state.products.push(action.payload);
      }
    });
    builder.addCase(fetchProductBySlug.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || 'Failed to load product details';
    });
  },
});

export const { setCurrentProduct, clearProductError } = productSlice.actions;

// ── Selectors ──────────────────────────────────────────────────
export const selectProducts = (state: RootState) => state.products.products;
export const selectCurrentProduct = (state: RootState) => state.products.currentProduct;
export const selectProductsLoading = (state: RootState) => state.products.loading;
export const selectProductsError = (state: RootState) => state.products.error;
export const selectProductByIdOrSlug = (idOrSlug: string) => (state: RootState) => {
  const clean = idOrSlug.toLowerCase().trim();
  return (
    state.products.products.find(
      (p) => p.id.toLowerCase() === clean || (p.flavor && p.flavor.toLowerCase().includes(clean))
    ) || null
  );
};

export default productSlice.reducer;
