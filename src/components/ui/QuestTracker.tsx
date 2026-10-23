import React from 'react';
import { useGameStore } from '../../store/gameStore';
import { Sparkles, Trophy, Zap, Star } from 'lucide-react';

export const QuestTracker: React.FC = () => {
  const progression = useGameStore((s) => s.progression);
  const openPanel = useGameStore((s) => s.openPanel);

  const skillsCount = progression.skillsCollected.length;
  const achievementsCount = progression.achievementsUnlocked.length;
  const discoveredCount = progression.discoveredIds.length;

  const isEndingReady = discoveredCount >= 3 || skillsCount >= 8;

  return (
    <div className="hud-panel p-3 sm:p-4 rounded-sm border-cyan-500/30 bg-slate-950/85 max-w-xs sm:max-w-sm pointer-events-auto">
      {/* Companion Luna Header */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          <div className="relative">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 block" />
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 absolute inset-0 animate-ping opacity-75" />
          </div>
          <span className="text-[10px] font-mono text-cyan-300 uppercase tracking-widest font-bold">
            COMPANION LUNA QUEST
          </span>
        </div>
        <button
          onClick={() => openPanel('about')}
          className="text-[9px] font-mono text-amber-400 hover:text-white underline cursor-pointer"
        >
          Talk to Luna
        </button>
      </div>

      {/* Quest Objective Title */}
      <h4 className="text-xs sm:text-sm font-['Rajdhani'] font-bold text-white tracking-wide leading-snug">
        {progression.currentQuest || 'Explore Planet Astra sectors and gather Anisha’s knowledge!'}
      </h4>

      {/* Quest Progress Counters */}
      <div className="grid grid-cols-3 gap-2 mt-3 pt-2 border-t border-slate-800">
        {/* Sectors Discovered */}
        <button
          onClick={() => openPanel('projects')}
          className="flex flex-col items-center p-1.5 rounded bg-slate-900/80 border border-slate-800 hover:border-cyan-500/50 cursor-pointer"
        >
          <div className="flex items-center gap-1 text-[10px] font-mono text-gray-400">
            <Sparkles className="w-3 h-3 text-cyan-400" />
            <span>Sectors</span>
          </div>
          <span className="text-xs font-mono font-bold text-white mt-0.5">
            {discoveredCount} / {progression.totalWaypoints}
          </span>
        </button>

        {/* Skills Collected */}
        <button
          onClick={() => openPanel('skills')}
          className="flex flex-col items-center p-1.5 rounded bg-slate-900/80 border border-slate-800 hover:border-purple-500/50 cursor-pointer"
        >
          <div className="flex items-center gap-1 text-[10px] font-mono text-gray-400">
            <Zap className="w-3 h-3 text-purple-400" />
            <span>Skills</span>
          </div>
          <span className="text-xs font-mono font-bold text-purple-300 mt-0.5">
            {skillsCount} / 15
          </span>
        </button>

        {/* Achievements Unlocked */}
        <button
          onClick={() => openPanel('achievements')}
          className="flex flex-col items-center p-1.5 rounded bg-slate-900/80 border border-slate-800 hover:border-amber-500/50 cursor-pointer"
        >
          <div className="flex items-center gap-1 text-[10px] font-mono text-gray-400">
            <Trophy className="w-3 h-3 text-amber-400" />
            <span>Honors</span>
          </div>
          <span className="text-xs font-mono font-bold text-amber-300 mt-0.5">
            {achievementsCount} / 5
          </span>
        </button>
      </div>

      {/* Ending Scene Unlock Banner */}
      {isEndingReady && (
        <button
          onClick={() => openPanel('ending')}
          className="w-full mt-2.5 py-1.5 px-2 rounded bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-pink-500/20 border border-cyan-400/60 text-[10px] font-mono text-cyan-200 hover:text-white flex items-center justify-center gap-1.5 cursor-pointer shadow-[0_0_10px_rgba(0,240,255,0.3)] animate-pulse"
        >
          <Star className="w-3 h-3 text-yellow-300 fill-yellow-300" />
          <span>CELESTIAL ENDING UNLOCKED &bull; VIEW FINALE</span>
        </button>
      )}
    </div>
  );
};
