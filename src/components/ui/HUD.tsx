import React from 'react';
import {
  Pause,
  Settings as SettingsIcon,
  Volume2,
  VolumeX,
  User,
  Briefcase,
  FileText,
  Send,
  Sparkles,
  Crosshair,
} from 'lucide-react';
import { useGameStore } from '../../store/gameStore';
import { PortfolioTab } from '../../types/game';

export const HUD: React.FC = () => {
  const gameStatus = useGameStore((s) => s.gameStatus);
  const pauseGame = useGameStore((s) => s.pauseGame);
  const openPanel = useGameStore((s) => s.openPanel);
  const settings = useGameStore((s) => s.settings);
  const updateSettings = useGameStore((s) => s.updateSettings);

  const interaction = useGameStore((s) => s.interaction);
  const progression = useGameStore((s) => s.progression);
  const playerCoords = useGameStore((s) => s.playerCoords);
  const playerSpeed = useGameStore((s) => s.playerSpeed);
  const triggerCurrentInteraction = useGameStore((s) => s.triggerCurrentInteraction);

  if (gameStatus !== 'playing') {
    return null;
  }

  const [px, py, pz] = playerCoords;

  const quickNav: { tab: PortfolioTab; label: string; icon: React.ReactNode; color: string }[] = [
    { tab: 'about', label: 'About', icon: <User className="w-3.5 h-3.5" />, color: '#00F0FF' },
    { tab: 'projects', label: 'Projects', icon: <Briefcase className="w-3.5 h-3.5" />, color: '#A855F7' },
    { tab: 'resume', label: 'Resume', icon: <FileText className="w-3.5 h-3.5" />, color: '#F59E0B' },
    { tab: 'contact', label: 'Contact', icon: <Send className="w-3.5 h-3.5" />, color: '#10B981' },
  ];

  return (
    <div className="absolute inset-0 z-20 pointer-events-none p-4 sm:p-6 flex flex-col justify-between select-none">
      {/* Top Header Row */}
      <div className="flex justify-between items-start gap-4">
        {/* Mission / Objective Card */}
        <div className="hud-panel p-3 sm:p-4 rounded-sm border-cyan-500/30 max-w-xs sm:max-w-md pointer-events-auto">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span className="text-[10px] font-mono text-cyan-300 uppercase tracking-widest">
              Sector 01 Objective
            </span>
          </div>
          <h4 className="text-xs sm:text-sm font-['Rajdhani'] font-bold text-white tracking-wide">
            {progression.currentMission}
          </h4>
          <div className="flex items-center gap-2 mt-2">
            <div className="w-24 bg-slate-900 h-1.5 rounded-full overflow-hidden border border-cyan-500/30">
              <div
                className="bg-cyan-400 h-full transition-all duration-300"
                style={{
                  width: `${(progression.discoveredIds.length / progression.totalWaypoints) * 100}%`,
                }}
              />
            </div>
            <span className="text-[10px] font-mono text-gray-400">
              {progression.discoveredIds.length} / {progression.totalWaypoints}
            </span>
          </div>
        </div>

        {/* Telemetry & Quick Action Buttons */}
        <div className="flex flex-col items-end gap-2 pointer-events-auto">
          <div className="flex items-center gap-2">
            {/* Audio Toggle Button */}
            <button
              onClick={() => updateSettings({ soundEnabled: !settings.soundEnabled })}
              className="hud-glow-btn p-2 rounded-sm bg-slate-900/80 border border-cyan-500/30 text-cyan-300 hover:text-white"
              title={settings.soundEnabled ? 'Mute Audio' : 'Unmute Audio'}
            >
              {settings.soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 text-red-400" />}
            </button>

            {/* Settings Button */}
            <button
              onClick={() => openPanel('settings')}
              className="hud-glow-btn p-2 rounded-sm bg-slate-900/80 border border-cyan-500/30 text-cyan-300 hover:text-white"
              title="Settings"
            >
              <SettingsIcon className="w-4 h-4" />
            </button>

            {/* Pause Button */}
            <button
              onClick={pauseGame}
              className="hud-glow-btn flex items-center gap-1.5 px-3 py-2 rounded-sm bg-slate-900/80 border border-cyan-500/40 text-xs font-mono text-cyan-300 hover:text-white"
              title="Pause Journey [Esc]"
            >
              <Pause className="w-4 h-4 text-cyan-400" />
              <span className="hidden sm:inline">PAUSE</span>
            </button>
          </div>

          {/* Real-time Telemetry Coordinates */}
          <div className="hud-panel px-3 py-1.5 rounded-sm border-slate-700 text-right text-[10px] font-mono text-gray-400">
            <div>
              POS: <span className="text-cyan-300 font-bold">{px.toFixed(1)}</span>,{' '}
              <span className="text-cyan-300 font-bold">{py.toFixed(1)}</span>,{' '}
              <span className="text-cyan-300 font-bold">{pz.toFixed(1)}</span>
            </div>
            <div>
              VEL: <span className="text-cyan-300 font-bold">{playerSpeed.toFixed(1)} m/s</span>
            </div>
          </div>
        </div>
      </div>

      {/* Center Reticle (Discreet anime crosshair) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-40">
        <Crosshair className="w-6 h-6 text-cyan-400" />
      </div>

      {/* Interaction Prompt (Appears dynamically when close to a waypoint) */}
      {interaction.activeTarget && (
        <div className="self-center my-auto pointer-events-auto transform transition-all duration-200 animate-bounce">
          <button
            onClick={triggerCurrentInteraction}
            className="hud-panel p-4 rounded-sm border-2 border-cyan-400 shadow-[0_0_25px_rgba(0,240,255,0.6)] flex items-center gap-3 bg-slate-950/90 text-left hover:scale-105 transition-transform cursor-pointer"
          >
            <div
              className="w-10 h-10 rounded-sm flex items-center justify-center shadow-lg"
              style={{ backgroundColor: `${interaction.activeTarget.color}25`, border: `1px solid ${interaction.activeTarget.color}` }}
            >
              <Sparkles className="w-5 h-5" style={{ color: interaction.activeTarget.color }} />
            </div>
            <div>
              <div className="text-[10px] font-mono text-cyan-300 uppercase tracking-widest flex items-center gap-1.5">
                <span className="px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-200 font-bold">
                  KEY: [E] or CLICK
                </span>
                <span>Proximity Detected ({interaction.distance.toFixed(1)}m)</span>
              </div>
              <h3 className="font-['Orbitron'] font-bold text-sm sm:text-base text-white">
                Inspect: {interaction.activeTarget.title}
              </h3>
              <p className="text-xs text-gray-300 font-['Rajdhani']">
                {interaction.activeTarget.subtitle}
              </p>
            </div>
          </button>
        </div>
      )}

      {/* Bottom Row: Direct Navigation Pills & Controls Guide */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-3 pointer-events-auto">
        {/* Direct Accessible Navigation (Always accessible during gameplay) */}
        <div className="hud-panel p-2 rounded-sm border-slate-700/80 flex items-center gap-1.5 bg-slate-950/80">
          <span className="text-[10px] font-mono text-gray-400 px-2 uppercase hidden md:inline">
            Direct Nav:
          </span>
          {quickNav.map((item) => (
            <button
              key={item.tab}
              onClick={() => openPanel(item.tab)}
              className="hud-glow-btn flex items-center gap-1.5 px-2.5 py-1.5 rounded-sm bg-slate-900/90 border border-slate-700/60 hover:border-cyan-400 text-xs font-mono text-gray-200 hover:text-white"
            >
              <span style={{ color: item.color }}>{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </div>

        {/* Controls Quick Reference Pill */}
        <div className="hud-panel px-3 py-2 rounded-sm border-slate-700/80 text-[11px] font-mono text-gray-400 bg-slate-950/80 hidden sm:flex items-center gap-2.5">
          <span><strong className="text-cyan-300">[Click Scene]</strong> Mouse-Look</span>
          <span>•</span>
          <span><strong className="text-cyan-300">[Scroll]</strong> Zoom</span>
          <span>•</span>
          <span><strong className="text-cyan-300">[WASD]</strong> Move</span>
          <span>•</span>
          <span><strong className="text-cyan-300">[Space]</strong> Jump</span>
          <span>•</span>
          <span><strong className="text-cyan-300">[E]</strong> Interact</span>
        </div>
      </div>
    </div>
  );
};
