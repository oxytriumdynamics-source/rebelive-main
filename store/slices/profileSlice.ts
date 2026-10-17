import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
  Order,
  Address,
  CreateAddressInput,
  fetchOrders as apiFetchOrders,
  fetchAddresses as apiFetchAddresses,
  createAddress as apiCreateAddress,
  updateAddress as apiUpdateAddress,
  deleteAddress as apiDeleteAddress,
  setDefaultAddress as apiSetDefaultAddress,
  updateProfileDetails as apiUpdateProfileDetails,
  cancelOrder as apiCancelOrder,
} from '@/lib/profileApi';
import type { RootState } from '../store';

export interface ProfileState {
  orders: Order[];
  addresses: Address[];
  selectedOrder: Order | null;
  loadingOrders: boolean;
  loadingAddresses: boolean;
  actionLoading: boolean;
  error: string | null;
}

const initialState: ProfileState = {
  orders: [],
  addresses: [],
  selectedOrder: null,
  loadingOrders: false,
  loadingAddresses: false,
  actionLoading: false,
  error: null,
};

/**
 * Async thunk: Fetch user's orders from backend
 */
export const fetchOrdersThunk = createAsyncThunk<
  Order[],
  void,
  { rejectValue: string }
>('profile/fetchOrders', async (_, { rejectWithValue }) => {
  try {
    const orders = await apiFetchOrders();
    return orders;
  } catch (err: any) {
    return rejectWithValue(err.message || 'Failed to fetch orders');
  }
});

export const fetchAddressesThunk = createAsyncThunk<
  Address[],
  void,
  { rejectValue: string }
>('profile/fetchAddresses', async () => {
  return [];
});

/**
 * Async thunk: Create new address
 */
export const createAddressThunk = createAsyncThunk<
  Address,
  CreateAddressInput,
  { rejectValue: string }
>('profile/createAddress', async (input, { rejectWithValue }) => {
  try {
    const newAddr = await apiCreateAddress(input);
    return newAddr;
  } catch (err: any) {
    return rejectWithValue(err.message || 'Failed to create address');
  }
});

/**
 * Async thunk: Update existing address
 */
export const updateAddressThunk = createAsyncThunk<
  Address,
  { id: string; input: Partial<CreateAddressInput> },
  { rejectValue: string }
>('profile/updateAddress', async ({ id, input }, { rejectWithValue }) => {
  try {
    const updated = await apiUpdateAddress(id, input);
    return updated;
  } catch (err: any) {
    return rejectWithValue(err.message || 'Failed to update address');
  }
});

/**
 * Async thunk: Delete address
 */
export const deleteAddressThunk = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>('profile/deleteAddress', async (id, { rejectWithValue }) => {
  try {
    await apiDeleteAddress(id);
    return id;
  } catch (err: any) {
    return rejectWithValue(err.message || 'Failed to delete address');
  }
});

/**
 * Async thunk: Set default address
 */
export const setDefaultAddressThunk = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>('profile/setDefaultAddress', async (id, { rejectWithValue }) => {
  try {
    await apiSetDefaultAddress(id);
    return id;
  } catch (err: any) {
    return rejectWithValue(err.message || 'Failed to set default address');
  }
});

/**
 * Async thunk: Update user profile details
 */
export const updateProfileThunk = createAsyncThunk<
  any,
  { firstName: string; lastName?: string; phone?: string },
  { rejectValue: string }
>('profile/updateDetails', async (data, { rejectWithValue }) => {
  try {
    const updated = await apiUpdateProfileDetails(data);
    return updated;
  } catch (err: any) {
    return rejectWithValue(err.message || 'Failed to update profile');
  }
});

/**
 * Async thunk: Cancel order
 */
export const cancelOrderThunk = createAsyncThunk<
  Order,
  { orderId: string; reason?: string },
  { rejectValue: string }
