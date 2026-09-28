import React, { useState } from 'react';
import { 
  RefreshCw, 
  Clock, 
  Users, 
  MapPin, 
  Bell, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  ChevronRight, 
  X, 
  Volume2, 
  Ticket,
  Play,
  FastForward,
  Navigation
} from 'lucide-react';
import { useQueue } from '../context/QueueContext';

interface MyQueueViewProps {
  onNavigateToJoin: () => void;
  onOpenNotifications: () => void;
}

export const MyQueueView: React.FC<MyQueueViewProps> = ({
  onNavigateToJoin,
  onOpenNotifications,
}) => {
  const {
    activeUserToken,
    queues,
    leaveQueue,
    refreshQueue,
    lastRefreshedAt,
    simulateNextToken,
    simulateJumpToApproaching,
    simulateJumpToYourTurn,
    resetDemo,
  } = useQueue();

  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [showLeaveConfirm, setShowLeaveConfirm] = useState<boolean>(false);
  const [showDirectionsModal, setShowDirectionsModal] = useState<boolean>(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    refreshQueue();
    setTimeout(() => {
      setIsRefreshing(false);
    }, 600);
  };

  // If user doesn't have an active token, show empty state with 1-click Demo activation
  if (!activeUserToken) {
    return (
      <div className="min-h-screen bg-slate-50 py-16 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-3xl border border-slate-200 shadow-xl p-8 text-center animate-in fade-in">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-5">
            <Ticket className="w-8 h-8" />
          </div>

          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight mb-2">
            No Active Token
          </h2>
          <p className="text-sm text-slate-600 mb-6">
            You are currently not waiting in any queue. Join a queue or load the prototype demonstration.
          </p>

          <div className="space-y-3">
            <button
              onClick={resetDemo}
              className="w-full py-3.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-sm"
            >
              <Sparkles className="w-4 h-4" />
              Load Interactive Demo Queue (Token #57)
            </button>

            <button
              onClick={onNavigateToJoin}
              className="w-full py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold rounded-xl transition-colors cursor-pointer"
            >
              Browse & Join Live Queues
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentQueue = queues.find((q) => q.queueId === activeUserToken.queueId) || queues[0];
  const currentServing = currentQueue.currentToken;
  const userTokenNum = activeUserToken.tokenNumber;
  const peopleAhead = Math.max(0, userTokenNum - currentServing);
  const estimatedWait = Math.max(
    peopleAhead === 0 ? 0 : 1,
    Math.ceil((peopleAhead * currentQueue.averageServiceTime) / Math.max(1, currentQueue.activeCounters))
  );

  // Status computation
  const isServing = userTokenNum <= currentServing;
  const isAlmost = !isServing && peopleAhead <= 1;
  const isApproaching = !isServing && !isAlmost && peopleAhead <= 5;
  const isNormal = !isServing && !isAlmost && !isApproaching;

  // Percentage for progress bar
  const totalDifference = Math.max(1, userTokenNum - 40); // baseline
  const completedCount = Math.max(0, currentServing - 40);
  const progressPercent = Math.min(100, Math.max(10, Math.round((completedCount / totalDifference) * 100)));

  // Generate visual token sequence ladder (e.g. 42 -> 43 -> 44 ... -> 57)
  const tokenLadder: number[] = [];
  const startNum = currentServing;
  const endNum = Math.min(userTokenNum + 1, currentServing + 6);
  for (let i = startNum; i <= endNum; i++) {
    tokenLadder.push(i);
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8 sm:py-12 px-4 sm:px-6 lg:px-8 pb-24 md:pb-12">
      <div className="max-w-3xl mx-auto space-y-6">

        {/* Top Header Card */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-semibold">
                {currentQueue.queueId}
              </span>
              <span className="text-xs text-slate-400">·</span>
              <span className="text-xs font-medium text-slate-500">
                {currentQueue.location}
              </span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              {currentQueue.organizationName}
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Service: <strong className="text-slate-700">{currentQueue.serviceName}</strong>
            </p>
          </div>

          {/* Refresh & Last Updated */}
          <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100">
            <button
              onClick={handleRefresh}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-blue-600' : ''}`} />
              Refresh Queue
            </button>
            <span className="text-[11px] text-slate-400 font-mono mt-1">
              Last updated: {lastRefreshedAt}
            </span>
          </div>
        </div>

        {/* DYNAMIC STATE BANNER (State 1: Normal, State 2: Approaching, State 3: Almost, State 4: Your Turn) */}
        {isServing ? (
          /* STATE 4: YOUR TURN */
          <div className="p-6 sm:p-7 rounded-3xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white shadow-xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-white animate-ping" />
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-100">
                  Turn Called
                </span>
              </div>
              <span className="text-xs bg-white/20 px-2.5 py-0.5 rounded-full font-mono font-medium">
                Token #{userTokenNum}
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-2">
              It’s Your Turn!
            </h2>
            <p className="text-base text-emerald-50 mb-5 leading-relaxed">
              Please proceed immediately to <strong className="text-white underline decoration-white/60 underline-offset-4">Counter {activeUserToken.counterAssigned || 3}</strong>. The counter officer is waiting for you.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-3">
              <button
                onClick={() => setShowDirectionsModal(true)}
                className="w-full sm:w-auto px-5 py-3 bg-white text-emerald-800 hover:bg-emerald-50 font-bold rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-sm"
              >
                <Navigation className="w-4 h-4 text-emerald-700" />
                Directions to Counter {activeUserToken.counterAssigned || 3}
              </button>
              <button
                onClick={onOpenNotifications}
                className="w-full sm:w-auto px-4 py-3 bg-emerald-700/60 hover:bg-emerald-700 text-white font-medium rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-2 text-xs"
              >
                <Bell className="w-4 h-4" />
                View Announcement Log
              </button>
            </div>
          </div>
        ) : isAlmost ? (
          /* STATE 3: ALMOST YOUR TURN */
          <div className="p-6 rounded-3xl bg-gradient-to-br from-indigo-700 to-blue-800 text-white shadow-lg animate-in fade-in duration-200">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-200 mb-2">
              <AlertCircle className="w-4 h-4 text-indigo-300" />
              <span>Almost Your Turn</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-1">
              Please return to the service area!
            </h2>
            <p className="text-sm text-indigo-100 mb-4">
              Only {peopleAhead} token ahead of you. Head toward the waiting lounge now to ensure you don’t miss your call.
            </p>
            <div className="flex items-center gap-3 text-xs">
              <span className="px-2.5 py-1 rounded-md bg-white/20 font-mono">
                Counter: Counter {activeUserToken.counterAssigned || 3}
              </span>
              <span className="text-indigo-200">Estimated wait: ~{estimatedWait} min</span>
            </div>
          </div>
        ) : isApproaching ? (
          /* STATE 2: APPROACHING */
          <div className="p-6 rounded-3xl bg-amber-500 text-slate-950 shadow-lg animate-in fade-in duration-200">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-950/80 mb-2">
              <Clock className="w-4 h-4 text-amber-950" />
              <span>Approaching Soon</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-1">
              Your turn is approaching — {peopleAhead} people ahead.
            </h2>
            <p className="text-sm text-amber-950/90 mb-3">
              You still have about {estimatedWait} minutes. Wrap up what you're doing and start walking toward {currentQueue.organizationName}.
            </p>
            <div className="inline-block text-xs font-medium bg-amber-950/10 px-3 py-1 rounded-md">
              Target Counter: Counter {activeUserToken.counterAssigned || 3}
            </div>
          </div>
        ) : (
          /* STATE 1: NORMAL */
          <div className="p-6 rounded-3xl bg-slate-900 text-white shadow-md">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
                Queue Status: Active
              </span>
              <span className="text-xs font-mono text-slate-400">
                {currentQueue.activeCounters} Counters Serving
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-1">
              You're getting closer!
            </h2>
            <p className="text-sm text-slate-300">
              You have {peopleAhead} people ahead. Feel free to wait anywhere comfortable.
            </p>
          </div>
        )}

        {/* CORE STATS GRID */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
          {/* Card 1: Currently Serving */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
            <span className="text-xs font-medium text-slate-500 block mb-1">
              Current Serving
            </span>
            <div className="text-3xl sm:text-4xl font-extrabold font-mono text-slate-900 tabular-nums">
              #{currentServing}
            </div>
            <span className="text-[11px] text-slate-500 mt-1 block">
              Counter 1
            </span>
          </div>

          {/* Card 2: Your Token */}
          <div className="p-4 sm:p-5 rounded-2xl bg-blue-600 text-white shadow-sm">
            <span className="text-xs font-medium text-blue-100 block mb-1">
              Your Token
            </span>
            <div className="text-3xl sm:text-4xl font-extrabold font-mono text-white tabular-nums">
              #{userTokenNum}
            </div>
            <span className="text-[11px] text-blue-100 mt-1 block">
              For {activeUserToken.userName}
            </span>
          </div>

          {/* Card 3: People Ahead */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
            <span className="text-xs font-medium text-slate-500 block mb-1">
              People Ahead
            </span>
            <div className="text-3xl sm:text-4xl font-extrabold font-mono text-amber-600 tabular-nums">
              {peopleAhead}
            </div>
            <span className="text-[11px] text-slate-500 mt-1 block">
              In front of you
            </span>
          </div>

          {/* Card 4: Estimated Waiting Time */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
            <span className="text-xs font-medium text-slate-500 block mb-1">
              Estimated Wait
            </span>
            <div className="text-3xl sm:text-4xl font-extrabold font-mono text-emerald-600 tabular-nums">
              {estimatedWait}m
            </div>
            <span className="text-[11px] text-slate-500 mt-1 block">
              {currentQueue.activeCounters} active counters
            </span>
          </div>
        </div>

        {/* LARGE VISUAL PROGRESS INDICATOR & TOKEN LADDER */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Queue Trajectory
              </h3>
              <p className="text-xs text-slate-500">
                Visual progress from current serving counter to your position
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-blue-600">
              {progressPercent}% Complete
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-300 rounded-full ${
                isServing
                  ? 'bg-emerald-500'
                  : isAlmost
                  ? 'bg-indigo-600'
                  : isApproaching
                  ? 'bg-amber-500'
                  : 'bg-blue-600'
              }`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* Token Chain Timeline (e.g. 42 -> 43 -> 44 -> ... -> 57) */}
          <div className="pt-2">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2 font-mono">
              <span>Token Flow:</span>
              <span>Your Goal: #{userTokenNum}</span>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
              {tokenLadder.map((token, idx) => {
                const isCurrent = token === currentServing;
                const isUser = token === userTokenNum;

                return (
                  <React.Fragment key={token}>
                    <div
                      className={`shrink-0 px-3 py-2 rounded-xl border text-center transition-all ${
                        isUser
                          ? 'bg-blue-600 text-white border-blue-600 font-bold shadow-xs'
                          : isCurrent
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-300 font-bold'
                          : 'bg-slate-50 text-slate-600 border-slate-200 font-medium'
                      }`}
                    >
                      <div className="text-[10px] uppercase tracking-wider mb-0.5">
                        {isUser ? 'You' : isCurrent ? 'Serving' : 'Next'}
                      </div>
                      <div className="text-sm font-mono tabular-nums">
                        #{token}
                      </div>
                    </div>

                    {idx < tokenLadder.length - 1 && (
                      <span className="text-slate-300 font-mono shrink-0">→</span>
                    )}
                  </React.Fragment>
                );
              })}

              {userTokenNum > endNum && (
                <>
                  <span className="text-slate-300 font-mono shrink-0">···</span>
                  <div className="shrink-0 px-3 py-2 rounded-xl border border-blue-600 bg-blue-600 text-white font-bold text-center">
                    <div className="text-[10px] uppercase tracking-wider mb-0.5">You</div>
                    <div className="text-sm font-mono tabular-nums">#{userTokenNum}</div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* PROTOTYPE DEMO SIMULATOR PANEL */}
        <div className="p-5 rounded-3xl bg-slate-900 text-white border border-slate-800 shadow-md">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-400" />
              <h3 className="text-sm font-bold text-white">
                Live Prototype Simulator
              </h3>
            </div>
            <span className="text-[11px] font-mono text-slate-400">
              Interactive Testing
            </span>
          </div>

          <p className="text-xs text-slate-400 mb-4 leading-relaxed">
            Test how QueueLess dynamically handles token advances, status changes, sound chimes, and customer notifications in real time.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <button
              onClick={simulateNextToken}
              className="py-2.5 px-3 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              Simulate Next (+1)
            </button>

            <button
              onClick={simulateJumpToApproaching}
              className="py-2.5 px-3 bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-medium rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <FastForward className="w-3.5 h-3.5" />
              Advance: 5 Ahead
            </button>

            <button
              onClick={simulateJumpToYourTurn}
              className="py-2.5 px-3 bg-slate-800 hover:bg-slate-700 text-emerald-300 text-xs font-medium rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              Trigger: Your Turn!
            </button>
          </div>
        </div>

        {/* BOTTOM ACTIONS (Leave Queue, Directions) */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <button
            onClick={() => setShowDirectionsModal(true)}
            className="w-full sm:w-auto text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white border border-slate-200 px-4 py-2.5 rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-2"
          >
            <MapPin className="w-3.5 h-3.5 text-blue-600" />
            Location & Counter Directions
          </button>

          <button
            onClick={() => setShowLeaveConfirm(true)}
            className="w-full sm:w-auto text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 px-4 py-2.5 rounded-xl transition-colors cursor-pointer"
          >
            Leave Queue / Cancel Token
          </button>
        </div>

      </div>

      {/* Leave Queue Confirmation Modal */}
      {showLeaveConfirm && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="max-w-sm w-full bg-white rounded-3xl p-6 text-center shadow-xl border border-slate-200 animate-in zoom-in-95">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">
              Leave this queue?
            </h3>
            <p className="text-xs text-slate-600 mb-6 leading-relaxed">
              If you leave, your Token #{userTokenNum} will be released. You will have to take a new token if you return.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setShowLeaveConfirm(false)}
                className="flex-1 py-2.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
              >
                Keep My Token
              </button>
              <button
                onClick={() => {
                  setShowLeaveConfirm(false);
                  leaveQueue();
                }}
                className="flex-1 py-2.5 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition-colors cursor-pointer"
              >
                Yes, Leave
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Directions Modal */}
      {showDirectionsModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-3xl p-6 shadow-xl border border-slate-200 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-600" />
                <h3 className="text-base font-bold text-slate-900">
                  Location & Counter Guide
                </h3>
              </div>
              <button
                onClick={() => setShowDirectionsModal(false)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs text-slate-600">
              <div>
                <span className="font-semibold text-slate-900 block mb-0.5">Facility:</span>
                <p>{currentQueue.organizationName} — {currentQueue.location}</p>
              </div>

              <div>
                <span className="font-semibold text-slate-900 block mb-0.5">Your Assigned Counter:</span>
                <p className="font-mono text-sm font-bold text-blue-600">
                  Counter {activeUserToken.counterAssigned || 3}
                </p>
                <p className="text-slate-500 mt-0.5">
                  Located in Wing B immediately past the main reception atrium on the right side.
                </p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="font-semibold text-slate-900 block mb-1">Waiting Tips:</span>
                <ul className="list-disc pl-4 space-y-1 text-slate-500">
                  <li>Keep phone volume unmuted to hear the chime.</li>
                  <li>Check in at Counter 3 as soon as Token #{userTokenNum} appears.</li>
                  <li>Have your ID or booking reference ready.</li>
                </ul>
              </div>
            </div>

            <button
              onClick={() => setShowDirectionsModal(false)}
              className="mt-6 w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-xs transition-colors cursor-pointer"
            >
              Got It
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
