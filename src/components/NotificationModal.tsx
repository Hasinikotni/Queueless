import React from 'react';
import { X, Bell, CheckCheck, Trash2, ArrowUpRight, Volume2, Sparkles } from 'lucide-react';
import { useQueue } from '../context/QueueContext';

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToQueue: () => void;
}

export const NotificationModal: React.FC<NotificationModalProps> = ({
  isOpen,
  onClose,
  onNavigateToQueue,
}) => {
  const {
    notifications,
    markNotificationAsRead,
    clearAllNotifications,
    soundEnabled,
    setSoundEnabled,
  } = useQueue();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/30 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col border-l border-slate-200 overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-labelledby="notifications-title"
      >
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h2 id="notifications-title" className="text-base font-semibold text-slate-900">
                Live Notifications
              </h2>
              <p className="text-xs text-slate-500">
                Real-time queue & token progress alerts
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-1">
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              title={soundEnabled ? 'Chime sound is active' : 'Sound is muted'}
              className={`p-1.5 rounded-md transition-colors ${
                soundEnabled ? 'text-blue-600 bg-blue-50' : 'text-slate-400 hover:bg-slate-100'
              }`}
            >
              <Volume2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Action bar */}
        <div className="px-4 py-2 bg-white border-b border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>{notifications.length} total alerts</span>
          {notifications.length > 0 && (
            <div className="flex items-center gap-3">
              <button
                onClick={() => notifications.forEach((n) => markNotificationAsRead(n.notificationId))}
                className="hover:text-blue-600 transition-colors flex items-center gap-1"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                Mark all read
              </button>
              <button
                onClick={clearAllNotifications}
                className="hover:text-rose-600 transition-colors flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Clear
              </button>
            </div>
          )}
        </div>

        {/* Notification List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {notifications.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-center p-6">
              <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
                <Bell className="w-5 h-5" />
              </div>
              <p className="text-sm font-medium text-slate-700">No new notifications</p>
              <p className="text-xs text-slate-500 mt-1">
                You will receive instant alerts when your token moves or your turn approaches.
              </p>
            </div>
          ) : (
            notifications.map((item) => (
              <div
                key={item.notificationId}
                onClick={() => markNotificationAsRead(item.notificationId)}
                className={`p-3.5 rounded-xl border transition-all text-left relative ${
                  item.read
                    ? 'bg-white border-slate-200/80 text-slate-700'
                    : 'bg-blue-50/50 border-blue-200/90 text-slate-900 shadow-xs'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-1">
                  <div className="flex items-center gap-1.5 font-medium text-xs">
                    {item.type === 'success' ? (
                      <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                    ) : item.type === 'warning' ? (
                      <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" />
                    ) : (
                      <span className="w-2 h-2 rounded-full bg-blue-500 inline-block" />
                    )}
                    <span className="text-slate-900 font-semibold">{item.title}</span>
                  </div>
                  <span className="text-[11px] font-mono text-slate-400 whitespace-nowrap">
                    {item.timestamp}
                  </span>
                </div>
                
                <p className="text-xs text-slate-600 leading-relaxed pr-2">
                  {item.message}
                </p>

                {item.tokenNumber && (
                  <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] text-slate-500 font-mono">
                      Token #{item.tokenNumber}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onClose();
                        onNavigateToQueue();
                      }}
                      className="text-xs text-blue-600 font-medium hover:text-blue-700 flex items-center gap-0.5 cursor-pointer"
                    >
                      Track Token
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Footer info */}
        <div className="p-3.5 border-t border-slate-200 bg-slate-50 text-[11px] text-slate-500 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-blue-600" />
            SMS, WhatsApp & Push ready
          </span>
          <span className="text-slate-400">QueueLess Real-Time</span>
        </div>
      </div>
    </div>
  );
};
