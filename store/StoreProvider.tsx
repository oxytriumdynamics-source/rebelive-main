'use client';

import React, { useEffect, useRef } from 'react';
import { Provider } from 'react-redux';
import { store } from './store';
import { useAppDispatch } from './hooks';
import { getMe } from './slices/authslice';
import { hydrateCart } from './slices/cartSlice';

/**
 * Dispatches getMe on website load to verify user is logged in or not from the backend.
 * Also safely hydrates cart state from localStorage.
 */
function AuthInitializer() {
  const dispatch = useAppDispatch();
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    // Call getMe from backend to verify user is logged in or not on website load
    dispatch(getMe());
    dispatch(hydrateCart());
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
