import React, { useState, useEffect, useRef } from 'react';
import { 
  QrCode, 
  Camera, 
  Flashlight, 
  RotateCw, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles,
  Building2,
  HeartPulse,
  Utensils,
  Train
} from 'lucide-react';
import { useQueue } from '../context/QueueContext';

interface ScanQRViewProps {
  onQueueJoined: (queueId: string) => void;
  onNavigateToJoinForm: (queueId: string) => void;
}

export const ScanQRView: React.FC<ScanQRViewProps> = ({
  onQueueJoined,
  onNavigateToJoinForm,
}) => {
  const { queues } = useQueue();
  const [manualId, setManualId] = useState<string>('');
  const [flashlightOn, setFlashlightOn] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState<boolean>(true);
  const [scannedResult, setScannedResult] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Attempt real camera stream (graceful fallback to visual simulator)
  useEffect(() => {
    let stream: MediaStream | null = null;
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ video: { facingMode: 'environment' } })
        .then((s) => {
          stream = s;
          if (videoRef.current) {
            videoRef.current.srcObject = s;
          }
        })
        .catch(() => {
          // Camera not available or blocked in iframe sandbox - simulated UI will display perfectly
        });
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanId = manualId.trim().toUpperCase();
    const found = queues.find((q) => q.queueId.toUpperCase() === cleanId);
    if (found) {
      setScannedResult(found.queueId);
      setIsScanning(false);
      setErrorMessage(null);
    } else {
      setErrorMessage(`Queue ID "${cleanId}" not found. Try sample IDs like QH-1024, GOV-882, or CAN-304.`);
    }
  };

  const handleSimulateScan = (qId: string) => {
    setIsScanning(false);
    setScannedResult(qId);
    setErrorMessage(null);
  };

  const selectedQueueObj = queues.find((q) => q.queueId === scannedResult);

  return (
    <div className="min-h-screen bg-slate-900 text-white py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center">
      <div className="max-w-md w-full mx-auto text-center space-y-6">
        
        {/* Header */}
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-blue-400">
            Instant Check-In
          </span>
          <h1 className="text-3xl font-extrabold text-white tracking-tight mt-1 mb-2">
            Scan to Join
          </h1>
          <p className="text-sm text-slate-400">
            Point your camera at the QueueLess QR code displayed at the entrance or counter.
          </p>
        </div>

        {/* Realistic QR Viewfinder Box */}
        <div className="relative mx-auto w-72 h-72 sm:w-80 sm:h-80 bg-slate-950 rounded-3xl border border-slate-700/80 shadow-2xl overflow-hidden flex items-center justify-center">
          
          {/* Background Camera feed (or simulated geometric grid) */}
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="absolute inset-0 w-full h-full object-cover opacity-30"
          />

          {/* Subdued ambient scanning backdrop */}
          <div className="absolute inset-0 bg-radial from-transparent via-slate-950/60 to-slate-950/90 pointer-events-none" />

          {/* Reticle Viewfinder Corners */}
          <div className="absolute inset-6 sm:inset-8 pointer-events-none">
            {/* Top-left */}
            <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-blue-500 rounded-tl-xl" />
            {/* Top-right */}
            <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-blue-500 rounded-tr-xl" />
            {/* Bottom-left */}
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-blue-500 rounded-bl-xl" />
            {/* Bottom-right */}
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-blue-500 rounded-br-xl" />

            {/* Animated Laser Scanning Line */}
            {isScanning && (
              <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-blue-400 to-transparent shadow-[0_0_12px_#38bdf8] animate-bounce" />
            )}
          </div>

          {/* Center Target Indicator */}
          {isScanning ? (
            <div className="flex flex-col items-center gap-2 text-slate-400 text-xs">
              <QrCode className="w-12 h-12 text-slate-500 stroke-[1.5] animate-pulse" />
              <span className="font-mono text-[11px] text-slate-400">Align QR within frame</span>
            </div>
          ) : (
            <div className="z-10 p-5 rounded-2xl bg-slate-900/90 border border-emerald-500/50 text-center animate-in zoom-in-95">
              <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-2">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <span className="text-xs text-emerald-400 font-semibold uppercase tracking-wider">
                QR Verified!
              </span>
              <div className="text-sm font-bold text-white mt-1">
                {selectedQueueObj?.organizationName || scannedResult}
              </div>
              <div className="text-xs text-slate-400 mt-0.5">
                Queue ID: {scannedResult}
              </div>

              <div className="mt-4 flex flex-col gap-2">
                <button
                  onClick={() => onQueueJoined(scannedResult!)}
                  className="py-2 px-4 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold cursor-pointer transition-colors"
                >
                  Join Instantly (Token #{selectedQueueObj ? selectedQueueObj.lastToken + 1 : 58})
                </button>
                <button
                  onClick={() => onNavigateToJoinForm(scannedResult!)}
                  className="py-1.5 px-3 text-xs text-slate-300 hover:text-white transition-colors cursor-pointer"
                >
                  Customize Name & Party
                </button>
              </div>
            </div>
          )}

          {/* Top Controls on Viewfinder */}
          <div className="absolute top-3 inset-x-4 flex justify-between items-center z-10">
            <button
              onClick={() => setFlashlightOn(!flashlightOn)}
              className={`p-2 rounded-full backdrop-blur-md transition-colors cursor-pointer ${
                flashlightOn ? 'bg-amber-400 text-slate-950' : 'bg-slate-800/80 text-white hover:bg-slate-700'
              }`}
              title="Toggle Flashlight"
            >
              <Flashlight className="w-4 h-4" />
            </button>

            <button
              onClick={() => setIsScanning(true)}
              className="p-2 rounded-full bg-slate-800/80 text-white hover:bg-slate-700 backdrop-blur-md transition-colors cursor-pointer"
              title="Rescan"
            >
              <RotateCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Quick Simulated QR Targets for One-Tap Prototype Testing */}
        <div className="bg-slate-800/60 rounded-2xl p-4 border border-slate-700 text-left">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-blue-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Prototype Demo: Tap to simulate scanning
            </span>
            <span className="text-[10px] text-slate-400 font-mono">Instant Test</span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              onClick={() => handleSimulateScan('QH-1024')}
              className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-700/80 border border-slate-700 text-left transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-1.5 text-blue-400 font-semibold mb-0.5">
                <HeartPulse className="w-3.5 h-3.5" />
                City Care Hospital
              </div>
              <span className="text-[11px] font-mono text-slate-400">QH-1024 · OPD Wing</span>
            </button>

            <button
              onClick={() => handleSimulateScan('GOV-882')}
              className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-700/80 border border-slate-700 text-left transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-1.5 text-indigo-400 font-semibold mb-0.5">
                <Building2 className="w-3.5 h-3.5" />
                Gov Civic Center
              </div>
              <span className="text-[11px] font-mono text-slate-400">GOV-882 · ID Hall</span>
            </button>

            <button
              onClick={() => handleSimulateScan('CAN-304')}
              className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-700/80 border border-slate-700 text-left transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-1.5 text-amber-400 font-semibold mb-0.5">
                <Utensils className="w-3.5 h-3.5" />
                Central Canteen
              </div>
              <span className="text-[11px] font-mono text-slate-400">CAN-304 · Food Pickup</span>
            </button>

            <button
              onClick={() => handleSimulateScan('RLY-410')}
              className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-700/80 border border-slate-700 text-left transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-1.5 text-emerald-400 font-semibold mb-0.5">
                <Train className="w-3.5 h-3.5" />
                Railway Central
              </div>
              <span className="text-[11px] font-mono text-slate-400">RLY-410 · Platform 4</span>
            </button>
          </div>
        </div>

        {/* Manual Queue ID Section */}
        <div className="pt-2 text-left">
          <p className="text-xs text-slate-400 mb-2 font-medium">
            Can’t scan? Enter Queue ID manually
          </p>

          <form onSubmit={handleManualSubmit} className="flex gap-2">
            <input
              type="text"
              value={manualId}
              onChange={(e) => setManualId(e.target.value)}
              placeholder="e.g. QH-1024"
              className="flex-1 px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 uppercase placeholder:normal-case placeholder:font-sans placeholder:text-slate-500"
            />
            <button
              type="submit"
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
            >
              Join
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {errorMessage && (
            <div className="mt-2 text-xs text-rose-400 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
