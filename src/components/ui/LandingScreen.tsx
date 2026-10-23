import React from 'react';
import {
  Play,
  Settings as SettingsIcon,
  HelpCircle,
  User,
  Briefcase,
  FileText,
  Send,
  Sparkles,
  Zap,
  Award,
  Bot,
} from 'lucide-react';
import { useGameStore } from '../../store/gameStore';
import { PortfolioTab } from '../../types/game';

export const LandingScreen: React.FC = () => {
  const startGame = useGameStore((s) => s.startGame);
  const openPanel = useGameStore((s) => s.openPanel);

  const directLinks: { tab: PortfolioTab; label: string; desc: string; icon: React.ReactNode; color: string }[] = [
    { tab: 'projects', label: 'Projects Sector', desc: 'Cyber Colony & AI Lab', icon: <Briefcase className="w-4 h-4" />, color: '#00F0FF' },
    { tab: 'skills', label: 'Skills Runway', desc: '15 Collectible 3D Orbs', icon: <Zap className="w-4 h-4" />, color: '#A855F7' },
    { tab: 'about', label: 'About Sanctuary', desc: 'Interactive Dialogue Tree', icon: <User className="w-4 h-4" />, color: '#F59E0B' },
    { tab: 'achievements', label: 'Hall of Fame', desc: '3D Trophy & State Medals', icon: <Award className="w-4 h-4" />, color: '#EAB308' },
    { tab: 'contact', label: 'Contact Oasis', desc: 'Comms & Transmissions', icon: <Send className="w-4 h-4" />, color: '#EC4899' },
    { tab: 'resume', label: 'Official Resume', desc: 'Download Verified PDF', icon: <FileText className="w-4 h-4" />, color: '#38BDF8' },
  ];

  return (
    <div className="absolute inset-0 z-30 flex flex-col justify-between p-4 sm:p-8 pointer-events-none select-none text-white overflow-y-auto">
      {/* Top Bar */}
      <div className="flex justify-between items-center w-full pointer-events-auto">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-400 flex items-center justify-center text-cyan-400 shadow-[0_0_15px_rgba(0,240,255,0.4)]">
            <Bot className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="font-['Orbitron'] font-bold text-sm tracking-wider text-cyan-300">
              ANISHA SAHU
            </h3>
            <p className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">
              AI Engineer & Full-Stack Architect
            </p>
          </div>
        </div>

        {/* Top Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => openPanel('controls')}
            className="hud-glow-btn flex items-center gap-1.5 px-3 py-1.5 rounded-sm bg-slate-900/80 border border-cyan-500/30 text-xs font-mono text-cyan-300 hover:text-white cursor-pointer"
            title="Controls & Navigation Guide"
          >
            <HelpCircle className="w-4 h-4 text-cyan-400" />
            <span className="hidden sm:inline">Controls</span>
          </button>
          <button
            onClick={() => openPanel('settings')}
            className="hud-glow-btn flex items-center gap-1.5 px-3 py-1.5 rounded-sm bg-slate-900/80 border border-cyan-500/30 text-xs font-mono text-cyan-300 hover:text-white cursor-pointer"
            title="Settings & Audio"
          >
            <SettingsIcon className="w-4 h-4 text-cyan-400" />
            <span className="hidden sm:inline">Settings</span>
          </button>
        </div>
      </div>

      {/* Hero Center Section */}
      <div className="my-auto max-w-3xl text-left pointer-events-auto py-6">
        {/* Companion Luna Greeting Bubble (Matching Reference Image Panel 1) */}
        <div className="inline-flex items-start gap-3 p-3 sm:p-4 rounded-xl bg-slate-900/90 border border-cyan-500/50 shadow-[0_0_20px_rgba(0,240,255,0.25)] mb-6 backdrop-blur-md max-w-xl">
          <div className="w-9 h-9 rounded-full bg-cyan-400/20 border border-cyan-400 flex items-center justify-center shrink-0">
            <Sparkles className="w-4 h-4 text-cyan-300 animate-spin" style={{ animationDuration: '6s' }} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono text-cyan-300 font-bold uppercase tracking-wider">
                Companion Luna
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            </div>
            <p className="text-xs sm:text-sm font-['Rajdhani'] text-gray-200 mt-0.5 leading-relaxed">
              “Greetings traveler! Welcome to Planet Astra — Anisha’s interactive portfolio world. Walk, sprint, or jetpack across planetary highways to explore AI projects, collect skill orbs, and discover achievements!”
            </p>
          </div>
        </div>

        <h1 className="font-['Orbitron'] text-4xl sm:text-6xl font-black tracking-tight leading-none mb-3 text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-100 to-cyan-400 drop-shadow-[0_0_35px_rgba(0,240,255,0.4)]">
          MY UNIVERSE
        </h1>

        <div className="flex flex-wrap items-center gap-2 mb-4 font-['Orbitron'] text-xs sm:text-sm font-bold text-cyan-300 tracking-wider uppercase">
          <span>ANISHA SAHU</span>
          <span className="text-gray-500">•</span>
          <span className="text-purple-300">AI / ML & FULL-STACK ENGINEER</span>
          <span className="text-gray-500 hidden sm:inline">•</span>
          <span className="text-amber-300 hidden sm:inline">ODISHA SKILLS MEDALIST</span>
        </div>

        <p className="font-['Rajdhani'] text-sm sm:text-base text-gray-300 mb-6 max-w-2xl font-medium leading-relaxed">
          Step into a 3D playable planetary world. Pilot a third-person adventurer across planetary sectors, discover the AegisAI security lab, collect 15 interactive tech orbs along the crystal runway, and converse with companion Luna.
        </p>

        {/* Start Journey Primary Action */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-8">
          <button
            onClick={startGame}
            className="hud-glow-btn group relative px-8 py-4 bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 rounded-lg font-['Orbitron'] font-bold text-sm tracking-widest uppercase text-white flex items-center justify-center gap-3 shadow-[0_0_30px_rgba(0,240,255,0.6)] hover:brightness-110 cursor-pointer transform hover:scale-[1.02] transition-all"
          >
            <Play className="w-5 h-5 fill-white transition-transform group-hover:scale-125" />
            <span>START JOURNEY</span>
          </button>

          <div className="text-xs font-mono text-gray-400 flex items-center gap-2 px-1">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span>WASD + Space Jetpack • 60 FPS Rapier Physics</span>
          </div>
        </div>

        {/* Quick Island Teleport Navigation (Requirement: complete portfolio accessible without navigating 3D world) */}
        <div className="pt-4 border-t border-cyan-500/20">
          <p className="text-[11px] font-mono text-cyan-300 uppercase tracking-widest mb-3 flex items-center gap-2">
            <span>Direct Celestial Outposts:</span>
            <span className="text-gray-500 text-[10px]">(Jump directly to any section)</span>
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {directLinks.map((item) => (
              <button
                key={item.tab}
                onClick={() => openPanel(item.tab)}
                className="hud-glow-btn flex items-center gap-2.5 p-2.5 rounded-lg bg-slate-900/80 border border-slate-700/80 hover:border-cyan-400 text-left transition-all cursor-pointer group"
              >
                <div
                  className="w-8 h-8 rounded flex items-center justify-center shrink-0"
                  style={{ backgroundColor: `${item.color}20`, border: `1px solid ${item.color}50` }}
                >
                  <span style={{ color: item.color }}>{item.icon}</span>
                </div>
                <div className="min-w-0">
                  <div className="font-['Orbitron'] text-xs font-bold text-white group-hover:text-cyan-300 truncate">
                    {item.label}
                  </div>
                  <div className="text-[10px] font-mono text-gray-400 truncate">
                    {item.desc}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex justify-between items-center text-[10px] font-mono text-gray-500 pointer-events-auto pt-2 border-t border-slate-800">
        <div>&copy; 2026 Anisha Sahu • Portfolio Universe</div>
        <div>Built with React, Three.js, Rapier Physics & TailwindCSS</div>
      </div>
    </div>
  );
};
