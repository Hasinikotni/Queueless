import React, { useState } from 'react';
import { 
  Building2, 
  User, 
  Phone, 
  Users, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  HeartPulse, 
  Utensils, 
  Train, 
  Wrench, 
  Ticket,
  ChevronRight,
  ShieldCheck,
  Bell
} from 'lucide-react';
import { useQueue } from '../context/QueueContext';

interface JoinQueueViewProps {
  initialQueueId?: string;
  onNavigateToTracker: () => void;
  onNavigateToScan: () => void;
}

export const JoinQueueView: React.FC<JoinQueueViewProps> = ({
  initialQueueId = 'QH-1024',
  onNavigateToTracker,
  onNavigateToScan,
}) => {
  const { queues, joinQueue, activeUserToken, leaveQueue } = useQueue();

  const [selectedQueueId, setSelectedQueueId] = useState<string>(initialQueueId);
  const [name, setName] = useState<string>('Alex Taylor');
  const [phone, setPhone] = useState<string>('+1 (555) 234-5678');
  const [partySize, setPartySize] = useState<number>(1);
  const [smsAlerts, setSmsAlerts] = useState<boolean>(true);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  const selectedQueue = queues.find((q) => q.queueId === selectedQueueId) || queues[0];

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    joinQueue(selectedQueueId, name, smsAlerts ? phone : undefined, partySize);
    setIsSubmitted(true);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'hospital':
        return <HeartPulse className="w-5 h-5 text-blue-600" />;
      case 'canteen':
        return <Utensils className="w-5 h-5 text-amber-600" />;
      case 'railway':
        return <Train className="w-5 h-5 text-emerald-600" />;
      case 'service_center':
        return <Wrench className="w-5 h-5 text-orange-600" />;
      default:
        return <Building2 className="w-5 h-5 text-indigo-600" />;
    }
  };

  // If user just joined or already has an active token for this session and chooses to view confirmation
  if (isSubmitted && activeUserToken) {
    const peopleAhead = activeUserToken.peopleAhead;
    const estWait = activeUserToken.estimatedWaitTime;

    return (
      <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden text-center p-8 sm:p-10 animate-in fade-in zoom-in-95 duration-200">
          
          {/* Animated Success Check */}
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-5 shadow-xs">
            <CheckCircle2 className="w-9 h-9" />
          </div>

          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-1">
            You're In!
          </h2>
          <p className="text-sm text-slate-500 mb-6">
            Your place in line is secured at <strong className="text-slate-700">{selectedQueue.organizationName}</strong>
          </p>

          {/* Token Hero Badge */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg mb-6 relative overflow-hidden">
            <span className="text-xs uppercase font-semibold tracking-wider text-blue-100 block mb-1">
              Your Digital Token
            </span>
            <div className="text-5xl font-extrabold font-mono tracking-tight tabular-nums my-1">
              #{activeUserToken.tokenNumber}
            </div>
            <div className="text-xs text-blue-100 font-medium">
              Assigned for {activeUserToken.userName} · Party of {activeUserToken.partySize}
            </div>
          </div>

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-3 gap-2.5 p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 mb-6 text-center">
            <div>
              <span className="text-[11px] text-slate-500 block mb-0.5">Current Token</span>
              <span className="text-base font-bold font-mono text-slate-900 tabular-nums">
                #{selectedQueue.currentToken}
              </span>
            </div>

            <div>
              <span className="text-[11px] text-slate-500 block mb-0.5">People Ahead</span>
              <span className="text-base font-bold font-mono text-amber-600 tabular-nums">
                {peopleAhead}
              </span>
            </div>

            <div>
              <span className="text-[11px] text-slate-500 block mb-0.5">Est. Wait</span>
              <span className="text-base font-bold font-mono text-emerald-600 tabular-nums">
                {estWait} min
              </span>
            </div>
          </div>

          <div className="p-3 bg-blue-50/70 border border-blue-200/60 rounded-xl text-left flex items-start gap-2.5 mb-6 text-xs text-slate-600">
            <Bell className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <span>
              You will receive real-time notifications and sound alerts when only 5 people remain ahead of you.
            </span>
          </div>

          {/* Action buttons */}
          <div className="space-y-2.5">
            <button
              onClick={onNavigateToTracker}
              className="w-full py-3.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-sm"
            >
              Track My Queue
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                leaveQueue();
                setIsSubmitted(false);
              }}
              className="w-full py-2.5 px-4 text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
            >
              Leave Queue / Cancel Token
            </button>
          </div>

        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10 sm:py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        
        {/* Header */}
        <div className="mb-8 text-center sm:text-left">
          <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Digital Pass</span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-1 mb-2">
            Join a Queue
          </h1>
          <p className="text-sm sm:text-base text-slate-600">
            Choose a location, select your service, and get an instant digital token.
          </p>
        </div>

        {/* Existing Active Token Banner if user is already waiting somewhere */}
        {activeUserToken && (
          <div className="mb-6 p-4 rounded-2xl bg-blue-50 border border-blue-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold font-mono">
                #{activeUserToken.tokenNumber}
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">
                  You have an active token (#{activeUserToken.tokenNumber})
                </h4>
                <p className="text-xs text-slate-600">
                  Currently waiting for {activeUserToken.queueId}. {activeUserToken.peopleAhead} people ahead.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={onNavigateToTracker}
                className="flex-1 sm:flex-initial px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap"
              >
                Track Live
              </button>
              <button
                onClick={leaveQueue}
                className="px-3 py-2 text-rose-600 hover:bg-rose-100/60 text-xs font-medium rounded-lg transition-colors cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Main Form Container */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-8">
          <form onSubmit={handleJoin} className="space-y-6">
            
            {/* Step A: Select Location & Service */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="block text-sm font-bold text-slate-900">
                  1. Select Location & Service
                </label>
                <button
                  type="button"
                  onClick={onNavigateToScan}
                  className="text-xs text-blue-600 font-semibold hover:text-blue-700 flex items-center gap-1 cursor-pointer"
                >
                  Or Scan QR at Location →
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {queues.map((q) => {
                  const isSelected = q.queueId === selectedQueueId;
                  const queueAhead = Math.max(0, q.lastToken - q.currentToken);
                  const queueWait = Math.max(1, Math.ceil((queueAhead * q.averageServiceTime) / Math.max(1, q.activeCounters)));

                  return (
                    <div
                      key={q.queueId}
                      onClick={() => setSelectedQueueId(q.queueId)}
                      className={`p-4 rounded-xl border text-left cursor-pointer transition-all ${
                        isSelected
                          ? 'border-blue-600 bg-blue-50/50 ring-2 ring-blue-600/20'
                          : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center shrink-0">
                          {getCategoryIcon(q.category)}
                        </div>
                        <span className="text-[11px] font-mono text-slate-500 font-medium">
                          {q.queueId}
                        </span>
                      </div>

                      <h4 className="text-sm font-bold text-slate-900 leading-tight">
                        {q.organizationName}
                      </h4>
                      <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">
                        {q.serviceName}
                      </p>

                      <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                        <span>Current: <strong className="text-slate-800 font-mono">#{q.currentToken}</strong></span>
                        <span>Est: <strong className="text-slate-800 font-mono">~{queueWait}m</strong></span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Step B: User Details */}
            <div className="pt-4 border-t border-slate-100 space-y-4">
              <label className="block text-sm font-bold text-slate-900">
                2. Your Information
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Your Full Name <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <User className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Alex Taylor"
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Phone Number (Optional for SMS Alerts)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <Phone className="w-4 h-4" />
                    </div>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+1 (555) 000-0000"
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Party size & SMS preference */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Number of People
                  </label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((num) => (
                      <button
                        type="button"
                        key={num}
                        onClick={() => setPartySize(num)}
                        className={`w-10 h-10 rounded-xl font-mono text-sm font-semibold transition-all cursor-pointer ${
                          partySize === num
                            ? 'bg-blue-600 text-white shadow-xs'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-2">
                  <label className="flex items-start gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={smsAlerts}
                      onChange={(e) => setSmsAlerts(e.target.checked)}
                      className="mt-0.5 w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer"
                    />
                    <div className="text-xs text-slate-600">
                      <span className="font-semibold text-slate-800 block">Send SMS when 5 tokens ahead</span>
                      <span>Free automated notifications to avoid missing your slot.</span>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Selected Queue Summary Card */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
              <div>
                <span className="text-[11px] text-slate-500">Selected Queue:</span>
                <div className="text-sm font-bold text-slate-900">
                  {selectedQueue.organizationName}
                </div>
                <div className="text-xs text-slate-500">
                  Location: {selectedQueue.location} · {selectedQueue.activeCounters} Counters Active
                </div>
              </div>
              <div className="text-right">
                <span className="text-[11px] text-slate-500">Next Available Token:</span>
                <div className="text-lg font-bold font-mono text-blue-600 tabular-nums">
                  #{selectedQueue.lastToken + 1}
                </div>
              </div>
            </div>

            {/* Submit CTA */}
            <button
              type="submit"
              className="w-full py-4 px-6 bg-blue-600 hover:bg-blue-700 text-white text-base font-bold rounded-xl shadow-md hover:shadow-lg transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Ticket className="w-5 h-5" />
              Get My Token
              <ChevronRight className="w-5 h-5 ml-1" />
            </button>
          </form>

          {/* Trust footer */}
          <div className="mt-6 pt-5 border-t border-slate-100 flex items-center justify-center gap-2 text-xs text-slate-500">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Guaranteed position in digital order · Encrypted token validation</span>
          </div>

        </div>

      </div>
    </div>
  );
};
