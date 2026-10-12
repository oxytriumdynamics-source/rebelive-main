'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  Info,
  AlertCircle,
  X,
  Sparkles,
} from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastItem {
  id: string;
  type: ToastType;
  title?: string;
  message: string;
  duration?: number; // ms, defaults to 2500 (2.5 sec)
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType, title?: string, duration?: number) => void;
  success: (message: string, title?: string) => void;
  error: (message: string, title?: string) => void;
  info: (message: string, title?: string) => void;
  warning: (message: string, title?: string) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

/**
 * Global helper to trigger a toast from anywhere without hook context.
 * Dispatches a window custom event caught by AdminToaster.
 */
export function showAdminToast(
  message: string,
  type: ToastType = 'success',
  title?: string,
  duration: number = 2600
) {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('admin-toast-event', {
        detail: { message, type, title, duration },
      })
    );
  }
}

const TOAST_THEMES: Record<
  ToastType,
  {
    badge: string;
    border: string;
    bg: string;
    text: string;
    icon: React.ComponentType<{ className?: string }>;
    progressBg: string;
    glow: string;
  }
> = {
  success: {
    badge: 'SUCCESS',
    border: 'border-white/25',
    bg: 'bg-[#0a0a0a]/95',
    text: 'text-white',
    icon: CheckCircle2,
    progressBg: 'bg-white',
    glow: 'shadow-[0_0_24px_rgba(255,255,255,0.12)]',
  },
  error: {
    badge: 'ERROR',
    border: 'border-white/30',
    bg: 'bg-[#0a0a0a]/95',
    text: 'text-white',
    icon: AlertTriangle,
    progressBg: 'bg-white',
    glow: 'shadow-[0_0_24px_rgba(255,255,255,0.16)]',
  },
  info: {
    badge: 'INFO',
    border: 'border-white/20',
    bg: 'bg-[#0a0a0a]/95',
    text: 'text-white',
    icon: Sparkles,
    progressBg: 'bg-white/80',
    glow: 'shadow-[0_0_24px_rgba(255,255,255,0.10)]',
  },
  warning: {
    badge: 'ALERT',
    border: 'border-white/25',
    bg: 'bg-[#0a0a0a]/95',
    text: 'text-white',
    icon: AlertCircle,
    progressBg: 'bg-white/90',
    glow: 'shadow-[0_0_24px_rgba(255,255,255,0.12)]',
  },
};

interface ToastCardProps {
  toast: ToastItem;
  onDismiss: (id: string) => void;
}

function ToastCard({ toast, onDismiss }: ToastCardProps) {
  const [isExiting, setIsExiting] = useState(false);
  const theme = TOAST_THEMES[toast.type] || TOAST_THEMES.info;
  const Icon = theme.icon;
  const duration = toast.duration || 2600;

  useEffect(() => {
    // Start exit transition 200ms before duration expires
    const exitTimer = setTimeout(() => {
      setIsExiting(true);
    }, Math.max(100, duration - 220));

    // Remove toast completely after duration
    const dismissTimer = setTimeout(() => {
      onDismiss(toast.id);
    }, duration);

    return () => {
      clearTimeout(exitTimer);
      clearTimeout(dismissTimer);
    };
  }, [toast.id, duration, onDismiss]);

  const handleManualClose = () => {
    setIsExiting(true);
    setTimeout(() => onDismiss(toast.id), 180);
  };

  return (
    <div
      role="alert"
      className={`relative w-80 sm:w-96 rounded-2xl border backdrop-blur-xl p-3.5 shadow-2xl transition-all duration-200 pointer-events-auto overflow-hidden ${
        theme.bg
      } ${theme.border} ${theme.glow} ${
        isExiting
          ? 'opacity-0 translate-x-4 scale-95'
          : 'opacity-100 translate-x-0 scale-100 animate-in slide-in-from-right-5 fade-in'
      }`}
    >
      <div className="flex items-start gap-3">
        {/* Type Icon */}
        <div className={`p-1.5 rounded-xl bg-white/5 shrink-0 mt-0.5 ${theme.text}`}>
          <Icon className="w-4 h-4" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 pr-1">
          <div className="flex items-center gap-2">
            <span
              className="font-mono text-[9px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-white text-black"
            >
              {toast.title || theme.badge}
            </span>
            <span className="font-mono text-[9px] text-white/40">Just now</span>
          </div>
          <p className="text-xs text-white font-medium leading-relaxed mt-1 break-words">
            {toast.message}
          </p>
        </div>

        {/* Close Button */}
        <button
          onClick={handleManualClose}
          className="p-1 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-colors cursor-pointer shrink-0"
          title="Dismiss"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Progress countdown bar (2 - 3 sec visual cue) */}
      <div className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-white/10 overflow-hidden">
        <div
          className={`h-full ${theme.progressBg} transition-all ease-linear`}
          style={{
            animation: `shrinkWidth ${duration}ms linear forwards`,
          }}
        />
      </div>

      <style jsx>{`
        @keyframes shrinkWidth {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }
      `}</style>
    </div>
  );
}

