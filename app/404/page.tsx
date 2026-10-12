'use client';

import React from 'react';
import { NotFoundState } from '@/components/ui/NotFoundState';

export default function NotFoundPage() {
  return (
    <NotFoundState
      code="404"
      title="Oops, the page was not found..."
      description="It looks like the page you tried to find doesn't exist, has been drunk dry, or isn't named like that."
      actionHref="/shop"
      actionLabel="Explore Shop"
      showHomeButton={true}
      isEmbedded={false}
    />
  );
}
