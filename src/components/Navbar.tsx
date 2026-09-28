import React from 'react';
import { 
  QrCode, 
  Users, 
  LayoutDashboard, 
  Bell, 
  Volume2, 
  VolumeX, 
  Sparkles,
  Ticket
} from 'lucide-react';
import { useQueue } from '../context/QueueContext';

interface NavbarProps {
  currentView: 'landing' | 'join' | 'scan' | 'my-queue' | 'admin';
  setCurrentView: (view: 'landing' | 'join' | 'scan' | 'my-queue' | 'admin') => void;
  onOpenNotifications: () => void;
  onOpenDemoBar: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  setCurrentView,
  onOpenNotifications,
  onOpenDemoBar,
}) => {
  const { activeUserToken, notifications, soundEnabled, setSoundEnabled } = useQueue();
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Zone 1: Single text element wordmark with icon */}
        <button
          onClick={() => setCurrentView('landing')}
          className="flex items-center gap-2.5 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-lg group"
        >
          <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-sm transition-transform duration-150 group-hover:scale-105">
            <Ticket className="w-5 h-5 -rotate-12 stroke-[2.2]" />
          </div>
          <div>
            <span className="text-xl font-bold tracking-tight text-slate-900 font-sans">
              Queue<span className="text-blue-600">Less</span>
            </span>
          </div>
        </button>

        {/* Zone 2: Clean text navigation links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600">
          <button
            onClick={() => setCurrentView('landing')}
            className={`transition-colors hover:text-slate-900 cursor-pointer ${
              currentView === 'landing' ? 'text-blue-600 font-semibold' : ''
            }`}
          >
            Home
          </button>
          
          <button
            onClick={() => setCurrentView('join')}
            className={`transition-colors hover:text-slate-900 cursor-pointer ${
              currentView === 'join' ? 'text-blue-600 font-semibold' : ''
            }`}
          >
            Join Queue
          </button>

          <button
            onClick={() => setCurrentView('scan')}
            className={`transition-colors hover:text-slate-900 cursor-pointer flex items-center gap-1.5 ${
              currentView === 'scan' ? 'text-blue-600 font-semibold' : ''
            }`}
          >
            <QrCode className="w-4 h-4 text-slate-400" />
            Scan QR
          </button>

          <button
            onClick={() => setCurrentView('my-queue')}
            className={`relative transition-colors hover:text-slate-900 cursor-pointer flex items-center gap-1.5 ${
              currentView === 'my-queue' ? 'text-blue-600 font-semibold' : ''
            }`}
          >
            <Users className="w-4 h-4 text-slate-400" />
            My Queue
            {activeUserToken && (
              <span className="inline-flex items-center justify-center px-1.5 py-0.2 text-[11px] font-mono font-medium bg-blue-100 text-blue-700 rounded">
                #{activeUserToken.tokenNumber}
              </span>
            )}
          </button>

          <button
            onClick={() => setCurrentView('admin')}
            className={`transition-colors hover:text-slate-900 cursor-pointer flex items-center gap-1.5 ${
              currentView === 'admin' ? 'text-blue-600 font-semibold' : ''
            }`}
          >
            <LayoutDashboard className="w-4 h-4 text-slate-400" />
            Admin Desk
          </button>
        </nav>

        {/* Zone 3: Primary Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Sound Toggle */}
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            title={soundEnabled ? 'Mute audio chimes' : 'Enable audio chimes'}
            aria-label={soundEnabled ? 'Mute chimes' : 'Enable chimes'}
            className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
          </button>

          {/* Notifications Bell */}
          <button
            onClick={onOpenNotifications}
            title="Notifications"
            aria-label="View notifications"
            className="relative p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-blue-600 rounded-full ring-2 ring-white" />
            )}
          </button>

          {/* Quick Demo Simulator CTA */}
          <button
            onClick={onOpenDemoBar}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200/80 rounded-lg transition-colors cursor-pointer whitespace-nowrap"
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            Demo Sim
          </button>

          {/* Join Queue CTA button */}
          <button
            onClick={() => setCurrentView('join')}
            className="px-3.5 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer whitespace-nowrap shadow-sm"
          >
            Join Queue
          </button>
        </div>
      </div>
    </header>
  );
};
