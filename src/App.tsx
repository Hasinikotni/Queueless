/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { QueueProvider, useQueue } from './context/QueueContext';
import { Navbar } from './components/Navbar';
import { BottomNav } from './components/BottomNav';
import { DemoSimulationBar } from './components/DemoSimulationBar';
import { NotificationModal } from './components/NotificationModal';
import { ToastAlert } from './components/ToastAlert';
import { LandingView } from './views/LandingView';
import { JoinQueueView } from './views/JoinQueueView';
import { ScanQRView } from './views/ScanQRView';
import { MyQueueView } from './views/MyQueueView';
import { AdminDashboardView } from './views/AdminDashboardView';

type ViewMode = 'landing' | 'join' | 'scan' | 'my-queue' | 'admin';

const MainAppContent: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewMode>('landing');
  const [preselectedQueueId, setPreselectedQueueId] = useState<string>('QH-1024');
  const [isNotificationsOpen, setIsNotificationsOpen] = useState<boolean>(false);
  const [isDemoBarOpen, setIsDemoBarOpen] = useState<boolean>(true);
  const { joinQueue } = useQueue();

  const handleSelectQueueAndJoin = (queueId: string) => {
    setPreselectedQueueId(queueId);
    setCurrentView('join');
  };

  const handleQueueScanned = (queueId: string) => {
    // Quick auto-join as visitor or go to customize
    joinQueue(queueId, 'Alex Taylor', '+1 (555) 234-5678', 1);
    setCurrentView('my-queue');
  };

  const handleNavigateToJoinForm = (queueId: string) => {
    setPreselectedQueueId(queueId);
    setCurrentView('join');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900 font-sans selection:bg-blue-600 selection:text-white">
      {/* Top Navbar */}
      <Navbar
        currentView={currentView}
        setCurrentView={setCurrentView}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        onOpenDemoBar={() => setIsDemoBarOpen((prev) => !prev)}
      />

      {/* Real-time Toast Notifications */}
      <ToastAlert onNavigateToQueue={() => setCurrentView('my-queue')} />

      {/* Main Page Content */}
      <div className="flex-1">
        {currentView === 'landing' && (
          <LandingView
            onNavigate={(v) => setCurrentView(v)}
            onSelectQueueAndJoin={handleSelectQueueAndJoin}
          />
        )}

        {currentView === 'join' && (
          <JoinQueueView
            initialQueueId={preselectedQueueId}
            onNavigateToTracker={() => setCurrentView('my-queue')}
            onNavigateToScan={() => setCurrentView('scan')}
          />
        )}

        {currentView === 'scan' && (
          <ScanQRView
            onQueueJoined={handleQueueScanned}
            onNavigateToJoinForm={handleNavigateToJoinForm}
          />
        )}

        {currentView === 'my-queue' && (
          <MyQueueView
            onNavigateToJoin={() => setCurrentView('join')}
            onOpenNotifications={() => setIsNotificationsOpen(true)}
          />
        )}

        {currentView === 'admin' && <AdminDashboardView />}
      </div>

      {/* Floating Demo Simulation Control Bar */}
      <DemoSimulationBar
        isOpen={isDemoBarOpen}
        onToggle={() => setIsDemoBarOpen(false)}
        onNavigateToQueue={() => setCurrentView('my-queue')}
      />

      {/* Notification Flyout Drawer */}
      <NotificationModal
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        onNavigateToQueue={() => setCurrentView('my-queue')}
      />

      {/* Mobile-Friendly Thumb Bottom Navigation */}
      <BottomNav
        currentView={currentView}
        setCurrentView={setCurrentView}
      />
    </div>
  );
};

export default function App() {
  return (
    <QueueProvider>
      <MainAppContent />
    </QueueProvider>
  );
}
