import React from 'react';
import {
  Play,
  Settings as SettingsIcon,
  HelpCircle,
  User,
  Briefcase,
  FileText,
  Send,
  Compass,
  Sparkles,
} from 'lucide-react';
import { useGameStore } from '../../store/gameStore';
import { PortfolioTab } from '../../types/game';

export const LandingScreen: React.FC = () => {
  const startGame = useGameStore((s) => s.startGame);
  const openPanel = useGameStore((s) => s.openPanel);

  const directLinks: { tab: PortfolioTab; label: string; icon: React.ReactNode; color: string }[] = [
    { tab: 'about', label: 'About Me', icon: <User className="w-4 h-4" />, color: '#00F0FF' },
    { tab: 'projects', label: 'Projects', icon: <Briefcase className="w-4 h-4" />, color: '#A855F7' },
    { tab: 'resume', label: 'Resume', icon: <FileText className="w-4 h-4" />, color: '#F59E0B' },
    { tab: 'contact', label: 'Contact', icon: <Send className="w-4 h-4" />, color: '#10B981' },
  ];

  return (
    <div className="absolute inset-0 z-30 flex flex-col justify-between p-6 sm:p-10 pointer-events-none select-none text-white">
      {/* Top Bar */}
      <div className="flex justify-between items-center w-full pointer-events-auto">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-sm bg-cyan-500/10 border border-cyan-400 flex items-center justify-center text-cyan-400 shadow-[0_0_15px_rgba(0,240,255,0.4)]">
            <Compass className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="font-['Orbitron'] font-bold text-sm tracking-wider text-cyan-300">
              PROJECT MY UNIVERSE
            </h3>
            <p className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">
              Sector 01 • Orbital Platform
            </p>
          </div>
        </div>

        {/* Top Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => openPanel('controls')}
            className="hud-glow-btn flex items-center gap-2 px-3.5 py-1.5 rounded-sm bg-slate-900/80 border border-cyan-500/30 text-xs font-mono text-cyan-300 hover:text-white"
            title="Controls & Navigation Guide"
          >
            <HelpCircle className="w-4 h-4 text-cyan-400" />
            <span className="hidden sm:inline">Controls</span>
          </button>
          <button
            onClick={() => openPanel('settings')}
            className="hud-glow-btn flex items-center gap-2 px-3.5 py-1.5 rounded-sm bg-slate-900/80 border border-cyan-500/30 text-xs font-mono text-cyan-300 hover:text-white"
            title="Settings & Audio"
          >
            <SettingsIcon className="w-4 h-4 text-cyan-400" />
            <span className="hidden sm:inline">Settings</span>
          </button>
        </div>
      </div>

      {/* Hero Center Section */}
      <div className="my-auto max-w-2xl text-left pointer-events-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/40 text-[11px] font-mono text-cyan-300 mb-4 tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>INTERACTIVE 3D ODYSSEY & CREATIVE PORTFOLIO</span>
        </div>

        <h1 className="font-['Orbitron'] text-4xl sm:text-6xl font-black tracking-tight leading-none mb-2 text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-100 to-cyan-400 drop-shadow-[0_0_35px_rgba(0,240,255,0.4)]">
          MY UNIVERSE
        </h1>

        <div className="flex items-center gap-2 mb-4 font-['Orbitron'] text-xs sm:text-sm font-bold text-cyan-300 tracking-widest uppercase">
          <span>ANISHA SAHU</span>
          <span className="text-gray-500">•</span>
          <span className="text-purple-300 font-medium">FULL-STACK & AI/ML ENGINEER</span>
        </div>

        <p className="font-['Rajdhani'] text-base sm:text-lg text-gray-300 mb-8 max-w-xl font-medium leading-relaxed">
          Embark on an interactive orbital odyssey. Pilot your exploration vessel across celestial outposts to inspect deepfake detection systems, automated content intelligence engines, and engineering telemetry.
        </p>

        {/* Start Journey Primary Button */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-8">
          <button
            onClick={startGame}
            className="hud-glow-btn group relative px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-sm font-['Orbitron'] font-bold text-sm tracking-widest uppercase text-slate-950 flex items-center justify-center gap-3 shadow-[0_0_30px_rgba(0,240,255,0.6)] hover:from-cyan-400 hover:to-blue-500 cursor-pointer"
          >
            <Play className="w-5 h-5 fill-slate-950 transition-transform group-hover:scale-125" />
            <span>Start Journey</span>
          </button>

          <div className="text-xs font-mono text-gray-400 flex items-center gap-2 px-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>WebGL 3D Engine Ready • WASD / Touch</span>
          </div>
        </div>

        {/* Direct Accessibility Navigation (Requirement: accessible without game completion) */}
        <div className="pt-4 border-t border-cyan-500/20">
          <p className="text-[11px] font-mono text-gray-400 uppercase tracking-widest mb-3">
            Direct Access (No Gameplay Required):
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {directLinks.map((item) => (
              <button
                key={item.tab}
                onClick={() => openPanel(item.tab)}
                className="hud-glow-btn flex items-center gap-2.5 px-3 py-2.5 rounded-sm bg-slate-900/80 border border-slate-700/80 hover:border-cyan-400 text-xs font-mono text-gray-200 hover:text-white text-left transition-all"
              >
                <span style={{ color: item.color }}>{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Bar: Quick Telemetry & Credits */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-2 text-[11px] font-mono text-gray-400 pointer-events-auto">
        <div>
          <span>ARCHITECTURE: REACT • R3F • THREE.JS • RAPIER • ZUSTAND</span>
        </div>
        <div className="text-cyan-400/80">
          <span>PRESS [START JOURNEY] OR USE DIRECT NAVIGATION</span>
        </div>
      </div>
    </div>
  );
};
