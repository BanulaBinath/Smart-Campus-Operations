import React from 'react';
import { X, CheckCircle, AlertTriangle, Info, AlertCircle } from 'lucide-react';

const Toast = ({ toasts, removeToast }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((toast) => {
        let bgColor = '';
        let Icon = Info;

        switch (toast.type) {
          case 'success':
            bgColor = 'bg-[var(--color-success)]';
            Icon = CheckCircle;
            break;
          case 'error':
            bgColor = 'bg-[var(--color-danger)]';
            Icon = AlertCircle;
            break;
          case 'warning':
            bgColor = 'bg-[var(--color-warning)]';
            Icon = AlertTriangle;
            break;
          case 'info':
          default:
            bgColor = 'bg-[var(--color-info)]';
            Icon = Info;
            break;
        }

        return (
          <div
            key={toast.id}
            className={`flex items-center gap-3 rounded-lg px-4 py-3 text-white shadow-lg transition-all duration-300 animate-in slide-in-from-right-8 ${bgColor}`}
            style={{ borderRadius: '8px' }}
          >
            <Icon size={20} />
            <span className="text-sm font-medium">{toast.message}</span>
            <button
              onClick={() => removeToast(toast.id)}
              className="ml-2 rounded p-1 hover:bg-white/20 transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default Toast;
