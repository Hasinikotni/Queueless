import React, { useState } from 'react';
import { 
  Play, 
  RotateCcw, 
  FastForward, 
  CheckCircle2, 
  ChevronDown, 
  ChevronUp, 
  Sparkles,
  Zap,
  Info
} from 'lucide-react';
import { useQueue } from '../context/QueueContext';

interface DemoSimulationBarProps {
  isOpen: boolean;
  onToggle: () => void;
  onNavigateToQueue: () => void;
}

export const DemoSimulationBar: React.FC<DemoSimulationBarProps> = ({
  isOpen,
  onToggle,
  onNavigateToQueue,
}) => {
  const {
    activeUserToken,
    queues,
    simulateNextToken,
    simulateJumpToApproaching,
    simulateJumpToYourTurn,
    resetDemo,
  } = useQueue();

  const [minimized, setMinimized] = useState<boolean>(false);

  const activeQueue = queues.find(
    (q) => q.queueId === (activeUserToken?.queueId || 'QH-1024')
  ) || queues[0];

  const currentServing = activeQueue.currentToken;
  const userTokenNum = activeUserToken?.tokenNumber ?? 57;
  const peopleAhead = activeUserToken?.peopleAhead ?? Math.max(0, userTokenNum - currentServing);
  const estimatedWait = activeUserToken?.estimatedWaitTime ?? 15;

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-16 md:bottom-6 right-3 md:right-6 z-40 max-w-sm sm:max-w-md w-full bg-slate-900/95 text-white rounded-2xl border border-slate-700/80 shadow-2xl backdrop-blur-md overflow-hidden transition-all duration-200">
      {/* Header bar */}
      <div className="p-3.5 px-4 flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-blue-500/20 text-blue-400 flex items-center justify-center">
            <Zap className="w-3.5 h-3.5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-white">
              <span>Interactive Queue Simulator</span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 bg-blue-500/30 text-blue-300 rounded">
                Live
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              City Care Hospital (QH-1024)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setMinimized(!minimized)}
            className="p-1 text-slate-400 hover:text-white rounded transition-colors"
            title={minimized ? 'Expand' : 'Collapse'}
          >
            {minimized ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          <button
            onClick={onToggle}
            className="text-xs text-slate-400 hover:text-white px-1.5 py-0.5 rounded transition-colors"
          >
            Close
          </button>
        </div>
      </div>

      {!minimized && (
        <div className="p-4 space-y-3.5 text-xs">
          {/* Live mini stats */}
          <div className="grid grid-cols-4 gap-2 p-2.5 bg-slate-950/60 rounded-xl border border-slate-800/80 text-center">
            <div>
              <div className="text-[10px] text-slate-400">Current</div>
              <div className="text-base font-bold font-mono text-blue-400 tabular-nums">
                #{currentServing}
              </div>
            </div>
            <div>
              <div className="text-[10px] text-slate-400">Your Token</div>
              <div className="text-base font-bold font-mono text-white tabular-nums">
                #{userTokenNum}
              </div>
            </div>
            <div>
              <div className="text-[10px] text-slate-400">Ahead</div>
              <div className="text-base font-bold font-mono text-amber-400 tabular-nums">
                {peopleAhead}
              </div>
            </div>
            <div>
              <div className="text-[10px] text-slate-400">Wait</div>
              <div className="text-base font-bold font-mono text-emerald-400 tabular-nums">
                {estimatedWait}m
              </div>
            </div>
          </div>

          {/* Simulation buttons */}
          <div className="space-y-2">
            <button
              onClick={simulateNextToken}
              className="w-full py-2 px-3 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-sm"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              Simulate Next Token (+1)
            </button>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={simulateJumpToApproaching}
                className="py-1.5 px-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                title="Advance to 5 people ahead"
              >
                <FastForward className="w-3.5 h-3.5 text-amber-400" />
                Jump: 5 Ahead
              </button>

              <button
                onClick={simulateJumpToYourTurn}
                className="py-1.5 px-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                title="Trigger Your Turn (Counter 3)"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                Trigger: Your Turn
              </button>
            </div>
          </div>

          {/* Quick links & reset */}
          <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px]">
            <button
              onClick={resetDemo}
              className="text-slate-400 hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              Reset Demo
            </button>
            <button
              onClick={onNavigateToQueue}
              className="text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1 transition-colors cursor-pointer"
            >
              <Sparkles className="w-3 h-3" />
              Open Live Tracker →
            </button>
          </div>

          <div className="text-[10px] text-slate-400 flex items-start gap-1 leading-tight">
            <Info className="w-3 h-3 shrink-0 text-slate-500 mt-0.5" />
            <span>Updates synced in real-time across My Queue, Notifications, and Admin Desk.</span>
          </div>
        </div>
      )}
    </div>
  );
};
