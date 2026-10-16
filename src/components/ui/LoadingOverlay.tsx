import React from 'react';
import { useProgress } from '@react-three/drei';
import { Sparkles } from 'lucide-react';

interface LoadingOverlayProps {
  onLoaded?: () => void;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = () => {
  const { progress, active, item } = useProgress();

  if (!active && progress >= 100) {
    return null;
  }

  const roundedProgress = Math.min(100, Math.floor(progress));

  const statusText =
    roundedProgress < 30
      ? 'CALIBRATING SUB-WARP TELEMETRY...'
      : roundedProgress < 70
      ? 'STREAMING CELESTIAL ASSETS & SHADERS...'
      : roundedProgress < 100
      ? 'STABILIZING ORBITAL SECTOR 01...'
      : 'ODYSSEY MATRIX READY';

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#050711]/90 backdrop-blur-md text-white select-none pointer-events-auto">
      {/* Anime Sci-fi Hexagonal Reticle Frame */}
      <div className="hud-panel p-8 max-w-md w-11/12 border-cyan-400/40 text-center relative overflow-hidden">
        {/* Glow corner accents */}
        <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-cyan-400" />
        <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-cyan-400" />
        <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-cyan-400" />
        <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-cyan-400" />

        <div className="flex items-center justify-center gap-2 mb-3 text-cyan-400">
          <Sparkles className="w-5 h-5 animate-spin" />
          <span className="text-xs font-mono tracking-widest uppercase">
            System Initialization
          </span>
        </div>

        <h2 className="text-2xl font-black tracking-wider text-white font-['Orbitron'] mb-1">
          MY UNIVERSE
        </h2>
        <p className="text-xs text-gray-400 font-mono tracking-wider mb-6">
          MODULE 01 • PLAYABLE PORTFOLIO
        </p>

        {/* Progress Bar Container */}
        <div className="w-full bg-slate-900/80 border border-cyan-500/30 p-1 rounded-sm mb-3">
          <div
            className="h-3 bg-gradient-to-r from-cyan-500 via-sky-400 to-purple-500 transition-all duration-300 ease-out shadow-[0_0_12px_rgba(0,240,255,0.7)]"
            style={{ width: `${roundedProgress}%` }}
          />
        </div>

        {/* Telemetry info */}
        <div className="flex justify-between items-center text-xs font-mono text-cyan-300 mb-2">
          <span>{statusText}</span>
          <span className="font-bold">{roundedProgress}%</span>
        </div>

        {item && (
          <p className="text-[10px] text-gray-500 font-mono truncate max-w-full">
            Loading: {item.replace(/^.*[\\/]/, '')}
          </p>
        )}
      </div>
    </div>
  );
};