export function AdminToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (message: string, type: ToastType = 'success', title?: string, duration: number = 2600) => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
      const newToast: ToastItem = {
        id,
        message,
        type,
        title,
        duration,
      };

      setToasts((prev) => {
        // Keep max 4 toasts stacked
        const updated = [...prev, newToast];
        return updated.slice(-4);
      });
    },
    []
  );

  const success = useCallback(
    (msg: string, title?: string) => showToast(msg, 'success', title || 'SUCCESS', 2600),
    [showToast]
  );
  const error = useCallback(
    (msg: string, title?: string) => showToast(msg, 'error', title || 'ERROR', 3200),
    [showToast]
  );
  const info = useCallback(
    (msg: string, title?: string) => showToast(msg, 'info', title || 'INFO', 2600),
    [showToast]
  );
  const warning = useCallback(
    (msg: string, title?: string) => showToast(msg, 'warning', title || 'WARNING', 2800),
    [showToast]
  );

  // Listen to window custom events
  useEffect(() => {
    const handleCustomToast = (e: Event) => {
      const customEvent = e as CustomEvent<{
        message: string;
        type?: ToastType;
        title?: string;
        duration?: number;
      }>;
      if (customEvent.detail) {
        showToast(
          customEvent.detail.message,
          customEvent.detail.type || 'success',
          customEvent.detail.title,
          customEvent.detail.duration || 2600
        );
      }
    };

    window.addEventListener('admin-toast-event', handleCustomToast);
    return () => {
      window.removeEventListener('admin-toast-event', handleCustomToast);
    };
  }, [showToast]);

  return (
    <ToastContext.Provider value={{ showToast, success, error, info, warning, removeToast }}>
      {children}

      {/* Floating Toaster Container (Top Right) */}
      <div
        aria-live="polite"
        className="fixed top-4 right-4 z-[99999] flex flex-col gap-2.5 pointer-events-none max-w-full px-2 sm:px-0"
      >
        {toasts.map((toast) => (
          <ToastCard key={toast.id} toast={toast} onDismiss={removeToast} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useAdminToast(): ToastContextType {
  const context = useContext(ToastContext);
  if (!context) {
    // Return fallback that uses global event if hook is called outside provider
    return {
      showToast: (message, type = 'success', title, duration) =>
        showAdminToast(message, type, title, duration),
      success: (msg, title) => showAdminToast(msg, 'success', title || 'SUCCESS'),
      error: (msg, title) => showAdminToast(msg, 'error', title || 'ERROR', 3200),
      info: (msg, title) => showAdminToast(msg, 'info', title || 'INFO'),
      warning: (msg, title) => showAdminToast(msg, 'warning', title || 'WARNING', 2800),
      removeToast: () => {},
    };
  }
  return context;
}
