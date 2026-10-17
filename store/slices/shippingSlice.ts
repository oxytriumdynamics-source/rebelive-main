import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
  TrackingResult,
  FastrrCheckoutItemInput,
  FastrrInitiateResponse,
  FastrrCompleteInput,
  FastrrCompleteResponse,
  ConfirmFastrrOrderInput,
  trackShipment as apiTrackShipment,
  getOrderWebhookStatus as apiGetOrderWebhookStatus,
  initiateFastrrCheckout as apiInitiateFastrrCheckout,
  completeFastrrCheckout as apiCompleteFastrrCheckout,
  confirmFastrrOrder as apiConfirmFastrrOrder,
} from '@/lib/shiprocketApi';
import type { RootState } from '../store';

export interface WebhookSyncStatus {
  connected: boolean;
  orderFound: boolean;
  fastrrWebhookSynced: boolean;
  shiprocketWebhookSynced: boolean;
  awbAssigned: boolean;
  trackingNumber: string | null;
  currentStatus: string;
  lastWebhookEvent: string;
  syncedAt: string;
}

export interface ShippingState {
  trackingResult: TrackingResult | null;
  webhookStatus: WebhookSyncStatus | null;
  lastInitiatedSession: FastrrInitiateResponse | null;
  lastCompletedOrder: FastrrCompleteResponse | null;
  loading: boolean;
  syncing: boolean;
  error: string | null;
}

const initialState: ShippingState = {
  trackingResult: null,
  webhookStatus: null,
  lastInitiatedSession: null,
  lastCompletedOrder: null,
  loading: false,
  syncing: false,
  error: null,
};

/**
 * Async thunk: Track shipment via Shiprocket
 */
export const trackShipmentThunk = createAsyncThunk<
  TrackingResult,
  string,
  { rejectValue: string }
>('shipping/trackShipment', async (identifier, { rejectWithValue }) => {
  try {
    const data = await apiTrackShipment(identifier);
    return data;
  } catch (err: any) {
    return rejectWithValue(err.message || `Failed to track shipment ${identifier}`);
  }
});

/**
 * Async thunk: Get live Order Webhook sync & tracking status
 */
export const getOrderWebhookStatusThunk = createAsyncThunk<
  { tracking: TrackingResult; webhookStatus: WebhookSyncStatus },
  string,
  { rejectValue: string }
>('shipping/getWebhookStatus', async (identifier, { rejectWithValue }) => {
  try {
    const data = await apiGetOrderWebhookStatus(identifier);
    return data;
  } catch (err: any) {
    return rejectWithValue(err.message || `Failed to get webhook status for ${identifier}`);
  }
});

/**
 * Async thunk: Initiate Fastrr 1-Click checkout
 */
export const initiateFastrrCheckoutThunk = createAsyncThunk<
  FastrrInitiateResponse,
  {
    items: FastrrCheckoutItemInput[];
    customer?: { name?: string; email?: string; phone?: string };
    couponCode?: string;
  },
  { rejectValue: string }
>('shipping/initiateFastrr', async (params, { rejectWithValue }) => {
  try {
    const res = await apiInitiateFastrrCheckout(params);
    return res;
  } catch (err: any) {
    return rejectWithValue(err.message || 'Failed to initiate Fastrr checkout');
  }
});

/**
 * Async thunk: Complete Fastrr checkout
 */
export const completeFastrrCheckoutThunk = createAsyncThunk<
  FastrrCompleteResponse,
  FastrrCompleteInput,
  { rejectValue: string }
>('shipping/completeFastrr', async (payload, { rejectWithValue }) => {
  try {
    const res = await apiCompleteFastrrCheckout(payload);
    return res;
  } catch (err: any) {
    return rejectWithValue(err.message || 'Failed to complete checkout');
  }
});

/**
 * Async thunk: Confirm and persist Fastrr order in MongoDB (guest or user)
 */
export const confirmFastrrOrderThunk = createAsyncThunk<
  any,
  ConfirmFastrrOrderInput,
  { rejectValue: string }
>('shipping/confirmFastrr', async (payload, { rejectWithValue }) => {
  try {
    const res = await apiConfirmFastrrOrder(payload);
    return res;
  } catch (err: any) {
    return rejectWithValue(err.message || 'Failed to confirm Fastrr order');
  }
});

export const shippingSlice = createSlice({
  name: 'shipping',
  initialState,
  reducers: {
    clearTrackingResult: (state) => {
      state.trackingResult = null;
      state.webhookStatus = null;
      state.error = null;
    },
    clearShippingError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // ── trackShipmentThunk ────────────────────────────────────────
    builder.addCase(trackShipmentThunk.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(trackShipmentThunk.fulfilled, (state, action) => {
      state.loading = false;
      state.trackingResult = action.payload;
      state.error = null;
    });
    builder.addCase(trackShipmentThunk.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || 'Tracking inquiry failed';
    });

    // ── getOrderWebhookStatusThunk ────────────────────────────────
    builder.addCase(getOrderWebhookStatusThunk.pending, (state) => {
      state.syncing = true;
    });
    builder.addCase(getOrderWebhookStatusThunk.fulfilled, (state, action) => {
      state.syncing = false;
      state.trackingResult = action.payload.tracking;
      state.webhookStatus = action.payload.webhookStatus;
      state.error = null;
    });
    builder.addCase(getOrderWebhookStatusThunk.rejected, (state, action) => {
      state.syncing = false;
      state.error = action.payload || 'Webhook status synchronization failed';
    });

    // ── initiateFastrrCheckoutThunk ───────────────────────────────
    builder.addCase(initiateFastrrCheckoutThunk.fulfilled, (state, action) => {
      state.lastInitiatedSession = action.payload;
    });

    // ── completeFastrrCheckoutThunk ───────────────────────────────
    builder.addCase(completeFastrrCheckoutThunk.fulfilled, (state, action) => {
      state.lastCompletedOrder = action.payload;
    });

    // ── confirmFastrrOrderThunk ───────────────────────────────────
    builder.addCase(confirmFastrrOrderThunk.fulfilled, (state, action) => {
      if (action.payload) {
        state.lastCompletedOrder = action.payload;
      }
    });
  },
});

export const { clearTrackingResult, clearShippingError } = shippingSlice.actions;

// ── Selectors ──────────────────────────────────────────────────
export const selectTrackingResult = (state: RootState) => state.shipping.trackingResult;
export const selectWebhookStatus = (state: RootState) => state.shipping.webhookStatus;
export const selectShippingLoading = (state: RootState) => state.shipping.loading;
export const selectShippingSyncing = (state: RootState) => state.shipping.syncing;
export const selectShippingError = (state: RootState) => state.shipping.error;

export default shippingSlice.reducer;
