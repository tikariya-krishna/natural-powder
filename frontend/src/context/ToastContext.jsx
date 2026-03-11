import { createContext, useCallback, useContext, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((toast) => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, ...toast }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, toast.duration ?? 4000);
  }, []);

  const value = { addToast };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed inset-x-0 top-3 z-50 flex justify-center">
        <div className="w-full max-w-md px-4">
          <AnimatePresence>
            {toasts.map((toast) => (
              <motion.div
                key={toast.id}
                initial={{ opacity: 0, y: -10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.97 }}
                transition={{ duration: 0.2 }}
                className={`mb-2 flex items-start gap-2 rounded-2xl border px-3 py-2.5 text-[11px] shadow-soft ${
                  toast.variant === 'error'
                    ? 'border-rose-200 bg-rose-50/95 text-rose-900 dark:border-rose-900 dark:bg-rose-950/90 dark:text-rose-100'
                    : 'border-emerald-200 bg-emerald-50/95 text-emerald-900 dark:border-emerald-900 dark:bg-emerald-950/90 dark:text-emerald-100'
                }`}
              >
                <div className="mt-0.5 h-1.5 w-1.5 rounded-full bg-current" />
                <div>
                  {toast.title && (
                    <p className="text-[11px] font-semibold uppercase tracking-[0.22em]">
                      {toast.title}
                    </p>
                  )}
                  {toast.message && (
                    <p className="mt-0.5 leading-relaxed">{toast.message}</p>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);

