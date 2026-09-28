import React from 'react';
import { Bell, X, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { useQueue } from '../context/QueueContext';

interface ToastAlertProps {
  onNavigateToQueue: () => void;
}

export const ToastAlert: React.FC<ToastAlertProps> = ({ onNavigateToQueue }) => {
  const { activeToast, dismissToast } = useQueue();

  if (!activeToast) return null;

  const isSuccess = activeToast.type === 'success';
  const isWarning = activeToast.type === 'warning';

  return (
    <div className="fixed top-20 right-4 sm:right-6 z-50 max-w-sm w-full animate-in slide-in-from-top-4 fade-in duration-200">
      <div 
        className={`p-4 rounded-xl border shadow-lg backdrop-blur-md transition-all ${
          isSuccess 
            ? 'bg-emerald-950/90 text-white border-emerald-500/50 shadow-emerald-900/20' 
            : isWarning
            ? 'bg-slate-900/95 text-white border-amber-500/60 shadow-amber-950/20'
            : 'bg-slate-900/95 text-white border-blue-500/50 shadow-slate-950/30'
        }`}
      >
        <div className="flex items-start gap-3">
          <div className="mt-0.5 shrink-0">
            {isSuccess ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            ) : isWarning ? (
              <AlertCircle className="w-5 h-5 text-amber-400" />
            ) : (
              <Bell className="w-5 h-5 text-blue-400" />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-semibold leading-tight text-white mb-1">
              {activeToast.title}
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed mb-2.5">
              {activeToast.message}
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  dismissToast(activeToast.notificationId);
                  onNavigateToQueue();
                }}
                className="text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 px-2.5 py-1 rounded-md flex items-center gap-1 cursor-pointer transition-colors"
              >
                Track Now
                <ArrowRight className="w-3 h-3" />
              </button>
              <button
                onClick={() => dismissToast(activeToast.notificationId)}
                className="text-xs text-slate-400 hover:text-white px-2 py-1 transition-colors cursor-pointer"
              >
                Dismiss
              </button>
            </div>
          </div>

          <button
            onClick={() => dismissToast(activeToast.notificationId)}
            className="text-slate-400 hover:text-white p-1 rounded-md transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
