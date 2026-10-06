'use client';

import { useEffect } from 'react';
import { useReportWebVitals } from 'next/web-vitals';
import { reportWebVitals } from '@/lib/webVitals';

export function WebVitalsReporter() {
  useReportWebVitals((metric) => {
    if (process.env.NODE_ENV === 'development') {
      const color =
        metric.rating === 'good'
          ? '#22c55e'
          : metric.rating === 'needs-improvement'
          ? '#eab308'
          : '#ef4444';
      console.log(
        `%c[Next.js Vitals] ${metric.name}: ${Math.round(metric.value)}${metric.name === 'CLS' ? '' : 'ms'} (${metric.rating})`,
        `color: ${color}; font-weight: bold;`
      );
    }
    if (typeof navigator !== 'undefined' && navigator.sendBeacon && process.env.NODE_ENV !== 'development') {
      try {
        navigator.sendBeacon(
          '/api/vitals',
          JSON.stringify({
            name: metric.name,
            value: metric.value,
            rating: metric.rating,
            id: metric.id,
            url: typeof window !== 'undefined' ? window.location.href : '',
            timestamp: Date.now(),
          })
        );
      } catch {}
    }
  });

  useEffect(() => {
    reportWebVitals();
  }, []);

  return null;
}
