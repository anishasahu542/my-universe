import React from 'react';
import { Play, Settings as SettingsIcon, HelpCircle, Compass, Home, Briefcase } from 'lucide-react';
import { useGameStore } from '../../store/gameStore';

export const PauseMenu: React.FC = () => {
  const gameStatus = useGameStore((s) => s.gameStatus);
  const activePanel = useGameStore((s) => s.activePanel);
  const resumeGame = useGameStore((s) => s.resumeGame);
  const openPanel = useGameStore((s) => s.openPanel);
  const returnToLanding = useGameStore((s) => s.returnToLanding);

  if (gameStatus !== 'paused' || activePanel !== null) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/75 backdrop-blur-md p-4 select-none">
      <div className="hud-panel p-6 sm:p-8 max-w-sm w-full border-cyan-400/50 text-center relative">
        {/* Anime sci-fi corner tags */}
        <div className="absolute top-2 left-2 text-[9px] font-mono text-cyan-400/60 uppercase">
          SYS::PAUSE_STATE
        </div>

        <div className="w-12 h-12 rounded-sm bg-cyan-500/10 border border-cyan-400 mx-auto flex items-center justify-center text-cyan-400 mb-3 shadow-[0_0_20px_rgba(0,240,255,0.4)]">
          <Compass className="w-6 h-6 animate-pulse" />
        </div>

        <h2 className="text-2xl font-black tracking-widest text-white font-['Orbitron'] mb-1">
          MISSION PAUSED
        </h2>
        <p className="text-xs text-gray-400 font-mono tracking-wider mb-6">
          SECTOR 01 • ORBITAL TELEMETRY SUSPENDED
        </p>

        <div className="flex flex-col gap-3">
          {/* Resume */}
          <button
            onClick={resumeGame}
            className="hud-glow-btn flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-sm font-['Orbitron'] font-bold text-xs tracking-wider uppercase text-slate-950 shadow-[0_0_20px_rgba(0,240,255,0.4)]"
          >
            <Play className="w-4 h-4 fill-slate-950" />
            <span>Resume Journey</span>
          </button>

          {/* Open Portfolio Archive */}
          <button
            onClick={() => openPanel('about')}
            className="hud-glow-btn flex items-center justify-center gap-2 py-2.5 px-4 bg-slate-900/90 border border-purple-500/50 hover:border-purple-400 rounded-sm text-xs font-mono text-purple-300 hover:text-white"
          >
            <Briefcase className="w-4 h-4 text-purple-400" />
            <span>Open Odyssey Archive</span>
          </button>

          {/* Settings */}
          <button
            onClick={() => openPanel('settings')}
            className="hud-glow-btn flex items-center justify-center gap-2 py-2.5 px-4 bg-slate-900/90 border border-slate-700 hover:border-cyan-400 rounded-sm text-xs font-mono text-gray-200 hover:text-white"
          >
            <SettingsIcon className="w-4 h-4 text-cyan-400" />
            <span>Settings & Audio</span>
          </button>

          {/* Controls */}
          <button
            onClick={() => openPanel('controls')}
            className="hud-glow-btn flex items-center justify-center gap-2 py-2.5 px-4 bg-slate-900/90 border border-slate-700 hover:border-cyan-400 rounded-sm text-xs font-mono text-gray-200 hover:text-white"
          >
            <HelpCircle className="w-4 h-4 text-cyan-400" />
            <span>Controls Guide</span>
          </button>

          {/* Return to Landing */}
          <button
            onClick={returnToLanding}
            className="hud-glow-btn flex items-center justify-center gap-2 py-2.5 px-4 bg-slate-950/80 border border-red-500/30 hover:border-red-400 rounded-sm text-xs font-mono text-red-300 hover:text-red-200 mt-2"
          >
            <Home className="w-4 h-4 text-red-400" />
            <span>Return to Landing Screen</span>
          </button>
        </div>

        <p className="mt-4 text-[10px] font-mono text-gray-500">
          PRESS [ESC] TO RESUME AT ANY TIME
        </p>
      </div>
    </div>
  );
};
