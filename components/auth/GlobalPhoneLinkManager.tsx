'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAppSelector } from '@/store/hooks';
import LinkPhoneModal from './LinkPhoneModal';

export default function GlobalPhoneLinkManager() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isAuthenticated, loading } = useAppSelector((s) => s.auth);

  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (loading || !isAuthenticated || !user) return;

    const queryPrompt = searchParams?.get('link_phone') === 'true';

    // If query param is explicitly set, open modal immediately
    if (queryPrompt && !user.phone) {
      setIsOpen(true);
      return;
    }

    // If user has no phone saved and hasn't dismissed the prompt in this session
    if (!user.phone && typeof window !== 'undefined') {
      const dismissed = sessionStorage.getItem('rebelive_dismissed_phone_prompt');
      if (dismissed !== 'true') {
        const timer = setTimeout(() => {
          setIsOpen(true);
        }, 1200);
        return () => clearTimeout(timer);
      }
    }
  }, [searchParams, user, isAuthenticated, loading]);

  function handleClose() {
    setIsOpen(false);
    // Remove query param from address bar if present
    if (typeof window !== 'undefined' && searchParams?.get('link_phone')) {
      const url = new URL(window.location.href);
      url.searchParams.delete('link_phone');
      window.history.replaceState({}, '', url.pathname + (url.search ? url.search : ''));
    }
  }

  function handleSuccess(mergedCount: number) {
    if (typeof window !== 'undefined' && searchParams?.get('link_phone')) {
      const url = new URL(window.location.href);
      url.searchParams.delete('link_phone');
      window.history.replaceState({}, '', url.pathname + (url.search ? url.search : ''));
    }
    // If past orders were merged, offer to route to profile to view them
    if (mergedCount > 0) {
      setTimeout(() => {
        router.push('/profile?tab=orders');
      }, 1500);
    }
  }

  return (
    <LinkPhoneModal
      isOpen={isOpen}
      onClose={handleClose}
      onSuccess={handleSuccess}
    />
  );
}