>('profile/cancelOrder', async ({ orderId, reason }, { rejectWithValue }) => {
  try {
    const cancelled = await apiCancelOrder(orderId, reason);
    return cancelled;
  } catch (err: any) {
    return rejectWithValue(err.message || 'Failed to cancel order');
  }
});

export const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    setSelectedOrder: (state, action: PayloadAction<Order | null>) => {
      state.selectedOrder = action.payload;
    },
    clearProfileError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // ── fetchOrdersThunk ──────────────────────────────────────────
    builder.addCase(fetchOrdersThunk.pending, (state) => {
      state.loadingOrders = true;
      state.error = null;
    });
    builder.addCase(fetchOrdersThunk.fulfilled, (state, action) => {
      state.loadingOrders = false;
      state.orders = action.payload;
      state.error = null;
    });
    builder.addCase(fetchOrdersThunk.rejected, (state, action) => {
      state.loadingOrders = false;
      state.error = action.payload || 'Failed to load orders';
    });

    // ── fetchAddressesThunk ───────────────────────────────────────
    builder.addCase(fetchAddressesThunk.pending, (state) => {
      state.loadingAddresses = true;
      state.error = null;
    });
    builder.addCase(fetchAddressesThunk.fulfilled, (state, action) => {
      state.loadingAddresses = false;
      state.addresses = action.payload;
      state.error = null;
    });
    builder.addCase(fetchAddressesThunk.rejected, (state, action) => {
      state.loadingAddresses = false;
      state.error = action.payload || 'Failed to load addresses';
    });

    // ── createAddressThunk ────────────────────────────────────────
    builder.addCase(createAddressThunk.pending, (state) => {
      state.actionLoading = true;
      state.error = null;
    });
    builder.addCase(createAddressThunk.fulfilled, (state, action) => {
      state.actionLoading = false;
      if (action.payload.isDefault) {
        state.addresses = state.addresses.map((a) => ({ ...a, isDefault: false }));
      }
      state.addresses.push(action.payload);
    });
    builder.addCase(createAddressThunk.rejected, (state, action) => {
      state.actionLoading = false;
      state.error = action.payload || 'Failed to create address';
    });

    // ── updateAddressThunk ────────────────────────────────────────
    builder.addCase(updateAddressThunk.fulfilled, (state, action) => {
      const idx = state.addresses.findIndex((a) => a.id === action.payload.id);
      if (idx >= 0) {
        state.addresses[idx] = action.payload;
      }
    });

    // ── deleteAddressThunk ────────────────────────────────────────
    builder.addCase(deleteAddressThunk.fulfilled, (state, action) => {
      state.addresses = state.addresses.filter((a) => a.id !== action.payload);
    });

    // ── setDefaultAddressThunk ────────────────────────────────────
    builder.addCase(setDefaultAddressThunk.fulfilled, (state, action) => {
      state.addresses = state.addresses.map((a) => ({
        ...a,
        isDefault: a.id === action.payload,
      }));
    });

    // ── cancelOrderThunk ──────────────────────────────────────────
    builder.addCase(cancelOrderThunk.fulfilled, (state, action) => {
      const idx = state.orders.findIndex((o) => o.id === action.payload.id);
      if (idx >= 0) {
        state.orders[idx] = action.payload;
      }
      if (state.selectedOrder?.id === action.payload.id) {
        state.selectedOrder = action.payload;
      }
    });
  },
});

export const { setSelectedOrder, clearProfileError } = profileSlice.actions;

// ── Selectors ──────────────────────────────────────────────────
export const selectProfileOrders = (state: RootState) => state.profile.orders;
export const selectProfileAddresses = (state: RootState) => state.profile.addresses;
export const selectSelectedOrder = (state: RootState) => state.profile.selectedOrder;
export const selectOrdersLoading = (state: RootState) => state.profile.loadingOrders;
export const selectAddressesLoading = (state: RootState) => state.profile.loadingAddresses;
export const selectProfileError = (state: RootState) => state.profile.error;

export default profileSlice.reducer;
