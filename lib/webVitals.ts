/**
 * Core Web Vitals Tracker
 * Lightweight zero-dependency performance observer for LCP, FID/INP, CLS, FCP, TTFB.
 */

export interface Metric {
  name: 'CLS' | 'FCP' | 'FID' | 'INP' | 'LCP' | 'TTFB';
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  delta: number;
  id: string;
}

const thresholds = {
  CLS: [0.1, 0.25],
  FCP: [1800, 3000],
  FID: [100, 300],
  INP: [200, 500],
  LCP: [2500, 4000],
  TTFB: [800, 1800],
};

function getRating(name: Metric['name'], val: number): Metric['rating'] {
  const [good, poor] = thresholds[name];
  if (val <= good) return 'good';
  if (val <= poor) return 'needs-improvement';
  return 'poor';
}

function generateId(): string {
  return `vitals-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export function reportWebVitals(onReport?: (metric: Metric) => void) {
  if (typeof window === 'undefined' || typeof PerformanceObserver === 'undefined') {
    return;
  }

  const dispatch = (name: Metric['name'], val: number) => {
    const metric: Metric = {
      name,
      value: Math.round(name === 'CLS' ? val * 1000 : val) / (name === 'CLS' ? 1000 : 1),
      rating: getRating(name, val),
      delta: val,
      id: generateId(),
    };

    if (onReport) {
      onReport(metric);
    } else {
      if (process.env.NODE_ENV === 'development') {
        const color =
          metric.rating === 'good'
            ? '#22c55e'
            : metric.rating === 'needs-improvement'
            ? '#eab308'
            : '#ef4444';
        console.log(
          `%c[Web Vitals] ${metric.name}: ${metric.value}${metric.name === 'CLS' ? '' : 'ms'} (${metric.rating})`,
          `color: ${color}; font-weight: bold;`
        );
      }
      if (typeof navigator !== 'undefined' && navigator.sendBeacon && process.env.NODE_ENV !== 'development') {
        try {
          const body = JSON.stringify({
            ...metric,
            url: window.location.href,
            timestamp: Date.now(),
          });
          navigator.sendBeacon('/api/vitals', body);
        } catch {}
      }
    }
  };

  // 1. TTFB (Navigation timing)
  try {
    const navEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    if (navEntry) {
      dispatch('TTFB', navEntry.responseStart);
    }
  } catch {}

  // 2. FCP (Paint timing)
  try {
    const paintObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.name === 'first-contentful-paint') {
          dispatch('FCP', entry.startTime);
          paintObserver.disconnect();
        }
      }
    });
    paintObserver.observe({ type: 'paint', buffered: true });
  } catch {}

  // 3. LCP (Largest Contentful Paint)
  try {
    let lcpVal = 0;
    const lcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      if (lastEntry) {
        lcpVal = lastEntry.startTime;
      }
    });
    lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });

    // Send on visibility change or page hide
    const onVisibilityChange = () => {
      if (document.visibilityState === 'hidden' && lcpVal > 0) {
        dispatch('LCP', lcpVal);
        lcpObserver.disconnect();
        window.removeEventListener('visibilitychange', onVisibilityChange);
      }
    };
    window.addEventListener('visibilitychange', onVisibilityChange);
  } catch {}

  // 4. CLS (Cumulative Layout Shift)
  try {
    let clsVal = 0;
    const clsObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (!(entry as any).hadRecentInput) {
          clsVal += (entry as any).value || 0;
        }
      }
    });
    clsObserver.observe({ type: 'layout-shift', buffered: true });

    const onClsSend = () => {
      if (document.visibilityState === 'hidden') {
        dispatch('CLS', clsVal);
        clsObserver.disconnect();
        window.removeEventListener('visibilitychange', onClsSend);
      }
    };
    window.addEventListener('visibilitychange', onClsSend);
  } catch {}

  // 5. INP (Interaction to Next Paint)
  try {
    let longestInteraction = 0;
    const inpObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        const duration = (entry as any).duration || 0;
        if (duration > longestInteraction) {
          longestInteraction = duration;
        }
      }
    });
    inpObserver.observe({ type: 'event', buffered: true, durationThreshold: 16 } as any);

    const onInpSend = () => {
      if (document.visibilityState === 'hidden' && longestInteraction > 0) {
        dispatch('INP', longestInteraction);
        inpObserver.disconnect();
        window.removeEventListener('visibilitychange', onInpSend);
      }
    };
    window.addEventListener('visibilitychange', onInpSend);
  } catch {}
}
