import React, { useState } from 'react';
import { 
  Users, 
  Clock, 
  LayoutDashboard, 
  QrCode, 
  BarChart3, 
  Settings, 
  Plus, 
  Play, 
  SkipForward, 
  Volume2, 
  Pause, 
  Download, 
  Copy, 
  Check, 
  Building2, 
  CheckCircle2, 
  X,
  Printer,
  ChevronRight,
  TrendingUp,
  Activity
} from 'lucide-react';
import { useQueue } from '../context/QueueContext';
import { QueueCategory } from '../types/queue';

type AdminTab = 'overview' | 'queues' | 'tokens' | 'counters' | 'qrcodes' | 'analytics' | 'settings';

export const AdminDashboardView: React.FC = () => {
  const {
    queues,
    selectedQueueId,
    setSelectedQueueId,
    callNextToken,
    skipToken,
    recallToken,
    setActiveCounters,
    toggleQueueStatus,
    createNewQueue,
  } = useQueue();

  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Queue Creation Form State
  const [formOrgName, setFormOrgName] = useState<string>('Metro Health Care Center');
  const [formLocation, setFormLocation] = useState<string>('Building C, Ground Floor');
  const [formServiceName, setFormServiceName] = useState<string>('Pediatric Clinic & Vaccinations');
  const [formCategory, setFormCategory] = useState<QueueCategory>('hospital');
  const [formCounters, setFormCounters] = useState<number>(3);
  const [formAvgTime, setFormAvgTime] = useState<number>(3);
  const [formCapacity, setFormCapacity] = useState<number>(100);
  const [formStartTime, setFormStartTime] = useState<string>('08:30 AM');
  const [formEndTime, setFormEndTime] = useState<string>('05:30 PM');
  const [createdSuccessQueueId, setCreatedSuccessQueueId] = useState<string | null>(null);

  const currentQueue = queues.find((q) => q.queueId === selectedQueueId) || queues[0];

  const waitingCustomers = currentQueue.waitingList.filter(
    (w) => w.status === 'waiting'
  ).length;

  const currentServingToken = currentQueue.currentToken;
  const avgWaitMin = Math.max(
    1,
    Math.ceil((waitingCustomers * currentQueue.averageServiceTime) / Math.max(1, currentQueue.activeCounters))
  );

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newQueueId = `Q-${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;

    const newQueue = createNewQueue({
      queueId: newQueueId,
      organizationName: formOrgName,
      location: formLocation,
      serviceName: formServiceName,
      category: formCategory,
      activeCounters: formCounters,
      averageServiceTime: formAvgTime,
      maxCapacity: formCapacity,
      operatingHours: `${formStartTime} – ${formEndTime}`,
      status: 'active',
    });

    setCreatedSuccessQueueId(newQueue.queueId);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(text);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row pb-20 md:pb-0">
      
      {/* 1. ADMIN SIDEBAR (Desktop 240px-280px) */}
      <aside className="w-full md:w-64 bg-slate-900 text-white shrink-0 border-r border-slate-800 flex flex-col justify-between">
        <div>
          {/* Organization Brand Header */}
          <div className="p-5 border-b border-slate-800">
            <span className="text-[10px] font-mono uppercase tracking-wider text-blue-400">
              QueueLess Admin Desk
            </span>
            <div className="mt-1 flex items-center justify-between">
              <span className="text-sm font-bold text-white truncate max-w-[170px]">
                {currentQueue.organizationName}
              </span>
              <span
                className={`w-2 h-2 rounded-full ${
                  currentQueue.status === 'active' ? 'bg-emerald-500' : 'bg-amber-500'
                }`}
                title={`Status: ${currentQueue.status}`}
              />
            </div>
          </div>

          {/* Queue Selector Dropdown */}
          <div className="p-3 border-b border-slate-800">
            <label className="block text-[11px] text-slate-400 font-medium mb-1.5">
              Active Queue:
            </label>
            <select
              value={selectedQueueId}
              onChange={(e) => setSelectedQueueId(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 text-white text-xs rounded-lg px-2.5 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              {queues.map((q) => (
                <option key={q.queueId} value={q.queueId}>
                  {q.organizationName} ({q.queueId})
                </option>
              ))}
            </select>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1">
            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                activeTab === 'overview'
                  ? 'bg-blue-600 text-white font-semibold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Dashboard Overview</span>
            </button>

            <button
              onClick={() => setActiveTab('tokens')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                activeTab === 'tokens'
                  ? 'bg-blue-600 text-white font-semibold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Users className="w-4 h-4" />
                <span>Live Tokens</span>
              </div>
              <span className="text-[10px] font-mono bg-slate-800 px-1.5 py-0.5 rounded text-slate-300">
                {waitingCustomers}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('counters')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                activeTab === 'counters'
                  ? 'bg-blue-600 text-white font-semibold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>Counter Management</span>
            </button>

            <button
              onClick={() => setActiveTab('qrcodes')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                activeTab === 'qrcodes'
                  ? 'bg-blue-600 text-white font-semibold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <QrCode className="w-4 h-4" />
              <span>QR Code Standee</span>
            </button>

            <button
              onClick={() => setActiveTab('analytics')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                activeTab === 'analytics'
                  ? 'bg-blue-600 text-white font-semibold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Analytics & Volume</span>
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                activeTab === 'settings'
                  ? 'bg-blue-600 text-white font-semibold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>Queue Settings</span>
            </button>
          </nav>
        </div>

        {/* Sidebar Footer CTA */}
        <div className="p-4 border-t border-slate-800">
          <button
            onClick={() => {
              setCreatedSuccessQueueId(null);
              setShowCreateModal(true);
            }}
            className="w-full py-2.5 px-3 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Create New Queue
          </button>
        </div>
      </aside>

      {/* 2. MAIN CONTENT VIEWPORT */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
        
        {/* Top Control Ribbon */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
                {currentQueue.organizationName}
              </h1>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-medium">
                {currentQueue.queueId}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Service: {currentQueue.serviceName} · {currentQueue.operatingHours || '08:00 AM – 06:00 PM'}
            </p>
          </div>

          {/* Quick Counter Action Buttons */}
          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => callNextToken(currentQueue.queueId)}
              className="flex-1 sm:flex-initial px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-sm transition-colors cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              Call Next Token
            </button>

            <button
              onClick={() => skipToken(currentQueue.queueId)}
              className="px-3 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors cursor-pointer flex items-center gap-1"
              title="Skip Absent Customer"
            >
              <SkipForward className="w-3.5 h-3.5" />
              Skip
            </button>

            <button
              onClick={() => recallToken(currentQueue.queueId)}
              className="px-3 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors cursor-pointer flex items-center gap-1"
              title="Repeat Chime Announcement"
            >
              <Volume2 className="w-3.5 h-3.5" />
              Recall
            </button>

            <button
              onClick={() => toggleQueueStatus(currentQueue.queueId)}
              className={`px-3 py-2.5 text-xs font-semibold rounded-xl transition-colors cursor-pointer flex items-center gap-1 ${
                currentQueue.status === 'active'
                  ? 'bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200'
                  : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200'
              }`}
            >
              {currentQueue.status === 'active' ? (
                <>
                  <Pause className="w-3.5 h-3.5" />
                  Pause
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5" />
                  Resume
                </>
              )}
            </button>
          </div>
        </div>

        {/* 4 CORE DASHBOARD METRIC CARDS */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {/* Metric 1: Current Token */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
            <span className="text-xs font-medium text-slate-500 block mb-1">
              Current Token
            </span>
            <div className="text-3xl sm:text-4xl font-extrabold font-mono text-blue-600 tabular-nums">
              #{currentServingToken}
            </div>
            <span className="text-[11px] text-slate-400 mt-1 block">
              Currently being served
            </span>
          </div>

          {/* Metric 2: Waiting Customers */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
            <span className="text-xs font-medium text-slate-500 block mb-1">
              Waiting Customers
            </span>
            <div className="text-3xl sm:text-4xl font-extrabold font-mono text-slate-900 tabular-nums">
              {waitingCustomers}
            </div>
            <span className="text-[11px] text-slate-400 mt-1 block">
              In queue list
            </span>
          </div>

          {/* Metric 3: Average Waiting Time */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
            <span className="text-xs font-medium text-slate-500 block mb-1">
              Average Waiting Time
            </span>
            <div className="text-3xl sm:text-4xl font-extrabold font-mono text-emerald-600 tabular-nums">
              {avgWaitMin} min
            </div>
            <span className="text-[11px] text-slate-400 mt-1 block">
              Calculated dynamically
            </span>
          </div>

          {/* Metric 4: Active Counters */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-medium text-slate-500">Active Counters</span>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4].map((cnt) => (
                  <button
                    key={cnt}
                    onClick={() => setActiveCounters(currentQueue.queueId, cnt)}
                    className={`w-5 h-5 rounded text-[10px] font-mono font-bold transition-colors cursor-pointer ${
                      currentQueue.activeCounters === cnt
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {cnt}
                  </button>
                ))}
              </div>
            </div>
            <div className="text-3xl sm:text-4xl font-extrabold font-mono text-slate-900 tabular-nums">
              {currentQueue.activeCounters}
            </div>
            <span className="text-[11px] text-slate-400 mt-1 block">
              Staffed service desks
            </span>
          </div>
        </div>

        {/* TAB 1: OVERVIEW & LIVE QUEUE TABLE */}
        {(activeTab === 'overview' || activeTab === 'tokens') && (
          <div className="space-y-6">
            
            {/* Live Queue Table (Requirement 12) */}
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
              <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Live Token Queue
                  </h3>
                  <p className="text-xs text-slate-500">
                    Real-time roster of active and waiting tokens
                  </p>
                </div>
                <button
                  onClick={() => callNextToken(currentQueue.queueId)}
                  className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1 shadow-xs"
                >
                  <Play className="w-3 h-3 fill-current" />
                  Call Next Token
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
                      <th className="py-3 px-4">Token #</th>
                      <th className="py-3 px-4">Customer Name</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4">Counter</th>
                      <th className="py-3 px-4">Waiting Time</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-sans">
                    {currentQueue.waitingList.map((item, idx) => {
                      const isCurrent = item.status === 'serving';
                      const waitEst = isCurrent ? '—' : `${(idx + 1) * currentQueue.averageServiceTime} min`;

                      return (
                        <tr
                          key={item.tokenNumber}
                          className={`transition-colors hover:bg-slate-50/80 ${
                            isCurrent ? 'bg-blue-50/40 font-medium' : ''
                          }`}
                        >
                          <td className="py-3 px-4 font-mono font-bold text-slate-900 tabular-nums">
                            #{item.tokenNumber}
                          </td>
                          <td className="py-3 px-4 font-medium text-slate-800">
                            {item.userName}
                            {item.partySize > 1 && (
                              <span className="text-[11px] text-slate-400 ml-1.5 font-normal">
                                ({item.partySize} guests)
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-4">
                            {item.status === 'serving' ? (
                              <span className="text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded font-medium">
                                Serving
                              </span>
                            ) : item.status === 'completed' ? (
                              <span className="text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                                Completed
                              </span>
                            ) : (
                              <span className="text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded font-medium">
                                Waiting
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-4 text-slate-600 font-mono">
                            {item.counterAssigned ? `Counter ${item.counterAssigned}` : 'Counter 1'}
                          </td>
                          <td className="py-3 px-4 text-slate-600 font-mono tabular-nums">
                            {waitEst}
                          </td>
                          <td className="py-3 px-4 text-right space-x-2">
                            {item.status === 'waiting' && (
                              <>
                                <button
                                  onClick={() => callNextToken(currentQueue.queueId)}
                                  className="text-xs font-semibold text-blue-600 hover:text-blue-700 cursor-pointer"
                                >
                                  Call
                                </button>
                                <button
                                  onClick={() => skipToken(currentQueue.queueId)}
                                  className="text-xs font-medium text-rose-600 hover:text-rose-700 cursor-pointer"
                                >
                                  Skip
                                </button>
                              </>
                            )}
                            {item.status === 'serving' && (
                              <button
                                onClick={() => callNextToken(currentQueue.queueId)}
                                className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 cursor-pointer"
                              >
                                Complete →
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Active Counter Status Grid */}
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5">
              <h3 className="text-base font-bold text-slate-900 mb-4">
                Counter Station Status
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {currentQueue.counters.map((c) => (
                  <div
                    key={c.id}
                    className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex items-start justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-slate-900 text-sm">{c.name}</span>
                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">{c.staffName}</p>
                      <div className="mt-3 text-xs">
                        <span className="text-slate-400">Serving Token: </span>
                        <strong className="font-mono text-blue-600 font-bold">
                          {c.currentServingToken ? `#${c.currentServingToken}` : 'Idle'}
                        </strong>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: QR CODE GENERATION & STANDEE (Requirement 13) */}
        {(activeTab === 'qrcodes' || activeTab === 'overview') && (
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                  Front-Desk Standee
                </span>
                <h3 className="text-xl font-extrabold text-slate-900 tracking-tight mt-1">
                  QR Code Display for {currentQueue.organizationName}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Print this standee and display it at reception, triage desks, or entrance gates.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" />
                  Print Standee
                </button>
                <button
                  onClick={() => handleCopy(`https://queueless.app/q/${currentQueue.queueId}`)}
                  className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  {copiedId ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedId ? 'Copied!' : 'Copy URL'}
                </button>
              </div>
            </div>

            {/* Printable Standee Preview Card */}
            <div className="max-w-md mx-auto bg-gradient-to-b from-blue-50/50 via-white to-slate-50 border-2 border-slate-300 rounded-3xl p-8 text-center shadow-lg">
              <div className="flex items-center justify-center gap-2 text-blue-600 font-extrabold text-xl mb-1">
                <Building2 className="w-6 h-6" />
                <span>{currentQueue.organizationName}</span>
              </div>
              <p className="text-xs text-slate-600 font-medium mb-6">
                {currentQueue.serviceName} · {currentQueue.location}
              </p>

              {/* Realistic QR Visual Representation */}
              <div className="w-52 h-52 mx-auto bg-white p-4 rounded-2xl border-2 border-slate-900 shadow-md flex flex-col items-center justify-center relative">
                {/* SVG QR Code Pattern */}
                <svg
                  className="w-full h-full text-slate-900"
                  viewBox="0 0 100 100"
                  fill="currentColor"
                >
                  {/* Position detection patterns */}
                  <rect x="5" y="5" width="28" height="28" fill="currentColor" rx="2" />
                  <rect x="9" y="9" width="20" height="20" fill="white" rx="1" />
                  <rect x="13" y="13" width="12" height="12" fill="currentColor" rx="1" />

                  <rect x="67" y="5" width="28" height="28" fill="currentColor" rx="2" />
                  <rect x="71" y="9" width="20" height="20" fill="white" rx="1" />
                  <rect x="75" y="13" width="12" height="12" fill="currentColor" rx="1" />

                  <rect x="5" y="67" width="28" height="28" fill="currentColor" rx="2" />
                  <rect x="9" y="71" width="20" height="20" fill="white" rx="1" />
                  <rect x="13" y="75" width="12" height="12" fill="currentColor" rx="1" />

                  {/* High density data matrix blocks */}
                  <rect x="38" y="10" width="8" height="8" />
                  <rect x="50" y="12" width="6" height="6" />
                  <rect x="38" y="24" width="6" height="6" />
                  <rect x="48" y="22" width="8" height="8" />

                  <rect x="12" y="38" width="6" height="6" />
                  <rect x="22" y="44" width="8" height="8" />
                  <rect x="36" y="36" width="6" height="6" />
                  <rect x="46" y="40" width="8" height="8" />
                  <rect x="58" y="36" width="6" height="6" />
                  <rect x="68" y="42" width="8" height="8" />
                  <rect x="80" y="38" width="6" height="6" />

                  <rect x="38" y="52" width="8" height="8" />
                  <rect x="50" y="54" width="6" height="6" />
                  <rect x="62" y="50" width="8" height="8" />
                  <rect x="76" y="54" width="6" height="6" />

                  <rect x="38" y="68" width="8" height="8" />
                  <rect x="50" y="72" width="6" height="6" />
                  <rect x="62" y="68" width="8" height="8" />
                  <rect x="78" y="72" width="12" height="8" />

                  <rect x="38" y="82" width="6" height="6" />
                  <rect x="48" y="84" width="10" height="6" />
                  <rect x="64" y="82" width="8" height="8" />
                  <rect x="78" y="86" width="8" height="8" />
                </svg>

                {/* Center Badge */}
                <div className="absolute inset-0 m-auto w-10 h-10 bg-white rounded-lg border border-slate-300 flex items-center justify-center font-bold text-xs font-mono text-blue-600 shadow-xs">
                  QL
                </div>
              </div>

              {/* Instructions */}
              <div className="mt-6 space-y-1.5">
                <span className="text-base font-bold text-slate-900 block">
                  Scan to Join Digital Queue
                </span>
                <p className="text-xs text-slate-500">
                  Point your smartphone camera at this code to get your token number and track in real-time.
                </p>
                <div className="pt-2 text-xs font-mono font-bold text-slate-700">
                  Queue ID: {currentQueue.queueId}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: ANALYTICS & VOLUME (Requirement 16) */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6">
              <h3 className="text-base font-bold text-slate-900 mb-1">
                Today’s Queue Activity & Peak Hours
              </h3>
              <p className="text-xs text-slate-500 mb-6">
                Hourly throughput and customer check-in volume
              </p>

              {/* Peak Hours Clean Bar Chart */}
              <div className="space-y-3 max-w-2xl">
                {[
                  { hour: '9 AM', count: 12, percent: 28 },
                  { hour: '10 AM', count: 28, percent: 66 },
                  { hour: '11 AM', count: 42, percent: 100, peak: true },
                  { hour: '12 PM', count: 35, percent: 83 },
                  { hour: '1 PM', count: 18, percent: 42 },
                ].map((slot) => (
                  <div key={slot.hour} className="flex items-center gap-3 text-xs">
                    <span className="w-14 font-mono font-semibold text-slate-600 text-right shrink-0">
                      {slot.hour}
                    </span>
                    <div className="flex-1 h-7 bg-slate-100 rounded-lg overflow-hidden flex items-center p-1">
                      <div
                        className={`h-full rounded-md transition-all duration-300 flex items-center justify-end pr-2 text-[11px] font-mono font-bold text-white ${
                          slot.peak ? 'bg-blue-600' : 'bg-slate-700'
                        }`}
                        style={{ width: `${slot.percent}%` }}
                      >
                        {slot.count}
                      </div>
                    </div>
                    <span className="w-24 text-[11px] text-slate-500 font-mono">
                      {slot.count} customers
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Performance KPIs */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
                <span className="text-xs text-slate-500">Total Served Today</span>
                <div className="text-3xl font-extrabold font-mono text-slate-900 mt-1">
                  135
                </div>
                <span className="text-[11px] text-emerald-600 flex items-center gap-1 mt-1 font-medium">
                  <TrendingUp className="w-3.5 h-3.5" /> +14% vs yesterday
                </span>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
                <span className="text-xs text-slate-500">Queue Abandonment Rate</span>
                <div className="text-3xl font-extrabold font-mono text-emerald-600 mt-1">
                  3.2%
                </div>
                <span className="text-[11px] text-slate-400 mt-1 block">
                  Down from 28% with physical line
                </span>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
                <span className="text-xs text-slate-500">Average Service Pace</span>
                <div className="text-3xl font-extrabold font-mono text-slate-900 mt-1">
                  2.4 min
                </div>
                <span className="text-[11px] text-slate-400 mt-1 block">
                  Per customer transaction
                </span>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* CREATE NEW QUEUE MODAL (Requirement 14) */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="max-w-xl w-full bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 animate-in zoom-in-95 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
              <div>
                <h3 className="text-xl font-extrabold text-slate-900">
                  Create New Queue
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Set up a smart queue and generate an instant QR code.
                </p>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {createdSuccessQueueId ? (
              <div className="text-center py-6">
                <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="text-lg font-bold text-slate-900 mb-1">
                  Queue Created Successfully!
                </h4>
                <p className="text-xs text-slate-600 mb-4">
                  Queue ID <strong className="font-mono text-blue-600">#{createdSuccessQueueId}</strong> is active and ready for customers.
                </p>
                <div className="flex gap-2 justify-center">
                  <button
                    onClick={() => {
                      setShowCreateModal(false);
                      setActiveTab('qrcodes');
                    }}
                    className="px-4 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-semibold hover:bg-blue-700"
                  >
                    View QR Code Standee
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Organization Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formOrgName}
                    onChange={(e) => setFormOrgName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Location / Wing *
                    </label>
                    <input
                      type="text"
                      required
                      value={formLocation}
                      onChange={(e) => setFormLocation(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Service Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formServiceName}
                      onChange={(e) => setFormServiceName(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Active Counters
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      value={formCounters}
                      onChange={(e) => setFormCounters(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm font-mono"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Avg Service Time (min)
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="30"
                      value={formAvgTime}
                      onChange={(e) => setFormAvgTime(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm font-mono"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Max Capacity
                    </label>
                    <input
                      type="number"
                      min="10"
                      max="500"
                      value={formCapacity}
                      onChange={(e) => setFormCapacity(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Queue Start Time
                    </label>
                    <input
                      type="text"
                      value={formStartTime}
                      onChange={(e) => setFormStartTime(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Queue End Time
                    </label>
                    <input
                      type="text"
                      value={formEndTime}
                      onChange={(e) => setFormEndTime(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-xs"
                  >
                    Create Queue & Generate QR
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
