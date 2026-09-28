import React, { useState } from 'react';
import { 
  QrCode, 
  ArrowRight, 
  Clock, 
  Users, 
  Bell, 
  CheckCircle2, 
  Sparkles, 
  Building2, 
  Utensils, 
  Train, 
  Bus, 
  Landmark, 
  Wrench, 
  GraduationCap, 
  HeartPulse, 
  ShieldCheck, 
  Footprints, 
  Play, 
  Coffee, 
  Compass, 
  SlidersHorizontal,
  ChevronRight,
  Ticket
} from 'lucide-react';
import { useQueue } from '../context/QueueContext';

interface LandingViewProps {
  onNavigate: (view: 'landing' | 'join' | 'scan' | 'my-queue' | 'admin') => void;
  onSelectQueueAndJoin?: (queueId: string) => void;
}

export const LandingView: React.FC<LandingViewProps> = ({ onNavigate, onSelectQueueAndJoin }) => {
  const { activeUserToken, queues, simulateNextToken } = useQueue();

  // Smart wait calculator local state
  const [calcPeopleAhead, setCalcPeopleAhead] = useState<number>(15);
  const [calcServiceTime, setCalcServiceTime] = useState<number>(2);
  const [calcCounters, setCalcCounters] = useState<number>(2);

  const calculatedWait = Math.max(1, Math.ceil((calcPeopleAhead * calcServiceTime) / Math.max(1, calcCounters)));

  // Mockup dynamic state
  const activeHospitalQueue = queues.find((q) => q.queueId === 'QH-1024') || queues[0];
  const currentServing = activeHospitalQueue.currentToken;
  const userTokenNum = activeUserToken?.tokenNumber || 57;
  const peopleAhead = Math.max(0, userTokenNum - currentServing);
  const estimatedWait = Math.max(1, Math.ceil((peopleAhead * 2) / 2));
  const progressPercent = Math.min(100, Math.max(5, Math.round(((userTokenNum - peopleAhead) / userTokenNum) * 100)));

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20 md:pb-0">
      
      {/* 1. HERO SECTION */}
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-28 overflow-hidden bg-gradient-to-b from-blue-50/60 via-white to-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Copy */}
            <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100/70 border border-blue-200/80 text-blue-800 text-xs font-medium">
                <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                <span>Next-Gen Smart Queue Management</span>
                <span className="text-blue-400 font-mono text-[11px]">·</span>
                <span>Zero Physical Waiting</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.1] text-balance">
                Stop Waiting. <br />
                <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Start Living.
                </span>
              </h1>

              <p className="text-lg sm:text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                QueueLess lets you join a queue digitally, track your token in real time, and return when it’s almost your turn.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
                <button
                  onClick={() => onNavigate('join')}
                  className="w-full sm:w-auto px-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Ticket className="w-4 h-4" />
                  Join a Queue
                  <ArrowRight className="w-4 h-4 ml-0.5" />
                </button>

                <a
                  href="#how-it-works"
                  className="w-full sm:w-auto px-6 py-3.5 bg-white hover:bg-slate-100 text-slate-700 font-semibold rounded-xl border border-slate-300/80 shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  See How It Works
                </a>

                <button
                  onClick={() => onNavigate('scan')}
                  className="w-full sm:w-auto px-5 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  title="Scan QueueLess QR"
                >
                  <QrCode className="w-4 h-4 text-blue-600" />
                  Scan QR
                </button>
              </div>

              {/* Trust markers */}
              <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-slate-500">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>No app installation required</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Live estimated wait time</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Audio & push alerts</span>
                </div>
              </div>
            </div>

            {/* Right Hero Visual: Realistic Live Dashboard Mockup */}
            <div className="lg:col-span-6">
              <div className="relative mx-auto max-w-lg rounded-2xl bg-white border border-slate-200/90 shadow-2xl overflow-hidden p-6 sm:p-7">
                
                {/* Mockup Header */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                      <HeartPulse className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">City Care Hospital</h3>
                      <p className="text-xs text-slate-500">OPD Consultation · Queue ID: QH-1024</p>
                    </div>
                  </div>
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-medium flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                    Live Queue
                  </span>
                </div>

                {/* Main Token Cards Grid */}
                <div className="grid grid-cols-2 gap-3 mb-5">
                  {/* Current Token */}
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70">
                    <span className="text-xs font-medium text-slate-500 block mb-1">
                      Currently Serving
                    </span>
                    <div className="text-3xl sm:text-4xl font-extrabold font-mono text-slate-900 tracking-tight tabular-nums">
                      #{currentServing}
                    </div>
                    <span className="text-[11px] text-slate-500 mt-1 block">
                      Counter 1 (Dr. Sharma)
                    </span>
                  </div>

                  {/* Your Token */}
                  <div className="p-4 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-md">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium text-blue-100">Your Token</span>
                      <span className="text-[10px] uppercase font-semibold tracking-wider px-1.5 py-0.2 rounded bg-white/20 text-white">
                        Active
                      </span>
                    </div>
                    <div className="text-3xl sm:text-4xl font-extrabold font-mono text-white tracking-tight tabular-nums">
                      #{userTokenNum}
                    </div>
                    <span className="text-[11px] text-blue-100 mt-1 block">
                      Assigned to Counter 3
                    </span>
                  </div>
                </div>

                {/* Queue Metrics Bar */}
                <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl bg-slate-50/90 border border-slate-200/60 mb-5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-amber-100/80 text-amber-800 flex items-center justify-center shrink-0">
                      <Users className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-[11px] text-slate-500 font-medium">People Ahead</div>
                      <div className="text-base font-bold font-mono text-slate-900 tabular-nums">
                        {peopleAhead} {peopleAhead === 1 ? 'person' : 'people'}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-emerald-100/80 text-emerald-800 flex items-center justify-center shrink-0">
                      <Clock className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-[11px] text-slate-500 font-medium">Estimated Wait</div>
                      <div className="text-base font-bold font-mono text-slate-900 tabular-nums">
                        {peopleAhead === 0 ? '0 min' : `${estimatedWait} minutes`}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Progress Visualizer */}
                <div className="space-y-2 mb-5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-slate-700">Queue Progress</span>
                    <span className="font-mono text-blue-600 font-semibold">{progressPercent}%</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-300 rounded-full"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                    <span>Token #{currentServing} (Serving)</span>
                    <span className="text-blue-600 font-semibold">Token #{userTokenNum} (You)</span>
                  </div>
                </div>

                {/* Simulated Notification Card */}
                <div className="p-3 rounded-xl bg-blue-50 border border-blue-200/80 flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                    <Bell className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex-1 text-xs">
                    <div className="font-semibold text-slate-900 flex items-center justify-between">
                      <span>Live Status Update</span>
                      <span className="text-[10px] text-slate-400 font-mono">Just now</span>
                    </div>
                    <p className="text-slate-600 text-[11px] mt-0.5">
                      {peopleAhead <= 1
                        ? 'Almost your turn! Please return to the waiting area.'
                        : peopleAhead <= 5
                        ? `Your turn is approaching — ${peopleAhead} people ahead.`
                        : `You're getting closer! ${peopleAhead} people ahead of you.`}
                    </p>
                  </div>
                </div>

                {/* Interactive Test Button inside Mockup */}
                <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={simulateNextToken}
                    className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1.5 cursor-pointer py-1 px-2.5 rounded-lg hover:bg-blue-50 transition-colors"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    Simulate Next Token
                  </button>
                  <button
                    onClick={() => onNavigate('my-queue')}
                    className="text-xs font-semibold text-slate-700 hover:text-slate-900 flex items-center gap-1 cursor-pointer"
                  >
                    Open Live Tracker
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. PROBLEM SECTION: Why Wait in Line? */}
      <section className="py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">The Problem</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-2 mb-4">
              Why Wait in Line?
            </h2>
            <p className="text-base sm:text-lg text-slate-600">
              Millions of hours are lost every day standing in crowded physical queues, enduring frustration, uncertainty, and infection risks.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-slate-300 transition-all">
              <div className="w-12 h-12 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center mb-4">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Hours Lost Standing</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                People spend an average of 45 to 90 minutes standing on their feet just to receive a 3-minute consultation or service.
              </p>
            </div>

            {/* Card 2 */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-slate-300 transition-all">
              <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mb-4">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Crowded Waiting Rooms</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Overcrowded lobbies in hospitals and service centers create high stress, lack of seating, and higher airborne illness transmission.
              </p>
            </div>

            {/* Card 3 */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-slate-300 transition-all">
              <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center mb-4">
                <Compass className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Zero Turn Visibility</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                You never know if your turn is in 5 minutes or 45 minutes, preventing you from grabbing a meal or stepping out for fresh air.
              </p>
            </div>

            {/* Card 4 */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-slate-300 transition-all">
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center mb-4">
                <Footprints className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Physical Inconvenience</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Elderly citizens, pregnant women, and tired patients struggle physically when forced to remain in stagnant, rigid lines.
              </p>
            </div>

            {/* Card 5 */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-slate-300 transition-all">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-4">
                <Building2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Counter Chaos for Staff</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Front-desk officers and nurses waste hours calming restless crowds instead of focusing on providing fast, quality care.
              </p>
            </div>

            {/* Card 6 */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-slate-300 transition-all">
              <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center mb-4">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Line Cutting & Friction</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Unregulated queues cause constant arguments over order and skipped turns. Digital verification ensures 100% fair fairness.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. SOLUTION SECTION: Meet QueueLess */}
      <section className="py-20 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">The Solution</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-2 mb-4">
              Meet QueueLess
            </h2>
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
              QueueLess transforms physical queues into smart digital queues. Users can scan a QR code, receive a token, track the queue remotely, and return when their turn is approaching.
            </p>
          </div>

          {/* Visual Flow Timeline */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
            {/* Step 1 */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold mb-3">
                <QrCode className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">01. Scan</span>
              <h4 className="text-base font-bold text-slate-900 mb-1">Scan QR Code</h4>
              <p className="text-xs text-slate-500">Scan standee at reception or counter entrance</p>
            </div>

            {/* Step 2 */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold mb-3">
                <Ticket className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider mb-1">02. Token</span>
              <h4 className="text-base font-bold text-slate-900 mb-1">Get Digital Token</h4>
              <p className="text-xs text-slate-500">Instant token number and live queue placement</p>
            </div>

            {/* Step 3 */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center font-bold mb-3">
                <Clock className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold text-sky-600 uppercase tracking-wider mb-1">03. Track</span>
              <h4 className="text-base font-bold text-slate-900 mb-1">Track Remotely</h4>
              <p className="text-xs text-slate-500">Live countdown of people ahead & wait time</p>
            </div>

            {/* Step 4 */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold mb-3">
                <Bell className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold text-amber-600 uppercase tracking-wider mb-1">04. Alert</span>
              <h4 className="text-base font-bold text-slate-900 mb-1">Get Smart Alert</h4>
              <p className="text-xs text-slate-500">Gentle ping when you are 5 tokens away</p>
            </div>

            {/* Step 5 */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold mb-3">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-1">05. Arrive</span>
              <h4 className="text-base font-bold text-slate-900 mb-1">Proceed to Counter</h4>
              <p className="text-xs text-slate-500">Walk right up when your token is called</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. HOW IT WORKS (5 Deep-Dive Steps) */}
      <section id="how-it-works" className="py-20 bg-white border-b border-slate-200 scroll-mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Effortless Workflow</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-2 mb-4">
              How QueueLess Works in 5 Easy Steps
            </h2>
            <p className="text-base sm:text-lg text-slate-600">
              Designed for everyone — from grandparents at a clinic to students grabbing lunch.
            </p>
          </div>

          <div className="space-y-6 max-w-4xl mx-auto">
            {/* Step 1 */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col md:flex-row items-start md:items-center gap-6">
              <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center text-xl font-bold shrink-0">
                1
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-slate-900">Scan the QR Code</h3>
                <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                  Scan the QueueLess QR code displayed at the location using your phone camera. No app store downloads or tedious sign-ups required.
                </p>
              </div>
              <button
                onClick={() => onNavigate('scan')}
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-3.5 py-2 rounded-lg transition-colors cursor-pointer shrink-0"
              >
                Try QR Scanner →
              </button>
            </div>

            {/* Step 2 */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col md:flex-row items-start md:items-center gap-6">
              <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center text-xl font-bold shrink-0">
                2
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-slate-900">Get Your Token</h3>
                <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                  Receive a verified digital token instantly. View your exact number, how many people are ahead, and which counter will serve you.
                </p>
              </div>
              <button
                onClick={() => onNavigate('join')}
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-3.5 py-2 rounded-lg transition-colors cursor-pointer shrink-0"
              >
                Join Demo Queue →
              </button>
            </div>

            {/* Step 3 */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col md:flex-row items-start md:items-center gap-6">
              <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center text-xl font-bold shrink-0">
                3
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-slate-900">Track Your Queue</h3>
                <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                  See the currently serving token, your live position, and dynamic wait times calculated from active counters and staff pace.
                </p>
              </div>
              <button
                onClick={() => onNavigate('my-queue')}
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-3.5 py-2 rounded-lg transition-colors cursor-pointer shrink-0"
              >
                View Live Tracker →
              </button>
            </div>

            {/* Step 4 */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col md:flex-row items-start md:items-center gap-6">
              <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center text-xl font-bold shrink-0">
                4
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-slate-900">Go Do Something Else</h3>
                <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                  You don't have to stand in the queue. Sit in a cafeteria, visit a nearby bookstore, relax in your car, or walk around the park.
                </p>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-medium bg-emerald-50 px-3 py-1.5 rounded-lg shrink-0">
                <Coffee className="w-4 h-4" />
                <span>Relax anywhere</span>
              </div>
            </div>

            {/* Step 5 */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col md:flex-row items-start md:items-center gap-6">
              <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center text-xl font-bold shrink-0">
                5
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-slate-900">Return When Your Turn Is Near</h3>
                <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                  QueueLess alerts you with sound and notifications when only 5 tokens remain. Walk in calmly right as your token is announced.
                </p>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-blue-700 font-medium bg-blue-50 px-3 py-1.5 rounded-lg shrink-0">
                <Sparkles className="w-4 h-4" />
                <span>Zero hassle</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. LOCATION CATEGORIES: QueueLess Works Everywhere */}
      <section className="py-20 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Versatile Platform</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-2 mb-4">
              QueueLess Works Everywhere
            </h2>
            <p className="text-base sm:text-lg text-slate-600">
              Deployable across any organization with physical foot traffic in under 5 minutes.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* 1. Hospitals */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
              <div>
                <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
                  <HeartPulse className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-1">Hospitals & Clinics</h3>
                <p className="text-xs text-slate-500 leading-relaxed mb-4">
                  Doctor appointments, OPD registration, pharmacy pickup, and billing desks.
                </p>
              </div>
              <button
                onClick={() => onSelectQueueAndJoin ? onSelectQueueAndJoin('QH-1024') : onNavigate('join')}
                className="w-full py-2 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1"
              >
                Join OPD Queue
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            {/* 2. Government Offices */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
              <div>
                <div className="w-11 h-11 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4">
                  <Building2 className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-1">Government Offices</h3>
                <p className="text-xs text-slate-500 leading-relaxed mb-4">
                  Certificates, civic applications, passport services, and document verification.
                </p>
              </div>
              <button
                onClick={() => onSelectQueueAndJoin ? onSelectQueueAndJoin('GOV-882') : onNavigate('join')}
                className="w-full py-2 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1"
              >
                Join Civic Queue
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            {/* 3. Canteens */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
              <div>
                <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4">
                  <Utensils className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-1">Canteens & Food Courts</h3>
                <p className="text-xs text-slate-500 leading-relaxed mb-4">
                  Lunch rush ordering, food pickup counters, and university cafeteria trays.
                </p>
              </div>
              <button
                onClick={() => onSelectQueueAndJoin ? onSelectQueueAndJoin('CAN-304') : onNavigate('join')}
                className="w-full py-2 text-xs font-semibold text-amber-800 bg-amber-50 hover:bg-amber-100 rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1"
              >
                Join Canteen Queue
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            {/* 4. Railway Stations */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
              <div>
                <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
                  <Train className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-1">Railway Stations</h3>
                <p className="text-xs text-slate-500 leading-relaxed mb-4">
                  Ticket reservation windows, Tatkal booking, enquiry kiosks, and luggage parcel desks.
                </p>
              </div>
              <button
                onClick={() => onSelectQueueAndJoin ? onSelectQueueAndJoin('RLY-410') : onNavigate('join')}
                className="w-full py-2 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1"
              >
                Join Railway Queue
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            {/* 5. Bus Stations */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
              <div>
                <div className="w-11 h-11 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center mb-4">
                  <Bus className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-1">Bus Stations</h3>
                <p className="text-xs text-slate-500 leading-relaxed mb-4">
                  Intercity pass counters, enquiry desks, ticket booking, and lost & found.
                </p>
              </div>
              <button
                onClick={() => onNavigate('join')}
                className="w-full py-2 text-xs font-semibold text-sky-800 bg-sky-50 hover:bg-sky-100 rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1"
              >
                Explore Bus Queues
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            {/* 6. Banks */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
              <div>
                <div className="w-11 h-11 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center mb-4">
                  <Landmark className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-1">Banks & Credit Unions</h3>
                <p className="text-xs text-slate-500 leading-relaxed mb-4">
                  Teller cash transactions, account services, KYC verification, and loans.
                </p>
              </div>
              <button
                onClick={() => onNavigate('join')}
                className="w-full py-2 text-xs font-semibold text-violet-800 bg-violet-50 hover:bg-violet-100 rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1"
              >
                Explore Bank Queues
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            {/* 7. Service Centers */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
              <div>
                <div className="w-11 h-11 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center mb-4">
                  <Wrench className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-1">Service Centers</h3>
                <p className="text-xs text-slate-500 leading-relaxed mb-4">
                  Electronics repair intake, automotive servicing, device pick-ups, and warranty claims.
                </p>
              </div>
              <button
                onClick={() => onSelectQueueAndJoin ? onSelectQueueAndJoin('SVC-520') : onNavigate('join')}
                className="w-full py-2 text-xs font-semibold text-orange-800 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1"
              >
                Join Tech Service
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            {/* 8. Colleges & Universities */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
              <div>
                <div className="w-11 h-11 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center mb-4">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-1">Colleges & Universities</h3>
                <p className="text-xs text-slate-500 leading-relaxed mb-4">
                  Admission registration, semester fee counters, transcript pickup, and ID card issuing.
                </p>
              </div>
              <button
                onClick={() => onNavigate('join')}
                className="w-full py-2 text-xs font-semibold text-teal-800 bg-teal-50 hover:bg-teal-100 rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1"
              >
                Explore Campus Queues
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 6. SMART WAITING-TIME CALCULATION SANDBOX */}
      <section className="py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto bg-slate-900 text-white rounded-3xl p-8 sm:p-10 shadow-2xl relative overflow-hidden">
            
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-2 text-blue-400 text-xs font-semibold uppercase tracking-wider">
                <SlidersHorizontal className="w-4 h-4" />
                <span>Smart Waiting-Time Engine</span>
              </div>
              
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-3">
                How Waiting Times Are Calculated
              </h2>

              <p className="text-sm text-slate-300 mb-8 max-w-2xl leading-relaxed">
                QueueLess takes the guesswork out of waiting by factoring in remaining customers, historical service pace, and currently staffed counters.
              </p>

              {/* Formula Callout */}
              <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700/80 mb-8 font-mono text-xs sm:text-sm text-blue-200 flex flex-wrap items-center justify-center gap-2 text-center">
                <span>Estimated Wait = (</span>
                <span className="text-amber-400 font-semibold">People Ahead</span>
                <span>×</span>
                <span className="text-purple-400 font-semibold">Avg Service Time</span>
                <span>) ÷</span>
                <span className="text-emerald-400 font-semibold">Active Counters</span>
              </div>

              {/* Interactive Sliders Sandbox */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {/* Slider 1: People Ahead */}
                <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                  <div className="flex justify-between items-center text-xs mb-2">
                    <span className="text-slate-400">People Ahead:</span>
                    <span className="font-mono font-bold text-amber-400 text-sm tabular-nums">
                      {calcPeopleAhead}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="50"
                    value={calcPeopleAhead}
                    onChange={(e) => setCalcPeopleAhead(Number(e.target.value))}
                    className="w-full accent-amber-400 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
                    <span>1 person</span>
                    <span>50 people</span>
                  </div>
                </div>

                {/* Slider 2: Average Service Time */}
                <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                  <div className="flex justify-between items-center text-xs mb-2">
                    <span className="text-slate-400">Avg Service Time:</span>
                    <span className="font-mono font-bold text-purple-400 text-sm tabular-nums">
                      {calcServiceTime} min
                    </span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="15"
                    value={calcServiceTime}
                    onChange={(e) => setCalcServiceTime(Number(e.target.value))}
                    className="w-full accent-purple-400 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
                    <span>1 min</span>
                    <span>15 min</span>
                  </div>
                </div>

                {/* Slider 3: Active Counters */}
                <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                  <div className="flex justify-between items-center text-xs mb-2">
                    <span className="text-slate-400">Active Counters:</span>
                    <span className="font-mono font-bold text-emerald-400 text-sm tabular-nums">
                      {calcCounters}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="8"
                    value={calcCounters}
                    onChange={(e) => setCalcCounters(Number(e.target.value))}
                    className="w-full accent-emerald-400 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
                    <span>1 counter</span>
                    <span>8 counters</span>
                  </div>
                </div>
              </div>

              {/* Calculated Result Box */}
              <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-950 to-indigo-950 border border-blue-800/80 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-medium text-blue-300 block mb-1">
                    Resulting Calculation:
                  </span>
                  <div className="text-3xl sm:text-4xl font-extrabold font-mono text-white tabular-nums">
                    {calculatedWait} minutes
                  </div>
                  <span className="text-xs text-slate-400 mt-1 block">
                    Formula: ({calcPeopleAhead} × {calcServiceTime} min) ÷ {calcCounters} counters = {calculatedWait} min
                  </span>
                </div>

                <div className="text-right sm:max-w-xs text-xs text-slate-400 leading-relaxed">
                  <span className="font-semibold text-slate-300">Clearly Labeled:</span>
                  <p className="mt-0.5">
                    Displayed as <strong className="text-white">“Estimated Wait”</strong> in the UI because individual consultations vary.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 7. LANDING PAGE FOOTER */}
      <footer className="bg-slate-900 text-slate-300 py-16 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-slate-800">
            
            {/* Brand column */}
            <div className="md:col-span-4 space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                  <Ticket className="w-4 h-4 -rotate-12" />
                </div>
                <span className="text-xl font-bold text-white tracking-tight">QueueLess</span>
              </div>
              <p className="text-sm text-slate-400 leading-relaxed">
                Smart queues. Less waiting. More time.
              </p>
              <p className="text-xs text-slate-500 leading-relaxed">
                “Your Turn. Your Time. No Waiting in Line.”
              </p>
            </div>

            {/* Quick Links */}
            <div className="md:col-span-2">
              <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-4">
                Product
              </h4>
              <ul className="space-y-2.5 text-xs text-slate-400">
                <li><button onClick={() => onNavigate('landing')} className="hover:text-white transition-colors cursor-pointer">About</button></li>
                <li><a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a></li>
                <li><button onClick={() => onNavigate('join')} className="hover:text-white transition-colors cursor-pointer">Join Queue</button></li>
                <li><button onClick={() => onNavigate('scan')} className="hover:text-white transition-colors cursor-pointer">QR Scanner</button></li>
                <li><button onClick={() => onNavigate('my-queue')} className="hover:text-white transition-colors cursor-pointer">Live Tracker</button></li>
              </ul>
            </div>

            {/* Organizations */}
            <div className="md:col-span-3">
              <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-4">
                Organizations
              </h4>
              <ul className="space-y-2.5 text-xs text-slate-400">
                <li><button onClick={() => onNavigate('admin')} className="hover:text-white transition-colors cursor-pointer">Admin Dashboard</button></li>
                <li><button onClick={() => onNavigate('admin')} className="hover:text-white transition-colors cursor-pointer">Generate QR Standees</button></li>
                <li><button onClick={() => onNavigate('admin')} className="hover:text-white transition-colors cursor-pointer">Counter Staff Manager</button></li>
                <li><button onClick={() => onNavigate('admin')} className="hover:text-white transition-colors cursor-pointer">Queue Analytics</button></li>
                <li><a href="#how-it-works" className="hover:text-white transition-colors">Enterprise Deployment</a></li>
              </ul>
            </div>

            {/* Legal & Trust */}
            <div className="md:col-span-3">
              <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-4">
                Trust & Support
              </h4>
              <ul className="space-y-2.5 text-xs text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Hospital Accessibility</a></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <p>© 2026 QueueLess. All rights reserved.</p>
            <div className="flex items-center gap-2">
              <span>Smart Digital Queue Management</span>
              <span>·</span>
              <span>Built for high footfall environments</span>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
};
