import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IconCheck, IconAlertTriangle, IconClose } from './Icons.jsx';
import { cn } from '../../utils/cn.js';

const ToastContext = createContext();

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((toast) => {
    const id = `toast_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const newToast = {
      id,
      type: toast.type || 'info', // 'success' | 'error' | 'info'
      message: toast.message,
      title: toast.title,
      duration: toast.duration || 4500,
    };

    setToasts((prev) => [...prev, newToast]);

    if (newToast.duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, newToast.duration);
    }
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const success = useCallback((message, title = 'SUCCESS') => {
    addToast({ type: 'success', message, title });
  }, [addToast]);

  const error = useCallback((message, title = 'ERROR') => {
    addToast({ type: 'error', message, title });
  }, [addToast]);

  const info = useCallback((message, title = 'NOTICE') => {
    addToast({ type: 'info', message, title });
  }, [addToast]);

  return (
    <ToastContext.Provider value={{ addToast, removeToast, success, error, info }}>
      {children}
      {/* Toast container */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className={cn(
                "pointer-events-auto p-4 bg-paper-2 border text-ink rounded-[2px]",
                toast.type === 'error' ? "border-destructive text-destructive" : "border-ink"
              )}
              role="alert"
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex-shrink-0">
                  {toast.type === 'error' ? (
                    <IconAlertTriangle className="w-4 h-4 text-destructive" />
                  ) : toast.type === 'success' ? (
                    <IconCheck className="w-4 h-4 text-accent" />
                  ) : (
                    <span className="w-2 h-2 rounded-full bg-ink inline-block" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  {toast.title && (
                    <p className={cn(
                      "font-mono text-[0.6875rem] uppercase tracking-meta font-semibold mb-0.5",
                      toast.type === 'error' ? "text-destructive" : "text-ink"
                    )}>
                      {toast.title}
                    </p>
                  )}
                  <p className="text-sm font-sans text-ink leading-snug">
                    {toast.message}
                  </p>
                </div>
                <button
                  onClick={() => removeToast(toast.id)}
                  aria-label="Dismiss notification"
                  className="text-ink-soft hover:text-ink p-0.5 ml-2"
                >
                  <IconClose className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
