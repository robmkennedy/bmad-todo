import { createContext, useContext, useState, useCallback, useRef, useEffect, type ReactNode } from 'react';

/**
 * Toast types for different notification styles
 */
export type ToastType = 'success' | 'error' | 'info';

/**
 * Individual toast notification
 */
export interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

/**
 * Toast context value
 */
interface ToastContextValue {
  toasts: Toast[];
  addToast: (message: string, type?: ToastType) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

/**
 * Auto-dismiss delay in milliseconds
 */
const AUTO_DISMISS_MS = 5000;

/**
 * Toast provider component
 * Manages toast state and provides context to children
 */
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const timersRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  const removeToast = useCallback((id: string) => {
    // Clear timer if exists
    const timer = timersRef.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timersRef.current.delete(id);
    }
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const addToast = useCallback((message: string, type: ToastType = 'info') => {
    const id = crypto.randomUUID();
    const newToast: Toast = { id, message, type };

    setToasts((prev) => [...prev, newToast]);

    // Auto-dismiss after delay
    const timer = setTimeout(() => {
      timersRef.current.delete(id);
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, AUTO_DISMISS_MS);

    timersRef.current.set(id, timer);
  }, []);

  // Cleanup all timers on unmount
  useEffect(() => {
    return () => {
      timersRef.current.forEach((timer) => clearTimeout(timer));
      timersRef.current.clear();
    };
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
    </ToastContext.Provider>
  );
}

/**
 * Hook to access toast functionality
 * Must be used within a ToastProvider
 */
export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

