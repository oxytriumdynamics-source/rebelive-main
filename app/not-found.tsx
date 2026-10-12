'use client';

import React from 'react';
import { NotFoundState } from '@/components/ui/NotFoundState';

export default function GlobalNotFound() {
  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center pt-20 pb-16 px-4">
      <NotFoundState
        code="404"
        badge="404_NOT_FOUND"
        title="Page Not Found"
        description="The page or resource you are looking for does not exist, has been removed, or is temporarily unavailable."
        actionHref="/shop"
        actionLabel="Explore Shop"
        showHomeButton={true}
      />
    </main>
  );
}
