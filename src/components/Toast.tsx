'use client';

import { useEffect } from 'react';
import { X } from 'lucide-react';
import { create } from 'zustand';

interface ToastState {
  message: string | null;
  type: 'error' | 'success' | 'info';
  showToast: (message: string, type: 'error' | 'success' | 'info') => void;
  hideToast: () => void;
}

export const useToastStore = create<ToastState>((set) => ({
  message: null,
  type: 'info',
  showToast: (message, type) => set({ message, type }),
  hideToast: () => set({ message: null }),
}));

export default function Toast() {
  const { message, type, hideToast } = useToastStore();

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        hideToast();
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [message, hideToast]);

  if (!message) return null;

  const bgColorClass = {
    error: 'bg-error text-error-content',
    success: 'bg-success text-success-content',
    info: 'bg-info text-info-content',
  }[type];

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-slide-up">
      <div className={`rounded-lg shadow-lg px-4 py-3 pr-12 relative ${bgColorClass}`}>
        <p className="font-medium">{message}</p>
        <button
          onClick={hideToast}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-black/10 transition-colors"
        >
          <X size={18} />
        </button>
      </div>
    </div>
  );
}
