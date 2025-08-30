import { createContext, useContext } from 'react';

export type Toast = { message: string; severity: 'success' | 'error' | 'info' | 'warning' };

type ToastContextType = {
  showToast: (toast: Toast) => void;
};

export const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within a ToastProvider');
  return ctx;
}
