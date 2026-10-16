import React from 'react';
import { ShieldAlert, RotateCcw, FileText } from 'lucide-react';
import { useGameStore } from '../../store/gameStore';

export const ErrorFallback: React.FC = () => {
  const gameStatus = useGameStore((s) => s.gameStatus);
  const errorMessage = useGameStore((s) => s.errorMessage);
  const returnToLanding = useGameStore((s) => s.returnToLanding);
  const openPanel = useGameStore((s) => s.openPanel);

  if (gameStatus !== 'error') {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-lg p-6 select-none text-white">
      <div className="hud-panel p-8 max-w-md w-full border-red-500/60 text-center relative shadow-[0_0_40px_rgba(239,68,68,0.3)]">
        <div className="w-14 h-14 rounded-full bg-red-500/20 border-2 border-red-500 mx-auto flex items-center justify-center text-red-400 mb-4 animate-bounce">
          <ShieldAlert className="w-7 h-7" />
        </div>

        <h2 className="text-xl sm:text-2xl font-black text-red-400 font-['Orbitron'] mb-2 tracking-wider">
          CRITICAL SUBSYSTEM ALERT
        </h2>
        <p className="text-xs font-mono text-gray-300 mb-6 leading-relaxed">
          {errorMessage || 'A hardware graphics or shader anomaly interrupted the 3D rendering pipeline.'}
        </p>

        <div className="flex flex-col gap-3">
          <button
            onClick={returnToLanding}
            className="hud-glow-btn flex items-center justify-center gap-2 py-3 px-4 bg-red-600/40 hover:bg-red-600/60 border border-red-500 text-red-100 rounded-sm font-['Orbitron'] text-xs font-bold uppercase tracking-wider transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reboot Flight Systems</span>
          </button>

          <button
            onClick={() => openPanel('about')}
            className="hud-glow-btn flex items-center justify-center gap-2 py-2.5 px-4 bg-slate-900 border border-slate-700 hover:border-cyan-400 text-gray-200 rounded-sm text-xs font-mono transition-colors"
          >
            <FileText className="w-4 h-4 text-cyan-400" />
            <span>Open Safe Mode Archive</span>
          </button>
        </div>
      </div>
    </div>
  );
};
