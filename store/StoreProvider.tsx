'use client';

import React, { useEffect, useRef } from 'react';
import { Provider } from 'react-redux';
import { store } from './store';
import { useAppDispatch } from './hooks';
import { getMe } from './slices/authslice';
import { hydrateCart } from './slices/cartSlice';
import { fetchProducts } from './slices/productSlice';

/**
 * Dispatches getMe, hydrateCart, and fetchProducts on website load.
 * Keeps user session, cart state, and live product catalog synced across the entire app.
 */
function AuthInitializer() {
  const dispatch = useAppDispatch();
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    // Call getMe from backend to verify user session
    dispatch(getMe());
    dispatch(hydrateCart());
    dispatch(fetchProducts());
  }, [dispatch]);

  return null;
}

export default function StoreProvider({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <AuthInitializer />
      {children}
    </Provider>
  );
}
