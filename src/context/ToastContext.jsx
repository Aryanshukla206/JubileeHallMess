import React, { createContext, useState, useContext, useEffect } from 'react';

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  // Remove a toast after it expires
  useEffect(() => {
    if (toasts.length > 0) {
      const timer = setTimeout(() => {
        setToasts(prevToasts => prevToasts.slice(1));
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [toasts]);

  // Add a new toast
  const addToast = (message, type = 'success') => {
    const id = Date.now().toString();
    setToasts(prevToasts => [...prevToasts, { id, message, type }]);
    return id;
  };

  // Success toast shorthand
  const success = (message) => addToast(message, 'success');

  // Error toast shorthand
  const error = (message) => addToast(message, 'error');

  // Info toast shorthand
  const info = (message) => addToast(message, 'info');

  // Warning toast shorthand
  const warning = (message) => addToast(message, 'warning');

  const value = {
    toasts,
    addToast,
    success,
    error,
    info,
    warning
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      {/* Toast container */}
      {toasts.length > 0 && (
        <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
          {toasts.map((toast) => (
            <div
              key={toast.id}
              className={`px-4 py-2 rounded-md shadow-lg text-white transform transition-all duration-300 ease-in-out
                ${toast.type === 'success' ? 'bg-green-500' :
                  toast.type === 'error' ? 'bg-red-500' :
                    toast.type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'}`}
            >
              {toast.message}
            </div>
          ))}
        </div>
      )}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  return useContext(ToastContext);
};