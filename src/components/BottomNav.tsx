import React from 'react';
import { Home, PlusCircle, QrCode, Users, LayoutDashboard } from 'lucide-react';
import { useQueue } from '../context/QueueContext';

interface BottomNavProps {
  currentView: 'landing' | 'join' | 'scan' | 'my-queue' | 'admin';
  setCurrentView: (view: 'landing' | 'join' | 'scan' | 'my-queue' | 'admin') => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentView, setCurrentView }) => {
  const { activeUserToken } = useQueue();

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-3 py-2">
      <div className="flex items-center justify-around max-w-md mx-auto">
        <button
          onClick={() => setCurrentView('landing')}
          className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-lg text-xs font-medium transition-colors ${
            currentView === 'landing' ? 'text-blue-600 font-semibold' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Home className="w-5 h-5" />
          <span>Home</span>
        </button>

        <button
          onClick={() => setCurrentView('join')}
          className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-lg text-xs font-medium transition-colors ${
            currentView === 'join' ? 'text-blue-600 font-semibold' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <PlusCircle className="w-5 h-5" />
          <span>Join</span>
        </button>

        <button
          onClick={() => setCurrentView('scan')}
          className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-lg text-xs font-medium transition-colors ${
            currentView === 'scan' ? 'text-blue-600 font-semibold' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <div className="w-6 h-6 rounded-md bg-blue-50 flex items-center justify-center text-blue-600">
            <QrCode className="w-4 h-4" />
          </div>
          <span>Scan</span>
        </button>

        <button
          onClick={() => setCurrentView('my-queue')}
          className={`relative flex flex-col items-center gap-1 py-1 px-2.5 rounded-lg text-xs font-medium transition-colors ${
            currentView === 'my-queue' ? 'text-blue-600 font-semibold' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Users className="w-5 h-5" />
          <span>Queue</span>
          {activeUserToken && (
            <span className="absolute top-0.5 right-1 w-2 h-2 bg-blue-600 rounded-full" />
          )}
        </button>

        <button
          onClick={() => setCurrentView('admin')}
          className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-lg text-xs font-medium transition-colors ${
            currentView === 'admin' ? 'text-blue-600 font-semibold' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <LayoutDashboard className="w-5 h-5" />
          <span>Admin</span>
        </button>
      </div>
    </div>
  );
};
