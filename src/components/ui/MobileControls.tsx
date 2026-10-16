import React from 'react';
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight, Zap, ArrowUpCircle } from 'lucide-react';
import { useGameStore } from '../../store/gameStore';
import { useWindowDimensions } from '../../hooks/useWindowDimensions';

export const MobileControls: React.FC = () => {
  const gameStatus = useGameStore((s) => s.gameStatus);
  const activePanel = useGameStore((s) => s.activePanel);
  const setControlKey = useGameStore((s) => s.setControlKey);
  const triggerCurrentInteraction = useGameStore((s) => s.triggerCurrentInteraction);
  const hasActiveTarget = !!useGameStore((s) => s.interaction.activeTarget);
  const { isTouchDevice, isMobile } = useWindowDimensions();

  if (gameStatus !== 'playing' || activePanel !== null) {
    return null;
  }

  // Only render on mobile or touch-enabled devices
  if (!isMobile && !isTouchDevice) {
    return null;
  }

  const handleTouchStart = (key: 'forward' | 'backward' | 'left' | 'right' | 'jump' | 'sprint') => {
    setControlKey(key, true);
  };

  const handleTouchEnd = (key: 'forward' | 'backward' | 'left' | 'right' | 'jump' | 'sprint') => {
    setControlKey(key, false);
  };

  return (
    <div className="fixed inset-x-0 bottom-16 sm:bottom-20 z-30 pointer-events-none px-4 flex justify-between items-end select-none">
      {/* Left: Directional D-Pad */}
      <div className="pointer-events-auto grid grid-cols-3 gap-1.5 w-36 h-36 bg-slate-950/70 p-2 rounded-2xl border border-cyan-500/30 backdrop-blur-md">
        <div />
        <button
          onTouchStart={() => handleTouchStart('forward')}
          onTouchEnd={() => handleTouchEnd('forward')}
          onMouseDown={() => handleTouchStart('forward')}
          onMouseUp={() => handleTouchEnd('forward')}
          className="flex items-center justify-center rounded-lg bg-slate-800/80 active:bg-cyan-500/50 border border-slate-700 active:border-cyan-400 text-cyan-300"
        >
          <ChevronUp className="w-6 h-6" />
        </button>
        <div />

        <button
          onTouchStart={() => handleTouchStart('left')}
          onTouchEnd={() => handleTouchEnd('left')}
          onMouseDown={() => handleTouchStart('left')}
          onMouseUp={() => handleTouchEnd('left')}
          className="flex items-center justify-center rounded-lg bg-slate-800/80 active:bg-cyan-500/50 border border-slate-700 active:border-cyan-400 text-cyan-300"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <div className="flex items-center justify-center text-[9px] font-mono text-gray-500 uppercase">
          NAV
        </div>
        <button
          onTouchStart={() => handleTouchStart('right')}
          onTouchEnd={() => handleTouchEnd('right')}
          onMouseDown={() => handleTouchStart('right')}
          onMouseUp={() => handleTouchEnd('right')}
          className="flex items-center justify-center rounded-lg bg-slate-800/80 active:bg-cyan-500/50 border border-slate-700 active:border-cyan-400 text-cyan-300"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        <div />
        <button
          onTouchStart={() => handleTouchStart('backward')}
          onTouchEnd={() => handleTouchEnd('backward')}
          onMouseDown={() => handleTouchStart('backward')}
          onMouseUp={() => handleTouchEnd('backward')}
          className="flex items-center justify-center rounded-lg bg-slate-800/80 active:bg-cyan-500/50 border border-slate-700 active:border-cyan-400 text-cyan-300"
        >
          <ChevronDown className="w-6 h-6" />
        </button>
        <div />
      </div>

      {/* Right: Action Buttons (Jump, Sprint, Interact) */}
      <div className="pointer-events-auto flex flex-col gap-2.5 items-end">
        {/* Interact button (highlights when near waypoint) */}
        {hasActiveTarget && (
          <button
            onClick={triggerCurrentInteraction}
            className="w-16 h-16 rounded-full bg-cyan-500/30 border-2 border-cyan-400 flex flex-col items-center justify-center text-cyan-200 font-bold text-xs shadow-[0_0_20px_rgba(0,240,255,0.7)] animate-pulse"
          >
            <span>[E]</span>
            <span className="text-[9px]">ACTION</span>
          </button>
        )}

        <div className="flex gap-2">
          {/* Sprint Boost button */}
          <button
            onTouchStart={() => handleTouchStart('sprint')}
            onTouchEnd={() => handleTouchEnd('sprint')}
            onMouseDown={() => handleTouchStart('sprint')}
            onMouseUp={() => handleTouchEnd('sprint')}
            className="w-14 h-14 rounded-full bg-slate-900/80 active:bg-purple-600/50 border border-purple-500/40 text-purple-300 flex flex-col items-center justify-center backdrop-blur-md"
          >
            <Zap className="w-5 h-5" />
            <span className="text-[8px] font-mono uppercase">Boost</span>
          </button>

          {/* Jump button */}
          <button
            onTouchStart={() => handleTouchStart('jump')}
            onTouchEnd={() => handleTouchEnd('jump')}
            onMouseDown={() => handleTouchStart('jump')}
            onMouseUp={() => handleTouchEnd('jump')}
            className="w-14 h-14 rounded-full bg-slate-900/80 active:bg-cyan-500/50 border border-cyan-500/40 text-cyan-300 flex flex-col items-center justify-center backdrop-blur-md"
          >
            <ArrowUpCircle className="w-6 h-6" />
            <span className="text-[8px] font-mono uppercase">Jump</span>
          </button>
        </div>
      </div>
    </div>
  );
};
