import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authslice';
import cartReducer from './slices/cartSlice';
import productReducer from './slices/productSlice';
import profileReducer from './slices/profileSlice';
import shippingReducer from './slices/shippingSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    products: productReducer,
    profile: profileReducer,
    shipping: shippingReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types for serializable checks
        ignoredActions: ['auth/register/fulfilled', 'auth/login/fulfilled'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
